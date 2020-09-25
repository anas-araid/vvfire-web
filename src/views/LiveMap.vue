<template>
  <md-app-content style="height:100%;border:none">
    <Dialog v-if="this.message.active" :data="this.message"></Dialog>
    <div v-if="!this.loading">
      <span class="md-display-1">{{this.currentRicercaPersona.name}}</span>
      <br><br>
      <!-- LISTA MAPPA-->
      <md-card class="md-layout-item md-size-100 md-small-size-100" >
        <md-card-actions md-alignment="left">
          <md-button class="style-red-text" @click="router.push({name: 'Missioni', params: {idRicerca: idRicerca}})">INDIETRO</md-button>
        </md-card-actions>
        <md-divider class="md-inset"></md-divider>
        <md-card-header style="text-align:left">
          <div class="md-title">Ultime posizioni</div>
          <br>
          Negli ultimi <input type="range" v-model.number="filtroMinuti" min="5" max="30" style="outline:none"> {{filtroMinuti}} minuti
        </md-card-header>
        <md-card-content>
          <l-map :center="map.center" :zoom="map.zoom" :v-resize="onResize" style="min-height:600px">
            <l-tile-layer
              :url="map.url"
            />
            <div v-if="this.posizioni != []" >
              <div v-for="posizione in this.posizioni" :key="posizione.id">
                <l-marker :lat-lng="[posizione.latitude, posizione.longitude]">
                  <l-popup>
                    <div>
                      Vigile: {{posizione.firemanName}}
                      <br>
                      Numero di telefono: {{posizione.firemanPhone}}
                      <br>
                      {{moment(posizione.date).locale('it').fromNow() }}
                    </div>
                  </l-popup>
                </l-marker>
              </div>
            </div>
          </l-map>
        </md-card-content>
      </md-card>
      <br>
    </div>
    <div v-else>
      <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
    </div>
  </md-app-content>
</template>

<script>
  import loginController from '../controllers/loginController.js';
  import ricercapersonaController from '../controllers/ricercapersonaController.js';
  import positionController from '../controllers/posizioniController.js';
  import vigileController from '../controllers/vigileController.js';
  import DialogAlert from '../components/Dialog.vue'; 
  import router from '../router/index.js';
  import moment from 'moment'; 
  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';

  export default {
    name: 'LiveMap',
    data: function (){
      return {
        showNavigation: false,
        message: {'active': false, 'content': null, 'url': null},
        loading: true,
        errored: false,
        idRicerca: null,
        posizioni: [],
        moment: moment,
        router: router,
        filtroMinuti: 5,
        currentRicercaPersona: null,
        trentoLatLng: [46.074779,11.121749],
        map: {
          zoom: 11.2,
          center:  [46.074779,11.121749],
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        }
      }
    },
    components: {
      'Dialog': DialogAlert,
      LMap,
      LTileLayer,
      LPopup,
      LMarker
    },
    mounted(){
      console.log(L);
      this.idRicerca = this.$route.params.idRicerca;
    },
    beforeCreate(){
      this.idRicerca = this.$route.params.idRicerca;
      let idRicerca = this.idRicerca;
      if (!isFinite(String(this.idRicerca))){
        router.push({name: 'RicercaPersona'});
      }
      let idCorpo = loginController.getCorpoVVFData()['id'];
      ricercapersonaController.getRicercaByID(idRicerca, idCorpo).then((response) => {
        let raw = response.data[0];
        if (!raw.error){
            this.datiPresenti = true;
            this.currentRicercaPersona = raw.ricerca;
            this.loading = false;
            this.getLatestPositions(idRicerca);
        }else{
          switch(raw['error']){
            case '401':
              this.errored = true;
              this.dialog('Errore', 'Accesso non autorizzato, non puoi a visualizzare questa pagina', '#/dashboard');
              break; 
            case '404':
              this.datiPresenti = false;
              break;
          }
        }
      });
    },
    watch: {
      filtroMinuti: function (){
        this.getLatestPositions(this.idRicerca);
      }
    },
    methods: {
      getRicerca(idRicerca, idCorpo){
        this.loading = true;
        ricercapersonaController.getRicercaByID(idRicerca, idCorpo).then((response) => {
          let raw = response.data[0];
          if (!raw.error){
            this.datiPresenti = true;
            this.currentRicercaPersona = raw.ricerca;
          }else{
            switch(raw['error']){
              case '401':
                this.errored = true;
                this.dialog('Errore', 'Non sei autorizzato a visualizzare questa ricerca persona', '#/ricercapersona');
                break; 
              case '404':
                this.datiPresenti = false;
                break;
            }
          }
          this.loading = false;
        }, (error) => {
          this.errored= true;
          console.log(error)
          this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona');
          this.loading = false;
        });
      },
      getLatestPositions(idRicerca){
        this.posizioni = [];
        let time = moment().subtract(this.filtroMinuti, 'minutes').format();
        positionController.getLatestUniquePosition(idRicerca, time).then((response) => {
          let rawPositions = response.data;
          if (rawPositions != []){
            for (let i = 0; i < rawPositions.length; i++){
              let idVigile = rawPositions[i].fkVigile;
              vigileController.getVigileByID(idVigile).then( (vigileResponse) => {
                let rawVigile = vigileResponse.data[0];
                let currentPosition = [];
                currentPosition.id = rawPositions[i].id;
                currentPosition.latitude = rawPositions[i].latitude;
                currentPosition.longitude = rawPositions[i].longitude;
                currentPosition.date = rawPositions[i].date;
                if (!rawVigile.error){
                  let currentVigile = rawVigile.vigile[0];
                  currentPosition.firemanName = currentVigile.name + ' ' + currentVigile.surname;
                  currentPosition.firemanPhone = currentVigile.phone;
                }else{
                  currentPosition.firemanName = 'Sconosciuto';
                  currentPosition.firemanPhone = 'Sconosciuto';
                }
                this.posizioni.push(currentPosition);
              });
            }
          }
        });
      },
      dialog(title, message, url){
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;    
        this.message.active = true;
      },
      onResize() {
        this.$refs.map[0].mapObject._onResize();
      }
    }
  }
</script>
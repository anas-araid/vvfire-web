<template>
  <md-app-content style="height:100%;border:none">
    <Dialog v-if="this.message.active" :data="this.message"></Dialog>
    <div v-if="!this.loading && this.datiPresenti">
      <span class="md-display-1">{{this.currentMissione.name}}</span>
      <br><br>
      <!-- LISTA MAPPA-->
      <md-card class="md-layout-item md-size-100 md-small-size-100" >
        <md-card-actions md-alignment="left">
          <md-button class="style-red-text" @click="router.push({name: 'Missione', params: {idRicerca: this.currentMissione.fkRicerca}})">INDIETRO</md-button>
        </md-card-actions>
        <md-divider class="md-inset"></md-divider>
        <md-card-header style="text-align:left">
          <div class="md-title">Mappa Live</div>
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
      <!-- LISTA VIGILI-->
      <md-card class="md-layout-item md-size-100 md-small-size-100" >
        <md-card-header style="text-align:left">
          <div class="md-title">Lista vigili presenti</div>
        </md-card-header>
        <md-card-content>
        </md-card-content>
      </md-card>
    </div>
    <div v-else>
      <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
    </div>
  </md-app-content>
</template>

<script>
  import loginController from '../controllers/loginController.js';
  import positionController from '../controllers/posizioniController.js';
  import vigileController from '../controllers/vigileController.js';
  import missioniController from '../controllers/missioniController.js';
  import DialogAlert from '../components/Dialog.vue'; 
  import router from '../router/index.js';
  import moment from 'moment'; 
  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';

  export default {
    name: 'DettagliMissione',
    data: function (){
      return {
        showNavigation: false,
        message: {'active': false, 'content': null, 'url': null},
        loading: true,
        errored: false,
        datiPresenti: false,
        idMissione: null,
        posizioni: [],
        moment: moment,
        currentMissione: [],
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
    },
    beforeCreate(){
      this.idMissione = this.$route.params.idMissione;
      let idMissione = this.idMissione;
      if (!isFinite(String(this.idMissione))){
        router.push({name: 'RicercaPersona'});
      }
      let idCorpo = loginController.getCorpoVVFData()['id'];
      missioniController.getMissioneById(idMissione, idCorpo).then((response) => {
        let raw = response.data[0];
        console.log(raw);
        if (!raw.error){
            this.datiPresenti = true;
            this.currentMissione = raw.missione;
            console.log(this.currentMissione)
            this.loading = false;
            this.getPosizioniByMissione(idMissione);
        }else{
          switch(raw['error']){
            case '401':
              this.errored = true;
              this.dialog('Errore', 'Accesso non autorizzato, non puoi a visualizzare questa pagina', '#/dashboard');
              break; 
            case '404':
              this.datiPresenti = false;
              this.dialog('Errore', 'Impossibile trovare la missione selezionata', '#/ricercapersona');
              break;
          }
        }
      });
    },
    methods: {
      getPosizioniByMissione(idMissione){
        positionController.getPosizioniByMissione(idMissione).then((response) => {
          let rawPositions = response.data[0].posizioni;
          console.log(response);
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
          console.log(this.posizioni);
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
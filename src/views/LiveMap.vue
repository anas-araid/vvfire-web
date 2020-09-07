<template>
  <md-app-content style="height:100%;border:none">
    <Dialog v-if="this.message.active" :data="this.message"></Dialog>
    <div v-if="!this.loading">
      <span class="md-display-1">{{this.currentRicercaPersona.name}}</span>
      <br><br>
      <!-- LISTA MAPPA-->
      <md-card class="md-layout-item md-size-100 md-small-size-100" >
        <md-card-header style="text-align:left">
          <div class="md-title">Mappa Live</div>
        </md-card-header>
        <md-card-content>
          <l-map :center="map.center" :zoom="map.zoom" style="min-height:600px">
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
  import ricercapersonaController from '../controllers/ricercapersonaController.js';
  import positionController from '../controllers/posizioniController.js';
  import vigileController from '../controllers/vigileController.js';
  import DialogAlert from '../components/Dialog.vue'; 
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
      let idCorpo = loginController.getCorpoVVFData()['id'];
      this.idRicerca = this.$route.params.idRicerca;
      this.getRicerca(this.idRicerca, idCorpo);
      this.getLatestPositions(this.idRicerca);
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
        let time = moment().subtract(18000, 'minutes').format();
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
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      }
    }
  }
</script>
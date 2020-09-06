<template>
  <md-app-content style="height:100%;border:none">
    <Dialog v-if="this.message.active" :data="this.message"></Dialog>
    <div v-if="!this.loading">
      <span class="md-display-1">{{this.currentRicercaPersona.name}}</span>
      <br>
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
            <l-marker :lat-lng="trentoLatLng">
              <l-popup>
                <div>
                  Trento
                </div>
              </l-popup>
            </l-marker>
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
  import DialogAlert from '../components/Dialog.vue'; 

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
      console.log(this.map)
      console.log(L);
      console.log(L.latLng(this.trentoLatLng))
      let idCorpo = loginController.getCorpoVVFData()['id'];
      let idRicerca = this.$route.params.idRicerca;
      this.getRicerca(idRicerca, idCorpo);
    },
    methods: {
      getRicerca(idRicerca, idCorpo){
        this.loading = true;
        ricercapersonaController.getRicercaByID(idRicerca, idCorpo).then((response) => {
          let raw = response.data[0];
          if (!raw.error){
            this.datiPresenti = true;
            this.currentRicercaPersona = raw.ricerca;
            console.log(this.currentRicercaPersona);
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
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      }
    }
  }
</script>
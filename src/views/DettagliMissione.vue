<template>
  <md-app-content style="height:100%;border:none">
    <Dialog v-if="this.message.active" :data="this.message"></Dialog>
    <div v-if="!this.loading && this.datiPresenti">
      <span class="md-display-1">{{this.currentMissione.name}}</span>
      <br><br>
      <!-- LISTA MAPPA-->
      <md-card class="md-layout-item md-size-100 md-small-size-100" >
        <md-progress-bar v-if="this.updating" class="md-accent" md-mode="indeterminate"></md-progress-bar>
        <md-card-actions md-alignment="left">
          <md-button class="style-blue-text" @click="router.push({name: 'Missioni', params: {idRicerca: currentMissione.fkRicerca}})">INDIETRO</md-button>
          <md-button class="style-red-text" @click="updateData()">AGGIORNA</md-button>
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
            <div v-if="this.groupPositions.length !== 0" >
              <div v-for="traccia in this.groupPositions" :key="traccia[0].id">
                <l-marker :lat-lng="traccia[1].latLng[0]">
                  <l-popup>
                    <div>
                      Vigile: {{traccia[2].data.firemanName}}
                      <br>
                      Numero di telefono: {{traccia[2].data.firemanPhone}}
                      <br>
                    </div>
                  </l-popup>
                </l-marker>
                
                <l-marker :lat-lng="traccia[1].latLng[ traccia[1].latLng.length -1 ]">
                  <l-popup>
                    <div>
                      Vigile: {{traccia[2].data.firemanName}}
                      <br>
                      Numero di telefono: {{traccia[2].data.firemanPhone}}
                      <br>
                    </div>
                  </l-popup>
                </l-marker>
                
                <l-polyline
                  :lat-lngs="traccia[1].latLng"
                  :color="randomColor({luminosity: 'bright', format:'rgb'})"
                  style="weight:5"
                >
                  <l-popup>
                    <div>
                      Vigile: {{traccia[2].data.firemanName}}
                      <br>
                      Numero di telefono: {{traccia[2].data.firemanPhone}}
                      <br>
                    </div>
                  </l-popup>
                </l-polyline>
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
  import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from 'vue2-leaflet';
  import randomColor from 'randomcolor'; 

  export default {
    name: 'DettagliMissione',
    data: function (){
      return {
        showNavigation: false,
        message: {'active': false, 'content': null, 'url': null},
        loading: true,
        updating: false,
        errored: false,
        datiPresenti: false,
        idMissione: null,
        posizioni: [],
        moment: moment,
        router: router,
        randomColor: randomColor,
        currentMissione: [],
        groupPositions: [],
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
      LMarker,
      LPolyline
    },
    mounted(){
      console.log(L);
      let idCorpo = loginController.getCorpoVVFData()['id'];
      let idMissione = this.$route.params.idMissione;
      this.idMissione = this.$route.params.idMissione;
      missioniController.getMissioneById(idMissione, idCorpo).then((response) => {
        let raw = response.data[0];
        if (!raw.error){
            this.datiPresenti = true;
            this.currentMissione = raw.missione;
            this.getPosizioniByMissione(idMissione);
            this.loading = false;
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
    beforeCreate(){
      this.idMissione = this.$route.params.idMissione;
      if (!isFinite(String(this.idMissione))){
        router.push({name: 'RicercaPersona'});
      }
    },
    watch: {
      posizioni: function(){
        this.groupPosizionByVigile(this.posizioni);
      }
    },
    methods: {
      getPosizioniByMissione(idMissione){
        positionController.getPosizioniByMissione(idMissione).then((response) => {
          let rawPositions = response.data[0].posizioni;
          let tempPositions = [];
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
                currentPosition.fkVigile = rawPositions[i].fkVigile;
                if (!rawVigile.error){
                  let currentVigile = rawVigile.vigile[0];
                  currentPosition.firemanName = currentVigile.name + ' ' + currentVigile.surname;
                  currentPosition.firemanPhone = currentVigile.phone;
                }else{
                  currentPosition.firemanName = 'Sconosciuto';
                  currentPosition.firemanPhone = 'Sconosciuto';
                }
                tempPositions.push(currentPosition);
              });
            }
          }
          this.posizioni = tempPositions;
          this.updating = false;
        });
      },
      groupPosizionByVigile(rawPositions){
        let groupPos = [];
        for (let i=0; i < rawPositions.length; i++){
          let posizione = rawPositions[i];
          let posData = [];
          posData.firemanName = posizione.firemanName;
          posData.firemanPhone = posizione.firemanPhone;
          posData.fkVigile = posizione.fkVigile;
          posData.id = posizione.id;
          if (i !== 0){
            let exists = groupPos.some(function(el) {
              return el[0].id === posData.fkVigile;
            });
            if (exists){
              let index = groupPos.map(function(x) {return x[0].id; }).indexOf(posData.fkVigile);
              if (index !== -1){
                groupPos[index][1].latLng.push([posizione.latitude, posizione.longitude])
              }
            }else{
              groupPos.push([{id: posizione.fkVigile}, {latLng: [[posizione.latitude, posizione.longitude]]}, {data: posData}]);
            }
          }else{
            groupPos.push([{id: posizione.fkVigile}, {latLng: [[posizione.latitude, posizione.longitude]]}, {data: posData}]);
          }
        }
        this.groupPositions = groupPos;
      },
      dialog(title, message, url){
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;    
        this.message.active = true;
      },
      onResize() {
        this.$refs.map[0].mapObject._onResize();
      },
      updateData(){
        this.updating = true;
        this.posizioni = [];
        this.getPosizioniByMissione(this.idMissione);
        // aggiorna lista vigili
      }
    }
  }
</script>
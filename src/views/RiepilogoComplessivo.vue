<template>
  <md-app-content style="height:100%;border:none">
    <Dialog v-if="this.message.active" :data="this.message"></Dialog>
    <div v-if="!this.loading">
      <span class="md-display-1">Riepilogo complessivo</span>
      <br>
      <span class="md-subheading" v-if="this.allMissioni.length !== 0">dal {{ this.allMissioni[0][0] }} al {{ this.allMissioni[this.allMissioni.length -1][0] }}</span>
      <br><br>
      <!-- LISTA MAPPA-->
      <md-card class="md-layout-item md-size-100 md-small-size-100" >
        <md-progress-bar v-if="this.updating" class="md-accent" md-mode="indeterminate"></md-progress-bar>
        <md-card-actions md-alignment="left">
          <md-button class="style-blue-text" @click="router.push({name: 'Missioni', params: {idRicerca: $route.params.idRicerca}})">INDIETRO</md-button>
          <md-button class="style-red-text" @click="updateData()">AGGIORNA</md-button>
        </md-card-actions>
        <md-divider class="md-inset"></md-divider>
        <md-card-header style="text-align:left">
          <div class="md-title">Mappa</div>
        </md-card-header>
        <md-card-content>
          <l-map :center="map.center" :zoom="map.zoom" :v-resize="onResize" style="min-height:600px">
            <l-tile-layer
              :url="map.url"
            />
            <div v-if="this.groupPositions.length !== 0" >
              <div v-for="(missionTraces, index) in this.groupPositions" :key="index">
                <div v-for="traccia in missionTraces" :key="traccia[0].id">
                  <l-marker :lat-lng="traccia[1].latLng[0]">
                    <l-popup>
                      <div>
                        Vigile: {{traccia[2].data[0].firemanName + ' ' + traccia[2].data[0].firemanSurname}}
                        <br>
                        Numero di telefono: {{traccia[2].data[0].firemanPhone}}
                        <br>
                      </div>
                    </l-popup>
                  </l-marker>
                  
                  <l-marker :lat-lng="traccia[1].latLng[ traccia[1].latLng.length -1 ]">
                    <l-popup>
                      <div>
                        Vigile: {{traccia[2].data[0].firemanName + ' ' + traccia[2].data[0].firemanSurname}}
                        <br>
                        Numero di telefono: {{traccia[2].data[0].firemanPhone}}
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
                        Vigile: {{traccia[2].data[0].firemanName + ' ' + traccia[2].data[0].firemanSurname}}
                        <br>
                        Numero di telefono: {{traccia[2].data[0].firemanPhone}}
                        <br>
                      </div>
                    </l-popup>
                  </l-polyline>
                </div>
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
  //import positionController from '../controllers/posizioniController.js';
  //import vigileController from '../controllers/vigileController.js';
  import missioniController from '../controllers/missioniController.js';
  import DialogAlert from '../components/Dialog.vue'; 
  import router from '../router/index.js';
  import moment from 'moment'; 
  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from 'vue2-leaflet';
  import randomColor from 'randomcolor'; 

  export default {
    name: 'RiepilogoComplessivo',
    data: function (){
      return {
        showNavigation: false,
        message: {'active': false, 'content': null, 'url': null},
        loading: true,
        updating: false,
        errored: false,
        datiPresenti: false,
        allMissioni: null,
        posizioni: [],
        moment: moment,
        router: router,
        randomColor: randomColor,
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
      this.allMissioni = this.$route.params.missioni;
      this.loading = true;
      this.updating = true;
      let allMissioni = this.$route.params.missioni;
      for (let j=0; j < allMissioni.length; j++){
        let missionData = allMissioni[j][1].data;
        for (let i=0; i<missionData.length; i++){
          //this.getPosizioniByMissione(missionData[i].id);
          this.getRiepilogoMissione(missionData[i].id);
        }
      }
      this.loading = false;
    },
    methods: {
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
        this.posizioni = [];
        this.updating = true;
        let allMissioni = this.$route.params.missioni;
        for (let j=0; j < allMissioni.length; j++){
          let missionData = allMissioni[j][1].data;
          for (let i=0; i<missionData.length; i++){
            this.getRiepilogoMissione(missionData[i].id);
          }
        }
      },
      // getRiepilogoMissione sostituisce getPosizioniByMissione e groupPosizionByVigile
      // tutte le operazioni che svolgevano queste funzioni, ora sono eseguite server-side
      // in questo modo è migliorata la velocità e la stabilità dell'app
      getRiepilogoMissione(idMissione){
        missioniController.getRiepilogoMissione(idMissione).then((response) => {
          let raw = response.data[0];
          this.groupPositions.push(raw.data);
          this.updating = false;
        });
      }
      /*,
      getPosizioniByMissione(idMissione){
        positionController.getPosizioniByMissione(idMissione).then((response) => {
          let rawPositions = response.data[0].posizioni;
          let tempPositions = [];
          if (rawPositions.length !== 0){
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
                  currentPosition.firemanName = currentVigile.name;
                  currentPosition.firemanSurname = currentVigile.surname;
                  currentPosition.firemanPhone = currentVigile.phone;
                }else{
                  currentPosition.firemanName = 'Sconosciuto';
                  currentPosition.firemanSurname = 'Sconosciuto';
                  currentPosition.firemanPhone = 'Sconosciuto';
                }
                tempPositions.push(currentPosition);
              });
            }
          }
          this.posizioni.push(tempPositions);
          this.updating = false;
        });
      },
      groupPosizionByVigile(allPositions){
        this.groupPositions = [];
        for (let j=0; j < allPositions.length; j++){
          let rawPositions = allPositions[j];
          let groupPos = [];
          for (let i=0; i < rawPositions.length; i++){
            let posizione = rawPositions[i];
            let posData = [];
            posData.firemanName = posizione.firemanName;
            posData.firemanSurname = posizione.firemanSurname;
            posData.firemanPhone = posizione.firemanPhone;
            posData.fkVigile = posizione.fkVigile;
            posData.id = posizione.id;
            posData.traceColor = this.randomColor({luminosity: 'bright', format:'rgb'});
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
          this.groupPositions.push(groupPos);
          console.log(this.groupPositions);
        }
      },*/
    }
  }
</script>
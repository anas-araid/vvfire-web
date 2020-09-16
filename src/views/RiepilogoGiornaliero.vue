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
                      Vigile: {{traccia[2].data.firemanName + ' ' + traccia[2].data.firemanSurname}}
                      <br>
                      Numero di telefono: {{traccia[2].data.firemanPhone}}
                      <br>
                    </div>
                  </l-popup>
                </l-marker>
                
                <l-marker :lat-lng="traccia[1].latLng[ traccia[1].latLng.length -1 ]">
                  <l-popup>
                    <div>
                      Vigile: {{traccia[2].data.firemanName + ' ' + traccia[2].data.firemanSurname}}
                      <br>
                      Numero di telefono: {{traccia[2].data.firemanPhone}}
                      <br>
                    </div>
                  </l-popup>
                </l-marker>
                
                <l-polyline
                  :lat-lngs="traccia[1].latLng"
                  :color="traccia[2].data.traceColor"
                  style="weight:5"
                >
                  <l-popup>
                    <div>
                      Vigile: {{traccia[2].data.firemanName + ' ' + traccia[2].data.firemanSurname}}
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
        <md-progress-bar v-if="this.updating" class="md-accent" md-mode="indeterminate"></md-progress-bar>
        <md-card-header style="text-align:left">
          <div class="md-title">Lista vigili presenti</div>
        </md-card-header>
        <md-card-content>
          <div v-if="this.groupPositions.length !== 0">
            <div style="overflow-x:auto">
              <md-table>
                <md-table-row>
                  <md-table-head class="style-table-header">NOME</md-table-head>
                  <md-table-head class="style-table-header">COGNOME</md-table-head>
                  <md-table-head class="style-table-header">NUMERO DI TELEFONO</md-table-head>
                </md-table-row>
                <md-table-row v-for="group in this.groupPositions" :key="group[2].data.id">
                  <md-table-head md-label="name">{{group[2].data.firemanName}}</md-table-head>
                  <md-table-head md-label="surname">{{group[2].data.firemanSurname}}</md-table-head>
                  <md-table-head md-label="phone">{{group[2].data.firemanPhone}}</md-table-head>
                  <md-table-head md-label="mostra"><a @click="map.center = group[1].latLng[0];">MOSTRA IN MAPPA</a></md-table-head>
                </md-table-row>
              </md-table>
            </div>
          </div>
          <div v-else>
            <md-empty-state
              md-rounded
              md-icon="search_off"
              md-label=""
              md-description="Non c'è nessun vigile che partecipa a questa missione.">
            </md-empty-state>
          </div>
        </md-card-content>
      </md-card>
    </div>
    <div v-else>
      <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
    </div>
  </md-app-content>
</template>

<script>
  import positionController from '../controllers/posizioniController.js';
  import vigileController from '../controllers/vigileController.js';
  import DialogAlert from '../components/Dialog.vue'; 
  import router from '../router/index.js';
  import moment from 'moment'; 
  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from 'vue2-leaflet';
  import randomColor from 'randomcolor'; 

  export default {
    name: 'RiepilogoGiornaliero',
    data: function (){
      return {
        showNavigation: false,
        message: {'active': false, 'content': null, 'url': null},
        loading: true,
        updating: false,
        errored: false,
        datiPresenti: false,
        dailyMissioni: null,
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
      let dailyMissioni = this.$route.params.missioni;
      this.dailyMissioni = this.$route.params.missioni;
      this.loading = true;
      this.updating = true;
      let missionData = dailyMissioni[1].data
      for (let i=0; i<missionData.length; i++){
        this.getPosizioniByMissione(missionData[i].id);
      }
      this.loading = false;
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
          console.log(tempPositions)
          console.log(this.posizioni)
          this.updating = false;
        });
      },
      groupPosizionByVigile(allPositions){
        console.log(allPositions.length);
        console.log(allPositions);
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
          console.log(this.groupPositions)
        }
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
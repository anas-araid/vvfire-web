<template>
  <md-app-content style="height:100%;border:none">
      <div class="md-layout md-alignment-center-center">
        <!-- Componente per aggiungere una nuova ricerca persona -->
        <nuovaMissioneDialog  
          v-if="this.newMissione" 
          :active="this.newMissione" 
          @missioneDialogClosed="closeNewMissione"
          @createNuovaMissione="createNewMissione"
        ></nuovaMissioneDialog>
        <!-- Componente per aggiornare il nome di una ricerca persona -->
        <updateMissioneDialog  
          v-if="this.updateDataDialog.active" 
          :data="this.updateDataDialog" 
          @updateMissioneDialogClosed="closeUpdateMissione"
          @updateMissione="updateMissione"
        ></updateMissioneDialog>
        <!-- Componente per rimuovere il nome di una ricerca persona -->
        <deleteMissioneDialog  
          v-if="this.deleteDataDialog.active" 
          :data="this.deleteDataDialog" 
          @deleteMissione="deleteMissione"
        ></deleteMissioneDialog>
        <!-- Componente per eseguire alert specifici -->
        <Dialog v-if="this.message.active" :data="this.message"></Dialog>
        <md-card style="overflow-x:auto" v-if="!this.loading">
          <md-card-content>
            <div v-if="this.allMissioni.length !== 0 && !this.errored" style="overflow-x:auto">
              <md-table>
                <md-table-toolbar>
                  <h1 class="md-title">Lista missioni</h1>
                </md-table-toolbar>
                <md-table-row>
                  <md-table-head class="style-table-header">NOME MISSIONE</md-table-head>
                  <md-table-head class="style-table-header">INIZIO</md-table-head>
                  <md-table-head class="style-table-header">FINE</md-table-head>
                  <md-table-head class="style-table-header">STATO</md-table-head>
                  <md-table-head class="style-table-header"></md-table-head>
                  <md-table-head class="style-table-header"></md-table-head>
                  <md-table-head class="style-table-header"></md-table-head>
                </md-table-row>
                <md-table-row v-for="missione in this.allMissioni" :key="missione.id">
                  <md-table-head md-label="name">{{missione.name}}</md-table-head>
                  <md-table-head md-label="startTime">
                    {{moment(missione.startTime).locale('it').format('LLL') }}
                  </md-table-head>
                  <md-table-head md-label="endTime">
                    {{ (missione.completed) ? moment(missione.endTime).locale('it').format('LLL') : '-'}}
                  </md-table-head>
                  <md-table-head md-label="completed">{{missione.completed ? 'COMPLETATO' : 'IN CORSO...'}}</md-table-head>
                  <md-table-head md-label="mostra"><a @click="router.push({name:'LiveMap', params: {idMissione: missione.id}})">MOSTRA</a></md-table-head>
                  <md-table-head md-label="modifica"><a @click="openModificaMissione(missione.id, missione.name)">MODIFICA</a></md-table-head>
                  <md-table-head md-label="elimina"><a class="style-red-text" @click="alertDeleteMissione(missione.id)">RIMUOVI</a></md-table-head>
                </md-table-row>
              </md-table>
            </div>
            <div v-else-if="this.errored" style="text-align:center">
              <h3>Errore</h3>
            </div>
            <div v-else-if="!this.datiPresenti" style="text-align:center">
              <h3>Dati non presenti</h3>
            </div>
          </md-card-content>
        </md-card>
        <div v-else>
          <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
        </div>
      </div>
    <md-button class="md-fab md-fab-bottom-right" @click="openNewMissione()" :disabled="this.loading">
      <md-icon>add</md-icon>
    </md-button>
    <br>
  </md-app-content>
</template>

<script>
  import DialogAlert from '../components/Dialog.vue'; 
  import nuovaMissioneDialog from '../components/missioni/nuovaMissioneDialog.vue'; 
  import deleteMissioneDialog from '../components/missioni/deleteMissioneDialog.vue'; 
  import updateMissioneDialog from '../components/missioni/updateMissioneDialog.vue'; 
  import missioniController from '../controllers/missioniController.js';
  import ricercapersonaController from '../controllers/ricercapersonaController.js';
  import loginController from '../controllers/loginController.js';
  import router from '../router/index.js';
  import moment from 'moment'; 

  export default {
    name: 'Missioni',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null, 'url': null},
      deleteDataDialog: {'active': false, 'idMissione': null},
      updateDataDialog: {'active': false, 'idMissione': null, 'nameMissione': null},
      datiPresenti: false,
      allMissioni: [],
      errored: false,
      moment: moment,
      newMissione: false,
      router: router
    }),
    components: {
      'Dialog': DialogAlert,
      'nuovaMissioneDialog': nuovaMissioneDialog,
      'updateMissioneDialog': updateMissioneDialog,
      'deleteMissioneDialog': deleteMissioneDialog
    },
    mounted(){
      this.fetchMissioni();
    },
    beforeCreate(){
      this.idRicerca = this.$route.params.idRicerca;
      if (!isFinite(String(this.idRicerca))){
        router.push({name: 'RicercaPersona'});
      }
      let idCorpo = loginController.getCorpoVVFData()['id'];
      ricercapersonaController.getRicercaByID(this.idRicerca, idCorpo).then((response) => {
        let raw = response.data[0];
        switch(raw['error']){
          case '401':
            this.errored = true;
            this.dialog('Errore', 'Accesso non autorizzato a visualizzare questa pagina', '#/dashboard');
            break; 
          case '404':
            this.datiPresenti = false;
            break;
        }
      });
    },
    methods: {
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      },
      openModificaMissione(id, name){
        this.updateDataDialog.idMissione = id;
        this.updateDataDialog.nameMissione = name;
        this.updateDataDialog.active = true;
      },
      openNewMissione(){
        this.newMissione = true;
      },
      closeNewMissione(){
        this.newMissione = false;
      },
      fetchMissioni(){
        this.loading = true;
        missioniController.getMissioniByRicerca(this.idRicerca).then((response) => {
          let raw = response.data[0];
          if (!raw['error']){
            this.datiPresenti = true;
            this.allMissioni = raw.missioni;
            this.newMissione = false;
          }else{
            switch(raw['error']){
              case '404':
                this.datiPresenti = false;
                this.newMissione = false;
                break;
            }
          }
          this.loading = false;
        }, (error) => {
          this.errored= true;
          console.log(error)
          this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/dashboard');
          this.loading = false;
        });
        this.updateDataDialog.active = false;
      },
      createNewMissione(value){
        this.loading = true;
        let name = value;
        let startTime = new Date().toISOString();
        // endTime all'inizio viene impostato uguale a startTime, quando la missione verrà completata, allora il valore
        // di endTime viene sovrascritto
        missioniController.newMissione(name, startTime, startTime, false, this.idRicerca).then((response) => {
          let raw = response.data[0];
          if (!raw.error){
            this.fetchMissioni();
            this.loading = false;
          }else{
            this.errored= true;
            this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona/missioni/'+this.idRicerca);
          }
        }, (error) => {
          console.log(error);
          this.errored= true;
          this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona/missioni/'+this.idRicerca);
          this.loading = false;
        });
      },
      updateMissione(updateData){
        this.loading = true;
        let id = updateData.id;
        let name = updateData.name;
        missioniController.updateMissione(id, name).then((response) => {
          let raw = response.data[0];
          if (!raw.error){
            this.fetchMissioni();
          }else{
            this.errored= true;
            this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona/missioni/'+this.idRicerca);
          }
        }, (error) => {
          console.log(error);
          this.errored= true;
          this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona/missioni/'+this.idRicerca);
          this.loading = false;
        });
      },
      closeUpdateMissione(){
        this.updateDataDialog.active = false;
      },
      alertDeleteMissione(id){
        this.deleteDataDialog.active = true;
        this.deleteDataDialog.idMissione = id;
      },
      deleteMissione(){
        let id = this.deleteDataDialog.idMissione;
        missioniController.deleteMissione(id).then((response) => {
          let raw = response.data;
          if (raw.error === false){
            this.fetchMissioni();
          }else if(raw.error === true){
            this.dialog('Errore', 'Impossibile cancellare i dati relativi alla missione, contattare l\'amministratore', '#/ricercapersona/missioni/'+this.idRicerca) 
          }else{
            switch(raw[0]['error']){
              case '401':
                this.dialog('Errore', 'Non sei autorizzato a cancellare i dati di questa missione, se credi ci sia stato un errore, contatta l\'amministratore', '#/ricercapersona/missioni/'+this.idRicerca);
                break;
              case '404':
                this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/ricercapersona/missioni/'+this.idRicerca);
                break;
            }
          }
        }, (error) => {
          console.log(error);
          this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/dashboard');
        });
      }
    }
  }
</script>
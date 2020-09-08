<template>
  <md-app-content style="height:100%;border:none">
      <div class="md-layout md-alignment-center-center">
        <!-- Componente per aggiungere una nuova ricerca persona
        <nuovaRicercaDialog  
          v-if="this.newRicerca" 
          :active="this.newRicerca" 
          @ricercaDialogClosed="closeNewRicerca"
          @createNuovaRicerca="createNewRicerca"
        ></nuovaRicercaDialog>
        Componente per aggiornare il nome di una ricerca persona
        <updateRicercaDialog  
          v-if="this.updateDataDialog.active" 
          :data="this.updateDataDialog" 
          @updateRicercaDialogClosed="closeUpdateRicerca"
          @updateRicerca="updateRicerca"
        ></updateRicercaDialog>
         Componente per rimuovere il nome di una ricerca persona
        <deleteRicercaDialog  
          v-if="this.deleteDataDialog.active" 
          :data="this.deleteDataDialog" 
          @deleteRicerca="deleteRicerca"
        ></deleteRicercaDialog>
         Componente per eseguire alert specifici -->
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
                    {{new Date(missione.startTime).toLocaleString('it', { hour12: false, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }).replace(/,/,'')}}
                  </md-table-head>
                  <md-table-head md-label="endTime">
                    {{ (missione.completed) ? new Date(missione.startTime).toLocaleString('it', { hour12: false, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }).replace(/,/,'') : '-'}}
                  </md-table-head>
                  <md-table-head md-label="completed">{{missione.completed ? 'COMPLETATO' : 'IN CORSO...'}}</md-table-head>
                  <md-table-head md-label="mostra"><a @click="router.push({name:'LiveMap', params: {idRicerca: missione.id}})">MOSTRA</a></md-table-head>
                  <md-table-head md-label="modifica"><a @click="openModificaRicerca(missione.id, missione.name)">MODIFICA</a></md-table-head>
                  <md-table-head md-label="elimina"><a class="style-red-text" @click="alertDeleteRicerca(missione.id)">RIMUOVI</a></md-table-head>
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
    <md-button class="md-fab md-fab-bottom-right" @click="openNewRicerca()" :disabled="this.loading">
      <md-icon>add</md-icon>
    </md-button>
    <br>
  </md-app-content>
</template>

<script>
  import DialogAlert from '../components/Dialog.vue'; 
  //import nuovaRicercaDialog from '../components/ricercapersona/nuovaRicerca.vue'; 
  //import deleteRicercaDialog from '../components/ricercapersona/deleteRicercaDialog.vue'; 
  //import updateRicercaDialog from '../components/ricercapersona/updateRicercaDialog.vue'; 
  import loginController from '../controllers/loginController.js';
  import ricercapersonaController from '../controllers/ricercapersonaController.js';
  import missioniController from '../controllers/missioniController.js';
  import router from '../router/index.js';

  export default {
    name: 'Missioni',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null, 'url': null},
      deleteDataDialog: {'active': false, 'idRicerca': null},
      updateDataDialog: {'active': false, 'idRicerca': null, 'nameRicerca': null},
      datiPresenti: false,
      allMissioni: [],
      errored: false,
      newMissione: false,
      router: router
    }),
    components: {
      'Dialog': DialogAlert,
      //'nuovaRicercaDialog': nuovaRicercaDialog,
      //'updateRicercaDialog': updateRicercaDialog,
      //'deleteRicercaDialog': deleteRicercaDialog
    },
    mounted(){
      this.idRicerca = this.$route.params.idRicerca;
      if (!isFinite(String(this.idRicerca))){
        router.push({name: 'RicercaPersona'});
      }else{
        this.fetchMissioni();
      }
    },
    methods: {
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      },
      openModificaRicerca(id, name){
        this.updateDataDialog.idRicerca = id;
        this.updateDataDialog.nameRicerca = name;
        this.updateDataDialog.active = true;
      },
      openNewRicerca(){
        // open new ricerca
        this.newMissione = true;
      },
      closeNewRicerca(){
        this.newMissione = false;
      },
      fetchMissioni(){
        this.loading = true;
        missioniController.getMissioniByRicerca(this.idRicerca).then((response) => {
          let raw = response.data[0];
          console.log(raw)
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
      createNewRicerca(value){
        this.loading = true;
        let name = value;
        let idCorpo = loginController.getCorpoVVFData()['id'];
        let startTime = new Date().toISOString();
        // endTime all'inizio viene impostato uguale a startTime, quando la ricerca viene completata, allora il valore
        // di endTime viene sovrascritto
        ricercapersonaController.newRicerca(name, startTime, startTime, false, idCorpo).then((response) => {
          let raw = response.data[0];
          if (!raw.error){
            this.fetchRicerche();
            this.loading = false;
          }else{
            this.errored= true;
            this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona');
          }
        }, (error) => {
          console.log(error);
          this.errored= true;
          this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona');
          this.loading = false;
        });
      },
      updateRicerca(updateData){
        this.loading = true;
        let id = updateData.id;
        let name = updateData.name;
        ricercapersonaController.updateRicerca(id, name).then((response) => {
          let raw = response.data[0];
          if (!raw.error){
            this.fetchRicerche();
          }else{
            this.errored= true;
            this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona');
          }
        }, (error) => {
          console.log(error);
          this.errored= true;
          this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/ricercapersona');
          this.loading = false;
        });
      },
      closeUpdateRicerca(){
        this.updateDataDialog.active = false;
      },
      alertDeleteRicerca(id){
        this.deleteDataDialog.active = true;
        this.deleteDataDialog.idRicerca = id;
      },
      deleteRicerca(){
        let id = this.deleteDataDialog.idRicerca;
        ricercapersonaController.deleteRicerca(id).then((response) => {
          let raw = response.data;
          if (raw.error === false){
            this.fetchRicerche();
          }else if(raw.error === true){
            this.dialog('Errore', 'Impossibile cancellare i dati relativi alla ricerca persona, contattare l\'amministratore', '#/ricercapersona') 
          }else{
            switch(raw[0]['error']){
              case '401':
                this.dialog('Errore', 'Non sei autorizzato a cancellare i dati di questa ricerca persona, se credi ci sia stato un errore, contatta l\'amministratore', '#/ricercapersona');
                break;
              case '404':
                this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/ricercapersona');
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
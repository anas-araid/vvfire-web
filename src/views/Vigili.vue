<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center" style="margin:10px">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
      <deleteVigileDialog v-if="this.deleteAlert.active" :data="this.deleteAlert" @deleteVigile="deleteVigile()"></deleteVigileDialog>
      <nuovo-vigile v-if="this.nuovoVigileON" :data="this.nuovoVigileON" @nuovoVigileClosed="closeNuovoVigile()" @addVigileAlert="addVigileAlert()"></nuovo-vigile>
      <modifica-vigile v-if="this.editVigile.active" :data="this.editVigile" @modificaVigileClosed="closeModificaVigile()" @editVigileAlert="editVigileAlert()"></modifica-vigile>
      <md-card style="overflow-x:auto" v-if="!this.loading">
        <md-card-content>
        <div v-if="this.allVigili.length !== 0 && !this.errored" style="overflow-x:auto">
          <md-table>
            <md-table-toolbar>
              <h1 class="md-title">Lista dei vigili</h1>
            </md-table-toolbar>
            <md-table-row>
              <md-table-head class="style-table-header">COGNOME</md-table-head>
              <md-table-head class="style-table-header">NOME</md-table-head>
              <md-table-head class="style-table-header">NUMERO DI CELLULARE</md-table-head>
              <md-table-head class="style-table-header">EMAIL</md-table-head>
              <md-table-head class="style-table-header">AUTISTA</md-table-head>
              <md-table-head class="style-table-header">GRADO</md-table-head>
              <md-table-head class="style-table-header"></md-table-head>
              <md-table-head class="style-table-header"></md-table-head>
            </md-table-row>
            <md-table-row v-for="vigile in this.allVigili" :key="vigile.id">
              <md-table-head md-label="cognome">{{vigile.surname}}</md-table-head>
              <md-table-head md-label="nome">{{vigile.name}}</md-table-head>
              <md-table-head md-label="numero">{{vigile.phone}}</md-table-head>
              <md-table-head md-label="email">{{vigile.email}}</md-table-head>
              <md-table-head md-label="autista">{{vigile.autista ? 'SI' : 'NO'}}</md-table-head>
              <md-table-head md-label="grado">{{vigile.gradoName}}</md-table-head>
              <md-table-head md-label="modifica"><a @click="openModificaVigile(vigile.id)">MODIFICA</a></md-table-head>
              <md-table-head md-label="elimina"><a class="style-red-text" @click="alertDeleteVigile(vigile.id)">RIMUOVI</a></md-table-head>
            </md-table-row>
          </md-table>
        </div>
        <div v-else-if="this.errored" style="text-align:center">
          <h3>Errore</h3>
        </div>
        <div v-else-if="!this.datiPresenti" style="text-align:center">
          <md-empty-state
            md-rounded
            md-icon="search_off"
            md-label=""
            md-description="Per creare una nuova missione, clicca il tasto rosso in basso a destra.">
          </md-empty-state>
        </div>
        </md-card-content>
      </md-card>
      <div v-else>
        <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
      </div>
    </div>
    <md-button class="md-fab md-fab-bottom-right" @click="openNuovoVigile()" :disabled="this.loading">
      <md-icon>add</md-icon>
    </md-button>
    <br>
  </md-app-content>
</template>

<script>
  // @ is an alias to /src
  // import corpovvfController from '../controllers/corpovvfController.js';
  import DialogAlert from '../components/Dialog.vue'; 
  import deleteVigileDialog from '../components/vigili/deleteVigileDialog.vue'; 
  import nuovoVigile from '../components/vigili/nuovoVigile.vue';
  import modificaVigile from '../components/vigili/modificaVigile.vue';
  import loginController from '../controllers/loginController.js';
  import vigileController from '../controllers/vigileController.js';
  import gradoController from '../controllers/gradoController.js';
  
  export default {
    name: 'Vigili',
    data: () => ({
      showNavigation: false,
      loading: true,
      message: {'active': false, 'content': null, 'url': null},
      deleteAlert: {'active': false, 'idVigile': null},
      editVigile: {'active': false, 'idVigile': null},
      allVigili:[],
      errored: false,
      datiPresenti: true,
      nuovoVigileON: false,
      gradi: []
    }),
    components: {
      'Dialog': DialogAlert,
      'deleteVigileDialog': deleteVigileDialog,
      'nuovo-vigile': nuovoVigile,
      'modifica-vigile': modificaVigile
    },
    mounted(){
      this.loading = true;
      let idCorpo = loginController.getCorpoVVFData()['id'];
      gradoController.getGradi().then((response) => {
        // this.gradi --> array con tutti i gradi + id
        this.gradi = response.data
        if (this.gradi !== []){
          vigileController.getVigili(idCorpo).then((response) => {
            let raw = response.data[0];
            if (!raw['error']){
              this.allVigili = raw.vigili;
              for (var i=0; i < this.allVigili.length; i++){
                // per ogni vigili aggiungo gradoName --> che è uguale al nome in this.gradi associato all'id fkGrado in this.allVigili
                this.allVigili[i].gradoName = this.gradi.filter(a=>a.id=== this.allVigili[i].fkGrado)[0].name;
              }
              this.datiPresenti = !(this.allVigili.length === 0);
            }else{
              switch(raw['error']){
                case '401':
                  this.dialog('Errore', 'Accesso non autorizzato, credenziali non valide, rieffettuare l\'accesso', '#/dashboard');
                  break; 
                case '404':
                  this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/dashboard');
                  break;
              }
            }
            this.loading = false;
          }, (error) => {
            console.log(error);
            this.errored= true;
            this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/dashboard');
            this.loading = false;
          });
        }else{
          this.dialog('Errore', 'Il server non ha restituito i dati relativi ai gradi dei vigili, contatta l\' amministratore', '#/dashboard');
           this.loading = false;
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
      openNuovoVigile(){
        this.nuovoVigileON = true;
      },
      openModificaVigile(idVigile){
        this.editVigile.idVigile = idVigile;
        this.editVigile.active = true;
      },
      closeNuovoVigile(){
        this.nuovoVigileON = false;
      },
      closeModificaVigile(){
        this.editVigile.active = false;
      },
      addVigileAlert(){
        this.dialog('', 'Vigile aggiunto con successo', '#/vigili');
      },
      editVigileAlert(){
        this.dialog('', 'Dati del vigile aggiornati con successo', '#/vigili');
      },
      alertDeleteVigile(id){
        this.deleteAlert.active = true;
        this.deleteAlert.idVigile = id;
      },
      deleteVigile(){
        let id = this.deleteAlert.idVigile;
        vigileController.deleteVigile(id).then((response) => {
          let raw = response.data;
          if (raw.error === false){
            this.dialog('', 'Account del vigile rimosso con successo', '#/vigili') 
          }else if(raw.error === true){
            this.dialog('Errore', 'Impossibile cancellare l\'account, contattare l\'amministratore', '#/vigili') 
          }else{
            switch(raw[0]['error']){
              case '401':
                this.dialog('Errore', 'Non sei autorizzato a cancellare l\'account del vigile, se credi ci sia stato un errore, contatta l\'amministratore', '#/vigili');
                break; 
              case '404':
                this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/vigili');
                break;
            }
          }
        }, (error) => {
          console.log(error);
          this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/dashboard');
        });
      }
    },
  }
</script>
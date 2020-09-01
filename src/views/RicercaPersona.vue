<template>
  <md-app-content style="height:100%;border:none">
      <div class="md-layout md-alignment-center-center">
        <nuovaRicercaDialog  v-if="this.newRicerca" :active="this.newRicerca" @ricercaDialogClosed="closeNewRicerca()"></nuovaRicercaDialog>
        <Dialog v-if="this.message.active" :data="this.message"></Dialog>
        <md-card style="overflow-x:auto" v-if="!this.loading">
        <md-card-content>
          <div v-if="this.allRicerche.length !== 0 && !this.errored" style="overflow-x:auto">
            <md-table>
              <md-table-toolbar>
                <h1 class="md-title">Lista ricerche</h1>
              </md-table-toolbar>
              <md-table-row>
                <md-table-head class="style-table-header">NOME RICERCA</md-table-head>
                <md-table-head class="style-table-header">INIZIO RICERCA</md-table-head>
                <md-table-head class="style-table-header">FINE RICERCA</md-table-head>
                <md-table-head class="style-table-header">STATO</md-table-head>
                <md-table-head class="style-table-header"></md-table-head>
                <md-table-head class="style-table-header"></md-table-head>
              </md-table-row>
              <md-table-row v-for="ricerca in this.allRicerche" :key="ricerca.id">
                <md-table-head md-label="name">{{ricerca.name}}</md-table-head>
                <md-table-head md-label="startTime">{{ricerca.startTime}}</md-table-head>
                <md-table-head md-label="endTime">{{ricerca.endTime}}</md-table-head>
                <md-table-head md-label="completed">{{ricerca.completed ? 'SI' : 'NO'}}</md-table-head>
                <md-table-head md-label="modifica"><a @click="openModificaRicerca(ricerca.id)">MODIFICA</a></md-table-head>
                <md-table-head md-label="elimina"><a class="style-red-text" @click="alertDeleteRicerca(vigile.id)">RIMUOVI</a></md-table-head>
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
  import nuovaRicercaDialog from '../components/ricercapersona/nuovaRicerca.vue'; 
  import loginController from '../controllers/loginController.js';
  import ricercapersonaController from '../controllers/ricercapersonaController.js';

  export default {
    name: 'RicercaPersona',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null, 'url': null},
      datiPresenti: false,
      allRicerche: [],
      errored: false,
      newRicerca: false
    }),
    components: {
      'Dialog': DialogAlert,
      'nuovaRicercaDialog': nuovaRicercaDialog
    },
    mounted(){
      this.loading = true;
      let idCorpo = loginController.getCorpoVVFData()['id'];
      ricercapersonaController.getRicercheByCorpo(idCorpo).then((response) => {
        let raw = response.data[0];
        console.log(raw);
        if (!raw['error']){
          this.datiPresenti = !(this.allRicerche.length === 0);
          let ricerche = raw.ricerche;
          console.log(ricerche);
        }else{
          switch(raw['error']){
            case '401':
              this.dialog('Errore', 'Accesso non autorizzato, credenziali non valide, rieffettuare l\'accesso', '#/dashboard');
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
        this.dialog('Errore', 'Errore, se il problema persiste contattare l\'amministratore', '#/dashboard');
        this.loading = false;
      });
    },
    methods: {
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      },
      openNewRicerca(){
        // open new ricerca
        this.newRicerca = true;
        console.log(this.newRicerca)
      },
      closeNewRicerca(){
        this.newRicerca = false;
      }
    },
  }
</script>
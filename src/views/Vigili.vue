<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center" style="margin:10px">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
      <nuovo-vigile v-if="this.nuovoVigileON" :data="this.nuovoVigileON" @nuovoVigileClosed="closeNuovoVigile()"></nuovo-vigile>
      <div v-if="this.allVigili.length !== 0 && !this.errored">
        <md-table md-card style="overflow:auto">
          <md-progress-bar v-if="this.loading" class="md-accent" md-mode="indeterminate"></md-progress-bar>
          <md-table-toolbar>
            <h1 class="md-title">Lista dei vigili</h1>
          </md-table-toolbar>
          <md-table-row>
            <md-table-head md-numeric class="style-table-header"><strong>ID</strong></md-table-head>
            <md-table-head class="style-table-header">NOME</md-table-head>
            <md-table-head class="style-table-header">COGNOME</md-table-head>
            <md-table-head class="style-table-header">NUMERO DI CELLULARE</md-table-head>
            <md-table-head class="style-table-header">EMAIL</md-table-head>
            <md-table-head class="style-table-header">AUTISTA</md-table-head>
            <md-table-head class="style-table-header">GRADO</md-table-head>
            <md-table-head class="style-table-header">AMMINISTRATORE</md-table-head>
          </md-table-row>
          <md-table-row v-for="vigile in this.allVigili" :key="vigile.id">
            <md-table-head md-label="ID">{{vigile.id}}</md-table-head>
            <md-table-head md-label="nome">{{vigile.name}}</md-table-head>
            <md-table-head md-label="cognome">{{vigile.surname}}</md-table-head>
            <md-table-head md-label="numero">{{vigile.phone}}</md-table-head>
            <md-table-head md-label="email">{{vigile.email}}</md-table-head>
            <md-table-head md-label="autista">{{vigile.autista ? 'SI' : 'NO'}}</md-table-head>
            <md-table-head md-label="grado">{{vigile.fkGrado}}</md-table-head>
            <md-table-head md-label="admin">{{vigile.admin ? 'SI' : 'NO'}}</md-table-head>
        </md-table-row>
      </md-table>
     </div>
     <div v-else-if="this.errored" style="text-align:center">
      <h3>Errore</h3>
     </div>
     <div v-else-if="!this.datiPresenti" style="text-align:center">
      <h3>Dati non presenti</h3>
     </div>
    </div>
    <md-button class="md-fab md-fab-bottom-right style-red-bg" @click="openNuovoVigile()">
      <md-icon>add</md-icon>
    </md-button>
    <br>
  </md-app-content>
</template>

<script>
  // @ is an alias to /src
  // import corpovvfController from '../controllers/corpovvfController.js';
  import DialogAlert from '../components/Dialog.vue'; 
  import loginController from '../controllers/loginController.js';
  import vigileController from '../controllers/vigileController.js';
  import nuovoVigile from '../components/nuovoVigile.vue';
  
  export default {
    name: 'Vigili',
    data: () => ({
      showNavigation: false,
      loading: true,
      message: {'active': false, 'content': null, 'url': null},
      allVigili:[],
      errored: false,
      datiPresenti: true,
      nuovoVigileON: false
    }),
    components: {
      'Dialog': DialogAlert,
      'nuovo-vigile': nuovoVigile
    },
    mounted(){
      console.log(this.nuovoVigileON)
      this.loading = true;
      let idCorpo = loginController.getCorpoVVFData()['id'];
      vigileController.getVigili(idCorpo).then((response) => {
        let raw = response.data[0];
        if (!raw['error']){
          this.allVigili = raw.vigili;
          this.datiPresenti = !(this.allVigili.length === 0);
          console.log(this.allVigili);
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
        this.dialog('Errore', 'Controllare la connessione di rete, se il problema persiste contattare l\'amministratore', '#/dashboard');
      });
      this.loading = false;
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
        console.log(this.nuovoVigileON);
      },
      closeNuovoVigile(){
        this.nuovoVigileON = false;
        console.log(this.nuovoVigileON);
      }
    },
  }
</script>
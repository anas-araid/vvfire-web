<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center" style="margin:10px">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
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
     <div v-else-if="this.allVigili.length === 0 && !this.errored" style="text-align:center">
      <h3>Dati non presenti</h3>
     </div>
    </div>
    <br>
  </md-app-content>
</template>

<script>
  // @ is an alias to /src
  import DialogAlert from '../components/Dialog.vue'; 
  import corpovvfController from '../controllers/corpovvfController.js';
  import loginController from '../controllers/loginController.js';
  import vigileController from '../controllers/vigileController.js';
  import md5 from 'md5';
  
  export default {
    name: 'Vigili',
    data: () => ({
      showNavigation: false,
      loading: true,
      message: {'active': false, 'content': null, 'url': null},
      allVigili:[],
      errored: false
    }),
    components: {
      'Dialog': DialogAlert
    },
    mounted(){
      this.loading = true;
      let idCorpo = loginController.getCorpoVVFData()['id'];
      vigileController.getVigili(idCorpo).then((response) => {
        let raw = response.data[0];
        if (!raw['error']){
          this.allVigili = raw.vigili;
          console.log(this.allVigili);
          this.loading = false;
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
      deleteAccount(){
        if (this.corpoID === null || this.corpoID === undefined ||
            this.passwordDeleteForm === null || this.passwordDeleteForm === undefined){
          this.dialog('Errore', 'Impossibile cancellare il corpo vvf, ricaricare la pagina o rieffetture l\'accesso. Se il problema persiste contattare l\'amministratore', '#/impostazioni');
          return;
        }else{
          corpovvfController.deleteCorpovvf(this.corpoID, md5(this.passwordDeleteForm)).then((response) => {
            let raw = response.data;
            if (raw.error === false){
              loginController.logout();
              this.dialog('', 'Account rimosso', '#/') 
            }else if(raw.error === true){
              this.dialog('Errore', 'Impossibile cancellare l\'account, contattare l\'amministratore', '#/') 
            }else{
              switch(raw[0]['error']){
                case '401':
                  this.dialog('Errore', 'Accesso non autorizzato, credenziali non valide', '#/impostazioni');
                  break; 
                case '404':
                  this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/impostazioni');
                  break;
              }
            }
          }, (error) => {
            console.log(error);
            this.dialog('Errore', 'Controllare la connessione di rete, se il problema persiste contattare l\'amministratore', '#/impostazioni');
          });
        }
        this.confermaPassword = '';
      }
    },
  }
</script>
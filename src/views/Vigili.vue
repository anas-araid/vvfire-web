<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
    
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
      loading: false,
      message: {'active': false, 'content': null, 'url': null},
      corpoID: "",
      email: "",
      password: "",
      caserma: "",
      phone:"",
      confermaPassword:"",
      passwordDeleteForm:""
    }),
    components: {
      'Dialog': DialogAlert
    },
    mounted(){
      this.loading = true;
      let idCorpo = loginController.getCorpoVVFData()['id'];
      vigileController.getVigili(idCorpo).then((response) => {
        console.log(response)
      })
      /*let loggedEmail = loginController.getCorpoVVFData()['email'];
      corpovvfController.getCorpoData(loggedEmail).then((response) => {
        let raw = response.data[0];
        if (!raw['error']){
          let data = raw.corpovvf[0];
          this.corpoID = data.id;
          this.email = data.email;
          this.caserma = data.name;
          this.phone = data.phone;
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
        this.dialog('Errore', 'Controllare la connessione di rete, se il problema persiste contattare l\'amministratore', '#/dashboard');
      });*/
    },
    methods: {
      checkPassword(){
        return (this.password !== this.confermaPassword)
      },
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      },
      updateData(){
        this.loading = true;
        if (this.checkPassword()){
          this.dialog('Errore', 'Le password non corrispondono', '#/impostazioni');
          this.loading = false;
          return;
        }
        if (this.caserma === null  ||
            this.phone === null    ||
            this.email === null    ||
            this.password === null ||
            this.confermaPassword === null){
          this.dialog('Errore', 'Inserire tutti i campi', '#/impostazioni');
          this.loading = false;
          return;
        }
        corpovvfController.updateCorpovvf(this.corpoID, this.caserma, this.phone, this.email, md5(this.password)).then((response) => {
          let raw = response.data[0];
          if (!raw['error']){
            let data = raw.corpovvf;
            this.corpoID = data.id;
            this.email = data.email;
            this.caserma = data.name;
            this.phone = data.phone;
            this.loading = false;
          }else{
            switch(raw['error']){
              case '401':
                this.dialog('Errore', 'Accesso non autorizzato, credenziali non valide, rieffettuare l\'accesso', '#/dashboard');
                break; 
              case '404':
                this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/impostazioni');
                break;
            }
          }
        }, (error) => {
          console.log(error);
          this.dialog('Errore', 'Controllare la connessione di rete, se il problema persiste contattare l\'amministratore', '#/dashboard');
        });
        // cancello le password dalla form
        this.password = null;
        this.confermaPassword = null;
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
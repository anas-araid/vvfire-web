<template>
  <md-app-content style="height:100%;border:none">
    <Dialog v-if="this.message.active" :data="this.message"></Dialog>
  </md-app-content>
</template>

<script>
  import loginController from '../controllers/loginController.js';
  import ricercapersonaController from '../controllers/ricercapersonaController.js';
  import DialogAlert from '../components/Dialog.vue'; 

  export default {
    name: 'LiveMap',
    data: function (){
      return {
        showNavigation: false,
        loading: false,
        errored: false,
        currentRicercaPersona: null
      }
    },
    components: {
      'Dialog': DialogAlert
    },
    mounted(){
      let idCorpo = loginController.getCorpoVVFData()['id'];
      let idRicerca = this.$route.params.idRicerca;
      this.getRicerca(idRicerca, idCorpo);
    },
    methods: {
      getRicerca(idRicerca, idCorpo){
        ricercapersonaController.getRicercaByID(idRicerca, idCorpo).then((response) => {
          let raw = response.data[0];
          if (!raw.error){
            this.datiPresenti = true;
            this.currentRicercaPersona = raw.ricerca;
            console.log(this.currentRicercaPersona);
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
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      }
    }
  }
</script>
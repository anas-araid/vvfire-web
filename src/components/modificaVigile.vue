<template>
    <div>
    <Dialog v-if="this.message.active" :data="this.message"></Dialog>
    <md-dialog 
      :md-active.sync="this.isActive"
      :md-close-on-esc="false"
      :md-fullscreen="true"
    >
      <md-dialog-title>Modifica vigile</md-dialog-title>
      <md-dialog-content class="style-dialog">
        <div class="md-layout md-alignment-center-center">
        <div class="md-layout-item md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100" style="text-align:center">
          <form class="md-layout" @submit.prevent="">
            <md-card class="md-layout-item md-size-100 md-small-size-100" >
              <md-progress-bar v-if="this.loading" class="md-accent" md-mode="indeterminate"></md-progress-bar>
              <md-card-content>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <md-icon class="style-red-text">account_circle</md-icon>
                      <label for="name">Nome</label>
                      <md-input type="text" name="name" id="name" v-model="nome" autocomplete="name" maxlength="50" required/>
                      <span class="md-error">Inserire il nome del vigile</span>
                    </md-field>
                    <md-field>
                      <md-icon class="style-red-text">account_circle</md-icon>
                      <label for="surname">Cognome</label>
                      <md-input type="text" name="surname" id="surname" v-model="cognome" autocomplete="surname" maxlength="50" required/>
                      <span class="md-error">Inserire il cognome del vigile</span>
                    </md-field>
                    <md-field>
                      <md-icon class="style-red-text">call</md-icon>
                      <label for="phone">Numero di cellulare</label>
                      <md-input type="text" name="phone" id="phone" v-model="telefono" autocomplete="phone" maxlength="50" required/>
                      <span class="md-error">Inserire numero di cellulare</span>
                    </md-field>
                    <md-field>
                      <md-icon class="style-red-text">email</md-icon>
                      <label for="email">Email</label>
                      <md-input type="email" name="email" id="email" autocomplete="email" v-model="email" required/>
                      <span class="md-error">Inserire l'email</span>
                    </md-field>
                    <md-field>
                      <md-icon class="style-red-text">grade</md-icon>
                      <label for="grado">Grado</label>
                      <md-select v-model="selectedGrado" name="grado" id="grado" :value="selectedGrado" required>
                        <md-option v-for="selectedGrado in this.gradi" :key="selectedGrado.id" :value="selectedGrado.id">
                          {{selectedGrado.name}}
                        </md-option>
                      </md-select>
                    </md-field>
                    <div class="input" style="text-align:left">
                      <md-checkbox v-model="autista" id="autista">Autista (patente C) {{autista}}</md-checkbox>
                    </div>
                  </div>
                </div>
              </md-card-content>
              <md-card-actions>
                <md-button type="submit" class="style-red-bg">MODIFICA</md-button>
                <md-button class="md-accent" @click="close()">ANNULLA</md-button>
              </md-card-actions>
            </md-card>
          </form>
        </div>
      </div>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
  import gradoController from '../controllers/gradoController.js';
  import loginController from '../controllers/loginController.js';
  import vigileController from '../controllers/vigileController.js';
  import Dialog from '../components/Dialog.vue';

  export default {
    Name: 'modificaVigile',
    props: {
      data: {
        type: Object
      }
    },
    components: {
      'Dialog': Dialog
    },
    data: function(){
      return {
        isActive: this.data.active,
        nome: null,
        cognome: null,
        email: null,
        telefono: null,
        autista: false,
        gradi: [],
        selectedGrado: null,
        message: {'active': false, 'content': null, 'url': null},
        loading: true
      }
    },
    beforeCreate(){
      gradoController.getGradi().then((response) => {
        let data = response.data;
        if (data.length !== 0){
          this.gradi = data.reverse();
        }
      });
    },
    mounted(){
      this.loading = true;
      vigileController.getVigileByID(this.data.idVigile).then((response) => {
        let raw = response.data[0];
        if (!raw.error){
          let vigile = raw.vigile[0];
          this.nome = vigile.name;
          this.cognome = vigile.surname;
          this.autista = vigile.autista ? true : false;
          this.telefono = vigile.phone;
          this.email = vigile.email;
          this.selectedGrado = vigile.fkGrado;
          this.loading = false;
        }else if(raw.error === '404'){
          this.loading = false;
          this.dialog('Errore', 'Vigile non trovato', '#/vigili'); 
        }
      }, (error) => {
        console.log(error);
        this.errored= true;
        this.loading = false;
        this.dialog('Errore', 'Il server non ha resitutito i dati. Se il problema persiste contattare l\'amministratore', '#/vigili');
      });
    },
    methods: {
      clicked(){
        this.data.nuovoVigileON = false;
      },
      close(){
        this.isActive = false;
        this.$emit('modificaVigileClosed');
      },
      updateVigile(){
        let nome = this.nome;
        let cognome = this.cognome;
        let email = this.email;
        let telefono = this.telefono;
        let autista = (this.autista) ? true : false;
        let idGrado = this.selectedGrado;
        console.log(nome + cognome + email + telefono+ autista + idGrado);
        if (nome !== null &&
            cognome !== null &&
            email !== null &&
            telefono !== null &&
            autista !== null &&
            idGrado !== null){
          let idCorpo = loginController.getCorpoVVFData()['id'];
          let admin = false;
          vigileController.newVigile(nome, cognome, telefono, email, autista, admin, idGrado, idCorpo).then((response) => {
            if (response.status === 200){
              this.$emit('addVigile');
              this.close();
            }
          }, (error) => {
            console.log(error);
            this.errored= true;
            this.dialog('Errore', 'Impossibile aggiungere il vigile, controllare se l\'email o il numero di telefono sono stati già immessi. Se il problema persiste contattare l\'amministratore', '#/dashboard');
          });
        }else{
          this.errored= true;
          this.dialog('Errore', 'Impossibile aggiungere il vigile, controllare se tutti i campi sono stati compilati. Se il problema persiste contattare l\'amministratore', '#/dashboard');
        }
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

<style>
  .style-dialog{
    width:100vw!important;
    height:100vh!important;
  }
  .md-dialog-container{
    max-height: 100%!important;
    max-width: 100%!important;
  } 
</style>
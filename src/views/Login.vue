<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center" style="min-height:500px;height:100%">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
      <div class="md-layout-item md-large-size-80 md-medium-size-100 md-small-size-50 md-xsmall-size-100" style="text-align:center">
        <div class="md-layout">
          <div class="md-layout-item md-size-5"></div>
          <div class="md-layout-item md-size-90">
          <form class="md-layout" @submit.prevent="auth()">
            <md-card class="md-layout-item md-size-90 md-small-size-100" >
              <md-progress-bar v-if="this.loading" class="md-accent" md-mode="indeterminate"></md-progress-bar>
              <md-card-header>
                <div class="md-title">Accedi</div>
              </md-card-header>
              <md-card-content>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <md-icon class="style-red-text">email</md-icon>
                      <label for="email">Email</label>
                      <md-input type="email" name="email" id="email" autocomplete="email" v-model="email" :disabled="loading" required/>
                      <span class="md-error">Inserire l'email</span>
                    </md-field>
                    <md-field>
                      <md-icon class="style-red-text">vpn_key</md-icon>
                      <label for="password">Password</label>
                      <md-input v-model="password" type="password" name="password" id="password" :disabled="loading" required></md-input>
                    </md-field>
                  </div>
                </div>
              </md-card-content>
              <md-card-actions>
                <md-button type="submit" class="md-accent" :disabled="loading">Accedi</md-button>
              </md-card-actions>
            </md-card>
          </form>
          </div>
          <div class="md-layout-item md-size-5"></div>
        </div>
      </div>
      
      <div class="md-layout-item md-large-size-40 md-medium-size-33 md-medium-hide">
        <span class="md-display-3">[screen app]</span>
      </div>
    </div>
  </md-app-content>
</template>

<script>
  // @ is an alias to /src
  import axios from 'axios';
  import DialogAlert from '../components/Dialog.vue'; 
  import loginController from '../controllers/loginController.js';
  import md5 from 'md5';

  export default {
    name: 'Login',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null, 'url': null},
      email: "",
      password: ""
    }),
    components: {
      'Dialog': DialogAlert
    },
    created() {
      // check if there is a token not expired
      if(loginController.isTokenValid()){
        this.$router.push('dashboard');
      }else{
        console.log("Token non valido");
      }
    },
    methods: {
      auth() {
        this.loading = true;
        axios.post('http://localhost:1337/api/v1/corpovvf/login', {
          email: this.email,
          password: md5(this.password)
        })
        .then((response) => {
          this.loading = false;
          let data = response.data[0];
          console.log(data);
          if (data['error'] === "401"){
            this.dialog('Errore', 'Credenziali non valide', '#/login');          
          }
          if (!data['error']){
            // save data in localstorage
            loginController.saveData(data.corpovvf[0], data.token);
            this.$router.push('/dashboard');
          }
        }, (error) => {
          this.loading = false;
          console.log(error);
          this.dialog('Errore', 'Controllare la connessione di rete, se il problema persiste contattare l\'amministratore', '#/login');
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
<style lang="scss" scoped>
  .md-app {
    max-height: 100vh!important;
  }
</style>
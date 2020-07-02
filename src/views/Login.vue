<template>
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="style-fixed-toolbar md-dense">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon class="style-red-text">menu</md-icon>
      </md-button>
      <span class="md-title style-red-text"><b>VVF</b>ire</span>
      <div class="md-toolbar-section-end">
        <md-button to="/" class="style-red-text">Home</md-button>
      </div>
    </md-app-toolbar>

    <md-app-drawer :md-active.sync="showNavigation" md-swipeable md-fixed>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title style-red-text"><b>VVF</b>ire</span>
      </md-toolbar>

      <md-list>
        <md-list-item to="/">
          <md-icon>home</md-icon>
          <span class="md-list-item-text">Home</span>
        </md-list-item>

        <md-list-item to="/login">
          <md-icon>login</md-icon>
          <span class="md-list-item-text">Accedi</span>
        </md-list-item>

        <md-list-item href="/#funzionalita">
          <md-icon>miscellaneous_services</md-icon>
          <span class="md-list-item-text">Funzionalità</span>
        </md-list-item>

        <md-list-item href="/#download">
          <md-icon>get_app</md-icon>
          <span class="md-list-item-text">Download app</span>
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content style="height:100%">
      <div class="md-layout md-alignment-center-center" style="min-height:500px;height:100%">
        <Dialog v-if="this.message.active" :data="this.message"></Dialog>
        <div class="md-layout-item md-medium-size-66 md-small-size-50 md-xsmall-size-100" style="text-align:center">
          <form class="md-layout" @submit.prevent="auth()">
            <md-card class="md-layout-item md-size-50 md-small-size-100" >
              <md-progress-bar v-if="this.loading" class="md-accent" md-mode="indeterminate"></md-progress-bar>
              <md-card-header>
                <div class="md-title">Accedi</div>
              </md-card-header>
              <md-card-content>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="email">Email</label>
                      <md-input type="email" name="email" id="email" autocomplete="email" v-model="email" :disabled="loading" required/>
                      <span class="md-error">The last name is required</span>
                   </md-field>
                   <md-field>
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
        <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <span class="md-display-3">[screen app]</span>
        </div>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
  // @ is an alias to /src
  import axios from 'axios';
  import DialogAlert from '../components/Dialog.vue'; 

  export default {
    name: 'Layout',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null},
      email: "",
      password: ""
    }),
    components: {
      'Dialog': DialogAlert
    },
    methods: {
      auth() {
        this.loading = true;
        axios.post('http://localhost:1337/api/v1/corpovvf/login', {
          email: this.email,
          password: this.password
        })
        .then((response) => {
          this.loading = false;
          let data = response.data[0];
          console.log(data);
          if (data['error'] === "401"){
            this.message.active = true;
            this.message.title = 'Errore';            
            this.message.content = 'Credenziali non valide';            
          }
          if (!data['error']){
            // save data in localstorage
            console.log(data);
          }
        }, (error) => {
          this.loading = false;
          console.log(error);
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .md-app {
    max-height: 100vh!important;
  }
</style>
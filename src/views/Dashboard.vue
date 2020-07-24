<template>
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="style-fixed-toolbar md-dense">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon class="style-red-text">menu</md-icon>
      </md-button>
      <span class="md-title style-red-text"><b>VVF</b>ire</span>
      <div class="md-toolbar-section-end">
        <md-button @click="logout()" class="style-red-text">LOGOUT</md-button>
      </div>
    </md-app-toolbar>

    <md-app-drawer :md-active.sync="showNavigation" md-swipeable md-permanent="full">
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
      <Dialog v-if="this.message.active" :data="this.message" @clicked="checkExpiredDialog"></Dialog>

      <router-view/>
      <router-view name="dashboard"/>
    </md-app-content>
  </md-app>
</template>

<script>
  import loginController from '../controllers/loginController.js';
  import DialogAlert from '../components/Dialog.vue'; 

  export default {
    name: 'Dashboard',
    data(){
      return {
        showNavigation: false,
        navBarButton: null,
        navBarButtonLink: null,
        message: {'active': false, 'content': null}
      }
    },
    components: {
      'Dialog': DialogAlert
    },
    created(){
      this.checkToken();
    },
    updated(){
      this.checkToken();
    },
    methods: {
      // wrapper dal dialog che restituisce expired=true se si chiude l'alert
      checkExpiredDialog(expired){
        if (expired){
          this.logout();
        }
      },
      navbarButton(){
        if (this.$route.path === '/'){
          this.navBarButton = 'ACCEDI';
          this.navBarButtonLink = '/login';
        }else if (this.$route.path === '/login'){
          this.navBarButton = 'HOME';
          this.navBarButtonLink = '/';
        }else{
          this.navBarButton = 'HOME';
          this.navBarButtonLink = '/';
        }
      },
      checkToken(){
        this.navbarButton();
        // check session and if token is saved
        loginController.logout();
        if (!loginController.isTokenValid()){
          this.message.active = true;
          this.message.title = 'Attenzione';            
          this.message.content = 'Sessione scaduta, è necessario autenticarsi nuovamente'; 
        }
      },
      logout(){
        loginController.logout();
        window.location.href = '/';
      }
    }
  }
</script>
<style lang="scss" scoped>
  .md-app {
    max-height: 100vh!important;
  }
</style>
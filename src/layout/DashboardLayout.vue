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

        <md-list-item to="/vigili">
          <md-icon>account_circle</md-icon>
          <span class="md-list-item-text">Vigili</span>
        </md-list-item>

        <md-list-item to="/reperibilita">
          <md-icon>watch_later</md-icon>
          <span class="md-list-item-text">Reperibilità</span>
        </md-list-item>

        <md-list-item to="/ricercapersona">
          <md-icon>explore</md-icon>
          <span class="md-list-item-text">Ricerca persona</span>
        </md-list-item>
        
        <md-list-item to="/impostazioni">
          <md-icon>settings</md-icon>
          <span class="md-list-item-text">Impostazioni</span>
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content style="height:100%">
      <Dialog v-if="this.message.active" :data="this.message" @clicked="checkExpiredDialog"></Dialog>

      <router-view/>
      <router-view name="loggedContent"/>
    </md-app-content>
  </md-app>
</template>

<script>
  import loginController from '../controllers/loginController.js';
  import DialogAlert from '../components/Dialog.vue'; 
  import router from '../router/index.js';
  
  export default {
    name: 'Dashboard',
    data(){
      return {
        showNavigation: false,
        navBarButton: null,
        navBarButtonLink: null,
        message: {'active': false, 'content': null},
        router: router
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
        if (!loginController.isTokenValid()){
          this.message.active = true;
          this.message.title = 'Attenzione';            
          this.message.content = 'Sessione scaduta, è necessario autenticarsi nuovamente';
          this.message.url = '#/' 
        }
      },
      logout(){
        loginController.logout();
        this.router.push({name: 'Login'});
      }
    }
  }
</script>
<style lang="scss" scoped>
  .md-app {
    max-height: 100vh!important;
    min-height: 100vh!important;
  }
</style>

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
      <router-view name="helper"/>
    </md-app-content>
  </md-app>
</template>

<script>

  export default {
    name: 'HomeLayout',
    data: () => ({
      showNavigation: false,
    }),
  }
</script>
<style lang="scss" scoped>
  .md-app {
    max-height: 100vh!important;
  }
</style>
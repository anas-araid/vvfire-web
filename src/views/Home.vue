<template>
<div class="page-container" style="background:#fafafa;height:100%">
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="style-fixed-toolbar md-dense">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon class="style-red-text">menu</md-icon>
      </md-button>
      <span class="md-title style-red-text"><b>VVF</b>ire</span>
    </md-app-toolbar>

    <md-app-drawer :md-active.sync="showNavigation" md-swipeable md-fixed style="background-color:white">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title style-red-text"><b>VVF</b>ire</span>
      </md-toolbar>

      <md-list>
        <md-list-item href="#home">
          <md-icon>home</md-icon>
          <span class="md-list-item-text">Home</span>
        </md-list-item>

        <md-list-item to="/login">
          <md-icon>login</md-icon>
          <span class="md-list-item-text">Accedi</span>
        </md-list-item>

        <md-list-item href="#funzionalita">
          <md-icon>miscellaneous_services</md-icon>
          <span class="md-list-item-text">Funzionalità</span>
        </md-list-item>

        <md-list-item href="#download">
          <md-icon>get_app</md-icon>
          <span class="md-list-item-text">Download app</span>
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content style="height:100%">
      <div class="md-layout md-alignment-center-center" style="background:#fafafa; min-height:500px;height:100%">
        <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="text-align:left">
          <span class="md-display-2" style="font-weight:200">Changing the way we <i>rescue</i>...</span>
        </div>
        <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <span class="md-display-3">Display 3</span>
        </div>
      </div>
    </md-app-content>
  </md-app>
  </div>
</template>

<script>
  // @ is an alias to /src
  
  export default {
    name: 'Home',
    data: () => ({
      showNavigation: false
    })
  }
</script>
<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center" style="min-height:500px;height:100%">
      <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="text-align:left">
        <span class="md-display-2" style="font-weight:200">Changing the way we <i class="style-red-text">rescue</i></span>
      </div>
      <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
        <span class="md-display-3">[screen app]</span>
      </div>
    </div>
  </md-app-content>
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
<style lang="scss" scoped>
  .md-app {
    max-height: 100vh!important;
  }
</style>

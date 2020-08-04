<template>
  <div class="page-container" id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: 'App',
    created(){
      this.$session.start()
    }
  }
</script>
<style>
  @import './assets/style.css';
  #app {
    /*background-color:#fafafa!important;*/
    text-align: center;
    color: #2c3e50;
    height: 100%!important;
  }
</style>

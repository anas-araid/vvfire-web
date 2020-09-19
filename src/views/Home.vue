<template>
  <md-app-content :style="'border:0;height:'+ (fullHeight - 140) +'px'">
    <div class="md-layout md-alignment-center-center" style="min-height:100%;height:100%">
      <div class="md-layout-item md-large-size-70 md-medium-size-70 md-small-size-50 md-xsmall-size-100" style="text-align:left">
        <span class="md-display-3" style="font-weight:200">Changing the way we <i class="style-red-text">rescue</i></span><br>
        <span class="md-display-1" style="font-weight:200">L'innovazione a portata di mano</span>
        <br><br><br>
        <button class="circleScaleBtn" @click="router.push({name: 'Login'})"><span>INIZIA SUBITO!</span></button>
        <button class="snapLeftBtn"><span>SCOPRI DI PIU'</span></button>
      </div>
      <div class="md-layout-item md-large-size-30 md-medium-size-30 md-small-size-50 md-xsmall-size-100">
        <img src="../assets/homepage.svg"/>
      </div>
    </div>
    <div>
      <md-icon class="arrowBounce">keyboard_arrow_down</md-icon>
    </div>
  </md-app-content>
</template>

<script>
  // @ is an alias to /src
  import router from '../router/index.js';

  export default {
    name: 'Home',
    data: () => ({
      showNavigation: false,
      fullHeight:document.documentElement.clientHeight,
      router: router
    }),
    create(){
      window.addEventListener("resize", this.myEventHandler());
    },
    mounted() {
      window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize (event) {
        console.log(event)
        this.fullHeight = document.documentElement.clientHeight
      }
    }
  }
</script>
<style lang="scss" scoped>
  .md-app {
    max-height: 100vh!important;
  }
</style>

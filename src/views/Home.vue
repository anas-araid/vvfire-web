<template>
  <md-app-content :style="'border:0;padding:0;height:'+ (fullHeight - 140) +'px'">
    <div class="md-layout md-alignment-center-center style-home-card">
      <div class="md-layout-item md-large-size-70 md-medium-size-70 md-small-size-100 md-xsmall-size-100" style="text-align:left">
        <span class="md-display-3" style="font-weight:200">Changing the way we <i class="style-red-text">rescue</i></span><br>
        <span class="md-display-1" style="font-weight:200">L'innovazione a portata di mano</span>
        <br><br><br>
        <button class="circleScaleBtn" @click="router.push({name: 'Login'})"><span>INIZIA SUBITO!</span></button>
        <button class="snapLeftBtn" @click="scopri()"><span>SCOPRI DI PIU'</span></button>
      </div>
      <div class="md-layout-item md-large-size-30 md-medium-size-30 md-small-size-100 md-xsmall-size-100">
        <img src="../assets/homepage.svg"/>
      </div>
    </div>
    <div>
      <md-icon class="arrowBounce">keyboard_arrow_down</md-icon>
    </div>

    <div id="funzionalita" class="md-layout md-alignment-center-center style-home-card">
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-100 md-xsmall-size-100">
        <img src="../assets/ricerche.png" />
      </div>
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-100 md-xsmall-size-100" style="text-align:center">
        <span class="md-display-1" style="font-weight:200">Gestione completa degli interventi di ricerca persona</span>
        <br><br>
        <span class="md-display-1 md-xsmall-hide" style="font-weight:200;font-size:24px">Un'alternativa facile e veloce ai costosi localizzatori gps, basta uno smartphone!</span>
        <br>
      </div>
    </div>

    <div class="md-layout md-alignment-center-center style-home-card">
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-100 md-xsmall-size-100" style="text-align:left">
        <span class="md-display-1" style="font-weight:200;">La localizzazione e la gestione delle tracce gps non sono mai stati così semplici!</span>
        <br><br><br>
        <span class="md-display-1 md-xsmall-hide" style="font-weight:200;font-size:24px">
          Potrai facilmente monitorare la posizione del personale in ogni momento, avere un riepilogo delle aree perlustate
          ed un riepilogo complessivo per valutare l'efficenza della ricerca svolta.
        </span>
      </div>
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-100 md-xsmall-size-100">
        <img src="../assets/riepilogo.png"/>
      </div>
    </div>

    <div class="md-layout md-alignment-center-center style-home-card">
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
        <img src="../assets/reperibilita.png" />
      </div>
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="text-align:center">
        <span class="md-display-1" style="font-weight:200">Consulta la reperibilità del personale</span>
        <br><br>
        <span class="md-display-2 md-xsmall-hide" style="font-weight:200;font-size:24px">
          Hai bisogno di personale per un intervento non urgente? Non sai chi al momento sia reperibile?
          <br>
          Controlla subito il calendario in piattaforma, ti mostrerà tutti i vigili disponibili!
        </span>
      </div>
    </div>

    <div class="md-layout md-alignment-center-center style-home-card">
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="text-align:left">
        <span class="md-display-1" style="font-weight:200;">Funzionalità in via di sviluppo</span>
        <br><br>
        <br><br>
        <span class="md-display-1" style="font-weight:200;font-size:28px">
          Documentazione fotografica degli interventi
        </span>
        <br><br>
        <span class="md-display-1 md-xsmall-hide" style="font-weight:200;font-size:24px">
          Avere una rapporto d'intervento con allegato una documentazione fotografica, spesso si rivela fondamentale per 
          ricostruire le operazioni svolte, soprattutto se si tratta di eventi accaduti molto tempo fa.
        </span>
      </div>
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
        <img src="../assets/snorkel.jpg" style="border-radius:7px;width:70%;margin:30px" />
      </div>
    </div>

    <div class="md-layout md-alignment-center-center style-home-card">
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
        <img src="../assets/app.svg" style="width:70%;margin:30px" />
      </div>
      <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="text-align:left">
        <br><br>
        <span class="md-display-1" style="font-weight:200;font-size:28px">
          App per Android e iOS
        </span>
        <br><br>
        <span class="md-display-1 md-xsmall-hide " style="font-weight:200;font-size:24px">
          Componente fondamentale per il funzionamento della piattaforma, tramite il proprio smartphone sarà possible impostare la propria reperibilità ed utilizzare il
          proprio dispositivo come localizzatore gps durante gli interventi di ricerca persona.
        </span>
      </div>
    </div>
    <footer-component></footer-component>    
  </md-app-content>
  
</template>

<script>
  // @ is an alias to /src
  import router from '../router/index.js';
  import footer from '../components/Footer.vue';
  export default {
    name: 'Home',
    data: () => ({
      showNavigation: false,
      fullHeight:document.documentElement.clientHeight,
      router: router
    }),
    components: {
      'footer-component': footer
    },
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
      },
      scopri(){
        window.location.href='#funzionalita';
      }
    }
  }
</script>
<style lang="scss" scoped>
  .md-app {
    max-height: 100vh!important;
  }
</style>

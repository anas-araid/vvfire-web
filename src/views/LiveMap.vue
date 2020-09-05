<template>
  <md-app-content style="height:100%;border:none">

  </md-app-content>
</template>

<script>
  export default {
    name: 'LiveMap',
    data: function (){
      return {
        showNavigation: false,
        loading: false,
        errored: false
      }
    },
    props: {
      id: {
        type: String
      }
    },
    components: {

    },
    mounted(){
      // check if ricerca with prop id exists and if is related to current corpovvf
    }
  }
</script>
<template>
  <md-dialog-prompt
    :md-active.sync="this.isActive"
    v-model="name"
    md-title="Nuova ricerca"
    md-input-maxlength="50"
    md-input-placeholder="Inserisci il nome della ricerca..."
    md-cancel-text="ANNULLA"
    md-confirm-text="CREA"
    @md-confirm="nuovaRicerca()"
    @md-cancel="close()" />
</template>


<script>
  export default {
    name: 'nuovaRicerca',
    props: {
      active: {
        type: Boolean
      }
    },
    data: function(){
      return {
        name: null,
        isActive: this.active
      }
    },
    mounted(){
      //console.log(this.active)
    },
    methods: {
      nuovaRicerca(){
        console.log(this.name)
        this.close();
      },
      close(){
        this.isActive = false;
        this.$emit('ricercaDialogClosed');
      }
    }
  }
</script>
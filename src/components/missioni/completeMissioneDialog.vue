<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="data.active"
      md-title="Sei sicuro di voler completare la missione?"
      md-content="Una volta completata la missione, non verranno più memorizzate le nuove posizioni in ingresso."
      md-confirm-text="CONTINUA"
      md-cancel-text="ANNULLA"
      @md-cancel="onCancel"
      @md-confirm="onConfirm" />
  </div>
</template>

<script>
  export default {
    name: 'completeMissioneDialog',
    data: () => ({
      active: false
    }),
    props: {
      data: {
        type: Object
      }
    },
    methods: {
      onConfirm () {
        this.$emit('completeMissione');
        this.active = false;
      },
      onCancel () {
        this.active = false;
      }
    }
  }
</script>

<style>
  .md-primary{
    color:white!important;
    z-index: 20!important;
    background-color: #e53935!important;
  }
</style>
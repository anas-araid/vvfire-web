<template>
    <md-dialog 
      :md-active.sync="this.isActive"
      :md-close-on-esc="false"
      :md-fullscreen="false"
    >
      <md-dialog-title>Nuova ricerca persona</md-dialog-title>
      <md-dialog-content>
        <div class="md-layout md-alignment-center-center">
          <div class="md-layout-item md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100" style="text-align:center">
            <form class="md-layout" @submit.prevent="nuovaRicerca()">
              <md-field>
                <label for="name">Nome</label>
                <md-input type="text" name="name" id="name" v-model="name" autocomplete="name" maxlength="50" required/>
                <span class="md-error">Inserire il nome del ricerca</span>
              </md-field>
              <md-button type="submit" class="style-red-bg">CREA</md-button>
              <md-button class="md-accent" @click="close()">ANNULLA</md-button>
            </form>
          </div>
        </div>
      </md-dialog-content>
    </md-dialog>
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
        isActive: true
      }
    },
    methods: {
      nuovaRicerca(){
        this.isActive = false;
        this.$emit('createNuovaRicerca', this.name);
      },
      close(){
        this.isActive = false;
        this.$emit('ricercaDialogClosed');
      }
    }
  }
</script>
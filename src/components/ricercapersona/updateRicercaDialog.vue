<template>
    <md-dialog 
      :md-active.sync="this.isActive"
      :md-close-on-esc="false"
      :md-fullscreen="false"
    >
      <md-dialog-title>Modifica il nome della ricerca persona</md-dialog-title>
      <md-dialog-content>
        <div class="md-layout md-alignment-center-center">
          <div class="md-layout-item md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100" style="text-align:center">
            <form class="md-layout" @submit.prevent="editRicerca()">
              <md-field>
                <label for="name">Nome</label>
                <md-input type="text" name="name" id="name" v-model="name" autocomplete="name" maxlength="50" required/>
                <span class="md-error">Inserire il nome del ricerca</span>
              </md-field>
              <md-button type="submit" class="style-red-bg">MODIFICA</md-button>
              <md-button class="md-accent" @click="close()">ANNULLA</md-button>
            </form>
          </div>
        </div>
      </md-dialog-content>
    </md-dialog>
</template>


<script>
  export default {
    name: 'updateRicerca',
    props: {
      data: {
        type: Object
      }
    },
    data: function(){
      return {
        name: null,
        isActive: true
      }
    },
    mounted(){
      this.name = this.data.nameRicerca;
    },
    methods: {
      editRicerca(){
        this.isActive = false;
        this.$emit('updateRicerca', {id: this.data.idRicerca, name: this.name});
      },
      close(){
        this.isActive = false;
        this.$emit('updateRicercaDialogClosed');
      }
    }
  }
</script>
<template>
  <md-dialog 
    :md-active.sync="this.isActive"
    :md-close-on-esc="false"
    :md-fullscreen="true"
  >
    <md-dialog-title>Aggiungi vigile</md-dialog-title>
    <md-dialog-content class="style-dialog">
      <div class="md-layout md-alignment-center-center">
       <div class="md-layout-item md-large-size-100 md-medium-size-100 md-small-size-50 md-xsmall-size-100" style="text-align:center">
        <form class="md-layout" @submit.prevent="">
          <md-card class="md-layout-item md-size-80 md-small-size-100" >
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <md-icon class="style-red-text">account_circle</md-icon>
                    <label for="npme">Nome</label>
                    <md-input type="text" name="nome" id="nome" autocomplete="nome" maxlength="50" required/>
                    <span class="md-error">Inserire il nome del vigile</span>
                  </md-field>
                </div>
              </div>
            </md-card-content>
            <md-card-actions>
              <md-button type="submit" class="md-accent">AGGIORNA</md-button>
              <md-button class="md-accent" @click="close()">ANNULLA</md-button>
            </md-card-actions>
          </md-card>
        </form>
      </div>
    </div>
    </md-dialog-content>
  </md-dialog>
</template>

<script>
  export default {
    Name: 'nuovoVigile',
    props: {
      data: {
        type: Boolean
      }
    },
    data: function(){
      console.log(this.data);
      return {
        isActive: this.data
      }
    },
    methods: {
      clicked(){
        this.data.nuovoVigileON = false;
      },
      close(){
        this.isActive = false;
        this.$emit('nuovoVigileClosed');
      }
    }
  }
</script>

<style>
  .style-dialog{
    width:100vw!important;
    height:100vh!important;
  }
</style>
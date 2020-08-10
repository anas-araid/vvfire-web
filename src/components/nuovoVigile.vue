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
                    <label for="name">Nome</label>
                    <md-input type="text" name="name" id="name" v-model="nome" autocomplete="name" maxlength="50" required/>
                    <span class="md-error">Inserire il nome del vigile</span>
                  </md-field>
                  <md-field>
                    <md-icon class="style-red-text">account_circle</md-icon>
                    <label for="surname">Cognome</label>
                    <md-input type="text" name="surname" id="surname" v-model="cognome" autocomplete="surname" maxlength="50" required/>
                    <span class="md-error">Inserire il cognome del vigile</span>
                  </md-field>
                  <md-field>
                    <md-icon class="style-red-text">call</md-icon>
                    <label for="phone">Numero di cellulare</label>
                    <md-input type="text" name="phone" id="phone" v-model="telefono" autocomplete="phone" maxlength="50" required/>
                    <span class="md-error">Inserire numero di cellulare</span>
                  </md-field>
                  <md-field>
                    <md-icon class="style-red-text">email</md-icon>
                    <label for="email">Email</label>
                    <md-input type="email" name="email" id="email" autocomplete="email" v-model="email"  required/>
                    <span class="md-error">Inserire l'email</span>
                  </md-field>
                  <md-field>
                    <md-icon class="style-red-text">grade</md-icon>
                    <label for="grado">Grado</label>
                    <md-select v-model="selectedGrado" name="grado" id="grado" :value="selectedGrado">
                      <md-option v-for="selectedGrado in this.gradi" :key="selectedGrado.id" :value="selectedGrado.id">
                        {{selectedGrado.name}}
                      </md-option>
                    </md-select>
                  </md-field>
                  <div class="input" style="text-align:left">
                    <md-checkbox v-model="autista" id="autista" true-value="true" false-value="false">Autista (patente C)</md-checkbox>
                  </div>
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
  import gradoController from '../controllers/gradoController.js';


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
        isActive: this.data,
        nome: null,
        cognome: null,
        email: null,
        telefono: null,
        autista: false,
        gradi: [],
        selectedGrado: null,
        message: {'active': false, 'content': null, 'url': null}
      }
    },
    beforeCreate(){
      gradoController.getGradi().then((response) => {
        let data = response.data;
        console.log(data)
        if (data.length !== 0){
          this.gradi = data;
        }
      });
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
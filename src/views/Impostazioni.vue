<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center" style="min-height:500px;height:100%">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
      <div class="md-layout-item md-large-size-80 md-medium-size-100 md-small-size-50 md-xsmall-size-100" style="text-align:center">
        <form class="md-layout" @submit.prevent="">
          <md-card class="md-layout-item md-size-90 md-small-size-100" >
            <md-progress-bar v-if="this.loading" class="md-accent" md-mode="indeterminate"></md-progress-bar>
            <md-card-header>
              <div class="md-title">Impostazioni</div>
            </md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <md-icon class="style-red-text">location_city</md-icon>
                    <label for="caserma">Caserma</label>
                    <md-input type="text" name="caserma" id="caserma" autocomplete="caserma" v-model="caserma" :disabled="loading" maxlength="50" required/>
                    <span class="md-error">Inserire il nome della caserma</span>
                  </md-field>
                  <md-field>
                    <md-icon class="style-red-text">phone</md-icon>
                    <label for="phone">Numero di telefono</label>
                    <md-input type="number" name="phone" id="phone" autocomplete="phone" v-model="phone" :disabled="loading" maxlength="50" required/>
                    <span class="md-error">Inserire il numero di telefono valido</span>
                  </md-field>
                  <md-field>
                    <md-icon class="style-red-text">email</md-icon>
                    <label for="email">Email</label>
                    <md-input type="email" name="email" id="email" autocomplete="email" v-model="email" :disabled="loading" maxlength="150" required/>
                    <span class="md-error">Inserire un'email valida</span>
                  </md-field>
                  <md-field>
                    <md-icon class="style-red-text">vpn_key</md-icon>
                    <label for="password">Password</label>
                    <md-input v-model="password" type="password" name="password" id="password" :disabled="loading" maxlength="50" required></md-input>
                  </md-field>
                  <md-field>
                    <md-icon class="style-red-text">vpn_key</md-icon>
                    <label for="confermaPassword">Conferma password</label>
                    <md-input v-model="confermaPassword" type="password" name="confermaPassword" id="confermaPassword" :disabled="loading" maxlength="50" required></md-input>
                  </md-field>
                </div>
              </div>
            </md-card-content>
            <md-card-actions>
              <md-button type="submit" class="md-accent" :disabled="loading">AGGIORNA</md-button>
            </md-card-actions>
          </md-card>
        </form>
      </div>
    </div>
  </md-app-content>
</template>

<script>
  // @ is an alias to /src
  import DialogAlert from '../components/Dialog.vue'; 
  
  export default {
    name: 'Impostazioni',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null},
      email: "",
      password: "",
      caserma: "",
      phone:"",
      confermaPassword:""
    }),
    components: {
      'Dialog': DialogAlert
    }
  }
</script>
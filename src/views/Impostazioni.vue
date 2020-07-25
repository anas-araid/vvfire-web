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
                    <label for="email">Email</label>
                    <md-input type="email" name="email" id="email" autocomplete="email" v-model="email" :disabled="loading" required/>
                    <span class="md-error">The last name is required</span>
                  </md-field>
                  <md-field>
                    <label for="password">Password</label>
                    <md-input v-model="password" type="password" name="password" id="password" :disabled="loading" required></md-input>
                  </md-field>
                </div>
              </div>
            </md-card-content>
            <md-card-actions>
              <md-button type="submit" class="md-accent" :disabled="loading">Salva</md-button>
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
      password: ""
    }),
    components: {
      'Dialog': DialogAlert
    }
  }
</script>
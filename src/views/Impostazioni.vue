<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
      <div class="md-layout-item md-large-size-80 md-medium-size-100 md-small-size-50 md-xsmall-size-100" style="text-align:center">
        <form class="md-layout" @submit.prevent="updateData()">
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
                  <md-field v-bind:class="{'md-invalid': checkPassword()}">
                    <md-icon class="style-red-text">vpn_key</md-icon>
                    <label for="password">Password</label>
                    <md-input v-model="password" type="password" name="password" id="password" :disabled="loading" maxlength="50" required></md-input>
                    <span class="md-error">Le password non corrispondono</span>
                  </md-field>
                  <md-field v-bind:class="{'md-invalid': checkPassword()}">
                    <md-icon class="style-red-text">vpn_key</md-icon>
                    <label for="confermaPassword">Conferma password</label>
                    <md-input v-model="confermaPassword" type="password" name="confermaPassword" id="confermaPassword" :disabled="loading" maxlength="50" required></md-input>
                    <span class="md-error">Le password non corrispondono</span>
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
    <br>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item md-large-size-80 md-medium-size-100 md-small-size-50 md-xsmall-size-100" style="text-align:center">
        <form class="md-layout" @submit.prevent="deleteAccount()">
          <md-card class="md-layout-item md-size-90 md-small-size-100" >
            <md-card-header>
              <div class="md-title style-red-text">Elimina account</div>
            </md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <md-icon class="style-red-text">vpn_key</md-icon>
                    <label for="passwordDeleteForm">Password</label>
                    <md-input v-model="passwordDeleteForm" type="password" name="passwordDeleteForm" id="passwordDeleteForm" maxlength="50" required></md-input>
                  </md-field>
                </div>
              </div>
            </md-card-content>
            <md-card-actions>
              <md-button type="submit" class="md-raised md-accent">RIMUOVI DEFINITIVAMENTE</md-button>
            </md-card-actions>
          </md-card>
        </form>
      </div>
    </div>
    <br>
  </md-app-content>
</template>

<script>
  // @ is an alias to /src
  import DialogAlert from '../components/Dialog.vue'; 
  import corpovvfController from '../controllers/corpovvfController.js';
  import loginController from '../controllers/loginController.js';
  import md5 from 'md5';
  
  export default {
    name: 'Impostazioni',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null, 'url': null},
      corpoID: "",
      email: "",
      password: "",
      caserma: "",
      phone:"",
      confermaPassword:"",
      passwordDeleteForm:""
    }),
    components: {
      'Dialog': DialogAlert
    },
    mounted(){
      this.loading = true;
      let loggedEmail = loginController.getCorpoVVFData()['email'];
      corpovvfController.getCorpoData(loggedEmail).then((response) => {
        let raw = response.data[0];
        if (!raw['error']){
          let data = raw.corpovvf[0];
          this.corpoID = data.id;
          this.email = data.email;
          this.caserma = data.name;
          this.phone = data.phone;
          this.loading = false;
        }else{
          switch(raw['error']){
            case '401':
              this.dialog('Errore', 'Accesso non autorizzato, credenziali non valide, rieffettuare l\'accesso', '#/dashboard');
              break; 
            case '404':
              this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/dashboard');
              break;
          }
        }
      }, (error) => {
        console.log(error);
        this.dialog('Errore', 'Controllare la connessione di rete, se il problema persiste contattare l\'amministratore', '#/dashboard');
      });
    },
    methods: {
      checkPassword(){
        return (this.password !== this.confermaPassword)
      },
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      },
      updateData(){
        this.loading = true;
        if (this.checkPassword()){
          this.dialog('Errore', 'Le password non corrispondono', '#/impostazioni');
          this.loading = false;
          return;
        }
        if (this.caserma === null  ||
            this.phone === null    ||
            this.email === null    ||
            this.password === null ||
            this.confermaPassword === null){
          this.dialog('Errore', 'Inserire tutti i campi', '#/impostazioni');
          this.loading = false;
          return;
        }
        corpovvfController.updateCorpovvf(this.corpoID, this.caserma, this.phone, this.email, md5(this.password)).then((response) => {
          let raw = response.data[0];
          if (!raw['error']){
            let data = raw.corpovvf;
            this.corpoID = data.id;
            this.email = data.email;
            this.caserma = data.name;
            this.phone = data.phone;
            this.loading = false;
          }else{
            switch(raw['error']){
              case '401':
                this.dialog('Errore', 'Accesso non autorizzato, credenziali non valide, rieffettuare l\'accesso', '#/dashboard');
                break; 
              case '404':
                this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/impostazioni');
                break;
            }
          }
        }, (error) => {
          console.log(error);
          this.dialog('Errore', 'Controllare la connessione di rete, se il problema persiste contattare l\'amministratore', '#/dashboard');
        });
        // cancello le password dalla form
        this.password = null;
        this.confermaPassword = null;
      },
      deleteAccount(){
        this.dialog('Attenzione', 'I dati verranno cancellati definitivamente, non sarà poi possibile recuperarli.', false);
      }
    },
  }
</script>
<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
      <div class="md-layout-item md-large-size-80 md-medium-size-100 md-small-size-50 md-xsmall-size-100" style="text-align:center;">
        <vue-cal
          v-if="!this.loading"
          :time-from="7 * 60"
          :time-to="23 * 60"
          :disable-views="['years', 'year']"
          locale="it"
          :events="events"
          :on-event-click="onEventClick"
          style="max-height:600px;">
        </vue-cal>
        <div v-else>
          <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
        </div>
      </div>
    </div>
    <br>
  </md-app-content>
</template>

<script>
  // @ is an alias to /src
  import DialogAlert from '../components/Dialog.vue'; 
  import VueCal from 'vue-cal'
  import 'vue-cal/dist/vuecal.css'
  import 'vue-cal/dist/i18n/it.js'
  import reperibilitaController from '../controllers/reperibilitaController.js';
  import vigileController from '../controllers/vigileController.js';

  export default {
    name: 'Reperibilita',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null, 'url': null},
      events: [],
      selectedEvent: null
    }),
    components: {
      'Dialog': DialogAlert,
      'vue-cal': VueCal
    },
    mounted(){
      this.loading = true;
      reperibilitaController.getDisponiblita().then((response) => {
        let raw = response.data[0];
        if (!raw.error){
          // contiene tuttle le reperibilità dei vigili della caserma loggata
          let listaDisponibilita = raw.disponibilita;
          for (let i=0; i< listaDisponibilita.length; i++){
            // per ogni reperibilità nella lista, estraggo i dati del vigile tramite il suo id
            vigileController.getVigileByID(listaDisponibilita[i].fkVigile).then((vigileResponse) => {
              let rawVigile = vigileResponse.data[0];
              if (!rawVigile['error']){
                let vigile = rawVigile.vigile[0];
                // queste opzioni servono per stabilire lo standard della libreria del calendario
                var options = { hour12: false, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' };
                this.events.push({
                  id: listaDisponibilita[i].id,
                  start: new Date(listaDisponibilita[i].startTime).toLocaleString('en', options).replace(/,/,''),
                  end: new Date(listaDisponibilita[i].endTime).toLocaleString('en', options).replace(/,/,''),
                  title: vigile.name + ' ' + vigile.surname,
                  contentFull: vigile.phone,
                  class: 'style-event-color'
                })
                this.loading = false;
              }else{
                switch(raw['error']){
                  case '401':
                    this.dialog('Errore', 'Accesso non autorizzato, credenziali non valide, rieffettuare l\'accesso', '#/dashboard');
                    this.loading = false;
                    break; 
                  case '404':
                    this.dialog('Errore', 'Il server non ha restituito i dati, contatta l\' amministratore', '#/reperibilita');
                    this.loading = false;
                    break;
                }
              }
            });
          }
        }
      });
    },
    methods: {
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      },
      onEventClick (event, e) {
        this.selectedEvent = event
        console.log(this.selectedEvent);
        let content = "Vigile: " + this.selectedEvent.title + " | Numero di telefono: " + this.selectedEvent.contentFull;
        this.dialog('Dettagli', content, false);
        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation()
      }
    },
  }
</script>
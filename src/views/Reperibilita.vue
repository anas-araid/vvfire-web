<template>
  <md-app-content style="height:100%;border:none">
    <div class="md-layout md-alignment-center-center">
      <Dialog v-if="this.message.active" :data="this.message"></Dialog>
      <div class="md-layout-item md-large-size-80 md-medium-size-100 md-small-size-50 md-xsmall-size-100" style="text-align:center;">
        <vue-cal
          :time-from="7 * 60"
          :time-to="23 * 60"
          :disable-views="['years', 'year']"
          locale="it"
          :events="events"
          style="max-height:600px;">
        </vue-cal>
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

  export default {
    name: 'Reperibilita',
    data: () => ({
      showNavigation: false,
      loading: false,
      message: {'active': false, 'content': null, 'url': null},
      events: [
        {
          id:'2',
          start: '2020-8-19 10:30',
          end: '2020-8-19 12:30',
          title: 'Anas Araid',
          class: 'style-event-color'
        },
        {
          id:'3',
          start: '2020-8-19 10:30',
          end: '2020-8-19 16:30',
          title: 'Asdf asd',
          class: 'style-event-color'
       },
        {
          start: '2020-8-19 18:30',
          end: '2020-8-19 19:30',
          title: 'Asdf asd',
          class: 'style-event-color'
        }
      ]
    }),
    components: {
      'Dialog': DialogAlert,
      'vue-cal': VueCal
    },
    mounted(){
      
    },
    methods: {
      dialog(title, message, url){
        this.message.active = true;
        this.message.title = title;            
        this.message.content = message;
        this.message.url = url;         
      }
    },
  }
</script>
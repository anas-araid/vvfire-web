<template>
  <md-app-content style="height:100%;border:none">
      <div class="md-layout md-alignment-center-center">
        <Dialog v-if="this.message.active" :data="this.message"></Dialog>
      </div>
  </md-app-content>
</template>

<script>
  import DialogAlert from '../components/Dialog.vue'; 

export default {
  name: 'RicercaPersona',
  data: () => ({
    showNavigation: false,
    loading: false,
    message: {'active': false, 'content': null, 'url': null},
    events: [],
    selectedEvent: null
  }),
  components: {
    'Dialog': DialogAlert,
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
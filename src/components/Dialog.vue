<template>
  <md-dialog 
    :md-active.sync="data.active"
    :md-click-outside-to-close="false"
    :md-close-on-esc="false">
    <md-dialog-title>{{this.data.title}}</md-dialog-title>
    <md-dialog-content>{{this.data.content}}</md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-accent" @click="clicked()">OK</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  export default {
    Name: 'Dialog',
    props: {
      data: {
        type: Object
      }
    },
    methods: {
      clicked(){
        this.data.active = false;
        if (this.data.url !== false){
          window.location.href = this.data.url;
        }
      }
    }
  }
</script>
<template>
  <md-dialog :md-active.sync="data.active">
    <md-dialog-title>{{this.data.title}}</md-dialog-title>
    <md-dialog-content>{{this.data.content}}</md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-accent" @click="data.active = false">Close</md-button>
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
    }
  }
</script>
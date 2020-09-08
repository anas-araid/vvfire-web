import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueSession from 'vue-session'
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

Vue.config.productionTip = false

Vue.use(VueMaterial)
var options = {
    persist: true
}
Vue.use(VueSession, options)

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

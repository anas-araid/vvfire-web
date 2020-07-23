//import axios from 'axios'
import Vue from 'vue'

export default{
  logout() {
    Vue.prototype.$session.destroy()
  },
  saveData(corpoVVF, token){
    Vue.prototype.$session.set('vvfire_jwt', {token: token, timestamp: new Date().getTime()})
    Vue.prototype.$session.set('vvfire_data', corpoVVF)
  },
  getCorpoVVFData(){
    return Vue.prototype.$session.get('vvfire_data');
  },
  isTokenValid(){
    let token = Vue.prototype.$session.get("vvfire_token");
    if (token == false || token == null){
      return false;
    }
    let days = this.timeDifference(new Date().getTime(), token.timestamp);
    // se days è maggiore di 0 vuol dire che il token è scaduto
    if (days > 0){
      this.logout()
      return false;
    }
    return true;
  },
  timeDifference(time1,time2) {
    var difference = time1 - time2;
    var daysDifference = Math.floor(difference/1000/60/60/24);
    return daysDifference;
  }
}
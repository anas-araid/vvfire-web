//import axios from 'axios'

export default{
  timeDifference(time1,time2) {
    var difference = time1 - time2;
    var daysDifference = Math.floor(difference/1000/60/60/24);
    return daysDifference;
  },
  setToken(tokenString){
    // token scade dopo 1 giorno
    var token = {token: tokenString, timestamp: new Date().getTime()} 
    localStorage.setItem("vvfire_token", JSON.stringify(token));
  },
  removeData(){
    localStorage.removeItem("vvfire_token");
    localStorage.removeItem("vvfire_corpoVVF");
  },
  saveData(corpoVVF, token){
    this.setCorpoVVFData(corpoVVF);
    this.setToken(token);
  },
  setCorpoVVFData(corpoVVF){
    localStorage.setItem('vvfire_corpoVVF', JSON.stringify(corpoVVF));
  },
  getCorpoVVFData(){
    return JSON.parse(localStorage.getItem("vvfire_corpoVVF"));
  },
  isTokenValid(){
    let token = JSON.parse(localStorage.getItem("vvfire_token"));
    let days = this.timeDifference(new Date().getTime(), token.timestamp);
    // se days è maggiore di 0 vuol dire che il token è scaduto
    if (days > 0){
      this.removeData();
      return false;
    }
    return true;
  }

}
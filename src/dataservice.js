import axios from 'axios'

export default{
  function timeDifference(time1,time2) {
    var difference = time1 - time2; console.log(difference)
    var daysDifference = Math.floor(difference/1000/60/60/24);
    return daysDifference;
  },
  setToken(tokenString){
    // token scade dopo 1 giorno
    var token = {token: tokenString, timestamp: new Data().getTime()} 
    localStorage.setItem("token", token);
  }
  removeToken(){
    localStorage.removeItem("token");
  }
  setCorpoVVFData(corpoVVF){

  }

}
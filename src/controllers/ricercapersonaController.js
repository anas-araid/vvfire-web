import loginController from '@/controllers/loginController.js';
import axios from 'axios';

export default {
  getRicercheByCorpo(id_corpo){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/ricercapersona/show', {
      idcorpo: id_corpo,
    }, {
    headers: {
      'Authorization': token
    }})
  },
  newRicerca(name, startTime, endTime, completed, fkCorpo){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/vigile/create', {
      name: name,
      startTime: startTime,
      endTime: endTime,
      completed: completed,
      fkCorpo: fkCorpo
    }, {
    headers: {
      'Authorization': token
    }})
  }
}
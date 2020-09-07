import loginController from '@/controllers/loginController.js';
import axios from 'axios';

export default {
  getLatestUniquePosition(idRicerca, time){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/posizioni/get-latest-unique-positions', {
      fkRicerca: idRicerca,
      time: time
    }, {
    headers: {
      'Authorization': token
    }})
  },
  getListaVigili(idRicerca){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/posizioni/get-vigili-by-ricerca', {
      fkRicerca: idRicerca
    }, {
    headers: {
      'Authorization': token
    }})
  }
}
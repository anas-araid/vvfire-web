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
  getRicercaByID(idRicerca, idCorpo){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/ricercapersona/find-by-id', {
      id: idRicerca,
      fkCorpovvf: idCorpo
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
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/ricercapersona/create', {
      name: name,
      startTime: startTime,
      endTime: endTime,
      completed: completed,
      fkCorpovvf: fkCorpo
    }, {
    headers: {
      'Authorization': token
    }})
  },
  updateRicerca(id, name){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.patch(process.env.VUE_APP_API_SERVER + '/api/v1/ricercapersona/update', {
      id: id,
      name: name,
    }, {
    headers: {
      'Authorization': token
    }})
  },
  deleteRicerca(id){
    if (!loginController.isTokenValid()){
      return false;
    }
    let idCorpo = loginController.getCorpoVVFData()['id'];
    if (idCorpo === null || idCorpo === undefined){
      return false;
    }
    let token = loginController.getToken()['token']
    return axios.delete(process.env.VUE_APP_API_SERVER + '/api/v1/ricercapersona/delete', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data:{
        id: id,
        fkCorpovvf: idCorpo
      }
    });
  }
}
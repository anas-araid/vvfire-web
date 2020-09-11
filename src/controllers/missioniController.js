import loginController from '@/controllers/loginController.js';
import axios from 'axios';

export default {
  getMissioniByRicerca(idRicerca){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/missione/get-missioni-by-ricerca', {
      fkRicerca: idRicerca,
    }, {
    headers: {
      'Authorization': token
    }})
  },
  getMissioneById(idMissione, idCorpo){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/missione/find-by-id', {
      idMissione: idMissione,
      fkCorpovvf: idCorpo
    }, {
    headers: {
      'Authorization': token
    }})
  },
  newMissione(name, startTime, endTime, completed, fkRicerca){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/missione/create', {
      name: name,
      startTime: startTime,
      endTime: endTime,
      completed: completed,
      fkRicerca: fkRicerca
    }, {
    headers: {
      'Authorization': token
    }})
  },
  updateMissione(id, name){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.patch(process.env.VUE_APP_API_SERVER + '/api/v1/missione/update', {
      id: id,
      name: name,
    }, {
    headers: {
      'Authorization': token
    }})
  },
  deleteMissione(id){
    if (!loginController.isTokenValid()){
      return false;
    }
    let idCorpo = loginController.getCorpoVVFData()['id'];
    if (idCorpo === null || idCorpo === undefined){
      return false;
    }
    let token = loginController.getToken()['token']
    return axios.delete(process.env.VUE_APP_API_SERVER + '/api/v1/missione/delete', {
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
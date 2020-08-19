import loginController from '@/controllers/loginController.js';
import axios from 'axios';
import md5 from 'md5';

export default {
  getVigili(id_corpo){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/vigile/show', {
      idcorpo: id_corpo,
    }, {
    headers: {
      'Authorization': token
    }})
  },
  getVigileByID(idVigile){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/vigile/find-by-id', {
      id: idVigile,
    }, {
    headers: {
      'Authorization': token
    }})
  },
  newVigile(name, surname, phone, email, autista, admin, id_grado, idCorpo){
    let password = this.generateTemporaryPassword(email); 
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER + '/api/v1/vigile/create', {
      name: name,
      surname: surname,
      phone: phone,
      autista: autista,
      email: email,
      password: md5(password),
      fkGrado: id_grado,
      fkCorpovvf: idCorpo
    }, {
    headers: {
      'Authorization': token
    }})
  },
  updateVigile(id, name, surname, phone, email, autista, id_grado){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.patch(process.env.VUE_APP_API_SERVER + '/api/v1/vigile/update', {
      id: id,
      name: name,
      surname: surname,
      phone: phone,
      autista: autista,
      fkGrado: id_grado,
      email: email
    }, {
    headers: {
      'Authorization': token
    }})
  },
  deleteVigile(id){
    if (!loginController.isTokenValid()){
      return false;
    }
    let idCorpo = loginController.getCorpoVVFData()['id'];
    if (idCorpo === null || idCorpo === undefined){
      return false;
    }
    let token = loginController.getToken()['token']
    return axios.delete(process.env.VUE_APP_API_SERVER + '/api/v1/vigile/delete', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data:{
        id: id,
        fkCorpovvf: idCorpo
      }
    });
  },
  generateTemporaryPassword(email){
    return md5(email).substring(0,8);
  }
}
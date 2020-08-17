import loginController from '@/controllers/loginController.js';
import axios from 'axios';
import md5 from 'md5';

export default {
  getVigili(id_corpo){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.post('http://localhost:1337/api/v1/vigile/show', {
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
    return axios.post('http://localhost:1337/api/v1/vigile/find-by-id', {
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
    return axios.post('http://localhost:1337/api/v1/vigile/create', {
      name: name,
      surname: surname,
      phone: phone,
      autista: autista,
      email: email,
      password: password,
      fkGrado: id_grado,
      fkCorpovvf: idCorpo
    }, {
    headers: {
      'Authorization': token
    }})
  },
  updateVigile(id, name, surname, phone, email, autista, admin, id_grado, idCorpo, password){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token'];
    return axios.patch('http://localhost:1337/api/v1/vigile/update', {
      id: id,
      name: name,
      surname: surname,
      phone: phone,
      autista: autista,
      fk_grado: id_grado,
      email: email,
      password: password,
      fkCorpovvf: idCorpo
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
    console.log(id)
    console.log(idCorpo)
    let token = loginController.getToken()['token']
    return axios.delete('http://localhost:1337/api/v1/vigile/delete', {
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
//import Vue from 'vue';
import loginController from '@/controllers/loginController.js';
import axios from 'axios';

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
  deleteCorpovvf(id, password){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token']
    return axios.delete('http://localhost:1337/api/v1/corpovvf/delete', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data:{
        id: id,
        password: password
      }
    });
  }
}
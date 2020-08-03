//import Vue from 'vue';
import loginController from '@/controllers/loginController.js';
import axios from 'axios';

export default {
  getCorpoData(email){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token']
    return axios.post('http://localhost:1337/api/v1/corpovvf/find-by-email', {
      email: email,
    }, {
    headers: {
      'Authorization': token
    }})
  },
  updateCorpovvf(id, name, phone, email, password){
    if (!loginController.isTokenValid()){
      return false;
    }
    let token = loginController.getToken()['token']
    return axios.patch('http://localhost:1337/api/v1/corpovvf/update', {
      id: id,
      name: name,
      phone: phone,
      email: email,
      password: password
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
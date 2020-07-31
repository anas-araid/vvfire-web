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
  }
}
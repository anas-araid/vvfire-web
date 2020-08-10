import loginController from '@/controllers/loginController.js';
import axios from 'axios';

export default{
  getGradi(){
    let token = loginController.getToken()['token'];
    return axios.get('http://localhost:1337/api/v1/grado/show', {
      headers: {
        'Authorization': token
      }
    })
  }
}
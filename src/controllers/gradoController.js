import loginController from '@/controllers/loginController.js';
import axios from 'axios';

export default{
  getGradi(){
    let token = loginController.getToken()['token'];
    return axios.get(process.env.VUE_APP_API_SERVER+'/api/v1/grado/show', {
      headers: {
        'Authorization': token
      }
    })
  },
  getGradoByID(id){
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER+'/api/v1/grado/find-by-id', {
      id: id
    }, {
    headers: {
      'Authorization': token
    }})
  }
}
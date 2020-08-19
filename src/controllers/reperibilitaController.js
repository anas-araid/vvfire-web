import loginController from '@/controllers/loginController.js';
import axios from 'axios';

export default {
  getDisponiblita(){
    if (!loginController.isTokenValid()){
      return false;
    }
    let idCorpo = loginController.getCorpoVVFData()['id'];
    let token = loginController.getToken()['token'];
    return axios.post(process.env.VUE_APP_API_SERVER+'/api/v1/disponibilita/show', {
      idcorpo: idCorpo,
    }, {
    headers: {
      'Authorization': token
    }})
  }
}
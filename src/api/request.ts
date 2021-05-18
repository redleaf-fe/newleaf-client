import { Message } from 'redleaf-rc';
import axios from 'axios';

const req = function ({ url, method = 'get', data = {} }) {
  return axios({
      url,
      method,
      headers: { 'Content-Type': 'application/json' },
      // window.location.host
      // http://localhost:3011
      baseURL: 'http://localhost:3011',
      data,
    })
    .then((res) => {
      if (res.status === 200 && res.statusText === 'OK') return res.data;
    })
    .catch((err) => {
      Message.show({ content: err.response.data.message });
    });
};

export default req;

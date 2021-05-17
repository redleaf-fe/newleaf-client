import { Message } from 'redleaf-rc';
import axios from 'axios';

const req = function ({ url, method = 'get', data = {} }) {
  const dataMap = {
    get: { params: data },
    post: data,
  };
  return axios[method](url, {
    // window.location.host
    // http://localhost:3011
    baseURL: 'http://localhost:3011',
    ...dataMap[method],
  })
    .then((res) => {
      if (res.status === 200 && res.statusText === 'OK') return res.data;
    })
    .catch((err) => {
      Message.show({ content: String(err) });
    });
};

export default req;

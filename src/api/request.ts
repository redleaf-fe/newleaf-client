import { Message } from 'redleaf-rc';
import axios from 'axios';

export default function ({ url, method = 'get', data = {} }: { url: string; method?: 'get' | 'post'; data?: any }) {
  return axios({
    url,
    method,
    headers: { 'Content-Type': method === 'post' ? 'application/json' : 'text/plain' },
    // window.location.host
    // http://localhost:3012
    baseURL: 'http://localhost:3012',
    data,
    params: data,
  })
    .then((res) => {
      if (res.status === 200 && res.statusText === 'OK') {
        return res.data;
      }
      return res;
    })
    .catch((err) => {
      const res = err.response;
      if ([301, 302].includes(res.status)) {
        window.location.href = `/#${res.data.redirectUrl}`;
      } else {
        throw err.response.data;
      }
    });
}

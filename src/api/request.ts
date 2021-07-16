import axios from 'axios';

axios.defaults.withCredentials = true;

export default function ({ url, method = 'get', data = {} }: { url: string; method?: 'get' | 'post'; data?: any }) {
  const param = {
    // window.location.host
    // http://localhost:3012
    baseURL: 'http://localhost:3012',
    method,
    url,
  };

  if (method === 'get') {
    param.params = data;
    param.headers = { 'Content-Type': 'text/plain' };
  } else if (method === 'post') {
    param.data = data;
    param.headers = { 'Content-Type': 'application/json' };
  }

  return axios(param)
    .then((res) => {
      if (res.status === 200 && res.statusText === 'OK') {
        return res.data;
      }
      return res;
    })
    .catch((err) => {
      const res = err.response;
      if ([301, 302].includes(+res.status)) {
        window.location.href = res.data.redirectUrl;
      } else {
        throw err.response.data;
      }
    });
}

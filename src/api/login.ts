import req from './request';

const prefix = 'login';

export const login = (data) => req({ url: `${prefix}/login`, method: 'post', data });

export const register = (data) => req({ url: `${prefix}/register`, method: 'post', data });

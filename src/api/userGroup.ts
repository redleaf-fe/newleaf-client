import req from './request';

const prefix = 'userGroup';

export const getAuthList = (data) => req({ url: `${prefix}/list`, data });

export const saveAuth = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const deleteAuth = (data) => req({ url: `${prefix}/delete`, method: 'post', data });

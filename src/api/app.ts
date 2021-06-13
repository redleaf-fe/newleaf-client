import req from './request';

const prefix = 'app';

export const getAppList = (data) => req({ url: `${prefix}/list`, data });

export const saveApp = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const deleteApp = (data) => req({ url: `${prefix}/delete`, method: 'post', data });

export const appDetail = (data) => req({ url: `${prefix}/detail`, data });

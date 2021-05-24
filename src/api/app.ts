import req from './request';

const prefix = 'app';

export const getAppList = () => req({ url: `${prefix}/list` });

export const getAppIDs = () => req({ url: `${prefix}/ids` });

export const saveApp = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const appDetail = (data) => req({ url: `${prefix}/detail`, data });

import req from './request';

const prefix = 'app';

export const getAppList = (data) => req({ url: `${prefix}/list`, data });

export const saveApp = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const getAppDetail = (data) => req({ url: `${prefix}/detail`, data });

export const saveMember = (data) => req({ url: `${prefix}/saveMember`, data });

export const deleteMember = (data) => req({ url: `${prefix}/deleteMember`, data });

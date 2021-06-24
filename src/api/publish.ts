import req from './request';

const prefix = 'publish';

export const getPubishList = (data) => req({ url: `${prefix}/list`, data });

export const savePublish = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const publishDetail = (data) => req({ url: `${prefix}/detail`, data });

import req from './request';

const prefix = 'appPublish';

export const getPubishList = (data) => req({ url: `${prefix}/list`, data });

export const savePublish = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const deletePublish = (data) => req({ url: `${prefix}/delete`, method: 'post', data });

export const publishDetail = (data) => req({ url: `${prefix}/detail`, data });

import req from './request';

const prefix = 'publish';

export const getPublishList = (data) => req({ url: `${prefix}/list`, data });

export const savePublish = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const publishDetail = (data) => req({ url: `${prefix}/detail`, data });

export const build = (data) => req({ url: `${prefix}/build`, method: 'post', data });

export const publish = (data) => req({ url: `${prefix}/publish`, method: 'post', data });

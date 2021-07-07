import req from './request';

const prefix = 'approve';

export const saveProto = (data) => req({ url: `${prefix}/saveProto`, method: 'post', data });

export const getProto = (data) => req({ url: `${prefix}/getProto`, data });


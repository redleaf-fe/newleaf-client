import req from './request';

const prefix = 'approve';

export const saveProto = (data) => req({ url: `${prefix}/saveProto`, method: 'post', data });

export const getProto = (data) => req({ url: `${prefix}/getProto`, data });

export const saveIns = (data) => req({ url: `${prefix}/saveIns`, method: 'post', data });

export const getIns = (data) => req({ url: `${prefix}/getIns`, data });

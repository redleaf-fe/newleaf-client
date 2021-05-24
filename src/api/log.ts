import req from './request';

const prefix = 'log';

export const getLog = (data) => req({ url: `${prefix}/get`, data });

import req from './request';

const prefix = 'sourceMap';

export const query = (data) => req({ url: `${prefix}/query`, data });


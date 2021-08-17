import req from './request';

const prefix = 'dashboard';

export const getDashboard = (data) => req({ url: `${prefix}/get`, data });

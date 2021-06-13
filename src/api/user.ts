import req from './request';

const prefix = 'user';

export const getUserByName = (data) => req({ url: `${prefix}/getByName`, data });

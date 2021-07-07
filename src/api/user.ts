import req from './request';

const prefix = 'user';

export const getUserByName = (data) => req({ url: `${prefix}/getByName`, data });

export const getMembersInNamespace = (data) => req({ url: `${prefix}/getMembersInNamespace`, data });

export const saveUserToNamespace = (data) => req({ url: `${prefix}/saveUserToNamespace`, method: 'post', data });

export const removeUserFromNamespace = (data) => req({ url: `${prefix}/removeUserFromNamespace`, method: 'post', data });

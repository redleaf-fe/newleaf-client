import req from './request';

const prefix = 'user';

export const getUserByName = (data) => req({ url: `${prefix}/getByName`, data });

export const getMembersInNamespace = (data) => req({ url: `${prefix}/getMembersInNamespace`, data });

export const saveUsersToNamespace = (data) => req({ url: `${prefix}/saveUsersToNamespace`, method: 'post', data });

export const removeUserFromNamespace = (data) => req({ url: `${prefix}/removeUserFromNamespace`, method: 'post', data });

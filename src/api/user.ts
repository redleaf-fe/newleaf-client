import req from './request';

const prefix = 'user';

export const getUserByName = (data) => req({ url: `${prefix}/getByName`, data });

export const getMembersInApp = (data) => req({ url: `${prefix}/getMembersInApp`, data });

export const saveUserToApp = (data) => req({ url: `${prefix}/saveUserToApp`, method: 'post', data });

export const removeUserFromApp = (data) => req({ url: `${prefix}/removeUserFromApp`, method: 'post', data });

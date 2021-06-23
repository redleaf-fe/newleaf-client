import req from './request';

const prefix = 'group';

export const getGroupList = (data) => req({ url: `${prefix}/list`, data });

export const getGroupDetail = (data) => req({ url: `${prefix}/detail`, data });

export const saveGroup = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const saveMember = (data) => req({ url: `${prefix}/saveMember`, data });

export const deleteMember = (data) => req({ url: `${prefix}/deleteMember`, data });

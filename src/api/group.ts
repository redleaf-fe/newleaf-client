import req from './request';

const prefix = 'group';

export const getGroupList = (data) => req({ url: `${prefix}/list`, data });

export const getGroupDetail = (data) => req({ url: `${prefix}/detail`, data });

export const saveGroup = (data) => req({ url: `${prefix}/save`, method: 'post', data });

// 应用操作
export const getAppInGroup = (data) => req({ url: `${prefix}/getAppInGroup`, data });

export const shareAppWithGroup = (data) => req({ url: `${prefix}/shareAppWithGroup`, method: 'post', data });

export const delShareAppWithGroup = (data) => req({ url: `${prefix}/delShareAppWithGroup`, method: 'post', data });

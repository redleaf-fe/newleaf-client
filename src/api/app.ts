import req from './request';

const prefix = 'app';

export const getAppByName = (data) => req({ url: `${prefix}/getByName`, data });

export const getAllApp = (data?) => req({ url: `${prefix}/all`, data });

export const getAppList = (data) => req({ url: `${prefix}/list`, data });

export const saveApp = (data) => req({ url: `${prefix}/save`, method: 'post', data });

export const getAppDetail = (data) => req({ url: `${prefix}/detail`, data });

export const getAppBranch = (data) => req({ url: `${prefix}/branch`, data });

export const getAppCommit = (data) => req({ url: `${prefix}/commit`, data });


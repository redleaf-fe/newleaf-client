import req from './request';

const prefix = 'config';

export const getTables = () => req({ url: `${prefix}/get-tables` });
export const createTables = () => req({ url: `${prefix}/create-tables` });
export const getDatabases = () => req({ url: `${prefix}/get-databases` });
export const createDatabases = () => req({ url: `${prefix}/create-databases` });

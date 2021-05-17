import req from './request';

const prefix = 'config';

export const getDatabaseConfig = () => req({ url: `${prefix}/get-database-config` });

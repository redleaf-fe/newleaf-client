import { runApp, IAppConfig } from 'ice';

const appConfig: IAppConfig = {
  router: {
    type: 'browser',
  },
  app: {
    rootId: 'ice-container',
  },
};

runApp(appConfig);

import Layout from '@/components/layout';

import Dashboard from '@/pages/Dashboard';
import App from '@/pages/App';
import Config from '@/pages/Config';
import Login from '@/pages/Login';

export default [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'app',
        component: App,
        children: [
          {
            path: 'list',
            component: AppList,
          },
        ],
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'config',
        component: Config,
      },
    ],
  },
];

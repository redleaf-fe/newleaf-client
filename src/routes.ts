import Layout from '@/components/layout';

import Dashboard from '@/pages/Dashboard';
import App from '@/pages/App';
import AppList from '@/pages/App/List';
import NotFound from '@/pages/NotFound';
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
      },
      {
        path: 'appList',
        component: AppList,
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        component: NotFound,
      },
    ],
  },
];

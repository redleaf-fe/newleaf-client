import Layout from '@/components/layout';

import Home from '@/pages/Home';
import Config from '@/pages/Config';
import Login from '@/pages/Login';

const routerConfig = [
  {
    path: '/',
    component: Layout,
    exact: true,
    children: [
      {
        path: '/home',
        component: Home,
      },
      {
        path: '/config',
        component: Config,
      },
    ],
  },
  {
    path: '/login',
    component: Login,
  },
];

export default routerConfig;

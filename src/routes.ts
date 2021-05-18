import Layout from '@/components/layout';

import Home from '@/pages/Home';
import Config from '@/pages/Config';
import Login from '@/pages/Login';

const routerConfig = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
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
];

export default routerConfig;

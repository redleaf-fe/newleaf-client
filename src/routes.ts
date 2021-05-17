import Home from '@/pages/Home';
import Config from '@/pages/Config';
import Layout from '@/components/layout';

const routerConfig = [
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

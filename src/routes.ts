// import { lazy } from 'ice';

import Layout from '@/components/layout';

// 直接加载
import Login from '@/pages/Login';
import AppList from '@/pages/App/List';
import LogList from '@/pages/Log/List';
import NotFound from '@/pages/NotFound';
// 懒加载
// const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '@/pages/Dashboard'));
import Dashboard from '@/pages/Dashboard';
import LogScript from '@/pages/Log/Script';

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
        path: 'appList',
        component: AppList,
      },
      {
        path: 'logList',
        component: LogList,
      },
      {
        path: 'LogScript',
        component: LogScript,
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

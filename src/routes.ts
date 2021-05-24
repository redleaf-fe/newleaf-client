// import { lazy } from 'ice';

import Layout from '@/components/layout';

// 直接加载
import Login from '@/pages/Login';
import App from '@/pages/App';
import AppList from '@/pages/App/List';
import Log from '@/pages/Log';
import NotFound from '@/pages/NotFound';
// 懒加载
// const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '@/pages/Dashboard'));
import Dashboard from '@/pages/Dashboard';
import ScriptGenerate from '@/pages/ScriptGenerate';

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
        path: 'scriptGenerate',
        component: ScriptGenerate,
      },
      {
        path: 'log',
        component: Log,
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

// import { lazy } from 'ice';

import Layout from '@/components/layout';

// 直接加载
import Login from '@/pages/Login';
import AppList from '@/pages/App';
import Approve from '@/pages/Approve';
import PublishList from '@/pages/Publish';
import BuildDetail from '@/pages/Publish/BuildDetail';
import LogList from '@/pages/Log/List';
import SourceMap from '@/pages/SourceMap';
import NotFound from '@/pages/NotFound';
// 懒加载
// const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '@/pages/Dashboard'));
import Dashboard from '@/pages/Dashboard';
import LogScript from '@/pages/Log/Script';

export default [
  {
    path: '/page/',
    component: Layout,
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'appList',
        component: AppList,
      },
      {
        path: 'approve',
        component: Approve,
      },
      {
        path: 'publishList',
        component: PublishList,
      },
      {
        path: 'buildDetail',
        component: BuildDetail,
      },
      {
        path: 'logList',
        component: LogList,
      },
      {
        path: 'logScript',
        component: LogScript,
      },
      {
        path: 'sourceMap',
        component: SourceMap,
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

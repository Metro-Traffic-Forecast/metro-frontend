import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/pages/Login/Login';
import ErrorPage from '@/pages/Error/Error';

import MLayout from "./components/MLayout/MLayout";
import Main from "@/MPages/Main/Main";

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        title: '登录'
      }
    },
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage,
      meta:{
        title: '出错了'
      }
    },
    {
      path: '/app',
      name: 'MLayout',
      component: MLayout,
      children: [
        {
          path: 'dashboard',
          name: 'Main',
          component: Main,
          meta: {
            title: '主页'
          }
        },
      ]
    },
    {
      path: '*',
      name: 'Error',
      component: ErrorPage,
    }
  ],
});

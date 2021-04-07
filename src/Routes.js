import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';
import Dashboard from '@/pages/Visits/Visits';
import Login from '@/pages/Login/Login';
import ErrorPage from '@/pages/Error/Error';

import Month from "@/pages/Month/Month";
import Metro from "@/pages/Metro/Metro";
import Section from "@/pages/Section/Section";

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage,
    },
    {
      path: '/app',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'month/:month',
          name: 'Month',
          component: Month,
        },
        {
          path: 'metro/:line',
          name: 'Metro',
          component: Metro,
        },
        {
          path: 'section',
          name: 'Section',
          component: Section
        }
      ],
    },
    {
      path: '*',
      name: 'Error',
      component: ErrorPage,
    }
  ],
});

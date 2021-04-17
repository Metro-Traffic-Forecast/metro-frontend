import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';
import Dashboard from '@/pages/Visits/Visits';
import Login from '@/pages/Login/Login';
import ErrorPage from '@/pages/Error/Error';

import Metro from "@/pages/Metro/Metro";
import MonthData from "@/pages/MonthData/MonthData";
import ODTransport from "@/pages/OD/ODTransport";
import InAndOutPassengerFlow from "@/pages/InAndOutPassengerFlow/InAndOutPassengerFlow";
import PeakAnalyse from "@/pages/PeakAnalyse/PeakAnalyse";
import WeekData from "@/pages/WeekData/WeekData";
import SectionAnalyse from "@/pages/SectionAnalyse/SectionAnalyse";
import StationForecast from "./pages/StationForecast/StationForecast";
import UserInfo from "@/pages/UserInfo/UserInfo";

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
          path: 'dataAnalyse/monthData',
          name: '每月信息统计',
          component:MonthData,
        },
        {
          path: 'dataAnalyse/weekData',
          name: '工作日/周末信息统计',
          component:WeekData,
        },
        {
          path: 'dataAnalyse/flowData',
          name: '出入站客流信息统计',
          component:InAndOutPassengerFlow,
        },
        {
          path: 'dataAnalyse/peakData',
          name: '早晚高峰信息统计',
          component:PeakAnalyse,
        },
        {
          path: 'dataAnalyse/ODData',
          name: '站点OD信息统计',
          component:ODTransport,
        },
        {
          path: 'dataAnalyse/sectionData',
          name: '断面信息统计',
          component:SectionAnalyse,
        },
        {
          path: 'userInfo',
          name: '用户年龄与性别统计',
          component:UserInfo,
        },
        {
          path: 'forecast/station',
          name: '站点客流预测',
          component:StationForecast,
        },
        {
          path: 'forecast/line',
          name: '线路客流预测',
          component:Metro,
        },
      ],
    },
    {
      path: '*',
      name: 'Error',
      component: ErrorPage,
    }
  ],
});

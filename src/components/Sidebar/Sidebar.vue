<template>
  <b-collapse class="sidebar-collapse" id="sidebar-collapse" :visible="sidebarOpened">
  <nav
    :class="{sidebar: true}"
  >
    <header class="logo">
      <router-link to="/app"><img src="../../assets/logo.png" width="30px" height="30px" alt="logo"/> &nbsp;<span class="fw-bold">基于Kafka和Spark的地铁客流实时分析预测平台</span></router-link>
    </header>
    <ul class="nav">
      <h5 class="navTitle">Map</h5>
      <NavLink :activeItem="activeItem"
        header="首页"
        link="/app/Dashboard"
        iconName="flaticon-home-3"
        index="dashboard"
        isHeader
      />
      <h5 class="navTitle">Data Analysis</h5>
      <NavLink
          :activeItem="activeItem"
          header="客流分析"
          link="/app/dataAnalyse"
          iconName="flaticon-list-3"
          index="dataAnalyse"
          :childrenLinks="[
          { header: '单月客流分析', link: '/app/dataAnalyse/monthData',},
          { header: '工作日/周末客流分析', link: '/app/dataAnalyse/weekData',},
          { header: '站点出/入站客流分析', link: '/app/dataAnalyse/flowData',},
          { header: '早/晚高峰客流分析', link: '/app/dataAnalyse/peakData',},
          { header: '站点OD分析', link: '/app/dataAnalyse/ODData',},
          { header: '线路断面客流分析', link: '/app/dataAnalyse/sectionData',},
        ]"
      />
      <NavLink
          :activeItem="activeItem"
          header="用户分析"
          link="/app/userInfo"
          iconName="flaticon-equal-3"
          index="user"
          isHeader
      />
      <h5 class="navTitle">Data Forecast</h5>
      <NavLink
          :activeItem="activeItem"
          header="客流预测"
          link="/app/forecast"
          iconName="flaticon-equal-3"
          index="forecast"
          is-header
          :childrenLinks="[
          { header: '站点客流预测', link: '/app/forecast/station'},
          { header: '线路客流预测', link: '/app/forecast/line'},
          ]"
      />
    </ul>
  </nav>
  </b-collapse>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import NavLink from './NavLink/NavLink';

export default {
  name: 'Sidebar',
  components: { NavLink },
  data() {
    return {
      alerts: [
        {
          id: 0,
          title: 'Sales Report',
          value: 15,
          footer: 'Calculating x-axis bias... 65%',
          color: 'primary',
        },
        {
          id: 1,
          title: 'Personal Responsibility',
          value: 20,
          footer: 'Provide required notes',
          color: 'danger',
        },
      ],
    };
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      this.changeSidebarActive(paths.join('/'));
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState('layout', {
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>

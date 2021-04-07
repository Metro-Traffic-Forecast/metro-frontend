<template>
  <b-collapse class="sidebar-collapse" id="sidebar-collapse" :visible="sidebarOpened">
  <nav
    :class="{sidebar: true}"
  >
    <header class="logo">
      <router-link to="/app"><img src="../../assets/logo.png" width="30px" height="30px" alt="logo"/> &nbsp;<span class="fw-bold">轨道交通智慧客流分析预测</span></router-link>
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
      <h5 class="navTitle">Data Statistics</h5>
      <NavLink
          :activeItem="activeItem"
          header="月份"
          link="/app/months"
          iconName="flaticon-list-3"
          index="months"
          :childrenLinks="[
          { header: 'Jan', link: '/app/month/1',},
          { header: 'Feb', link: '/app/month/2' },
          { header: 'Mar', link: '/app/month/3' },
          { header: 'Apr', link: '/app/month/4' },
          { header: 'May', link: '/app/month/5' },
          { header: 'Jun', link: '/app/month/6' },
          { header: 'Jul', link: '/app/month/7' },
          { header: 'Aug', link: '/app/month/8' },
          { header: 'Sep', link: '/app/month/9' },
          { header: 'Oct', link: '/app/month/10' },
          { header: 'Nov', link: '/app/month/11' },
          { header: 'Dec', link: '/app/month/12' },
        ]"
      />
      <NavLink
          :activeItem="activeItem"
          header="地铁线路"
          link="/app/lines"
          iconName="flaticon-equal-3"
          index="lines"
          :childrenLinks="[
          { header: 'Line-1', link: '/app/Metro/1'},
          { header: 'Line-2', link: '/app/Metro/2' },
          { header: 'Line-3', link: '/app/Metro/3' },
          { header: 'Line-4', link: '/app/Metro/4'},
          { header: 'Line-5', link: '/app/Metro/5' },
          { header: 'Line-10', link: '/app/Metro/10' },
          { header: 'Line-11', link: '/app/Metro/11'},
          { header: 'Line-12', link: '/app/Metro/12' },
        ]"
      />
      <h5 class="navTitle">Data Analysis</h5>
      <NavLink
          :activeItem="activeItem"
          header="断面分析"
          link="/app/section"
          iconName="flaticon-equal-3"
          index="lines"
          is-header
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

<template>
  <div>
    <Header />
    <router-view />
    <footer class="contentFooter">
      流量预测依靠2019-2020年数据分析结果
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Header from '@/components/Header/Header';


import './MLayout.scss';

export default {
  name: 'MLayout',
  components: {  Header },
  methods: {
    ...mapActions(
        'layout', ['switchSidebar', 'changeSidebarActive'],
    ),
  },
  computed: {
    ...mapState('layout', {
      //sidebarClose: state => state.sidebarClose,
    }),
  },
  created() {
  },
  mounted() {
    this.$refs.content.addEventListener('animationend', () => {
      this.$refs.content.classList.remove('animated');
      this.$refs.content.classList.remove('fadeInUp');
    });
  }
};
</script>

<style src="./MLayout.scss" lang="scss" />
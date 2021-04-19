<template>
  <router-view v-wechat-title="$route.meta.title"/>
</template>

<script>

export default {
  name: 'App',
  components:{

  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data() {
    return{
      isRouterAlive: true
    }
  },
  created() {
    const currentPath = this.$router.history.current.path;

    if (window.localStorage.getItem('authenticated') === 'false') {
      this.$router.push('/login');
    }

    if (currentPath === '/' || currentPath === '/app') {
      this.$router.push('/app/dashboard');
    }
  },
  methods:{
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      })
    },
  }
};
</script>

<style src="./styles/theme.scss" lang="scss" />

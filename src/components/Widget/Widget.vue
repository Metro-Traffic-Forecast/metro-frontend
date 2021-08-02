<template>
  <section :class="{
    widget: true,
    className,
    collapsed: state === 'collapse',
    fullscreened: state === 'fullscreen',
    loading: fetchingData
  }" ref="widget">
    <h5 v-if="title && typeof title === 'string' && !customHeader" class="title">{{title}}</h5>
    <header v-if="title && customHeader" class="title" v-html="title"></header>
    <div v-if="!customControls && mainControls"
      class="widgetControls widget-controls" style="padding-left: 20px;padding-bottom: 5px">
      <a v-if="settings" href="#"><i class="la la-cog" /></a>
      <a v-if="settingsInverse" href="#" class="bg-default mx-2">
        <i class="la la-cog text-white"/>
      </a>
      <a @click="loadWidgster($event)" v-if="refresh" href="#" :id="`reloadId-${randomId}`">
        <strong v-if="typeof refresh === 'string'" class="text-gray-light">{{refresh}}</strong>
        <i v-else class="la la-refresh"></i>
          <b-tooltip
            v-if="showTooltip"
            :placement="tooltipPlacement"
            :target="`reloadId-${randomId}`"
          >重载
          </b-tooltip>
      </a>
      <a @click="changeState($event, 'fullscreen')" v-if="fullscreen && state !== 'fullscreen'" href="#" :id="`fullscreenId-${randomId}`">
        <i class="la la-expand"></i>
        <b-tooltip
          v-if="showTooltip"
          :placement="tooltipPlacement"
          :target="`fullscreenId-${randomId}`"
        >全屏
        </b-tooltip>
      </a>
      <a @click="changeState($event, 'default')" v-if="fullscreen && state === 'fullscreen'" href="#" :id="`restoreId-${randomId}`">
        <i class="la la-compress"></i>
        <b-tooltip
          v-if="showTooltip"
          :placement="tooltipPlacement"
          :target="`restoreId-${randomId}`"
        >Restore
        </b-tooltip>
      </a>
      <span v-if="collapse && state !== 'collapse'">
        <a href="#" @click="changeState($event, 'collapse')" :id="`collapseId-${randomId}`">
          <i class="la la-angle-down"></i>
          <b-tooltip
            v-if="showTooltip"
            :placement="tooltipPlacement"
            :target="`collapseId-${randomId}`"
          >折叠
          </b-tooltip>
        </a>
      </span>
      <span v-if="collapse && state === 'collapse'">
        <a href="#" @click="changeState($event, 'default')" :id="`expandId-${randomId}`">
          <i class="la la-angle-up"></i>
          <b-tooltip
            v-if="showTooltip"
            :placement="tooltipPlacement"
            :target="`expandId-${randomId}`"
          >展开
          </b-tooltip>
        </a>
      </span>
      <a v-if="close" href="#" @click="closeWidget($event)" :id="`closeId-${randomId}`">
        <strong v-if="typeof refresh === 'string'" class="text-gray-light">{{close}}</strong>
        <i v-else class="la la-remove"></i>
        <b-tooltip
          v-if="showTooltip"
          :placement="tooltipPlacement"
          :target="`closeId-${randomId}`"
        >关闭
        </b-tooltip>
      </a>
    </div>
    <div v-if="customControls" v-html="customControls" ref="customControlsRef" class="widgetControls widget-controls"></div>
    <div :class="`widgetBody widget-body ${bodyClass}`" ref="widgetBodyRef"
          :style="{display: state === 'collapse' ? 'none' : ''}"
    >
      <Loader v-if="fetchingData && showLoader" :class="'widget-loader'" :size="40"></Loader>
      <slot v-else></slot>
    </div>
  </section>
</template>

<script>
import Loader from '../Loader/Loader';

export default {
  name: 'Widget',
  data: function() {
    return {
      state: this.collapsed ? 'collapse' : 'default'
    }
  },
  props: {
    //是否使用最原初的标题头
    customHeader: { type: Boolean, default: false },

    //提示框位置
    tooltipPlacement: { default: 'top' },

    //是否应用提示框
    showTooltip: { type: Boolean, default: false },

    //关闭当前组件
    close: { type: [Boolean, String], default: false },

    //全屏
    fullscreen: { type: [Boolean, String], default: false },

    //折叠内容
    collapse: { type: [Boolean, String], default: false },

    //设置(没有实际作用)
    settings: { type: [Boolean, String], default: false },

    //没有效果
    settingsInverse: { type: Boolean, default: false },

    //重新加载
    refresh: { type: [Boolean, String], default: false },

    //修该样式
    className: { default: '' },

    //标题
    title: { default: '' },

    //开启控制
    customControls: { default: null },

    //内容样式
    bodyClass: { default: '' },

    //???
    options: { default: () => ({}) },

    //是否正在准备数据（和正在加载一项联合使用）
    fetchingData: {type: Boolean, default: false},

    //正在加载
    showLoader: {type: Boolean, default: true},

    //起始折叠
    collapsed: {type: Boolean, default: false},

    //自动加载
    autoload: {type: [Boolean, Number], default: false}
  },
  components: { Loader },
  computed: {
    randomId() {
      return Math.floor(Math.random() * 100);
    },
    mainControls() {
      return !!(this.close || this.fullscreen || this.collapse
        || this.refresh || this.settings || this.settingsInverse);
    },
  },
  mounted() {
    if (this.autoload && this.$listeners && this.$listeners.load) {
      this.loadWidgster();
      if (typeof this.autoload === 'number') {
        setInterval(() => {this.loadWidgster()}, this.autoload);
      }
    }
    if (this.customControls) {
      let close = this.$refs.customControlsRef.querySelector('[control=close]');
      close && close.addEventListener('click', this.closeWidget);
      let collapse = this.$refs.customControlsRef.querySelector('[control=collapse]');
      collapse && collapse.addEventListener('click', this.changeState.bind(this, null, 'collapse'));
      let expand = this.$refs.customControlsRef.querySelector('[control=expand]');
      expand && expand.addEventListener('click', this.changeState.bind(this, null, 'default'));
      let fullscreen = this.$refs.customControlsRef.querySelector('[control=fullscreen]');
      fullscreen && fullscreen.addEventListener('click', this.changeState.bind(this, null, 'fullscreen'));
      let restore = this.$refs.customControlsRef.querySelector('[control=restore]');
      restore && restore.addEventListener('click', this.changeState.bind(this, null, 'default'));
      let load = this.$refs.customControlsRef.querySelector('[control=load]');
      load && load.addEventListener('click', this.loadWidgster);
    }
  },
  methods: {
    closeWidget(e) {
      e && e.preventDefault();
      let $parentEl = this.$el.parentElement;
      let length = $parentEl.classList.length;
      let parentToRemove = false;
      for (let i = 0; i < length; i++) {
        if (/col.*/.test($parentEl.classList[i])) {
          parentToRemove = true;
          break;
        }
      }

      let removeFunction = () => {
        parentToRemove ? $parentEl.remove() : this.$el.remove();
      };

      if (this.$listeners && this.$listeners.close) {
        this.$listeners.close(removeFunction.bind(this));
      } else {
        removeFunction();
      }
    },
    changeState(e, state) {
      e && e.preventDefault();
      this.state = state;
    },
    loadWidgster(e) {
      e && e.preventDefault();
      this.$emit('load');
    }
  }
};
</script>

<style src="./Widget.scss" lang="scss" />

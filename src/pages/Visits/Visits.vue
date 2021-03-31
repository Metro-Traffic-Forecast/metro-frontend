<template>
  <div class="visits-page">
    <h1 class="page-title">线路拓扑 &nbsp;
      <small>
        <small><!-- 小标题 -->——重庆市地铁线路</small>
      </small>
    </h1>
    <b-row>
      <b-col lg="7">
        <Widget class="bg-transparent" style="width: 900px">
          <Map />
        </Widget>
      </b-col>

      <b-col lg="4" offset-lg="1">
        <Widget
          class="bg-transparent"
          title=""
          style="width: 200px;"
        >
          <!-- 示意文字 -->
          <p>
            <span class="circle bg-primary text-white"><i class="la la-map-marker" /></span> &emsp;
            202 &ensp; station
          </p>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">年度客流总量</h6>
              <p class="description deemphasize mb-xs">10.1亿次</p>
            </div>
          </div>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">地铁交通总里程</h6>
              <p class="description deemphasize mb-xs">398.5万公里</p>
            </div>
          </div>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">总营业额</h6>
              <p class="description deemphasize mb-xs">30亿元</p>
            </div>
          </div>
        </Widget>

      </b-col>
    </b-row>
    <b-row>
      <b-col xl="4" xs="12">
        <Widget title="区域OD">
          <OD></OD>
        </Widget>
      </b-col>
      <b-col xl="4" xs="12">
        <Widget title="年龄结构">
          <AgeStructure></AgeStructure>
        </Widget>
      </b-col>
    </b-row>
    <AgeStructure></AgeStructure>
  </div>
</template>

<script>
import Vue from 'vue';
import Widget from '@/components/Widget/Widget';
import Map from './components/Map/Map';
import AgeStructure from "@/components/Charts/AgeStructure/AgeStructure";
import OD from "@/components/Charts/OD/OD";

export default {
  name: 'Visits',
  components: {
    OD, Widget, Map, AgeStructure
  },
  data() {
    return {
      animateNumberOptions: {
        duration: 2000,
        easing: 'easeInQuad',
        formatValue(value) {
          return value.toFixed(0);
        }
      },
      checkedArr: [false, false, false],
      dataCollection: null,
    };
  },
  methods: {
    checkTable(id) {
      let arr = [];
      if (id === 0) {
        const val = !this.checkedArr[0];
        for (let i = 0; i < this.checkedArr.length; i += 1) {
          arr[i] = val;
        }
      } else {
        arr = this.checkedArr;
        arr[id] = !arr[id];
      }
      if (arr[0]) {
        let count = 1;
        for (let i = 1; i < arr.length; i += 1) {
          if (arr[i]) {
            count += 1;
          }
        }
        if (count !== arr.length) {
          arr[0] = !arr[0];
        }
      }
      Vue.set(this, 'checkedArr', arr);
    },
    fillData () {
      this.dataCollection = {
        labels: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#1870DC',
            borderColor: 'transparent',
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
          }, {
            label: 'Data Two',
            backgroundColor: '#F45722',
            borderColor: 'transparent',
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  },
  mounted () {
    this.fillData();
  },
};
</script>

<style src="./Visits.scss" lang="scss" />

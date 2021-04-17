<template>
  <div :id="id" ></div>
</template>
<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/title');
require('echarts/lib/component/toolbox');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/grid');
require('echarts/lib/component/legend');
require('echarts/lib/chart/line');

export default {
  name: "WorkAndWeekDay",
  props:['id', 'data', 'width', 'height'],
  mounted() {
    this.draw();
  },
  watch:{
    data:{
      handler(){
        this.draw();
      }
    },
  },
  methods:{
    draw(){
      let chartDom = document.getElementById(this.id);
      chartDom.style.width = this.width ;
      chartDom.style.height = this.height;
      let myChart = echarts.init(chartDom, 'dark');
      let option;

      let data = this.data;
      option = {
        backgroundColor: "#00000000",
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: '工作日/周末\n  客流分析',
          textStyle:{
            fontSize:'15px',
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '1号线',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(128, 255, 165)'
              }, {
                offset: 1,
                color: 'rgba(1, 191, 236)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: data[0]
          },
          {
            name: '2号线',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 221, 255)'
              }, {
                offset: 1,
                color: 'rgba(77, 119, 255)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: data[1]
          },
          {
            name: '3号线',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(55, 162, 255)'
              }, {
                offset: 1,
                color: 'rgba(116, 21, 219)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: data[2]
          },
          {
            name: '4号线',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 0, 135)'
              }, {
                offset: 1,
                color: 'rgba(135, 0, 157)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: data[3]
          },
          {
            name: '5号线',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 191, 0)'
              }, {
                offset: 1,
                color: 'rgba(224, 62, 76)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: data[4]
          },
          {
            name: '10号线',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 191, 0)'
              }, {
                offset: 1,
                color: 'rgba(224, 62, 76)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: data[5]
          },
          {
            name: '11号线',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 191, 0)'
              }, {
                offset: 1,
                color: 'rgba(224, 62, 76)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: data[6]
          },
          {
            name: '12号线',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 191, 0)'
              }, {
                offset: 1,
                color: 'rgba(224, 62, 76)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: data[7]
          }
        ]
      };

      option && myChart.setOption(option);


    }
  }
}
</script>

<style scoped>

</style>
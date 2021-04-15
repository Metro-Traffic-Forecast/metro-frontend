<template>
  <div :id="id" ></div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/sankey');

export default {
  name: "OD",
  props:['id', 'links', 'width', 'height'],
  mounted() {

  },
  watch:{
    links:{
      handler(){
        this.draw();
      }
    }
  },
  methods:{
    draw(){
      let chartDom = document.getElementById(this.id);
      chartDom.style.width = this.width;
      chartDom.style.height = this.height;
      let myChart = echarts.init(chartDom, 'dark');
      let option;

      option = {
        color:[
            '#66ccff'
        ],
        backgroundColor: "#00000000",
        series: {
          type: 'sankey',
          layout: 'none',
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          },
          emphasis: {
            focus: 'adjacency'
          },
          data: [{
            name: '1号线',
            itemStyle: {
              color: '#ffb484'
            }
          }, {
            name: '2号线',
            itemStyle: {
              color: '#ff8686'
            }
          }, {
            name: '3号线',
            itemStyle: {
              color: '#fff986'
            }
          }, {
            name: '4号线',
            itemStyle: {
              color: '#beff86'
            }
          },{
            name: '5号线',
            itemStyle: {
              color: '#76d0ff'
            }
          }, {
            name: '10号线',
            itemStyle: {
              color: '#7698ff'
            }
          }, {
            name: '11号线',
            itemStyle: {
              color: '#9b76ff'
            }
          },{
            name: '12号线',
            itemStyle: {
              color: '#76ffbf'
            }
          },{
            name: '1号线 ',
            itemStyle: {
              color: '#ff8686'
            }
          }, {
            name: '2号线 ',
            itemStyle: {
              color: '#ffb484'
            }
          }, {
            name: '3号线 ',
            itemStyle: {
              color: '#fff986'
            }
          }, {
            name: '4号线 ',
            itemStyle: {
              color: '#beff86'
            }
          },{
            name: '5号线 ',
            itemStyle: {
              color: '#76d0ff'
            }
          }, {
            name: '10号线 ',
            itemStyle: {
              color: '#7698ff'
            }
          }, {
            name: '11号线 ',
            itemStyle: {
              color: '#9b76ff'
            }
          },{
            name: '12号线 ',
            itemStyle: {
              color: '#76ffbf'
            }
          }],
          links: [{
            source: 'a',
            target: 'a1',
            value: 5
          }, {
            source: 'a',
            target: 'a2',
            value: 3
          }, {
            source: 'b',
            target: 'b1',
            value: 8
          }, {
            source: 'a',
            target: 'b1',
            value: 3
          }, {
            source: 'b1',
            target: 'a1',
            value: 1
          }, {
            source: 'b1',
            target: 'c',
            value: 2
          }]
        }
      };
      option.series.links = this.links;
      option && myChart.setOption(option);
    }
  }
}
</script>

<link href="OD.scss"/>
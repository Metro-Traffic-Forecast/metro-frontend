<template>
<div>
  <div id="OD" style="width:400px; height:400px"></div>
</div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/dataset');
require('echarts/lib/component/grid');
require('echarts/lib/chart/bar');

export default {
  name: "OD",
  mounted() {
    this.draw();
  },
  updated() {
    this.draw();
  },
  methods:{
    draw(){
      let chartDom = document.getElementById('OD');
      let myChart = echarts.init(chartDom);
      let option;
      option = {
        dataset: [{
          dimensions: ['name', 'age', 'profession', 'score', 'date'],
          source: [
            [' Hannah Krause ', 41, 'Engineer', 314, '2011-02-12'],
            ['Zhao Qian ', 20, 'Teacher', 351, '2011-03-01'],
            [' Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
            ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
            [' Karle Neumann ', 25, 'Engineer', 253, '2011-04-02'],
            [' Adrian Groß', 19, 'Teacher', null, '2011-01-16'],
            ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
            [' Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
            ['Han Meimei ', 67, 'Engineer', 366, '2011-03-12'],
          ]
        }, {
          transform: {
            type: 'sort',
            config: { dimension: 'score', order: 'desc' }
          }
        }],
        darkMode: true,
        color:[
          "#0079bd",
          "#005d84",
          "#003f5a",
          "#00222d",
          "#008dff",
          "#125b80",
          "#14516a",
          "#032d39",
          "#436eaf",
        ],
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {},
        series: {
          type: 'bar',
          encode: { x: 'name', y: 'score' },
          datasetIndex: 1
        }
      };

      option && myChart.setOption(option);
    }
  }
}
</script>

<link href="OD.scss"/>
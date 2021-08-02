<template>
  <div :id="id" ></div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/grid');
require('echarts/lib/component/visualMap');
require('echarts/lib/chart/heatmap');

export default {
  name: "Thermodynamic",
  props:['id', 'data', 'width', 'height', 'stations', 'max'],
  mounted() {
    this.draw();
  },
  watch:{
    data:{
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
      let xData = [0,1,2,3,4,5,6,7,8,9,10,11,12];
      let data = this.data;
      let yData = [0,1,2,3,4,5,6,7,8,9,10,11,12];

      let stations = this.stations;
      let max = Math.pow(this.max, 0.25);

      option = {
        backgroundColor:"#00000000",
        tooltip: {
          formatter:function(params){
            return stations[params.value[0] * 13 + params.value[1]] + ' 客流量' + '<br/>' +
                '<span style="display: inline-block;width: 15px;height: 15px;border-radius: 50%;margin-top:10px;background-color: '+ params.color+'"></span> '
                + Math.floor(Math.pow(params.data[2]*max, 4));
          }
        },
        grid: {
          right: 140,
          left: 40
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'category',
          data: yData
        },
        visualMap: {
          type: 'piecewise',
          min: 0,
          max: 1,
          left: 'right',
          top: 'center',
          calculable: true,
          realtime: false,
          splitNumber: 8,
          show:false,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        },
        series: [{
          name: '客流量',
          type: 'heatmap',
          data: data,
          emphasis: {
            itemStyle: {
              borderColor: '#333',
              borderWidth: 1
            }
          },
          progressive: 1000,
          animation: false,

        }]
      };

      option && myChart.setOption(option);

    }
  }
}
</script>

<link href="Thermodynamic.scss"/>
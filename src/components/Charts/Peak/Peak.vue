<template>
  <div :id="id" ></div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts-gl/lib/component/grid3D');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/visualMap');
require('echarts-gl/lib/chart/bar3D');

export default {
  name: "Peak",
  props:['id', 'data', 'width', 'height', 'xAxis'],
  mounted() {

  },
  data(){
    return{

    }
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
      let hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];
      let days = this.xAxis;

      let data = this.data;
      option = {
        backgroundColor: '#00000000',
        tooltip: {
          formatter:function(params){ //标签内容
            console.log(params);
            return days[params['value'][1]];
          },
        },
        visualMap: {
          max: 20,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        },
        xAxis3D: {
          type: 'category',
          data: hours,
          axisLabel:{
            color:"#ffffff"
          },
          nameTextStyle:{
            color: "#ffffff"
          },
          name:"",
        },
        yAxis3D: {
          type: 'category',
          data: days,
          axisLabel:{
            color:"#ffffff"
          },
          nameTextStyle:{
            color: "#ffffff"
          },
          name:"",
        },
        zAxis3D: {
          type: 'value',
          axisLabel:{
            color:"#ffffff"
          },
          name:"",
          nameTextStyle:{
            color: "#ffffff"
          }
        },
        grid3D: {
          boxWidth: 200,
          boxDepth: 80,
          viewControl: {
            // projection: 'orthographic'
          },
          light: {
            main: {
              intensity: 1.2,
              shadow: true
            },
            ambient: {
              intensity: 0.3
            }
          }
        },
        series: [{
          type: 'bar3D',
          data: data.map(function (item) {
            return {
              value: [item[1], item[0], item[2]]
            }
          }),
          shading: 'lambert',

          label: {
            fontSize: 16,
            borderWidth: 1,
          },

          emphasis: {
            label: {
              fontSize: 20,
              color: '#900',
            },
            itemStyle: {
              color: '#900'
            }
          }
        }]
      }

      option && myChart.setOption(option);


    }
  }
}
</script>

<style scoped>

</style>
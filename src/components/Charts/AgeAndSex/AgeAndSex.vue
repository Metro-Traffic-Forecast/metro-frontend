<template>
<div :id="id"></div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/chart/pie');

export default {
  name: "AgeAndSex",
  props:['id', 'width', 'height','data','Title' ],
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
    draw:function (){
      var chartDom = document.getElementById(this.id);
      chartDom.style.width = this.width;
      chartDom.style.height = this.height;
      var myChart = echarts.init(chartDom, 'dark');
      var option;

      option = {
        backgroundColor:'#00000000',
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: this.Title,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.data
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
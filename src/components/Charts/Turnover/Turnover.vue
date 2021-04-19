<template>
  <div :id="id" ></div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/dataset');
require('echarts/lib/component/grid');
require('echarts/lib/component/visualMap');
require('echarts/lib/chart/bar');

export default {
  name: "Turnover",
  props:['id', 'data', 'width', 'height'],
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

      let source = [['score', 'amount', 'product']].concat(this.data);

      option ={
        backgroundColor:'#00000000',
        dataset: {
          source: source
        },
        grid: {containLabel: true},
        xAxis: {name: 'amount'},
        yAxis: {type: 'category'},
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 10,
          max: 100,
          text: ['High Score', 'Low Score'],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ['#65B581', '#FFCE34', '#FD665F']
          }
        },
        series: [
          {
            type: 'bar',
            encode: {
              // Map the "amount" column to X axis.
              x: 'amount',
              // Map the "product" column to Y axis
              y: 'product'
            }
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
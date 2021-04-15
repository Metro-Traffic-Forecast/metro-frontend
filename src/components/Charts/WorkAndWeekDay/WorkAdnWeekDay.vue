<template>
  <div :id="id" ></div>
</template>
<script>
export default {
  name: "WorkAdnWeekDay",
  props:['id', 'data', 'width', 'height'],
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

      option = {
        backgroundColor:"#00000000",
        tooltip: {},
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
          animation: false
        }]
      };

      option && myChart.setOption(option);

    }
  }
}
</script>

<style scoped>

</style>
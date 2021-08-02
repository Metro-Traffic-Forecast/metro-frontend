<template>
<div :id="id">

</div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/title');
require('echarts/lib/component/toolbox');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/grid');
require('echarts/lib/component/dataZoom');
require('echarts/lib/chart/line');

export default {
  name: "InAndOut",
  props:['id', 'UpData', 'width', 'height','DownData','xAxis'],
  mounted() {

  },
  watch:{
    UpData:{
      handler(){
        if(this.tag[1] == 1){
          this.tag[1]=0;
          this.draw();
        }else{
          this.tag[0] = 1;
        }
      },
    },
    DownData:{
      handler(){
        if(this.tag[0] == 1){
          this.tag[0]=0;
          this.draw();
        }else{
          this.tag[1] = 1;
        }
      }
    }
  },
  data(){
    return{
      tag:[0,0]
    }
  },
  methods:{
    draw(){
      let chartDom = document.getElementById(this.id);
      chartDom.style.width = this.width;
      chartDom.style.height = this.height;
      let myChart = echarts.init(chartDom, 'dark');

      var base = +new Date(2019, 11, 26,0,0,0,0);
      var oneDay =   3600 * 1000 * 24;
      var date = [];

      let data = this.UpData;
      let data2 =  this.DownData;

      if(this.xAxis == null) {
        for (var i = 1; i < 204; i++) {
          var now = new Date(base);
          date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/') + "\n");
          base += oneDay;
        }
      }else{
        date = this.xAxis;
      }

      let option = {
        backgroundColor:"#00000000",
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: '50%',
          text: '出入站信息统计',
        },
        toolbox: {
          show:false,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 10
        }, {
          start: 0,
          end: 10
        }],
        series: [
          {
            name: '入站',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255, 158, 68)'
              }, {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }])
            },
            data: data
          },{
            name: '出站',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255, 158, 68)'
              }, {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }])
            },
            data: data2
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
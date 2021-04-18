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
  props:['id', 'RelUpData', "ForUpData","ForDownData",'width', 'height','RelDownData','xAxis'],
  mounted() {

  },
  watch:{
    RelUpData:{
      handler(){
        if(this.tag[1] == 1 && this.tag[2] == 1&&this.tag[3] == 1){
          this.tag[1]=0;
          this.tag[2]=0;
          this.tag[3]=0;
          this.draw();
        }else{
          this.tag[0] = 1;
        }
      },
    },
    RelDownData:{
      handler(){
        if(this.tag[0] == 1 && this.tag[2] == 1&&this.tag[3] == 1){
          this.tag[0]=0;
          this.tag[2]=0;
          this.tag[3]=0;
          this.draw();
        }else{
          this.tag[1] = 1;
        }
      }
    },
    ForDownData:{
      handler:{
        handler(){
          if(this.tag[0] == 1 && this.tag[1] == 1&&this.tag[3] == 1){
            this.tag[0]=0;
            this.tag[1]=0;
            this.tag[3]=0;
            this.draw();
          }else{
            this.tag[2] = 1;
          }
        }
      }
    },
    ForUpData:{
      handler:{
        handler(){
          if(this.tag[0] == 1 && this.tag[1] == 1&&this.tag[2] == 1){
            this.tag[0]=0;
            this.tag[1]=0;
            this.tag[2]=0;
            this.draw();
          }else{
            this.tag[3] = 1;
          }
        }
      }
    }
  },
  data(){
    return{
      tag:[0,0,0,0]
    }
  },
  methods:{
    draw(){
      let chartDom = document.getElementById(this.id);
      chartDom.style.width = this.width;
      chartDom.style.height = this.height;
      let myChart = echarts.init(chartDom, 'dark');

      var base = +new Date(2020, 6, 10,0,0,0,0);
      var dely = 3600 * 1000 * 6;
      var date = [];

      let data = this.RelUpData;
      let data2 =  this.RelDownData;
      let data3 = this.ForUpData;
      let data4 = this.ForDownData;

      for(let i=0;i<40;i++){
        var now = new Date(base);
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/') + "\n" + (i*6)%24);
        base += dely;
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
          left: 'center',
          text: '站点客流预测',
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
            name: '上行',
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
            name: '下行',
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
          },{
            name: '上行预测',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255,186,68)'
              }, {
                offset: 1,
                color: 'rgb(255,70,172)'
              }])
            },
            data: data3
          },
      {
        name: '下行预测',
            type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
        color: 'rgb(255,70,131)'
      },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(255,186,68)'
          }, {
            offset: 1,
            color: 'rgb(255,70,172)'
          }])
        },
        data: data4
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
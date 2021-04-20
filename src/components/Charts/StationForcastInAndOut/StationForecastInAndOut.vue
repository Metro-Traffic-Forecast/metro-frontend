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
  props:['id', 'RelUpData', "ForUpData","ForDownData",'width', 'height','RelDownData','xAxis','baseTime'],
  mounted() {
  },
  watch:{
    RelUpData:{
      handler(){

          this.draw();

      },
    },
    RelDownData:{
      handler(){

          this.draw();

      }
    },
    ForDownData:{
      handler:{
        handler(){

            this.draw();

        }
      }
    },
    ForUpData:{
      handler:{
        handler(){
            this.draw();

        }
      }
    }
  },
  methods:{
    draw(){
      let chartDom = document.getElementById(this.id);
      chartDom.style.width = this.width;
      chartDom.style.height = this.height;
      let myChart = echarts.init(chartDom, 'dark');

      var base = this.baseTime;
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

      let option = null;
      option = {
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
              color: 'rgb(102,204,255)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(68,180,255)'
              }, {
                offset: 1,
                color: 'rgb(70,95,255)'
              }])
            },
            data: data
          },{
            name: '下行',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(102,204,255)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(68,180,255)'
              }, {
                offset: 1,
                color: 'rgb(70,95,255)'
              }])
            },
            data: data2
          },{
            name: '上行预测',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255,150,70)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255,127,68)'
              }, {
                offset: 1,
                color: 'rgb(255,193,70)'
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
              color: 'rgb(255,150,70)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255,127,68)'
              }, {
                offset: 1,
                color: 'rgb(255,193,70)'
              }])
            },
            data: data4
          }

        ]
      };

      if(data4 === null){
        option = {
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
                color: 'rgb(102,204,255)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(68,180,255)'
                }, {
                  offset: 1,
                  color: 'rgb(70,95,255)'
                }])
              },
              data: data
            },{
              name: '上行预测',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              itemStyle: {
                color: 'rgb(255,150,70)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(255,127,68)'
                }, {
                  offset: 1,
                  color: 'rgb(255,193,70)'
                }])
              },
              data: data3
            },
          ]
        };
      }
      myChart.setOption(option);
    }
  }
}
</script>

<style scoped>

</style>
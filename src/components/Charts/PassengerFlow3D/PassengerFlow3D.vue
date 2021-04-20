<template>
  <div :id="id" >

  </div>
</template>

<script>
let echarts = require('echarts');
require('echarts-gl');

export default {
  name: "PassengerFlow3D",
  props:['id','width','height', 'dataX', 'data'],
  mounted() {
    this.draw();
  },
  data(){
    return{
      tag:[0,0]
    }
  },
  watch:{
    data:{
      handler(){
        if(this.tag[1]==1){
          this.tag[1]=0
          this.draw();
        }else{
          this.tag[0]=1;
        }
      }
    },
    dataX:{
      handler() {
        if(this.tag[0]==1){
          this.tag[0]=0
          this.draw();
        }else{
          this.tag[1]=1;
        }
      }
    }
  },
  methods:{
    draw:function () {

      let data = this.data;
      let dataX = this.dataX;
      let dataY = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'];

      let vdata = [];

      for (let i = 0; i < dataY.length; i++) {
        vdata[i] = [];   //vdata里面存放的是二维数组
      }

      for (var t = 0; t < dataY.length; t++) {
        var y = dataY[t];
        for (var k = 0; k < data[0].length; k++) {
          for (var p = 0; p < dataX.length; p++) {
            var x = dataX[p];
            var z = data[t][p];
            vdata[t].push([x, y, z]);
          }
          break;
        }
      }

      let dom = document.getElementById(this.id);
      dom.style.height = this.height + 'px';
      dom.style.width = this.width + 'px';
      let chart = echarts.init(dom, 'dark');

      console.log(vdata);
      chart.setOption({
        backgroundColor:"#00000000",
        xAxis3D: {
          type: 'category',
          name: '',
          data: dataX,
          axisLabel: {
            show: true,
            interval: 0  //使x轴都显示
          }
        },
        yAxis3D: {
          type: 'category',
          name: '',
          data: dataY,
          axisLabel: {
            show: true,
            interval: 0   //使y轴都显示
          }
        },
        zAxis3D: {
          type: 'value',
          name: ''
        },
        tooltip: {
          show: true
        },
        grid3D: {
          boxWidth: 350,
          boxHeight: 140,
          boxDepth: 233,
          axisLine: {
            show: true,
            interval: 0,
            lineStyle: {
              color: '#fff'
            }
          },
          viewControl: {
            distance: 300
          }
        },
        series: [
          {
            type: 'scatter3D',
            name: '1号线',
            itemStyle: {
              color: 'rgb(165,  0, 38)'
            },
            label: {  //当type为scatter3D时有label出现
              show: true,
              position: 'bottom',
              distance: 0,
              textStyle: {
                color: '#ffffff',
                fontSize: 12,
                borderWidth: 0,
                borderColor: '#c6c6c6',
                backgroundColor: 'transparent'
              }
            },
            data: vdata[0]    //每个区的数据一一对应
          },
          {
            type: 'scatter3D',
            name: '2号线',
            itemStyle: {
              color: 'rgb(215, 48, 39)'
            },
            label: {
              show: true,
              position: 'bottom',
              distance: 0,
              textStyle: {
                color: '#ffffff',
                fontSize: 12,
                borderWidth: 0,
                borderColor: '#c6c6c6',
                backgroundColor: 'transparent'
              }
            },
            data: vdata[1]
          },
          {
            type: 'scatter3D',
            name: '3号线',
            itemStyle: {
              color: 'rgb(244,109, 67)'
            },
            label: {
              show: true,
              position: 'bottom',
              distance: 0,
              textStyle: {
                color: '#ffffff',
                fontSize: 12,
                borderWidth: 0,
                borderColor: '#c6c6c6',
                backgroundColor: 'transparent'
              }
            },
            data: vdata[2]
          },
          {
            type: 'scatter3D',
            name: '4号线',
            itemStyle: {
              color: 'rgb(253,174, 97)'
            },
            label: {
              show: true,
              position: 'bottom',
              distance: 0,
              textStyle: {
                color: '#ffffff',
                fontSize: 12,
                borderWidth: 0,
                borderColor: '#c6c6c6',
                backgroundColor: 'transparent'
              }
            },
            data: vdata[3]
          },
          {
            type: 'scatter3D',
            name: '5号线',
            itemStyle: {
              color: 'rgb(254,224,144)'
            },
            label: {
              show: true,
              position: 'bottom',
              distance: 0,
              textStyle: {
                color: '#ffffff',
                fontSize: 12,
                borderWidth: 0,
                borderColor: '#c6c6c6',
                backgroundColor: 'transparent'
              }
            },
            data: vdata[4]
          },
          {
            type: 'scatter3D',
            name: '10号线',
            itemStyle: {
              color: 'rgb(255,255,191)'
            },
            label: {
              show: true,
              position: 'top',
              distance: 0,
              textStyle: {
                color: '#ffffff',
                fontSize: 12,
                borderWidth: 0,
                borderColor: '#c6c6c6',
                backgroundColor: 'transparent'
              }
            },
            data: vdata[5]
          },
          {
            type: 'scatter3D',
            name: '11号线',
            itemStyle: {
              color: 'rgb(224,243,248)'
            },
            label: {
              show: true,
              position: 'bottom',
              distance: 0,
              textStyle: {
                color: '#ffffff',
                fontSize: 12,
                borderWidth: 0,
                borderColor: '#c6c6c6',
                backgroundColor: 'transparent'
              }
            },
            data: vdata[6]
          },
          {
            type: 'scatter3D',
            name: '12号线',
            itemStyle: {
              color: 'rgb(171,217,233)'
            },
            label: {
              show: true,
              position: 'top',
              distance: 0,
              textStyle: {
                color: '#ffffff',
                fontSize: 12,
                borderWidth: 0,
                borderColor: '#c6c6c6',
                backgroundColor: 'transparent'
              }
            },
            data: vdata[7]
          },
          {
            type: 'line3D', //当type为line3D时有label没有作用，官网没有label这个配置项
            name: '1号线',
            lineStyle: {
              width: 6,   //线的宽度
              color: 'rgb(165,  0, 38)'   //线的颜色
            },
            data: vdata[0]   //线数据和点数据所需要的格式一样
          },
          {
            type: 'line3D',
            name: '2号线',
            lineStyle: {
              color: 'rgb(215, 48, 39)',  //线的颜色
              width: 6     //线的宽度
            },
            data: vdata[1]
          },
          {
            type: 'line3D',
            name: '3号线',
            lineStyle: {
              color: 'rgb(244,109, 67)',
              width: 6
            },
            data: vdata[2]
          },
          {
            type: 'line3D',
            name: '4号线',
            lineStyle: {
              color: 'rgb(253,174, 97)',
              width: 6
            },
            data: vdata[3]
          },
          {
            type: 'line3D',
            name: '5号线',
            lineStyle: {
              color: 'rgb(254,224,144)',
              width: 6
            },
            data: vdata[4]
          },
          {
            type: 'line3D',
            name: '10号线',
            lineStyle: {
              color: 'rgb(255,255,191)',
              width: 6
            },
            data: vdata[5]
          },
          {
            type: 'line3D',
            name: '11号线',
            lineStyle: {
              color: 'rgb(224,243,248)',
              width: 6
            },
            data: vdata[6]
          },
          {
            type: 'line3D',
            name: '12号线',
            lineStyle: {
              color: 'rgb(171,217,233)',
              width: 6
            },
            data: vdata[7]
          }
        ]
      });
    }
  }
}
</script>

<style scoped>

</style>
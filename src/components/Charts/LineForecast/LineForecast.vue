<template>
  <div :id="id" ></div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts-gl/lib/component/grid3D');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/visualMap');
require('echarts-gl/lib/chart/line3D');

export default {
  name: "LineForecast",
  props:['id', 'width', 'height', 'baseTime', 'data', 'splitIndex'],
  mounted() {

  },
  watch:{
    data:{
      handler(){
        this.draw();
      }
    },
    baseTime:{
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

      //计算dataX
      let base = this.baseTime;
      let dely = 3600 * 1000 * 6;
      let date = [];
      for(let i=0;i<40;i++){
        let now = new Date(base);
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-') + " " + (i*6)%24);
        base += dely;
      }

      let dataX = date;
      let dataY = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'];
      let data = this.data;

      let vdata = [];
      for (let i = 0; i < dataY.length; i++) {
        vdata[i] = [];   //vdata里面存放的是二维数组
      }
      for (var tt = 0; tt < dataY.length; tt++) {
        var yy = dataY[tt];
        for (var k = 0; k < data[0].length; k++) {
          for (var p = 0; p < dataX.length; p++) {
            var xx = dataX[p];
            var zz = data[tt][p];
            vdata[tt].push([xx, yy, zz]);
          }
          break;
        }
      }

      option = {
        tooltip: {},
        backgroundColor: '#00000000',
        xAxis3D: {
          type: 'category',
          nameTextStyle:{
            color: '#fff'
          },
          name: '',
          axisLine:{
            lineStyle:{
              color:"#fff"
            }
          },
          data: dataX,
          axisLabel: {
            show: true,
            interval: 0   //使x轴都显示
          }
        },
        yAxis3D: {
          type: 'category',
          nameTextStyle:{
            color: '#fff'
          },
          name: '',
          axisLine:{
            lineStyle:{
              color:"#fff"
            }
          },
          axisLabel: {
            show: true,
            interval: 0   //使y轴都显示
          },
          data: dataY,
        },
        zAxis3D: {
          type: 'value',
          nameTextStyle:{
            color: '#fff'
          },
          name: '',
          axisLine:{
            lineStyle:{
              color:"#fff"
            }
          }
        },
        grid3D: {
          boxWidth: 450,
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
        series: [{
          type: 'scatter3D',
          name: '1号线',
          itemStyle: {
            color: 'rgb(102,204,255)'
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
          data: vdata[0].slice(0,this.splitIndex+1)    //每个区的数据一一对应
        },
          {
            type: 'scatter3D',
            name: '2号线',
            itemStyle: {
              color: 'rgb(102,204,255)'
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
            data: vdata[1].slice(0,this.splitIndex+1)
          },
          {
            type: 'scatter3D',
            name: '3号线',
            itemStyle: {
              color: 'rgb(102,204,255)'
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
            data: vdata[2].slice(0,this.splitIndex+1)
          },
          {
            type: 'scatter3D',
            name: '4号线',
            itemStyle: {
              color: 'rgb(102,204,255)'
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
            data: vdata[3].slice(0,this.splitIndex+1)
          },
          {
            type: 'scatter3D',
            name: '5号线',
            itemStyle: {
              color: 'rgb(102,204,255)'
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
            data: vdata[4].slice(0,this.splitIndex+1)
          },
          {
            type: 'scatter3D',
            name: '10号线',
            itemStyle: {
              color: 'rgb(102,204,255)'
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
            data: vdata[5].slice(0,this.splitIndex+1)
          },
          {
            type: 'scatter3D',
            name: '11号线',
            itemStyle: {
              color: 'rgb(102,204,255)'
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
            data: vdata[6].slice(0,this.splitIndex+1)
          },
          {
            type: 'scatter3D',
            name: '12号线',
            itemStyle: {
              color: 'rgb(102,204,255)'
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
            data: vdata[7].slice(0,this.splitIndex+1)
          },
          {
            type: 'line3D', //当type为line3D时有label没有作用，官网没有label这个配置项
            name: '1号线',
            lineStyle: {
              width: 6,   //线的宽度
              color: 'rgb(102,204,255)'   //线的颜色
            },
            data: vdata[0].slice(0,this.splitIndex+1)   //线数据和点数据所需要的格式一样
          },
          {
            type: 'line3D',
            name: '2号线',
            lineStyle: {
              color: 'rgb(102,204,255)',  //线的颜色
              width: 6     //线的宽度
            },
            data: vdata[1].slice(0,this.splitIndex+1)
          },
          {
            type: 'line3D',
            name: '3号线',
            lineStyle: {
              color: 'rgb(102,204,255)',
              width: 6
            },
            data: vdata[2].slice(0,this.splitIndex+1)
          },
          {
            type: 'line3D',
            name: '4号线',
            lineStyle: {
              color: 'rgb(102,204,255)',
              width: 6
            },
            data: vdata[3].slice(0,this.splitIndex+1)
          },
          {
            type: 'line3D',
            name: '5号线',
            lineStyle: {
              color: 'rgb(102,204,255)',
              width: 6
            },
            data: vdata[4].slice(0,this.splitIndex+1)
          },
          {
            type: 'line3D',
            name: '10号线',
            lineStyle: {
              color: 'rgb(102,204,255)',
              width: 6
            },
            data: vdata[5].slice(0,this.splitIndex+1)
          },
          {
            type: 'line3D',
            name: '11号线',
            lineStyle: {
              color: 'rgb(102,204,255)',
              width: 6
            },
            data: vdata[6].slice(0,this.splitIndex+1)
          },
          {
            type: 'line3D',
            name: '12号线',
            lineStyle: {
              color: 'rgb(102,204,255)',
              width: 6
            },
            data: vdata[7].slice(0,this.splitIndex+1)
          },
          {
            type: 'scatter3D',
            name: '1号线',
            itemStyle: {
              color: 'rgb(255,150,70)'
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
            data: vdata[0].slice(this.splitIndex, 40)     //每个区的数据一一对应
          },
          {
            type: 'scatter3D',
            name: '2号线',
            itemStyle: {
              color: 'rgb(255,150,70)'
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
            data: vdata[1].slice(this.splitIndex, 40)
          },
          {
            type: 'scatter3D',
            name: '3号线',
            itemStyle: {
              color: 'rgb(255,150,70)'
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
            data: vdata[2].slice(this.splitIndex, 40)
          },
          {
            type: 'scatter3D',
            name: '4号线',
            itemStyle: {
              color: 'rgb(255,150,70)'
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
            data: vdata[3].slice(this.splitIndex, 40)
          },
          {
            type: 'scatter3D',
            name: '5号线',
            itemStyle: {
              color: 'rgb(255,150,70)'
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
            data: vdata[4].slice(this.splitIndex, 40)
          },
          {
            type: 'scatter3D',
            name: '10号线',
            itemStyle: {
              color: 'rgb(255,150,70)'
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
            data: vdata[5].slice(this.splitIndex, 40)
          },
          {
            type: 'scatter3D',
            name: '11号线',
            itemStyle: {
              color: 'rgb(255,150,70)'
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
            data: vdata[6].slice(this.splitIndex, 40)
          },
          {
            type: 'scatter3D',
            name: '12号线',
            itemStyle: {
              color: 'rgb(255,150,70)'
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
            data: vdata[7].slice(this.splitIndex, 40)
          },
          {
            type: 'line3D', //当type为line3D时有label没有作用，官网没有label这个配置项
            name: '1号线',
            lineStyle: {
              width: 6,   //线的宽度
              color: 'rgb(255,150,70)'   //线的颜色
            },
            data: vdata[0].slice(this.splitIndex, 40)    //线数据和点数据所需要的格式一样
          },
          {
            type: 'line3D',
            name: '2号线',
            lineStyle: {
              color: 'rgb(255,150,70)',  //线的颜色
              width: 6     //线的宽度
            },
            data: vdata[1].slice(this.splitIndex, 40)
          },
          {
            type: 'line3D',
            name: '3号线',
            lineStyle: {
              color: 'rgb(255,150,70)',
              width: 6
            },
            data: vdata[2].slice(this.splitIndex, 40)
          },
          {
            type: 'line3D',
            name: '4号线',
            lineStyle: {
              color: 'rgb(255,150,70)',
              width: 6
            },
            data: vdata[3].slice(this.splitIndex,40)
          },
          {
            type: 'line3D',
            name: '5号线',
            lineStyle: {
              color: 'rgb(255,150,70)',
              width: 6
            },
            data: vdata[4].slice(this.splitIndex, 40)
          },
          {
            type: 'line3D',
            name: '10号线',
            lineStyle: {
              color: 'rgb(255,150,70)',
              width: 6
            },
            data: vdata[5].slice(this.splitIndex, 40)
          },
          {
            type: 'line3D',
            name: '11号线',
            lineStyle: {
              color: 'rgb(255,150,70)',
              width: 6
            },
            data: vdata[6].slice(this.splitIndex, 40)
          },
          {
            type: 'line3D',
            name: '12号线',
            lineStyle: {
              color: 'rgb(255,150,70)',
              width: 6
            },
            data: vdata[7].slice(this.splitIndex, 40)
          },
        ]
      };

      option && myChart.setOption(option);
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div :id="id" >

  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/toolbox');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/grid');
require('echarts/lib/component/legend');
require('echarts/lib/component/brush');
require('echarts/lib/chart/bar');

export default {
  name: "PassengerFlowSection",
  props:['id','width','height', 'UpFlow', 'DownFlow'],
  mounted() {

  },
  data(){
    return{
      tag:[0,0]
    }
  },
  watch:{
    UpFlow:{
      handler(){
        if(this.tag[1]==1){
          this.tag[1]=0
          this.draw();
        }else{
          this.tag[0]=1;
        }
      }
    },
    DownFlow:{
      handler(){
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
      let chartDom = document.getElementById(this.id);
      chartDom.style.height = this.height;
      chartDom.style.width = this.width;
      let myChart = echarts.init(chartDom, 'dark');

      var xAxisData = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
        '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',];
      var data1 = this.UpFlow;
      var data4 = this.DownFlow;

      console.log(data1);
      console.log(data4);
      var emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      };

      let option = {
        backgroundColor:"#00000000",
        legend: {
          data: ['上行', '下行'],
          left: '10%'
        },
        brush: {
          toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          xAxisIndex: 0
        },
        toolbox: {
          show:false,
          feature: {
            magicType: {
              type: ['stack', 'tiled']
            },
            dataView: {}
          }
        },
        tooltip: {},
        xAxis: {
          data: xAxisData,
          name: '时间轴',
          axisLine: {onZero: true},
          splitLine: {show: false},
          splitArea: {show: false}
        },
        yAxis: {},
        grid: {
          bottom: 100
        },
        series: [
          {
            name: '上行',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            data: data1
          },
          {
            name: '下行',
            type: 'bar',
            stack: 'two',
            emphasis: emphasisStyle,
            data: data4
          }
        ]
      };

      myChart.on('brushSelected', renderBrushed);

      function renderBrushed(params) {
        var brushed = [];
        var brushComponent = params.batch[0];

        for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
          var rawIndices = brushComponent.selected[sIdx].dataIndex;
          brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
        }

        myChart.setOption({
          title: {
            backgroundColor: '#333',
            text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
            bottom: 0,
            right:'10%',
            width: 100,
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          }
        });
      }

      option && myChart.setOption(option);
    }
  }
}
</script>

<style scoped>

</style>
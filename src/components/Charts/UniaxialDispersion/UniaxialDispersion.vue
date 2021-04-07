<template>
<div>
  <div :id="id" style="width: 650px;height: 200px"></div>
</div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/title');
require('echarts/lib/component/singleAxis');
require('echarts/lib/component/tooltip');
require('echarts/lib/chart/scatter');

export default {
  name: "UniaxialDispersion",
  components: {},
  props:{
    data:{
      type:Array,
    },
    id:{
      type:String,default:null
    },
    xAxis:{
      type:Array,default: null
    }
  },
  mounted() {
    this.draw();
  },
  watch:{
    data:{
      handler() {
        this.draw();
      }
    }
  },
  methods:{
    sendData(data){
      let allNumber = 0;
      let getIn = 0;
      let getOut = 0;
      for(let i=0;i<data.length;i++){
        let s = data[i];
        if(s[0] == 0){
          getIn += s[2];
        }else if(s[0]==1){
          getOut += s[2];
        }
      }
      allNumber = getIn;
      this.$emit('getChildData',getIn, getOut, allNumber);
    },
    draw(){
      let chartDom = document.getElementById(this.id);
      let myChart = echarts.init(chartDom, 'dark');
      let option;

      let hours = this.xAxis;
      let  axis = ['入站','出站','总载客量'];
      let data = this.data;
      if(data === undefined) {
        data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5],
          [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2],
          [2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4]];
      }
      option = {
        color:[
          '#8daa7a',
          '#c99898',
          '#c7c7c7'
        ],
        backgroundColor:"#00000000",
        tooltip: {
          position: 'top'
        },
        title: [],
        singleAxis: [],
        series: []
      };

      axis.forEach(function (day, idx) {
        option.title.push({
          textBaseline: 'middle',
          top: (idx + 0.5) * 100 / 5 + '%',
          left:0,
          text: day,
          textStyle:{
            fontSize: 14,
            color:"#d2d2d2"
          }
        });
        option.singleAxis.push({
          left: 80,
          type: 'category',
          boundaryGap: false,
          data: hours,
          top: (idx * 100 / 5 + 5) + '%',
          height: (100 / 7 - 10) + '%',
          axisLabel: {
            interval: 2
          }
        });
        option.series.push({
          singleAxisIndex: idx,
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          data: [],
          symbolSize: function (dataItem) {
            return dataItem[1] * 4;
          }
        });
      });

      data.forEach(function (dataItem) {
        option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
      });

      option && myChart.setOption(option);
      this.sendData(data);
    }
  }
}
</script>

<link href="UniaxialDispersion.scss" />
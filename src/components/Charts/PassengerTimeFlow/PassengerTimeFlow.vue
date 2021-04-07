<template>
<div>
  <div :id="id" style="width:500px; height:300px"></div>
</div>
</template>

<script>

const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/grid');
require('echarts/lib/chart/line');
let option;
export default {
  name: "PassengerFlow",
  props: {
    showData:{
      type:Array,default:null
    },
    xAxis:{
      type:Array,default:null
    },
    scale:{
      type:Number,default:1
    },
    id:{
      type:String,default:null
    }
  },
  mounted() {
    this.draw();
  },
  watch:{
    showData:{
      handler() {
        this.draw();
      }
    }
  },
  methods:{
    sendData(first, second){
      this.$emit('getChildData', first, second);
    },
    draw(){
      let chartDom = document.getElementById(this.id);
      chartDom.style.width = 700*this.scale + 'px';
      chartDom.style.height = 350*this.scale + 'px';
      let myChart = echarts.init(chartDom, "dark");
      option = {
        backgroundColor: "#00000000",
        title: {
          text: '载流量',
          subtext: '人次'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: null
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          axisPointer: {
            snap: true
          }
        },
        visualMap: {
          show: false,
          dimension: 0,
          pieces: [{
            lte: 6,
            color: '#6675ff'
          }, {
            gt: 6,
            lte: 8,
            color: '#ff7272'
          }, {
            gt: 8,
            lte: 14,
            color: '#6675ff'
          }, {
            gt: 14,
            lte: 17,
            color: '#ff7272'
          }, {
            gt: 17,
            color: '#6675ff'
          }]
        },
        series: [
          {
            name: '流量/人次',
            type: 'line',
            smooth: true,
            data: null,
            markArea: {
              itemStyle: {
                color: '#ff696910'
              },
              data: [ [{
                name: '首高峰',
                xAxis: null
              }, {
                xAxis: null
              }], [{
                name: '次高峰',
                xAxis: null
              }, {
                xAxis: null
              }] ]
            }
          },
        ]
      };

      option.xAxis.data = this.xAxis;
      option.series[0].data = this.showData;
      let top1 = 0, index1 = 0, top2 = 0, index2 = 0;
      for(let i=0;i<option.xAxis.data.length;i++){
        if(this.showData[i]>top1){
          if(top1>top2){
            top2 = this.showData[i];
            index2=i;
          }else{
            top1 = this.showData[i];
            index1 = i;
          }
          continue;
        }else if(this.showData[i]>top2){
          top2 = this.showData[i];
          index2 = i;
        }
      }
      option.series[0].markArea.data[0][0].xAxis = Math.min(index1,index2) - 1;
      option.series[0].markArea.data[0][1].xAxis = Math.min(index1,index2) + 1;
      option.series[0].markArea.data[1][0].xAxis = Math.max(index1,index2) - 1;
      option.series[0].markArea.data[1][1].xAxis = Math.max(index1,index2) + 1;

      option.visualMap.pieces[0].lte = Math.min(index1,index2)-1;
      option.visualMap.pieces[1].gt = Math.min(index1,index2)-1;
      option.visualMap.pieces[1].lte = Math.min(index1,index2) +1;
      option.visualMap.pieces[2].gt = Math.min(index1,index2) + 1;
      option.visualMap.pieces[2].lte = Math.max(index1,index2)-1;
      option.visualMap.pieces[3].gt = Math.max(index1,index2)-1;
      option.visualMap.pieces[3].lte = Math.max(index1,index2)+1;
      option.visualMap.pieces[4].gt = Math.max(index1,index2)+1;

      option && setTimeout(myChart.setOption(option),500);

      if(this.showData[index1]>this.showData[index2]) {
        this.sendData(option.xAxis.data[index1], option.xAxis.data[index2]);
      }else {
        this.sendData(option.xAxis.data[index2], option.xAxis.data[index1]);
      }
    }
  },

}
</script>

<link href="PassengerTimeFlow.scss" />
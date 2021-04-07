<template>
  <div>
    <div :id="id" :s="showData" style="width:400px; height:400px"></div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/chart/pie');

export default {
  name: "AgeStructure",
  props: {
    showData:{
      type:Array,default:null
    },
    scale:Number,
    id:{
      type:String,default: null
    }
  },
  mounted() {
    this.draw();
  },
  watch:{
    showData:{
      handler: function (){
        this.draw();
      }
    }
  },
  methods:{
    draw(){
      let chartDom = document.getElementById(this.id);

      chartDom.style.width = 400*this.scale+"px";
      chartDom.style.height = 400*this.scale +"px";

      let myChart = echarts.init(chartDom,"dark");
      let option;
      option = {
        backgroundColor:"#00000000",
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        textStyle:{
          color: "#66ccff",
          fontSize: 15,

        },
        background:"#66ccff",
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
                color: "#66ccff"
              }
            },
            labelLine: {
              show: false
            },
            color:[
              "#0079bd",
              "#005d84",
              "#003f5a",
              "#00222d",
              "#008dff",
              "#125b80",
              "#14516a",
              "#032d39",
              "#436eaf",
            ],
            data: [

            ]
          }
        ]
      };
      if(option.textStyle.fontSize*this.scale<=12){
        option.textStyle.fontSize = 0;
      }else {
        option.textStyle.fontSize = option.textStyle.fontSize * this.scale;
      }
      option.series[0].top=20;
      option.series[0].data = this.showData;
      option.series[0].emphasis.label.fontSize*=this.scale;

      option && myChart.setOption(option);
    }
  },


}
</script>

<link href="./AgeStructure.scss" type="text/css" scoped/>
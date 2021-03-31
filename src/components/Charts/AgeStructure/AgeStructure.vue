<template>
  <div>
    <div id="ageStructure" style="width:400px; height:400px"></div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/chart/pie');

export default {
  name: "AgeStructure",
  props: [{
    showData: {
      type: Array, default: null
    }
  }
  ],

  mounted() {
    this.draw();
  },
  methods:{
    draw(){
      let _this = this;
      let chartDom = document.getElementById('ageStructure');
      let myChart = echarts.init(chartDom);
      let option;
      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        textStyle:{
          fontSize: 15
        },
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
                fontSize: '40',
                fontWeight: 'bold'
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
            textStyle:{
              fontStyle: "##ffffff",
              fontSize: "15px"
            },
            data: [
              {value: 1048, name: '搜索引擎'},
              {value: 735, name: '直接访问'},
              {value: 580, name: '邮件营销'},
              {value: 484, name: '联盟广告'},
            ]
          }
        ]
      };
      option.series.data = _this.showData;
      option && myChart.setOption(option);
    }
  },


}
</script>

<link href="./AgeStructure.scss" type="text/css" scoped/>
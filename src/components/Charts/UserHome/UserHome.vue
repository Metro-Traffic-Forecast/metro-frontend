<template>
<div :id="id">

</div>
</template>

<script>
import * as echarts from 'echarts';
import china from '../../../../public/china.json';
echarts.registerMap('china', china);
export default {
  name: "UserHome",
  props:['id','width', 'height'],
  mounted() {
    this.draw();
  },
  methods:{
    draw(){
      let chartDom = document.getElementById(this.id);
      chartDom.style.height = this.height;
      chartDom.style.width = this.width;
      let myChart = echarts.init(chartDom, 'dark');

      function randomData () {
        return Math.round(Math.random() * 800);
      }
      // 绘制图表
      myChart.setOption(  {
            backgroundColor:"#00000000",
            tooltip: {},
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['']
            },
            selectedMode: 'single',
            series: [
              {
                name: '',
                type: 'map',
                mapType: 'china',
                center:[115.97, 29.71],
                layoutCenter: ['80%', '100%'],
                itemStyle: {
                  normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                  },
                  emphasis: {
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                showLegendSymbol: true,
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: false
                  }
                },
                data: [
                  { name: '北京', value: randomData() },
                  { name: '天津', value: randomData() },
                  { name: '上海', value: randomData() },
                  { name: '重庆', value: randomData() },
                  { name: '河北', value: randomData() },
                  { name: '河南', value: randomData() },
                  { name: '云南', value: randomData() },
                  { name: '辽宁', value: randomData() },
                  { name: '黑龙江', value: randomData() },
                  { name: '湖南', value: randomData() },
                  { name: '安徽', value: randomData() },
                  { name: '山东', value: randomData() },
                  { name: '新疆', value: randomData() },
                  { name: '江苏', value: randomData() },
                  { name: '浙江', value: randomData() },
                  { name: '江西', value: randomData() },
                  { name: '湖北', value: randomData() },
                  { name: '广西', value: randomData() },
                  { name: '甘肃', value: randomData() },
                  { name: '山西', value: randomData() },
                  { name: '内蒙古', value: randomData() },
                  { name: '陕西', value: randomData() },
                  { name: '吉林', value: randomData() },
                  { name: '福建', value: randomData() },
                  { name: '贵州', value: randomData() },
                  { name: '广东', value: randomData() },
                  { name: '青海', value: randomData() },
                  { name: '西藏', value: randomData() },
                  { name: '四川', value: randomData() },
                  { name: '宁夏', value: randomData() },
                  { name: '海南', value: randomData() },
                  { name: '台湾', value: randomData() },
                  { name: '香港', value: randomData() },
                  { name: '澳门', value: randomData() }
                ]
              }
            ]
          }
      )

    }
  }
}
</script>

<style scoped>

</style>
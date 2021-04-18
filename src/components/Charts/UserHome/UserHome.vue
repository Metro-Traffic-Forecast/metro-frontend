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
  props:['id','width', 'height', 'data'],
  mounted() {

  },
  watch:{
    data:{
      handler(){
        this.draw();
      }
    }
  },
  methods:{
    draw() {
      let data={};
      data.id = this.id;
      data.title = "用户居住地";
      data.name = "用户户籍地";
      data.data = this.data;
      data.width  = this.width;
      data.height = this.height;
      let max = 0;
      let max2 = 0;
      let max3 = 0;
      if(this.data!=null) {
        for (let i = 0; i < this.data.length; i++) {
          if (parseInt(this.data[i].value) > max) {
              max3 = max2;
              max2 =max;
              max = parseInt(this.data[i].value);
          }else if(parseInt(this.data[i].value)>max2){
            max3 = max2;
            max2 = parseInt(this.data[i].value);
          }else if(parseInt(this.data[i].value)>max3){
            max3 = parseInt(this.data[i].value);
          }
        }
      }
      data.max = max3;
      init(data);

      function init(data)
      {
        let chart = document.getElementById(data.id);
        chart.style.width = data.width;
        chart.style.height = data.height;
        let dataSourcePie = echarts.init(chart, 'dark');
        let option = {
          backgroundColor:"#00000000",
          title: {
            text: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (!params.value) {
                return '该地区暂无访问量';
              }
              return params.seriesName + '<br />' + params.name
            },
            confine: true
          },
          visualMap: {
            min: 0,
            max: 0,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            itemWidth: 10,
            itemHeight: 70,
            inRange: {
              color: ['#585ae8','#588de8','#58d2e8','#58E8BF','#e8d558','#e89658','#E85858'],
            }
          },
          textStyle: {
            fontSize: 12,
            color: '#b4bfc2'
          },
          series: [
            {
              name: '',
              type: 'map',
              zoom: 1.4,
              label: {
                show: false
              },
              center: [104.97, 35.71],
              mapType: 'china', // 自定义扩展图表类型
              itemStyle: {
                // normal: {label: {show: true}},
                emphasis: {label: {show: true}}
              },
              data: [],
            }
          ]
        };
        option.title.text = data.title;
        option.visualMap.max = data.max;
        option.series[0].name = data.name;
        option.series[0].data = data.data;

        dataSourcePie.setOption(option);
        window.addEventListener('resize', function () {
          dataSourcePie.resize();
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
<template>
<div>
  <Peak width="800px" height="600px" id="PeakAnalysePeak" :x-axis="StationOption" :data="ShowData" style="position: absolute"></Peak>
  <b-form-select v-model="Line" :options="LineOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>&ensp;

</div>
</template>

<script>
import Peak from "@/components/Charts/Peak/Peak";
import axios from "axios";
export default {
  name: "PeakAnalyse",
  data(){
    return{
      Line : 1,
      ShowData:{

      },
      StationOption:{

      },
      AllData:{

      },
      LineOption:[ {
        value: 1,
        text: '1号线'
      },{
        value: 2,
        text: '2号线'
      },{
        value: 3,
        text: '3号线'
      },{
        value: 4,
        text: '4号线'
      },{
        value: 5,
        text: '5号线'
      },{
        value: 6,
        text: '10号线'
      },{
        value: 7,
        text: '11号线'
      },{
        value: 8,
        text: '12号线'
      }],
    }
  },
  components:{
    Peak
  },
  mounted() {
    this.getData();
  },
  methods:{
    compute(){
      let data = [];
       for(let i=0;i<this.StationOption.length;i++){
         let  d =[];
         for(let j=0;j<=163;j++){
           if(this.AllData[j].station == this.StationOption[i]){
             d = this.AllData[j].data;
           }
         }
         for(let k=0;k<=23;k++){
           data.push([i, k, d[k]]);
         }
       }
       this.ShowData = data;
    },
    getStationOption() {
      let line = this.LineOption[this.Line - 1].text;
      let _this = this;
      axios.get('http://host.tanhuiri.cn:19527/metro/station').then(function (response) {
        let data = response.data.data;
        let result=[];
        for(let i=0;i<data.length;i++){
          if(data[i].lineName == line){
            result.push(data[i].stationId);
          }
        }
        console.log(result);
        _this.StationOption = result;
        _this.compute();
      })
    },
    getData(){
      let _this = this;
      axios.get('http://host.tanhuiri.cn:19527/metro/station/inflow',{params:{start:'2020-06-26 00:00:00',end:'2020-06-27 00:00:00',step: 1}})
          .then(function (response) {
            console.log(response);
            let data = response.data.data;
            let result = [];
            for (let i = 0; i <= 163; i++) {
              result[i] = {};
              result[i].station = "";
              result[i].data = [];
            }
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j <= 163; j++) {
                if (data[i][j] != null) {
                  result[j].station = data[i][j].stationId;
                  result[j].data.push(parseInt(data[i][j].flow));
                } else {
                  result[j].data.push(0);
                }
              }
            }
            _this.AllData = result;
            console.log(result);
          })
    }
  }
}
</script>

<style scoped>

</style>
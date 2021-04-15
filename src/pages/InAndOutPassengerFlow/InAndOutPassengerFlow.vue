<template>
<div>
  <InAndOut id="InAndOutPassengerFlowInAndOut" height="600px" width="800px" :up-data="UpData" :down-data="DownData"  style="position: absolute"></InAndOut>
  <b-form-select v-model="Line" :options="LineOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>&ensp;
  <b-form-select v-model="Station" :options="StationOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="compute()"></b-form-select>

</div>
</template>

<script>
import InAndOut from "@/components/Charts/InAndOut/InAndOut";
import axios from "axios";

export default {
  name: "InAndOutPassengerFlow",
  mounted() {
    this.getAllUpData();
    this.getAllDownData();
  },
  data(){
    return{
      UpData:{

      },
      DownData:{

      },
      Line:{
        type:Number,default:1
      },
      Station:{
        type:Number,default:1
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
      StationOption:{

      },
      AllUpData:{

      },
      AllDownData:{

      }
    }
  },
  components:{
    InAndOut
  },
  methods: {
    compute(){
      let stationId = this.StationOption[this.Station - 1].stationId;
      for(let i=0;i<=163;i++){
        if(this.AllUpData[i].station == stationId){
          this.UpData = this.AllUpData[i].data;
          break;
        }
      }
      for(let i=0;i<=163;i++){
        if(this.AllDownData[i].station == stationId){
          this.DownData = this.AllDownData[i].data;
          break;
        }
      }
    },
    getStationOption() {
      let line = this.LineOption[this.Line - 1].text;
      let _this = this;
      axios.get('http://host.tanhuiri.cn:19527/metro/station').then(function (response) {
        let data = response.data.data;
        let result=[];
        let counter =1;
        for(let i=0;i<data.length;i++){
          if(data[i].lineName == line){
            let x= {};
            x.value = counter;
            x.stationId = data[i].stationId;
            x.text = data[i].stationName;
            result.push(x);
            counter++;
          }
        }
        _this.StationOption = result;
      })
    },
    getAllUpData:function (){
      let _this = this;
       axios.get('http://host.tanhuiri.cn:19527/metro/station/inflow',{params:{start:'2019-12-26 00:00:00',end:'2020-07-17 00:00:00',step: 24}})
      .then(function (response){
        let data = response.data.data;
        let result = [];
        for(let i=0;i<=163;i++){
          result[i] = {};
          result[i].station = "";
          result[i].data = [];
        }
        for(let i=0;i<data.length;i++){
          for(let j =0;j<=163;j++){
            if(data[i][j] != null) {
              result[j].station = data[i][j].stationId;
              result[j].data.push(parseInt(data[i][j].flow));
            }else{
              result[j].data.push(0);
            }
          }
        }
        _this.AllUpData = result;
      })
    },
    getAllDownData:function (){
      let _this = this;
      axios.get('http://host.tanhuiri.cn:19527/metro/station/outflow',{params:{start:'2019-12-26 00:00:00',end:'2020-07-17 00:00:00',step: 24}})
          .then(function (response){
            let data = response.data.data;
            let result = [];
            for(let i=0;i<=163;i++){
              result[i] = {};
              result[i].station = "";
              result[i].data = [];
            }
            for(let i=0;i<data.length;i++){
              for(let j =0;j<=163;j++){
                if(data[i][j] != null) {
                  result[j].station = data[i][j].stationId;
                  result[j].data.push(-1*parseInt(data[i][j].flow));
                }else{
                  result[j].data.push(0);
                }
              }
            }
            _this.AllDownData = result;
          })
    }
  }
}
</script>

<style scoped>

</style>
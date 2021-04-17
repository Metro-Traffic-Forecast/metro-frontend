<template>
<div>
  <StationForecastInAndOut
      height="600px"
      width="800px"
      id="StationForecastInAndOut"
      style="position: absolute"
      :rel-up-data="UpData"
      :rel-down-data="DownData"
      :for-down-data="ForDownData"
      :for-up-data="ForUpData"
      ></StationForecastInAndOut>
  <b-form-select v-model="Line" :options="LineOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>&ensp;
  <b-form-select v-model="Station" :options="StationOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="compute()"></b-form-select>
</div>
</template>

<script>
import StationForecastInAndOut from "../../components/Charts/StationForcastInAndOut/StationForecastInAndOut";
import axios from "axios";
export default {
  name: "StationForecast",
  components:{
   StationForecastInAndOut
  },
  data(){
    return{
      UpData:{

      },
      ForUpData:{

      },
      DownData:{

      },
      ForDownData:{

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
  mounted() {
    this.getAllDownData();
    this.getAllUpData();
  },
  methods:{
    compute(){
      let stationId = this.StationOption[this.Station - 1].stationId;
      this.ForUpData = [];
      this.ForDownData = [];
      for(let k=0;k<28;k++){
        this.ForUpData.push(0);
        this.ForDownData.push(0);
      }
      for(let i=0;i<=163;i++){
        if(this.AllUpData[i].station == stationId){
          this.UpData = this.AllUpData[i].data.slice(0,28);
          for(let k=28;k<40;k++) {
            this.ForUpData.push(this.AllUpData[i].data[k]);
          }
          break;
        }
      }
      for(let i=0;i<=163;i++){
        if(this.AllDownData[i].station == stationId){
          this.DownData = this.AllDownData[i].data.slice(0,28);
          for(let k=28;k<40;k++) {
            this.ForDownData.push(this.ForDownData[i].data[k]);
          }
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
      axios.get('http://host.tanhuiri.cn:19527/metro/station/inflow',{params:{start:'2020-07-10 00:00:00',end:'2020-07-20 00:00:00',step: 6}})
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
      axios.get('http://host.tanhuiri.cn:19527/metro/station/outflow',{params:{start:'2020-07-10 00:00:00',end:'2020-07-20 00:00:00',step: 6}})
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
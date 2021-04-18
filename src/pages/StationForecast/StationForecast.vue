<template>
<div>
  <b-row>
    <b-col lg="6">
      <Widget style="width: 100%;height: 640px">
        <StationForecastInAndOut
          height="600px"
          width="100%"
          id="StationForecastInAndOut"
          style="position: absolute"
          :rel-up-data="UpData"
          :rel-down-data="DownData"
          :for-down-data="ForDownData"
          :for-up-data="ForUpData"
        ></StationForecastInAndOut>
        <b-form-select v-model="Line" :options="LineOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>&ensp;
        <b-form-select v-model="Station" :options="StationOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="compute()"></b-form-select>
      </Widget>
    </b-col>
    <b-col lg="6">
      <Widget title="信息说明">
        <small v-if="StationOption[Station - 1]!=null">{{StationOption[Station - 1].text}} 未来3日客流预测</small>
        <b-table striped hover :items="StationForecastTableItems" :fields="StationForecastFields"></b-table>
      </Widget>
    </b-col>
  </b-row>
</div>
</template>

<script>
import StationForecastInAndOut from "../../components/Charts/StationForcastInAndOut/StationForecastInAndOut";
import axios from "axios";
import Widget from "@/components/Widget/Widget";
import config from "@/config";
export default {
  name: "StationForecast",
  components:{
    Widget,
   StationForecastInAndOut
  },
  data(){
    return{
      Tag:[0,0,0],
      StationForecastFields:[
        {
          key: '预测时间段',
          sortable: false
        },
        {
          key: '上行预测客流量',
          sortable: false
        },
        {
          key: '下行预测客流量',
          sortable: false
        }
      ],
      UpData:{

      },
      ForUpData:{

      },
      DownData:{

      },
      ForDownData:{

      },
      Line:1,
      Station:1,
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
    this.getStationOption();
    this.getAllDownData();
    this.getAllUpData();
  },
  computed:{
    StationForecastTableItems(){
      if(this.ForDownData==null){
        return null;
      }
      let data = [];
      let now = new Date(+new Date(2020, 6, 16) - 6*1000*3600);
      let date = new Date(2020, 6, 16);
      for(let i = 0; i<12;i++){
        data[i] ={};
        now = date;
        date = new Date(+new Date(2020, 6, 16) + (i+1) * 6*1000*3600);
        let result = "";
        result += now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+"~";
        result += date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        data[i].预测时间段 = result;
        data[i].上行预测客流量 = this.ForUpData[28+i];
        data[i].下行预测客流量 = this.ForUpData[28+i];
      }
      return data;
    }
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
            this.ForDownData.push(this.AllDownData[i].data[k]);
          }
          break;
        }
      }
    },
    getStationOption() {
      let line = this.LineOption[this.Line - 1].text;
      let _this = this;
      axios.get(config.DNS+'station').then(function (response) {
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
        _this.Tag[0] =1;
        if(_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1){
          _this.compute();
        }
      })
    },
    getAllUpData:function (){
      let _this = this;
      axios.get(config.DNS+'station/inflow',{params:{start:'2020-07-10 00:00:00',end:'2020-07-20 00:00:00',step: 6}})
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
            _this.Tag[1] =1;
            if(_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1){
              _this.compute();
            }
          })
    },
    getAllDownData:function (){
      let _this = this;
      axios.get(config.DNS+'station/outflow',{params:{start:'2020-07-10 00:00:00',end:'2020-07-20 00:00:00',step: 6}})
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
            _this.Tag[2] =1;
            if(_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1){
              _this.compute();
            }
          })
    }
  }
}
</script>

<style scoped>

</style>
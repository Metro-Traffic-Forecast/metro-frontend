<template>
<div>
  <b-row>
    <b-col lg = '8'>
      <Widget style="width: 100%;height: 630px">
        <InAndOut id="InAndOutPassengerFlowInAndOut" height="600px" width="100%" :up-data="UpData" :down-data="DownData"  style="position: absolute"></InAndOut>
        <b-form-select v-model="Line" :options="LineOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>&ensp;
        <b-form-select v-model="Station" :options="StationOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="compute()"></b-form-select>
      </Widget>
    </b-col>
    <b-col lg = '4'>
      <Widget style="width: 100%;height: 630px" title="信息说明">
         <small v-if="StationOption!=null">{{StationOption[Station-1].text}}进出站信息统计</small><br/>

        <b-table striped hover :items="InTableItems" :fields="InFields" style="text-align: center"></b-table>

        <b-table striped hover :items="OuTableItems" :fields="OutFields" style="text-align: center"></b-table>

      </Widget>
    </b-col>
  </b-row>
</div>
</template>

<script>
import InAndOut from "@/components/Charts/InAndOut/InAndOut";
import axios from "axios";
import Widget from "@/components/Widget/Widget";

export default {
  name: "InAndOutPassengerFlow",
  mounted() {
    this.getAllUpData();
    this.getAllDownData();
  },
  data(){
    return{
      UpData: null,
      DownData:null,
      InFields:[
        {
          key: '入站流量分段',
          sortable: false
        },
        {
          key: '总天数',
          sortable: true
        },
        {
          key: '所占比例',
          sortable: true,
        }
      ],
      OutFields:[
        {
          key: '出站流量分段',
          sortable: false
        },
        {
          key: '总天数',
          sortable: true
        },
        {
          key: '所占比例',
          sortable: true,
        }
      ],
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
      StationOption:null,
      AllUpData:{

      },
      AllDownData:{

      }
    }
  },
  components:{
    Widget,
    InAndOut
  },
  computed:{
    InTableItems(){
      if(this.UpData == null){
        return [];
      }
      let level = 5;
      let data = [];
      let d = [];
      for(let i = 0;i<level;i++) {
        d[i]=0;
      }
      let max = 0;

      for(let i = 0;i<this.UpData.length;i++) {
        if (this.UpData[i] > max) {
          max = this.UpData[i];
        }
      }
      let height = max/level;
      for(let i = 0;i<this.UpData.length;i++) {
        d[Math.floor(this.UpData[i]/height)]++;
      }
      for(let i = 0;i<level;i++) {
        data[i] = {};
        let s = "";
        s+=Math.floor(height*i)+"~"+Math.floor(height*(i+1));
        data[i].入站流量分段 = s;
        data[i].总天数 = d[i];
        data[i].所占比例 = (d[i]/204*100).toFixed()+'%';
      }
      return data;
    },
    OuTableItems(){
      if(this.DownData == null){
        return [];
      }
      let level = 5;
      let data = [];
      let d = [];
      for(let i = 0;i<level;i++) {
        d[i]=0;
      }
      let max = 0;

      for(let i = 0;i<this.DownData.length;i++) {
        if (this.DownData[i] < max) {
          max = this.DownData[i];
        }
      }
      let height = max/level;
      for(let i = 0;i<this.DownData.length;i++) {
        d[Math.floor(this.DownData[i]/height)]++;
      }
      for(let i = 0;i<level;i++) {
        data[i] = {};
        let s = "";
        s+=Math.floor(-1 * height*i)+"~"+Math.floor(-1 * height*(i+1));
        data[i].出站流量分段 = s;
        data[i].总天数 = d[i];
        data[i].所占比例 = (d[i]/204*100).toFixed()+'%';
      }
      return data;
    }
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
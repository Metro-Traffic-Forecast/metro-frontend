<template>
  <div>
    <b-row style="height: 100%">
      <b-col lg="12" style="position: absolute;">
        <Widget class="widget2" style="background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <div style="height: 400px;width: 100%">
        <PassengerFlow3D
            id="MonthPassengerFlow3D"
            width="90%"
            height="85%"
            style="position:absolute;margin-left: 5%;margin-top: 10%;margin-bottom: 5%"
            :data-x="dataX"
            :data="data3D"
            ></PassengerFlow3D>
           <b-form-select v-model="SelectMonth" :options="SelectOption" style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f;width: 120px;height:40px;color: rgba(255,255,255,100)" @change="getThermodynamicData();get3DData()"></b-form-select>
        </div>
        </Widget>
      </b-col>
    </b-row>

    <b-row style="margin-top: 430px">
      <b-col lg="5" style="padding-right: 0px;margin-left: 20px">
        <b-row>
        <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);padding-bottom:0;margin-bottom: 0">
          <div class="row progress-stats">
            <div class="col-12">
              <b-table striped hover :items="PassengerFlow3DTableItems" :fields="PassengerFlow3DFields"></b-table>
            </div>
          </div>
          <br>
        </Widget>
        </b-row>
      </b-col>
      <b-col lg="6" style="padding-left: 20px">
        <b-row style="margin-left: 10px">
          <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);padding-bottom:0;margin-bottom: 0">
            <b-col lg="12">
              <el-slider :min="1" :max="MonthMaxDay" v-model="BarValue" style="opacity: 0.4;" @change="compute(null)"></el-slider>
            </b-col>
          </Widget>
        </b-row>

        <b-row style="margin-left: 10px;margin-top: 10px;height: 100%">
        <Widget style="width: 100%;height: 89%">
          <Thermodynamic
            id="MonthDtaThermodynamic"
            width="140%"
            height="400px"
            :data="ThermodynamicShowData"
            :stations="StationList"
            :max="textDataMax"
            style="position: absolute"
          ></Thermodynamic>
          <b-row>
            <b-col lg="6">
              <b-form-select v-model="SelectMode" :options="InOutOption" style="box-shadow: 1px 1px 0 1px #1d1d1f;background-color: #232628;width: 100%;height:40px;color: rgba(255,255,255,100);" @change="getThermodynamicData()"></b-form-select>
            </b-col>
          </b-row>
        </Widget>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import PassengerFlow3D from "@/components/Charts/PassengerFlow3D/PassengerFlow3D";
import Thermodynamic from "@/components/Charts/Thermodynamic/Thermodynamic";
import Widget from "@/components/Widget/Widget";
import axios from "axios";
import config from "../../config";

export default {
  name: "MMonthData",
  data(){
    return{
      PassengerFlow3DFields: [
        {
          key: '线路名称',
          sortable: false
        },
        {
          key: '最大客流量',
          sortable: true
        },
        {
          key: '平均客流量',
          sortable: true,
        }
      ],
      SelectMode : 1,
      MonthMaxDay : 31,
      InOutOption: [ {
        value:1,
        text: '入站'
      },{
        value: 2,
        text: '出站'
      }],
      BarValue: 1,
      AllThermodynamicShowData:[],
      ThermodynamicShowData:[],
      SelectMonth: {
        type: String, default :1
      },
      SelectOption:[ {
      value: '1',
      text: '2019-12'
    }, {
      value: '2',
        text: '2020-01'
    }, {
      value: '3',
        text: '2020-02'
    }, {
      value: '4',
        text: '2020-03'
    }, {
        value: '5',
        text: '2020-04'
      }, {
        value: '6',
        text: '2020-05'
      }, {
        value: '7',
        text: '2020-06'
      }, {
        value: '8',
        text: '2020-07'
      }],
      dataX:{

      },
      data3D:[],
      textData:[],
      textDataMax:0,
      StationList:null,
    }
  },
  components :{
    PassengerFlow3D,
    Thermodynamic,
    Widget
  },
  mounted() {
    this.SelectMonth = '2';
     this.getThermodynamicData();
     this.get3DData();
     this.BarValue = 1;
  },
  computed:{
    PassengerFlow3DTableItems(){
      let lines = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'];
      let data = [];
      for(let i = 0;i<8;i++){
        let max = 0;
        let av = 0;
        for(let k = 0;k<this.data3D[i].length;k++){
          if(this.data3D[i][k]>max){
            max = this.data3D[i][k];
          }
          av+=this.data3D[i][k];
        }
        data[i] = {};
        data[i].线路名称 = lines[i];
        data[i].最大客流量 = max;
        data[i].平均客流量 = Math.ceil(av/this.data3D[i].length);
      }
      return data;
    }
  },
  methods:{
    get3DData(){
      if(parseInt(this.SelectMonth) === 1 || parseInt(this.SelectMonth) == 2 || parseInt(this.SelectMonth) == 4 || parseInt(this.SelectMonth) == 6 ||parseInt(this.SelectMonth) == 8){
        this.dataX = ['1号','2号','3号','4号','5号','6号','7号','8号','9号','10号','11号','12号','13号','14号','15号','16号','17号','18号','19号','20号','21号','22号','23号','24号','25号','26号','27号','28号','29号','30号','31号'];
      }else if(parseInt(this.SelectMonth) == 3){
        this.dataX = ['1号','2号','3号','4号','5号','6号','7号','8号','9号','10号','11号','12号','13号','14号','15号','16号','17号','18号','19号','20号','21号','22号','23号','24号','25号','26号','27号','28号','29号'];
      }else{
        this.dataX = ['1号','2号','3号','4号','5号','6号','7号','8号','9号','10号','11号','12号','13号','14号','15号','16号','17号','18号','19号','20号','21号','22号','23号','24号','25号','26号','27号','28号','29号','30号'];
      }

      //获取开始时间
      let start ="";
      let end = "";
      let s = "";
      for(let i=0;i<this.SelectOption.length;i++){
        if(this.SelectOption[i].value == this.SelectMonth){
          s = this.SelectOption[i].text;
          break;
        }
      }
      let data = [];
      let index = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'];
      for(let i=0;i<8;i++){
        data[i] ={};
        data[i].lineName = index[i];
        data[i].data = [];
      }
      let _this = this;
      let counter= 0;
      for(let i=0;i<this.dataX.length;i++){
        if(i<9) {
          start = s + "-0" + (i + 1) + " 00:00:00";
          end = s + "-0" + (i + 1) + " 23:59:59";
        }else{
          start = s + "-" + (i + 1) + " 00:00:00";
          end = s + "-" + (i + 1) + " 23:59:59";
        }
        axios.get(config.DNS+'line/flow', {
          params: {
            start: start,
            end: end,
          }
        }).then(function (response){
          let d = response.data.data;
          for(let k = 0;k<8;k++){
            let p = 0;
            for(let j=0;j<8;j++){
              if(data[j].lineName == d[k].lineName){
                p=j;
                break;
              }
            }
            data[p].lineName = d[k].lineName;
            data[p].data.push(parseInt(d[k].outflow)+parseInt(d[k].inflow));
          }
          counter++;
          if(counter==_this.dataX.length){
            let relData = [];
            for(let r =0;r<8;r++) {
              relData[r] = data[r].data;
            }
            _this.data3D = relData;
            console.log(relData);
          }
        });
      }
    },
    getThermodynamicData(){

      if(parseInt(this.SelectMonth) === 1 || parseInt(this.SelectMonth) == 2 || parseInt(this.SelectMonth) == 4 || parseInt(this.SelectMonth) == 6 ||parseInt(this.SelectMonth) == 8){
        this.MonthMaxDay = 31;
      }else if(parseInt(this.SelectMonth) == 3){
        this.MonthMaxDay = 29;
      }else{
        this.MonthMaxDay = 30;
      }
      let start = "";
      let end = "";
      let step = 24;
      for(let i=0;i<this.SelectOption.length;i++){
        if(this.SelectOption[i].value == this.SelectMonth){
          start = this.SelectOption[i].text+'-01 00:00:00';
          if(i===7){
            end = '2020-08-01 00:00:00';
          }else{
            end = this.SelectOption[i+1].text+'-01 00:00:00';
          }
        }
      }
      if(this.SelectMode == 1) {
        axios.get(config.DNS+'station/inflow', {
          params: {
            start: start,
            end: end,
            step: step
          }
        })
            .then(response => (this.compute(response)));
      }else{
        axios.get(config.DNS+'station/outflow', {
          params: {
            start: start,
            end: end,
            step: step
          }
        })
            .then(response => (this.compute(response)));
      }
    },

    compute:function (response){
      if(response !=null) {
        this.AllThermodynamicShowData = response.data.data;
      }
      let list = [];
      for(let i=0;i<this.AllThermodynamicShowData[0].length;i++){
        for(let  k =0;k<this.AllThermodynamicShowData.length;k++){
          if(this.AllThermodynamicShowData[k][i]!=null){
            list.push(this.AllThermodynamicShowData[k][i]['stationId']);
            break;
          }
        }
      }
      for(let i=0;i<5;i++){
        list.push("");
      }
      this.StationList = list;
      let data = [];
      let max = 0;
      if(this.AllThermodynamicShowData != null && this.AllThermodynamicShowData[this.BarValue-1] != null){
        for(let i=0;i<=169;i++){
          if(this.AllThermodynamicShowData[this.BarValue -1][i] != null) {
            let x = parseInt(this.AllThermodynamicShowData[this.BarValue-1][i].flow);
            data.push([ Math.floor(i/13), i % 13, x]);
            if(x>max){
              max = x;
            }
          }else{
            data.push([Math.floor(i/13), i%13, 0]);
          }
        }

      }else{
        for(let i=0;i<=169;i++){
          data.push([i/13, i%13, 0]);
        }
      }
      this.textData = data;
      this.textDataMax = max;
      if(max!=0) {
        let t = Math.pow(max, 0.25)
        for (let i = 0; i <= 163; i++) {
          data[i][2] = Math.pow(data[i][2], 0.25) / t;
        }
      }
      this.ThermodynamicShowData =  data;
    }
  }
}
</script>

<style src="./MMonthData.scss" lang="scss"/>
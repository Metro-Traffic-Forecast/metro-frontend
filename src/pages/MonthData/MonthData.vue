<template>
  <div>
    <b-row style="height: 450px">
      <b-col lg="9" style="position: absolute;">
        <div style="height: 420px;width: 850px">
        <PassengerFlow3D
            id="MonthPassengerFlow3D"
            width="850"
            height="420"
            style="position:absolute;"
            ></PassengerFlow3D>
           <b-form-select v-model="SelectMonth" :options="SelectOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getThermodynamicData()"></b-form-select>
        </div>
      </b-col>
      <b-col style="left: 860px">
        <Widget
            title="信息说明"
            style="width: 200px;">
          <br/>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">本日客流总量</h6>
              <p class="description deemphasize mb-xs"></p>
            </div>
          </div>
          <br>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">本日最大载客流量</h6>
              <p class="description deemphasize mb-xs">3.4万人次</p>
              <small style="font-size: 13px;color: #bfbfbf">到达时间</small>
              <p class="description deemphasize mb-xs"></p>
            </div>
          </div>
          <br>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">本日次大载客流量</h6>
              <p class="description deemphasize mb-xs">2.4万人次</p>
              <small style="font-size: 13px;color: #bfbfbf">到达时间</small>
              <p class="description deemphasize mb-xs"></p>
            </div>
          </div>
        </Widget>
      </b-col>
    </b-row>

    <b-row>
      <b-col style="height: 650px;width: 100%">

        <Thermodynamic
          id="MonthDtaThermodynamic"
          width="100%"
          height="600px"
          style="position: absolute"
          :data="ThermodynamicShowData"
        ></Thermodynamic>
        <b-form-select v-model="SelectMode" :options="InOutOption" style="width: 120px;height:30px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getThermodynamicData()"></b-form-select>
        <el-slider :min="1" :max="MonthMaxDay" v-model="BarValue" style="opacity: 0.4;" @change="compute(null)"></el-slider>
      </b-col>

      <b-col>
        <Widget
            title="信息说明"
            style="width: 300px;margin-left: 20px">
          <br/>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">本日客流总量</h6>
              <p class="description deemphasize mb-xs"></p>
            </div>
          </div>
          <br>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">本日最大载客流量</h6>
              <p class="description deemphasize mb-xs">3.4万人次</p>
              <small style="font-size: 13px;color: #bfbfbf">到达时间</small>
              <p class="description deemphasize mb-xs"></p>
            </div>
          </div>
          <br>
          <div class="row progress-stats">
            <div class="col-9">
              <h6 class="name">本日次大载客流量</h6>
              <p class="description deemphasize mb-xs">2.4万人次</p>
              <small style="font-size: 13px;color: #bfbfbf">到达时间</small>
              <p class="description deemphasize mb-xs"></p>
            </div>
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import PassengerFlow3D from "@/components/Charts/PassengerFlow3D/PassengerFlow3D";
import Thermodynamic from "@/components/Charts/Thermodynamic/Thermodynamic";
import Widget from "@/components/Widget/Widget";
import axios from "axios";

export default {
  name: "MonthData",
  data(){
    return{
      SelectMode : 1,
      MonthMaxDay : 31,
      InOutOption: [ {
        value: '1',
        text: '入站'
      },{
        value: '2',
        text: '出站'
      }],
      BarValue: 1,
      AllThermodynamicShowData:null,
      ThermodynamicShowData:null,
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
    }
  },
  components :{
    PassengerFlow3D,
    Thermodynamic,
    Widget
  },
  mounted() {
    this.SelectMonth = '1';
     this.getThermodynamicData();
  },
  methods:{
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
        this.ThermodynamicData = axios.get('http://host.tanhuiri.cn:19527/metro/station/inflow', {
          params: {
            start: start,
            end: end,
            step: step
          }
        })
            .then(response => (this.compute(response)));
      }else{
        this.ThermodynamicData = axios.get('http://host.tanhuiri.cn:19527/metro/station/outflow', {
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
      let data = [];
      let max = 0;
      if(this.AllThermodynamicShowData != null && this.AllThermodynamicShowData[this.BarValue-1] != null){
        for(let i=0;i<=163;i++){
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
        for(let i=0;i<=163;i++){
          data.push([i/13, i%13, 0]);
        }
      }
      if(max!=0) {
        let t = Math.pow(max, 0.25)
        for (let i = 0; i <= 163; i++) {
          data[i][2] = Math.pow(data[i][2], 0.25) / t;
        }
      }
      console.log(data);
      console.log(max);
      this.ThermodynamicShowData =  data;
    }
  }
}
</script>

<link href="MonthData.scss" lang="scss"/>
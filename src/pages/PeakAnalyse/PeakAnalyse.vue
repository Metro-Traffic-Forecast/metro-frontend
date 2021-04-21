<template>
<div>
  <b-row>
    <b-col lg="6">
      <Widget style="width: 100%;height: 700px">
        <Peak width="90%" height="670px" id="PeakAnalysePeak" :data="ShowData" style="position: absolute"></Peak>
        <b-row>
          <b-col lg="4">
            <b-form-select v-model="Mode" :options="ModeOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getData()"></b-form-select>
          </b-col>
          <b-col lg="6">
            <b-form-datepicker :min="new Date(2019, 11, 25)" :max="new Date(2020, 6,26)" selected-variant="info" id="example-datepicker"  style="opacity: 0.5" v-model="SelectDate" class="mb-lg-n3"></b-form-datepicker>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
    <b-col lg="6">
      <Widget style="width: 100%;" title="信息说明">
        <small> {{this.SelectDate}}日{{ModeOption[Mode].text}}客流信息</small>
        <b-row>
          <b-col lg="6">
            <b-table striped hover :items="PeakTableItems1" :fields="PeakFields" style="text-align: center"></b-table>
          </b-col>
          <b-col lg ='6'>
            <b-table striped hover :items="PeakTableItems2" :fields="PeakFields" style="text-align: center"></b-table>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
  </b-row>
  <Widget>
  <b-row>
    <b-col lg="3">
      <b-table striped hover :items="PeakTableItems3" :fields="PeakFields" style="text-align: center"></b-table>
    </b-col>
    <b-col lg ='3'>
      <b-table striped hover :items="PeakTableItems4" :fields="PeakFields" style="text-align: center"></b-table>
    </b-col>
    <b-col lg="3">
      <b-table striped hover :items="PeakTableItems5" :fields="PeakFields" style="text-align: center"></b-table>
    </b-col>
    <b-col lg ='3'>
      <b-table striped hover :items="PeakTableItems6" :fields="PeakFields" style="text-align: center"></b-table>
    </b-col>
  </b-row>
    </Widget>
</div>
</template>

<script>
import Peak from "@/components/Charts/Peak/Peak";
import axios from "axios";
import Widget from "@/components/Widget/Widget";
import config from "@/config";
export default {
  name: "PeakAnalyse",
  data(){
    return{
      SelectDate: '2020-06-19',
      ShowData:{

      },
      Mode:0,
      ModeOption:[
        {
          value:0,
          text: '早高峰'
        },
        {
          value:1,
          text: '晚高峰'
        }
      ],
      PeakFields:[
        {
          key: '站点',
          sortable: false
        },
        {
          key: '客流量',
          sortable: true
        }
      ],
      PeakTableItems:null,
    }
  },
  components:{
    Widget,
    Peak
  },
  mounted() {
    this.getData();
  },
  watch:{
    SelectDate:{
      handler(){
        this.getData();
      }
    }
  },
  computed:{
    PeakTableItems1(){
      if(this.PeakTableItems!==null){
        return this.PeakTableItems.slice(0,this.PeakTableItems.length/12);
      }else{
        return null;
      }
    },
    PeakTableItems2(){
      if(this.PeakTableItems!==null){
        return this.PeakTableItems.slice(this.PeakTableItems.length/12,this.PeakTableItems.length/6);
      }else{
        return null;
      }
    },
    PeakTableItems3(){
      if(this.PeakTableItems!==null){
        return this.PeakTableItems.slice(this.PeakTableItems.length/6,this.PeakTableItems.length*3/8);
      }else{
        return null;
      }
    },
    PeakTableItems4(){
      if(this.PeakTableItems!==null){
        return this.PeakTableItems.slice(this.PeakTableItems.length*3/8,this.PeakTableItems.length*7/12);
      }else{
        return null;
      }
    },
    PeakTableItems5(){
      if(this.PeakTableItems!==null){
        return this.PeakTableItems.slice(this.PeakTableItems.length*7/12,this.PeakTableItems.length*19/24);
      }else{
        return null;
      }
    },
    PeakTableItems6(){
      if(this.PeakTableItems!==null){
        return this.PeakTableItems.slice(this.PeakTableItems.length*19/24,this.PeakTableItems.length);
      }else{
        return null;
      }
    }
  },
  methods:{
    compute(){
      let data =[];
      for(let i=0;i<this.ShowData.length;i++){
        let x = {};
        x.站点 = 'Sta'+ (this.ShowData[i][0]*13+this.ShowData[i][1]);
        x.客流量 = this.ShowData[i][2];
        data.push(x);
      }
      this.PeakTableItems  = data;
      console.log(data);
    },
    getData() {
      let _this = this;
      let start = null;
      let end = null;
      let lines = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'];
      if (this.Mode === 0) {
        start = this.SelectDate + ' 07:00:00';
        end = this.SelectDate + ' 09:00:00';
      } else {
        start = this.SelectDate + ' 16:00:00';
        end = this.SelectDate + ' 19:00:00';
      }
      let result =[];
      for (let i = 0; i < lines.length; i++) {
        axios.get(config.DNS + 'line/station/flow', {params: {start: start, end: end, step: lines[i]}})
            .then(function (response) {
              let data = response.data.data;
              for(let k=0;k<data.length;k++) {
                let stationNumber = parseInt(data[k].stationId.substring(3));
                result.push([Math.floor(stationNumber / 13), stationNumber % 13, parseInt(data[k].inflow)+parseInt(data[k].outflow)]);
              }
              _this.ShowData = result;
              _this.compute();
            })
      }
    }
  }
}
</script>

<style scoped>
.menu{
  font-size: 10px;
}
</style>
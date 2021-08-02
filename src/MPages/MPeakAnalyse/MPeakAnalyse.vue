<template>
<div>
  <b-row>
    <b-col lg="11">
      <Widget style="width: 100%;height: 400px;margin-left: 3%;background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <Peak width="94%" height="95%" id="PeakAnalysePeak" :data="ShowData" style="position: absolute;margin-left: 3%"></Peak>
        <b-row>
          <b-col lg="4">
            <b-form-select v-model="Mode" :options="ModeOption" style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f;width: 120px;height:40px;color: rgba(255,255,255,100)" @change="getData()"></b-form-select>
          </b-col>
          <b-col lg="6">
            <b-form-datepicker :min="new Date(2019, 11, 25)" :max="new Date(2020, 6,26)" selected-variant="info" id="example-datepicker"  style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f" v-model="SelectDate" class="mb-lg-n3"></b-form-datepicker>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
  </b-row>

  <!--
  <div style="margin-top: 10px">
    <div class="Info">
      <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);width: 100%;">
            <b-table striped hover :items="PeakTableItems.slice(0,8)" :fields="PeakFields.slice(0,8)" style="text-align: center"></b-table>
      </Widget>
    </div>
    <div class="Info">
      <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);width: 100%;">
        <b-table striped hover :items="PeakTableItems.slice(8,16)" :fields="PeakFields.slice(8.16)" style="text-align: center"></b-table>
      </Widget>
    </div>
    <div class="Info">
      <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);width: 100%;">
        <b-table striped hover :items="PeakTableItems.slice(16,24)" :fields="PeakFields.slice(16,24)" style="text-align: center"></b-table>
      </Widget>
    </div>
  </div>
  -->

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
      PeakTableItems:[],
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

<style scoped src="./MPeakAnalyse.scss" lang="scss">
.menu{
  font-size: 10px;
}
</style>
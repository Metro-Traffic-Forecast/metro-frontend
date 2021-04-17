<template>
<div>
  <b-row>
    <b-col lg="6">
      <Widget style="width: 100%;height: 630px">
        <Peak width="90%" height="600px" id="PeakAnalysePeak" :x-axis="StationOption" :data="ShowData" style="position: absolute"></Peak>
        <b-row>
           <b-col lg="4">
              <b-form-select v-model="Line" :options="LineOption" style="width: 120px;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>
           </b-col>
          <b-col lg="7">
            <b-form-datepicker :min="new Date(2019, 11, 25)" :max="new Date(2020, 6,26)" selected-variant="info" id="example-datepicker"  style="opacity: 0.5" v-model="SelectDate" class="mb-lg-n3"></b-form-datepicker>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
    <b-col lg="6">
      <Widget style="width: 100%;" title="信息说明">
        <small v-if="this.Line!=null">{{this.LineOption[this.Line-1].text}} {{this.SelectDate}}日早晚高峰客流信息</small>
        <b-table striped hover :items="PeakTableItems" :fields="PeakFields" style="text-align: center"></b-table>
      </Widget>
    </b-col>
  </b-row>
</div>
</template>

<script>
import Peak from "@/components/Charts/Peak/Peak";
import axios from "axios";
import Widget from "@/components/Widget/Widget";
export default {
  name: "PeakAnalyse",
  data(){
    return{
      SelectDate: '2020-01-01',
      Line : null,
      ShowData:{

      },
      PeakFields:[
        {
          key: '站点名称',
          sortable: false
        },
        {
          key: '日平均客流',
          sortable: true
        },
        {
          key: '首高峰时间',
          sortable: true,
        },
        {
          key: '首峰值',
          sortable: true,
        },
        {
          key: '次高峰时间',
          sortable: true,
        },
        {
          key: '次峰值',
          sortable: true,
        }
      ],
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
    PeakTableItems(){
      let data = [];
      let time =['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];
      let max1 = [];
      let max2 = [];
      let index1 = [];
      let index2 = [];
      let av = [];
      for(let i=0;i<this.StationOption.length;i++){
        data[i]={};
        data[i].站点名称 = this.StationOption[i];
        max1[i] = 0;
        max2[i] = 0;
        index1[i]=0;
        index2[i]=0;
        av[i] = 0;
      }

        for(let k=0;k<this.ShowData.length;k++){
          let stationIndex = this.ShowData[k][0];
          let timeIndex = this.ShowData[k][1];
          let value = this.ShowData[k][2];
          if(value > max1[stationIndex]){
            if(max1[stationIndex]>max2[stationIndex]){
              index2[stationIndex] = index1[stationIndex];
            }
            max1[stationIndex] = value;
            index1[stationIndex] = timeIndex;
          }else if(value > max2[stationIndex]){
            max2[stationIndex] = value;
            index2[stationIndex] = timeIndex;
          }
          av[stationIndex] += value;
        }

      for(let i=0;i<this.StationOption.length;i++){
        if(isNaN(av[i])){
          data[i].日平均客流 = 'none';
          data[i].首峰值 = 'none';
          data[i].次峰值 = 'none';
          data[i].首高峰时间 = 'none';
          data[i].次高峰时间 = 'none';
        }else {
          data[i].日平均客流 = Math.ceil(av[i] / 24);
          data[i].首峰值 = Math.min(index1[i], index2[i]);
          data[i].次峰值 = Math.max(index1[i], index2[i]);
          data[i].首高峰时间 = time[Math.min(index1[i], index2[i])];
          data[i].次高峰时间 = time[Math.max(index1[i], index2[i])];
        }
      }
      console.log(data);
      return data;
    }
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
        _this.StationOption = result;
        _this.compute();
      })
    },
    getData(){
      let _this = this;
      let start = this.SelectDate+' 00:00:00';
      let end = this.SelectDate+' 23:59:59';
      axios.get('http://host.tanhuiri.cn:19527/metro/station/inflow',{params:{start:start,end:end,step: 1}})
          .then(function (response) {
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
            _this.compute();
          })
    }
  }
}
</script>

<style scoped>
.menu{
  font-size: 10px;
}
</style>
<template>
<div>
  <b-row>
    <b-col lg="8">
      <Widget style="width: 100%;height: 630px">
        <PassengerFlowSection
        height="600px"
        width="100%"
        id="SectionAnalysePassengerFlow"
        :down-flow="DownFlow"
        :up-flow="UpFlow"
        style="position: absolute; top: 70px"
        ></PassengerFlowSection>

        <b-row style="margin-bottom: 20px">
          <b-col lg = "3">
            <b-form-select v-model="Line" :options="LineOption" style="width: 100%;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>
          </b-col>
          <b-col lg = "3">
            <b-form-select v-model="Station" :options="StationOption" style="width: 100%;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="compute()"></b-form-select>
          </b-col>
          <b-col lg="6">
            <b-form-datepicker :min="new Date(2019, 11, 25)" :max="new Date(2020, 6,26)" selected-variant="info" id="example-datepicker"  style="opacity: 0.5" v-model="SelectDate" class="mb-lg-n3"></b-form-datepicker>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
    <b-col lg="4">
      <Widget style="width: 100%;height: auto" title="信息说明">
        <small v-if="StationOption[Station-1]!=null">{{StationOption[Station-1].text}}{{SelectDate}}日 客流断面信息</small><br/><br/>
        <div v-if="StationOption[Station-1]!=null">
          <h6 class="name">上行断面峰值</h6>
          <p class="description deemphasize mb-xs">{{UpMax}}</p>
          <small>峰值时间</small>
          <p class="description deemphasize mb-xs">{{UpMaxTime}}</p>
          <br/>
          <h6 class="name">下行断面峰值</h6>
          <p class="description deemphasize mb-xs">{{DownMax}}</p>
          <small>峰值时间</small>
          <p class="description deemphasize mb-xs">{{DownMaxTime}}</p>
        </div>
      </Widget>
    </b-col>
  </b-row>
</div>
</template>

<script>
import PassengerFlowSection from "../../components/Charts/PassengerFlowSection/PassengerFlowSection";
import axios from "axios";
import Widget from "@/components/Widget/Widget";
import config from "@/config";
export default {
  name: "SectionAnalyse",
  components:{
    Widget,
    PassengerFlowSection
  },
  data(){
    return{
      Tag:[0,0],
      UpMax:0,
      DownMax:0,
      UpMaxTime:null,
      DownMaxTime:null,
      SelectDate: '2020-01-01',
      Station: 1,
      DownFlow:null,
      UpFlow:null,
      Line:1,
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
      StationOption:[],
      AllStationData:[],
    }
  },
  mounted() {
    this.getStationOption();
    this.getLineData();
  },
  watch:{
    SelectDate:{
      handler(){
        this.getLineData();
        this.compute();
      }
    }
  },
  methods:{
    compute(){
        let station = this.StationOption[this.Station - 1].stationId;
        for(let i=0;i<this.AllStationData.length;i++){
          if(this.AllStationData[i].stationId == station){
            this.UpFlow = this.AllStationData[i].inflow;
            this.DownFlow = this.AllStationData[i].outflow;
            break;
          }
        }

        let time = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
          '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',];
        let max1=0,max2=0,index1=0,index2=0;
        for(let i = 0;i<24;i++){
          if(this.UpFlow[i]>max1){
            max1 = this.UpFlow[i];
            index1 = i;
          }
          if(this.DownFlow[i]<max2){
            max2 = this.DownFlow[i];
            index2 = i;
          }
        }

        this.UpMax = max1;
        this.DownMax = -1*max2;
        this.UpMaxTime = time[index1];
        this.DownMaxTime = time[index2];
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
        _this.Tag[0]=1;
        if(_this.Tag[0] === 1 && _this.Tag[1] === 1){
          _this.compute();
        }
      })
    },
    getLineData:function(){
      let date = this.SelectDate;

      let p = date.split('-');
      p[1] = (parseInt(p[1])-1)+"";
      let line = this.LineOption[this.Line - 1].text;
      let _this = this;
      let counter = 0;
      let result = [];
      for(let i=0;i<24;i++) {
        let start = "";
        let end = "";
        if(i<=9){
          start = date + " 0" + i+":00:00";
        }else{
          start = date + " " + i+":00:00";
        }
        if(i<9){
          end = date + " 0" + (i+1)+":00:00";
        }else if(i==23){
          end = date + " " + 23+":59:59";
        }else{
          end = date + " " + (i+1)+":00:00";
        }
        axios.get(config.DNS+'line/station/flow', {params:{start:start,end:end,step: line}}).then(function (response) {
          let data = response.data.data;
          if(counter == 0) {
            for (let i = 0; i < data.length; i++) {
              result[i] = {};
              result[i].inflow = [];
              result[i].outflow = [];
            }
          }
          for (let i = 0; i < data.length; i++) {
            result[i].stationId = data[i].stationId;
            result[i].inflow.push(data[i].inflow);
            result[i].outflow.push(-1 * data[i].outflow);
          }
          counter++;
          if(counter==24) {
            _this.AllStationData = result;
            _this.Tag[1]=1;
            if(_this.Tag[0] === 1 && _this.Tag[1] === 1){
              _this.compute();
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
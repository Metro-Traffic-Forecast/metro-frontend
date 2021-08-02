<template>
<div>
  <b-row>
    <b-col lg="11">
      <Widget style="width: 100%;height: 360px;margin-left: 3%;background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <PassengerFlowSection v-if="Data!=null"
        height="100%"
        width="100%"
        id="SectionAnalysePassengerFlow"
        :down-flow="Data.outflow"
        :up-flow="Data.inflow"
        :x-axis="Data.stationList"
        style="position: absolute; top: 70px"
        ></PassengerFlowSection>

        <b-row style="margin-bottom: 20px">
          <b-col lg = "3">
            <b-form-select v-model="Line" :options="LineOption" style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f;width: 100%;height:40px;color: rgba(255,255,255,100)" @change="getLineData()"></b-form-select>
          </b-col>
          <b-col lg = "3">
            <b-form-select v-model="Time" :options="TimeOption" style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f;width: 100%;height:40px;color: rgba(255,255,255,100)" @change="getLineData()"></b-form-select>
          </b-col>
          <b-col lg="6">
            <b-form-datepicker :min="new Date(2019, 11, 25)" :max="new Date(2020, 6,26)" selected-variant="info" id="example-datepicker"  style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f;" v-model="SelectDate" class="mb-lg-n3"></b-form-datepicker>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
  </b-row>


  <div style="margin-top: 10px">
    <div class="Double" style="margin-left: 20px">
      <Widget style="width: 100%;height: auto;background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <b-table striped hover :items="SectionItems.slice(0,SectionItems.length/2)" :fields="SectionFields" style="text-align: center"></b-table>
      </Widget>
    </div>
    <div class="Double">
      <Widget style="width: 100%;height: auto;background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <b-table striped hover :items="SectionItems.slice(SectionItems.length/2, SectionItems.length)" :fields="SectionFields" style="text-align: center"></b-table>
      </Widget>
    </div>
  </div>
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
      SectionFields:[
        {
          key: '站点',
          sortable: false
        },
        {
          key: '上行流量',
          sortable: true
        },
        {
          key: '下行流量',
          sortable: true
        }
      ],
      Time:0,
      TimeOption:[
        {
          value: 0,
          text: '06:00:00~12:00:00'
        },
        {
          value: 1,
          text: '12:00:00~18:00:00'
        },
        {
          value: 2,
          text: '18:00:00~24:00:00'
        }
      ],
      SelectDate: '2020-06-19',
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
      Data:null,
    }
  },
  mounted() {
    this.getLineData();
  },
  watch:{
    SelectDate:{
      handler(){
        this.getLineData();
      }
    }
  },
  computed:{
    SectionItems(){
      let result = [];
      if(this.Data!=null){
        for(let i=0;i< this.Data.inflow.length;i++){
          let x ={};
          x.站点 = this.Data.stationList[i];
          x.上行流量 = this.Data.inflow[i];
          x.下行流量 = -1 * this.Data.outflow[i];
          result.push(x);
        }
      }
      return result;
    }
  },
  methods:{
    getLineData:function(){
      let date = this.SelectDate;

      let p = date.split('-');
      p[1] = (parseInt(p[1])-1)+"";
      let line = this.LineOption[this.Line - 1].text;
      let _this = this;
      let result = {};
      result.stationList  =[];
      result.inflow = [];
      result.outflow = [];
      let start =  this.SelectDate+" "+this.TimeOption[this.Time].text.substring(0,8);
      let end =  null;
      if(this.Time !== 2){
        end = this.SelectDate+" "+this.TimeOption[this.Time].text.substring(9);
      }else{
        end = this.SelectDate+" "+"23:59:59";
      }

        axios.get(config.DNS+'line/station/flow', {params:{start:start,end:end,step: line}}).then(function (response) {
          let data = response.data.data;

          for (let i = 0; i < data.length; i++) {
            result.stationList.push(data[i].stationId);
            result.inflow.push(data[i].inflow);
            result.outflow.push(-1 * data[i].outflow);
          }
            _this.Data = result;

        })

    }
  }
}
</script>

<style scoped src="./Double.scss" lang="scss">

</style>
<template>
  <div>
    <b-row>
      <b-col lg="11" >
        <Widget id="Widget" style="background-image: linear-gradient(to bottom right, #232628, #141b23);padding-bottom:0;margin-bottom: 0;margin-left: 3%">
          <b-form-select v-model="SelectWeek" :options="SelectOption" style="box-shadow: 1px 1px 0 1px #1d1d1f;background-color: #232628;width: 120px;height:40px;margin-bottom:20px;color: rgba(255,255,255,100)" @change="getData()"></b-form-select>
          <WorkAndWeekDay height="300px" width="100%" id="WeekDataWorkAndWeekDay" :data="WorkAndWeekDayData"></WorkAndWeekDay>
        </Widget>
      </b-col>
    </b-row>

    <b-row style="margin-top: 10px;padding-left: 10px">
      <b-col lg="5" style="padding-right: 0">
        <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);padding-bottom:0;margin-bottom: 0;margin-left: 3%" id="info">
          <b-table striped hover :items="WeekAndWorkTableItems.slice(0,4)" :fields="WeekAndWorkFields.slice(0,4)" style="text-align: center"></b-table>
        </Widget>
      </b-col>
      <b-col lg="6" style="padding-left: 10px">
        <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);padding-bottom:0;margin-bottom: 0;margin-left: 3%" id="info2">
          <b-table striped hover :items="WeekAndWorkTableItems.slice(4, 8)" :fields="WeekAndWorkFields.slice(4, 8)" style="text-align: center"></b-table>
        </Widget>
      </b-col>
    </b-row>

    <b-row style="margin-top: 10px">
      <b-col lg="11">
        <Widget style="font-size:16px;font-weight:500;text-align: center;background-image: linear-gradient(to bottom right, #232628, #141b23);padding-bottom:10px;padding-top:10px;margin-bottom:0;margin-left: 3%" id="info3">
          <span>总线路-工作日平均客流：{{WeekAndWorkTableItems[8].工作日平均客流}}</span>
          <span style="margin-left: 10%"> 总线路-休息日平均客流：{{WeekAndWorkTableItems[8].休息日平均客流}}</span>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import WorkAndWeekDay from "@/components/Charts/WorkAndWeekDay/WorkAndWeekDay";
import Widget from "@/components/Widget/Widget";
import config from "@/config";
export default {
  name: "MWeekData",
  components:{
    Widget,
    WorkAndWeekDay
  },
  data(){
    return{
      SelectWeek:0,
      SelectOption:[

      ],
      WorkAndWeekDayData:{

      },
      WeekAndWorkFields:[
        {
          key: '线路名称',
          sortable: false
        },
        {
          key: '工作日平均客流',
          sortable: true
        },
        {
          key: '休息日平均客流',
          sortable: true,
        }
      ],
    }
  },
  mounted() {
    this.compute();
    this.SelectWeek = 0;
    this.getData();
   },
  computed:{
    WeekAndWorkTableItems(){
      let lines = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线','所有线路'];
      let data = [];
      let av1 = 0;
      let av2 = 0;
      for(let i = 0;i<8;i++){
        av1=0;
        av2=0;
        for(let k = 0;k<5;k++){
          av1+=this.WorkAndWeekDayData[i][k];
        }
        for(let k = 5;k<7;k++){
          av2+=this.WorkAndWeekDayData[i][k];
        }
        data[i] = {};
        data[i].线路名称 = lines[i];
        data[i].工作日平均客流 = Math.ceil(av1/5);
        data[i].休息日平均客流 = Math.ceil(av2/2);
      }
      av1=0;
      av2=0;
      for(let i = 0;i<8;i++){
        av1 += data[i].工作日平均客流;
        av2 += data[i].休息日平均客流;
      }
      data[8]= {};
      data[8].线路名称 = lines[8];
      data[8].工作日平均客流 = av1;
      data[8].休息日平均客流 = av2;
      return data;
    },
  },
  methods:{
    compute(){

      let data=[];
      let base = +new Date(2019,11,23);
      let week = 1000*3600*24*7;
      for(let i=0;i<31;i++){
        data[i] = {};
        data[i].value  = i;
        let date = new Date(base + i * week);

        let text = date.getFullYear()+"-";
        if(date.getMonth()+1<10){
          text+='0'+(date.getMonth()+1);
        }else{
          text+=(date.getMonth()+1);
        }
        text+="-";
        if(date.getDate()<10){
          text+='0'+date.getDate();
        }else{
          text+=date.getDate();
        }
        data[i].text = text;
      }
      this.SelectOption = data;
    },
    getData(){
      let day = this.SelectOption[this.SelectWeek].text;

      let p = day.split('-');
      //获取开始时间
      let start ="";
      let end = "";
      let data = [];
      let index = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'];
      for(let i=0;i<8;i++){
        data[i] ={};
        data[i].lineName = index[i];
        data[i].data =[];
      }
      let _this = this;
      let counter= 0;
      for(let i=0;i<7;i++){
        let date1 = new Date(+new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2])) + i*1000*3600*24);
        let date2 = new Date(+new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2])) + (i+1)*1000*3600*24);
        start = date1.getFullYear() + "-" + ((date1.getMonth() + 1) < 10 ? "0" + (date1.getMonth() + 1):(date1.getMonth() + 1))+ "-" + (date1.getDate() < 10 ? "0" + date1.getDate():date1.getDate()) + " " + (date1.getHours()<10?"0"+date1.getHours():date1.getHours()) + ":" + (date1.getMinutes()<10?"0"+date1.getMinutes():date1.getMinutes()) + ":" + (date1.getSeconds()<10?"0"+date1.getSeconds():date1.getSeconds());
        end = date2.getFullYear() + "-" + ((date2.getMonth() + 1) < 10 ? "0" + (date2.getMonth() + 1):(date2.getMonth() + 1))+ "-" + (date2.getDate() < 10 ? "0" + date2.getDate():date2.getDate()) + " " + (date2.getHours()<10?"0"+date2.getHours():date2.getHours()) + ":" + (date2.getMinutes()<10?"0"+date2.getMinutes():date2.getMinutes()) + ":" + (date2.getSeconds()<10?"0"+date2.getSeconds():date2.getSeconds());
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
            data[p].data.push(parseInt(d[k].outflow));
          }
          counter++;
          if(counter==7){
            let relData = [];
            for(let r =0;r<8;r++) {
              relData[r] = data[r].data;
            }
            _this.WorkAndWeekDayData = relData;
          }
        });
      }},
  }
}
</script>

<style scoped>

</style>
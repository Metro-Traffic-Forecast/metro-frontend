<template>
  <div>
    <b-row >
      <b-col lg="8">
        <Widget id="Widget">
          <b-form-select v-model="SelectWeek" :options="SelectOption" style="width: 120px;height:40px;opacity: 0.5;margin-bottom:20px;color: rgba(255,255,255,100)" @change="getData()"></b-form-select>
          <WorkAndWeekDay height="600px" width="100%" id="WeekDataWorkAndWeekDay" :data="WorkAndWeekDayData"></WorkAndWeekDay>
        </Widget>
      </b-col>
      <b-col lg="4" >
        <Widget style="width:100%;height: 665px" id="info" title="信息说明">
          <small>各线路自{{this.SelectOption[this.SelectWeek].text}}一周内客流量统计</small>
          <b-table striped hover :items="WeekAndWorkTableItems" :fields="WeekAndWorkFields" style="text-align: center"></b-table>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import WorkAndWeekDay from "@/components/Charts/WorkAndWeekDay/WorkAndWeekDay";
import Widget from "@/components/Widget/Widget";
export default {
  name: "WeekData",
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
        axios.get('http://host.tanhuiri.cn:19527/metro/line/flow', {
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
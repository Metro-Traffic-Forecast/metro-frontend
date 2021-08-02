<template>
<div>
  <b-row>
    <b-col lg="11" style="margin-left: 10px">
      <Widget style="width: 100%;height: 4020px">
        <b-form-select v-model="SelectMonth" :options="SelectOption" style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f;float:left;width: 120px;height:40px;margin-bottom:20px;color: rgba(255,255,255,100)" @change="getTurnoverData()"></b-form-select>
        <b-button style="margin-left:30px;background-color: #000000;color: #ffffff;height: 40px; border-color: #000000;opacity: 0.3;" @click="getAllTurnoverData()">总营业额</b-button>
        <Turnover height="3950px" width="100%" id="TurnoverAnalyseTurnover" :data="TurnoverData"></Turnover>
      </Widget>
    </b-col>
  </b-row>

  <b-row style="margin-top: 10px">
    <b-col lg="11" style="margin-left: 10px">
      <Widget style="width: 100%;height: auto" :collapsed="true" :collapse="true" title="营收信息">
        <small>最大营业额：{{MaxTurnover}} 总营业额：{{AllTurnover}}</small>
        <b-row>
          <b-col lg="6">
            <b-table striped hover :items="TurnoverTableItems1" :fields="TurnoverFields"></b-table>
          </b-col>
          <b-col lg="6">
            <b-table striped hover :items="TurnoverTableItems2" :fields="TurnoverFields"></b-table>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
  </b-row>
</div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import Turnover from "@/components/Charts/Turnover/Turnover";
import axios from "axios";
import config from "@/config";
export default {
name: "TurnoverAnalyse",
  components: {
    Widget,Turnover
  },
  data(){
    return {
      SelectMonth:0,
      SelectOption:null,
      MaxTurnover:0,
      TurnoverTableItems:null,
      TurnoverData: null,
      TurnoverFields:[
        {
          key: '站点',
          sortable: false
        },
        {
          key: '营业额',
          sortable: true
        },
        {
          key: '占比',
          sortable: false
        }
      ],
      AllTurnover :0,
    }
  },
  mounted() {
    this.compute();
    this.getTurnoverData();
  },
  computed:{
    TurnoverTableItems1(){
      if(this.TurnoverTableItems==null){
        return null;
      }
      return this.TurnoverTableItems.slice(0,this.TurnoverTableItems.length/2);
    },
    TurnoverTableItems2(){
      if(this.TurnoverTableItems==null){
        return null;
      }
      return this.TurnoverTableItems.slice(this.TurnoverTableItems.length/2,this.TurnoverTableItems.length);
    }
  },
  methods:{
    compute(){
      let data=[];
      for(let i=0;i<8;i++){
        data[i] = {};
        data[i].value  = i;
      }
      data[0].text = '2019-12';
      data[1].text = '2020-01';
      data[2].text = '2020-02';
      data[3].text = '2020-03';
      data[4].text = '2020-04';
      data[5].text = '2020-05';
      data[6].text = '2020-06';
      data[7].text = '2020-07';
      this.SelectOption = data;
    },
    getTurnoverData:function (){
      let _this = this;
      let start = null;
      let end = null;
      if(this.SelectOption != null) {
        start = this.SelectOption[this.SelectMonth].text + '-01 00:00:00';
        if (this.SelectMonth.value === 0 || this.SelectMonth.value === 1 || this.SelectMonth.value === 3 || this.SelectMonth.value === 5 || this.SelectMonth.value === 7) {
          end = this.SelectOption[this.SelectMonth].text + '-30 23:59:59';
        } else if (this.SelectMonth.value === 2) {
          end = this.SelectOption[this.SelectMonth].text + '-28 23:59:59';
        } else {
          end = this.SelectOption[this.SelectMonth].text + '-29 23:59:59';
        }
      }else{
        start = '2019-12-01 00:00:00';
        end  = "2019-12-31 23:59:59";
      }
      let all =0;
      axios.get(config.DNS+'station/turnover',{params:{start:start,end:end}})
          .then(function (response){
            let data = response.data.data;
            let result = [];
            let max = 0;
            let t = Object.keys(data);
            for(let i=0;i<t.length;i++){
              result.push([0,data[t[i]],t[i]]);
              all+= parseInt(data[t[i]]);
              if(parseInt(data[t[i]])>max){
                max = parseInt(data[t[i]]);
              }
            }
            for(let i = 0;i<t.length;i++){
              result[i][0] = Math.ceil(result[i][1]*100/max);
            }
            _this.AllTurnover = all;
            let yn = false;
            for(let i = 1;i<t.length;i++){
              yn=false;
              for(let k = i-1;k>=0;k--) {
                if(parseInt(result[k][1])<parseInt(result[i][1])){
                  let d= result[i];
                  for(let p = i-1;p > k;p--){
                    result[p+1] = result[p];
                  }
                  result[k+1] = d;
                  yn=true;
                  break;
                }
              }
              if(!yn){
                let d= result[i];
                for(let p = i-1;p > 0;p--){
                  result[p+1] = result[p];
                }
                result[0] = d;
              }
            }
            _this.MaxTurnover = max;
            _this.TurnoverData = result;

            let data2 = [];
            for(let i=0;i<_this.TurnoverData.length;i++){
              data2[i]={};
              data2[i].站点 = _this.TurnoverData[i][2]
              data2[i].营业额 = _this.TurnoverData[i][1];
              data2[i].占比 = _this.TurnoverData[i][0]+"%";
            }
            _this.TurnoverTableItems = data2;
          })
    },
    getAllTurnoverData:function (){
      let _this = this;

       let start = '2019-12-01 00:00:00';
       let end  = "2020-08-01 00:00:00";

      axios.get(config.DNS+'station/turnover',{params:{start:start,end:end}})
          .then(function (response){
            let data = response.data.data;
            let result = [];
            let max = 0;
            let all =0;
            let t = Object.keys(data);
            for(let i=0;i<t.length;i++){
              result.push([0,data[t[i]],t[i]]);
              all+=parseInt(data[t[i]]);
              if(parseInt(data[t[i]])>max){
                max = parseInt(data[t[i]]);
              }
            }
            for(let i = 0;i<t.length;i++){
              result[i][0] = Math.ceil(result[i][1]*100/max);
            }
            _this.AllTurnover = all;
            let yn = false;
            for(let i = 1;i<t.length;i++){
              yn=false;
              for(let k = i-1;k>=0;k--) {
                if(parseInt(result[k][1])<parseInt(result[i][1])){
                  let d= result[i];
                  for(let p = i-1;p > k;p--){
                    result[p+1] = result[p];
                  }
                  result[k+1] = d;
                  yn=true;
                  break;
                }
              }
              if(!yn){
                let d= result[i];
                for(let p = i-1;p > 0;p--){
                  result[p+1] = result[p];
                }
                result[0] = d;
              }
            }
            _this.MaxTurnover = max;
            _this.TurnoverData = result;

            let data2 = [];
            for(let i=0;i<_this.TurnoverData.length;i++){
              data2[i]={};
              data2[i].站点 = _this.TurnoverData[i][2]
              data2[i].营业额 = _this.TurnoverData[i][1];
              data2[i].占比 = _this.TurnoverData[i][0]+"%";
            }
            _this.TurnoverTableItems = data2;
          })
    }
  }
}
</script>

<style scoped>

</style>
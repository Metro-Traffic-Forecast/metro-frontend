<template>
<div>
  <b-row>
    <b-col lg="7">
      <Widget style="width: 100%;height: 3750px">
        <Turnover height="3720px" width="100%" id="TurnoverAnalyseTurnover" :data="TurnoverData"></Turnover>
      </Widget>
    </b-col>

    <b-col lg="5">
      <Widget style="width: 100%;height: auto" title="信息说明">
        <small>所有站点营业额信息（表中’占比‘为相对于最大营业额的占比）</small><br>
        <small>最大营业额：{{MaxTurnover}}</small>
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
      ]
    }
  },
  mounted() {
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
    getTurnoverData:function (){
      let _this = this;
      axios.get(config.DNS+'station/turnover',{params:{start:'2019-12-25 00:00:00',end:'2020-07-17 00:00:00'}})
          .then(function (response){
            let data = response.data.data;
            let result = [];
            let max = 0;
            let t = Object.keys(data);
            for(let i=0;i<t.length;i++){
              result.push([0,data[t[i]],t[i]]);
              if(parseInt(data[t[i]])>max){
                max = parseInt(data[t[i]]);
              }
            }
            for(let i = 0;i<t.length;i++){
              result[i][0] = Math.ceil(result[i][1]*100/max);
            }

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
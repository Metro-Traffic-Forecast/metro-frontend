<template>
<div>
  <b-row>
    <b-col lg="11">
      <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);width: 100%;height: 350px;margin-left: 3%">
          <OD width="110%" height="350px" id="ODTransportOD" :links="links"></OD>
      </Widget>
    </b-col>

  </b-row>
  <b-row style="margin-top: 10px">
    <b-col lg="11">
      <Widget :collapsed="true" :collapse="true" title="换乘信息"
          style="width: 104%;height: auto;margin-left: 1%;background-image: linear-gradient(to bottom right, #232628, #141b23);padding-bottom: 0;margin-bottom: 0" >
        <b-table striped hover :items="ODTableItems" :fields="ODFields" style="line-height:15px;font-size:13px;text-align: center"></b-table>
      </Widget>
    </b-col>
  </b-row>
</div>
</template>

<script>
import OD from '../../components/Charts/OD/OD';
import Widget from "@/components/Widget/Widget";
import axios from "axios";
import config from "@/config";

export default {
  name: "ODTransport",
  components:{
    OD,Widget
  },
  data(){
    return{
      links: null,
      LineList:['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'],
      ODFields:[
        {
          key: '线路',
          sortable: false
        },
        {
          key: '1号线',
          sortable: false
        },
        {
          key: '2号线',
          sortable: false
        },
        {
          key: '3号线',
          sortable: false,
        },
        {
          key: '4号线',
          sortable: false,
        },
        {
          key: '5号线',
          sortable: false,
        },
        {
          key: '10号线',
          sortable: false,
        },
        {
          key: '11号线',
          sortable: false,
        },
        {
          key: '12号线',
          sortable: false,
        },
        {
          key: '总计',
          sortable: false,
        }
      ]
    }
  },
  mounted() {
    this.getODLinks();
  },
  computed:{
    ODTableItems(){
      if(this.links == null){
        return null;
      }
      let data = [];
      for(let i = 0;i<8;i++){
        data[i] = {};
        data[i].线路 = this.LineList[i];
        data[i][this.LineList[i]] = 0;
      }
      for(let i = 0;i<56;i++){
        let x = 0;
        let y=0;
        for(let k = 0;k<8;k++){
          if(this.LineList[k]+" " == this.links[i].target){
            y= k;
            break;
          }
        }
        for(let k = 0;k<8;k++){
          if(this.LineList[k] == this.links[i].source){
            x= k;
            break;
          }
        }
        switch(y){
          case 0: data[x]['1号线'] = this.links[i].value; break;
          case 1: data[x]['2号线'] = this.links[i].value; break;
          case 2: data[x]['3号线'] = this.links[i].value; break;
          case 3: data[x]['4号线'] = this.links[i].value; break;
          case 4: data[x]['5号线'] = this.links[i].value; break;
          case 5: data[x]['10号线'] = this.links[i].value; break;
          case 6: data[x]['11号线'] = this.links[i].value; break;
          case 7: data[x]['12号线'] = this.links[i].value; break;
        }
      }
      data[8]={};
      data[8].线路 = '总计';
      let allall = 0;
      for(let k = 0;k<8;k++){
        data[k].总计 = data[k]['1号线'] + data[k]['2号线']+ data[k]['3号线']+ data[k]['4号线']+ data[k]['5号线']+ data[k]['10号线']+ data[k]['11号线']+ data[k]['12号线'];
        let all = 0;
        for(let i = 0;i<8;i++){
          all+=data[i][this.LineList[k]];
        }
        data[8][this.LineList[k]] = all;
        allall +=all;
      }
      data[8].总计 = allall;

      for(let k = 0;k<8;k++) {
        for(let t = 0;t<8;t++){
          data[k][this.LineList[t]] +=" (" +Math.floor(data[k][this.LineList[t]]*100/allall)+"%)";
        }
        data[k].总计+=" (" +Math.floor(data[k].总计*100/allall)+"%)";
        data[8][this.LineList[k]]+=" (" +Math.floor(data[8][this.LineList[k]]*100/allall)+"%)";
      }
      return data;
    }
  },
  methods:{
    getODLinks:function (){
      let _this = this;
      axios.get(config.DNS+'line/exchange', {
        params: {
          start: '2019-12-25 23:59:59',
          end: '2020-07-16 00:00:00'
        }
      }).then(function (response){
        let data = response.data.data;
        let result=[];
        for(let f in data){
          for(let e in data[f]){
            let x = {};
            x.source = f;
            x.target = e+" ";
            x.value = parseInt(data[f][e]);
            result.push(x);
          }
        }
        _this.links = result;
      });
    }
  }
}
</script>

<style scoped>

</style>
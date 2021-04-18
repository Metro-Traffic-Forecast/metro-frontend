<template>
<div>
  <b-row>
    <b-col lg="6">
      <Widget style="width: 100%;height: 500px">
        <b-row >
          <b-col lg = "3">
            <b-form-select v-model="Line" :options="LineOption" style="width: 100%;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>
          </b-col>
          <b-col lg = "3">
            <b-form-select v-model="Station" :options="StationOption" style="width: 100%;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getData()"></b-form-select>
          </b-col>
        </b-row>
        <b-row >
          <b-col lg="6">
            <AgeAndSex
            id="AgeStructure"
            width="100%"
            height="500px"
            Title="用户年龄结构分析"
            name="1"
            :data="AgeOption"></AgeAndSex>
          </b-col>
          <b-col lg="6">
            <AgeAndSex
              id="SexStructure"
              width="100%"
              name="2"
              height="500px"
              Title="用户性别结构分析"
              :data="SexOption"></AgeAndSex>
          </b-col>
        </b-row>
      </Widget>
        <b-row>
          <b-col lg="12">
            <Widget style="width: 100%;height: auto">
              <UserHome
                  width="100%"
                  height="700px"
                  id="china"
                  :data="MapData"></UserHome>
            </Widget>
          </b-col>
        </b-row>

    </b-col>
    <b-col lg="6">
      <Widget style="width: 100%;" title="信息说明">
        <small>{{Station}}站点用户年龄与性别：</small>
        <b-table striped hover :items="AgeItems" :fields="AgeFields" style="text-align: center"></b-table>
        <b-table striped hover :items="SexItems" :fields="SexFields" style="text-align: center"></b-table>
        <small>地铁交通用户归属地分析：</small>
        <b-row>
          <b-col lg = '6'>
            <b-table striped hover :items="UserItems1" :fields="UserFields" style="text-align: center"></b-table>
          </b-col>
          <b-col lg = '6'>
            <b-table striped hover :items="UserItems2" :fields="UserFields" style="text-align: center"></b-table>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
  </b-row>

</div>
</template>

<script>
import AgeAndSex from "@/components/Charts/AgeAndSex/AgeAndSex";
import UserHome from "@/components/Charts/UserHome/UserHome";
import Widget from "@/components/Widget/Widget";
import axios from "axios";
import config from "@/config";
export default {
  name: "UserInfo",
  components:{
    AgeAndSex,Widget,UserHome
  },
  data(){
    return{
      UserFields:[
        {
          key: '归属地',
          sortable: false
        },
        {
          key: '总人数',
          sortable: false
        },
        {
          key: '比例',
          sortable: false
        },
      ],
      MapData:null,
      AllUserNumber: 0,
      SexFields:[
        {
          key: '性别',
          sortable: false
        },
        {
          key: '总人数',
          sortable: false
        },
        {
          key: '比例',
          sortable: false
        },
      ],
      AgeFields:[
        {
          key: '年龄分段',
          sortable: false
        },
        {
          key: '总人数',
          sortable: false
        },
        {
          key: '比例',
          sortable: false
        },
      ],
      SexOption:null,
      AgeOption:null,
      Line:1,
      Station: 'Sta1',
      StationOption:null,
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
      UserItems: null,
    }
  },
  mounted() {
    this.getStationOption();
    this.getUserHomeData();
  },
  computed:{
    AgeItems(){
      let data = [];
      if(this.AgeOption!=null){
        let all =0;
        for(let i=0;i<this.AgeOption.length;i++){
          data[i]={};
          data[i].年龄分段=this.AgeOption[i].name;
          data[i].总人数=this.AgeOption[i].value;
          all+=this.AgeOption[i].value;
        }
        for(let i=0;i<this.AgeOption.length;i++) {
          data[i].比例 = Math.ceil(100*data[i].总人数/all)+"%";
        }
        return data;
      }
      return null;
    },
    SexItems(){
      let data = [];
      if(this.SexOption!=null){
        let all =0;
        for(let i=0;i<2;i++){
          data[i]={};
          if(i==0){
            data[i].性别 = '男';
          }else{
            data[i].性别 = '女';
          }
          data[i].总人数= parseInt(this.SexOption[i].value);
          all+=parseInt(this.SexOption[i].value);
        }
        for(let i=0;i<2;i++) {
          data[i].比例 = Math.ceil(100*data[i].总人数/all)+"%";
        }
        return data;
      }
      return null;
    },
    UserItems1(){
      if(this.UserItems == null){
        return null;
      }
      return this.UserItems.slice(0 ,Math.floor(this.UserItems.length/2));
    },
    UserItems2(){
      if(this.UserItems == null){
        return null;
      }
      return this.UserItems.slice(Math.floor(this.UserItems.length/2) ,this.UserItems.length);
    },
  },
  methods:{
    getUserHomeData(){
      let _this = this;
      axios.get(config.DNS+'user/province').then(function (response) {
        let data = response.data.data;
        let result=[];
        for(let i=0;i<data.length;i++){
          result[i]={};
          result[i].name = data[i]['provinceName'];
          result[i].value = data[i]['count'];
        }
        _this.MapData = result;

        let all = 0;
        let data2 = [];
        for(let i=0;i<_this.MapData.length;i++){
          data2[i] = {};
          all+=parseInt(_this.MapData[i].value);
          data2[i].归属地 = _this.MapData[i].name;
          data2[i].总人数 = parseInt(_this.MapData[i].value);
        }
        for(let i=0;i<_this.MapData.length;i++) {
          data2[i].比例 = (parseInt(_this.MapData[i].value) * 100 / all).toFixed(2) + "%";
        }
        _this.UserItems = data2;
      })
    },
    getData:function (){
      let _this = this;
      axios.get(config.DNS+'station/ageRatio',{params:{station:this.Station, type: true}}).then(function (response) {
        let data = response.data.data;
        let result=[];
        let max = 0;
        for(let i=0;i<data.length;i++){
            if(Object.keys(data[i])[0]>max){
              max = Object.keys(data[i])[0];
          }
        }
        for(let i=0;i<=Math.floor(max/12);i++){
          result[i] ={};
          result[i].name = i*12+"~"+(i+1)*12;
          result[i].value = 0;
        }
        for(let i=0;i<data.length;i++){
          result[Math.floor(parseInt(Object.keys(data[i])[0])/12)].value += parseInt(data[i][Object.keys(data[i])[0]]);
        }
        _this.AgeOption = result;
      })
      axios.get(config.DNS+'station/sexRatio',{params:{station:this.Station, type: true}}).then(function (response) {
        let data = response.data.data;
        let result = [];
        result[0]={};
        result[0].name = '男';
        result[0].value = data.男;
        result[1]={};
        result[1].name = '女';
        result[1].value = data.女;
        _this.SexOption = result;
      })
    },
    getStationOption() {
      let line = this.LineOption[this.Line - 1].text;
      let _this = this;
      axios.get(config.DNS+'station').then(function (response) {
        let data = response.data.data;
        let result=[];
        for(let i=0;i<data.length;i++){
          if(data[i].lineName == line){
            result.push(data[i].stationId);
          }
        }
        _this.StationOption = result;
        _this.getData();
      })
    }
  }
}
</script>

<style scoped>

</style>
<template>
<div>
  <div style="width: 99%">
    <Widget style="height: 100%;width: 100%;padding-left: 11px;margin-bottom: 0;padding-bottom: 10px;padding-top: 10px;background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <span class="s-title">用户年龄与性别分析</span>
    </Widget>
  </div>

  <b-row style="margin-top: 10px">
    <!--两个饼图-->
    <b-col lg="6" style="padding: 0; ">
      <b-row style="margin-left: 20px;">
      <Widget style="width: 100%;height:100%;padding: 0;margin: 0;background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <b-row >
          <b-col lg="12">
            <AgeAndSex
                id="AgeStructure"
                width="100%"
                height="370px"
                Title="用户年龄结构分析"
                name="1"
                :data="AgeOption"></AgeAndSex>
          </b-col>
        </b-row>
      </Widget>
      </b-row>

      <b-row style="margin-left: 20px;margin-top: 10px">
      <Widget style="width: 100%;height:100%;padding: 0;background-image: linear-gradient(to bottom right, #232628, #141b23);">
      <b-row>
        <b-col lg="12">
          <AgeAndSex
              id="SexStructure"
              width="100%"
              name="2"
              height="370px"
              Title="用户性别结构分析"
              :data="SexOption"></AgeAndSex>
        </b-col>
      </b-row>
      </Widget>
  </b-row>
    </b-col>

    <!--信息-->
    <b-col lg="5" style="padding: 0">

      <b-row style="width: 100%;margin-left: 30px">
        <Widget style="height: 100%;width: 100%;padding-left: 11px;margin-bottom: 0;padding-bottom: 10px;padding-top: 10px;background-image: linear-gradient(to bottom right, #232628, #141b23);">
          <b-row>
            <b-col lg = "5" style="padding: 0;margin-left: 5%">
              <b-form-select v-model="Line" :options="LineOption" style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f;width: 100%;height:40px;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>
            </b-col>
            <b-col lg = "5" style="padding: 0;margin-left: 2%">
              <b-form-select v-model="Station" :options="StationOption" style="background-color: #232628;box-shadow: 1px 1px 0 1px #1d1d1f;width: 100%;height:40px;color: rgba(255,255,255,100)" @change="getData()"></b-form-select>
            </b-col>
          </b-row>
        </Widget>
      </b-row>

      <b-row style="width: 100%;margin-left: 30px;margin-top: 10px">
          <Widget style="width: 100%;background-image: linear-gradient(to bottom right, #232628, #141b23);">
            <b-table striped hover :items="AgeItems" :fields="AgeFields" style="text-align: center"></b-table>
          </Widget>
      </b-row>
      <b-row style="width: 100%;margin-left: 30px;margin-top: 10px">
        <Widget style="width: 100%;background-image: linear-gradient(to bottom right, #232628, #141b23);">
          <b-table striped hover :items="SexItems" :fields="SexFields" style="text-align: center"></b-table>
        </Widget>
      </b-row>
    </b-col>
  </b-row>

  <div style="width: 99%;margin-top: 10px">
    <Widget style="height: 100%;width: 100%;padding-left: 11px;margin-bottom: 0;padding-bottom: 10px;padding-top: 10px;background-image: linear-gradient(to bottom right, #232628, #141b23);">
      <span class="s-title">用户归属地分析</span>
    </Widget>
  </div>

  <!--归属地图-->
  <div style="height: 400px;width:95%;margin-top: 10px">
      <Widget style="width: 100%;height: 100%; padding: 0;background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <UserHome
            width="100%"
            height="380px"
            id="china"
            :data="MapData"></UserHome>
      </Widget>
  </div>

  <b-row style="margin-top: 10px">
    <b-col lg = '5' style="padding: 0;margin-left: 5%">
      <Widget style=" padding:0;background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <b-table striped hover :items="UserItems1" :fields="UserFields" style="text-align: center"></b-table>
      </Widget>
    </b-col>
    <b-col lg = '5' style="padding: 0;margin-left: 10px">
      <Widget style="background-image: linear-gradient(to bottom right, #232628, #141b23);">
        <b-table striped hover :items="UserItems2" :fields="UserFields" style="text-align: center"></b-table>
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

<style scoped src="./MUserInfo.scss" lang="scss">

</style>
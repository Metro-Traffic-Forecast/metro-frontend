<template>
<div>
  <b-row>
    <b-col lg="6">
      <Widget style="width: 100%;height: 640px">
        <div v-if="Mode===1">
        <StationForecastInAndOut
          height="540px"
          width="100%"
          id="StationForecastInAndOut"
          style="top: 80px;position: absolute;"
          :rel-up-data="UpData"
          :rel-down-data="DownData"
          :for-down-data="ForDownData"
          :for-up-data="ForUpData"
          :base-time="BaseTime"

        ></StationForecastInAndOut>
        </div>
        <div v-if="Mode===0">
        <StationForecastInAndOut
            height="540px"
            width="100%"
            id="StationForecastInAndOut2"
            style="top: 80px;position: absolute;"
            :rel-up-data="UpData"
            :for-up-data="ForUpData"
            :base-time="BaseTime"
        ></StationForecastInAndOut>
        </div>
        <b-row>
          <b-col lg="3">
            <b-form-select v-model="Line" :options="LineOption" style="width: 100%;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="getStationOption()"></b-form-select>
          </b-col>
          <b-col lg ="3">
            <b-form-select v-model="Station" :options="StationOption" style="width: 100%;height:40px;opacity: 0.5;color: rgba(255,255,255,100)" @change="compute()"></b-form-select>
          </b-col>
          <b-col lg ="6">
            <b-form-datepicker :min="new Date(2019, 11, 25)" :max="new Date(2020, 6,26)" selected-variant="info" id="example-datepicker2"  style="opacity: 0.5" v-model="SelectDate" class="mb-lg-n3"></b-form-datepicker>
          </b-col>
        </b-row>
        <b-row style="top: 60px;width:100%;position: absolute">
          <b-col lg ="3">
            <b-form-select v-model="Mode" @change="ReFor()" :options="ModeOption" style="width: 100%;height:40px;opacity: 0.5;color: rgba(255,255,255,100)"></b-form-select>
          </b-col>
        </b-row>
      </Widget>
      <Widget title="信息说明">
        <small v-if="StationOption[Station - 1]!=null">{{StationOption[Station - 1].text}} 未来3日客流预测</small><br>
        <small style="color: rgba(255,126,3,0.86)" v-if="Mode==0 && ModeOption != null">{{ModeOption[Mode].text}} 模型仅预测上行客流量</small>
        <b-table striped hover :items="StationForecastTableItems" :fields="StationForecastFields"></b-table>
      </Widget>
    </b-col>
    <b-col lg="6">
      <b-row v-if="WarningList!==null">
        <b-col lg="12">
          <Widget>
            <p style="font-size: 40px;font-weight:bold;color: rgba(201,100,0,0.86)">Warning：</p>
            <p :key="item.number" v-for="item in WarningList" style="font-size: 16px;font-weight:400;color: rgba(201,100,0,0.86)"><span style="margin-right: 20px">客流方向:{{item.mode}}</span>  <span style="margin-right: 20px">发生时间:{{item.time}}</span> <span>客流人数:{{item.number}}</span></p>
          </Widget>
        </b-col>
      </b-row>
      <Widget title="模型参数">
        <b-container fluid>
          <div v-if="Mode === 1">
            <br/>
            <b-row class="my-1" v-for="(Param,index) in Params" :key="index">
              <b-col sm="9">
                <label>{{Param}}:<span style="display: inline-block;margin-left: 10px" v-if="ParamList[index]!=null">{{ParamList[index]}}</span></label>
              </b-col>
              <b-col sm="3">
                <b-form-input :value="ParamsHold[index]" @input="X()" :id="Param" v-if="index!==7" :placeholder="ParamsHold[index]" type="number"></b-form-input>
                <b-form-input :value="ParamsHold[index]" :id="Param" v-if="index===7" :placeholder="ParamsHold[index]" type="number" :disabled=true style="background-color: #00000030"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="4">
                <b-button style="background-color: #000000;opacity: 0.5;border-color: #000000" >Submit</b-button>
             </b-col>
            </b-row>
          </div>

          <div v-if="Mode === 0">
            <b-row style="color: rgba(131,246,0,0.5); font-weight: 500">
              [Data] <br/>
              adj_filename = data/metro/adj-matrix.csv<br/>
              distance_filename = data/metro/dis-matrix.csv<br/>
              graph_signal_matrix_filename = data/metro/trips-6-all.npz<br/>
              id_filename = data/PEMS03/PEMS03.txt<br/>
              num_of_vertices = 164<br/>
              points_per_hour = 12<br/>
              num_for_predict = 12<br/>
              len_input = 12<br/>
              dataset_name = metro-06<br/><br/>
            </b-row>
            <b-row class="my-1" v-for="(Param,index) in Params2" :key="index">
              <b-col sm="5">
                <label>{{Param}}:</label>
              </b-col>
              <b-col sm="7">
                <b-form-input :value="ParamsHold2[index]" :id="Param" v-if="index !== 2" :placeholder="ParamsHold2[index]" type="number" ></b-form-input>
                <b-form-input :value="ParamsHold2[index]" v-if="index === 2" :placeholder="ParamsHold2[index]" type="text" :disabled=true style="background-color: #00000030"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="4">
                <b-button style="background-color: #000000;opacity: 0.5;border-color: #000000" >Submit</b-button>
              </b-col>
            </b-row>
          </div>
        </b-container>
      </Widget>
    </b-col>
  </b-row>

</div>
</template>

<script>
import StationForecastInAndOut from "../../components/Charts/StationForcastInAndOut/StationForecastInAndOut";
import axios from "axios";
import Widget from "@/components/Widget/Widget";
import config from "@/config";
export default {
  name: "StationForecast",
  components:{
    Widget,
   StationForecastInAndOut
  },
  data(){
    return{
      WarningList:null,
      ParamList:[
          'number of epoch at training stage',
          'batch size',
          'number of time intervals in one day',
          'length of closeness dependent sequence',
          'length of  peroid dependent sequence',
          'length of trend dependent sequence',
          null,
          null,
          'grid size',
          'grid size',
          null,
          'learning rate',
          null
      ],
      Params:[
          'nb_epoch',
          'batch_size',
          'T',
          'len_closeness',
          'len_period',
          'len_trend',
          'days_test',
          'len_test',
          'map_height',
          'map_width',
          'nb_flow',
          'lr',
          'nb_residual_unit',
      ],
      ParamsHold:[
        '500','32','4','3','1','1','28','112','31','20','2', '0.0002','4'
      ],
      Params2:[
        'use_nni',
        'batch_size',
        'model_name',
        'num_of_weeks',
        'num_of_days ',
        'num_of_hours',
        'start_epoch',
        'epochs',
        'fine_tune_epochs',
        'learning_rate',
        'direction',
        'encoder_input_size',
        'decoder_input_size',
          'dropout',
          'kernel_size',
          'num_layers ',
          'd_model',
          'nb_head',
          'ScaledSAt',
          'SE',
          'smooth_layer_num',
          'aware_temporal_context',
          'TE',
      ],
      ParamsHold2:[
        '1','12', 'AST-GNN','0','0','1','0','300','50','0.001','2','2','1','0','0','3','3','64','16','1','1','1','1','1'
      ],
      BaseTime:0,
      Mode : 0,
      ModeOption:[{
        value:0,
        text: 'AST-GNN',
      },
        {
          value:1,
          text: 'ST-ResNet',
        }],
      SelectDate: '2020-06-19',
      Tag:[0,0,0,0],
      StationForecastFields:[
        {
          key: '预测时间段',
          sortable: false
        },
        {
          key: '上行预测客流量',
          sortable: false
        },
        {
          key: '下行预测客流量',
          sortable: false
        }
      ],
      UpData:{

      },
      ForUpData:{

      },
      DownData:{

      },
      ForDownData:{

      },
      Line:1,
      Station:1,
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
      StationOption:null,
      AllRealUpData:null,
      AllRealDownData:null,
      AllForecastUpData:null,
      AllForecastDownData:null,
    }
  },
  mounted() {
    this.getStationOption();
    this.getAllRealDownData();
    this.getAllRealUpData();
    this.getAllForecastData();
  },
  watch:{
    SelectDate:{
      handler(){
        this.ReCompute();
      }
    },
  },
  computed:{

    StationForecastTableItems(){
      if(this.ForUpData==null){
        return null;
      }
      let data = [];
      let now = null;
      let d = this.SelectDate.split('-');
      let date = new Date(parseInt(d[0]), parseInt(d[1]) -1 , parseInt(d[2]));
      for(let i = 0; i<12;i++){
        data[i] ={};
        now = date;
        date = new Date(+new Date(parseInt(d[0]), parseInt(d[1]) -1 , parseInt(d[2])) + (i+1) * 6*1000*3600);
        let result = "";
        result += now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+"~";
        result += date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        data[i].预测时间段 = result;
        data[i].上行预测客流量 = this.ForUpData[28+i];
        if(this.ForDownData != null) {
          data[i].下行预测客流量 = -1 * this.ForDownData[28 + i];
        }else{
          data[i].下行预测客流量 = 'none';
        }
      }
      return data;
    }
  },
  methods:{

    X(){
      document.getElementById('len_test').value = document.getElementById('days_test').value * document.getElementById('T').value;
    },
    ReCompute(){
      this.Tag = [1,0,0,0];
      this.getAllRealDownData();
      this.getAllRealUpData();
      this.getAllForecastData();
    },
    ReFor(){
      this.Tag = [1,1,1,0];
      this.getAllForecastData();
    },
    compute(){
      //回溯时间
      let date = this.SelectDate.split('-');
      let dateBack  = +new Date(+new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2])) - 7*24*3600*1000)
      this.BaseTime = dateBack;

      let warning = [];

      let stationId = this.StationOption[this.Station - 1].stationId;
      this.ForUpData = [];
      this.ForDownData = [];
      for(let k=0;k<28;k++){
        this.ForUpData.push(0);
        this.ForDownData.push(0);
      }
      for(let i=0;i<164;i++){
        if(this.AllRealUpData[i].station == stationId){
          this.UpData = this.AllRealUpData[i].data;
          this.UpData.push(0);
          break;
        }
      }
      for(let i=0;i<164;i++){
        if(this.AllRealDownData[i].station == stationId){
          this.DownData = this.AllRealDownData[i].data;
          this.DownData.push(0);
          break;
        }
      }
      for(let i=0;i<164;i++){
        if(this.AllForecastUpData[i].station == stationId){
          for(let k=0;k<12;k++) {
            this.ForUpData.push(this.AllForecastUpData[i].data[k]);
            if(k%4===0){
              this.ForUpData[28+k] = 0;
            }
            if(this.ForUpData[28+k]>25){
              let d = {};
              d.mode = '上行';
              let now = new Date(this.BaseTime+ 7*24*3600*1000 + k*6*3600*1000);
              d.time = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-') + " " + now.getHours() +"H";
              d.number = this.ForUpData[28+k];
              warning.push(d);
            }
          }
          break;
        }
      }
      if(this.Mode === 0){
        if(warning.length!==0) {
          this.WarningList = warning;
        }else{
          this.WarningList = null;
        }
        this.ForDownData = null;
        return ;
      }
      for(let i=0;i<164;i++){
        if(this.AllForecastDownData[i].station == stationId){
          for(let k=0;k<12;k++) {
            this.ForDownData.push(this.AllForecastDownData[i].data[k]);
            if(k%4===0){
              this.ForDownData[28+k] = 0;
            }
            if(this.ForDownData[28+k] < -25){
              let d = {};
              d.mode = '下行';
              let now = new Date(this.BaseTime + 7*24*3600*1000 +k*6*3600*1000);
              d.time = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-') + " " + now.getHours()+"H";
              d.number = -1*this.ForDownData[28+k];
              warning.push(d);
            }
          }
          break;
        }
      }
      if(warning.length!==0) {
        this.WarningList = warning;
      }else{
        this.WarningList = null;
      }
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
        _this.Tag[0] =1;
        if(_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1){
          _this.compute();
        }
      })
    },
    getAllRealUpData:function (){
      let _this = this;
      let date = this.SelectDate.split('-');
      let dateBack  = new Date(+new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2])) - 7*24*3600*1000);
      let start  = dateBack.getFullYear() + '-';
      if(dateBack.getMonth()+1<10){
        start  += '0'+ (dateBack.getMonth()+1) + '-';
      }else {
        start  += (dateBack.getMonth()+1) + '-';
      }
      if(dateBack.getDate()<10){
        start  += '0'+ dateBack.getDate();
      }else {
        start  += dateBack.getDate();
      }
      axios.get(config.DNS+'station/inflow',{params:{start: start + ' 00:00:00',end: _this.SelectDate + ' 00:00:00',step: 6}})
          .then(function (response){
            let data = response.data.data;
            let result = [];
            for(let i=0;i<164;i++){
              result[i] = {};
              result[i].station = "";
              result[i].data = [];
            }
            for(let i=0;i<data.length;i++){
              for(let j =0;j<164;j++){
                if(data[i][j] != null) {
                  result[j].station = data[i][j].stationId;
                  result[j].data.push(parseInt(data[i][j].flow));
                }else{
                  result[j].data.push(0);
                }
              }
            }
            _this.AllRealUpData = result;
            console.log(result);
            _this.Tag[1] =1;
            if(_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1 && _this.Tag[3] === 1){
              _this.compute();
            }
          })
    },
    getAllRealDownData:function (){
      let _this = this;
      let date = this.SelectDate.split('-');
      let dateBack  = new Date(+new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2])) - 7*24*3600*1000);
      let start  = dateBack.getFullYear() + '-';
      if(dateBack.getMonth()+1<10){
        start  += '0'+ (dateBack.getMonth()+1) + '-';
      }else {
        start  += (dateBack.getMonth()+1) + '-';
      }
      if(dateBack.getDate()<10){
        start  += '0'+ dateBack.getDate();
      }else {
        start  += dateBack.getDate();
      }
      axios.get(config.DNS+'station/outflow',{params:{start:start + ' 00:00:00',end:_this.SelectDate + ' 00:00:00',step: 6}})
          .then(function (response){
            let data = response.data.data;
            let result = [];
            for(let i=0;i<169;i++){
              result[i] = {};
              result[i].station = "";
              result[i].data = [];
            }
            for(let i=0;i<data.length;i++){
              for(let j =0;j<169;j++){
                if(data[i][j] != null) {
                  result[j].station = data[i][j].stationId;
                  result[j].data.push(-1*parseInt(data[i][j].flow));
                }else{
                  result[j].data.push(0);
                }
              }
            }
            _this.AllRealDownData = result;
            _this.Tag[2] =1;
            if(_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1 && _this.Tag[3] === 1){
              _this.compute();
            }
          })
    },
    getAllForecastData(){
      let date = this.SelectDate.split('-');

      let resultIn = [];
      let resultOut = [];
      let url = "";
      if(this.Mode === 0){
        url = config.DNS + 'ASTGNN/prediction/flow';
      }else{
        url = config.DNS + 'STResNet/prediction/flow';
      }
      for(let k=0;k<164;k++){
          resultIn[k] = {};
          resultOut[k] = {};
          resultIn[k].station = 'Sta'+(k+1);
          resultOut[k].station = 'Sta'+(k+1);
          resultIn[k].data = [0,0,0,0,0,0,0,0,0,0,0,0];
          resultOut[k].data = [0,0,0,0,0,0,0,0,0,0,0,0];
        }
      let _this = this;

      if(this.Mode === 1) {
        for (let i = 0; i < 12; i++) {
          let dateS = new Date(+new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])) + i * 6 * 3600 * 1000);
          let start = dateS.getFullYear() + '-';
          if (dateS.getMonth() + 1 < 10) {
            start += '0' + (dateS.getMonth() + 1) + '-';
          } else {
            start += (dateS.getMonth() + 1) + '-';
          }
          if (dateS.getDate() < 10) {
            start += '0' + dateS.getDate() + " ";
          } else {
            start += dateS.getDate() + " ";
          }
          if (dateS.getHours() < 10) {
            start += '0' + dateS.getHours() + ":";
          } else {
            start += dateS.getHours() + ":";
          }
          axios.get(url, {params: {start: start + '00:00'}})
              .then(function (response) {
                let data = JSON.parse(response.data.data).data;
                for (let k = 0; k < 164; k++) {
                  resultIn[k].data[i] = data[0][resultIn[k].station];
                  resultOut[k].data[i] = -1 * data[1][resultOut[k].station];
                }
                if (i === 11) {
                  _this.AllForecastDownData = resultOut;
                  _this.AllForecastUpData = resultIn;
                  _this.Tag[3] = 1;
                  if (_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1 && _this.Tag[3] === 1) {
                    _this.compute();
                  }
                }
              })
        }
      }else{
        let dateS = new Date(+new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])));
        let start = dateS.getFullYear() + '-';
        if (dateS.getMonth() + 1 < 10) {
          start += '0' + (dateS.getMonth() + 1) + '-';
        } else {
          start += (dateS.getMonth() + 1) + '-';
        }
        if (dateS.getDate() < 10) {
          start += '0' + dateS.getDate() + " ";
        } else {
          start += dateS.getDate() + " ";
        }
        axios.get(url, {params: {start: start + '00:00:00'}})
            .then(function (response) {
              let data = JSON.parse(response.data.data).data;
              for(let i=0;i<9;i++) {
                for (let k = 0; k < 164; k++) {
                  resultIn[k].data[Math.floor(i/3) * 4 + i % 3 + 1] = data[i][resultIn[k].station];
                  resultOut[k].data[i] = 0;
                }
                if (i === 8) {
                  _this.AllForecastDownData = resultOut;
                  _this.AllForecastUpData = resultIn;
                  _this.Tag[3] = 1;
                  if (_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1 && _this.Tag[3] === 1) {
                    _this.compute();
                  }
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
<template>
<div>
  <b-row>
    <b-col lg ='12'>
      <Widget style="width: 100%;height: 730px">
        <LineForecast
            width="95%"
            height="700px"
            id="LineForecast"
            style="position: absolute"
            :baseTime="BaseTime"
            :data="LineForecastData"
            :split-index="SplitIndex"></LineForecast>

        <b-row>
          <b-col lg ="6">
            <b-form-datepicker :min="new Date(2019, 11, 25)" :max="new Date(2020, 6,26)" selected-variant="info" id="example-datepicker2"  style="opacity: 0.5" v-model="SelectDate" class="mb-lg-n3"></b-form-datepicker>
          </b-col>
          <b-col lg ="3">
            <b-form-select v-model="Mode" @change="ReFor()" :options="ModeOption" style="width: 100%;height:40px;opacity: 0.5;color: rgba(255,255,255,100)"></b-form-select>
          </b-col>
        </b-row>
      </Widget>
    </b-col>
  </b-row>
  <b-row>
    <b-col lg ='6'>
      <Widget title="信息说明" style="width: 100%;height: auto">
        <small>{{SelectDate}}起未来三天全线路客流量预测</small>
        <b-table striped hover :items="LineForecastTableItems" :fields="LineForecastFields"></b-table>
      </Widget>
    </b-col>
    <b-col lg="6">
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
import LineForecast from "@/components/Charts/LineForecast/LineForecast";
import Widget from "@/components/Widget/Widget";
import axios from "axios";
import config from "@/config";
export default {
  name: "LineForecastPage",
  components:{
    Widget,
    LineForecast
  },
  data(){
    return{
      Tag:[0,0],
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
      BaseTime:0,
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
      SplitIndex:28,
      Data3D:null,
      AllForecastUpData:null,
      AllForecastDownData:null,
      LineForecastData:null,
      StationList:null,
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
      LineForecastFields:[
        {
          key: '预测时间段',
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
          sortable: false
        },
        {
          key: '4号线',
          sortable: false
        },
        {
          key: '5号线',
          sortable: false
        },
        {
          key: '10号线',
          sortable: false
        },
        {
          key: '11号线',
          sortable: false
        },
        {
          key: '12号线',
          sortable: false
        }
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
    }
  },
  computed:{
    LineForecastTableItems(){
      if(this.LineForecastData==null){
        return null;
      }
      let result =[];
      let now = null;
      let d = this.SelectDate.split('-');
      let date = new Date(parseInt(d[0]), parseInt(d[1]) -1 , parseInt(d[2]));
      for(let i = 0; i<12;i++){
        result[i] ={};
        now = date;
        date = new Date(+new Date(parseInt(d[0]), parseInt(d[1]) -1 , parseInt(d[2])) + (i+1) * 6*1000*3600);
        let resulted = "";
        resulted += now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+"~";
        resulted += date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        result[i].预测时间段 = resulted;
      }

      for(let i=0;i<12;i++){
          result[i]['1号线'] = this.LineForecastData[0][i+28];
          result[i]['2号线'] = this.LineForecastData[1][i+28];
          result[i]['3号线'] = this.LineForecastData[2][i+28];
          result[i]['4号线'] = this.LineForecastData[3][i+28];
          result[i]['5号线'] = this.LineForecastData[4][i+28];
          result[i]['10号线'] = this.LineForecastData[5][i+28];
          result[i]['11号线'] = this.LineForecastData[6][i+28];
          result[i]['12号线'] = this.LineForecastData[7][i+28];
        if(isNaN(result[i]['1号线'])){
          result[i]['1号线'] = 'none';
        }
        if(isNaN(result[i]['2号线'])){
          result[i]['2号线'] = 'none';
        }
        if(isNaN(result[i]['3号线'])){
          result[i]['3号线'] = 'none';
        }
        if(isNaN(result[i]['4号线'])){
          result[i]['4号线'] = 'none';
        }
        if(isNaN(result[i]['5号线'])){
          result[i]['5号线'] = 'none';
        }
        if(isNaN(result[i]['10号线'])){
          result[i]['10号线'] = 'none';
        }
        if(isNaN(result[i]['11号线'])){
          result[i]['11号线'] = 'none';
        }
        if(isNaN(result[i]['12号线'])){
          result[i]['12号线'] = 'none';
        }
      }

      return result;
    }
  },
  watch:{
    SelectDate:{
      handler(){
        this.Tag = [1,0,0];
        this.getData();
        this.getAllForecastData();
      }
    },

  },
  mounted() {
    this.getData();
    this.getAllForecastData();
    this.getStationList();
  },
  methods:{
    ReFor(){
      this.Tag = [1,0,0];
      this.getData();
      this.getAllForecastData();
    },
    compute(){
      //回溯时间
      let date = this.SelectDate.split('-');
      let dateBack  = +new Date(+new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2])) - 7*24*3600*1000)
      this.BaseTime = dateBack;

      //计算data
      let data = this.Data3D;
      for(let i=0;i<8;i++){
        for(let k=0;k<12;k++){
          data[i].push(0);
        }
      }

      for(let i=0;i<this.AllForecastDownData.length;i++){
        let station = this.AllForecastDownData[i].station;
        let index = 0;
        for(let k=0;k<8;k++){
          if(this.StationList[k].indexOf(station) != -1){
            index = k;
            break;
          }
        }
        for(let k=28;k<40;k++){
          if(this.AllForecastDownData[i].data[k-28] !== undefined) {
            data[index][k] -= this.AllForecastDownData[i].data[k - 28];
          }
        }
      }

      for(let i=0;i<this.AllForecastUpData.length;i++){
        let station = this.AllForecastUpData[i].station;
        let index = 0;
        for(let k=0;k<8;k++){
          if(this.StationList[k].indexOf(station) != -1){
            index = k;
            break;
          }
        }
        for(let k=28;k<40;k++){
          if(this.AllForecastUpData[i].data[k-28]!==undefined) {
            data[index][k] += this.AllForecastUpData[i].data[k - 28];
          }
        }
      }
      if(this.Mode === 0) {
        for (let i = 0; i < 8; i++) {
          for (let k = 28; k < 40; k++) {
            data[i][k] *= 2;
          }
        }
      }
      console.log(data);
      this.LineForecastData= data;
    },
    getStationList(){
      let lines = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'];
      let _this = this;
      let result = [];
      for(let i=0;i<8;i++) {
        result[i] = [];
      }

        axios.get(config.DNS + 'station').then(function (response) {
          let data = response.data.data;
          for (let i = 0; i < data.length; i++) {
            let index = 0;
            for (let k = 0; k < 8; k++) {
              if (data[i].lineName == lines[k]) {
                index = k;
                break;
              }
            }
            result[index].push(data[i].stationId);
          }
          _this.StationList = result;
          _this.Tag[0] = 1;
          if (_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1) {
            _this.compute();
          }
        })

    },
    X(){
      document.getElementById('len_test').value = document.getElementById('days_test').value * document.getElementById('T').value;
    },
    getData() {
      let data2 = null;
      data2 = [];
      for(let i=0;i<8;i++){
        data2[i] = [];
        for(let k=0;k<28;k++){
          data2[i][k] = 0;
        }
      }
      let _this = this;
      let lines = ['1号线', '2号线', '3号线', '4号线', '5号线', '10号线', '11号线', '12号线'];
      let time = this.SelectDate.split('-');
      let timeBack = +new Date(parseInt(time[0]), parseInt(time[1]) - 1, parseInt(time[2]))
      for(let i=0;i<28;i++){
        let s = new Date(timeBack - 7*24*3600*1000 + i*6*3600*1000);
        let e = new Date(timeBack - 7*24*3600*1000 + (i+1)*6*3600*1000);
        let start = s.getFullYear() + '-';
        if(s.getMonth()+1<10){
          start  += '0'+ (s.getMonth()+1) + '-';
        }else {
          start  += (s.getMonth()+1) + '-';
        }
        if(s.getDate()<10){
          start  += '0'+ s.getDate()+" ";
        }else {
          start  += s.getDate()+" ";
        }
        if(s.getHours()<10){
          start  += '0'+s.getHours()+":";
        }else{
          start  += s.getHours()+":";
        }

        let end = e.getFullYear() + '-';
        if(e.getMonth()+1<10){
          end  += '0'+ (e.getMonth()+1) + '-';
        }else {
          end  += (e.getMonth()+1) + '-';
        }
        if(e.getDate()<10){
          end  += '0'+ e.getDate()+" ";
        }else {
          end  += e.getDate()+" ";
        }
        if(e.getHours()<10){
          end  += '0'+e.getHours()+":";
        }else{
          end  += e.getHours()+":";
        }
        axios.get(config.DNS+'line/flow', {params: {start: start+"00:00", end: end +"00:00"}})
            .then(function (response){
              let d = response.data.data;
              for(let k = 0;k<8;k++){
                let p = 0;
                for(let j=0;j<8;j++){
                  if(d[k].lineName == lines[j]){
                    p = j;
                    break;
                  }
                }
                data2[p][i]=parseInt(d[k].inflow)+parseInt(d[k].outflow);
              }
              if(i===27){
                _this.Data3D = data2;
                _this.Tag[2] = 1;
                if (_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1) {
                  _this.compute();
                }
              }
            })
      }
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
                  _this.Tag[1] = 1;
                  if (_this.Tag[0] === 1 && _this.Tag[1] === 1) {
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
                  _this.Tag[1] = 1;
                  if (_this.Tag[0] === 1 && _this.Tag[1] === 1 && _this.Tag[2] === 1) {
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
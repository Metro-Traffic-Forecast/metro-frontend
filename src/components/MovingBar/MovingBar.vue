<template>
  <div class="container">
    <widget style="width: 800px;height: 600px;padding-top: 10px; " :title="title">
      <br/>
    <b-row style="width: 800px">
      <b-col offset-lg="1" lg="10">
        <div class="block" style="opacity: 0.7">
          <span class="demonstration">{{BarMessage}}</span>
          <el-slider v-model="value" @change="draw()" :min=1 :max="maxNumber" id="slider" :show-tooltip="false"></el-slider>
        </div>
      </b-col>
    </b-row>
    <b-row style="height: 150px">
      <b-col offset-lg="1" lg="10">
        <UniaxialDispersion
              :data="uniaxialData"
              :id="MovingBarUniaxialDispersion"
              :x-axis="xAxis"
              @getChildData="getUniaxialData"></UniaxialDispersion>
      </b-col>
    </b-row>
      <b-row>
        <b-col offset-lg="1" lg="10">
          <PassengerTimeFlow
              :x-axis="xAxis"
              :show-data= 'showData'
              :scale="1"
              :id="MovingBarPassengerTimeFlow"
              @getChildData="getLinerData"></PassengerTimeFlow>
        </b-col>
      </b-row>
    </widget>
  </div>
</template>

<script>
import UniaxialDispersion from "@/components/Charts/UniaxialDispersion/UniaxialDispersion";
import Widget from "@/components/Widget/Widget";
import PassengerTimeFlow from "@/components/Charts/PassengerTimeFlow/PassengerTimeFlow";
export default {
  name: "MovingBar",
  props:['maxNumber', 'allData', 'allUniaxialData', 'id', 'title', 'xAxis', 'PassengerFlowXAxis'],
  components: {
    PassengerTimeFlow,
    Widget,
    UniaxialDispersion
  },
  mounted() {
    this.sendData();
  },
  data() {
    return {
      value: 1,
      AllFlowNumber: 0,
      FirstFlowNumber:0,
      SecondFlowNumber:0,
      getIn:0,
      getOut:0
    }
  },
  watch:{
    AllFlowNumber:{
      handler(){
        this.sendData();
      }
    },
    FirstFlowNumber:{
      handler(){
        this.sendData();
      }
    },
    SecondFlowNumber:{
      handler(){
        this.sendData();
      }
    }
  },
  computed:{
    MovingBarPassengerTimeFlow:function (){
      return this.id + 'MovingBarPassengerTimeFlow';
    },
    MovingBarUniaxialDispersion:function (){
      return this.id + 'MovingBarUniaxialDispersion';
    },
    showData: function (){
      return this.allData[this.value-1];
    },
    uniaxialData:function (){
      return this.allUniaxialData[this.value-1];
    },
    BarMessage:function (){
      if(this.title === '日信息统计'){
        return '当前日期：' + this.value + "号";
      }else if(this.title === '站点信息统计'){
        return '当前站点：' + this.PassengerFlowXAxis[this.value-1];
      }else {
        return null;
      }
    }
  },
  methods: {
    sendData(){
      this.$emit("getChildData", this.AllFlowNumber, this.FirstFlowNumber, this.SecondFlowNumber, this.getIn, this.getOut);
    },
    formatTooltip(val) {
      return val / 100;
    },
    getUniaxialData(getIn, getOut, allNumber){
      this.getIn = getIn;
      this.getOut = getOut;
      this.AllFlowNumber = allNumber;
    },
    getLinerData(first, second){
      this.FirstFlowNumber = first;
      this.SecondFlowNumber = second;
    }
  }
}
</script>

<style scoped>

</style>
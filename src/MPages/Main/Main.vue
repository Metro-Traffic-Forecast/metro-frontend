<template>
<div>

  <!-- 第一行 -->
  <b-row class="row-limit">
    <b-col lg="10" offset="1">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="线路拓扑热力图">
        <MVisits></MVisits>
      </Widget>
    </b-col>
  </b-row>

  <!-- 第二行 -->
<b-row class="row-limit">

  <!-- 第一列 -->
  <b-col lg="5" offset="1">
    <!-- 1.1 -->
    <b-row>
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="客流分析——单月整体客流">
        <MMonthData></MMonthData>
      </Widget>
    </b-row>

    <!-- 1.2 -->
    <b-row style="margin-top: 10px">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="客流分析——站点吞吐客流">
        <MInAndOutPassengerFlow></MInAndOutPassengerFlow>
      </Widget>
    </b-row>

    <!-- 1.3 -->
    <b-row style="margin-top: 10px">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="客流分析——线路断面客流">
        <MSectionAnalyse></MSectionAnalyse>
      </Widget>
    </b-row>

    <!-- 1.4 -->
    <b-row style="margin-top: 10px">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="用户分析——营收分析">
        <MTurnoverAnalyse></MTurnoverAnalyse>
      </Widget>
    </b-row>
  </b-col>

  <!-- 第二列 -->
  <b-col lg="5" style="margin-left: 10px">
    <!-- 2.1 -->
    <b-row>
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="客流分析——工作日/周末客流">
        <MWeekData></MWeekData>
      </Widget>
    </b-row>

    <!-- 2.2 -->
    <b-row style="margin-top: 10px">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="客流分析——早晚高峰客流">
        <MPeakAnalyse></MPeakAnalyse>
      </Widget>
    </b-row>

    <!-- 2.3 -->
    <b-row style="margin-top: 10px">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="客流分析——站点换乘客流">
        <MOD></MOD>
      </Widget>
    </b-row>

    <!-- 2.4 -->
    <b-row style="margin-top: 10px">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="用户分析——用户信息分析">
        <MUserInfo></MUserInfo>
      </Widget>
    </b-row>

    <!-- 2.5 -->
    <b-row style="margin-top: 10px">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="用户分析——用户信息分析">
        <MStationForecast></MStationForecast>
      </Widget>
    </b-row>

    <!-- 2.6 -->
    <b-row style="margin-top: 10px">
      <Widget class="widget" :refresh="true" :close="true" :fullscreen="true" :collapse="true" title="用户分析——用户信息分析">
        <MLineForecastPage></MLineForecastPage>
      </Widget>
    </b-row>
  </b-col>
</b-row>

  <div style="height: 50px"></div>
</div>
</template>

<script>
import Widget from "../../components/Widget/Widget";
import MVisits from "../../MPages/MVisits/MVisits";
import MMonthData from "../MMonthData/MMonthData";
import MWeekData from "../MWeekData/MWeekData";
import MInAndOutPassengerFlow from "../MInAndOutPassengerFlow/MInAndOutPassengerFlow";
import MPeakAnalyse from "../MPeakAnalyse/MPeakAnalyse";
import MOD from "../MOD/MODTransport";
import MSectionAnalyse from "../MSectionAnalyse/MSectionAnalyse";
import MUserInfo from "../MUserInfo/MUserInfo";
import MTurnoverAnalyse from "../MTurnoverAnalyse/MTurnoverAnalyse";
import MStationForecast from "../MStationForecast/MStationForecast";
import MLineForecastPage from "../MLineForecastPage/MLineForecastPage"

export default {
  name: "Main",
  components: {
    Widget,MVisits,MMonthData,MWeekData,MInAndOutPassengerFlow,
    MPeakAnalyse,MOD,MSectionAnalyse,MUserInfo,MTurnoverAnalyse,
    MStationForecast,MLineForecastPage
  }
}
</script>

<style src="./Main.scss" lang="scss">

</style>
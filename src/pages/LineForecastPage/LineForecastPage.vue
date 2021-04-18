<template>
<div>
  <LineForecast
  width="800px"
  height="600px"
  id="LineForecast"
  :data-x="DataX"
  :data="LineForecastData"
  :split-index="SplitIndex"></LineForecast>
</div>
</template>

<script>
import LineForecast from "@/components/Charts/LineForecast/LineForecast";
export default {
  name: "LineForecastPage",
  components:{
    LineForecast
  },
  data(){
    return{
      DataX: null,
      LineForecastData:null,
      SplitIndex:null,
    }
  },
  mounted() {

  },
  methods:{

  }
}
</script>

<style scoped>

</style>
<template>
<div>
  <OD width="1000px" height="600px" id="ODTransportOD" :links="links"></OD>
</div>
</template>

<script>
import OD from '../../components/Charts/OD/OD';
import axios from "axios";

export default {
  name: "ODTransport",
  components:{
    OD
  },
  data(){
    return{
      links: null
    }
  },
  mounted() {
    this.getODLinks();
  },
  methods:{
    getODLinks:function (){
      let _this = this;
      axios.get('http://host.tanhuiri.cn:19527/metro/line/exchange', {
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
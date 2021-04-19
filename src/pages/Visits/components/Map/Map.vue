<template>
    <div>
        <div class="map" id="metroMap">

        </div>
        <div class="stats">
            <h5 class="mt-1">总客流</h5>
            <p class="h3 m-0">
                <span class="mr-xs fw-normal"><AnimatedNumber :value="sumNum" v-bind="animateNumberOptions"></AnimatedNumber></span>
                <i class="fa fa-map-marker"/>
            </p>
        </div>
    </div>

</template>

<script>
    import AnimatedNumber from "animated-number-vue";
    import * as echarts from 'echarts'
    import bmap from 'echarts/extension/bmap/bmap'
    import coordtransform from 'coordtransform'

    export default {
        name: 'Map',
        components: {AnimatedNumber},
        data() {
            return {
                animateNumberOptions: {
                    duration: 2000,
                    easing: 'easeInQuad',
                    formatValue(value) {
                        return value.toFixed();
                    }
                },
                sumNum: 0,
            }
        },
        methods: {
            wgs84tobd09(wgs84) {
                let gcj02 = coordtransform.wgs84togcj02(wgs84[0], wgs84[1])
                return coordtransform.gcj02tobd09(gcj02[0], gcj02[1])
            }
        },
        async mounted() {

            let data = require("./geo.json")
            let station = require("./station.json")
            let line = require("./line.json")
            let chartDom = document.getElementById('metroMap')
            let myChart = echarts.init(chartDom)
            let startTime = "2020-06-07 00:00:00"
            let endTime = "2020-06-08 00:00:00"
            let step = 24

            let inflow = await this.axios.get('/api/metro/station/inflow', {
                params: {
                    start: startTime,
                    end: endTime,
                    step: step
                }
            })

            let outflow = await this.axios.get('/api/metro/station/outflow', {
                params: {
                    start: startTime,
                    end: endTime,
                    step: step
                }
            })

            let stationMap = new Map()
            station.RECORDS.forEach((elem) => {
                stationMap.set(elem.station_name, elem.station_id)
            })

            let inflowMap = new Map()
            inflow.data.data[0].forEach(elem => {
                if (elem) {
                    inflowMap.set(elem.stationId, parseInt(elem.flow))
                }
            })

            let outflowMap = new Map()
            outflow.data.data[0].forEach(elem => {
                if (elem) {
                    outflowMap.set(elem.stationId, parseInt(elem.flow))
                }
            })

            let stationCoords = []
            let pointCoords = []
            data.features.forEach(elem => {
                if (stationMap.has(elem.properties.station)) {
                    let sta = stationMap.get(elem.properties.station)
                    let i = inflowMap.has(sta) ? inflowMap.get(sta) : 0
                    let o = outflowMap.has(sta) ? outflowMap.get(sta) : 0
                    stationCoords.push({
                        station: sta,
                        coords: elem.geometry.coordinates,
                        inflow: i,
                        outflow: o
                    })
                    if (!pointCoords.some(item => item[4] === sta)) {
                        this.sumNum += (i + o)
                        pointCoords.push([...this.wgs84tobd09(elem.geometry.coordinates), i, o, sta])
                    }
                }
            })

            let lines = ["line1", "line2", "line3", "line4", "line5", "line6", "line10", "环线"]
            let lineData = []
            line.features.forEach(elem => {
                if (lines.find(n => n === elem.properties.line)) {
                    let stations = []
                    elem.geometry.coordinates[0].forEach(coords => {
                        let station = stationCoords.find(n => {
                            return n.coords[0] === coords[0] && n.coords[1] === coords[1]
                        })
                        if (station) {
                            stations.push(station)
                        }
                    })

                    lineData.push({
                        line: elem.properties.line,
                        stations: stations
                    })
                }
            })

            let showData = []
            lineData.forEach(elem => {
                for (let i = 0; i < elem.stations.length - 1; i++) {
                    showData.push({
                        name: elem.stations[i].station + '-' + elem.stations[i + 1].station,
                        coords: [
                            this.wgs84tobd09(elem.stations[i].coords),
                            this.wgs84tobd09(elem.stations[i + 1].coords)
                        ],
                        prevInflow: elem.stations[i].inflow,
                        prevOutflow: elem.stations[i].outflow,
                        nextInflow: elem.stations[i + 1].inflow,
                        nextOutflow: elem.stations[i + 1].outflow,
                        value: elem.stations[i].inflow + elem.stations[i].outflow +
                            elem.stations[i + 1].inflow + elem.stations[i + 1].outflow
                    })
                }
            })

            let option
            myChart.setOption(option = {
                tooltip: {
                    trigger: 'item'
                },
                bmap: {
                    center: [106.50, 29.60],
                    zoom: 11,
                    roam: 'scale',
                    enableMapClick: false,
                    mapStyle: {
                        'styleJson': [
                            {
                                'featureType': 'water',
                                'elementType': 'all',
                                'stylers': {
                                    "color": "#212121",
                                    "hue": "#000000",
                                    "lightness": -40
                                }
                            },
                            {
                                'featureType': 'land',
                                'elementType': 'geometry',
                                'stylers': {
                                    "color": "#222222"
                                }
                            },
                            {
                                'featureType': 'highway',
                                'elementType': 'all',
                                'stylers': {
                                    "lightness": -42,
                                    "saturation": -91
                                }
                            },
                            {
                                'featureType': 'arterial',
                                'elementType': 'geometry',
                                'stylers': {
                                    "lightness": -77,
                                    "saturation": -94
                                }
                            },
                            {
                                'featureType': 'local',
                                'elementType': 'geometry',
                                'stylers': {
                                    "lightness": -75,
                                    "saturation": -91
                                }
                            },
                            {
                                'featureType': 'railway',
                                'elementType': 'geometry',
                                'stylers': {
                                    "lightness": -52
                                }
                            },
                            {
                                'featureType': 'subway',
                                'elementType': 'all',
                                'stylers': {
                                    'visibility': 'off'
                                }
                            },
                            {
                                'featureType': 'all',
                                'elementType': 'labels.text.fill',
                                'stylers': {
                                    "visibility": "off"
                                }
                            },
                            {
                                'featureType': 'all',
                                'elementType': 'labels.icon',
                                'stylers': {
                                    "visibility": "off"
                                }
                            },
                            {
                                'featureType': 'building',
                                'elementType': 'geometry',
                                'stylers': {
                                    "color": "#2b2b2b"
                                }
                            },
                            {
                                'featureType': 'green',
                                'elementType': 'geometry',
                                'stylers': {
                                    "color": "#1b1b1b"
                                }
                            },
                            {
                                'featureType': 'boundary',
                                'elementType': 'all',
                                'stylers': {
                                    'color': '#99CCFF'
                                }
                            },
                            {
                                'featureType': 'manmade',
                                'elementType': 'all',
                                'stylers': {
                                    "color": "#1b1b1b"
                                }
                            },
                            {
                                'featureType': 'label',
                                'elementType': 'all',
                                'stylers': {
                                    'visibility': 'off'
                                }
                            }
                        ]
                    }
                },
                visualMap: {
                    type: 'continuous',
                    min: 0,
                    max: 500,
                    text: ['High', 'Low'],
                    hoverLink: true,
                    realtime: false,
                    calculable: true,
                    itemHeight: 160,
                    seriesIndex: 0,
                    inRange: {
                        color: ['#9DCC42', '#FFFE03', '#F7941D', '#E9420E', '#FF0000']
                    },
                    left: 40,
                    textStyle: {
                        color: "gray"
                    }
                },
                series: [
                    {
                        type: 'lines',
                        coordinateSystem: 'bmap',
                        polyline: false,
                        data: showData,
                        lineStyle: {
                            opacity: 1,
                            width: 4
                        },
                        progressiveThreshold: 500,
                        progressive: 200
                    },
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        data: pointCoords,
                        encode: {
                            i: 2,
                            o: 3,
                            sta: 4
                        },
                        symbolSize: value => {
                            return 5 + Math.round((value[2] + value[3]) / 25)
                        },
                        showEffectOn: 'emphasis',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        tooltip: {
                            formatter: params => {
                                return '车站：' + params.data[4] + '</br>进站人数：' + params.data[2] + '</br>出战人数：' + params.data[3]
                            },

                        },
                        itemStyle: {
                            color: '#f4e925',
                            shadowBlur: 10,
                            shadowColor: '#333',
                            opacity: 0.5
                        },
                        zlevel: 1
                    }
                ]
            })

            myChart.on('finished', () => {
                let bmap = myChart.getModel().getComponent('bmap').getBMap()
                bmap.setMinZoom(11)
                bmap.setMaxZoom(15)
                bmap.addEventListener('zoomend', () => {
                    if (bmap.getZoom() === 11) {
                        bmap.panTo(new BMap.Point(106.50, 29.60))
                    }
                })
                myChart.off('finished')
            })

            myChart.setOption(option)
        },
    };
</script>

<style src="./Map.scss" lang="scss"/>

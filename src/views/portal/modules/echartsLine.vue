<template>
  <div class="echarts-line">
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    dataX: {
      type: Array,
      default: () => { return [] }
    },
    dataY: {
      type: Array,
      default: () => { return [] }
    },
    unitX: {
      type: [String, Number],
      default: ''
    },
    unitY: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var myChart = echarts.init(this.$refs.echarts)
      var option
      option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '10%',
        },
        xAxis: {
          type: 'category',
          data: this.dataX,
          name: this.unitX
        },
        yAxis: {
          type: 'value',
          name: this.unitY,
        },
        series: [
          {
            name: this.name,
            data: this.dataY,
            type: 'line',
            smooth: true
          }
        ]
      }
      option && myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.echarts-line {
  width: 100%;
  height: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>

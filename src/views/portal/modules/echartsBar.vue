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
    dataY1: {
      type: Array,
      default: () => { return [] }
    },
    dataY2: {
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
      type: Array,
      default: () => { return [] }
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
        data: this.name,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '10%'
        },
        xAxis: {
          type: 'category',
          data: this.dataX,
          name: this.unitX
        },
        yAxis: {
          type: 'value',
          name: this.unitY
        },
        grid: {
          left: '4%',
          right: '4%',
          containLabel: true
        },
        series: [
          {
            name: this.name[0],
            data: this.dataY1,
            type: 'bar',
            barWidth: '20px',
            smooth: true
          },
          {
            name: this.name[1],
            data: this.dataY2,
            type: 'bar',
            barWidth: '20px',
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

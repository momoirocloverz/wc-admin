<template>
  <div class="echarts-pie">
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    data: {
      type: Array,
      default: () => { return [] }
    },
    name: [Number, String],
    default: ''
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
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          left: '70%'
        },
        series: [
          {
            name: this.name,
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['35%', '50%'],
            label: {
              show: true,
              formatter: '{d}%'
            },
            avoidLabelOverlap: false,
            data: this.data
          }
        ]
      }
      option && myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.echarts-pie {
  width: 100%;
  height: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div class="page_index">
    <div class="title_bar">
      共富帮数据中心
    </div>
    <div class="content_box">
    <!--  数据概览  -->
      <data-base />
      <div class="content">
        <div class="info_box">
          <p class="info_box_title">文成共富帮数据</p>
          <div class="echarts_box">
            <div class="info">
              <div class="title_box">
                <p class="title">用户活跃度变化趋势</p>
                <el-date-picker
                  v-model="dataSelect"
                  type="daterange"
                  size="mini"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </div>
              <div class="echarts">
                <echarts-line
                  :data-x="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                  unit-x="月"
                  :data-y="[20, 30, 20, 100, 120, 20, 43, 20, 29, 31]"
                  unit-y="人"
                  name="用户活跃人数"
                />
              </div>
            </div>
            <div class="info">
              <div class="title_box">
                <p class="title">风险类型</p>
                <el-date-picker
                  v-model="dataSelect"
                  type="daterange"
                  size="mini"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </div>
              <div class="echarts">
                <echarts-pie
                  :data="pieData1"
                  name="风险类型"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="info_box">
          <p class="info_box_title">低收入农户收益情况</p>
          <div class="echarts_box">
            <div class="info">
              <div class="title_box">
                <p class="title">低收入农户人均可支配收入</p>
              </div>
              <div class="echarts">
                <echarts-line
                  :data-x="[2016, 2017, 2018, 2019, 2020, 2021]"
                  unit-x="年"
                  :data-y="[5000, 5500, 6000, 8000, 9000, 8000]"
                  unit-y="元"
                  name="低收入农户人均可支配收入"
                />
              </div>
            </div>
            <div class="info">
              <div class="title_box">
                <p class="title">低收入农户收入占比</p>
                <el-date-picker
                  v-model="dataSelect"
                  type="daterange"
                  size="mini"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </div>
              <div class="echarts">
                <echarts-pie
                  :data="pieData2"
                  name="低收入农户收入占比"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="info_box">
          <p class="info_box_title">随访情况</p>
          <div class="echarts_box">
            <div class="info">
              <div class="title_box">
                <p class="title">乡镇结对干部走访、结对率</p>
              </div>
              <div class="echarts">
                <echarts-bar
                  :data-x="['大峃镇', '珊溪镇', '玉壶镇', '南田镇', '黄坦镇', '西坑镇', '丈漈镇', '峃口镇', '巨屿镇', '周壤镇', '二源镇', '铃山镇', '周山乡', '周山乡', '双桂乡', '平和乡', '公阳乡', '桂山乡']"
                  :data-y1="[100, 90, 94, 94, 94, 98, 99, 100, 96, 96, 95, 92, 95, 92, 99, 93, 92, 100]"
                  :data-y2="[100, 90, 92, 92, 94, 98, 99, 93, 96, 97, 98, 94, 98, 99, 93, 96, 97, 98]"
                  unit-y="%"
                  :name="['走访率', '结对率']"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="info_box">
          <div class="echarts_box">
            <div class="info">
              <div class="title_box">
                <p class="title">乡镇签约医生走访、结对率</p>
              </div>
              <div class="echarts">
                <echarts-bar
                  :data-x="['大峃镇', '珊溪镇', '玉壶镇', '南田镇', '黄坦镇', '西坑镇', '丈漈镇', '峃口镇', '巨屿镇', '周壤镇', '二源镇', '铃山镇', '周山乡', '周山乡', '双桂乡', '平和乡', '公阳乡', '桂山乡']"
                  :data-y1="[40, 50, 94, 54, 84, 38, 92, 10, 92, 91, 96, 10, 92, 94, 54, 84, 38, 100]"
                  :data-y2="[20, 90, 62, 92, 92, 93, 29, 63, 94, 92, 93, 29, 63, 99, 94, 54, 84, 38]"
                  unit-y="%"
                  :name="['走访率', '结对率']"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="info_box">
          <div class="echarts_box">
            <div class="info">
              <div class="title_box">
                <p class="title">结对干部随访情况</p>
              </div>
              <div class="echarts">
                <echarts-line
                  :data-x="[1, 7, 14, 21, 28]"
                  unit-x="日"
                  :data-y="[29, 42, 25, 25, 26]"
                  unit-y="户数"
                  name="结对干部随访户数"
                />
              </div>
            </div>
            <div class="info">
              <div class="title_box">
                <p class="title">结对医生随访情况</p>
                <el-date-picker
                  v-model="dataSelect"
                  type="daterange"
                  size="mini"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </div>
              <div class="echarts">
                <echarts-line
                  :data-x="[1, 7, 14, 21, 28]"
                  unit-x="日"
                  :data-y="[32, 29, 10, 23, 21]"
                  unit-y="户数"
                  name="结对医生随访户数"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import dataBase from './modules/dataBase'
import echartsLine from './modules/echartsLine'
import echartsPie from './modules/echartsPie'
import echartsBar from './modules/echartsBar'

export default {
  components: {
    dataBase,
    echartsLine,
    echartsPie,
    echartsBar
  },
  data() {
    return {
      dataSelect: [],
      pieData1: [
        { name: '因病', value: 120 },
        { name: '因灾', value: 20 },
        { name: '因残', value: 20 },
        { name: '因学习', value: 20 },
        { name: '缺劳动', value: 20 },
        { name: '其他', value: 20 },
      ],
      pieData2: [
        { name: '民政局', value: 120 },
        { name: '残联', value: 20 },
        { name: '农业农村局', value: 12 },
        { name: '住建局', value: 59 },
        { name: '教育局', value: 5 },
        { name: '医疗保障局', value: 20 },
        { name: '人社局', value: 22 },
        { name: '其他', value: 32 },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .page_index {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .title_bar {
      height: 50px;
      line-height: 50px;
      text-indent: 20px;
      background: #fff;
      font-size: 18px;
      box-shadow: 0 10px 10px rgba(100, 100, 100, .4);
    }
    .content_box {
      flex: 1;
      overflow: scroll;
      box-sizing: border-box;
      padding: 16px 16px 0;
      .content {
        background: #fff;
        margin-top: 16px;
      }
    }
    .info_box {
      padding: 12px;
      border-bottom: 2px solid #f1f1f1;
      .info_box_title {
        height: 12px;
        line-height: 12px;
        text-indent: 10px;
        color: #20a0ff;
        border-left: 3px solid #20a0ff;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .echarts_box {
        display: flex;
        .info {
          &:nth-of-type(1) {
            flex: 1;
            height: 300px;
          }
          &:nth-of-type(2) {
            height: 300px;
            width: 45%;
            box-sizing: border-box;
            padding-left: 30px;
          }
          .title_box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 34px;
            .title {
              position: relative;
              text-indent: 10px;
              &:before {
                content: ' ';
                position: absolute;
                top: 4px;
                left: 0;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #20a0ff;
              }
            }
          }
          .echarts {
            .echarts-line {
              height: 300px;
            }
            .echarts-pie {
              height: 300px;
            }
          }
        }
      }
    }
  }
</style>

<!--<template>-->
<!--  <div class="data-base">-->

<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {}-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.data-base {-->

<!--}-->
<!--</style>-->


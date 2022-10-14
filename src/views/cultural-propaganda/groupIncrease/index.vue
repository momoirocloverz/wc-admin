<template>
  <div class="groupIncreaseCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <FundingSummary v-if="activeName == 'first'" />
      <SettlementDividend v-if="activeName == 'second'" />
      <exitReview v-if="activeName == 'third'" />
      <returnPrincipal v-if="activeName == 'fourth'" />
      <subsidy v-if="activeName == 'fifth'" />
      <totalInvestment v-if="activeName == 'sixth'" />
      <villageSettlementDividend v-if="activeName == 'seventh'" />
    </div>
  </div>
</template>
<script>
import FundingSummary from './FundingSummary.vue';
import SettlementDividend from './SettlementDividend.vue';
import exitReview from './exitReview.vue';
import returnPrincipal from './returnPrincipal.vue';
import subsidy from './county/subsidy.vue';
import totalInvestment from './village/totalInvestment.vue';
import villageSettlementDividend from './village/settlementDividend.vue';
export default {
  components: {
    FundingSummary,
    SettlementDividend,
    exitReview,
    returnPrincipal,
    subsidy,
    totalInvestment,
    villageSettlementDividend,
  },
  name: 'groupIncreaseCon',
  data() {
    return {
      activeName: 'first',
      tabArray: [
        { label: '资金汇总', name: 'first' },
        { label: '结算分红', name: 'second' },
        { label: '退出审核', name: 'third' },
        { label: '退还本金', name: 'fourth' },
        { label: '补贴发放', name: 'fifth' },
        { label: '投资总额', name: 'sixth' },
        { label: '结算分红', name: 'seventh' },
      ],
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  mounted() {
    // this.initAction();
    this.initQuery();
  },
  methods: {
    initAction() {},
    initQuery() {
      if (this.$route.query && this.$route.query.activeName) {
        this.activeName = this.$route.query.activeName;
      }
    },
    handleClick(tab, event) {
      this.$router.push({
        path: this.$route.path,
        query: {
          activeName: this.activeName,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.tabContainer {
  width: 95%;
  padding-top: 20px;
  box-sizing: border-box;
  margin: 0 auto;
}
.groupIncreaseCon {
  background-color: #fff;
  width: 98%;
  margin: 15px 0px 0px 15px;
  .innerCon {
    width: 98%;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>

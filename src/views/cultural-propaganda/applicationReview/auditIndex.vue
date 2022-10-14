<template>
  <div class="applicationReviewAuditCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <auditIndexFarmer v-if="activeName == 'second'" />
      <auditIndexMajor v-if="activeName == 'first'" />
      <auditPair v-if="activeName == 'third'" />
      <auditFarmerQuit v-if="activeName == 'fourth'" />
      <auditTraining v-if="activeName == 'sixth'" />
      <auditWork v-if="activeName == 'seventh'" />
      <auditBenefit v-if="activeName == 'eighth'" />
      <auditCapitalistQuit v-if="activeName == 'ninth'" />
    </div>
  </div>
</template>
<script>
import auditIndexFarmer from './auditIndexFarmer.vue';
import auditIndexMajor from './auditIndexMajor.vue';
import auditPair from './auditPair.vue';
import auditWork from './auditWork.vue';
import auditTraining from './auditTraining.vue';
import auditBenefit from './auditBenefit.vue';
import auditFarmerQuit from './auditFarmerQuit.vue';
import auditCapitalistQuit from './auditCapitalistQuit.vue';

export default {
  components: {
    auditIndexFarmer,
    auditIndexMajor,
    auditPair,
    auditWork,
    auditTraining,
    auditBenefit,
    auditFarmerQuit,
    auditCapitalistQuit,
  },
  name: 'applicationReviewAuditCon',
  data() {
    return {
      activeName: '',
      tabArray: [],
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  mounted() {
    this.initAction();
    this.initQuery();
  },
  methods: {
    initAction() {
      let empty = [
        { label: '中蜂企业', name: 'first' },
        { label: '低收入农户', name: 'second' },
        { label: '结对', name: 'third' },
        { label: '低收入农户退出', name: 'fourth' },
        { label: '中蜂企业退出', name: 'ninth' },
        { label: '培训', name: 'sixth' },
        { label: '工作', name: 'seventh' },
        { label: '收益', name: 'eighth' },
      ];
      this.tabArray = empty;
      this.activeName = this.tabArray[0].name;
    },
    initQuery() {
      if (this.$route.query && this.$route.query.subActive) {
        this.activeName = this.$route.query.subActive;
      }
    },
    handleClick(tab, event) {
      this.$router.push({
        path: this.$route.path,
        query: {
          activeName: this.$route.query.activeName,
          subActive: this.activeName,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.tabContainer {
  box-sizing: border-box;
  margin: 0 auto;
}
.applicationReviewAuditCon {
  background-color: #fff;
  .innerCon {
    padding-top: 0;
    margin: 0 auto;
    background-color: #fff;
    box-sizing: border-box;
  }
}
</style>
<style lang="scss">
.applicationReviewAuditCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

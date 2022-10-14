<template>
  <div class="industryAllianceWorkShopCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <workIndex v-if="activeName == 'first'" @changeTab="changeTab" />
      <preOrder v-if="activeName == 'second'" />
      <manage v-if="activeName == 'third'" />
    </div>
  </div>
</template>
<script>
import workIndex from './workshopCon/index.vue';
import preOrder from './workshopCon/preOrder.vue';
import manage from './workshopCon/manage.vue';
export default {
  components: {
    workIndex,
    preOrder,
    manage,
  },
  name: 'industryAllianceWorkShopCon',
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
        { label: '车间管理', name: 'first' },
        { label: '预约管理', name: 'second' },
        { label: '加工管理', name: 'third' },
      ];
      this.tabArray = empty;
      this.activeName = this.tabArray[0].name;
    },
    initQuery() {
      if (this.$route.query && this.$route.query.subActive) {
        this.activeName = this.$route.query.subActive;
      }
    },
    changeTab(val) {
      this.activeName = 'second';
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
.industryAllianceWorkShopCon {
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
.industryAllianceWorkShopCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

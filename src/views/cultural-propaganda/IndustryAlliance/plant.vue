<template>
  <div class="industryAlliancePlantCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <plantIndex v-if="activeName == 'first'" @changeTab="changeTab" />
      <preOrder v-if="activeName == 'second'" />
    </div>
  </div>
</template>
<script>
import plantIndex from './plantCon/index.vue';
import preOrder from './plantCon/preOrder.vue';
export default {
  components: {
    plantIndex,
    preOrder,
  },
  name: 'industryAlliancePlantCon',
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
        { label: '土地认种', name: 'first' },
        { label: '订单管理', name: 'second' },
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
.industryAlliancePlantCon {
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
.industryAlliancePlantCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

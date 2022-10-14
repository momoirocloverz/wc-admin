<template>
  <div class="industryAllianceMainBodyCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <bodyIndex v-if="activeName == 'first'" />
      <crop v-if="activeName == 'second'" />
    </div>
  </div>
</template>
<script>
import bodyIndex from './mainBodyCon/index.vue';
import crop from './mainBodyCon/crop.vue';
// import manage from './mainBodyCon/manage.vue';

export default {
  components: {
    bodyIndex,
    crop,
  },
  name: 'industryAllianceMainBodyCon',
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
        { label: '农户管理', name: 'first' },
        { label: '企业管理', name: 'second' },
        // { label: '个体作坊管理', name: 'third' },
        // { label: '销售管理', name: 'third' },
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
.industryAllianceMainBodyCon {
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
.industryAllianceMainBodyCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

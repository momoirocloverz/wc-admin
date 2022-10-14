<template>
  <div class="claimRecordCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <policy v-if="activeName == 'first'" />
      <record v-if="activeName == 'second'" />
    </div>
  </div>
</template>
<script>
import policy from './policy.vue';
import record from './record.vue';
export default {
  components: {
    policy,
    record,
  },
  name: 'claimRecordCon',
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
      this.tabArray = [];
      this.tabArray.push({ label: '政策文件', name: 'first' });
      this.tabArray.push({ label: '发放记录', name: 'second' });
      this.activeName = this.tabArray[0].name;
    },
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
.claimRecordCon {
  background-color: #fff;
  width: 98%;
  margin: 15px 0px 0px 15px;
  padding: 10px;
  .innerCon {
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    padding-top: 0;
    box-sizing: border-box;
  }
}
</style>

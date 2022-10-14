<template>
  <div class="industryAllianceCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <plant v-if="activeName == 'first'" />
      <workshop v-if="activeName == 'second'" />
      <mainBody v-if="activeName == 'third'" />
    </div>
  </div>
</template>
<script>
import plant from './plant.vue';
import workshop from './workshop.vue';
import mainBody from './mainBody.vue';
export default {
  components: {
    plant,
    workshop,
    mainBody,
  },
  name: 'industryAllianceCon',
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
      this.tabArray = [
        { label: '土地认种', name: 'first' },
        { label: '共富车间', name: 'second' },
        { label: '主体管理', name: 'third' },
      ];
      //   let empty = [];
      //   if (this.option.includes(2)) {
      //     empty.push({ label: '审批', name: 'first' });
      //   }
      //   if (this.option.includes(3)) {
      //     empty.push({ label: '低收入农户', name: 'second' });
      //   }
      //   this.tabArray = empty;
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
.industryAllianceCon {
  background-color: #fff;
  width: 98%;
  margin: 15px 0px 0px 15px;
  padding: 10px;
  .innerCon {
    width: 98%;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    padding-top: 0;
    box-sizing: border-box;
  }
}
</style>

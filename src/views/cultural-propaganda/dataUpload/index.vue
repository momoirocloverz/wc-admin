<template>
  <div class="culturalDataUpload">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <big v-if="activeName == 'first'" />
      <richText v-if="activeName == 'second'" />
    </div>
  </div>
</template>
<script>
import big from './big.vue';
import richText from './richText.vue';
export default {
  components: {
    big,
    richText,
  },
  name: 'culturalDataUpload',
  data() {
    return {
      activeName: '',
      tabArray: [
        { label: '中蜂企业', name: 'first' },
        { label: '协议', name: 'second' },
      ],
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  mounted() {
    this.initAction();
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
.culturalDataUpload {
  background-color: #fff;
  width: 98%;
  margin: 15px 0px 0px 15px;
  padding: 10px;
  .innerCon {
    width: 98%;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    padding-top: 0 !important;
    box-sizing: border-box;
  }
}
</style>

<template>
  <div class="applicationReviewCon">
    <div class="tabContainer"></div>
    <div class="innerCon">
      <training />
    </div>
  </div>
</template>
<script>
import training from '../dynamicTracking/training.vue';
export default {
  components: {
    training,
  },
  name: 'applicationReviewCon',
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
.applicationReviewCon {
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

<template>
  <div class="employInformationCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon">
      <Pass v-if="activeName == 'first'" />
      <Refuse v-if="activeName == 'second'" />
      <Waiting v-if="activeName == 'third'" />
      <Down v-if="activeName == 'fourth'" />
    </div>
  </div>
</template>
<script>
import Pass from './pass.vue'
import Refuse from './refuseCom.vue'
import Waiting from './waitingCom.vue'
import Down from './downCom.vue'
export default {
  components: {
    Pass,
    Refuse,
    Waiting,
    Down
  },
  name: 'employInformationCon',
  data() {
    return {
      activeName: '',
      tabArray: [
        { label: '通过', name: 'first' },
        { label: '不通过', name: 'second' },
        { label: '待审批', name: 'third' },
        { label: '已下架', name: 'fourth' }
      ],
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : []
    }
  },
  mounted() {
    this.initAction()
    this.initQuery()
  },
  methods: {
    initAction() {},
    initQuery() {
      if (this.$route.query && this.$route.query.activeName) {
        this.activeName = this.$route.query.activeName
      } else {
        this.activeName = 'first'
      }
    },
    handleClick(tab, event) {
      this.$router.push({
        path: this.$route.path,
        query: {
          activeName: this.activeName
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.tabContainer {
  width: 95%;
  padding-top: 20px;
  box-sizing: border-box;
  margin: 0 auto;
}
.employInformationCon {
  background-color: #fff;
  width: 98%;
  margin: 15px 0px 0px 15px;
  .innerCon {
    width: 98%;
    margin: 0 auto;
    background-color: #fff;
    box-sizing: border-box;
  }
}
</style>

<template>
  <div class="">
    <div class="richTextTabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="richTextInnerCon">
      <Policy v-if="activeName == 'first'" />
      <Agreement v-if="activeName == 'second'" />
    </div>
  </div>
</template>
<script>
import Policy from './policy.vue'
import Agreement from './agreement.vue'
export default {
  components: {
    Policy,
    Agreement
  },
  data() {
    return {
      activeName: 'first',
      tabArray: [
        { label: '政策', name: 'first' },
        { label: '代养协议', name: 'second' }
      ]
    }
  },
  mounted() {
    this.initAction()
  },
  methods: {
    initAction() {},
    handleClick(tab, event) {
      //   this.$router.push({
      //     path: this.$route.path,
      //     query: {
      //       activeName: this.activeName
      //     }
      //   });
    }
  }
}
</script>

<style scoped lang="scss">
.richTextTabContainer {
  box-sizing: border-box;
  margin: 0 auto;
}
.richTextInnerCon {
  margin: 0 auto;
  background-color: #fff;
  box-sizing: border-box;
}
</style>

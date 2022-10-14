<template>
  <el-dialog
    :visible="richData.visible"
    :title="richData.title"
    :width="richData.width"
    @close="closeRichData"
    >
    <div v-html="richData.data"></div>
  </el-dialog>
</template>
<script>
export default {
  name: "releasecomponent",
  props: ["richData"],
  methods: {
    closeRichData(){
      this.$emit('cancelRich');
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
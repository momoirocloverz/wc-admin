<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="低收入农户">{{ this.info.farmer_name }}</el-descriptions-item>
      <el-descriptions-item label="村镇">{{ this.info.group_name }}</el-descriptions-item>
      <el-descriptions-item label="结对企业">{{ this.info.major_name  }}</el-descriptions-item>
      <el-descriptions-item label="蜂箱">{{ this.info.hive_no }}号</el-descriptions-item>
      <el-descriptions-item label="提交时间">{{ this.info.created_at }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'applicaCon',
  props: {
    data: {},
  },
  data() {
    return {
      info: {},
    };
  },
  mounted() {
    this.info = this.data;
  },
};
</script>
<style scoped lang="scss">
.commonCon1 {
  background-color: #fff;
}
</style>

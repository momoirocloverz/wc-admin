<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="企业名称">{{ this.info.company_name }}</el-descriptions-item>
      <el-descriptions-item label="培训主题">{{ this.info.title }}</el-descriptions-item>
      <el-descriptions-item label="培训内容">{{ this.info.content }}</el-descriptions-item>
      <el-descriptions-item label="培训开始时间">{{ this.info.start_time }}</el-descriptions-item>
      <el-descriptions-item label="培训结束时间">{{ this.info.end_time }}</el-descriptions-item>
      <el-descriptions-item label="培训地点">{{ this.info.address }}</el-descriptions-item>
      <el-descriptions-item label="培训要求"
        ><div class="limit">{{ this.info.demand }}</div></el-descriptions-item
      >
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
.limit {
  width: 450px;
}
</style>

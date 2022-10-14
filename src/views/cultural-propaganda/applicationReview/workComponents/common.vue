<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="企业名称">{{ this.info.company_name }}</el-descriptions-item>
      <el-descriptions-item label="工作内容">{{ this.info.content }}</el-descriptions-item>
      <el-descriptions-item label="工作日期">{{ this.info.start_time + '-' + info.end_time }}</el-descriptions-item>
      <el-descriptions-item label="工作时段">{{ this.info.work_time }}</el-descriptions-item>
      <el-descriptions-item label="工作地点">{{ this.info.address }}</el-descriptions-item>
      <el-descriptions-item label="工作要求">{{ this.info.demand }}</el-descriptions-item>
      <el-descriptions-item label="薪资(元/天)">{{ this.info.salary }}</el-descriptions-item>
      <el-descriptions-item label="招聘人数">{{ this.info.work_num }}</el-descriptions-item>
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
  methods: {
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
  },
};
</script>
<style scoped lang="scss">
.commonCon1 {
  background-color: #fff;
}
</style>

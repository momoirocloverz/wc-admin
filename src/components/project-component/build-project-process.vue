<template>
  <!-- 建设项目进度 -->
  <div class="project-insert">
    <div class="insert-title">
      <span class="title">建设进度记录</span>
      <div class="insert-right">
        <el-button type="primary" @click="addProject"
          >新增项目进度记录</el-button
        >
        <span class="insert-red">(要求每个月至少填写一次)</span>
      </div>
    </div>
    <!-- 表格 -->
    <el-table>
      <el-table-column
        label="记录编号"
        prop="recordNo"
        width="100"
      ></el-table-column>
      <el-table-column label="年份" prop="year"></el-table-column>
      <el-table-column label="乡镇" prop="town"></el-table-column>
      <el-table-column label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="实施单位" prop="company"></el-table-column>
      <el-table-column
        label="项目进度描述"
        prop="projectDesc"
      ></el-table-column>
      <el-table-column label="填写人" prop="writer"></el-table-column>
      <el-table-column label="填写时间" prop="writeTime"></el-table-column>
      <el-table-column label="记录生成时间" prop="recordTime"></el-table-column>
      <el-table-column label="管理操作"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "buildproject",
  methods: {
    addProject() {
      this.$emit("addProject");
    },
  },
};
</script>
<style lang="scss" scoped>
.project-insert {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.insert-title {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .title {
    font-weight: bold;
  }
  .insert-right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .insert-red {
    color: red;
    margin-left: 10px;
  }
}
</style>
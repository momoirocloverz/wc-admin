<template>
  <el-dialog
    :visible="addSuperviseData.visible"
    :width="addSuperviseData.width"
    :title="addSuperviseData.title"
    @close="handleCloseDialog"
  >
    <el-form class="add-project">
      <el-form-item label="项目名称：" label-width="120px" prop="projectName">
        <el-input
          type="text"
          placeholder="请输入项目名称"
          v-model="projectName"
        />
      </el-form-item>
      <el-form-item
        label-width="120px"
        label="项目进度描述："
        prop="progressDesc"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6 }"
          placeholder="请输入项目进度描述"
          v-model="progressDesc"
        />
      </el-form-item>
      <el-form-item label-width="120px" label="填写人：" prop="writer">
        <el-input type="text" placeholder="请输入填写人" v-model="writer" />
      </el-form-item>
      <el-form-item label-width="120px" label="填写时间：" prop="writeTime">
          <el-date-picker placeholder="请选择填写时间" v-model="writeTime" class="add-project-ipt"/>
      </el-form-item>
      <div class="project-button">
          <el-button type="primary">确定</el-button>
          <el-button @click="handleCloseDialog">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "addprojectprocess",
  props: {
    addSuperviseData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      projectName: "",
      progressDesc: "",
      writer: "",
      writeTime:''
    };
  },
  methods:{
      handleCloseDialog(){
          this.$emit('handleCloseDialog');
      }
  }
};
</script>
<style lang="scss" scoped>
.add-project {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.add-project-ipt{
    width: 450px;
}
.project-button{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
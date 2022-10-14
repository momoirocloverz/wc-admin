<template>
  <el-dialog
    :visible="projectClassData.visible"
    :width="projectClassData.width"
    :title="projectClassData.title"
    @close="closeDialog"
  >
    <el-form class="project-form-info">
      <el-form-item
        label="类别编号："
        label-width="100px"
        class="project-form"
        prop="typeNumber"
      >
        <el-input
          type="text"
          placeholder="请输入类别编号"
          v-model="typeNumber"
          class="project-form-ipt"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="项目类别："
        label-width="100px"
        class="project-form"
        prop="projectType"
      >
        <el-input
          type="text"
          placeholder="请输入项目类别"
          v-model="projectType"
          class="project-form-ipt"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="说明："
        label-width="100px"
        class="project-form"
        prop="intro"
      >
        <el-input
          type="text"
          placeholder="请输入项目说明"
          v-model="intro"
          class="project-form-ipt"
        ></el-input>
      </el-form-item>
      <el-form-item
        label-width="100px"
        label="是否启用："
        class="project-form"
        prop="isUse"
      >
        <el-radio v-model="isUse" label="1">是</el-radio>
        <el-radio v-model="isUse" label="0">否</el-radio>
      </el-form-item>
      <div class="project-form-item">
          <el-button type="primary">确定</el-button>
          <el-button @click="closeDialog">返回</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "addprojectclass",
  props: {
    projectClassData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inline: false,
      typeNumber: "",
      projectType: "",
      intro: "",
      isUse: "1",
    };
  },
  methods:{
      closeDialog(){
          this.$emit('closeDialog');
      }
  }
};
</script>
<style lang="scss" scoped>
.project-form-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  .project-form {
    display: flex;
    flex-direction: row;
    align-items: center;
    .project-form-ipt {
      width: 500px;
    }
  }
  .project-form-item{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
  }
}
</style>
<style>
.project-form .el-form-item__content {
  margin-left: 0px !important;
}
</style>
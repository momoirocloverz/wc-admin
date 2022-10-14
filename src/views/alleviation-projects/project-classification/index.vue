<template>
  <div class="project-class">
      <div class="project-top">
          <el-button type="primary" @click="addProjectType">新增项目类别</el-button>
      </div>
      <el-table class="project-table" :data="projectData">
          <el-table-column label="编号" prop="no" width="70" align="center"></el-table-column>
          <el-table-column label="项目分类" prop="projectType" align="center"></el-table-column>
          <el-table-column label="说明" prop="intro" align="center"></el-table-column>
          <el-table-column label="启用" prop="use" align="center"></el-table-column>
          <el-table-column label="管理操作" width="150" align="center">
              <template>
                  <div class="project-option">
                    <span>[&nbsp;<em @click="addProjectType">修改</em>&nbsp;]</span>
                    <span>[&nbsp;<em>删除</em>&nbsp;]</span>
                  </div>
              </template>
          </el-table-column>
      </el-table>
      <add-project-class :projectClassData="projectClassData" @closeDialog="handleCloseDialog"></add-project-class>
  </div>
</template>
<script>
import AddProjectClass from '@/components/project-component/add-project-class'
export default {
  name: "projectclassification",
  data(){
      return{
          projectData:[
              {
                  no:1,
                  projectType:'产业发展类',
                  intro:'dgashjdgashjdgashj',
                  use:'是'
              }
          ],
          projectClassData:{
              visible:false,
              width:'42%',
              title:'新增项目分类'
          }
      }
  },
  methods:{
      handleCloseDialog(){
          this.projectClassData.visible=false;
      },
      addProjectType(){
          this.projectClassData.visible=true;
      }
  },
  components:{
      AddProjectClass
  }
};
</script>
<style lang="scss" scoped>
.project-class {
  width: 98%;
  margin: 15px 0px 0px 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .project-top{
      width: 98%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-left: 2%;
      padding-top: 20px;
  }
  .project-table{
      width: 96%;
      margin: 20px 2%;
  }
  .project-option{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      em{
          font-style: normal;
          color: #409EFF;
          cursor: pointer;
      }
  }
}
</style>
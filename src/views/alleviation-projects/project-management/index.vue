<template>
  <div class="project-manage">
    <header class="project-header">
      <!-- <span>关键字：</span> -->
      <el-input type="text" size="medium" placeholder="请输入项目名称" class="project-ipt" />
      <el-select
        placeholder="请选择要搜索的乡镇"
        size="medium"
        v-model="town"
        class="project-ipt"
      ></el-select>
      <el-button size="medium">搜索</el-button>
      <el-button type="primary" size="medium" @click="hangdleAddProject">新增项目</el-button>
    </header>
    <el-table :data="tableData" class="manage-table">
      <el-table-column
        prop="no"
        label="编号"
        width="70"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="year"
        label="年份"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="type"
        label="项目类别"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="项目名称" align="center">
        <template slot-scope="scope">
          <span class="project-blue" @click="openProject">{{
            scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="company"
        label="实施单位"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="content"
        label="建设内容"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="time"
        label="建设周期"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="link"
        label="项目联系人"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="联系电话"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
      ></el-table-column>
      <el-table-column label="项目进度" align="center">
        <template>
          [<span class="project-look" @click="lookProgress">查询</span>]
        </template>
      </el-table-column>
      <el-table-column prop="jdRecord" label="监督记录" align="center">
        <template> [<span class="project-look" @click="lookSuperviseProgress">查询</span>] </template>
      </el-table-column>
      <el-table-column align="center" label="管理操作">
        <template>
          <div class="manage-option">
            <p>[<span class="project-look">项目卡</span>]</p>
            <p>[<span class="project-look" @click="updataProject">修改</span>]</p>
            <p>[<span class="project-look">删除</span>]</p>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看项目 -->
    <look-project :lookData="lookData" @handleCancel="handleCancelInfo" />
    <!-- 新增项目 -->
    <add-project :addData="addData" @handleClose="handleCloseAddProject" />
    <!-- 项目进度查看 -->
    <look-progress
      :progressData="progressData"
      @handleClose="handleProgressClose"
      @addProject="handleAddProject"
      @addProject1="handleAddProject1"></look-progress>
    <!-- 添加项目进度 -->
    <add-project-process :addProcessData="addProcessData" @handleCloseDialog="handleCloseProcess"></add-project-process>
    <!-- 添加项目监督进度 -->
    <add-supervise-process :addSuperviseData="addSuperviseData" @handleCloseDialog="handleCloseProcess1"></add-supervise-process>
  </div>
</template>
<script>
import LookProject from "@/components/project-component/look-project";
import AddProject from "@/components/project-component/add-project";
import LookProgress from "@/components/project-component/look-progress";
import AddProjectProcess from "@/components/project-component/add-project-process";
import AddSuperviseProcess from '@/components/project-component/add-supervise-process';
export default {
  name: "projectmanagement",
  data() {
    return {
      tableData: [
        {
          no: 1,
          year: "2021年",
          type: "产业发展类",
          name: "吕一村道路建设",
          company: "吕一村股份经济合作社",
          content:
            "建造一座水坝建造一座水坝建造一座水坝建造一座水坝建造一座水坝",
          time: "12个月",
          link: "钟伟杰",
          mobile: "6644222",
          status: "已开工",
        },
      ],
      lookData: {
        visible: false,
        title: "查看项目",
        width: "80%",
      },
      addData: {
        visible: false,
        title: "新建项目",
        width: "80%",
      },
      progressData: {
        visible: false,
        width: "80%",
        title: "查看项目进度",
        // 1是项目进度，2是监督进度
        type:1
      },
      addProcessData: {
        visible: false,
        width: "40%",
        title: "新建项目记录",
      },
      addSuperviseData:{
        visible: false,
        width: "40%",
        title: "新建监察记录",
      },
      town: "",
    };
  },
  methods: {
    // 修改项目
    updataProject(){
      this.addData.visible = true;
    },
    // 取消监察进度
    handleCloseProcess1(){
      this.addSuperviseData.visible=false;
      this.progressData.visible=true;
    },
    // 取消新增进度
    handleCloseProcess(){
      this.addProcessData.visible=false;
      this.progressData.visible=true;
    },
    // 新增项目进度
    handleAddProject(){
      this.progressData.visible=false;
      this.addProcessData.visible=true;
    },
    // 新增监察进度
    handleAddProject1(){
      this.progressData.visible=false;
      this.addSuperviseData.visible=true;
    },
    lookSuperviseProgress(){
      this.progressData.visible=true;
      this.progressData.type=2;
    },
    // 查询进度
    lookProgress() {
      this.progressData.visible = true;
      this.progressData.type=1;
    },
    openProject() {
      this.lookData.visible = true;
    },
    handleCancelInfo() {
      this.lookData = {
        ...this.lookData,
        visible: false,
      };
    },
    hangdleAddProject() {
      this.addData.visible = true;
    },
    handleCloseAddProject() {
      this.addData.visible = false;
    },
    handleProgressClose() {
      this.progressData.visible = false;
    },
  },
  components: {
    LookProject,
    AddProject,
    LookProgress,
    AddProjectProcess,
    AddSuperviseProcess,
  },
};
</script>
<style lang="scss" scoped>
.project-manage {
  width: 98%;
  margin: 15px 0px 0px 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .project-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    margin-left: 50px;
    .project-ipt {
      width: 240px;
      margin-right: 10px;
    }
  }
  .manage-table {
    width: 95%;
    display: flex;
    flex-direction: column;
    margin: 20px auto 0px auto;
  }
  .project-look {
    color: #409eff;
    cursor: pointer;
    margin: 0px 2px;
  }
  .manage-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
      margin: 0px;
    }
  }
  .project-blue {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
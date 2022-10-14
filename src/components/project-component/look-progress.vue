<template>
  <el-dialog
    :visible="progressData.visible"
    :width="progressData.width"
    :title="progressData.title"
    @close="handleClose"
  >
    <div class="project-progress">
      <p class="project-title">
        我是测试我是测试我是测试我是测试我是测试我是测试我是测试
      </p>
      <ul class="project-ul">
        <li>
          <span class="project-label">项目名称：</span>
          <em class="project-em">这是一个测试项目这是个测试项目</em>
        </li>
        <li>
          <span class="project-label">实施单位：</span>
          <em class="project-em">安厨</em>
        </li>
        <li>
          <span class="project-label">乡镇：</span>
          <em class="project-em">南田镇</em>
        </li>
        <li>
          <span class="project-label">实施地点：</span>
          <em class="project-em">安厨</em>
        </li>
        <li>
          <span class="project-label">总投资：</span>
          <em class="project-em">17万元</em>
        </li>
        <li>
          <span class="project-label">补助资金：</span>
          <em class="project-em">11万元</em>
        </li>
        <li>
          <span class="project-label">项目负责人：</span>
          <em class="project-em">赵东夏</em>
        </li>
        <li>
          <span class="project-label">负责人电话：</span>
          <em class="project-em">686002</em>
        </li>
        <li>
          <span class="project-label">项目联系人：</span>
          <em class="project-em">钟伟杰</em>
        </li>
        <li>
          <span class="project-label">联系电话：</span>
          <em class="project-em">664441</em>
        </li>
        <li>
          <span class="project-label">项目状态：</span>
          <em class="project-em">已开工</em>
        </li>
      </ul>
      <div class="project-content">
        <p class="content-title">建设内容</p>
        <p class="content-pinfo">
          这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容这是建设内容
        </p>
      </div>
      <!-- 建设区域 -->
      <build-process @addProject="addProject" v-if="progressData.type==1"></build-process>
      <!-- 监督区域 -->
      <supervise-process v-if="progressData.type==2" @addProject1="addProject1"></supervise-process>
    </div>
  </el-dialog>
</template>
<script>
import BuildProcess from "./build-project-process";
import SuperviseProcess from './supervise-project-process.vue';
export default {
  name: "lookProjectProgress",
  props: {
    progressData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    addProject() {
      this.$emit("addProject");
    },
    addProject1(){
        this.$emit("addProject1");
    }
  },
  components: {
    BuildProcess,
    SuperviseProcess
  },
};
</script>
<style lang="scss" scoped>
.project-progress {
  width: 100%;
  display: flex;
  flex-direction: column;
  .project-title {
    font-weight: bold;
    text-align: center;
    margin-top: 0px;
  }
  .project-ul {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    li {
      width: 50%;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px 0px;
    }
    .project-label {
      width: 120px;
      text-align: right;
    }
    .project-em {
      font-style: normal;
    }
  }
  .project-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    .content-title {
      font-weight: bold;
    }
    .content-pinfo {
      margin-top: 0px;
      line-height: 20px;
    }
  }
}
</style>
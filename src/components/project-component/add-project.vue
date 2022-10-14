<template>
  <el-dialog
    :visible="addData.visible"
    :title="addData.title"
    :width="addData.width"
    @close="closeDialog"
  >
    <el-form class="look-project">
      <!-- 基础信息 -->
      <div class="project-basic clear-padding">
        <div class="basic-intro">
          <el-form-item
            label="年份："
            prop="basic.year"
            label-width="120px"
            class="basic-info"
          >
            <el-select
              v-model="basic.year"
              class="basic-ipt"
              placeholder="请选择年份"
            >
              <el-option
                v-for="item in timeOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label-width="120px"
            label="项目类别："
            prop="basic.proType"
            class="basic-info"
          >
            <el-select
              v-model="basic.proType"
              class="basic-ipt"
              placeholder="请选择项目类别"
            >
              <el-option
                v-for="item in protypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="项目名称："
            prop="basic.proName"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入项目名称"
              v-model="basic.proName"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="实施单位："
            prop="basic.company"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入实施单位"
              v-model="basic.company"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="乡镇："
            prop="basic.town"
            class="basic-info"
          >
            <el-select
              v-model="basic.town"
              class="basic-ipt"
              placeholder="请选择乡镇"
            >
              <el-option
                v-for="item in townList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="实施地点："
            prop="basic.address"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入实施地点"
              v-model="basic.address"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="总投资："
            prop="basic.totalMoney"
            class="basic-info"
          >
            <el-input
              type="number"
              placeholder="请输入总投资"
              v-model="basic.totalMoney"
              class="basic-ipt"
            /><span class="point">万元</span>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="补助资金："
            prop="basic.subsidyFund"
            class="basic-info"
          >
            <el-input
              type="number"
              placeholder="请输入补助资金"
              v-model="basic.subsidyFund"
              class="basic-ipt"
            /><span class="point">万元</span>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="资金来源："
            prop="basic.moneyForm"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入资金来源"
              v-model="basic.moneyForm"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="项目计划文件："
            prop="basic.projectPlanning"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入项目计划文件"
              v-model="basic.projectPlanning"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="项目资金文件："
            prop="basic.projectMoney"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入项目资金文件"
              v-model="basic.projectMoney"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="建设周期："
            prop="basic.projectTime"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入建设周期"
              v-model="basic.projectTime"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="预计竣工日期："
            prop="basic.completionTime"
            class="basic-info"
          >
            <el-date-picker
              placeholder="请选择项目预计竣工日期"
              v-model="basic.completionTime"
              class="basic-ipt"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="开始建设日期："
            prop="basic.startTime"
            class="basic-info"
          >
            <el-date-picker
              placeholder="请选择项目开始建设日期"
              v-model="basic.startTime"
              class="basic-ipt"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="实际竣工日期："
            prop="basic.actualTime"
            class="basic-info"
          >
            <el-date-picker
              placeholder="请选择项目实际竣工日期"
              v-model="basic.actualTime"
              class="basic-ipt"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="项目负责人："
            prop="basic.projectLeader"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入项目负责人"
              v-model="basic.projectLeader"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="负责人电话："
            prop="basic.leaderMobile"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入项目负责人电话"
              v-model="basic.leaderMobile"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="项目联系人："
            prop="basic.projectLink"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入项目联系人"
              v-model="basic.projectLink"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="联系人电话："
            prop="basic.linkMobile"
            class="basic-info"
          >
            <el-input
              type="text"
              placeholder="请输入联系人电话"
              v-model="basic.linkMobile"
              class="basic-ipt"
            />
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="项目状态："
            prop="basic.status"
            class="basic-info"
          >
            <div>
              <el-radio v-model="basic.status" label="1">未开工</el-radio>
              <el-radio v-model="basic.status" label="2">停工</el-radio>
              <el-radio v-model="basic.status" label="3">已开工</el-radio>
              <el-radio v-model="basic.status" label="4">已竣工</el-radio>
            </div>
          </el-form-item>
        </div>
      </div>
      <!-- 建设内容 -->
      <div class="project-basic">
        <el-form-item label="建设内容：" label-width="120px">
          <el-input
            type="textarea"
            class="basic-area"
            placeholder="请输入建设内容"
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-model="basic.content"
          />
        </el-form-item>
      </div>
      <!-- 验收时间 -->
      <div class="project-basic">
        <el-form-item
          label-width="120px"
          label="验收时间："
          prop="basic.acceptanceTime"
        >
          <el-date-picker
            v-model="basic.acceptanceTime"
            placeholder="请选择验收时间"
          ></el-date-picker>
        </el-form-item>
      </div>
      <!-- 验收内容 -->
      <div class="project-basic">
        <el-form-item label="验收内容：" label-width="120px" prop="basic.acceptanceContent">
          <el-input
            type="textarea"
            class="basic-area"
            placeholder="请输入验收内容"
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-model="basic.acceptanceContent"
          />
        </el-form-item>
      </div>
      <!-- 备注 -->
      <div class="project-basic">
        <el-form-item label-width="120px" label="备注：" prop="basic.remark">
            <el-input
            type="textarea"
            class="basic-area"
            placeholder="请输入备注内容"
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-model="basic.remark"
            />
        </el-form-item>
      </div>
      <!-- 按钮 -->
      <div class="project-button">
        <el-button type="primary">确定</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "addproject",
  props: {
    addData: {
      type: Object,
      required: true,
    },
  },
  data() {
    let year = new Date().getFullYear(),
      date = [];
    for (let i = year; i >= 2011; i--) {
      date.push({ label: i + "年", value: i });
    }
    return {
      timeOptionList: date,
      basic: {
        year: "",
        proType: "",
        proName: "",
        company: "",
        town: "",
        address: "",
        totalMoney: "",
        subsidyFund: "",
        moneyForm: "",
        projectPlanning: "",
        projectMoney: "",
        projectTime: "",
        completionTime: "",
        startTime: "",
        actualTime: "",
        projectLeader: "",
        leaderMobile: "",
        projectLink: "",
        linkMobile: "",
        status: "1",
        content: "",
        acceptanceTime: "",
        acceptanceContent: "",
        remark: "",
      },
      protypeList: [
        {
          label: "产业发展类",
          value: 1,
        },
      ],
      townList: [
        {
          label: "南田镇",
          value: 0,
        },
      ],
    };
  },
  methods:{
      closeDialog(){
          this.$emit('handleClose');
      }
  }
};
</script>
<style lang="scss" scoped>
.look-project {
  width: 100%;
  display: flex;
  flex-direction: column;
  .project-basic {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .basic-ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    .basic-tab {
      width: 120px;
      height: 30px;
      line-height: 30px;
      background: #fff;
      color: #333;
      text-align: center;
      cursor: pointer;
    }
    .basic-active {
      background: #409eff;
      color: #fff;
      border-radius: 2px;
    }
  }
  .clear-padding {
    padding-top: 0px;
  }
  .basic-weight {
    font-size: 18px;
    font-weight: bold;
    margin-top: 0px;
    span {
      font-weight: normal;
    }
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .basic-title {
    text-align: center;
  }
  .basic-ul {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 0px;
    li {
      width: 50%;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px 0px;
      span {
        width: 120px;
        text-align: right;
      }
      em {
        font-style: normal;
      }
    }
  }
  .basic-content {
    font-size: 14px;
    line-height: 28px;
    margin-top: 10px;
  }
  .project-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  .basic-intro {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .basic-info {
    width: 50%;
    .basic-ipt {
      width: 400px;
    }
  }
  .point {
    margin-left: 10px;
  }
}
</style>
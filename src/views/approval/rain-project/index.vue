<template>
  <div class="rain-project">
    <header>
      <div class="header-top">
        <div class="topLeft">
          <div class="header-item">
            <!-- <span>类型：</span> -->
            <el-select
              v-model="userType"
              size="medium"
              placeholder="请选择用户类型"
            >
              <el-option
                v-for="(item, index) in userTypeList"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </div>
          <!-- <div class="header-item">
          <el-select v-model="userArchives"
                     size="medium"
                     placeholder="请选择是否低收入农户">
            <el-option v-for="item in archivesList"
                       :key="item.value"
                       :value="item.value"
                       :label="item.label"></el-option>
          </el-select>
        </div> -->
          <!-- <div class="header-item">
          <el-select v-model="userStatus"
                     size="medium"
                     placeholder="请选择农户状态">
            <el-option v-for="item in userStatusList"
                       :key="item.value"
                       :value="item.value"
                       :label="item.label"></el-option>
          </el-select>
        </div> -->
          <div class="header-item">
            <!-- <span>审核状态：</span> -->
            <el-select
              v-model="auditStatus"
              size="medium"
              placeholder="请选择审核状态"
            >
              <el-option
                v-for="(item, index) in auditStatusList"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </div>
          <div class="header-item expandInput">
            <el-input
              type="text"
              size="medium"
              placeholder="请输入农户姓名或者身份证号"
              v-model="userName"
            />
          </div>
          <div class="datePickerCon">
            <el-date-picker
              size="medium"
              v-model="timeRange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="申请开始日期"
              end-placeholder="申请结束日期"
              align="right"
            >
            </el-date-picker>
          </div>
        </div>

        <div class="header-export-div">
          <el-button
            type="primary"
            size="medium"
            class="header-search"
            @click="searchAction"
            >搜索</el-button
          >
          <el-button
            size="medium"
    
            class="header-export"
            @click="exportPassedList"
            :disabled="exportPassedDisabled"
            >导出通过名单</el-button
          >
        </div>
      </div>
    </header>
    <!-- 表格 -->
    <el-table class="table-info" v-loading="loading" :data="tableData">
      <el-table-column
        prop="type"
        label="类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="low_income"
        label="是否低收入农户"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="is_register"
        label="状态"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="head_name"
        label="农户姓名"
        align="center"
      ></el-table-column>
      <el-table-column prop="head_contact" label="农户电话" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.head_contact">
            {{
              scope.row.head_contact.replace(
                scope.row.head_contact.substr(3, 4),
                "****"
              )
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="head_card"
        label="农户身份证号"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="relation"
        label="关系"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="children_name"
        label="子女姓名"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="apply_at"
        label="申请日期"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="status_name"
        label="审批结果"
        align="center"
      ></el-table-column>
      <el-table-column prop="applyProcess" label="审批进度" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"

            @click="checkProgress(scope)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div >
            <span v-if="scope.row.operate == 1"></span>
            <el-button
              v-else
              size="mini"
              :class="[scope.row.operate == 3 ? 'greyText' : '']"
              :type="scope.row.operate == 2 ? 'primary' : 'text'"
              @click="operateItem(scope)"
              >{{ scope.row.operate == 3 ? "已审核" : "审核" }}</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-footer">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        class="pagination-info"
      ></el-pagination>
    </div>
    <el-dialog
      :visible="toDialogInfo.visible"
      class="setMiddleDialog rainExport"
      width="80%"
      title="雨露计划确认导出名单"
      @close="closeDialog"
    >
      <exportDialog
        v-if="toDialogInfo.visible"
        @shutDown="toDialogInfo.visible = false"
        @confirmExport="runExportAction"
      />
    </el-dialog>
  </div>
</template>
<script>
import { PlanLists, batchExportPlan } from "@/api/rain";
import exportDialog from "./dialog/index";
export default {
  name: "rainproject",
  components: {
    exportDialog
  },
  data() {
    return {
      option:
        this.$store.getters.option.length !== 0
          ? this.$store.getters.option
          : JSON.parse(sessionStorage.getItem("option"))
          ? JSON.parse(sessionStorage.getItem("option"))
          : [],
      timeRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      toDialogInfo: { visible: false },
      exportPassedDisabled: false,
      loading: false,
      userType: "",
      userTypeList: [
        {
          label: "用户类型(全部)",
          value: ""
        },
        {
          label: "低保",
          value: 1
        },
        {
          label: "低边",
          value: 2
        },
        {
          label: "五保",
          value: 3
        }
      ],
      userArchives: "",
      archivesList: [
        {
          label: "全部",
          value: 0
        },
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 2
        }
      ],
      userStatus: "",
      userStatusList: [
        {
          label: "全部",
          value: 0
        },
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 2
        }
      ],
      auditStatus: "",
      auditStatusList: [
        {
          label: "审核状态(全部)",
          value: ""
        },
        {
          label: "通过",
          value: 2
        },
        {
          label: "不通过",
          value: 3
        },
        {
          label: "审核中",
          value: 1
        },
        {
          label: "未审核",
          value: 0
        }
      ],
      userName: "",
      tableData: []
    };
  },
  created() {
    this.fetchList();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem("isRefresh");
      sessionStorage.removeItem("childRouterQuery");
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
    runExportAction(val) {
      console.log(val); //批量数据获取
      this.toDialogInfo.visible = false;
      if (val.length) {
        const KungLao = val
          .map(ele => {
            return ele.id;
          })
          .join(",");
        let token = sessionStorage.getItem("token");
        const Raiden = { ids: KungLao, Authorization: token };
        batchExportPlan(Raiden)
          .then(res => {
            if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = "雨露计划批量导出" + Date.now() + ".xlsx";
              if ("download" in document.createElement("a")) {
                // 非IE下载
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
              } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName);
              }
            }
          })
          .catch(err => {
            console.log("err", err);
          });
      } else {
        this.$message({
          message: "未选中任何条目"
        });
      }
    },
    closeDialog() {
      this.toDialogInfo.visible = false;
    },
    fetchList() {
      this.loading = true;
      const data = {
        type: this.userType,
        audit_status: this.auditStatus,
        keyword: this.userName,
        start_time: this.timeRange ? this.timeRange[0] : undefined,
        end_time: this.timeRange ? this.timeRange[1] : undefined,
        page: this.currentPage,
        page_size: this.pageSize
      };
      PlanLists(data)
        .then(res => {
          if (res.code === 0) {
            this.tableData = res.data.data;
            this.total = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    checkProgress(item) {
      this.$router.push({
        path: "approvalprogress",
        query: {
          justForCheck: "true",
          ID: item.row.id,
          operate: item.row.operate
        }
      });
    },
    operateItem(item) {
      if (item.row.operate == 2) {
        this.$router.push({
          path: "approvalprogress",
          query: {
            justForCheck: "false",
            ID: item.row.id,
            operate: item.row.operate
          }
        });
      }
    },
    searchAction() {
      this.fetchList();
    },
    exportPassedList() {
      this.exportPassedDisabled = true;
      setTimeout(() => {
        this.exportPassedDisabled = false;
      }, 500);
      this.toDialogInfo.visible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.datePickerCon {
  //   margin-top: 20px;
}
.expandInput {
  width: 200px;
}
.greyText {
  color: #999;
  cursor: not-allowed;
}
.rain-project {
  width: 98%;
  margin: 15px 0px 0px 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  header {
    width: 95%;
    display: flex;
    align-items: center;
    padding-top: 10px;
    margin: 10px auto 0;
  }
  .header-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .topLeft {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  .header-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
  }
  .header-search {
    // padding: 0px 20px;
  }
  .header-export {
    width: 150px;
    // padding: 0px 20px;
  }
  .header-export-div {
    margin-bottom: 20px;
    // display: flex;
    // align-content: center;
    // margin-left: auto;
  }
  .table-info {
    width: 95%;
    margin: 20px auto;
  }
}
</style>
<style lang="scss">
.rainExport {
  .el-dialog {
    height: 700px;
  }
}
</style>

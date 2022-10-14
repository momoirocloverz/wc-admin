<template>
  <div>
    <div class="export-dialog">
      <div class="export-dialog-header">
        <el-date-picker
          v-model="timeRange"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          @change="dateChange"
          start-placeholder="申请开始日期"
          end-placeholder="申请结束日期"
          align="right"
        >
        </el-date-picker>
      </div>
      <el-table
        :data="exportData"
        max-height="400"
        ref="multipleTable"
        key="111"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class="export-table"
      >
        <el-table-column
          type="selection"
          fixed="left"
          width="55"
        ></el-table-column>
        <el-table-column
          label="申报单位名称"
          prop="company_name"
        ></el-table-column>
        <el-table-column
          label="社会统一信用代码"
          prop="credit_code"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          label="联系人"
          prop="linkman"
          align="center"
        ></el-table-column>
        <el-table-column
          label="电话"
          prop="linkman_mobile"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.linkman_mobile">
              {{
                scope.row.linkman_mobile.replace(
                  scope.row.linkman_mobile.substr(3, 4),
                  "****"
                )
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="userType == '1'"
          label="申报低收入农户户数"
          prop="user_num"
          align="center"
        ></el-table-column>
        <el-table-column
          label="申请时间"
          prop="created_at"
          align="center"
        ></el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        class="pagination-info"
      ></el-pagination>
    </div>
    <div class="export-button">
      <el-button type="primary" @click="confirmAction">确定导出</el-button>
      <el-button @click="cancelOption">取消操作</el-button>
    </div>
  </div>
</template>
<script>
import { PlanBeeLists } from "@/api/rain";
import _ from "lodash";
export default {
  name: "rainExport",
  props: ["userType"],
  data() {
    return {
      requestData: {
        page: "",
        page_size: "",
        start_time: "",
        end_time: ""
      },
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      town: "",
      multipleSelection: [],
      oneDimensionMultipleSelection: [],
      exportData: [],
      prevData: [],
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
      }
    };
  },
  created() {
    this.getSmallCodeList();
  },
  methods: {
    getSmallCodeList() {
      this.loading = true;
      this.requestData = {
        audit_status: 2,
        page: this.page,
        page_size: this.pageSize,
        start_time: this.timeRange[0],
        end_time: this.timeRange[1],
        type: this.userType
      };
      PlanBeeLists(this.requestData)
        .then(res => {
          this.exportData = res.data.data;
          this.total = res.data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    dateChange() {
      this.page = 1;
      this.forPageList(1);
    },
    forPageList(e) {
      this.loading = true;
      this.requestData = {
        audit_status: 2,
        page: this.page,
        page_size: this.pageSize,
        start_time: this.timeRange[0],
        end_time: this.timeRange[1],
        type: this.userType
      };
      PlanBeeLists(this.requestData)
        .then(res => {
          this.exportData = res.data.data;
          this.total = res.data.total;
          if (e) {
            const track = _.cloneDeep(this.multipleSelection);
            if (track[e - 1]) {
              track[e - 1].forEach(row => {
                const findIndex = this.exportData.findIndex(ele => {
                  return ele.ID == row.ID;
                });
                setTimeout(() => {
                  this.$refs.multipleTable.toggleRowSelection(
                    this.exportData[findIndex]
                  );
                }, 0);
              });
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCurrentChange(e) {
      this.page = e;
      this.forPageList(e);
    },
    // 导出预览
    exportExcelPrev() {
      const track = _.cloneDeep(this.multipleSelection);
      const afterEmpty = track.map(ele => {
        if (ele) {
          return ele;
        } else {
          return [];
        }
      });
      console.log(afterEmpty);
      const newGuy = afterEmpty.reduce(function(a, b) {
        return a.concat(b);
      }, []);
      this.oneDimensionMultipleSelection = _.cloneDeep(newGuy);
      this.prevData = _.cloneDeep(newGuy);
      console.log("newGuy", newGuy);
      //   this.$emit('exportPrev');
    },
    // 选择
    handleSelectionChange(val) {
      this.multipleSelection[this.page - 1] = val;
    },
    confirmAction() {
      const track = _.cloneDeep(this.multipleSelection);
      const afterEmpty = track.map(ele => {
        if (ele) {
          return ele;
        } else {
          return [];
        }
      });
      const newGuy = afterEmpty.reduce(function(a, b) {
        return a.concat(b);
      }, []);
      this.oneDimensionMultipleSelection = _.cloneDeep(newGuy);
      this.$emit("confirmExport", this.oneDimensionMultipleSelection);
      /* console.log( this.Dayjs( this.timeRange[0] ).format('YYYY-MM-DD HH:mm:ss') ) */
    },
    cancelOption() {
      this.$emit("shutDown");
    }
  }
};
</script>
<style lang="scss" scoped>
.export-left {
  width: 190px;
  margin-left: 10px;
}
.export-left-info {
  margin-left: 10px;
}
.export-dialog {
  display: flex;
  flex-direction: column;
  .export-dialog-header {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .export-table {
    margin-top: 20px;
  }
}
.pagination-info {
  width: 98%;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.export-button {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
}
.export-prev {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.prev-delete {
  color: #409eff;
  cursor: pointer;
  em {
    font-style: normal;
  }
}
.again-add {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 20px 0px;
}
</style>

<template>
  <div class="industryAllianceWorkManageCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="type" class="fixInput" placeholder="请选择加工类型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" class="fixInput" placeholder="请选择审核进度">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="name" placeholder="预约人"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-date-picker v-model="timeRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="card" placeholder="身份证号"></el-input>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="btnarea">
        <el-button type="primary" @click="exportAction">导出</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column label="加工类型" align="center">
            <template slot-scope="scope">
              <div>{{ typeMap[scope.row.type] }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="家庭地址" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.address }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="预约人" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="card" label="身份证号" align="center"></el-table-column>
          <el-table-column label="联系方式" prop="mobile" align="center"></el-table-column>
          <el-table-column prop="weight" label="加工量" align="center"></el-table-column>
          <el-table-column prop="price" label="加工费用" align="center"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">
              <div>{{ statusMap[scope.row.status] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popAuditItem(scope.row)" v-if="scope.row.status == 0">审批</el-button>
                <el-button type="text" @click="popDetail(scope.row)">查看</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    </div>
    <el-dialog class="setMiddleDialog upload3Dialog" title="详情" width="620px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scrollCon">
        <ContentDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload2Dialog" title="审核" width="620px" :visible.sync="auditVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll1Con">
        <el-radio v-model="auditValue" label="2">通过</el-radio>
        <el-radio v-model="auditValue" label="3">不通过</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutAudit">确 定</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { beeMajorAudit, industryProcessLists, industryplantProcessExport, industryplantProcessAudit } from '@/api/bee';
import ContentDetail from './manage/common.vue';
export default {
  components: {
    ContentDetail,
  },
  name: 'industryAllianceWorkManageCon',
  watch: {},
  data() {
    return {
      auditValue: '2',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      town_id: '',
      village_id: '',
      audit_type: '',
      type: '',
      type: '',
      typeOptions: [
        {
          label: '加工类型(全部)',
          value: '',
        },
        {
          label: '委托加工',
          value: 1,
        },
        {
          label: '定制加工',
          value: 2,
        },
      ],
      statusOptions: [
        {
          value: '',
          label: '预约状态(全部)',
        },
        {
          value: '0',
          label: '待审批',
        },
        {
          value: '2',
          label: '已审批',
        },
        {
          value: '3',
          label: '已拒绝',
        },
      ],
      options: [],
      content: '',
      name: '',
      card: '',
      status: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      typeMap: {
        1: '委托加工',
        2: '定制加工',
      },
      statusMap: {
        0: '待审批',
        2: '已通过',
        3: '已拒绝',
      },
      loading: false,
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      currentItem: {},
      detailVisible: false,
      auditVisible: false,
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    shutAudit() {
      let data = {
        status: this.auditValue,
        id: this.currentItem.id,
      };
      industryplantProcessAudit(data).then((res) => {
        if (res && res.code == 0) {
          this.auditVisible = false;
          this.$message.success('操作成功');
          this.fetchList();
        }
      });
    },
    cancelAudit() {
      this.auditVisible = false;
    },
    exportAction() {
      industryplantProcessExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '共富车间加工管理导出' + Date.now() + '.xlsx';
            if ('download' in document.createElement('a')) {
              // 非IE下载
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
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
        .catch((err) => {
          console.log('err', err);
        });
    },
    shutDetail() {
      this.detailVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            major_id: this.currentItem.major_id,
          };
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.detailVisible = false;
    },
    popAuditItem(row) {
      this.currentItem = row;
      this.auditVisible = true;
    },
    popDetail(row) {
      this.currentItem = row;
      this.detailVisible = true;
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.type = '';
      this.name = '';
      this.status = '';
      this.card = '';
      this.currentPage = 1;
      this.town_id = '';
      this.village_id = '';
      this.timeRange = [];
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        type: this.type,
        name: this.name,
        status: this.status,
        card: this.card,
        page: this.currentPage,
        page_size: this.pageSize,
        town_id: this.town_id,
        village_id: this.village_id,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      industryProcessLists(data).then((res) => {
        if (res && res.code === 0) {
          res.data.data.forEach((ele, index) => (ele.index = index + 1));
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
  },
};
</script>
<style scoped lang="scss">
.scrollCon {
  overflow-y: auto;
  height: 280px;
}
.scroll1Con {
  overflow-y: auto;
  height: 60px;
}
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.industryAllianceWorkManageCon {
  background-color: #fff;
  .innerCon {
    padding-top: 0;
    margin: 0 auto;
    background-color: #fff;
    box-sizing: border-box;
  }
  .header-top {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
}
.button_list {
}
.marginAddon {
  margin-right: 20px;
}
.fixInput {
  width: 100%;
}
.marginBootomAddon {
  margin-bottom: 20px;
}
.btnarea {
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.industryAllianceWorkManageCon {
  .upload3Dialog {
    .el-dialog {
      height: 460px;
    }
  }
  .upload2Dialog {
    .el-dialog {
      height: 240px;
    }
  }
}
</style>

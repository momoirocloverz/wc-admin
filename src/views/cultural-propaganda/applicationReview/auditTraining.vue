<template>
  <div class="auditTrainingCon">
    <div class="innerCon">
      <div class="blockArea">
        <Blocks :array="blockArray" />
      </div>
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <!-- <el-select v-model="company_name" multiple filterable remote reserve-keyword placeholder="企业名称" :remote-method="remoteMethod" :loading="searchLoading">
            <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-input v-model.trim="company_name" placeholder="企业名称"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-date-picker v-model="timeRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="id" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="company_name" label="企业名称" align="center"></el-table-column>
          <el-table-column label="培训主题" prop="title" align="center"></el-table-column>
          <el-table-column prop="content" label="培训内容" align="center"></el-table-column>
          <el-table-column prop="start_time" label="培训开始时间" align="center" width="180"></el-table-column>
          <el-table-column prop="end_time" label="培训结束时间" align="center" width="180"></el-table-column>
          <el-table-column prop="address" label="培训地点" align="center"></el-table-column>
          <el-table-column prop="demand" label="培训要求" align="center"> </el-table-column>
          <el-table-column prop="created_at" label="提交时间" align="center" width="180"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.status_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popAuditItem(scope.row)" v-if="scope.row.status == 0 && option.includes(67)">审批</el-button>
                <el-button type="text" @click="popDetail(scope.row)" v-if="scope.row.status > 0">查看详情</el-button>
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
    <el-dialog class="setMiddleDialog auditTrainingUpload" :title="isAudit ? '审批' : '详情'" width="600px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scrollCon">
        <ContentDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm" v-if="isAudit">
        <el-form-item label="审批" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="2">通过</el-radio>
            <el-radio label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="理由" prop="comment" :class="[ruleForm.status == 3 ? 'fakeRequired' : '']">
          <el-input type="textarea" resize="none" v-model="ruleForm.comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
      <div v-else>
        <el-descriptions title="" :column="1" v-if="currentItem.status > 0">
          <el-descriptions-item label="审批结果">{{ currentItem.status_name }}</el-descriptions-item>
          <el-descriptions-item label="理由">{{ currentItem.comment }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!isAudit">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { beeTrainAuditList, beeTrainAudit } from '@/api/bee';
import Blocks from '../components/Blocks';
import ContentDetail from './trainComponents/detail';
export default {
  components: {
    Blocks,
    ContentDetail,
  },
  name: 'auditTrainingCon',
  watch: {
    'ruleForm.status': {
      handler(nValue, old) {
        this.$refs.ruleForm.clearValidate('comment');
        if (nValue == 2) {
          this.rules.comment = [];
          this.$forceUpdate();
        } else {
          this.rules.comment = [{ required: true, message: '请填写', trigger: 'blur' }];
          this.$forceUpdate();
        }
      },
    },
  },
  data() {
    return {
      companyOptions: [],
      searchLoading: false,
      isAudit: false,
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
      status: '',
      statusOptions: [
        {
          value: '',
          label: '状态(全部)',
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
        // {
        //   value: '4',
        //   label: '已结束',
        // },
      ],
      detailVisible: false,
      currentItem: {},
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      title: '',
      company_name: '',
      type: '',
      blockArray: [
        {
          title: '已审批',
          amount: '0',
        },
        {
          title: '待审批',
          amount: '0',
        },
      ],
      options: [],
      tableData: [],
      loading: false,
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      ruleForm: {
        status: '2',
        comment: '',
      },
      rules: {
        status: [{ required: true, message: '请选择', trigger: 'blur' }],
        // comment: [{ required: true, message: '请填写', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true;
        setTimeout(() => {
          this.searchLoading = false;
          console.log('query', query);
          //   this.companyOptions = this.list.filter((item) => {
          //     return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          //   });
        }, 200);
      } else {
        this.companyOptions = [];
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            comment: this.ruleForm.comment,
            audit_status: this.ruleForm.status,
            train_id: this.currentItem.id,
          };
          beeTrainAudit(data)
            .then((res) => {
              this.detailVisible = false;
              if (res.code == 0) {
                this.$message.success('操作成功');
                this.fetchList();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.detailVisible = false;
              console.log('err', err);
            });
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
    shutDetail() {
      this.detailVisible = false;
    },
    popAuditItem(row) {
      this.isAudit = true;
      this.currentItem = row;
      this.detailVisible = true;
      this.ruleForm = {
        status: '2',
        comment: '',
      };
    },
    popDetail(row) {
      this.isAudit = false;
      this.currentItem = row;
      this.detailVisible = true;
      this.ruleForm = {
        status: '2',
        comment: '',
      };
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.status = '';
      this.company_name = '';
      this.currentPage = 1;
      this.timeRange = [];
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        status: this.status,
        company_name: this.company_name,
        page: this.currentPage,
        page_size: this.pageSize,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      beeTrainAuditList(data).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.blockArray = [
            {
              title: '已审批',
              amount: res.data.endNum,
            },
            {
              title: '待审批',
              amount: res.data.waitNum,
            },
          ];
        } else {
          this.$message.error(res.msg);
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
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.auditTrainingCon {
  background-color: #fff;
  .innerCon {
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
.marginBootomAddon {
  margin-bottom: 20px;
}
.tableCon {
}
.fakeRequired {
  position: relative;
  &::before {
    content: '*';
    color: #f56c6c;
    left: 20px;
    top: 10px;
    font-size: 16px;
    position: absolute;
  }
}
</style>
<style lang="scss">
.auditTrainingCon {
  .auditTrainingUpload {
    .el-dialog {
      height: 590px;
    }
  }
}
</style>

<template>
  <div class="auditBenefitCon">
    <div class="innerCon">
      <div class="blockArea">
        <Blocks :array="blockArray" />
      </div>
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <!-- <el-select v-model="company_name" multiple filterable remote reserve-keyword placeholder="企业名称" :remote-method="remoteMethod" :loading="searchLoading">
            <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select> -->
          <el-input v-model.trim="company_name" placeholder="企业名称"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="town_id" class="fixInput" placeholder="请选择乡镇" @change="townChange(town_id)">
            <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="village_id" class="fixInput" placeholder="请选择村名">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.village_name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
      <div class="btnarea">
        <el-button type="primary" @click="exportAction">批量导出</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="id" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="company_name" label="企业名称" align="center"></el-table-column>
          <el-table-column label="收款村镇" prop="groupName" align="center"></el-table-column>
          <el-table-column prop="amount" label="打款金额(元)" align="center"></el-table-column>
          <el-table-column prop="created_at" label="提交时间" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.status_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popAuditItem(scope.row)" v-if="scope.row.status == 0 && option.includes(69)">审批</el-button>
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
    <el-dialog
      class="setMiddleDialog auditBenefitDialogCon"
      :title="isAudit ? '审批' : '详情'"
      width="600px"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
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
import { beeProfitAuditList, beeProfitAudit, beeProfitAuditExport } from '@/api/bee';
import Blocks from '../components/Blocks';
import ContentDetail from './benefitComponents/detail';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
export default {
  components: {
    Blocks,
    ContentDetail,
  },
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
  name: 'auditBenefitCon',
  data() {
    return {
      town_id: '',
      village_id: '',
      detailVisible: false,
      blockArray: [
        {
          title: '已审批',
          amount: '0',
        },
        {
          title: '待审批',
          amount: '0',
        },
        {
          title: '总打款金额(元)',
          amount: '0',
        },
      ],
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
          label: '不通过',
        },
        {
          value: '4',
          label: '已结束',
        },
      ],
      type: '',
      addressOptions: [],
      options: [],
      content: '',
      company_name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      publishOptions: [],
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      currentItem: {},
      isAudit: false,
      ruleForm: {
        status: '2',
        comment: '',
      },
      rules: {
        status: [{ required: true, message: '请选择', trigger: 'blur' }],
        // comment: [{ required: true, message: '请填写', trigger: 'blur' }],
      },
      companyOptions: [],
      searchLoading: false,
    };
  },
  mounted() {
    this.fetchList();
    this.fetchTown();
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
            profit_id: this.currentItem.id,
          };
          beeProfitAudit(data)
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
    townChange(val) {
      this.fetchVillage(val);
      this.village_id = '';
      this.publishOptions = [];
    },
    fetchVillage(val) {
      const data = {
        town_id: val,
      };
      VillageInfo(data).then((res) => {
        if (res && res.code === 0) {
          let addressInfo = checkIdenity();
          if (addressInfo && addressInfo.village_id) {
            this.publishOptions = res.data.filter((ele) => {
              return ele.id == addressInfo.village_id;
            });
            this.village_id = addressInfo.village_id;
          } else {
            this.publishOptions = res.data;
          }
        }
      });
    },
    fetchTown() {
      TownInfo().then((res) => {
        if (res && res.code === 0) {
          let addressInfo = checkIdenity();
          if (addressInfo && addressInfo.town_id) {
            this.addressOptions = res.data.filter((ele) => {
              return ele.id == addressInfo.town_id;
            });
            this.town_id = addressInfo.town_id;
            this.fetchVillage(addressInfo.town_id);
          } else {
            this.addressOptions = res.data;
          }
        }
      });
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
    shutDetail() {
      this.detailVisible = false;
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
    exportAction() {
      beeProfitAuditExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化低收益审核批量导出' + Date.now() + '.xlsx';
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
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.status = '';
      this.company_name = '';
      this.timeRange = [];
      this.currentPage = 1;
      this.town_id = '';
      this.village_id = '';
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
        town_id: this.town_id,
        village_id: this.village_id,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      beeProfitAuditList(data).then((res) => {
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
            {
              title: '总打款金额(元)',
              amount: res.data.totalAmount,
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
.blockArea {
  //   margin-bottom: 30px;
}
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
.auditBenefitCon {
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
.fixInput {
  width: 100%;
}
.marginBootomAddon {
  margin-bottom: 20px;
}
.btnarea {
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
.auditBenefitCon {
  .auditBenefitDialogCon {
    .el-dialog {
      height: 480px;
    }
  }
}
</style>

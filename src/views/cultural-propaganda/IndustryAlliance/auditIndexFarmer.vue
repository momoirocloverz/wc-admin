<template>
  <div class="auditFarmerCon">
    <div class="innerCon">    
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <!-- <el-select v-model="farmer_name" multiple filterable remote reserve-keyword placeholder="姓名" :remote-method="remoteMethod" :loading="searchLoading">
            <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select> -->
          <el-input v-model.trim="farmer_name" placeholder="姓名"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="town_id" class="fixInput" placeholder="请选择乡镇" @change="townChange(town_id)">
            <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="village_id" class="fixInput" placeholder="请选择村名">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.village_name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <!-- <div class="marginAddon marginBootomAddon">
          <el-select v-model="audit_type" class="fixInput" placeholder="请选择审核进度">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div> -->
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="audit_status" class="fixInput" placeholder="请选择审核进度">
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
        <el-button type="primary" @click="batchPass" :disabled="!multipleSelection.length || resquestDisable" v-if="option.includes(71)">批量通过</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="checkselectAble"></el-table-column>
          <el-table-column prop="farmer_id" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="identity" label="身份证号" align="center" width="180"></el-table-column>
          <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
          <el-table-column prop="town_name" label="乡镇" align="center"></el-table-column>
          <el-table-column label="村名" prop="village_name" align="center"></el-table-column>
          <el-table-column prop="address" label="家庭地址" align="center"> </el-table-column>
          <el-table-column prop="bank_name" label="开户银行" align="center"> </el-table-column>
          <el-table-column prop="bank_card" label="银行账号" align="center"></el-table-column>
          <el-table-column prop="created_at" label="提交时间" align="center" width="180"></el-table-column>
          <!-- <el-table-column prop="bank_card" label="类型" align="center"></el-table-column> -->
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.status_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popAuditItem(scope.row)" v-if="scope.row.status == 0 && option.includes(71)">审批</el-button>
                <el-button type="text" @click="popDetail(scope.row)" v-if="scope.row.status > 0">查看详情</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-footer">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 50, 100]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
          class="pagination-info"
        ></el-pagination>
      </div>
    </div>
    <el-dialog class="setMiddleDialog upload3Dialog" :title="isAudit ? '审批' : '详情'" width="620px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
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
          <el-descriptions-item label="理由">{{ currentItem.village_comment }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!isAudit">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
    <div class="videoMask" v-if="resquestDisable" v-loading="resquestDisable" element-loading-text="处理中，请耐心等待" element-loading-spinner="el-icon-loading"></div>
  </div>
</template>
<script>
import { beeFarmerAuditList, beeFarmerAuditExport, beeFarmerAudit, beeFarmerBatchAudit } from '@/api/bee';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import ContentDetail from './auditFarmerComponents/detail';
export default {
  components: {
    ContentDetail,
  },
  name: 'auditFarmerCon',
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
      ruleForm: {
        status: '2',
        comment: '',
      },
      rules: {
        status: [{ required: true, message: '请选择', trigger: 'blur' }],
        // comment: [{ required: true, message: '请填写', trigger: 'blur' }],
      },
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
      audit_type: '',
      town_id: '',
      village_id: '',
      audit_status: '',
      type: '',
      addressOptions: [],
      typeOptions: [
        {
          label: '类型(全部)',
          value: '',
        },
        {
          label: '申请',
          value: 1,
        },
        {
          label: '资料修改',
          value: 2,
        },
      ],
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
        {
          value: '4',
          label: '已结束',
        },
      ],
      options: [],
      currentPage: 1,
      farmer_name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      publishOptions: [],
      timeRange: [],
      total: 0,
      pageSize: 100,
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
      isAudit: false,
      currentItem: {},
      detailVisible: false,
      companyOptions: [],
      searchLoading: false,
      multipleSelection: [],
      beenSelected: [],
      isMultiple: false,
      resquestDisable: false,
    };
  },
  mounted() {
    this.fetchTown();
    this.fetchList();
  },
  methods: {
    checkselectAble(row, index) {
      //   return true;
      if (row.status == 0) {
        return true;
      } else {
        return false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    requestBatchAction() {
      let data = {
        farmerStr: this.beenSelected
          .map((ele) => {
            return ele.farmer_id;
          })
          .join(','),
      };
      this.resquestDisable = true;
      beeFarmerBatchAudit(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.batchSuccessRefreshAction();
          }
        })
        .finally(() => {
          this.resquestDisable = false;
        });
    },
    batchPass() {
      this.beenSelected = this.multipleSelection;
      this.isMultiple = true;
      if (this.beenSelected.length > 1) {
        this.$confirm('此操作将批量审核通过所选条目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.requestBatchAction();
          })
          .catch(() => {});
      } else {
        this.requestBatchAction();
      }
    },
    batchSuccessRefreshAction() {
      this.$message({
        type: 'success',
        message: '操作成功!',
      });
      this.currentPage = 1;
      this.fetchList();
      this.multipleSelection = [];
      this.beenSelected = [];
      this.isMultiple = false;
    },
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
    shutDetail() {
      this.detailVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          //   alert('submit!');
          let data = {
            comment: this.ruleForm.comment,
            audit_status: this.ruleForm.status,
            farmer_id: this.currentItem.farmer_id,
          };
          beeFarmerAudit(data)
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
    exportAction() {
      beeFarmerAuditExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化低收入农户审核批量导出' + Date.now() + '.xlsx';
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
      this.audit_status = '';
      this.farmer_name = '';
      this.currentPage = 1;
      this.town_id = '';
      this.village_id = '';
      this.pageSize = 100;
      this.timeRange = [];
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      this.loading = true;
      let data = {
        status: this.audit_status,
        farmer_name: this.farmer_name,
        page: this.currentPage,
        page_size: this.pageSize,
        town_id: this.town_id,
        village_id: this.village_id,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      beeFarmerAuditList(data)
        .then((res) => {
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
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
    handleSizeChange(e) {
      this.currentPage = 1;
      this.pageSize = e;
      this.fetchList();
    },
  },
};
</script>
<style scoped lang="scss">
.videoMask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3000;
  bottom: 0;
}
.scrollCon {
  overflow-y: auto;
  height: 220px;
}
.greyText {
  color: #999;
  cursor: not-allowed;
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
.auditFarmerCon {
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
.auditFarmerCon {
  .upload3Dialog {
    .el-dialog {
      height: 520px;
    }
  }
}
</style>

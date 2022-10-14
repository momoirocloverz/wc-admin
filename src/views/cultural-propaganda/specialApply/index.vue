<template>
  <div class="specialApplyCon">
    <div class="innerCon">
      <!-- <div class="blockArea">
        <Blocks :array="blockArray" />
      </div> -->
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="name" placeholder="姓名"></el-input>
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
            <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label" :value="item.value"></el-option>
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
        <!-- <el-button type="primary" @click="exportAction">批量导出</el-button> -->
        <el-button type="primary" @click="batchPass" :disabled="!multipleSelection.length || resquestDisable" >批量申请通过</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="checkselectAble"></el-table-column>
          <el-table-column prop="index" label="序号" align="center" width="60">
            <template slot-scope="scope">
              <div>{{ scope.row.index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column label="身份证" prop="identity" align="center" width="200"></el-table-column>
          <el-table-column label="手机号码" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.mobile || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="town_name" label="乡镇" align="center"></el-table-column>
          <el-table-column label="村名" prop="village_name" align="center"></el-table-column>
          <!-- <el-table-column label="家庭住址" prop="address" align="center"></el-table-column> -->
          <!-- <el-table-column label="家庭住址" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.start_time + '-' + scope.row.end_time }}</div>
            </template>
          </el-table-column>
          <el-table-column label="开户银行" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.start_time + '-' + scope.row.end_time }}</div>
            </template>
          </el-table-column>
          <el-table-column label="银行卡号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.start_time + '-' + scope.row.end_time }}</div>
            </template>
          </el-table-column> -->
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>{{ statusMap[scope.row.is_apply_bee] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" align="center" width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.apply_bee_at || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div >
                <el-button v-if="scope.row.is_apply_bee == 0" type="text" @click="popDetail(scope.row)">申请</el-button>
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
    <el-dialog :close-on-click-modal="false" class="medium_dialog setMiddleDialog" title="申请" width="600px" :before-close="handleCloseForEdit" :visible.sync="editVisible">
      <el-form :model="editForm" status-icon :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name" class="flexFormItem">
          <el-input v-model.trim="editForm.name" maxlength="10" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="乡镇" prop="town_id" class="flexFormItem">
          <el-select v-model="editForm.town_id" class="fixInput" placeholder="请选择乡镇" @change="townDialogFormChange(editForm.town_id)">
            <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="村名" prop="village_id" class="flexFormItem">
          <el-select v-model="editForm.village_id" class="fixInput" placeholder="请选择村名">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.village_name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <!-- prop="mobile" -->
        <el-form-item label="手机号码" class="flexFormItem">
          <el-input v-model.trim="editForm.mobile" maxlength="11" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="identity" class="flexFormItem">
          <el-input v-model.trim="editForm.identity" maxlength="50" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <!-- prop="address" -->
        <el-form-item label="家庭住址" class="flexFormItem">
          <el-input v-model.trim="editForm.address" maxlength="50" placeholder="请输入家庭住址"></el-input>
        </el-form-item>
        <!-- prop="bank_name" -->
        <el-form-item label="开户银行" class="flexFormItem">
          <el-input v-model.trim="editForm.bank_name" maxlength="20" placeholder="请输入开户银行"></el-input>
        </el-form-item>
        <!-- prop="bank_card" -->
        <el-form-item label="银行账号" class="flexFormItem">
          <el-input v-model.trim="editForm.bank_card" maxlength="20" placeholder="请输入银行账号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetEditField('editForm')">取 消</el-button>
        <el-button type="primary" @click="confirmEditAction('editForm')">确 定</el-button>
      </span>
    </el-dialog>

    <div class="videoMask" v-if="resquestDisable" v-loading="resquestDisable" element-loading-text="处理中，请耐心等待" element-loading-spinner="el-icon-loading"></div>
  </div>
</template>
<script>
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import { beeFarmerApplyList, beeFarmerApplyApply, beeFarmerApplyExport, planBeeFarmerApplyBatchApply } from '@/api/bee';
import Blocks from '../components/Blocks';
import ContentDetail from './workComponents/detail';
export default {
  components: {
    Blocks,
    ContentDetail,
  },
  name: 'specialApplyCon',
  data() {
    return {
      publishOptions: [],
      addressOptions: [],
      town_id: '',
      village_id: '',
      blockArray: [],
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
          label: '未申请',
        },
        {
          value: '1',
          label: '申请中',
        },
        {
          value: '2',
          label: '已通过',
        },
        {
          value: '3',
          label: '已拒绝',
        },
      ],
      statusMap: {
        0: '未申请',
        1: '申请中',
        2: '已通过',
        3: '已拒绝',
      },
      type: '',
      content: '',
      name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      timeRange: [],
      total: 0,
      pageSize: 100,
      currentPage: 1,
      currentItem: {},
      editVisible: false,
      editForm: {
        village_id: '',
        town_id: '',
        identity: '',
        mobile: '',
        bank_name: '',
        bank_card: '',
        name: '',
        address: '',
        user_id: '',
      },
      editRules: {
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur',
          },
        ],
        village_id: [
          {
            required: true,
            message: '村名不能为空',
            trigger: 'blur',
          },
        ],
        town_id: [
          {
            required: true,
            message: '乡镇不能为空',
            trigger: 'blur',
          },
        ],
        address: [
          {
            required: true,
            message: '地址不能为空',
            trigger: 'blur',
          },
        ],
        identity: [
          {
            required: true,
            message: '身份证号不能为空',
            trigger: 'blur',
          },
        ],
        mobile: [
          {
            required: true,
            message: '手机号码不能为空',
            trigger: 'blur',
          },
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur',
          },
        ],
        bank_name: [
          {
            required: true,
            message: '开户银行不能为空',
            trigger: 'blur',
          },
        ],
        bank_card: [
          {
            required: true,
            message: '银行账号不能为空',
            trigger: 'blur',
          },
        ],
      },
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
    requestBatchAction() {
      //   let data = {
      //     data: JSON.stringify(
      //       this.beenSelected.map((ele) => {
      //         return {
      //           identity: ele.identity,
      //           bank_name: '',
      //           bank_card: '',
      //           village_id: ele.village_id,
      //           town_id: ele.town_id,
      //           name: ele.name,
      //           mobile: ele.mobile,
      //           address: ele.address,
      //           user_id: ele.user_id,
      //         };
      //       }),
      //     ),
      //   };
      this.resquestDisable = true;
      let data = {
        userStr: this.beenSelected
          .map((ele) => {
            return ele.user_id;
          })
          .join(','),
      };
      planBeeFarmerApplyBatchApply(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.batchSuccessRefreshAction();
          }
        })
        .finally(() => {
          this.resquestDisable = false;
        });
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkselectAble(row, index) {
      //   return true;
      if (row.is_apply_bee == 0) {
        return true;
      } else {
        return false;
      }
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
    townDialogFormChange(val) {
      this.publishOptions = [];
      this.editForm.village_id = '';
      this.fetchVillage(val);
    },
    popDetail(row) {
      this.currentItem = row;
      this.fetchVillage(row.town_id);
      this.editForm = {
        village_id: row.village_id,
        town_id: row.town_id,
        identity: row.identity,
        mobile: row.mobile,
        bank_name: '',
        bank_card: '',
        name: row.name,
        address: row.address,
        user_id: row.user_id,
      };
      this.editVisible = true;
    },
    handleCloseForEdit(done) {
      this.$refs['editForm'].resetFields();
      done();
    },
    resetEditField(formName) {
      this.$refs[formName].resetFields();
      this.editVisible = false;
    },
    confirmEditAction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            identity: this.editForm.identity,
            bank_name: this.editForm.bank_name,
            bank_card: this.editForm.bank_card,
            village_id: this.editForm.village_id,
            town_id: this.editForm.town_id,
            name: this.editForm.name,
            mobile: this.editForm.mobile,
            address: this.editForm.address,
            user_id: this.editForm.user_id,
          };
          beeFarmerApplyApply(data).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('操作成功');
              this.editVisible = false;
              this.$refs['editForm'].resetFields();
              this.currentPage = 1;
              this.fetchList();
            }
          });
        }
      });
    },
    exportAction() {
      beeFarmerApplyExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化申请导出' + Date.now() + '.xlsx';
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
      this.town_id = '';
      this.village_id = '';
      this.status = '';
      this.content = '';
      this.name = '';
      this.timeRange = [];
      this.currentPage = 1;
      this.pageSize = 100;
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      this.loading = true;
      let data = {
        name: this.name,
        is_apply_bee: this.status ? +this.status : '',
        page: this.currentPage,
        page_size: this.pageSize,
        village_id: this.village_id,
        town_id: this.town_id,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_apply_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_apply_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      beeFarmerApplyList(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.tableData = res.data.data.map((ele, index) => {
              return {
                ...ele,
                index,
              };
            });
            this.total = res.data.total;
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
.fixInput {
  width: 100%;
}
.specialApplyCon {
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
.btnarea {
  margin-bottom: 20px;
}
.tableCon {
  margin-top: 20px;
}
.scrollCon {
  height: 490px;
  overflow-y: scroll;
}
</style>
<style lang="scss">
.specialApplyCon {
  .uploadDialog {
    .el-dialog {
      height: 690px;
    }
  }
  .medium_dialog {
    .el-dialog {
      height: 690px;
    }
  }
}
</style>

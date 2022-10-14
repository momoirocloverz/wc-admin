<template>
  <div class="auditIndexMajorCon">
    <div class="innerCon"> 
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <!-- <el-select v-model="company_name" multiple filterable remote reserve-keyword placeholder="结对企业" :remote-method="remoteMethod" :loading="searchLoading">
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
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="major_id" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column label="企业名称" align="center" width="80">
            <template slot-scope="scope">
              <div>{{ scope.row.company_name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="法人代表" align="center" width="80">
            <template slot-scope="scope">
              <div>{{ scope.row.legal_rep }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="法人电话" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.mobile }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="town_name" label="乡镇" align="center" width="80"></el-table-column>
          <el-table-column label="村名" prop="village_name" align="center" width="80"></el-table-column>
          <el-table-column prop="train_hive" label="蜂箱数" align="center" width="80"></el-table-column>
          <el-table-column prop="bee_desc" label="主要蜜源" align="center"></el-table-column>
          <el-table-column prop="linkman" label="联系人" align="center" width="80"></el-table-column>
          <el-table-column prop="linkman_mobile" label="联系人电话" align="center"></el-table-column>
          <el-table-column prop="evaluation" label="自评分数" align="center" width="80"></el-table-column>
          <el-table-column prop="created_at" label="提交时间" align="center"></el-table-column>
          <!-- <el-table-column prop="bank_card" label="类型" align="center"></el-table-column> -->
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">
              <div>{{ scope.row.status_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popAuditItem(scope.row)" v-if="scope.row.status == 0 && option.includes(72)">审批</el-button>
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
    <el-dialog class="setMiddleDialog upload3Dialog" :title="isAudit ? '审批' : '详情'" width="620px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scrollCon">
        <ContentDetail v-if="detailVisible" :data="currentItem" @bridgeTrans="bridgeTrans" :isAudit="isAudit" @seniorityChange="watchSeniority" />
      </div>
      <div class="allCount" v-if="detailVisible">评分 {{ starFilter(allCount) }} ({{ allCount }}分)</div>
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
          <el-descriptions-item label="理由">{{ currentItem.farm_comment }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!isAudit">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { beeMajorAuditList, beeMajorAuditExport, beeMajorAudit, beeMajorAuditInfo } from '@/api/bee';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import ContentDetail from './auditMajorComponents/common.vue';
export default {
  components: {
    ContentDetail,
  },
  name: 'auditIndexMajorCon',
  watch: {
    'ruleForm.status': {
      handler(nValue, old) {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate('comment');
        }
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
      allCount: 0,
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
      town_id: '',
      village_id: '',
      audit_type: '',
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
      searchType: 0,
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
      deepForm: {},
      companyOptions: [],
      searchLoading: false,
      globalStar: 1,
      seniority_status: '1',
    };
  },
  mounted() {
    this.fetchTown();
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
    watchSeniority(val) {
      this.seniority_status = val;
    },
    bridgeTrans(val) {
      this.deepForm = val;
      let array = Object.values(this.deepForm);
      let filter = array.filter((ele) => {
        return ele;
      });
      let res = filter.reduce((acc, current) => {
        return acc + current;
      }, 0);
      if (val.point12) {
        res = res - val.point12 * 2;
      }
      if (val.point13) {
        res = res - val.point13 * 2;
      }
      this.allCount = res;
    },
    starFilter(val) {
      if (val < 40) {
        this.globalStar = 1;
        return '一星';
      } else if (val >= 40 && val < 60) {
        this.globalStar = 2;
        return '二星';
      } else if (val >= 60 && val < 80) {
        this.globalStar = 3;
        return '三星';
      } else if (val >= 80 && val < 90) {
        this.globalStar = 4;
        return '四星';
      } else {
        this.globalStar = 5;
        return '五星';
      }
    },
    exportAction() {
      beeMajorAuditExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化养殖大户审核批量导出' + Date.now() + '.xlsx';
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
          let eva_info = this.currentItem.old_eva_info;
          eva_info = eva_info.replaceAll("'", '"');
          let after = JSON.parse(eva_info);
          //   let after = JSON.parse(this.currentItem.eva_info);
          after.addonData = { ...this.deepForm };
          // console.log( 'after',after )
          let data = {
            comment: this.ruleForm.comment,
            audit_status: this.ruleForm.status,
            major_id: this.currentItem.major_id,
            star: this.globalStar,
            eva_info: JSON.stringify(after),
            seniority_status: this.seniority_status,
            ma_evaluation: this.allCount,
          };
          let generateArray = Object.values(this.deepForm);
          let checkEmpty = generateArray.some((ele) => {
            return ele == undefined;
          });
          const innerRequest = (data) => {
            // console.log('data', data);
            beeMajorAudit(data)
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
          };
          if (this.seniority_status == 1) {
            if (this.ruleForm.status == 3) {
              //不通过
              //   data.ma_evaluation = 0;
              //   data.star = 1;
              //   after.addonData = {};
              this.deepForm = {};
              data.eva_info = JSON.stringify(after);
              innerRequest(data);
            } else {
              //通过
              if (generateArray.length) {
                if (checkEmpty) {
                  return this.$message.error('评分不能为空');
                } else {
                  innerRequest(data);
                }
              } else {
                return this.$message.error('评分不能为空');
              }
            }
          } else {
            innerRequest(data);
          }
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
      let data = {
        major_id: row.major_id,
      };
      beeMajorAuditInfo(data).then((res) => {
        if (res && res.code == 0) {
          this.currentItem = res.data;
          this.detailVisible = true;
          this.allCount = row.ma_evaluation ? +row.ma_evaluation : 0;
          this.ruleForm = {
            status: '2',
            comment: '',
          };
        }
      });
    },
    popDetail(row) {
      this.isAudit = false;
      let data = {
        major_id: row.major_id,
      };
      beeMajorAuditInfo(data).then((res) => {
        // console.log('res', res);
        if (res && res.code == 0) {
          this.currentItem = res.data;
          this.detailVisible = true;
          this.allCount = row.ma_evaluation ? +row.ma_evaluation : 0;
          this.ruleForm = {
            status: '2',
            comment: '',
          };
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
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.audit_status = '';
      this.company_name = '';
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
        status: this.audit_status,
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
      beeMajorAuditList(data).then((res) => {
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
.allCount {
  height: 30px;
  padding-top: 10px;
  box-sizing: border-box;
  text-align: center;
  font-weight: 500;
  font-size: 20px;
}
.scrollCon {
  overflow-y: auto;
  height: 320px;
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
.auditIndexMajorCon {
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
.auditIndexMajorCon {
  .upload3Dialog {
    .el-dialog {
      height: 630px;
    }
  }
}
</style>

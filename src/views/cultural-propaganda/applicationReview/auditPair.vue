<template>
  <div class="auditPairCon">
    <div class="innerCon">
      <div class="blockArea">
        <Blocks :array="blockArray" />
      </div>
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <!-- <el-select v-model="farmer_name" multiple filterable remote reserve-keyword placeholder="低收入农户" :remote-method="remoteMethod" :loading="searchLoading">
            <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-input v-model.trim="farmer_name" placeholder="低收入农户"></el-input>
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
          <el-select v-model="status" class="fixInput" placeholder="状态">
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

      <div class="btnarea">
        <el-button type="primary" @click="exportAction">批量导出</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column label="序号" align="center" prop="id" width="60"> </el-table-column>
          <el-table-column label="低收入农户" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.farmer_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="村镇" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.group_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="企业名称" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.major_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="蜂箱照片" align="center">
            <template slot-scope="scope">
              <!-- <div>蜂箱{{ scope.row.hive_no }}号：</div> -->
              <div class="image_box">
                {{ scope.row.hive_no }}
                <preview-image :src="scope.row.img_url ? scope.row.img_url[0] : ''" :src-list="scope.row.img_url ? scope.row.img_url : []" />
                <!-- <template v-for="(item, index) in scope.row.img_url">
                  <div :key="index">
                    <div><preview-image :src="item ? item[0] : ''" :src-list="item ? scope.row.img_url : []" /></div>
                  </div>
                </template> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="蜂箱地址" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.address }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.created_at }}
              </div>
            </template>
          </el-table-column>
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
                <el-button type="text" @click="popAuditItem(scope.row)" v-if="(scope.row.status == 0 && option.includes(73)) || (scope.row.status == 1 && option.includes(74))">审批</el-button>
                <el-button type="text" v-if="scope.row.status > 0" @click="popDetail(scope.row)">查看详情</el-button>
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
      class="setMiddleDialog auditPairuploadDialogCon"
      :title="isAudit ? '审批' : '详情'"
      width="620px"
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
          <el-descriptions-item label="审批结果">
            <div>
              {{ currentItem.status_name }}
            </div>
            <div v-if="currentItem.village_audit > 1">村级审核: {{ currentItem.village_audit == 2 ? '同意' : '不同意' }}</div>
            <div v-if="currentItem.town_audit > 1">镇级审核: {{ currentItem.town_audit == 2 ? '同意' : '不同意' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="理由">
            <div v-if="currentItem.village_audit > 1">村级审核理由: {{ currentItem.village_comment }}</div>
            <div v-if="currentItem.town_audit > 1">镇级审核理由: {{ currentItem.town_comment }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!isAudit">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { beeMatchAuditList, beeMatchAuditExport, beeMatchVillageAudit, beeMatchTownAudit } from '@/api/bee';
import previewImage from '@/components/previewImage/index';
import Blocks from '../components/Blocks';
import ContentDetail from './auditPairComponents/detail';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
export default {
  components: {
    previewImage,
    Blocks,
    ContentDetail,
  },
  name: 'auditPairCon',
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
      isAudit: true,
      town_id: '',
      village_id: '',
      publishOptions: [],
      addressOptions: [],
      currentItem: {},
      detailVisible: false,
      farmer_name: '',
      status: '',
      ruleForm: {
        status: '2',
        comment: '',
      },
      rules: {
        status: [{ required: true, message: '请选择', trigger: 'blur' }],
        // comment: [{ required: true, message: '请填写', trigger: 'blur' }],
      },
      type: '',
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
          value: '1',
          label: '审批中',
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
        // {
        //   value: '5',
        //   label: '村级不通过',
        // },
        // {
        //   value: '6',
        //   label: '乡镇不通过',
        // },
        // {
        //   value: '7',
        //   label: '村级通过',
        // },
        // {
        //   value: '8',
        //   label: '乡镇通过',
        // },
      ],
      options: [],
      content: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
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
            id: this.currentItem.id,
          };
          let isTown = this.currentItem.status == 1 && this.currentItem.village_audit == 2;
          if (!isTown) {
            this.$confirm('是否确认操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                beeMatchVillageAudit(data)
                  .then((res) => {
                    this.detailVisible = false;
                    if (res.code == 0) {
                      this.$message.success('操作成功');
                      this.fetchList();
                    }
                  })
                  .catch((err) => {
                    this.detailVisible = false;
                    console.log('err', err);
                  });
              })
              .catch(() => {
                //
              });
          } else {
            this.$confirm(' 是否确认操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                beeMatchTownAudit(data)
                  .then((res) => {
                    this.detailVisible = false;
                    if (res.code == 0) {
                      this.$message.success('操作成功');
                      this.fetchList();
                    }
                  })
                  .catch((err) => {
                    this.detailVisible = false;
                    console.log('err', err);
                  });
              })
              .catch(() => {
                //
              });
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
    exportAction() {
      beeMatchAuditExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化结对审核批量导出' + Date.now() + '.xlsx';
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
    popDetail(row) {
      this.isAudit = false;
      this.currentItem = row;
      this.detailVisible = true;
      this.ruleForm = {
        status: '2',
        comment: '',
      };
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
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.farmer_name = '';
      this.status = '';
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
        farmer_name: this.farmer_name,
        status: this.status,
        page: this.currentPage,
        page_size: this.pageSize,
        town_id: this.town_id,
        village_id: this.village_id,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      beeMatchAuditList(data).then((res) => {
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
  },
};
</script>
<style scoped lang="scss">
.image_box {
  width: 170px;
  height: 170px;
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
.auditPairCon {
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
.scrollCon {
  overflow-y: auto;
  height: 320px;
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
.auditPairCon {
  .auditPairuploadDialogCon {
    .el-dialog {
      height: 630px;
    }
  }
}
</style>

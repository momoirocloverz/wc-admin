<template>
  <div class="specialMatchCon">
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
        <el-button type="primary" @click="exportAction">批量导出</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="index" label="序号" align="center" width="60">
            <template slot-scope="scope">
              <div>{{ scope.row.index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column label="身份证" prop="identity" align="center" width="200"></el-table-column>
          <el-table-column prop="mobile" label="手机号码" align="center"> </el-table-column>
          <el-table-column prop="town_name" label="乡镇" align="center"> </el-table-column>
          <el-table-column prop="village_name" label="村名" align="center"> </el-table-column>
          <el-table-column prop="admin_name" label="帮扶干部" align="center"> </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>{{ statusMap[scope.row.status] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" align="center" width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.created_at }}</div>
            </template>
          </el-table-column>
          <el-table-column label="结对时间" align="center" width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.match_at || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div >
                <el-button type="text" v-if="scope.row.status == 0 || scope.row.status == 2" @click="popMatch(scope.row)">结对</el-button>
                <el-button type="text" @click="popDetail(scope.row)">查看详情</el-button>
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
    <el-dialog class="setMiddleDialog uploadDialog" title="查看详情" width="600px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scrollCon">
        <ContentDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog matchDialog" title="结对" width="900px" :visible.sync="matchVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scrollMatchCon">
        <el-table :data="matchTableData" height="410">
          <el-table-column prop="company_name" label="企业名称" align="center"> </el-table-column>
          <el-table-column prop="address" label="公司地址" align="center"> </el-table-column>
          <el-table-column prop="legal_rep" label="法人名称" align="center"> </el-table-column>
          <!-- <el-table-column prop="demand" label="品牌" align="center"> </el-table-column> -->
          <el-table-column prop="train_year" label="养殖年份" align="center"> </el-table-column>
          <el-table-column prop="mobile" label="电话号码" align="center"> </el-table-column>
          <el-table-column prop="act_train_hive" label="蜂箱数" align="center"> </el-table-column>
          <el-table-column prop="index" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popApply(scope.row)">申请结对</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutMatch">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import { beeFarmerAssistList, beeFarmerAssistExport, beeFarmerAssistMajorList, beeFarmerAssistMatch, beeFarmerAssistInfo } from '@/api/bee';
import Blocks from '../components/Blocks';
import ContentDetail from './workComponents/detail';
export default {
  components: {
    Blocks,
    ContentDetail,
  },
  name: 'specialMatchCon',
  data() {
    return {
      publishOptions: [],
      addressOptions: [],
      town_id: '',
      village_id: '',
      detailVisible: false,
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
          label: '待结对',
        },
        {
          value: '1',
          label: '已结对',
        },
      ],
      statusMap: {
        0: '待结对',
        1: '已结对',
      },
      type: '',
      content: '',
      name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      currentItem: {},
      matchTableData: [],
      matchVisible: false,
      famerInfo: {},
      majorInfo: {},
    };
  },
  mounted() {
    this.fetchTown();
    this.fetchList();
  },
  methods: {
    popApply(row) {
      this.majorInfo = row;
      this.$confirm('此操作将申请结对, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let data = {
            farmer_id: this.famerInfo.farmer_id,
            major_id: this.majorInfo.major_id,
          };
          beeFarmerAssistMatch(data).then((res) => {
            if (res && res.code === 0) {
              this.$message({
                type: 'success',
                message: '申请成功!',
              });
              this.matchVisible = false;
              this.fetchList();
            }
          });
        })
        .catch(() => {});
    },
    shutMatch() {
      this.matchVisible = false;
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
    shutDetail() {
      this.detailVisible = false;
    },
    popMatch(row) {
      this.famerInfo = row;
      const data = {
        // town_id: row.id,
      };
      beeFarmerAssistMajorList(data).then((res) => {
        if (res && res.code === 0) {
          this.matchTableData = res.data;
          this.matchVisible = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    popDetail(row) {
      const data = {
        user_id: row.user_id,
      };
      beeFarmerAssistInfo(data).then((res) => {
        if (res && res.code === 0) {
          this.currentItem = res.data;
          this.detailVisible = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    exportAction() {
      beeFarmerAssistExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业结对帮扶导出' + Date.now() + '.xlsx';
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
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        name: this.name,
        status: this.status,
        page: this.currentPage,
        page_size: this.pageSize,
        village_id: this.village_id,
        town_id: this.town_id,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      beeFarmerAssistList(data).then((res) => {
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
.specialMatchCon {
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
}
.scrollCon {
  height: 360px;
  overflow-y: scroll;
}
.scrollMatchCon {
  //   height: 400px;
  overflow-y: scroll;
}
</style>
<style lang="scss">
.specialMatchCon {
  .uploadDialog {
    .el-dialog {
      height: 540px;
    }
  }
  .matchDialog {
    .el-dialog {
      height: 600px;
    }
  }
}
</style>

<template>
  <div class="claimRecordSubCon">
    <div class="innerCon">
      <div class="blockArea">
        <Blocks :array="blockArray" />
      </div>
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="wf_name" placeholder="补助项目"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="town_id" class="fixInput" placeholder="请选择乡镇" @change="townChange(town_id)">
            <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="village_id" @change="villageChange(village_id)" class="fixInput" placeholder="请选择村名">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.village_name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="name" placeholder="补助对象姓名"></el-input>
        </div>
        <!-- <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" class="fixInput" placeholder="拨付状态">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div> -->
        <div class="marginAddon marginBootomAddon">
          <el-date-picker v-model="timeRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <!-- <div class="btnarea">
        <el-button type="primary" @click="exportAction">批量导出</el-button>
      </div> -->
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column label="序号" align="center" width="90" prop="id"></el-table-column>
          <el-table-column label="补助项目" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.wf_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="批次名称" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.batch_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工单编号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.inst_code }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="street" label="乡镇" align="center" width="80"></el-table-column>
          <el-table-column label="村名" prop="village" align="center" width="80"></el-table-column>
          <el-table-column label="补助对象身份证" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.pid }}</div>
            </template>
          </el-table-column>
          <el-table-column label="补助对象姓名" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拨付对象身份证" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.pay_pid }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拨付对象姓名" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.pay_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拨付状态" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.sts }}</div>
            </template>
          </el-table-column>
          <el-table-column label="金额(元)" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.reward }}</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.create_time || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拨付时间" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.pay_year || '-' }}</div>
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
  </div>
</template>
<script>
import { applyList } from '@/api/bee';
import Blocks from './components/Blocks';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
export default {
  components: {
    Blocks,
  },
  name: 'claimRecordSubCon',
  data() {
    return {
      currentItem: {},
      detailVisible: false,
      htmlContent: '',
      wf_name: '',
      name: '',
      farmer_name: '',
      status: '',
      action: '/web/dept/upload',
      type: '',
      statusOptions: [
        {
          id: '',
          name: '拨付状态(全部)',
        },
        {
          id: '0',
          name: '待拨付',
        },
        {
          id: '2',
          name: '已拨付',
        },
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
          title: '补贴人数(人)',
          amount: '0',
        },
        {
          title: '补贴金额(万元)',
          amount: '0',
        },
      ],
      searchContentLoading: false,
      searchLoading: false,
      addressOptions: [],
      publishOptions: [],
      town_id: '',
      town_name: '',
      village_id: '',
      village_name: '',
    };
  },
  mounted() {
    this.fetchTown();
    this.fetchList();
  },
  methods: {
    fetchTown() {
      TownInfo().then((res) => {
        if (res && res.code === 0) {
          this.addressOptions = res.data;
          //   let addressInfo = checkIdenity();
          //   if (addressInfo && addressInfo.town_id) {
          //     this.addressOptions = res.data.filter((ele) => {
          //       return ele.id == addressInfo.town_id;
          //     });
          //     this.town_id = addressInfo.town_id;
          //     // this.town_name =
          //     this.fetchVillage(addressInfo.town_id);
          //   } else {
          //     this.addressOptions = res.data;
          //   }
        }
      });
    },
    townChange(val) {
      let track = this.addressOptions.find((ele) => {
        return ele.id == val;
      });
      this.town_name = track.town_name;
      this.fetchVillage(val);
      this.village_name = '';
      this.publishOptions = [];
    },
    villageChange(val) {
      let track = this.publishOptions.find((ele) => {
        return ele.id == val;
      });
      this.village_name = track.village_name;
    },
    fetchVillage(val) {
      const data = {
        town_id: val,
      };
      VillageInfo(data).then((res) => {
        if (res && res.code === 0) {
          //   let addressInfo = checkIdenity();
          //   if (addressInfo && addressInfo.village_id) {
          //     this.publishOptions = res.data.filter((ele) => {
          //       return ele.id == addressInfo.village_id;
          //     });
          //     this.village_id = addressInfo.village_id;
          //   } else {
          this.publishOptions = res.data;
          //   }
        }
      });
    },
    exportAction() {
      //   beeMatchExport()
      //     .then((res) => {
      //       if (res.status == 200) {
      //         const content = res.data;
      //         const blob = new Blob([content]);
      //         const fileName = '申领记录批量导出' + Date.now() + '.xlsx';
      //         if ('download' in document.createElement('a')) {
      //           // 非IE下载
      //           const elink = document.createElement('a');
      //           elink.download = fileName;
      //           elink.style.display = 'none';
      //           elink.href = URL.createObjectURL(blob);
      //           document.body.appendChild(elink);
      //           elink.click();
      //           URL.revokeObjectURL(elink.href); // 释放URL 对象
      //           document.body.removeChild(elink);
      //         } else {
      //           // IE10+下载
      //           navigator.msSaveBlob(blob, fileName);
      //         }
      //       }
      //     })
      //     .catch((err) => {
      //       console.log('err', err);
      //     });
    },
    shutDetail() {
      this.detailVisible = false;
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.wf_name = '';
      this.name = '';
      this.town_id = '';
      this.town_name = '';
      this.village_id = '';
      this.village_name = '';
      this.timeRange = [];
      this.currentPage = 1;
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        wf_name: this.wf_name,
        name: this.name,
        town_name: this.town_name,
        village_name: this.village_name,
        page: this.currentPage,
        page_size: this.pageSize,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      applyList(data).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.blockArray = [
            {
              title: '补贴人数(人)',
              amount: res.data.subsidyPerson,
            },
            {
              title: '补贴金额(万元)',
              amount: (res.data.subsidyTotalPrice / 10000).toFixed(2),
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
.tabContainer {
  width: 95%;
  padding-top: 20px;
  box-sizing: border-box;
  margin: 0 auto;
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
.claimRecordSubCon {
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
  height: 310px;
}
</style>
<style lang="scss">
.claimRecordSubCon {
  .uploadDialog {
    .el-dialog {
      height: 500px;
    }
  }
}
</style>

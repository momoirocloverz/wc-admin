<template>
  <div class="dynamicTrackingTrainingCon">
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
      <div class="addArea">
        <el-button type="primary" @click="exportAction">批量导出</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="id" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="company_name" label="企业名称" align="center"></el-table-column>
          <el-table-column label="培训主题" prop="title" align="center"></el-table-column>
          <el-table-column prop="content" label="培训内容" align="center"></el-table-column>
          <el-table-column prop="start_time" label="培训日期" align="center" width="300">
            <template slot-scope="scope">
              <div>{{ scope.row.start_time + '-' + scope.row.end_time }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="培训地点" align="center"></el-table-column>
          <el-table-column prop="demand" label="培训要求" align="center"></el-table-column>
          <el-table-column prop="trainApplyNum" label="报名人数" align="center"></el-table-column>
          <el-table-column prop="sign_num" label="实际签到人数" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.sign_num || '-' }}
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
          <el-table-column label="操作" align="center" width="240">
            <template slot-scope="scope">
              <div>
     
                <el-button type="text" @click="popMatchList(scope.row)" v-if="scope.row.status == 2">报名</el-button>
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

    <el-dialog class="setMiddleDialog upload2Dialog" title="培训报名" width="600px" :visible.sync="batchVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll2Con">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <span class="checkLengthMark">已选{{ checkedCities.length }}人</span>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="(item, index) in cities" class="checkBoxCus" :label="item.value" :key="index">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutBatch">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { beeTrainLists, beeTrainExport, planBeeTrainFarmerList, planBeeTrainBatchApply } from '@/api/bee';
import Blocks from '../components/Blocks';
import ContentDetail from './trainComponents/detail';
export default {
  components: {
    Blocks,
    ContentDetail,
  },
  name: 'dynamicTrackingTrainingCon',
  data() {
    return {
      companyOptions: [],
      searchLoading: false,
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
          value: '2',
          label: '报名中',
        },
        {
          value: '4',
          label: '已结束',
        },
        // {
        //   value: '4',
        //   label: '已结束-待上传',
        // },
      ],
      detailVisible: false,
      currentItem: {},
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      title: '',
      company_name: '',
      blockArray: [
        {
          title: '培训人数(户)',
          amount: '0',
        },
        {
          title: '培训次数(次)',
          amount: '0',
        },
      ],
      options: [],
      content: '',
      tableData: [],
      loading: false,
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,

      batchVisible: false,
      isIndeterminate: true,
      checkAll: false,
      cities: [],
      checkedCities: [],
      batchItem: {},
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleCheckAllChange(val) {
      this.checkedCities = val
        ? this.cities.map((ele) => {
            return ele.value;
          })
        : [];
      this.isIndeterminate = false;
    },
    popMatchList(row) {
      this.batchItem = row;
      this.cities = [];
      this.isIndeterminate = true;
      this.checkAll = false;
      this.checkedCities = [];
      let data = {
        train_id: this.batchItem.id,
      };
      planBeeTrainFarmerList(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.cities = res.data.map((ele) => {
              return {
                value: ele.farmer_id,
                name: ele.name,
              };
            });
            this.batchVisible = true;
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    shutBatch() {
      let data = {
        train_id: this.batchItem.id,
        farmerStr: this.checkedCities.join(','),
      };
      if (this.checkedCities.length) {
        planBeeTrainBatchApply(data)
          .then((res) => {
            if (res && res.code === 0) {
              this.$message.success('报名成功');
              this.batchVisible = false;
              this.runSearch();
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      } else {
        this.$message.error('请选择报名人');
      }
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
    popDetail(row) {
      this.currentItem = row;
      this.detailVisible = true;
    },
    exportAction() {
      beeTrainExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化培训批量导出' + Date.now() + '.xlsx';
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
      this.company_name = '';
      this.status = '';
      this.timeRange = [];
      this.currentPage = 1;
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        company_name: this.company_name,
        status: this.status,
        page: this.currentPage,
        page_size: this.pageSize,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      beeTrainLists(data).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.blockArray = [
            {
              title: '培训人数(户)',
              amount: res.data.trainApplyNum,
            },
            {
              title: '培训次数(次)',
              amount: res.data.trainNum,
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
.addArea {
  margin-bottom: 20px;
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
.dynamicTrackingTrainingCon {
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
.scrollCon {
  height: 490px;
  overflow-y: scroll;
}
.scroll2Con {
  height: 410px;
  overflow-y: scroll;
}
.checkLengthMark {
  margin-left: 20px;
}
</style>
<style lang="scss">
.dynamicTrackingTrainingCon {
  .uploadDialog {
    .el-dialog {
      height: 690px;
    }
  }
  .upload2Dialog {
    .el-dialog {
      height: 600px;
    }
  }
  .checkBoxCus {
    width: 80px;
    margin-bottom: 20px;
  }
}
</style>

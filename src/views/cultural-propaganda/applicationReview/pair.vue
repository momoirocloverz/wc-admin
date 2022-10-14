<template>
  <div class="applicationReviewPairCon">
    <div class="innerCon">
      <div class="blockArea">
        <Blocks :array="blockArray" />
      </div>
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <!-- <el-select v-model="major_name" multiple filterable remote reserve-keyword placeholder="结对企业" :remote-method="remoteMethod" :loading="searchLoading">
            <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select> -->
          <el-input v-model.trim="major_name" placeholder="结对企业"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <!-- <el-select v-model="farmer_name" multiple filterable remote reserve-keyword placeholder="低收入农户" :remote-method="remoteContentMethod" :loading="searchContentLoading">
            <el-option v-for="item in contentOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select> -->
          <el-input v-model.trim="farmer_name" placeholder="低收入农户"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" class="fixInput" placeholder="状态">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
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
          <el-table-column label="序号" align="center" width="60" prop="id"></el-table-column>
          <el-table-column label="低收入农户" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.farmer_info }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="结对企业" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.major_info }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.status_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="养蜂信息" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.hive_report_num }}次</div>
            </template>
          </el-table-column>
          <el-table-column label="结对时间" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.created_at }}</div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.updated_at || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <!-- <el-button
          
                  size="mini"
                  @click="popDeleteMainItem(scope.row)"
                  >删除</el-button
                > -->
                <!-- size="mini" -->
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
    <el-dialog class="setMiddleDialog uploadDialog" title="结对详情" width="700px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scrollCon">
        <ContentDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { beeMatchLists, beeMatchExport } from '@/api/bee';
import Blocks from '../components/Blocks';
import ContentDetail from './pairComponents/detail';
export default {
  components: {
    Blocks,
    ContentDetail,
  },
  name: 'applicationReviewPairCon',
  data() {
    return {
      currentItem: {},
      detailVisible: false,
      htmlContent: '',
      major_name: '',
      farmer_name: '',
      status: '',
      action: '/web/dept/upload',
      type: '',
      statusOptions: [
        {
          id: '',
          name: '状态(全部)',
        },
        {
          id: '0',
          name: '待审批',
        },
        {
          id: '2',
          name: '已审批',
        },
        {
          id: '3',
          name: '已拒绝',
        },
        {
          id: '4',
          name: '农户退出',
        },
        {
          id: '5',
          name: '村集体所有',
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
          title: '养蜂信息(份)',
          amount: '0',
        },
        {
          title: '待上传养蜂信息(份)',
          amount: '0',
        },
      ],
      contentOptions: [],
      searchContentLoading: false,
      companyOptions: [],
      searchLoading: false,
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    remoteContentMethod(query) {
      if (query !== '') {
        this.searchContentLoading = true;
        setTimeout(() => {
          this.searchContentLoading = false;
          console.log('query', query);
          //   this.contentOptions = this.list.filter((item) => {
          //     return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          //   });
        }, 200);
      } else {
        this.contentOptions = [];
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
    exportAction() {
      beeMatchExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化结对批量导出' + Date.now() + '.xlsx';
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
      this.currentItem = row;
      this.detailVisible = true;
    },
    popDeleteMainItem(row) {
      this.$alert(`确定删除该条目`, '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action == 'confirm') {
            propertyDelete({
              property_id: row.id,
            })
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('删除成功');
                  this.currentPage = 1;
                  this.fetchList();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
      });
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.major_name = '';
      this.farmer_name = '';
      this.timeRange = [];
      this.status = '';
      this.currentPage = 1;
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        major_name: this.major_name,
        farmer_name: this.farmer_name,
        status: this.status,
        page: this.currentPage,
        page_size: this.pageSize,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      beeMatchLists(data).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.blockArray = [
            {
              title: '养蜂信息(份)',
              amount: res.data.reportNum,
            },
            {
              title: '待上传养蜂信息(份)',
              amount: res.data.waitReportNum,
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
.applicationReviewPairCon {
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
.applicationReviewPairCon {
  .uploadDialog {
    .el-dialog {
      height: 500px;
    }
  }
}
</style>

<template>
  <div class="culturalDataFarmerUpload">
    <div class="innerCon">
      <div class="blockArea">
        <Blocks :array="blockArray" />
      </div>
      <div class="header-top">
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
          <el-input v-model.trim="name" placeholder="姓名"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" class="fixInput" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="type" class="fixInput" placeholder="请选择结对状态">
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>

      <div class="btnarea">
        <el-button type="primary" @click="downloadAction">导出Excel</el-button>
        <el-button type="primary" @click="batchPayment" :disabled="!multipleSelection.length">批量打款</el-button>
        <!-- <el-button type="primary" :disabled="!multipleSelection.length">批量导出</el-button> -->
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="checkselectAble"></el-table-column>
          <el-table-column prop="index" label="序号" align="center" width="60">
            <template slot-scope="scope">
              <div>{{ scope.row.userId }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="town_name" label="乡镇" align="center"></el-table-column>
          <el-table-column label="村名" prop="village_name" align="center"></el-table-column>
          <el-table-column prop="TName" label="姓名" align="center"> </el-table-column>
          <el-table-column prop="Tel" label="联系电话" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.Tel || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Address" label="家庭住址" align="center"></el-table-column>
          <!-- <el-table-column prop="type_name" label="状态" align="center">
            <template slot-scope="scope">
              <div>{{ userStatusMap[scope.row.userStatus] }}</div>
            </template>
          </el-table-column> -->
          <el-table-column label="结对状态" align="center">
            <template slot-scope="scope">
              <div>{{ matchStatusMap[scope.row.matchStatus] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="收益(元)" align="center">
            <template slot-scope="scope">
              <span @click="popBenefit(scope.row)"
                ><el-link type="primary">{{ scope.row.receiptTotal || '-' }}</el-link></span
              >
            </template>
          </el-table-column>
          <el-table-column label="工作" align="center">
            <template slot-scope="scope">
              <div @click="popWork(scope.row)">
                <el-link type="primary">{{ scope.row.workNum ? scope.row.workNum + '次' : '-' }}</el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="培训" align="center">
            <template slot-scope="scope">
              <span @click="popTrain(scope.row)">
                <el-link type="primary">{{ scope.row.trainNum ? scope.row.trainNum + scope.row.accTrainNum + '次' : '-' }}</el-link>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240">
            <template slot-scope="scope">
              <div>
 
                <el-button type="text" v-if="scope.row.farmer_id" @click="popPayment(scope.row)">打款</el-button>
                <el-button type="text" v-if="scope.row.farmer_id" @click="popDetail(scope.row)">查看详情</el-button>
                <!-- v-if="scope.row.farmer_id" -->
                <!-- v-if="scope.row.matchStatus != 2"  -->
                <el-button type="text" @click="popEdit(scope.row)">编辑</el-button>
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
    <el-dialog :close-on-click-modal="false" class="medium_dialog" title="查看汇款单" width="600px" :visible.sync="remitVisible" :close-on-press-escape="false">
      <div class="setHeight">
        <farmerRemit :data="remitData" v-if="remitVisible" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutRemit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload2Dialog" :title="showWork ? '工作' : '培训'" width="1000px" :visible.sync="tableVisible" :close-on-press-escape="false">
      <farmerWorkTable :data="currentItem" v-if="showWork && tableVisible" />
      <farmerTrainTable :data="currentItem" v-if="!showWork && tableVisible" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeTable">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload2Dialog" title="打款" width="670px" :visible.sync="paymentVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <farmerPaymentForm :multipleFlag="isMultiple" :selectId="beenSelected" @shutPayment="closePayment" v-if="paymentVisible" />
    </el-dialog>
    <el-dialog class="setMiddleDialog upload3Dialog" title="详情" width="600px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scrollCon">
        <farmerDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDetail">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload4Dialog" title="编辑" width="600px" :visible.sync="editVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <farmerEdit v-if="editVisible" :data="currentItem" @shutEdit="closeEdit" />
    </el-dialog>
  </div>
</template>
<script>
import { farmerManageList, beeFarmerManageExport, farmerManageReceipt } from '@/api/bee';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import Blocks from '../components/Blocks.vue';
import farmerRemit from './components/farmerRemit.vue';
import farmerWorkTable from './components/farmerWorkTable.vue';
import farmerTrainTable from './components/farmerTrainTable.vue';
import farmerPaymentForm from './components/farmerPaymentForm.vue';
import farmerDetail from './components/farmerDetail.vue';
import farmerEdit from './components/farmerEdit.vue';
export default {
  components: {
    Blocks,
    farmerRemit,
    farmerWorkTable,
    farmerTrainTable,
    farmerPaymentForm,
    farmerDetail,
    farmerEdit,
  },
  name: 'culturalDataFarmerUpload',
  data() {
    return {
      detailVisible: false,
      beenSelected: [],
      isMultiple: false,
      paymentVisible: false,
      showWork: true,
      tableVisible: false,
      remitVisible: false,
      blockArray: [
        {
          title: '低收入农户(户)',
          amount: '0',
        },
        {
          title: '已结对户数(户)',
          amount: '0',
        },
        {
          title: '未结对(户)',
          amount: '0',
        },
        {
          title: '转村集体(户)',
          amount: '0',
        },
        {
          title: '已退出(户)',
          amount: '0',
        },
        {
          title: '收益发放户数(户)',
          amount: '0',
        },
        {
          title: '收益发放金额(元)',
          amount: '0',
        },
        {
          title: '未打款户数(户)',
          amount: '0',
        },
      ],
      fileList: [],
      editVisible: false,
      type: '',
      name: '',
      mobile: '',
      addressOptions: [],
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      status: '',
      statusOptions: [
        {
          id: '',
          name: '状态(全部)',
        },
        {
          id: '1',
          name: '未脱贫',
        },
        {
          id: '2',
          name: '已脱贫',
        },
        {
          id: '3',
          name: '已去世',
        },
      ],
      typeOptions: [
        {
          id: '',
          name: '结对状态(全部)',
        },
        {
          id: '2',
          name: '已结对',
        },
        {
          id: null,
          name: '未结对',
        },
        {
          id: '4',
          name: '已退出',
        },
        {
          id: '5',
          name: '转村集体',
        },
      ],
      userStatusMap: {
        1: '未脱贫',
        2: '已脱贫',
        3: '已去世',
      },
      matchStatusMap: {
        2: '已结对',
        null: '未结对',
        4: '已退出',
        5: '转村集体',
      },
      options: [],
      content: '',
      town_id: '',
      tableData: [],
      loading: false,
      publishOptions: [],
      publishWithoutAllOptions: [],
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      village_id: '',
      multipleSelection: [],
      currentItem: {},
      remitData: [],
      comTableItem: [],
    };
  },
  mounted() {
    this.fetchList();
    this.fetchTown();
  },
  methods: {
    checkselectAble(row, index) {
      if (row.farmer_id) {
        return true;
      } else {
        return false;
      }
    },
    closeEdit() {
      this.editVisible = false;
      this.fetchList();
    },
    popEdit(row) {
      this.currentItem = row;
      this.editVisible = true;
    },
    popDetail(row) {
      this.currentItem = row;
      this.detailVisible = true;
    },
    closeDetail() {
      this.detailVisible = false;
    },
    batchPayment() {
      this.paymentVisible = true;
      this.beenSelected = this.multipleSelection;
      this.isMultiple = true;
    },
    popPayment(row) {
      this.paymentVisible = true;
      this.beenSelected = [row];
      this.isMultiple = false;
    },
    closePayment() {
      this.paymentVisible = false;
      this.fetchList();
    },
    closeTable() {
      this.tableVisible = false;
    },
    shutRemit() {
      this.remitVisible = false;
    },
    popBenefit(row) {
      this.currentItem = row;
      if (row.receiptTotal) {
        farmerManageReceipt({
          farmer_id: row.farmer_id,
          page: 1,
          page_size: 99999,
        })
          .then((res) => {
            if (res && res.code == 0) {
              this.remitData = res.data.data;
            }
            this.remitVisible = true;
          })
          .catch((err) => {
            console.log('err', err);
          });
      }
    },
    popWork(row) {
      this.currentItem = row;
      if (row.workNum) {
        this.tableVisible = true;
        this.showWork = true;
      }
    },
    popTrain(row) {
      this.currentItem = row;
      if (row.trainNum) {
        this.tableVisible = true;
        this.showWork = false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadAction() {
      beeFarmerManageExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化低收入农户批量导出' + Date.now() + '.xlsx';
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
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.village_id = '';
      this.town_id = '';
      this.type = '';
      this.name = '';
      this.status = '';
      this.currentPage = 1;
      this.fetchList();
    },
    fetchList() {
      farmerManageList({
        userStatus: this.status,
        matchStatus: this.type,
        village_id: this.village_id,
        town_id: this.town_id,
        name: this.name,
        page: this.currentPage,
        page_size: this.pageSize,
      }).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.blockArray = [
            {
              title: '低收入农户(户)',
              amount: res.data.userNum,
            },
            {
              title: '已结对户数(户)',
              amount: res.data.matchNum,
            },
            {
              title: '未结对(户)',
              amount: res.data.unMatchNum,
            },
            {
              title: '转村集体(户)',
              amount: res.data.matchVilNum,
            },
            {
              title: '已退出(户)',
              amount: res.data.matchEndNum,
            },
            {
              title: '收益发放户数(户)',
              amount: res.data.receiptNum,
            },
            {
              title: '收益发放金额(元)',
              amount: res.data.receiptTotal,
            },
            {
              title: '未打款户数(户)',
              amount: res.data.unRemitNum,
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
.culturalDataFarmerUpload {
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
.setHeight {
  height: 300px;
  overflow-y: scroll;
}
.scrollCon {
  height: 360px;
  overflow-y: scroll;
}
</style>
<style lang="scss">
.culturalDataFarmerUpload {
  .upload2Dialog {
    .el-dialog {
      height: 650px;
    }
  }
  .upload3Dialog {
    .el-dialog {
      height: 550px;
    }
  }
  .upload4Dialog {
    .el-dialog {
      height: 600px;
    }
  }
}
</style>

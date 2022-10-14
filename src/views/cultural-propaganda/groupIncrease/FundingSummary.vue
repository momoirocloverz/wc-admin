<template>
  <div class="FundingSummaryCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-select placeholder="乡镇" v-model="town_id" filterable @change="changeTownType(town_id)">
            <el-option v-for="item in townType" :key="item.id" :label="item.town_name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select placeholder="村名" v-model="village_id" filterable>
            <el-option v-for="item in villageType" :key="item.id" :label="item.village_name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="name" placeholder="姓名"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="mobile" placeholder="联系电话"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="idCard" placeholder="身份证"></el-input>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="tableCon">
        <div class="flexEnd">
          <el-button type="primary" @click="batchProcessing" :disabled="!multipleSelection.length">批量已汇款</el-button>
        </div>
        <el-table v-loading="loading" row-key="ID" :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange">
          <!-- :reserve-selection="true" -->
          <el-table-column type="selection" :selectable="checkselectAble"></el-table-column>
          <el-table-column prop="town_name" label="乡镇" align="center"></el-table-column>
          <el-table-column prop="village_name" label="村名" align="center"></el-table-column>
          <el-table-column label="姓名" prop="name" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"> </el-table-column>
          <el-table-column prop="identity" label="身份证号" align="center"> </el-table-column>
          <el-table-column label="投资金额" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.amount_info.total_price }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240">
            <template slot-scope="scope">
              <div>
                <el-button type="primary" size="mini" @click="checkDetail(scope.row)">查看详情</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="join_num" label="投资兴村公司" align="center">
            <template slot-scope="scope">
              <div>
                <div v-if="(scope.row.send_inv == 0 || scope.row.send_inv == 2) && scope.row.status == 2 && scope.row.send_loan == 1 && scope.row.send_subsidy == 3">
                  <el-button type="primary" size="mini" @click="popRemittance(scope.row)">汇款</el-button>
                </div>
                <div v-else>-</div>
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
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes,prev, pager, next, jumper"
          :total="total"
          class="pagination-info"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" class="medium_dialog" title="详情" width="600px" :before-close="handleCloseForEdit" :visible.sync="editVisible">
      <div>
        <div>
          <el-table :data="miniTableData1">
            <el-table-column prop="money" label="自筹资金" align="center"> </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 1">
                  <el-button type="primary" size="mini" @click="table1Confirm">确定收款</el-button>
                  <el-button type="primary" size="mini" @click="table1Reject">驳回核查</el-button>
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="middleTable">
          <el-table :data="miniTableData2">
            <el-table-column prop="money" label="贷款资金" align="center"> </el-table-column>
            <el-table-column prop="address" label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.status">确定已贷款</div>
                <div v-else>
                  <el-button type="primary" size="mini" @click="table2Confirm">已贷款</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-table :data="miniTableData3">
            <el-table-column prop="money" label="补贴资金" align="center"> </el-table-column>
            <el-table-column prop="address" label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 1">
                  <el-button type="primary" size="mini" @click="table3Confirm">确定收款</el-button>
                  <el-button type="primary" size="mini" @click="table3Reject">驳回核查</el-button>
                </div>
                <div v-else>
                  {{ scope.row.status == 2 ? '未收到' : scope.row.status == 3 ? '已收到' : '未汇款' }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="editVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { collectLists, incomeSendInv, incomeConfirmLoan, incomeConfirmCollect, incomeConfirmSubsidy } from '@/api/helpGroup';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
export default {
  name: 'fundingSummaryCon',
  data() {
    return {
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      town_id: '',
      village_id: '',
      name: '',
      mobile: '',
      idCard: '',
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      editVisible: false,
      multipleSelection: [],
      townType: [],
      villageType: [],
      miniTableData1: [
        {
          money: 0,
          status: 1,
        },
      ],
      miniTableData2: [
        {
          money: 0,
          status: 1,
        },
      ],
      miniTableData3: [
        {
          money: 0,
          status: 1,
        },
      ],
      currentTarget: {},
    };
  },
  mounted() {
    this.getTownList();
    this.fetchList();
  },
  methods: {
    getTownList() {
      TownInfo().then((res) => {
        let addressInfo = checkIdenity();
        if (addressInfo && addressInfo.town_id) {
          this.townType = res.data.filter((ele) => {
            return ele.id == addressInfo.town_id;
          });
          this.town_id = addressInfo.town_id;
          this.getVillageList(addressInfo.town_id);
        } else {
          this.townType = res.data;
        }
      });
    },
    changeTownType(e) {
      this.villageTypeValue = '';
      this.getVillageList(e);
    },
    getVillageList(e) {
      let data = {
        town_id: e,
      };
      VillageInfo(data)
        .then((res) => {
          let addressInfo = checkIdenity();
          if (addressInfo && addressInfo.village_id) {
            this.villageType = res.data.filter((ele) => {
              return ele.id == addressInfo.village_id;
            });
            this.village_id = addressInfo.village_id;
          } else {
            this.villageType = res.data;
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    table1Confirm() {
      this.$confirm('此操作将确定收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeConfirmCollect({
            id: this.currentTarget.id,
            status: 2,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                });
                this.miniTableData1[0].status = 2;
                this.$forceUpdate();
                this.fetchList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          console.log();
        });
    },
    table1Reject() {
      this.$confirm('此操作将驳回检查, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeConfirmCollect({
            id: this.currentTarget.id,
            status: 3,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                });
                this.miniTableData1[0].status = 3;
                this.$forceUpdate();
                this.fetchList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          console.log();
        });
    },
    table2Confirm() {
      this.$confirm('此操作将确认已贷款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeConfirmLoan({
            id: this.currentTarget.id,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                });
                this.miniTableData2[0].status = 1;
                this.$forceUpdate();
                this.fetchList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          console.log();
        });
    },
    table3Confirm() {
      this.$confirm('此操作将确定收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeConfirmSubsidy({
            id: this.currentTarget.id,
            confirm_status: 3,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                });
                this.miniTableData3[0].status = 3;
                this.$forceUpdate();
                this.fetchList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          console.log();
        });
    },
    table3Reject() {
      this.$confirm('此操作将驳回检查, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeConfirmSubsidy({
            id: this.currentTarget.id,
            confirm_status: 2,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                });
                this.miniTableData3[0].status = 2;
                this.$forceUpdate();
                this.fetchList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          console.log();
        });
    },
    checkDetail(row) {
      this.editVisible = true;
      this.currentTarget = row;
      this.miniTableData1 = [
        {
          money: row.amount_info.self_fund,
          status: row.status,
        },
      ];
      this.miniTableData2 = [
        {
          money: row.amount_info.bank_loan,
          status: row.send_loan,
        },
      ];
      this.miniTableData3 = [
        {
          money: row.amount_info.gov_subsidy,
          status: row.send_subsidy,
        },
      ];
    },
    popRemittance(row) {
      this.$confirm('此操作将确认此条目已汇款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeSendInv({
            id: row.id,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                });
                this.fetchList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          console.log();
        });
    },
    checkselectAble(row, index) {
      //   if (row.send_inv == 0 || row.send_inv == 2) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      if ((row.send_inv == 0 || row.send_inv == 2) && row.status == 2 && row.send_loan == 1 && row.send_subsidy == 3) {
        return true;
      } else {
        return false;
      }
    },
    batchProcessing() {
      console.log(this.multipleSelection);
      let afterData = this.multipleSelection
        .map((ele) => {
          return ele.id;
        })
        .join(',');
      this.$confirm('此操作将批量确认已汇款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let data = {
            ids: afterData,
          };
          console.log('data', data);
        })
        .catch(() => {
          console.log();
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCloseForEdit(done) {
      done();
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.town_id = '';
      this.village_id = '';
      this.name = '';
      this.mobile = '';
      this.idCard = '';
      this.currentPage = 1;
      this.fetchList();
    },
    fetchList() {
      let data = {
        page: this.currentPage,
        page_size: this.pageSize,
        identity: this.idCard,
        mobile: this.mobile,
        name: this.name,
        town_id: this.town_id,
        village_id: this.village_id,
      };
      collectLists(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.tableData = res.data.data;
            this.total = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
    handleSizeChange(e) {
      this.pageSize = e;
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
.middleTable {
  margin-top: 20px;
  margin-bottom: 20px;
}
.flexEnd {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.header-top {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.fundingSummaryCon {
  background-color: #fff;
  .innerCon {
    margin: 0 auto;
    background-color: #fff;
    box-sizing: border-box;
  }
}
.marginAddon {
  margin-right: 20px;
}
.marginBootomAddon {
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.fundingSummaryCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

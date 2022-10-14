<template>
  <div class="SettlementDividendCon">
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
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="town_name" label="乡镇" align="center"></el-table-column>
          <el-table-column label="村名" prop="village_name" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"> </el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"> </el-table-column>
          <el-table-column prop="identity" label="身份证号" align="center"> </el-table-column>
          <el-table-column prop="demand" label="补贴总额" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.amount_info.gov_subsidy + scope.row.amount_info.loan_save }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="checkDetail(scope.row)">查看详情</el-button>
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
    <el-dialog :close-on-click-modal="false" class="medium_dialog" title="详情" width="600px" :before-close="handleCloseForEdit" :visible.sync="editVisible">
      <div>
        <div>
          <el-table :data="miniTableData1">
            <el-table-column prop="money" label="补贴资金" align="center"> </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.status == 2 || scope.row.status == 0">
                    <el-button type="primary" size="mini" @click="table1Confirm">确定补贴</el-button>
                  </div>
                  <div v-else>
                    {{ scope.row.status == 1 ? '已汇款' : '已补贴' }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="middleTable">
          <el-table :data="miniTableData2">
            <el-table-column prop="money" label="贷款贴息" align="center"> </el-table-column>
            <el-table-column prop="address" label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.status == 0 || scope.row.status == 2">
                    <el-button type="primary" size="mini" @click="table2Confirm">确定补贴</el-button>
                  </div>
                  <div v-else>
                    {{ scope.row.status == 1 ? '已汇款' : '已补贴' }}
                  </div>
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
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import { saveLists, incomeSendSubsidy, incomeSendSoft } from '@/api/helpGroup';
export default {
  name: 'SettlementDividendCon',
  data() {
    return {
      townType: [],
      villageType: [],
      town_id: '',
      village_id: '',
      name: '',
      mobile: '',
      idCard: '',
      type: '',
      content: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      miniTableData1: [
        {
          money: 5000,
          status: 1,
        },
      ],
      miniTableData2: [
        {
          money: 14000,
          status: 1,
        },
      ],
      editVisible: false,
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
    // 获取乡村信息
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
    handleCloseForEdit(done) {
      done();
    },
    table1Confirm() {
      this.$confirm('此操作将补贴金额, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeSendSubsidy({
            id: this.currentTarget.id,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
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
      this.$confirm('此操作将补贴金额, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeSendSoft({
            id: this.currentTarget.id,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                });
                this.miniTableData2[0].status = 3;
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
          money: row.amount_info.gov_subsidy,
          status: row.send_subsidy,
        },
      ];
      this.miniTableData2 = [
        {
          money: row.amount_info.loan_save,
          status: row.send_save,
        },
      ];
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.currentPage = 1;
      this.town_id = '';
      this.village_id = '';
      this.name = '';
      this.mobile = '';
      this.idCard = '';
      this.fetchList();
    },
    fetchList() {
      saveLists({
        page: this.currentPage,
        page_size: this.pageSize,
        identity: this.idCard,
        mobile: this.mobile,
        name: this.name,
        town_id: this.town_id,
        village_id: this.village_id,
      })
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
.SettlementDividendCon {
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
</style>
<style lang="scss">
.SettlementDividendCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

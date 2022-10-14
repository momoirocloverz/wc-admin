<template>
  <div class="returnPrincipalCon">
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
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="identity" label="身份证号" align="center">
            <template slot-scope="scope">
              <div class="">{{ scope.row.identity }}</div>
            </template>
          </el-table-column>
          <el-table-column label="投资本金" align="center">
            <template slot-scope="scope">
              <div class="">{{ scope.row.amount_info.self_fund }}</div>
            </template>
          </el-table-column>
          <el-table-column label="本次分红" align="center">
            <template slot-scope="scope">
              <div class="">{{ scope.row.settle_amount }}</div>
            </template>
          </el-table-column>
          <el-table-column label="累计分红" align="center">
            <template slot-scope="scope">
              <div class="">{{ scope.row.sum_profit }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="退出金额" align="center">
            <template slot-scope="scope">
              <div class="">{{ scope.row.identity }}</div>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" align="center">
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
            <el-table-column prop="money" label="退还本金" align="center"> </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="!scope.row.status">
                  <el-button type="primary" size="mini" @click="table1Confirm">确认退还</el-button>
                </div>
                <div v-else>已退还</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="middleTable">
          <el-table :data="miniTableData2">
            <el-table-column prop="money" label="本次分红" align="center">
              <template slot-scope="scope">
                <div v-if="!scope.row.status">
                  <el-input-number
                    v-model="scope.row.num"
                    placeholder="请输入"
                    @change="inputChange(scope.row.num)"
                    controls-position="right"
                    :precision="2"
                    :step="0.1"
                    :max="99999999"
                  ></el-input-number>
                </div>
                <div v-else>
                  {{ scope.row.money }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="!scope.row.status">
                  <el-button type="primary" size="mini" @click="table2Confirm">分红</el-button>
                </div>
                <div v-else>已分红</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-table :data="miniTableData3">
            <el-table-column prop="money" label="累计分红" align="center"></el-table-column>
            <el-table-column prop="address" label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <!-- <el-button type="primary" size="mini" @click="table3Confirm"
                    >已分红</el-button
                  > -->
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
import { refundLists, incomeRefund, sendFund } from '@/api/helpGroup';
export default {
  name: 'returnPrincipalCon',
  data() {
    return {
      townType: [],
      villageType: [],
      major_name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      town_id: '',
      village_id: '',
      name: '',
      mobile: '',
      idCard: '',
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
      editVisible: false,
      initSum: 0,
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
    inputChange(value) {
      if (!isNaN(+value)) {
        let initValue = this.initSum;
        let inputValue = +initValue + +value;
        let fix = (Math.round(inputValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
        this.miniTableData3[0].money = +fix;
      }
      this.$forceUpdate();
    },
    handleCloseForEdit(done) {
      done();
    },
    table1Confirm() {
      this.$confirm('此操作将退还金额, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          sendFund({
            id: this.currentTarget.id,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
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
    table2Confirm() {
      if (!this.miniTableData2[0].num) {
        this.$message.error('本次分红不能为空或0');
      } else {
        this.$confirm('此操作将分红, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let data = {
              id: this.currentTarget.id,
              after_tax_amount: this.miniTableData2[0].num,
              //   sum_profit: this.miniTableData3[0].money
            };
            incomeRefund(data)
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!',
                  });
                  //   this.miniTableData2[0].status = 2;
                  refundLists({
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
                        let track = this.tableData.find((ele) => {
                          return ele.id == this.currentTarget.id;
                        });
                        this.miniTableData2 = [
                          {
                            money: track.settle_amount,
                            status: track.is_settle,
                          },
                        ];
                        this.miniTableData3 = [
                          {
                            money: track.sum_profit,
                            status: 1,
                          },
                        ];
                        this.$forceUpdate();
                      } else {
                        this.$message.error(res.msg);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch(() => {
            console.log();
          });
      }
    },
    table3Confirm() {
      if (!this.miniTableData2[0].num) {
        this.$message.error('本次分红不能为空或0');
      } else {
        this.$confirm('此操作将分红, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          })
          .catch(() => {
            console.log();
          });
      }
    },
    checkDetail(row) {
      this.miniTableData1 = [
        {
          money: row.amount_info.self_fund,
          status: row.send_fund,
        },
      ];
      this.miniTableData2 = [
        {
          money: row.settle_amount,
          status: row.is_settle,
        },
      ];
      this.miniTableData3 = [
        {
          money: row.sum_profit,
          status: 1,
        },
      ];
      this.currentTarget = row;
      this.initSum = row.sum_profit;
      this.editVisible = true;
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
      refundLists({
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
  margin-bottom: 20px;
  margin-top: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.returnPrincipalCon {
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
.marginAddon {
  margin-right: 20px;
}
.marginBootomAddon {
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.returnPrincipalCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

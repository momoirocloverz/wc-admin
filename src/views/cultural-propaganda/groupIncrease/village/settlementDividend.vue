<template>
  <div class="villageSettlementDividendCon">
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
          <el-button type="primary" @click="batchProcessing" :disabled="!multipleSelection.length">批量已分红</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" :selectable="checkselectAble"></el-table-column>
          <el-table-column prop="town_name" label="乡镇" align="center"></el-table-column>
          <el-table-column label="村名" prop="village_name" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"> </el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"> </el-table-column>
          <el-table-column prop="identity" label="身份证号" align="center"> </el-table-column>
          <el-table-column label="分红金额" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.amount_info && scope.row.amount_info.share_amount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.send_share == 0 || scope.row.send_share == 2">
                <el-button type="primary" size="mini" @click="popRemittance(scope.row)">确认分红</el-button>
              </div>
              <div v-else>-</div>
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
import { shareLists, incomeSendShare } from '@/api/helpGroup';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
export default {
  name: 'villageSettlementDividendCon',
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
      multipleSelection: [],
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
    popRemittance(row) {
      this.$confirm('此操作将确认此条目已分红, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeSendShare({
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkselectAble(row, index) {
      //   return true;
      if (row.send_share == 0 || row.send_share == 2) {
        return true;
      } else {
        return false;
      }
    },
    batchProcessing() {
      let afterData = this.multipleSelection
        .map((ele) => {
          return ele.id;
        })
        .join(',');
      this.$confirm('此操作将批量已分红, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeSendShare({
            id: afterData,
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
      shareLists({
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
.flexEnd {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
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
.villageSettlementDividendCon {
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
.tableCon {
}
</style>

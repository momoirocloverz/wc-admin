<template>
  <div class="exitReviewCon">
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
          <el-table-column prop="identity" label="身份证号" align="center"></el-table-column>
          <el-table-column label="申请状态" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.status == 1 ? '审批中' : scope.row.status == 0 ? '未申请' : scope.row.status == 2 ? '已通过' : '未通过' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退出状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.drop_status == 1 ? '审批中' : scope.row.drop_status == 0 ? '未退出' : scope.row.drop_status == 2 ? '已退出' : '已拒绝' }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" align="center" width="280">
            <template slot-scope="scope">
              <div v-if="scope.row.drop_status == 1 || scope.row.drop_status == 0">
                <el-button type="primary" size="mini" v-if="scope.row.drop_status == 1" @click="agreeItem(scope.row)">同意</el-button>
                <el-button type="primary" size="mini" v-if="scope.row.drop_status == 1" @click="rejectItem(scope.row)">拒绝</el-button>
                <el-button type="primary" v-if="scope.row.drop_status == 0" size="mini" @click="cancelItem(scope.row)">移除</el-button>
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
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import { dropLists, incomeAuditExit, incomeCancel } from '@/api/helpGroup';
export default {
  name: 'exitReviewCon',
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
    agreeItem(item) {
      this.$confirm('此操作将同意此条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeAuditExit({
            id: item.id,
            drop_status: 2,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
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
    rejectItem(item) {
      this.$confirm('此操作将拒绝此条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeAuditExit({
            id: item.id,
            drop_status: 3,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
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
    cancelItem(item) {
      this.$confirm('此操作将取消此条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          incomeCancel({
            id: item.id,
          })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '取消成功!',
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
      dropLists({
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
.exitReviewCon {
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
.exitReviewCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

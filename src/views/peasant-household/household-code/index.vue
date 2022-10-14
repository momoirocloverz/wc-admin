<template>
  <div class="small-code">
    <div class="small-code-top">
      <div class="small-top-left">
        <el-select v-model="town_value" placeholder="请选择乡镇" @change="changeTown" class="search-model" :clearable="true">
          <el-option v-for="item in town_list" :key="item.id" :label="item.town_name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="village_value" placeholder="请选择行政村" class="search-model" :clearable="true">
          <el-option v-for="item in village_list" :key="item.id" :label="item.village_name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="send_status" placeholder="请选择发放状态" class="search-model" :clearable="true">
          <el-option label="已发放" :value="1"></el-option>
          <el-option label="未发放" :value="0"></el-option>
        </el-select>
        <el-input placeholder="请输入姓名或户号" v-model="host" class="search-model"></el-input>
      </div>
      <div>
        <el-button type="primary" @click="searchInfo">搜索</el-button>
        <el-button @click="otherPrev">批量预览</el-button>
        <el-button @click="exportOther">批量导出</el-button>
      </div>
    </div>
    <el-table :data="tableData" class="table-info">
      <el-table-column prop="ID" label="编号" align="center"></el-table-column>
      <el-table-column prop="lb_name" label="人员类别" align="center"></el-table-column>
      <el-table-column prop="GX" label="关系" align="center"></el-table-column>
      <el-table-column prop="HBH" label="户号" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.HBH">
            {{ scope.row.HBH.slice(0, 8) + '****' + scope.row.HBH.slice(13, 18) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="TName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="SEX" label="性别" align="center"></el-table-column>
      <el-table-column prop="Card" label="身份证号" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Card">
            {{ scope.row.Card.slice(0, 8) + '****' + scope.row.Card.slice(13, 18) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="BZRS" label="保障人数" align="center"></el-table-column>
      <el-table-column prop="town_name" label="乡镇" align="center"></el-table-column>
      <el-table-column prop="village_name" label="行政村" align="center"></el-table-column>
      <el-table-column prop="ZT" label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ZT == 1 ? '未脱贫' : scope.row.ZT == 2 ? '已脱贫' : '已注销' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="IS_PROVIDE" label="发放" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.IS_PROVIDE == 0 ? '未发放' : '已发放' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="provide_at" label="发放时间" align="center"></el-table-column>
      <el-table-column prop="PROVIDE_NUM" label="发放次数" align="center"></el-table-column>
      <el-table-column prop="Content" label="备注" width="120" align="center"></el-table-column>
      <el-table-column label="管理操作">
        <template slot-scope="scope">
          <div class="manage-info">
            <el-button type="text" @click="exportCode(scope)">导出</el-button>
            <el-button type="text" @click="prevCode(scope)">预览</el-button>
            <el-button type="text" @click="remarkInfo(scope)">备注</el-button>
            <el-button type="text" @click="deleteInfo(scope)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination-info"></el-pagination>
    <!-- 备注 -->
    <el-dialog :visible="remarkVisible" title="备注" center width="30%" @close="cancelRemark">
      <div class="remark">
        <div class="remark-top">
          <label class="remark-label">备注：</label>
          <el-input type="textarea" v-model="remark" rows="4" placeholder="请输入备注信息"></el-input>
        </div>
        <div class="remark-bottom">
          <el-button type="primary" @click="btnokRemark">确定</el-button>
          <el-button @click="cancelRemark">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 组件 -->
    <many-export
      :dialogData="dialogData"
      @close="handleCloseDialog"
      @exportPrev="handleExportPrev"
      @aginAdd="handleAginAdd"
      @cancelExport="handleCancelExport"
      @confirmExport="handleExportAction"
      v-if="dialogData.visible"
    ></many-export>
  </div>
</template>
<script>
import { ListCode, DeleteCode, EditCode, ExportSmallCode, batchExportCode } from '@/api/smallCode';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import ManyExport from '@/components/many-export';
export default {
  name: 'household',
  data() {
    return {
      xkmVisible: false,
      xkm_id: '',
      remark: '',
      remarkVisible: false,
      town_value: '',
      town_list: [],
      village_value: '',
      village_list: [],
      send_status: '',
      host: '',
      page: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      scope: '',
      row: '',
      dialogData: {
        visible: false,
        title: '批量导出',
        width: '80%',
        status: 1,
      },
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  created() {
    this.getSmallCodeList();
    this.getTownListInfo();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    handleCancelExport() {
      this.dialogData.visible = false;
    },
    handleExportAction(val) {
      this.dialogData.visible = false;
      if (val.length) {
        const KungLao = val
          .map((ele) => {
            return ele.ID;
          })
          .join(',');
        let token = sessionStorage.getItem('token');
        const Raiden = { ids: KungLao, Authorization: token };
        batchExportCode(Raiden)
          .then((res) => {
            if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = '小康码批量导出' + Date.now() + '.docx';
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
      } else {
        this.$message({
          message: '没有选中的条目',
        });
      }
    },
    handleAginAdd() {
      this.dialogData = {
        visible: true,
        title: '批量导出',
        width: '80%',
        status: 1,
      };
    },
    handleExportPrev() {
      this.dialogData = {
        title: '导出名单预览',
        visible: true,
        width: '80%',
        status: 2,
      };
    },
    handleCloseDialog() {
      this.dialogData.visible = false;
    },
    // 批量导出
    exportOther() {
      this.dialogData = {
        visible: true,
        title: '批量导出',
        width: '80%',
        status: 1,
      };
    },
    // 预览
    prevCode(scope) {
      this.$router.push({
        name: 'householdInformationonePrev',
        query: {
          id: scope.row.ID,
          address: scope.row.Address,
          card: scope.row.Card,
          name: scope.row.TName,
          isprint: 'false',
        },
      });
    },
    closeXkmVisible() {
      this.xkmVisible = false;
    },
    exportCode(scope) {
      const KungLao = scope.row.ID;
      let token = sessionStorage.getItem('token');
      const Raiden = { ids: KungLao, Authorization: token };
      batchExportCode(Raiden)
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '小康码批量导出' + Date.now() + '.docx';
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
    // 备注按钮
    remarkInfo(scope) {
      this.scope = scope;
      this.remarkVisible = true;
      this.remark = scope.row.Content;
    },
    // 确定
    btnokRemark() {
      let data = {
        ID: this.scope.row.ID,
        Content: this.remark,
      };
      EditCode(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功');
          this.remarkVisible = false;
          this.remark = '';
          this.getSmallCodeList();
        }
      });
    },
    // 取消
    cancelRemark() {
      this.remark = '';
      this.remarkVisible = false;
    },
    // 删除
    deleteInfo(scope) {
      this.$confirm('您确定要删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let data = {
          ID: scope.row.ID,
        };
        DeleteCode(data).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.getSmallCodeList();
          }
        });
      });
    },
    // 批量预览
    otherPrev() {
      this.$router.push({
        name: 'householdInformationprevCode',
      });
    },
    searchInfo() {
      this.page = 1;
      this.getSmallCodeList();
    },
    changeTown(e) {
      this.getVillageListInfo(e);
    },
    // 获取城镇信息
    getTownListInfo() {
      TownInfo().then((res) => {
        if (res.code === 0) {
          let addressInfo = checkIdenity();
          if (addressInfo && addressInfo.town_id) {
            this.town_list = res.data.filter((ele) => {
              return ele.id == addressInfo.town_id;
            });
            this.town_value = addressInfo.town_id;
            this.getVillageListInfo(addressInfo.town_id);
          } else {
            this.town_list = res.data;
          }
        }
      });
    },
    // 获取行政村信息
    getVillageListInfo(town_id) {
      let data = {
        town_id,
      };
      VillageInfo(data).then((res) => {
        if (res.code == 0) {
          let addressInfo = checkIdenity();
          if (addressInfo && addressInfo.village_id) {
            this.village_list = res.data.filter((ele) => {
              return ele.id == addressInfo.village_id;
            });
            if (this.town_value) {
              this.village_value = addressInfo.village_id;
            }
          } else {
            this.village_list = res.data;
          }
        }
      });
    },
    getSmallCodeList() {
      let data = {
        page: this.page,
        page_size: this.pageSize,
        town_id: this.town_value ? this.town_value : undefined,
        village_id: this.village_value ? this.village_value : undefined,
        is_provide: this.send_status,
        keyword: this.host,
      };
      ListCode(data).then((res) => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    async handleCurrentChange(e) {
      this.page = e;
      this.getSmallCodeList();
    },
  },
  components: {
    ManyExport,
  },
};
</script>
<style lang="scss" scoped>
.small-code {
  width: 98%;
  margin: 15px 0px 0px 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .small-code-top {
    width: 94%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 20px;
    margin: 0px 2%;
    .small-top-left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .search-model {
    width: 200px;
    margin-right: 20px;
  }
  .table-info {
    width: 94%;
    margin: 20px 2%;
  }
}
.manage-info {
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.manage-info .el-button + .el-button {
  margin-left: 0px;
}
.pagination-info {
  width: 98%;
  margin: 0px 2% 20px 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.el-form-item__content {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.remark {
  width: 100%;
  display: flex;
  flex-direction: column;
  .remark-top {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    .remark-label {
      width: 60px;
      text-align: right;
    }
  }
  .remark-bottom {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
.xkm-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.xkm-ewm {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .xkm-code-bg {
    width: 80%;
    margin: 20px auto;
  }
  .xkm-id-info {
    width: 140px;
    height: 140px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -70px;
    margin-left: -70px;
  }
  .xkm-address {
    position: absolute;
    top: 68%;
    left: 18%;
    display: flex;
    flex-direction: column;
    color: #000;
    font-size: 18px;
    line-height: 30px;
  }
}
</style>

<template>
  <div class="root">
    <div class="toolbar">
      <div class="filters">
        <el-input
          v-model="filter.searchKeyword"
          class="text-search"
          label="关键字"
          placeholder="搜索身份证号码"
          maxlength="18"
          prefix-icon="el-icon-search"
          clearable
          @change="handleFilterChange"
        />
        <el-date-picker
          v-model="filter.date"
          type="month"
          :clearable="false"
          @change="handleFilterChange"
        />
        <el-select
          v-model="filter.town"
          style="width: 14ch"
          @change="handleTownSelectionChange"
        >
          <el-option key="0" value="0" label="所有乡镇" />
          <el-option
            v-for="div in adminDivisions"
            :key="div.id"
            :value="div.name"
            :label="div.name"
          />
        </el-select>
        <el-select
          v-model="filter.village"
          style="width: 14ch"
          @change="handleFilterChange"
        >
          <el-option key="0" value="0" label="所有行政村" />
          <el-option
            v-for="div in findIdxByParentName(filter.town) > -1
              ? adminDivisions[findIdxByParentName(filter.town)].children
              : []"
            :key="div.id"
            :value="div.name"
            :label="div.name"
          />
        </el-select>
      </div>
    </div>
    <el-table
      ref="table"
      v-loading="isLoading"
      element-loading-text="读取中..."
      class="data-table"
      :data="tableData"
      size="small"
      @selection-change="handleSelectionChange"
      style="margin-top:20px;"
    >
      <!--      <el-table-column-->
      <!--        type="selection"-->
      <!--        width="55"-->
      <!--      />-->
      <el-table-column
        type="index"
        align="center"
        label="序号"
        :index="calcIndex"
      />
      <el-table-column property="name" align="center" label="补助人姓名">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleNameClick(scope.row.id, scope.row.name)"
            >{{ scope.row.name }}</el-button
          >
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        property="gender"-->
      <!--        label="性别"-->
      <!--      />-->
      <el-table-column property="id" align="center" label="身份证号" />
      <el-table-column property="town" align="center" label="所属乡镇" />
      <el-table-column property="village" align="center" label="所属乡社" />
      <el-table-column
        property="cardHolderName"
        align="center"
        label="持卡人姓名"
      />
      <el-table-column
        property="cardHolderId"
        align="center"
        label="持卡人身份证号"
      />
      <el-table-column
        property="cardHolderCreditCard"
        align="center"
        label="持卡人银行卡号"
      />
      <el-table-column
        property="bankCode"
        align="center"
        label="发放银行代码"
      />
      <el-table-column
        property="bankName"
        align="center"
        label="发放银行名称"
      />
      <el-table-column property="programName" align="center" label="项目名称" />
      <el-table-column property="year" align="center" label="补助年份" />
      <el-table-column property="month" align="center" label="补助月份" />
      <el-table-column property="amount" align="center" label="发放金额" />
      <el-table-column
        property="transactionStatus"
        align="center"
        label="支付结果"
      >
        <template slot-scope="scope">
          {{ getPaymentStatusString(scope.row.transactionStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        property="transactionDate"
        align="center"
        label="支付时间"
      />
      <el-table-column
        property="postingDate"
        align="center"
        label="发送银行时间"
      />
    </el-table>
    <el-pagination
      background
      layout="->, total, prev, pager, next, jumper"
      :current-page="filter.pageNum"
      :total="rowCount"
      :page-size="filter.pageSize"
      @current-change="handlePageChange"
    />
    <full-profile-view
      :uid="profileView.id"
      :visible.sync="profileView.visible"
      :modal-title="profileView.name"
    />
  </div>
</template>

<script>
// import './scrollOverride.css'
import { getFundingDataForOfficeOfBudget } from "@/api/fundings";
import { getListOfTowns, getListOfVillages } from "@/api/pairings";
import { undefinedCheck } from "@/utils/validate";
import FullProfileView from "@/components/full-profile-view";
import { PAYMENT_STATUS } from "@/utils/const";

export default {
  components: { FullProfileView },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      adminDivisions: [],
      filter: {
        searchKeyword: "",
        date: "",
        town: "0",
        village: "0",
        pageNum: 1,
        pageSize: 20
      },
      rowCount: 0,
      isLoading: false,
      profileView: {
        visible: false,
        id: "",
        name: ""
      }
    };
  },
  computed: {},
  async mounted() {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.filter.date = date;
    this.destroy();
    this.loadData();
    this.loadAdminDivision();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem("isRefresh");
      sessionStorage.removeItem("childRouterQuery");
    },
    async loadData() {
      this.isLoading = true;
      try {
        const result = (
          await getFundingDataForOfficeOfBudget(
            this.filter.searchKeyword,
            this.filter.date,
            undefinedCheck(this.filter.town),
            undefinedCheck(this.filter.village),
            this.filter.pageNum,
            this.filter.pageSize
          )
        ).data;

        const transformed = [];
        result.data.forEach(row => {
          transformed.push({
            rowId: row.id,
            name: row.bzrxm,
            // gender: row.???,
            id: row.bzrsfz,
            town: row.bzrxz,
            village: row.bzrcs,
            cardHolderName: row.ckrxm,
            cardHolderId: row.ckrsfz,
            cardHolderCreditCard: row.ckryhkh,
            bankCode: row.ckryhzhdm,
            bankName: row.ckryhzhmc,
            programName: row.xmmc,
            year: row.bznd,
            month: row.bzyf,
            amount: row.ffje,
            transactionStatus: row.zfjg,
            transactionDate: row.sj,
            postingDate: row.fsyhrq
          });
        });
        this.tableData = transformed;
        this.rowCount = result.total;
      } catch (e) {
        this.$message({
          message: `读取数据失败: ${e.message}`,
          type: "error"
        });
      }
      this.isLoading = false;
    },
    async loadAdminDivision() {
      try {
        const result = await getListOfTowns();
        const transformed = [];
        result.data.forEach(row => {
          transformed.push({ id: row.id, name: row.town_name, children: [] });
        });
        this.adminDivisions = transformed;
      } catch (e) {
        this.$message({
          message: `行政区域读取数据失败: ${e.message}`,
          type: "error"
        });
      }
    },
    calcIndex(index) {
      return (
        parseInt(index) + this.filter.pageSize * (this.filter.pageNum - 1) + 1
      );
    },
    handleFilterChange() {
      this.filter.pageNum = 1;
      this.loadData();
    },
    handlePageChange(e) {
      this.filter.pageNum = e;
      this.loadData();
    },
    findIdxByParentName(name) {
      return this.adminDivisions.map(e => e.name).indexOf(name);
    },
    async handleTownSelectionChange(value) {
      this.filter.village = "0";
      try {
        if (value !== "0") {
          const idx = this.findIdxByParentName(value);
          const result = await getListOfVillages(this.adminDivisions[idx].id);
          const transformed = [];
          result.data.forEach(row => {
            transformed.push({ id: row.id, name: row.village_name });
          });
          this.adminDivisions[idx].children = transformed;
        }
        this.handleFilterChange();
      } catch (e) {
        this.$message({
          message: `行政区域读取数据失败: ${e.message}`,
          type: "error"
        });
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleNameClick(id, name) {
      this.profileView = {
        visible: true,
        id,
        name
      };
    },
    getPaymentStatusString(code) {
      return PAYMENT_STATUS[code] ?? "未知";
    }
  }
};
</script>

<style scoped>
.root {
  padding: 20px;
  background-color: white;
  margin-top: 15px;
}
.text-search {
  width: 30ch;
}
.toolbar {
  display: flex;
}
.filters {
  margin: 0 1ch;
  display: flex;
  flex-flow: row wrap;
  column-gap: 1ch;
}
</style>

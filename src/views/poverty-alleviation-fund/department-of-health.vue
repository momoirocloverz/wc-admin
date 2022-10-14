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
      ref="multipleTable"
      v-loading="isLoading"
      class="data-table"
      :data="tableData"
      size="small"
      style="margin-top:20px;"
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column-->
      <!--        type="selection"-->
      <!--        width="55"-->
      <!--      />-->
      <el-table-column
        type="index"
        align="center"
        :index="calcIndex"
        label="序号"
      />
      <el-table-column property="name" label="姓名" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleNameClick(scope.row.id, scope.row.name)"
            >{{ scope.row.name }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column property="id" align="center" label="身份证号" />
      <el-table-column
        property="gender"
        label="性别"
        width="50"
        align="center"
      />
      <el-table-column property="age" align="center" label="年龄" />
      <el-table-column property="phoneNumber" label="联系电话" align="center" />
      <el-table-column property="address" align="center" label="家庭住址" />
      <el-table-column property="medicalId" align="center" label="就诊卡号" />
      <el-table-column property="date" align="center" label="就诊日期" />
      <el-table-column
        property="diagnosis"
        label="就诊诊断"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="departmentCode"
        align="center"
        label="科室代码"
      />
      <el-table-column
        property="departmentName"
        align="center"
        label="科室名称"
      />
      <el-table-column property="claimType" align="center" label="费用类别" />
      <el-table-column property="claimDesc" align="center" label="费用性质" />
      <el-table-column property="billed" align="center" label="就诊费用总金" />
      <el-table-column property="actualPaid" align="center" label="自付金额" />
      <el-table-column
        property="reimbursement"
        align="center"
        label="报销金额"
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
import { getFundingDataForDepartmentOfHealth } from "@/api/fundings";
import { getListOfTowns, getListOfVillages } from "@/api/pairings";
import { undefinedCheck } from "@/utils/validate";
import FullProfileView from "@/components/full-profile-view";

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
          await getFundingDataForDepartmentOfHealth(
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
            rowId: row.ID,
            name: row.XM,
            id: row.SFZH,
            gender: row.XB,
            age: row.NL,
            phoneNumber: row.LXDH,
            address: row.JTZZ,
            medicalId: row.JZKH,
            date: row.JZRQ,
            diagnosis: row.ZD,
            departmentCode: row.KSDM,
            departmentName: row.KSMC,
            claimType: row.FYLB,
            claimDesc: row.FYXZ,
            billed: row.FYZJE,
            actualPaid: row.ZFJE,
            reimbursement: row.BXJE
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

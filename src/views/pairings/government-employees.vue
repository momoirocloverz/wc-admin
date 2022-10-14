<template>
  <div class="root">
    <div class="toolbar">
      <div class="filters">
        <el-input v-model="filter.searchKeyword" class="text-search" label="关键字" placeholder="搜索身份证号码或姓名" maxlength="18" prefix-icon="el-icon-search" clearable @change="loadData" />
        <el-select v-model="filter.group" style="width: 160px" @change="handleFilterChange">
          <el-option key="0" value="0" label="所有人员类别" />
          <el-option key="1" value="1" label="低保救助" />
          <el-option key="2" value="2" label="低保边缘救助" />
          <el-option key="3" value="3" label="特困救助" />
          <el-option key="4" value="4" label="残疾人" />
        </el-select>
        <el-select v-model="filter.town" style="width: 160px" @change="handleTownSelectionChange">
          <el-option key="0" value="0" label="所有乡镇" />
          <el-option v-for="div in adminDivisions" :key="div.id" :value="div.id" :label="div.name" />
        </el-select>
        <el-select v-model="filter.village" style="width: 160px" @change="handleFilterChange">
          <el-option key="0" value="0" label="所有行政村" />
          <el-option v-for="div in findIdxByParentId(filter.town) > -1 ? adminDivisions[findIdxByParentId(filter.town)].children : []" :key="div.id" :value="div.id" :label="div.name" />
        </el-select>
        <el-select v-model="filter.paired" style="width: 100px" @change="handleFilterChange">
          <el-option key="1" value="1" label="已配对" />
          <el-option key="2" value="2" label="未配对" />
        </el-select>
      </div>
      <div class="toolbar-actions">
        <CreateOfficialPairing />
        <ImportPairings :context="ACTION_CONTEXT.GOVERNMENT_EMPLOYEE" />

        <el-button disabled>数据统计(暂未开放)</el-button>
      </div>
    </div>
    <el-table v-loading="isLoading" element-loading-text="读取中..." :data="tableData" size="small" style="margin-top: 20px">
      <!--      <el-table-column-->
      <!--        type="selection"-->
      <!--        width="55"-->
      <!--      />-->
      <el-table-column property="group" align="center" label="人员类别">
        <template slot-scope="{ row }">
          {{ getGroupName(row.group) }}
        </template>
      </el-table-column>
      <el-table-column property="name" align="center" label="姓名" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="handleNameClick(scope.row.id, scope.row.name)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column property="id" label="身份证号" align="center" width="180" />
      <el-table-column property="town" align="center" label="乡镇" />
      <el-table-column property="village" align="center" label="行政村" />
      <el-table-column property="householdMembers" label="人数" align="center" width="50" />
      <el-table-column property="officialTitle" align="center" label="结对单位" />
      <el-table-column property="officialName" align="center" label="结对干部" />
      <el-table-column property="officialNumber" align="center" label="干部电话" />
      <el-table-column property="visits" align="center" label="随访次数" width="80" />
      <el-table-column property="dateOfLastVisit" align="center" label="上次随访时间" />
      <el-table-column property="dateOfNextVisit" align="center" label="下次随访时间" />
      <el-table-column label="随访记录" align="center" width="80">
        <template slot-scope="{ row }">
          <ViewVisitDetails :id="row.id" :rid="row.rowId" :name="row.name" :context="ACTION_CONTEXT.GOVERNMENT_EMPLOYEE" />
        </template>
      </el-table-column>
      <el-table-column property="status" align="center" label="状态">
        <template slot-scope="{ row }">
          {{ getStatusString(row.status) }}
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        label="管理操作"-->
      <!--      />-->
    </el-table>
    <el-pagination background layout="->, total, prev, pager, next, jumper" :current-page="filter.pageNum" :total="rowCount" :page-size="filter.pageSize" @current-change="handlePageChange" />
    <full-profile-view :uid="profileView.id" :visible.sync="profileView.visible" :modal-title="profileView.name" />
  </div>
</template>

<script>
import ViewVisitDetails from '@/components/view-visit-details';
import ImportPairings from '@/components/import-pairings';
import CreateOfficialPairing from '@/components/create-official-pairing';
import { ACTION_CONTEXT, GROUP_NAMES, POVERTY_STATUS } from '@/utils/const';
import { getGovEmployeePairingData, getListOfTowns, getListOfVillages } from '@/api/pairings';
import { undefinedCheck } from '@/utils/validate';
import FullProfileView from '@/components/full-profile-view';

export default {
  components: {
    ImportPairings,
    ViewVisitDetails,
    CreateOfficialPairing,
    FullProfileView,
  },
  data() {
    return {
      tableData: [],
      adminDivisions: [],
      filter: {
        searchKeyword: '',
        group: '0',
        town: '0',
        village: '0',
        paired: '1',
        pageNum: 1,
        pageSize: 20,
      },
      rowCount: 0,
      isLoading: false,
      profileView: {
        visible: false,
        id: '',
        name: '',
      },
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  computed: {
    ACTION_CONTEXT() {
      return ACTION_CONTEXT;
    },
  },
  async mounted() {
    this.loadData();
    this.loadAdminDivision();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    async loadData() {
      this.isLoading = true;
      try {
        const result = (
          await getGovEmployeePairingData(
            undefinedCheck(this.filter.group),
            this.filter.searchKeyword,
            undefinedCheck(this.filter.town),
            undefinedCheck(this.filter.village),
            this.filter.paired,
            this.filter.pageNum,
            this.filter.pageSize,
          )
        ).data;
        const transformed = [];
        result.data.forEach((row) => {
          transformed.push({
            rowId: row.ID,
            group: row.LB,
            name: row.TName,
            id: row.Card,
            town: row.town_name,
            village: row.village_name,
            householdMembers: row.BZRS,
            officialTitle: row.JDDW,
            officialName: row.JDGB,
            officialNumber: row.JDGBtel,
            visits: row.visit_count,
            dateOfLastVisit: row.last_visit_at,
            dateOfNextVisit: row.next_visit_at,
            status: row.ZT,
          });
        });
        this.tableData = transformed;
        this.rowCount = result.total;
      } catch (e) {
        this.$message({
          message: `读取数据失败: ${e.message}`,
          type: 'error',
        });
      }
      this.isLoading = false;
    },
    async loadAdminDivision() {
      try {
        const result = await getListOfTowns();
        const transformed = [];
        result.data.forEach((row) => {
          transformed.push({ id: row.id, name: row.town_name, children: [] });
        });
        this.adminDivisions = transformed;
      } catch (e) {
        this.$message({
          message: `行政区域读取数据失败: ${e.message}`,
          type: 'error',
        });
      }
    },
    handleFilterChange() {
      this.filter.pageNum = 1;
      this.loadData();
    },
    handlePageChange(e) {
      this.filter.pageNum = e;
      this.loadData();
    },
    findIdxByParentId(id) {
      return this.adminDivisions.map((e) => e.id).indexOf(id);
    },
    async handleTownSelectionChange(townId) {
      this.filter.village = '0';
      try {
        if (townId !== '0') {
          const result = await getListOfVillages(townId);
          const transformed = [];
          result.data.forEach((row) => {
            transformed.push({ id: row.id, name: row.village_name });
          });
          this.adminDivisions[this.findIdxByParentId(townId)].children = transformed;
        }
        this.handleFilterChange();
      } catch (e) {
        this.$message({
          message: `行政区域读取数据失败: ${e.message}`,
          type: 'error',
        });
      }
    },
    getGroupName(id) {
      return GROUP_NAMES[id];
    },
    getStatusString(id) {
      return POVERTY_STATUS[id];
    },
    handleNameClick(id, name) {
      this.profileView = {
        visible: true,
        id,
        name,
      };
    },
  },
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
.toolbar-actions {
  margin-left: auto;
}
</style>

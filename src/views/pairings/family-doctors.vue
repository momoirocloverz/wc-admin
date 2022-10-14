<template>
  <div class="root">
    <div class="toolbar">
      <!--            <label>关键字:-->
      <!--              <input v-model="filter.searchKeyword" maxLength="30" class="text-search" @change="loadData">-->
      <!--            </label>-->
      <div class="filters">
        <el-input
          v-model="filter.searchKeyword"
          class="text-search"
          label="关键字"
          placeholder="搜索身份证号码或姓名"
          maxlength="18"
          prefix-icon="el-icon-search"
          clearable
          @change="handleFilterChange"
        />
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
        <CreateDoctorPairing />
        <ImportPairings :context="ACTION_CONTEXT.DOCTOR" />
        <el-button disabled>数据统计(暂未开放)</el-button>
      </div>
    </div>
    <el-table v-loading="isLoading" element-loading-text="读取中..." :data="tableData" size="small" style="margin-top: 20px">
      <!--      <el-table-column-->
      <!--        type="selection"-->
      <!--        width="55"-->
      <!--      />-->
      <el-table-column label="人员类别">
        <template slot-scope="{ row }">
          {{ getGroupName(row.group) }}
        </template>
      </el-table-column>
      <el-table-column property="name" label="姓名" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="handleNameClick(scope.row.id, scope.row.name)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column property="relationship" label="关系" width="80" />
      <el-table-column property="id" label="身份证号" width="180" />
      <el-table-column property="phoneNumber" label="电话号码" />
      <el-table-column property="town" label="乡镇" />
      <el-table-column property="village" label="行政村" />
      <el-table-column property="doctorName" label="签约医生" />
      <el-table-column property="doctorPhoneNumber" label="医生电话" />
      <el-table-column property="visits" label="随访次数" width="80" />
      <el-table-column label="随访记录" width="80">
        <template slot-scope="{ row }">
          <ViewVisitDetails :id="row.id" :rid="row.rowId" :name="row.name" :context="ACTION_CONTEXT.DOCTOR" />
        </template>
      </el-table-column>
      <el-table-column property="status" label="状态">
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
import CreateDoctorPairing from '@/components/create-doctor-pairing';
import ImportPairings from '@/components/import-pairings';
import { ACTION_CONTEXT, GROUP_NAMES, POVERTY_STATUS } from '@/utils/const';
import { getDoctorPairingData, getListOfTowns, getListOfVillages } from '@/api/pairings';
import { undefinedCheck } from '@/utils/validate';
import FullProfileView from '@/components/full-profile-view';

export default {
  components: {
    ViewVisitDetails,
    CreateDoctorPairing,
    ImportPairings,
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
          await getDoctorPairingData(
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
            group: row.LB,
            name: row.TName,
            relationship: row.GX,
            id: row.Card,
            rowId: row.ID,
            phoneNumber: row.Tel,
            town: row.town_name,
            village: row.village_name,
            doctorName: row.QYYS,
            doctorPhoneNumber: row.QYYSTel,
            visits: row.visit_count,
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
.toolbar-actions {
  margin-left: auto;
}
.filters {
  margin: 0 1ch;
  display: flex;
  flex-flow: row wrap;
  column-gap: 1ch;
}
</style>

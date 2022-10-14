<template>
  <div class="commonCon1">
    <div>
      <el-table :data="matchData" height="430">
        <el-table-column prop="name" label="养殖大户" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.company_name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="工作内容" align="center"></el-table-column>
        <el-table-column prop="mobile" label="工作日期" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.start_time }}-{{ scope.row.end_time }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="工作时段" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.work_time }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="工作地点" align="center"></el-table-column>
        <el-table-column prop="demand" label="工作要求" align="center"></el-table-column>
        <el-table-column prop="salary" label="薪资(天)" align="center"></el-table-column>
      </el-table>
      <!-- <div class="pagination-footer">
        <el-pagination
          @current-change="handleCurrent2Change"
          :current-page.sync="currentPage2"
          :page-size="pageSize2"
          layout="prev, pager, next, jumper"
          :total="total2"
          class="pagination-info"
        ></el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
import { farmerManageWorkInfo } from '@/api/bee';
export default {
  components: {},
  name: 'applicaCon',
  props: {
    data: {},
  },
  data() {
    return {
      currentPage2: 1,
      pageSize2: 10,
      total2: 0,
      info: {},
      matchData: [],
    };
  },
  mounted() {
    this.info = this.data;
    this.fetchMatchTable();
  },
  methods: {
    fetchMatchTable() {
      farmerManageWorkInfo({
        farmer_id: this.info.farmer_id,
      }).then((res) => {
        if (res && res.code === 0) {
          this.matchData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleCurrent2Change(e) {
      this.currentPage2 = e;
      //   this.fetchMatchTable();
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
.commonCon1 {
  background-color: #fff;
}
</style>

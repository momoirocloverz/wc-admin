<template>
  <div class="commonCon1">
    <div>
      <el-table :data="matchData" height="430">
        <el-table-column label="养殖大户" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.company_name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="培训内容" align="center"></el-table-column>
        <el-table-column prop="start_time" label="培训日期" align="center"></el-table-column>
        <el-table-column prop="address" label="工作地点" align="center"></el-table-column>
      </el-table>
      <!-- <div class="pagination-footer">
        <el-pagination
          @current-change="handleCurrent2Change"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
          class="pagination-info"
        ></el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
import { farmerManageTrainInfo } from '@/api/bee';
export default {
  name: 'applicaCon',
  props: {
    data: {},
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
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
      farmerManageTrainInfo({
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
      this.fetchMatchTable();
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(index, item) {
      this.options.initialViewIndex = index;
      this.images = item;
      setTimeout(() => {
        this.$viewer.show();
      }, 400);
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
  .flexStart {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .flexBetween {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }
  .ml20 {
    margin-left: 20px;
  }
  .divide {
    width: 33%;
  }
  .distribute {
    width: 50%;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .flexStart {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
  }
  .padLeft10 {
    padding-left: 10%;
  }
  .padRight10 {
    padding-right: 10px;
  }
  .flexEnd {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
  }
  .idListItem {
    img {
      width: 80px;
      height: 80px;
      cursor: pointer;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .itemTitle {
    font-weight: 500;
    width: 100px;
  }
}
</style>

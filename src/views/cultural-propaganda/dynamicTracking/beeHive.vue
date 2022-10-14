<template>
  <div class="dynamicTrackingBeeHiveCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input v-model="major_name" placeholder="发布单位"></el-input>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="major_name" label="发布单位" align="center"></el-table-column>
          <el-table-column label="低收入农户" prop="farmer_name" align="center"></el-table-column>
          <el-table-column prop="hive_no" label="蜂箱号" align="center"> </el-table-column>
          <el-table-column label="蜂箱位置" align="center">
            <template slot-scope="scope">
              <div>经度：{{ scope.row.lon }} 纬度：{{ scope.row.lat }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="蜂箱照片" align="center">
            <template slot-scope="scope">
              <div class="image_box">
                <preview-image :src="scope.row.img_url ? scope.row.img_url[0] : ''" :src-list="scope.row.img_url ? scope.row.img_url : []" />
                <span>{{ '共' + (scope.row.img_url ? scope.row.img_url.length : 0) + '张' }}</span>
              </div>
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
import { beeHiveLists } from '@/api/bee';
import previewImage from '@/components/previewImage/index';
export default {
  components: {
    previewImage,
  },
  name: 'dynamicTrackingBeeHiveCon',
  data() {
    return {
      major_name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.major_name = '';
      this.currentPage = 1;
      this.fetchList();
    },
    fetchList() {
      beeHiveLists({
        major_name: this.major_name,
        page: this.currentPage,
        page_size: this.pageSize,
      }).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
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
.tabContainer {
  width: 95%;
  padding-top: 20px;
  box-sizing: border-box;
  margin: 0 auto;
}
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
.dynamicTrackingBeeHiveCon {
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
.fixInput {
  width: 100%;
}
.marginBootomAddon {
  margin-bottom: 20px;
}
.btnarea {
  margin-bottom: 20px;
}
.tableCon {
}
</style>
<style lang="scss">
.dynamicTrackingBeeHiveCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

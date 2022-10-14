<template>
  <div class="userListCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input placeholder="真实姓名" v-model.trim="real_name"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select
            class="fixInput"
            v-model="searchType"
            placeholder="请输入用户角色"
          >
            <el-option
              v-for="item in publishOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input placeholder="昵称" v-model.trim="nickname"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input placeholder="手机号" v-model.trim="mobile"></el-input>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData" width="100%">
          <el-table-column
            label="用户角色"
            prop="user_type"
            align="center"
          ></el-table-column>
          <el-table-column
            label="联系电话"
            prop="mobile"
            align="center"
          ></el-table-column>
          <el-table-column
            label="	昵称"
            prop="nickname"
            align="center"
          ></el-table-column>
          <el-table-column
            label="真实姓名"
            prop="real_name"
            align="center"
          ></el-table-column>
          <el-table-column label="	头像" prop="avatar_image" align="center">
            <template slot-scope="scope">
              <div class="image_box">
                <preview-image
                  :src="
                    scope.row.avatar_image
                      ? scope.row.avatar_image
                      : ' https://img.hzanchu.com/acimg/108236e176d5c0bc24d4515136126dcb.png'
                  "
                  :src-list="
                    scope.row.avatar_image
                      ? [scope.row.avatar_image]
                      : [
                          'https://img.hzanchu.com/acimg/108236e176d5c0bc24d4515136126dcb.png',
                        ]
                  "
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="	身份证号"
            prop="id_card"
            align="center"
          ></el-table-column>
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
import previewImage from "@/components/previewImage/index";

import { customerList } from "@/api/user";
export default {
  name: "userListCon",
  components: {
    previewImage,
  },
  data() {
    return {
      publishOptions: [
        { id: "1", name: "村集体" },
        { id: "2", name: "养殖大户" },
        { id: "3", name: "普通用户" },
      ],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchType: "",
      tableData: [],
      loading: false,
      mobile: "",
      real_name: "",
      nickname: "",
    };
  },
  mounted() {
    this.destroy();
    this.fetchList();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem("isRefresh");
      sessionStorage.removeItem("childRouterQuery");
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
    resetSearch() {
      this.searchType = "";
      this.mobile = "";
      this.real_name = "";
      this.nickname = "";
      this.currentPage = 1;
      this.fetchList();
    },
    fetchList() {
      customerList({
        user_type: this.searchType,
        nickname: this.nickname,
        mobile: this.mobile,
        real_name: this.real_name,
        page: this.currentPage,
        page_size: this.pageSize,
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
  },
};
</script>
<style lang="scss" scoped>
.image_box {
  width: 50px;
  margin: 0 auto;
}
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.tableCon {
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
.userListCon {
  padding: 10px;
  .innerCon {
    width: 98%;
    margin: 0 auto;
    margin-top: 15px;
    background-color: #fff;
    padding: 30px;
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
  .topLeft {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>

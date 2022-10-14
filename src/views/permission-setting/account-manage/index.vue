<template>
  <div class="role-manage">
    <div class="role-header">
      <div class="role-header-left">
        <label class="role-header-label">用户名：</label>
        <el-input
          type="text"
          v-model="userName"
          placeholder="请输入用户名"
          clearable
          class="role-input"
          @clear="resetListInfo"
        ></el-input>
        <el-button class="role-reset" @click="resetListInfo">重置</el-button>
        <el-button type="primary" @click="searchListInfo">搜索</el-button>
      </div>
    </div>
    <!-- 新建角色 -->
    <div class="role-create">
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="addUser()"
        v-if="option.includes(57)"
        >新建用户</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table class="role-table" :data="userTable">
      <el-table-column
        label="序号"
        prop="id"
        width="70"
        align="center"
      ></el-table-column>
      <el-table-column
        label="角色"
        prop="role_name"
        align="center"
      ></el-table-column>
      <el-table-column
        label="用户名"
        prop="username"
        align="center"
      ></el-table-column>
      <el-table-column
        label="真实姓名"
        prop="real_name"
        align="center"
      ></el-table-column>
      <el-table-column
        label="状态"
        prop="cn_status"
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="created_at"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="role-button"
            @click="editUser(scope)"
            v-if="option.includes(58) && scope.row.id != 1"
            >编辑</el-button
          >
          <el-button
            type="text"
            class="role-button"
            @click="deleteUser(scope)"
            v-if="option.includes(59) && scope.row.id != 1"
            >删除</el-button
          >
          <!-- 0是启用2是禁用 -->
          <el-button
            type="text"
            class="role-button"
            v-if="
              scope.row.status == 0 && option.includes(60) && scope.row.id != 1
            "
            @click="disableUser(scope)"
            >禁用</el-button
          >
          <el-button
            type="text"
            class="role-button"
            v-if="
              scope.row.status == 2 && option.includes(60) && scope.row.id != 1
            "
            @click="disableUser(scope)"
            >启用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="role-pagination"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total"
      v-if="total > 10"
    >
    </el-pagination>
    <!-- 弹框 -->
    <form-dialog
      :visible="visible"
      :title="title"
      :width="width"
      :isAdd="isAdd"
      :scope="scope"
      @clickCancel="handleCancel"
      @hideAccountOption="handleAccount"
      ref="formdialog"
      @addSuccess="addSuccess"
      @cancel="cancelChoose"
      v-if="visible"
    ></form-dialog>
  </div>
</template>
<script>
import FormDialog from "@/components/role-component/form-submit";
import {
  getAccountList,
  disableUser,
  deleteUserInfo,
  zzdAccessToken,
  zzdTicket,
} from "@/api/account";
import dd from "gdt-jsapi";
export default {
  name: "accountmanage",
  data() {
    return {
      visible: false,
      title: "新增用户",
      width: "35%",
      userName: "",
      userTable: [],
      page: 1,
      pageSize: 10,
      total: 0,
      isAdd: true,
      scope: "",
      option:
        this.$store.getters.option.length !== 0
          ? this.$store.getters.option
          : JSON.parse(sessionStorage.getItem("option"))
          ? JSON.parse(sessionStorage.getItem("option"))
          : [],
    };
  },
  created() {
    this.getAccountListInfo();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem("isRefresh");
      sessionStorage.removeItem("childRouterQuery");
    },
    // 删除用户
    deleteUser(scope) {
      this.$confirm("您确定要删除该用户?", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        let data = {
          admin_id: scope.row.id,
        };
        deleteUserInfo(data).then((res) => {
          if (res.code === 0) {
            this.$message.success("删除成功");
            this.getAccountListInfo();
          }
        });
      });
    },
    // 禁用用户
    disableUser(scope) {
      let ableText = "禁用";
      if (scope.row.status) {
        ableText = "启用";
      } else {
        ableText = "禁用";
      }
      this.$confirm(`您确定要${ableText}该用户?`, {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        let data = {
          admin_id: scope.row.id,
          status: scope.row.status == 0 ? 2 : 0,
        };
        disableUser(data).then((res) => {
          if (res.code == 0) {
            this.$message.success(
              scope.row.status == 0 ? "禁用成功" : "启用成功"
            );
            this.getAccountListInfo();
          }
        });
      });
    },
    // 添加编辑成功
    handleAccount() {
      this.visible = false;
      this.getAccountListInfo();
    },
    resetListInfo() {
      this.userName = "";
      this.searchListInfo();
    },
    searchListInfo() {
      this.page = 1;
      this.getAccountListInfo();
    },
    getAccountListInfo() {
      let data = {
        page: this.page,
        page_size: this.pageSize,
        username: this.userName,
      };
      getAccountList(data).then((res) => {
        if (res.code === 0) {
          this.userTable = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getAccountListInfo();
    },
    // 取消选中
    cancelChoose() {
      this.visible = false;
    },
    // 这里点击新建用户
    addUser() {
      dd.getAuthCode({})
        .then((res) => {
          // 如果浙政钉环境下，开始选取人员
          this.getAccessToken();
        })
        .catch(() => {
          this.visible = true;
          this.isAdd = true;
          this.scope = "";
          this.title = "新增用户";
        });
    },
    // 新建用户回调
    addSuccess() {
      this.cancelChoose();
      this.searchListInfo();
    },
    handleCancel() {
      this.visible = false;
    },
    editUser(scope) {
      this.visible = true;
      this.isAdd = false;
      this.scope = scope;
      this.title = "编辑用户";
    },
    // 获取accessToken
    getAccessToken() {
      zzdAccessToken({}).then((res) => {
        if (res.code == 0 && res.data.success && res.data.content.success) {
          this.getTicket(res.data.content.data.accessToken);
        }
      });
    },
    //获取tikcet
    getTicket(access_token) {
      zzdTicket({ access_token }).then((res) => {
        this.getContact(res.data.content.data.accessToken);
      });
    },
    // 获取组织
    getContact(ticket) {
      dd.authConfig({
        ticket,
        jsApiList: ["chooseContactWithComplexPicker"],
      })
        .then((res1) => {
          dd.chooseContactWithComplexPicker({
            panelTypes: 1,
            responseUserOnly: true,
          })
            .then((res) => {
              if (res.users && res.users.length > 0) {
                this.visible = true;
                this.isAdd = true;
                this.scope = "";
                this.title = "新增用户";
                setTimeout(() => {
                  this.$refs.formdialog.dealContact(res);
                }, 250);
              }
            })
            .catch((err) => {});
        })
        .catch((err1) => {});
    },
  },
  components: {
    FormDialog,
  },
};
</script>
<style lang="scss" scoped>
.role-manage {
  width: 98%;
  margin: 15px auto 0px auto;
  background: #fff;
  padding-bottom: 30px;
  .role-header {
    width: 95%;
    display: flex;
    flex-direction: row;
    margin: 0px auto;
  }
  .role-header-left {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
  }
  .role-header-label {
    width: 90px;
    font-weight: normal;
  }
  .role-input {
    width: 300px;
  }
  .role-reset {
    margin-left: 10px;
  }
  .role-create {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 20px;
    margin-right: 20px;
  }
  .role-table {
    width: 95%;
    margin: 20px auto 0px auto;
  }
  .role-button {
    margin: 0px 5px;
  }
  .role-pagination {
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>

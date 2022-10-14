<template>
  <div class="role-manage">
    <div class="role-header">
      <div class="role-header-left">
        <label class="role-header-label">角色名称：</label>
        <el-input type="text" v-model="roleName" placeholder="请输入角色名称" clearable class="role-input" @clear="resetRoleList"></el-input>
        <el-button class="role-reset" @click="resetRoleList">重置</el-button>
        <el-button type="primary" @click="searchRoleList">搜索</el-button>
      </div>
    </div>
    <!-- 新建角色 -->
    <div class="role-create">
      <el-button icon="el-icon-plus" type="primary" @click="createRole(1)" v-if="option.includes(53)">新建角色</el-button>
    </div>
    <!-- 表格 -->
    <el-table class="role-table" :data="roleTable">
      <el-table-column label="角色ID" prop="role_id" width="70" align="center"></el-table-column>
      <el-table-column label="角色名称" prop="name" align="center"></el-table-column>
      <el-table-column label="角色描述" prop="comment" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" class="role-button" @click="createRole(3, scope)" v-if="option.includes(54)">详情</el-button>
          <el-button type="text" class="role-button" @click="createRole(2, scope)" v-if="option.includes(56)">编辑</el-button>
          <el-button type="text" class="role-button" @click="deleteRole(scope)" v-if="option.includes(55)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="role-pagination" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" v-if="total > 10">
    </el-pagination>
  </div>
</template>
<script>
import { getRoleManageList, deleteRoleInfo, deleteBtnOkInfo } from '@/api/role';
export default {
  name: 'rolemanage',
  data() {
    return {
      roleName: '',
      roleTable: [],
      total: 0,
      page: 1,
      pageSize: 10,
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  created() {
    this.getRoleListInfo();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    resetRoleList() {
      this.roleName = '';
      this.searchRoleList();
    },
    searchRoleList() {
      this.page = 1;
      this.getRoleListInfo();
    },
    getRoleListInfo() {
      let data = {
        name: this.roleName,
        page: this.page,
        page_size: this.pageSize,
      };
      getRoleManageList(data).then((res) => {
        if (res.code === 0) {
          this.roleTable = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    // 删除角色
    deleteRole(scope) {
      let data = {
        role_id: scope.row.role_id,
      };
      deleteBtnOkInfo(data).then((res) => {
        if (res.code == 0) {
          this.$confirm(`该角色下有${res.data.num}个账号，若删除角色，则账号一同删除`, {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning',
          }).then(() => {
            let data = {
              role_id: scope.row.role_id,
            };
            deleteRoleInfo(data).then((res) => {
              if (res.code === 0) {
                this.$message.success('删除成功');
                this.getRoleListInfo();
              }
            });
          });
        }
      });
    },
    // 新建页面
    createRole(type, scope) {
      if (scope) {
        this.$router.push({
          name: 'permissioncreate-update-role',
          query: {
            type,
            id: scope.row.role_id,
          },
        });
      } else {
        this.$router.push({
          name: 'permissioncreate-update-role',
          query: {
            type,
          },
        });
      }
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getRoleListInfo();
    },
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

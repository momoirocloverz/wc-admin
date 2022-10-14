<template>
  <div class="paired-infomation">
    <div class="paired-header">
      <div class="paired-header-left">
        <el-input placeholder="请输入用户姓名和户号" type="text" v-model="userName" class="paired-ipt"></el-input>
        <el-button type="primary" class="paired-search" @click="searchUser">搜索</el-button>
      </div>
      <div class="paired-header-right">
        <div class="basic-infoma" >
          <el-button class="paired-import">批量导入</el-button>
          <el-upload class="basic-upload" :action="fileAction" :headers="headers" accept="application/ms-excel" name="file" :on-success="uploadFile">批量导入</el-upload>
        </div>

        <el-button type="primary" @click="addPairedInfo" >新增干部档案</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" class="table-info">
      <el-table-column label="序号" prop="id" width="70"></el-table-column>
      <el-table-column label="干部姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="所属单位" prop="dept" align="center"></el-table-column>
      <el-table-column label="干部电话" prop="tel" align="center"></el-table-column>
      <el-table-column label="结对人数" prop="user_num" align="center"></el-table-column>
      <el-table-column label="共计随访次数" prop="visit_num" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="lookPairedInfo(scope)" >查看</el-button>
          <el-button type="text" @click="editPairedInfo(scope)" >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="role-pagination" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" layout="prev, pager, next, jumper" v-show="total > 10" :total="total">
    </el-pagination>
    <!-- 弹框 -->
    <look-component :dialogData="dialogData" @closeDialogInfo="handleCloseDialog" @closeDialogInfo1="handleCloseDialog1" v-if="dialogData.visible" />
  </div>
</template>
<script>
import LookComponent from '@/components/paired-component/paired-submit';
import { getDoctorOrPariedList } from '@/api/pairedOrDoctor';
export default {
  name: 'pairedinfomation',
  data() {
    return {
      userName: '',
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      dialogData: {
        visible: false,
        title: '新增干部档案',
        width: '35%',
        status: 2,
        isAdd: true,
      },
      fileAction: '/web/assist/importGB',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  created() {
    this.getPairedList();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    uploadFile(res) {
      if (res.code === 0) {
        this.$message.success('导入成功');
        this.page = 1;
        this.getPairedList();
      }
    },
    searchUser() {
      this.page = 1;
      this.getPairedList();
    },
    getPairedList() {
      let data = {
        page: this.page,
        page_size: this.pageSize,
        user_name: this.userName,
        type: 1,
      };
      getDoctorOrPariedList(data).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    lookPairedInfo(scope) {
      this.$router.push({
        name: 'householdInformationlookPaired',
        query: {
          name: scope.row.name,
          dept: scope.row.dept,
        },
      });
    },
    addPairedInfo() {
      this.dialogData = {
        visible: true,
        title: '新增干部档案',
        width: '35%',
        status: 2,
        isAdd: true,
      };
    },
    editPairedInfo(scope) {
      this.dialogData = {
        visible: true,
        title: '编辑干部档案',
        width: '35%',
        status: 2,
        isAdd: false,
        data: scope,
      };
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getPairedList();
    },
    handleCloseDialog() {
      this.dialogData.visible = false;
    },
    handleCloseDialog1() {
      this.dialogData.visible = false;
      this.getPairedList();
    },
  },
  components: {
    LookComponent,
  },
};
</script>
<style lang="scss" scoped>
.paired-infomation {
  width: 98%;
  margin: 15px 0px 0px 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  .paired-header {
    width: 95%;
    display: flex;
    flex-direction: row;
    margin: 20px auto 0px auto;
    justify-content: space-between;
  }
  .paired-header-left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .paired-ipt {
    width: 260px;
  }
  .paired-search {
    margin-left: 20px;
  }
  .paired-header-right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .paired-import {
    margin-right: 10px;
  }
  .table-info {
    width: 95%;
    margin: 40px auto 0px auto;
  }
  .role-pagination {
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
.basic-infoma {
  position: relative;
  overflow: hidden;
  margin-left: 15px;
}
.basic-upload {
  width: 100px;
  height: 38px;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0;
}
</style>
<style lang="scss">
.basic-upload {
  .el-upload {
    width: 100%;
    height: 38px;
  }
}
</style>

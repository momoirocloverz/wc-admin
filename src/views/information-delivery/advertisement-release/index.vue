<template>
  <div class="advertisement">
    <div class="advertise-admin">
      <div class="advertise-btn">
        <div class="advertise-left">
          <span>广告名称：</span>
          <el-input type="text" placeholder="请输入广告名称" v-model="adverName" style="width: 200px"></el-input>
          <el-button type="primary" class="adver-search" @click="handleSearch">搜索</el-button>
        </div>
        <el-button type="primary" class="advertise-button" @click="dialogTrueVisible">新建广告</el-button>
      </div>
      <el-table class="advertise-table" :data="adverData">
        <el-table-column label="ID" prop="id" align="center" width="50"></el-table-column>
        <el-table-column label="广告名称" prop="title" align="center"></el-table-column>
        <el-table-column label="广告图片" prop="image" align="center" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.image" class="adver-pic" />
          </template>
        </el-table-column>
        <el-table-column label="广告类型" prop="type_name" align="center"></el-table-column>
        <el-table-column label="跳转路径" prop="redirect_url" align="center"></el-table-column>
        <el-table-column label="开关" prop="is_open_value" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_open_value" @change="changeSwitch(scope)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="released_at" align="center" width="200"></el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center" width="200"></el-table-column>
        <el-table-column label="更新时间" prop="updated_at" align="center" width="200"></el-table-column>
        <el-table-column label="创建人员" prop="admin_name" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editAdvertise(scope)">编辑</el-button>
            <el-button type="text" @click="deleteAdvertise(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        class="pagination-info"
        v-show="total > 10"
      >
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible="dialogVisible" width="40%" @close="closeDialog">
      <el-form :rules="dialogRule" :model="dialogForm" ref="dialogRule" label-width="100px">
        <el-form-item label="广告名称：" prop="name" class="el-form-flex">
          <el-input v-model="dialogForm.name" placeholder="请输入广告名称" class="el-flex-ipt"></el-input>
        </el-form-item>
        <el-form-item label="广告类型：" prop="type" class="el-form-flex">
          <el-select v-model="dialogForm.type" placeholder="请选择广告类型" class="el-flex-ipt">
            <el-option v-for="(item, index) in advertiseType" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转链接：" prop="goto" class="el-form-flex">
          <el-input v-model="dialogForm.goto" placeholder="请输入跳转链接" class="el-flex-ipt"></el-input>
        </el-form-item>
        <el-form-item label="发布时间：" prop="publicTime" class="el-form-flex">
          <el-date-picker v-model="dialogForm.publicTime" type="datetime" placeholder="请选择发布日期" class="el-flex-ipt"> </el-date-picker>
        </el-form-item>
        <el-form-item label="封面图片：" prop="cover" class="el-form-flex">
          <el-upload
            :class="['avatar-uploader', { disUoloadSty: noneBtnImg }]"
            :action="action"
            :headers="headers"
            ref="upload"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :on-success="successFile"
            :on-remove="handleRemoveFile"
            :limit="1"
            accept="image/*"
            :multiple="false"
          >
            <img v-if="dialogForm.cover" :src="dialogForm.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传1张jpg/png/gif图片,且大小不超过50M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态：" prop="status" class="el-form-flex">
          <div class="el-flex-ipt">
            <el-switch v-model="dialogForm.status"></el-switch>
          </div>
        </el-form-item>
        <el-form-item class="el-form-btn">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="handleSubmit('dialogRule')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { Button, Table, Switch, Dialog, Form, FormItem, Input, Select, DatePicker, Upload, Pagination } from 'element-ui';
import { ListInfo, AddInfo, EditInfo, DeleteInfo } from '@/api/information';
import moment from 'moment';
export default {
  name: 'advertise-release',
  data() {
    return {
      action: '/web/public/upload',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      adverName: '',
      adverData: [],
      dialogTitle: '新建',
      dialogVisible: false,
      dialogForm: {
        name: '',
        type: '',
        goto: '',
        publicTime: '',
        cover: '',
        coverId: '',
        status: false,
      },
      dialogRule: {
        name: [
          {
            required: true,
            message: '请输入广告名称',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择广告类型',
          },
        ],
        goto: [
          {
            required: true,
            message: '请输入跳转链接',
          },
        ],
        publicTime: [
          {
            required: true,
            message: '请选择发布时间',
          },
        ],
        cover: [
          {
            required: true,
            message: '请选择封面图',
          },
        ],
      },
      advertiseType: [
        {
          label: '顶部轮播',
          value: 1,
        },
      ],
      page: 1,
      pageSize: 10,
      total: 0,
      add: true,
      imageUrl: '',
      noneBtnImg: false,
      adverId: 0,
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  created() {
    this.getAdvertiseList();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    // 关闭按钮
    closeDialog() {
      this.dialogVisible = false;
      this.dialogForm = {
        name: '',
        type: '',
        goto: '',
        publicTime: '',
        cover: '',
        coverId: '',
        status: false,
      };
      this.$refs['dialogRule'].resetFields();
    },
    //   提交按钮
    handleSubmit(dialogRule) {
      this.$refs[dialogRule].validate((valid) => {
        if (valid) {
          // 成功
          let data = {
            title: this.dialogForm.name,
            type: this.dialogForm.type.toString(),
            released_at: moment(this.dialogForm.publicTime).format('YYYY-MM-DD HH:mm:ss'),
            image_id: this.dialogForm.coverId.toString(),
            redirect_url: this.dialogForm.goto,
            is_open: this.dialogForm.status ? 1 : 0,
          };
          if (this.add) {
            AddInfo(data).then((res) => {
              if (res.code == 0) {
                this.$message.success('添加成功');
              }
            });
          } else {
            EditInfo({ id: this.adverId, ...data }).then((res) => {
              if (res.code == 0) {
                this.$message.success('编辑成功');
              }
            });
          }
          this.dialogVisible = false;
          this.dialogForm = {
            name: '',
            type: '',
            goto: '',
            publicTime: '',
            cover: '',
            coverId: '',
            status: false,
          };
          this.$refs[dialogRule].resetFields();
          this.$refs['upload'].clearFiles();
          this.getAdvertiseList();
          this.noneBtnImg = false;
        }
      });
    },
    //   删除上传
    handleRemoveFile() {
      this.noneBtnImg = false;
    },
    //   上传成功
    successFile(res) {
      this.dialogForm.cover = res.data.url;
      this.dialogForm.coverId = res.data.id;
      this.noneBtnImg = true;
    },
    // 图片上传
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        alert('上传文件大小不能超过 50MB');
        return false;
      }
    },
    // 搜索
    handleSearch() {
      this.page = 1;
      this.getAdvertiseList();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getAdvertiseList();
    },
    getAdvertiseList() {
      let data = {
        title: this.adverName ? this.adverName : undefined,
        page: this.page,
        page_size: this.pageSize,
      };
      ListInfo(data).then((res) => {
        res.data.data.map((item) => {
          item.is_open_value = item.is_open == 0 ? false : true;
        });
        this.adverData = res.data.data;
        this.total = res.data.total;
      });
    },
    changeSwitch(scope) {
      // this.adverData[scope.$index].switch=!this.adverData[scope.$index].switch;
      let data = {
        id: scope.row.id,
        title: scope.row.title,
        type: scope.row.type.toString(),
        released_at: scope.row.created_at,
        image_id: scope.row.image_id.toString(),
        redirect_url: scope.row.redirect_url,
        is_open: scope.row.is_open == 1 ? 0 : 1,
      };
      EditInfo(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功');
          this.getAdvertiseList();
        }
      });
    },
    dialogTrueVisible() {
      this.dialogVisible = true;
      this.add = true;
      console.log(this.dialogForm);
    },
    editAdvertise(scope) {
      this.add = false;
      this.dialogForm = {
        name: scope.row.title,
        type: scope.row.type,
        goto: scope.row.redirect_url,
        publicTime: scope.row.created_at,
        cover: scope.row.image,
        coverId: scope.row.image_id,
        status: scope.row.is_open_value,
      };
      this.dialogVisible = true;
      this.adverId = scope.row.id;
    },
    // 删除
    deleteAdvertise(scope) {
      this.$confirm('您确定要删除该条消息?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      }).then(() => {
        let data = {
          id: scope.row.id,
        };
        DeleteInfo(data).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.getAdvertiseList();
          }
        });
      });
    },
  },
};
</script>
<style lang="scss">
.advertisement {
  width: 98%;
  margin: 15px auto 0px auto;
  background: #fff;
  padding-top: 30px;
  box-sizing: border-box;
  padding-bottom: 30px;
  .advertise-admin {
    width: 98%;
    margin: 0px auto;
    .advertise-btn {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .advertise-button {
      width: 120px;
      margin-top: 20px;
    }
  }
  .advertise-table {
    width: 95%;
    margin: 20px auto 0px auto;
  }
  .adver-pic {
    width: 100%;
  }
}
.el-form-flex {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.el-flex-ipt {
  width: 400px;
}
.el-form-item__content {
  line-height: 20px;
  //   margin-left: 0px !important;
}
.el-form-btn {
  width: 300px;
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.pagination-info {
  width: 98%;
  margin: 20px 2% 0px 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.advertise-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 2%;
}
.adver-search {
  margin-left: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-upload--picture-card {
  width: 178px;
  height: 178px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 178px;
  height: 178px;
}
.disUoloadSty .el-upload--picture-card {
  display: none;
}
</style>

<template>
  <div class="framer-suggestion">
    <div class="framer-header">
      <div class="framer-header-left">
        <label class="header-label">关键字：</label>
        <el-input type="text" placeholder="请输入要搜索的关键字" class="framer-search" v-model="keyword" />
        <el-button class="framer-button" type="primary" @click="searchPage">搜索</el-button>
      </div>
      <div class="framer-header-right">
        <el-button @click="addPageInfo">新增文章</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" class="suggestion-table">
      <el-table-column label="序号" prop="id" width="70"></el-table-column>
      <el-table-column label="文章类别" prop="type_name" align="center"> </el-table-column>
      <el-table-column label="标题" prop="title" align="center">
        <template slot-scope="scope">
          <span class="suggestion-link" @click="lookRichTitle(scope)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" prop="user_name" align="center"></el-table-column>
      <el-table-column label="发表时间" prop="created_at" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updated_at" align="center"></el-table-column>
      <el-table-column label="点击" prop="click_num" align="center"></el-table-column>
      <el-table-column label="管理操作" align="center">
        <template slot-scope="scope">
          <span class="manage-span">
            [
            <em class="suggest-has" @click="handleAudit(scope, 0)" v-if="scope.row.is_audit == 1">已审</em>
            <em class="suggest-em" @click="handleAudit(scope, 1)" v-else>待审</em>
            ]
          </span>
          <span class="manage-span">[<em class="suggest-update-delete" @click="updateSuggest(scope)">修改</em>]</span>
          <span class="manage-span">[<em class="suggest-update-delete" @click="deletePage(scope)">删除</em>]</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination-info" v-show="total > 10">
    </el-pagination>
    <!-- 组件 -->
    <el-dialog :visible="dialogData.visible" :title="dialogData.title" :width="dialogData.width" @opened="showEditor()" @close="closeDialog">
      <el-form :model="formData" :rules="formRules" ref="formData" label-width="100px">
        <el-form-item label="文章标题：" prop="title">
          <el-input placeholder="请输入文章标题" v-model="formData.title" class="select-page"></el-input>
        </el-form-item>
        <el-form-item label="文章类别：" prop="type">
          <el-select v-model="formData.type" placeholder="请选择文章类别" class="select-page">
            <el-option v-for="item in pageTypeList1" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容：" prop="content">
          <div id="editor" ref="editorElem"></div>
        </el-form-item>
        <el-form-item label="审核：" prop="audit">
          <el-radio v-model="formData.audit" :label="1">是</el-radio>
          <el-radio v-model="formData.audit" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="发布人：" prop="person">
          <el-input type="text" placeholder="请输入发布人" v-model="formData.person" class="select-page" />
        </el-form-item>
        <el-form-item label="发布时间：" prop="timeInfo">
          <el-date-picker type="datetime" placeholder="选择发布时间" v-model="formData.timeInfo" value-format="yyyy-MM-dd HH-mm-ss" class="select-page"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('formData')">确定</el-button>
          <el-button @click="closeVisible('formData')">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 富文本 -->
    <rich-release :richData="richData" v-if="richData.visible" @cancelRich="handleCancel"></rich-release>
  </div>
</template>
<script>
import E from 'wangeditor';
import { ListInfo, AddInfo, EditInfo, DeleteInfo } from '@/api/alleviation';
import RichRelease from '@/components/release-component';
export default {
  name: 'framersuggestions',
  data() {
    return {
      keyword: '',
      page: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      dialogData: {
        visible: false,
        width: '80%',
        title: '发布文章',
      },
      pageTypeList1: [
        {
          label: '农户建议',
          value: 4,
        },
      ],
      formData: {
        title: '',
        type: '',
        audit: 0,
        content: '',
        person: '',
        timeInfo: '',
      },
      formRules: {
        title: [
          {
            required: true,
            message: '请输入文章标题',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择文章类型',
          },
        ],
        audit: [
          {
            required: true,
            message: '请选择是否审核',
          },
        ],
        person: [
          {
            required: true,
            message: '请输入发布人信息',
          },
        ],
        content: [
          {
            required: true,
            message: '请输入富文本框内容',
          },
        ],
        timeInfo: [
          {
            required: true,
            message: '请选择发布时间',
          },
        ],
      },
      editor: null,
      richData: {
        visible: false,
        width: '80%',
        title: '富文本内容',
        data: '',
      },
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  created() {
    this.getPageList();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    // 删除文章
    deletePage(scope) {
      this.$confirm('您确定要删除该篇文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let data = {
          id: scope.row.id,
        };
        DeleteInfo(data).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.getPageList();
          }
        });
      });
    },
    // 取消审核
    handleAudit(scope, audit) {
      let data = scope.row;
      let datas = {
        title: data.title,
        type: data.type,
        content: data.content,
        released_at: data.released_at,
        is_audit: audit,
        user_name: data.user_name,
        id: data.id,
      };
      EditInfo(datas).then((res) => {
        if (res.code === 0) {
          this.getPageList();
        }
      });
    },
    handleCancel() {
      this.richData.visible = false;
    },
    // 获取富文本内容
    lookRichTitle(scope) {
      this.richData = {
        visible: true,
        width: '80%',
        title: scope.row.title,
        data: scope.row.content,
      };
    },
    // 获取文章列表
    getPageList() {
      let data = {
        type: 4,
        title: this.keyword,
        page: this.page,
        page_size: this.pageSize,
      };
      ListInfo(data).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    handleCloseDialog() {
      this.formData = {
        title: '',
        type: '',
        audit: 0,
        content: '',
        person: '',
        timeInfo: '',
      };
      this.$refs['formData'].resetFields();
      this.dialogData.visible = false;
    },
    addPageInfo() {
      this.dialogData.visible = true;
      this.dialogData.isAdd = true;
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getPageList();
    },
    updateSuggest(scope) {
      this.dialogData = {
        visible: true,
        width: '80%',
        title: '修改文章',
        isAdd: false,
        id: scope.row.id,
      };
      this.formData = {
        title: scope.row.title,
        type: scope.row.type,
        audit: scope.row.is_audit,
        content: scope.row.content,
        person: scope.row.user_name,
        timeInfo: scope.row.released_at,
      };
    },
    // 提交
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 成功
          let data = {
            title: this.formData.title,
            type: this.formData.type,
            content: this.formData.content,
            released_at: this.formData.timeInfo,
            is_audit: this.formData.audit,
            user_name: this.formData.person,
          };
          if (this.dialogData.isAdd == false) {
            EditInfo({ id: this.dialogData.id, ...data }).then((res) => {
              if (res.code === 0) {
                this.$message.success('编辑成功');
              }
            });
          } else {
            AddInfo(data).then((res) => {
              if (res.code === 0) {
                this.$message.success('添加成功');
              }
            });
          }
          this.closeDialog1();
        }
      });
    },
    closeDialog() {
      this.$refs.editorElem.innerHTML = '';
      this.editor = null;
      this.handleCloseDialog();
    },
    closeDialog1() {
      this.$refs.editorElem.innerHTML = '';
      this.editor = null;
      this.handleCloseDialog();
      this.getPageList();
    },
    showEditor() {
      let that = this;
      this.textare = this.text;
      this.editor = new E(document.getElementById('editor'));
      this.editor.config.uploadImgServer = '/web/public/upload';
      this.editor.config.uploadImgHeaders = {
        Authorization: sessionStorage.getItem('token'),
      };
      this.editor.config.uploadFileName = 'file';
      this.editor.config.uploadImgHooks = {
        customInsert: function (insertImgFn, result) {
          let url = result.data.url;
          insertImgFn(url);
        },
      };
      this.editor.config.onchange = function (newHtml) {
        that.formData.content = newHtml;
      };
      this.editor.create();
      this.editor.txt.html(this.formData.content);
    },
    // 搜索
    searchPage() {
      this.page = 1;
      this.getPageList();
    },
  },
  components: {
    RichRelease,
  },
};
</script>
<style lang="scss" scoped>
.framer-suggestion {
  width: 98%;
  margin: 15px auto 0px auto;
  background: #fff;
  padding-bottom: 30px;
  .framer-header {
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0px auto;
  }
  .framer-header-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
  }
  .framer-search {
    width: 260px;
  }
  .framer-button {
    margin-left: 10px;
  }
  .framer-header-right {
    margin-top: 20px;
  }
  .suggestion-table {
    width: 95%;
    display: flex;
    flex-direction: column;
    margin: 40px auto 0px auto;
  }
  .suggestion-link {
    color: #409eff;
    cursor: pointer;
  }
  .suggest-em {
    font-style: normal;
    color: green;
    cursor: pointer;
  }
  .suggest-update-delete {
    font-style: normal;
    color: #409eff;
    cursor: pointer;
  }
  .suggest-has {
    font-style: normal;
    color: red;
    cursor: pointer;
  }
  .manage-span {
    margin: 0px 2px;
  }
  .pagination-info {
    width: 98%;
    margin: 20px 2% 0px 0px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .header-label {
    width: 80px;
    text-align: right;
    font-weight: normal;
  }
}
</style>

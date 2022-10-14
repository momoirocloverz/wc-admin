<template>
  <div class="poverty-alleviation">
    <div class="poverty-header">
      <div class="header-left">
        <div class="header-element">
          <label class="header-label">关键字：</label>
          <el-input type="text" v-model="keyword" placeholder="请输入关键字" class="header-left-ipt"></el-input>
        </div>
        <div class="header-element">
          <label class="header-label">文章类别：</label>
          <el-select v-model="pageType" placeholder="请选择文章类别">
            <el-option v-for="item in pageTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <el-button type="primary" class="header-search" @click="searchPageInfo">搜索</el-button>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="openPageInfo(1)">新增文章</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="povertyData" class="poverty-table">
      <el-table-column label="序号" prop="id" width="60" align="center"></el-table-column>
      <el-table-column label="文章类别" prop="type_name" align="center"></el-table-column>
      <el-table-column label="图片" prop="image_path" align="center">
        <template slot-scope="scope">
          <div class="image_box">
            <!--            <el-image-->
            <!--              :src="scope.row.top_image"-->
            <!--              fit="scale-down"-->
            <!--              lazy-->
            <!--              :preview-src-list="[scope.row.top_image]"-->
            <!--            />-->
            <preview-image :src="scope.row.top_image" :src-list="[scope.row.top_image]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" width="380" align="center">
        <template slot-scope="scope">
          <span class="poverty-title" @click="gotoPage(scope)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" prop="admin_name" align="center"></el-table-column>
      <el-table-column label="发表时间" prop="created_at" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updated_at" align="center"></el-table-column>
      <el-table-column label="点击" prop="click_num" align="center"></el-table-column>
      <el-table-column label="首页推荐" align="center">
        <template slot-scope="scope">
          <el-switch @change="changeSwitch(scope)" v-model="scope.row.is_recommend" active-text="是" inactive-text="否"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="管理操作" align="center">
        <template slot-scope="scope">
          <span class="table-span" @click="topInfo(scope)" v-if="!scope.row.is_top"
            >[<em class="el-column-red">{{ scope.row.is_top == 1 ? '' : '置顶' }}</em
            >]</span
          >
          <span class="table-span">[<el-button type="text" @click="openPageInfo(2, scope)">修改</el-button>]</span>
          <span class="table-span" @click="deletePage(scope)">[<el-button type="text">删除</el-button>]</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination-info" v-show="total > 10">
    </el-pagination>
    <!-- 发布信息 -->
    <el-dialog title="发布信息" :visible.sync="visibleDialog" center width="80%" @close="closeVisible('formData')" @opened="showEditor()" :close-on-click-modal="false">
      <el-form :model="formData" :rules="formRules" ref="formData" label-width="100px">
        <el-form-item label="文章标题：" prop="title">
          <el-input placeholder="请输入文章标题" v-model="formData.title" class="select-page"></el-input>
        </el-form-item>
        <el-form-item label="文章类别：" prop="type">
          <el-select v-model="formData.type" placeholder="请选择文章类别" class="select-page">
            <el-option v-for="item in pageTypeList1" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" prop="top_image_id">
          <file-upload v-if="visibleDialog" :size="50" :limit="1" :origin-list="formData.top_image" :file-id="formData.top_image_id" @handleChange="handleChange" />
          <span>至少上传一张jpg/png/gif图片,且大小不超过50M</span>
        </el-form-item>
        <el-form-item label="文章内容：" prop="content">
          <!-- <div id="editor" v-if="visibleDialog" ref="editorElem"></div> -->
          <quill-editor
            v-if="visibleDialog"
            class="editor"
            ref="myTextEditor"
            :value="content"
            :options="editorOption"
            @change="onEditorChange"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          />
        </el-form-item>
        <!-- <el-form-item label="发布人：" prop="publicPerson">
          <el-input
            v-model="formData.publicPerson"
            placeholder="请输入发布人"
            class="select-page"
          ></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="审核：" prop="audit">
          <el-radio v-model="formData.audit" :label="1">是</el-radio>
          <el-radio v-model="formData.audit" :label="0">否</el-radio>
        </el-form-item> -->
        <el-form-item label="发布时间：" prop="timeInfo">
          <el-date-picker type="datetime" placeholder="选择发布时间" v-model="formData.timeInfo" class="select-page"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('formData')">确定</el-button>
          <el-button @click="closeVisible('formData')">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 富文本内容 -->
    <el-dialog :title="dialogContent" :visible="contentVisible" center width="80%" @close="contentVisible = false">
      <div v-html="contentHtml" class="contentHtml"></div>
    </el-dialog>
    <input ref="inputTarget" id="takeVideo" type="file" style="display: none" accept="video/*" @change="uploadVideo" />
    <input ref="inputImgTarget" id="takeImage" type="file" style="display: none" accept="image/*" @change="uploadImg" />
    <div class="videoMask" v-if="showVideoMask" v-loading="showVideoMask" element-loading-text="视频上传中，请耐心等待" element-loading-spinner="el-icon-loading"></div>
  </div>
</template>
<script>
import { Input, Table, Dialog, Form, FormItem, Select, DatePicker } from 'element-ui';
import fileUpload from '@/components/fileUpload/index';
import previewImage from '@/components/previewImage/index';
import { ListInfo, AddInfo, EditInfo, DeleteInfo, editTopItem, editRecommendItem } from '@/api/alleviation';
import { UploadPic } from '@/api/common';
import E from 'wangeditor';
import moment from 'moment';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import debounce from 'lodash/debounce';
import Quill from 'quill';
import imageResize from 'quill-image-resize-module';
import Video from '@/quillVideo';
import { quillEditor } from 'vue-quill-editor';
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module';
Quill.register('modules/imageResize', imageResize);
// Quill.register('modules/ImageExtend', ImageExtend)
Quill.register(Video, true);
export default {
  name: 'poverty-alleviation',
  components: {
    fileUpload,
    previewImage,
    quillEditor,
  },
  data() {
    return {
      fileList: [],
      showVideoMask: false,
      dialogContent: '富文本内容',
      contentHtml: '',
      contentVisible: false,
      povertyData: [],
      keyword: '',
      pageType: 0,
      pageTypeList: [
        {
          value: 0,
          label: '全部',
        },
        {
          value: 1,
          label: '公告公示',
        },
        {
          value: 2,
          label: '最新政策',
        },
        {
          value: 3,
          label: '热点资讯',
        },
      ],
      pageTypeList1: [
        {
          value: 1,
          label: '公告公示',
        },
        {
          value: 2,
          label: '最新政策',
        },
        {
          value: 3,
          label: '热点资讯',
        },
      ],
      visibleDialog: false,
      formData: {
        title: '',
        type: '',
        content: '',
        top_image_id: '',
        // publicPerson: "",
        timeInfo: '',
        audit: 0,
      },
      action: '/web/public/upload',
      fileAction: '/web/user/import/nhxx',
      headers: {
        Authorization: sessionStorage.getItem('token'),
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
            message: '请选择文章类别',
          },
        ],
        top_image_id: [
          {
            required: true,
            message: '请至少上传一张图片',
          },
        ],
        content: [
          {
            required: true,
            message: '请输入文章内容',
          },
        ],
        publicPerson: [
          {
            required: true,
            message: '请输入发布人',
          },
        ],
      },
      isAdd: false,
      formDataId: 0,
      page: 1,
      pageSize: 10,
      total: 0,
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      editorOption: {
        placeholder: '请输入',
        modules: {
          // toolbar: [
          //   ['bold', 'italic', 'underline', 'strike'],
          //   ['blockquote', 'code-block'],
          //   [{ 'header': 1 }, { 'header': 2 }],
          //   [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          //   [{ 'script': 'sub' }, { 'script': 'super' }],
          //   [{ 'indent': '-1' }, { 'indent': '+1' }],
          //   [{ 'direction': 'rtl' }],
          //   [{ 'size': ['small', false, 'large', 'huge'] }],
          //   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          //   [{ 'font': [] }],
          //   [{ 'color': [] }, { 'background': [] }],
          //   [{ 'align': [] }],
          //   ['clean'],
          //   ['link', 'image', 'video']
          // ],
          toolbar: {
            //   container: container,
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: [] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['clean'],
              ['link', 'image', 'video'],
            ],
            handlers: {
              image: function (state) {
                if (state) {
                  let track = document.getElementById('takeImage');
                  track.click();
                }
              },
              video: function (state) {
                if (state) {
                  let track = document.getElementById('takeVideo');
                  track.click();
                }
              },
            },
          },
          imageResize: {},
          //   ImageExtend: {
          //     loading: true,
          //     name: 'file',
          //     action: '/web/public/upload',
          //     headers: (xhr) => {
          //       xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'))
          //     }, // 可选参数 设置请求头部
          //     response: (res) => {
          //       return res.data.url
          //     }
          //   }
        },
      },
      content: '',
    };
  },
  created() {
    this.getListInfo();
  },
  computed: {
    //   editor() {
    //     return this.$refs.myTextEditor.quill
    //   },
  },
  methods: {
    onEditorChange: debounce(function (value) {
      this.content = value.html;
    }, 466),
    onEditorBlur(editor) {
      // console.log('editor blur!', editor)
      console.log(this.content);
    },
    onEditorFocus(editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
    },
    // 搜索文章
    searchPageInfo() {
      this.getListInfo();
    },
    changeSwitch(scope) {
      let data = {
        id: scope.row.id,
        is_recommend: scope.row.is_recommend ? 1 : 0,
      };
      editRecommendItem(data).then((res) => {
        if (res && res.code == 0) {
          this.getListInfo();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    topInfo(scope) {
      let data = {
        id: scope.row.id,
        is_top: scope.row.is_top == 1 ? 0 : 1,
      };
      editTopItem(data).then((res) => {
        if (res.code == 0) {
          this.getListInfo();
        }
      });
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getListInfo();
    },
    openPageInfo(type, scope) {
      this.isAdd = type == 1 ? true : false;
      this.visibleDialog = true;
      this.content = '';
      if (type == 2) {
        this.formData = {
          title: scope.row.title,
          type: scope.row.type,
          content: scope.row.content,
          // publicPerson: scope.row.admin_name,
          timeInfo: scope.row.released_at,
          audit: scope.row.is_audit,
          top_image_id: scope.row.top_image_id || '',
          top_image: scope.row.top_image || '',
        };
        this.content = scope.row.content;
        this.formDataId = scope.row.id;
      }
    },
    handleSubmit(formData) {
      this.formData.content = this.content;
      this.$refs[formData].validate((valid) => {
        if (valid) {
          // 成功
          let data = {
            title: this.formData.title,
            top_image_id: this.formData.top_image_id,
            type: this.formData.type,
            content: this.formData.content,
            released_at: this.formData.timeInfo ? moment(this.formData.timeInfo).format('YYYY-MM-DD HH:mm:ss') : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            is_audit: this.formData.audit,
            // admin_name: this.formData.publicPerson,
          };
          if (this.isAdd) {
            AddInfo(data).then((res) => {
              if (res.code == 0) {
                this.$message.success('添加文章成功');
                this.getListInfo();
                this.visibleDialog = false;
                this.content = '';
                this.editor = null;
                this.$refs[formData].resetFields();
                this.formData = {
                  title: '',
                  type: '',
                  top_image_id: '',
                  content: '',
                  publicPerson: '',
                  timeInfo: '',
                  audit: 0,
                };
              }
            });
          } else {
            EditInfo({ id: this.formDataId, ...data }).then((res) => {
              if (res.code == 0) {
                this.$message.success('修改文章成功');
                this.getListInfo();
                this.visibleDialog = false;
                this.content = '';
                this.editor = null;
                this.$refs[formData].resetFields();
                this.formData = {
                  title: '',
                  type: '',
                  top_image_id: '',
                  content: '',
                  publicPerson: '',
                  timeInfo: '',
                  audit: 0,
                };
              }
            });
          }
        }
      });
    },
    getListInfo() {
      let data = {
        keyword: this.keyword,
        type: this.pageType ? this.pageType : undefined,
        page: this.page,
        page_size: this.pageSize,
      };
      ListInfo(data).then((res) => {
        res.data.data.forEach((item) => {
          item.is_recommend = item.is_recommend == 0 ? false : true;
        });
        this.povertyData = res.data.data;
        this.total = res.data.total;
      });
    },
    gotoPage(scope) {
      this.contentVisible = true;
      this.contentHtml = scope.row.content;
      // sessionStorage.setItem('contentHtml',JSON.stringify(scope.row.content));
      // this.$router.push({
      //   name: "multipleUniversepage-info"
      // });
    },
    closeVisible(formData) {
      this.visibleDialog = false;
      this.content = '';
      this.editor = null;
      this.$refs[formData].resetFields();
      this.formData = {
        title: '',
        type: '',
        top_image_id: '',
        content: '',
        // publicPerson: "",
        timeInfo: '',
        audit: 0,
      };
    },
    eldialingShow() {
      this.$nextTick(() => {
        this.showEditor();
      });
    },
    showEditor() {
      this.showif = true;
      this.editor = this.$refs.myTextEditor.quill;
    },
    escape2Html(str) {
      str = str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&npsp;/g, ' ')
        .replace(/\n/g, '<br />')
        .replace(/\r/g, '<br />');
      return str;
    },
    // 删除
    deletePage(scope) {
      this.$confirm('您确定要删除该条信息？', '提示', {
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
            this.getListInfo();
          }
        });
      });
    },
    handleChange(e) {
      this.formData.top_image_id = e.join(',');
    },
    uploadVideo(e) {
      let fileObj = e.target.files[0];
      let params = new FormData();
      params.append('file', fileObj, fileObj.name);
      this.showVideoMask = true;
      UploadPic(params)
        .then((res) => {
          if (res.code === 0) {
            let addRange = this.$refs.myTextEditor.quill.getSelection();
            this.$refs.myTextEditor.quill.insertEmbed(addRange !== null ? addRange.index : 0, 'video', res.data.url, Quill.sources.USER);
            e.target.value = '';
          }
        })
        .finally(() => {
          this.showVideoMask = false;
        });
    },
    uploadImg(e) {
      let fileObj = e.target.files[0];
      let params = new FormData();
      params.append('file', fileObj, fileObj.name);
      UploadPic(params).then((res) => {
        if (res.code === 0) {
          let addRange = this.$refs.myTextEditor.quill.getSelection();
          this.$refs.myTextEditor.quill.insertEmbed(addRange !== null ? addRange.index : 0, 'image', res.data.url, Quill.sources.USER);
          e.target.value = '';
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.poverty-alleviation {
  width: 98%;
  margin: 15px auto 0px auto;
  background: #fff;
  padding-bottom: 30px;
  .poverty-header {
    width: 98%;
    margin: 0px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 20px;
    .header-left {
      width: 70%;
      display: flex;
      flex-direction: row;
      align-items: center;
      .header-element {
        width: 30%;
        display: flex;
        flex-direction: row;
        align-items: center;
        .header-label {
          width: 100px;
          text-align: right;
          font-weight: normal;
        }
      }
      .header-search {
        margin-left: 20px;
      }
    }
  }
  .poverty-table {
    width: 98%;
    margin: 20px auto 0px auto;
  }
}
.el-column-red {
  color: red;
  font-style: normal;
}
.table-span {
  margin: 0px 5px;
  cursor: pointer;
}
.poverty-title {
  color: #409eff;
  cursor: pointer;
}
.select-page {
  width: 30%;
}
.pagination-info {
  width: 98%;
  margin: 20px 2% 0px 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.image_box {
  width: 60px;
  height: 60px;
  .el-image {
    width: 100%;
    height: 100%;
  }
}
.videoMask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3000;
  bottom: 0;
}
</style>
<style lang="scss">
.poverty-alleviation {
  .contentHtml {
    video {
      max-width: 100%;
    }
    img {
      max-width: 100%;
    }
  }
  .editor {
    height: 300px;
    line-height: 25px;
  }
  .ql-container {
    height: 260px;
  }
}
</style>

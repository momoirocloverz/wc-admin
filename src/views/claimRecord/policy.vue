<template>
  <div class="claimPolicySubCon">
    <div class="poverty-header">
      <div class="header-left">
        <div class="header-element">
          <label class="header-label">补助项目：</label>
          <el-select v-model="plan_name" placeholder="请选择补助项目">
            <el-option v-for="item in pageTypeList1" :key="item.label" :value="item.label" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="header-element">
          <label class="header-label">状态：</label>
          <el-select v-model="is_release" placeholder="请选择文章类别">
            <el-option v-for="item in pageTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <el-button type="primary" class="header-search" @click="searchPageInfo">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>

    <div class="newBtnCon">
      <el-button type="primary" @click="popNew">新增</el-button>
    </div>
    <el-table :data="povertyData" class="poverty-table">
      <el-table-column label="序号" prop="id" width="60" align="center"></el-table-column>
      <el-table-column label="文件名称" prop="title" align="center">
        <template slot-scope="scope">
          <span class="poverty-title" @click="gotoPage(scope)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件编号" prop="code" align="center"></el-table-column>
      <!-- <el-table-column label="图片" prop="image_path" align="center">
        <template slot-scope="scope">
          <div class="image_box">
            <preview-image :src="scope.row.top_image" :src-list="[scope.row.top_image]" />
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="补助项目" prop="plan_name" align="center"></el-table-column>
      <el-table-column label="文件发布者" prop="release_name" align="center"></el-table-column>
      <el-table-column label="发布时间" prop="release_at" align="center" width="160"></el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center" width="160"></el-table-column>
      <el-table-column label="状态" prop="is_release" align="center">
        <template slot-scope="scope">
          <span>{{ releaseType[scope.row.is_release] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="topInfo(scope)"> {{ scope.row.is_top == 1 ? '取消置顶' : '置顶' }}</el-button>
          <el-button type="text" @click="openPageInfo(scope)">编辑</el-button>
          <el-button type="text" class="dangerText" @click="deletePage(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination-info" v-show="total > 10">
    </el-pagination>
    <el-dialog
      class="setMiddleDialog upload3Dialog"
      title="政策"
      :visible.sync="visibleDialog"
      center
      width="80%"
      @close="closeVisible('formData')"
      @opened="showEditor()"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" :rules="formRules" ref="formData" label-width="130px">
        <div class="formScroll">
          <el-form-item label="文件名称：" prop="title">
            <el-input placeholder="请输入文件名称" v-model="formData.title" class="select-page"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件发布时间：" prop="release_at">
                <el-date-picker type="datetime" placeholder="选择发布时间" v-model="formData.release_at" class="wholeContainer"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件编号：" prop="code">
                <el-input placeholder="请输入文件编号" v-model="formData.code" class="select-page"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="信息发布者：" prop="release_name">
                <el-input placeholder="请输入信息发布者" v-model="formData.release_name" class="select-page"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补贴项目：" prop="plan_name">
                <el-select v-model="formData.plan_name" placeholder="请选择补贴项目" class="wholeContainer">
                  <el-option v-for="item in pageTypeList1" :key="item.label" :value="item.label" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-form-item label="上传图片" prop="top_image_id">
            <file-upload v-if="visibleDialog" :size="50" :limit="1" :origin-list="formData.top_image" :file-id="formData.top_image_id" @handleChange="handleChange" />
            <span>至少上传一张jpg/png/gif图片,且大小不超过50M</span>
          </el-form-item> -->
          <el-form-item label="文章内容：" prop="content">
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
        </div>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('formData')">发布</el-button>
          <el-button type="primary" @click="saveDraft('formData')">保存草稿</el-button>
          <el-button @click="closeVisible('formData')">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="dialogContent" :visible="contentVisible" center width="80%" @close="contentVisible = false">
      <div v-html="contentHtml" class="contentHtml"></div>
    </el-dialog>
    <input ref="inputTarget" id="takeVideo" type="file" style="display: none" accept="video/*" @change="uploadVideo" />
    <input ref="inputImgTarget" id="takeImage" type="file" style="display: none" accept="image/*" @change="uploadImg" />
    <div class="videoMask" v-if="showVideoMask" v-loading="showVideoMask" element-loading-text="视频上传中，请耐心等待" element-loading-spinner="el-icon-loading"></div>
  </div>
</template>
<script>
import fileUpload from '@/components/fileUpload/index';
import previewImage from '@/components/previewImage/index';
import { applyPolicyList, addPolicy, editPolicy, deletePolicy, topPolicy, policyInfo } from '@/api/bee';
import { UploadPic } from '@/api/common';
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
  name: 'claimPolicySubCon',
  components: {
    fileUpload,
    previewImage,
    quillEditor,
  },
  data() {
    return {
      releaseType: {
        0: '草稿',
        1: '已发布',
      },
      editRelate: false,
      fileList: [],
      showVideoMask: false,
      dialogContent: '富文本内容',
      contentHtml: '',
      contentVisible: false,
      povertyData: [],
      plan_name: '',
      is_release: '',
      pageTypeList: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '0',
          label: '草稿',
        },
        {
          value: '1',
          label: '已发布',
        },
      ],
      pageTypeList1: [
        {
          value: 1,
          label: '雨露计划',
        },
        {
          value: 2,
          label: '特困补助',
        },
        {
          value: 3,
          label: '低保补助',
        },
        {
          value: 4,
          label: '教育补助',
        },
        {
          value: 5,
          label: '危旧房补贴',
        },
        {
          value: 6,
          label: '人才补贴',
        },
        {
          value: 7,
          label: '创业补贴',
        },
        {
          value: 8,
          label: '医疗补助',
        },
        {
          value: 9,
          label: '残疾人补助',
        },
        {
          value: 10,
          label: '异地搬迁',
        },
        {
          value: 11,
          label: '小额贷款',
        },
      ],
      visibleDialog: false,
      formData: {
        title: '',
        type: '',
        content: '',
        release_at: '',
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
        plan_name: [
          {
            required: true,
            message: '请选择补助项目',
          },
        ],
        release_at: [
          {
            required: true,
            message: '请选择文件发布时间',
          },
        ],
        content: [
          {
            required: true,
            message: '请输入文章内容',
          },
        ],
        release_name: [
          {
            required: true,
            message: '请输入发布者',
          },
        ],
        code: [
          {
            required: true,
            message: '请输入文件编号',
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
          toolbar: {
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
      //   console.log(this.content);
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
    resetSearch() {
      this.plan_name = '';
      this.is_release = '';
      this.page = 1;
      this.getListInfo();
    },
    topInfo(scope) {
      let data = {
        id: scope.row.id,
        is_top: scope.row.is_top == 1 ? 0 : 1,
      };
      topPolicy(data).then((res) => {
        if (res.code == 0) {
          this.getListInfo();
        }
      });
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getListInfo();
    },
    popNew() {
      this.visibleDialog = true;
      this.content = '';
      this.editRelate = false;
    },
    openPageInfo(scope) {
      let data = {
        id: scope.row.id,
      };
      policyInfo(data).then((res) => {
        if (res.code == 0) {
          let shorter = res.data;
          this.visibleDialog = true;
          this.content = '';
          this.editRelate = true;
          this.content = shorter.content;
          this.formData = {
            title: shorter.title,
            release_at: shorter.release_at,
            created_at: shorter.created_at,
            code: shorter.code,
            release_name: shorter.release_name,
            plan_name: shorter.plan_name,
            content: shorter.content,
            id: shorter.id,
            is_release: shorter.is_release,
          };
        }
      });
    },
    saveDraft(formData) {
      this.formData.content = this.content;
      let data = {
        title: this.formData.title,
        release_at: this.formData.release_at ? moment(this.formData.release_at).format('YYYY-MM-DD HH:mm:ss') : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        content: this.formData.content,
        code: this.formData.code,
        release_name: this.formData.release_name,
        plan_name: this.formData.plan_name,
        is_release: 0,
      };
      if (this.editRelate) {
        data.id = this.formData.id;
        editPolicy(data).then((res) => {
          if (res.code == 0) {
            this.$message.success('修改文章成功');
            this.getListInfo();
            this.content = '';
            this.editor = null;
            this.$refs[formData].resetFields();
            setTimeout(() => {
              this.visibleDialog = false;
            }, 100);
          }
        });
      } else {
        addPolicy(data).then((res) => {
          if (res.code == 0) {
            this.$message.success('添加文章成功');
            this.getListInfo();
            this.content = '';
            this.editor = null;
            this.$refs[formData].resetFields();
            setTimeout(() => {
              this.visibleDialog = false;
            }, 100);
          }
        });
      }
    },
    handleSubmit(formData) {
      this.formData.content = this.content;
      this.$refs[formData].validate((valid) => {
        if (valid) {
          let data = {
            title: this.formData.title,
            release_at: this.formData.release_at ? moment(this.formData.release_at).format('YYYY-MM-DD HH:mm:ss') : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            content: this.formData.content,
            code: this.formData.code,
            release_name: this.formData.release_name,
            plan_name: this.formData.plan_name,
            is_release: 1,
          };
          if (this.editRelate) {
            data.id = this.formData.id;
            editPolicy(data).then((res) => {
              if (res.code == 0) {
                this.$message.success('修改文章成功');
                this.getListInfo();
                this.content = '';
                this.editor = null;
                this.$refs[formData].resetFields();
                setTimeout(() => {
                  this.visibleDialog = false;
                }, 100);
              }
            });
          } else {
            addPolicy(data).then((res) => {
              if (res.code == 0) {
                this.$message.success('添加文章成功');
                this.getListInfo();
                this.content = '';
                this.editor = null;
                this.$refs[formData].resetFields();
                setTimeout(() => {
                  this.visibleDialog = false;
                }, 100);
              }
            });
          }
        }
      });
    },
    getListInfo() {
      let data = {
        plan_name: this.plan_name,
        is_release: this.is_release ? this.is_release : undefined,
        page: this.page,
        page_size: this.pageSize,
      };
      applyPolicyList(data).then((res) => {
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
    },
    closeVisible(formData) {
      this.visibleDialog = false;
      this.content = '';
      this.editor = null;
      this.$refs[formData].resetFields();
      this.formData = {
        title: '',
        release_name: '',
        code: '',
        content: '',
        release_at: '',
        plan_name: '',
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
      console.log('scope', scope.row);
      this.$confirm('您确定要删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let data = {
            id: scope.row.id,
          };
          deletePolicy(data).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功',
              });
              this.getListInfo();
            }
          });
        })
        .catch(() => {});
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
.newBtnCon {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.dangerText {
  color: #f56c6c;
}
.wholeContainer {
  width: 100%;
}
.claimPolicySubCon {
  margin: 15px auto 0px auto;
  background: #fff;
  padding-bottom: 30px;
  .poverty-header {
    margin: 0px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 20px;
    .header-left {
      width: 1100px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .header-element {
        // width: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;
        .header-label {
          width: 80px;
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
.formScroll {
  height: 480px;
  box-sizing: border-box;
  overflow-y: scroll;
}
.poverty-title {
  color: #409eff;
  cursor: pointer;
}
.select-page {
  //   width: 30%;
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
.claimPolicySubCon {
  .upload3Dialog {
    .el-dialog {
      height: 630px;
    }
  }
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

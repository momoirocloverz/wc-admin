<template>
  <div class="industryAlliancePlantPreorderCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="title" placeholder="标题名称"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" class="fixInput" placeholder="状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-date-picker v-model="timeRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="name" placeholder="农户名称"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="type" class="fixInput" placeholder="认种类型">
            <el-option v-for="item in publishOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="card" placeholder="身份证号"></el-input>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="btnarea">
        <el-button type="primary" @click="exportAction">导出</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="标题名称" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.title }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="认种类型" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.type }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="认种农户" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>
          <el-table-column label="身份证号" prop="card" align="center"></el-table-column>
          <el-table-column prop="area" label="认种面积" align="center"></el-table-column>
          <el-table-column prop="pre_income" label="预估收益" align="center"></el-table-column>
          <el-table-column prop="pre_pay" label="预付款" align="center"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>{{ statusMap[scope.row.status] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="downloadCurrent(scope.row)" v-if="scope.row.status != 2">下载协议</el-button>
                <el-button type="text" @click="paymentCurrent(scope.row)" v-if="scope.row.status == 0">打款</el-button>
                <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
                <el-button type="text" @click="cancelCurrent(scope.row)" v-if="scope.row.status == 0">取消</el-button>
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
    <el-dialog class="setMiddleDialog upload3Dialog" title="详情" width="620px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll1Con">
        <ContentDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload2Dialog" title="打款" width="620px" :visible.sync="paymentVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll2Con">
        <el-form :model="rule2Form" :rules="rule2s" ref="rule2Form" label-width="120px" class="demo-ruleForm">
          <el-form-item class="flexFormItem">
            <div class="flexCon">
              <div>打款给：</div>
              <div class="targetName">{{ currentItem.name }}</div>
              <div>总金额：</div>
              <div>{{ currentItem.pre_income }}元</div>
            </div>
          </el-form-item>
          <el-form-item label="付款凭证" prop="image" class="flexFormItem">
            <el-upload
              :class="[rule2Form.image ? 'removePlus' : '']"
              :action="action"
              :headers="headers"
              ref="upload"
              list-type="picture-card"
              :before-upload="beforeUpload"
              :on-success="successFile"
              :file-list="fileList"
              :on-remove="handleRemoveFile"
              accept="image/*"
            >
              <i class="el-icon-plus avatar-uploader-icon" slot="default" />
              <div class="el-upload__tip" slot="tip">只能上传1张jpg/png/gif图片,且大小不超过10M</div>
              <template slot="file" slot-scope="{ file }">
                <div class="upload-file-content">
                  <template>
                    <img class="el-upload-list__item-thumbnail" :src="rule2Form.image" />
                  </template>
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePicturePreview(file)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleRemoveFile(file)">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit2Form('rule2Form')">确定</el-button>
        <el-button @click="reset2Form('rule2Form')">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" class="setMiddleDialog upload2Dialog" title="图片" width="620px">
      <div class="scrollCon">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { industrySeedApplyLists, industrySeedApplyExport, industrySeedApplySettle, industrySeedApplyCancel } from '@/api/bee';
import ContentDetail from './preOrder/common.vue';
export default {
  components: {
    ContentDetail,
  },
  name: 'industryAlliancePlantPreorderCon',
  data() {
    return {
      statusMap: {
        0: '待打款',
        1: '已打款',
        2: '已取消',
      },
      imgVisible: false,
      dialogImageUrl: '',
      rule2Form: {
        image: '',
        imageId: '',
      },
      rule2s: {
        image: [{ required: true, message: '请上传', trigger: 'blur' }],
      },
      ruleForm: {
        status: '2',
        comment: '',
      },
      rules: {
        status: [{ required: true, message: '请选择', trigger: 'blur' }],
        // comment: [{ required: true, message: '请填写', trigger: 'blur' }],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      status: '',
      type: '',
      card: '',
      audit_type: '',
      audit_status: '',
      type: '',
      statusOptions: [
        {
          label: '状态(全部)',
          value: '',
        },
        {
          label: '待打款',
          value: '0',
        },
        {
          label: '已打款',
          value: '1',
        },
        {
          label: '已取消',
          value: '2',
        },
      ],
      editVisible: false,
      paymentVisible: false,
      options: [],
      content: '',
      title: '',
      name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      publishOptions: [
        {
          label: '认种类型(全部)',
          value: '',
        },
        {
          label: '稻米',
          value: '稻米',
        },
        {
          label: '糯米山药',
          value: '糯米山药',
        },
      ],
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchType: 0,
      isEdit: false,
      currentItem: {},
      detailVisible: false,
      searchLoading: false,
      fileList: [],
      action: '/web/public/upload',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      targetName: '',
      totalAmount: 0,
    };
  },
  mounted() {
    this.analyseQuery();
    this.fetchList();
  },
  methods: {
    analyseQuery() {
      if (this.$route.query.title) {
        this.title = this.$route.query.title;
      }
    },
    handlePicturePreview(file) {
      this.imgVisible = true;
      this.dialogImageUrl = file.url;
    },
    handleRemoveFile(file) {
      this.rule2Form.image = '';
      this.rule2Form.imageId = '';
      this.$refs.rule2Form.validateField('image');
      this.fileList = [];
    },
    successFile(res) {
      this.rule2Form.image = res.data.url;
      this.rule2Form.imageId = res.data.id;
      this.$refs.rule2Form.validateField('image');
    },
    // 图片上传
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 10;
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 10MB');
        return false;
      }
    },
    exportAction() {
      industrySeedApplyExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '土地认种订单管理导出' + Date.now() + '.xlsx';
            if ('download' in document.createElement('a')) {
              // 非IE下载
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    shutDetail() {
      this.detailVisible = false;
    },
    submitForm(formName) {
      this.detailVisible = false;
    },
    resetForm(formName) {
      //   this.$refs[formName].resetFields();
      this.detailVisible = false;
    },
    submit2Form(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            id: this.currentItem.id,
            confirm_img_id: this.rule2Form.imageId,
          };
          industrySeedApplySettle(data).then((res) => {
            if (res && res.code == 0) {
              this.$message.success('上传成功');
              this.fetchList();
              this.paymentVisible = false;
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    reset2Form(formName) {
      this.$refs[formName].resetFields();
      this.paymentVisible = false;
    },
    checkDetail(row) {
      this.currentItem = row;
      this.detailVisible = true;
    },
    cancelCurrent(row) {
      this.$confirm('此操作将取消申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let data = {
            id: row.id,
          };
          industrySeedApplyCancel(data).then((res) => {
            if (res && res.code == 0) {
              this.$message.success('取消成功');
              this.fetchList();
            }
          });
        })
        .catch(() => {});
    },
    downloadCurrent(row) {
      function downloadImgByBase64(url) {
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d');
          // 将img中的内容画到画布上
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // 将画布内容转换为base64
          var base64 = canvas.toDataURL();
          // 创建a链接
          var a = document.createElement('a');
          a.href = base64;
          a.download = '协议' + Date.now() + '.png';
          // 触发a链接点击事件，浏览器开始下载文件
          a.click();
        };
        img.src = url;
        // 必须设置，否则canvas中的内容无法转换为base64
        img.setAttribute('crossOrigin', 'Anonymous');
      }
      if (row && row.sign_img_list && row.sign_img_list.length) {
        downloadImgByBase64(row.sign_img_list[0]);
      }
    },
    paymentCurrent(row) {
      this.currentItem = row;
      this.fileList = [];
      this.paymentVisible = true;
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.title = '';
      this.card = '';
      this.name = '';
      this.currentPage = 1;
      this.status = '';
      this.type = '';
      this.timeRange = [];
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        title: this.title,
        name: this.name,
        card: this.card,
        page: this.currentPage,
        page_size: this.pageSize,
        status: this.status,
        type: this.type,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      industrySeedApplyLists(data).then((res) => {
        if (res && res.code === 0) {
          res.data.data.forEach((ele, index) => (ele.index = index + 1));
          this.tableData = res.data.data;
          this.total = res.data.total;
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
.avatar-uploader-icon {
  font-size: 28px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
.scrollCon {
  overflow-y: auto;
  height: 320px;
}
.scroll1Con {
  overflow-y: auto;
  overflow-x: hidden;
  height: 440px;
}
.scroll2Con {
  overflow-y: auto;
  height: 360px;
}
.flexCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.targetName {
  margin-right: 10px;
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
.industryAlliancePlantPreorderCon {
  background-color: #fff;
  .innerCon {
    padding-top: 0;
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
.fakeRequired {
  position: relative;
  &::before {
    content: '*';
    color: #f56c6c;
    left: 20px;
    top: 10px;
    font-size: 16px;
    position: absolute;
  }
}
</style>
<style lang="scss">
.industryAlliancePlantPreorderCon {
  .removePlus {
    .el-upload--picture-card {
      display: none;
    }
  }
  .upload3Dialog {
    .el-dialog {
      height: 630px;
    }
  }
  .upload2Dialog {
    .el-dialog {
      height: 540px;
    }
  }
}
</style>

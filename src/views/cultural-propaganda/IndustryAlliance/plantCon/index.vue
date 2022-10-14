<template>
  <div class="industryAlliancePlantIndexCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="type" class="fixInput" placeholder="认种类型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" class="fixInput" placeholder="请选择审核进度">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="btnarea">
        <el-button type="primary" @click="exportAction">导出</el-button>
        <el-button type="primary" @click="popNew">新增</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="index" label="序号" align="center" width="60">
            <template slot-scope="scope">
              <div>{{ scope.row.index }}</div>
            </template></el-table-column
          >
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
          <el-table-column prop="index" label="认种面积" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.area }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="收购价格" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.price }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="finish_rate" label="完成率" align="center">
            <template slot-scope="scope">
              <div>{{ rateFormat(scope.row.finish_rate * 100) }}%</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="linkman" label="联系人" align="center"></el-table-column>
          <el-table-column prop="linkman_mobile" label="联系人方式" align="center"></el-table-column> -->
          <el-table-column prop="created_at" label="创建时间" align="center" width="200"></el-table-column>
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">
              <div>{{ statusMap[scope.row.status] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="310">
            <template slot-scope="scope">
              <div class="operateCon">
                <el-switch @change="changeSwitch(scope)" v-model="scope.row.statusCopy" :active-value="0" active-text="上架" inactive-text="下架" class="switchItem"></el-switch>
                <el-button type="text" @click="popDetail(scope.row)">查看</el-button>
                <el-button type="text" @click="toDetail(scope.row)">预约详情</el-button>
                <el-button type="text" @click="popEdit(scope.row)" v-if="scope.row.status != 1">编辑</el-button>
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
    <el-dialog class="setMiddleDialog upload3Dialog" :title="isEdit ? '编辑' : '新建'" width="620px" :visible.sync="editVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll1Con">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="标题名称" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="认种类型" prop="type" key="type">
            <el-select :disabled="formAble" v-model="ruleForm.type" class="fixInput" placeholder="认种类型">
              <el-option v-for="item in typeSecOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="认种面积" prop="area">
            <el-input-number v-model="ruleForm.area" :precision="2" :step="1" :max="99999999" :min="0" controls-position="right" placeholder="输入认种面积"></el-input-number
            ><span class="inputNumberUnit">亩</span>
          </el-form-item>
          <el-form-item label="收购价格" prop="price">
            <el-input-number v-model="ruleForm.price" :precision="2" :step="1" :max="99999999" :min="0" controls-position="right" placeholder="输入收购价格" :disabled="formAble"></el-input-number
            ><span class="inputNumberUnit">元/斤</span>
          </el-form-item>
          <el-form-item label="最低认种面积" prop="low_area">
            <el-input-number v-model="ruleForm.low_area" :precision="2" :step="1" :max="99999999" :min="0" controls-position="right" placeholder="输入最低认种面积"></el-input-number
            ><span class="inputNumberUnit">亩</span>
          </el-form-item>
          <el-form-item label="最高认种面积" prop="high_area">
            <el-input-number v-model="ruleForm.high_area" :precision="2" :step="1" :max="99999999" :min="0" controls-position="right" placeholder="输入最高认种面积"></el-input-number
            ><span class="inputNumberUnit">亩</span>
          </el-form-item>
          <el-form-item label="预约截止日期" prop="limit_date">
            <el-date-picker v-model="ruleForm.limit_date" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="认种要求" prop="demand">
            <el-input type="textarea" resize="none" v-model="ruleForm.demand" placeholder="请输入认种要求"></el-input>
          </el-form-item>
          <el-form-item label="农作物照片" prop="image" class="flexFormItem fakeRequired">
            <el-upload
              :class="[ruleForm.image ? 'removePlus' : '']"
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
                    <img class="el-upload-list__item-thumbnail" :src="ruleForm.image" />
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
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload2Dialog" title="详情" width="620px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scrollCon">
        <ContentDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
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
import { industrySeedLists, industrySeedExport, industrySeedAdd, industrySeedEdit, industrySeedInfo, industrySeedHidden, industrySeedDisplay } from '@/api/bee';
import ContentDetail from './index/common.vue';
export default {
  components: {
    ContentDetail,
  },
  props: {
    changeTab: {
      type: Function,
    },
  },
  name: 'industryAlliancePlantIndexCon',
  data() {
    var validateImage = (rule, value, callback) => {
      if (!this.ruleForm.imageId) {
        callback(new Error('请上传图片'));
      } else {
        callback();
      }
    };
    return {
      imgVisible: false,
      dialogImageUrl: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            },
          },
        ],
      },
      ruleForm: {
        id: '',
        title: '',
        type: '',
        image: '',
        imageId: '',
        area: '',
        price: '',
        low_area: '',
        high_area: '',
        limit_date: '',
        demand: '',
      },
      rules: {
        title: [{ required: true, message: '请选择', trigger: 'blur' }],
        type: [{ required: true, message: '请填写', trigger: 'change' }],
        area: [{ required: true, message: '请填写', trigger: 'blur' }],
        image: [{ validator: validateImage, trigger: 'blur' }],
        area: [{ required: true, message: '请选择', trigger: 'blur' }],
        price: [{ required: true, message: '请填写', trigger: 'blur' }],
        low_area: [{ required: true, message: '请填写', trigger: 'blur' }],
        high_area: [{ required: true, message: '请选择', trigger: 'blur' }],
        limit_date: [{ required: true, message: '请填写', trigger: 'blur' }],
        demand: [{ required: true, message: '请填写', trigger: 'blur' }],
      },
      formAble: false,
      type: '',
      status: '',
      type: '',
      typeOptions: [
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
      typeSecOptions: [
        {
          label: '稻米',
          value: '稻米',
        },
        {
          label: '糯米山药',
          value: '糯米山药',
        },
      ],
      statusMap: {
        0: '进行中',
        1: '已下架',
        2: '已结束',
      },
      statusOptions: [
        {
          value: '',
          label: '状态(全部)',
        },
        {
          label: '进行中',
          value: '0',
        },
        {
          label: '已下架',
          value: '1',
        },
        {
          label: '已结束',
          value: '2',
        },
      ],
      options: [],
      content: '',
      company_name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      isEdit: false,
      currentItem: {},
      detailVisible: false,
      editVisible: false,
      fileList: [],
      action: '/web/public/upload',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    rateFormat(value) {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(0);
        return fix;
      }
    },
    handlePicturePreview(file) {
      this.imgVisible = true;
      this.dialogImageUrl = file.url;
    },
    handleRemoveFile(file) {
      this.ruleForm.image = '';
      this.ruleForm.imageId = '';
      this.$refs.ruleForm.validateField('image');
      this.fileList = [];
    },
    successFile(res) {
      this.ruleForm.image = res.data.url;
      this.ruleForm.imageId = res.data.id;
      this.$refs.ruleForm.validateField('image');
    },
    // 图片上传
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 10;
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 10MB');
        return false;
      }
    },
    popNew() {
      this.isEdit = false;
      this.editVisible = true;
      this.ruleForm.title = '';
      this.ruleForm.type = '';
      this.ruleForm.image = '';
      this.ruleForm.imageId = '';
      this.ruleForm.area = '';
      this.ruleForm.price = '';
      this.ruleForm.low_area = '';
      this.ruleForm.high_area = '';
      this.ruleForm.limit_date = '';
      this.ruleForm.demand = '';
      this.ruleForm.id = '';
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate('type');
      });
      this.fileList = [];
      this.formAble = false;
    },
    changeSwitch(scope) {
      let data = {
        id: scope.row.id,
      };
      if (!scope.row.status) {
        industrySeedHidden(data).then((res) => {
          if (res && res.code == 0) {
            this.fetchList();
          }
        });
      } else {
        industrySeedDisplay(data).then((res) => {
          if (res && res.code == 0) {
            this.fetchList();
          }
        });
      }
    },
    exportAction() {
      industrySeedExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '产业联盟土地认种导出' + Date.now() + '.xlsx';
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            title: this.ruleForm.title,
            type: this.ruleForm.type,
            area: this.ruleForm.area,
            price: this.ruleForm.price,
            low_area: this.ruleForm.low_area,
            high_area: this.ruleForm.high_area,
            limit_date: this.ruleForm.limit_date,
            demand: this.ruleForm.demand,
            img_str: this.ruleForm.imageId,
          };
          if (+this.ruleForm.low_area > +this.ruleForm.high_area) {
            this.$message.error('请检查最低认种面积，最高认种面积');
          } else {
            if (!this.isEdit) {
              industrySeedAdd(data).then((res) => {
                if (res && res.code == 0) {
                  this.$message.success('操作成功');
                  this.$refs[formName].resetFields();
                  this.editVisible = false;
                  this.fetchList();
                }
              });
            } else {
              data.id = this.ruleForm.id;
              industrySeedEdit(data).then((res) => {
                if (res && res.code == 0) {
                  this.$message.success('操作成功');
                  this.$refs[formName].resetFields();
                  this.editVisible = false;
                  this.fetchList();
                }
              });
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.editVisible = false;
    },
    popEdit(row) {
      this.isEdit = true;
      this.editVisible = true;
      this.formAble = true;
      this.ruleForm.title = row.title;
      this.ruleForm.type = row.type;
      this.ruleForm.image = row.img_list[0];
      this.ruleForm.imageId = row.img_str;
      this.ruleForm.area = row.area;
      this.ruleForm.price = row.price;
      this.ruleForm.low_area = row.low_area;
      this.ruleForm.high_area = row.high_area;
      this.ruleForm.limit_date = row.limit_date;
      this.ruleForm.demand = row.demand;
      this.ruleForm.id = row.id;
      this.fileList = [
        {
          url: row.img_list[0],
          id: row.img_str,
        },
      ];
    },
    popDetail(row) {
      this.currentItem = row;
      this.detailVisible = true;
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.status = '';
      this.type = '';
      this.currentPage = 1;
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        status: this.status,
        type: this.type,
        page: this.currentPage,
        page_size: this.pageSize,
      };
      industrySeedLists(data).then((res) => {
        if (res && res.code === 0) {
          res.data.data.forEach((ele, index) => {
            ele.index = index + 1;
            ele.statusCopy = ele.status;
          });
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
    toDetail(row) {
      this.$emit('changeTab', '1');
      this.$router.push({
        path: this.$route.path,
        query: {
          activeName: this.$route.query.activeName,
          subActive: 'second',
          title: row.title,
        },
      });
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
  height: 360px;
}
.scroll1Con {
  overflow-y: auto;
  overflow-x: hidden;
  height: 480px;
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
.switchItem {
  margin-right: 20px;
}
.inputNumberUnit {
  margin-left: 20px;
}
.industryAlliancePlantIndexCon {
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
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
.industryAlliancePlantIndexCon {
  .upload2Dialog {
    .el-dialog {
      height: 540px;
    }
  }
  .upload3Dialog {
    .el-dialog {
      height: 670px;
    }
  }
  .removePlus {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>

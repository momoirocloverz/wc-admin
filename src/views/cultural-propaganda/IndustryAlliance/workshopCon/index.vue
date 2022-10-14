<template>
  <div class="industryAllianceWorkIndexCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="name" placeholder="车间名称"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="is_open" class="fixInput" placeholder="请选择审核进度">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="address" placeholder="车间地址"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-date-picker v-model="timeRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="btnarea">
        <el-button type="primary" @click="popNew">新增</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column label="车间名称" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="车间地址" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.address }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="管理员" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.manage_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.mobile }}</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="created_at" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>{{ statusMap[scope.row.is_open] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="popDetail(scope.row)">查看</el-button>
                <el-button type="text" @click="toDetail(scope.row)">预约详情</el-button>
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
      <div class="scroll2Con">
        <ContentDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload2Dialog" :title="isEdit ? '编辑' : '新建'" width="620px" :visible.sync="editVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll1Con">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="车间名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="乡镇" prop="town_id" class="flexFormItem">
            <el-select v-model="ruleForm.town_id" class="fixInput" placeholder="请选择乡镇" @change="townDialogFormChange(ruleForm.town_id)">
              <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="村名" prop="village_id" class="flexFormItem">
            <el-select v-model="ruleForm.village_id" class="fixInput" placeholder="请选择村名">
              <el-option v-for="item in publishOptions" :key="item.id" :label="item.village_name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车间地址" prop="address">
            <el-input v-model="ruleForm.address" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="manage_name">
            <el-input v-model="ruleForm.manage_name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="mobile" class="fakeRequired">
            <el-input v-model="ruleForm.mobile" placeholder="请输入" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="车间状态" prop="is_open">
            <el-radio v-model="ruleForm.is_open" label="1">开放预约</el-radio>
            <el-radio v-model="ruleForm.is_open" label="0">关闭预约</el-radio>
          </el-form-item>
          <el-form-item label="车间人数" prop="num">
            <el-input v-model="ruleForm.num" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="车间介绍" prop="introduce">
            <el-input type="textarea" resize="none" v-model="ruleForm.introduce" placeholder="请输入车间介绍"></el-input>
          </el-form-item>
          <el-form-item label="车间照片" prop="image" class="flexFormItem fakeRequired">
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
          <el-form-item
            :label="'开始日期'"
            prop="start_date"
            :rules="{
              required: true,
              message: '开始日期不能为空',
              trigger: 'blur',
            }"
          >
            <el-date-picker v-model="ruleForm.start_date" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"> </el-date-picker>
          </el-form-item>
          <!-- class="resetItemWidth" -->
          <el-form-item
            :label="'结束日期'"
            prop="end_date"
            :rules="{
              required: true,
              message: '结束日期不能为空',
              trigger: 'blur',
            }"
          >
            <el-date-picker v-model="ruleForm.end_date" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
        </el-form>
        <!-- <el-select :disabled="formAble" v-model="domain.number" class="fixInput" placeholder="时间段">
              <el-option v-for="item in typeSecOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
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
import { industryplantLists, industryplantAdd, industryplantEdit } from '@/api/bee';
import ContentDetail from './index/common.vue';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
export default {
  components: {
    ContentDetail,
  },
  name: 'industryAllianceWorkIndexCon',
  watch: {},
  props: {
    changeTab: {
      type: Function,
    },
  },
  data() {
    var validateMobile = (rule, value, callback) => {
      const phoneReg = /^1[3-9]\d{9}$/;
      const result = phoneReg.test(this.ruleForm.mobile);
      if (!this.ruleForm.mobile) {
        callback(new Error('手机号不能为空'));
      } else {
        if (result) {
          callback();
        } else {
          callback(new Error('请填写正确的手机号'));
        }
      }
    };
    var validateImage = (rule, value, callback) => {
      if (!this.ruleForm.imageId) {
        callback(new Error('请上传图片'));
      } else {
        callback();
      }
    };
    return {
      publishOptions: [],
      addressOptions: [],
      imgVisible: false,
      dialogImageUrl: '',
      ruleForm: {
        id: '',
        start_date: '',
        end_date: '',
        name: '',
        manage_name: '',
        address: '',
        mobile: '',
        is_open: '1',
        num: '',
        introduce: '',
        image: '',
        imageId: '',
        town_id: '',
        village_id: '',
      },
      rules: {
        start_date: [{ required: true, message: '请填写', trigger: 'blur' }],
        end_date: [{ required: true, message: '请填写', trigger: 'blur' }],
        name: [{ required: true, message: '请填写', trigger: 'blur' }],
        address: [{ required: true, message: '请填写', trigger: 'blur' }],
        manage_name: [{ required: true, message: '请填写', trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        is_open: [{ required: true, message: '请填写', trigger: 'blur' }],
        num: [{ required: true, message: '请填写', trigger: 'blur' }],
        introduce: [{ required: true, message: '请填写', trigger: 'blur' }],
        image: [{ validator: validateImage, trigger: 'blur' }],
        village_id: [
          {
            required: true,
            message: '村名不能为空',
            trigger: 'blur',
          },
        ],
        town_id: [
          {
            required: true,
            message: '乡镇不能为空',
            trigger: 'blur',
          },
        ],
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
      town_id: '',
      village_id: '',
      audit_type: '',
      is_open: '',
      address: '',
      type: '',
      statusOptions: [
        {
          value: '',
          label: '状态(全部)',
        },
        {
          value: '0',
          label: '关闭预约',
        },
        {
          value: '1',
          label: '开放预约',
        },
      ],
      statusMap: {
        0: '关闭预约',
        1: '开放预约',
      },
      options: [],
      content: '',
      name: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      publishOptions: [],
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchType: 0,
      currentItem: {},
      detailVisible: false,
      deepForm: {},
      companyOptions: [],
      searchLoading: false,
      isEdit: false,
      editVisible: false,
      typeSecOptions: [
        {
          label: '申请',
          value: 1,
        },
        {
          label: '资料修改',
          value: 2,
        },
      ],
      fileList: [],
      action: '/web/public/upload',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      formAble: false,
    };
  },
  mounted() {
    this.fetchTown();
    this.fetchList();
  },
  methods: {
    popNew() {
      this.editVisible = true;
      setTimeout(() => {
        this.$refs['ruleForm'].resetFields();
        this.fileList = [];
      }, 200);
    },
    shutDetail() {
      this.detailVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            name: this.ruleForm.name,
            is_open: this.ruleForm.is_open,
            address: this.ruleForm.address,
            manage_name: this.ruleForm.manage_name,
            mobile: this.ruleForm.mobile,
            num: this.ruleForm.num,
            introduce: this.ruleForm.introduce,
            img_str: this.ruleForm.imageId,
            village_id: this.ruleForm.village_id,
            town_id: this.ruleForm.town_id,
            start_date: this.Dayjs(this.ruleForm.start_date).format('YYYY-MM-DD'),
            end_date: this.Dayjs(this.ruleForm.end_date).format('YYYY-MM-DD'),
          };
          if (!this.isEdit) {
            industryplantAdd(data).then((res) => {
              if (res && res.code == 0) {
                this.$message.success('操作成功');
                this.$refs[formName].resetFields();
                this.editVisible = false;
                this.fetchList();
              }
            });
          } else {
            data.id = this.ruleForm.id;
            industryplantEdit(data).then((res) => {
              if (res && res.code == 0) {
                this.$message.success('操作成功');
                this.$refs[formName].resetFields();
                this.editVisible = false;
                this.fetchList();
              }
            });
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
      this.editVisible = true;
      this.isEdit = true;
      setTimeout(() => {
        this.$refs['ruleForm'].resetFields();
        this.ruleForm.id = row.id;
        this.ruleForm.start_date = row.start_date;
        this.ruleForm.end_date = row.end_date;
        this.ruleForm.name = row.name;
        this.ruleForm.manage_name = row.manage_name;
        this.ruleForm.address = row.address;
        this.ruleForm.mobile = row.mobile;
        this.ruleForm.is_open = String(row.is_open);
        this.ruleForm.num = row.num;
        this.ruleForm.introduce = row.introduce;
        this.ruleForm.image = row.img_list[0];
        this.ruleForm.imageId = row.img_str;
        this.fileList = [
          {
            id: row.img_str,
            url: row.img_list[0],
          },
        ];
        this.ruleForm.town_id = row.town_id;
        this.ruleForm.village_id = row.village_id;
        this.fetchVillage(row.town_id);
      }, 200);
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
      this.is_open = '';
      this.name = '';
      this.currentPage = 1;
      this.town_id = '';
      this.village_id = '';
      this.address = '';
      this.timeRange = [];
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
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
    //   上传成功
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
    fetchList() {
      let data = {
        is_open: this.is_open,
        name: this.name,
        page: this.currentPage,
        page_size: this.pageSize,
        address: this.address,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      industryplantLists(data).then((res) => {
        if (res && res.code === 0) {
          res.data.data.forEach((ele, index) => (ele.index = index + 1));
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
    fetchTown() {
      TownInfo().then((res) => {
        if (res && res.code === 0) {
          let addressInfo = checkIdenity();
          //   if (addressInfo && addressInfo.town_id) {
          //     this.addressOptions = res.data.filter((ele) => {
          //       return ele.id == addressInfo.town_id;
          //     });
          //     this.town_id = addressInfo.town_id;
          //     this.fetchVillage(this.town_id);
          //   } else {
          this.addressOptions = res.data;
          //   }
        }
      });
    },
    townDialogFormChange(val) {
      this.publishOptions = [];
      this.ruleForm.village_id = '';
      this.fetchVillage(val);
    },
    townChange(val) {
      this.fetchVillage(val);
    },
    fetchVillage(val) {
      const data = {
        town_id: val,
      };
      VillageInfo(data).then((res) => {
        if (res && res.code === 0) {
          let addressInfo = checkIdenity();
          //   if (addressInfo && addressInfo.village_id) {
          //     this.publishOptions = res.data.filter((ele) => {
          //       return ele.id == addressInfo.village_id;
          //     });
          //     this.village_id = addressInfo.village_id;
          //   } else {
          this.publishOptions = res.data;
          //   }
        }
      });
    },
    toDetail(row) {
      this.$emit('changeTab', '1');
      this.$router.push({
        path: this.$route.path,
        query: {
          activeName: this.$route.query.activeName,
          subActive: 'second',
          name: row.name,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.addBtn {
  cursor: pointer;
}
.emptyHolder {
  width: 30px;
  margin-left: 10px;
}
.deleteBtnCon {
  width: 30px;
  box-sizing: border-box;
  padding-top: 14px;
}
.flexFormItemCon {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
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
  height: 540px;
}
.scroll2Con {
  overflow-y: auto;
  height: 440px;
}
.scroll1Con {
  overflow-y: auto;
  height: 480px;
  width: 100%;
  overflow-x: hidden;
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
.industryAllianceWorkIndexCon {
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
.industryAllianceWorkIndexCon {
  .removePlus {
    .el-upload--picture-card {
      display: none;
    }
  }
  .upload2Dialog {
    .el-dialog {
      height: 660px;
    }
  }
  .upload3Dialog {
    .el-dialog {
      height: 630px;
    }
  }
}
</style>

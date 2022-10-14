<template>
  <div class="industryAllianceBodyIndexCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="name" placeholder="姓名"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="card" placeholder="证件号码"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="town_id" class="fixInput" placeholder="请选择乡镇" @change="townChange(town_id)">
            <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="village_id" class="fixInput" placeholder="请选择村名">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.village_name" :value="item.id"></el-option>
          </el-select>
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
          <el-table-column prop="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="证件号码" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.card }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="性别" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.gender }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="家庭地址" align="center"></el-table-column>
          <el-table-column label="土地经营面积" prop="area" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">
              <div>{{ statusMap[scope.row.status] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popAuditItem(scope.row)" v-if="scope.row.status == 0">审批</el-button>
                <el-button type="text" @click="popDetail(scope.row)">查看</el-button>
                <el-button type="text" v-if="scope.row.status != 4" @click="popEdit(scope.row)">编辑</el-button>
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
      <div class="scrollCon">
        <ContentDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutDetail">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload2Dialog" title="审核" width="620px" :visible.sync="auditVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll1Con">
        <el-radio v-model="auditValue" label="2">通过</el-radio>
        <el-radio v-model="auditValue" label="3">不通过</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutAudit">确 定</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload1Dialog" title="编辑" width="620px" :visible.sync="editVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll2Con">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入" disabled></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="card">
            <el-input v-model="ruleForm.card" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input maxlength="11" v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select :disabled="formAble" v-model="ruleForm.gender" class="fixInput" placeholder="性别">
              <el-option v-for="item in typeSecOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开户银行" prop="bank_name">
            <el-input v-model="ruleForm.bank_name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="银行卡号" prop="bank_account">
            <el-input v-model="ruleForm.bank_account" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="所属乡镇" prop="town_id">
            <el-select v-model="ruleForm.town_id" class="fixInput" placeholder="请选择乡镇" @change="town2Change(ruleForm.town_id)">
              <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属村" prop="village_id">
            <el-select v-model="ruleForm.village_id" class="fixInput" placeholder="请选择村名">
              <el-option v-for="item in publish2Options" :key="item.id" :label="item.village_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="家庭地址" prop="address">
            <el-input v-model="ruleForm.address" placeholder="请输入家庭地址"></el-input>
          </el-form-item>
          <el-form-item label="土地经营面积" prop="area">
            <el-input-number v-model="ruleForm.area" :precision="2" :step="1" :max="99999999" :min="0" controls-position="right" placeholder="输入土地经营面积"></el-input-number
            ><span class="inputNumberUnit">亩</span>
          </el-form-item>
          <el-form-item label="经营权合同及证明" prop="image" class="flexFormItem">
            <el-upload
              :class="[fileList.length > 8 ? 'removePlus' : '']"
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
              <div class="el-upload__tip" slot="tip">只能上传9张jpg/png/gif图片,且大小不超过10M</div>
              <template slot="file" slot-scope="{ file }">
                <div class="upload-file-content">
                  <template>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" />
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
    <el-dialog :visible.sync="imgVisible" class="setMiddleDialog upload5Dialog" title="图片" width="620px">
      <div class="scroll2Con">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { industryFarLists, industryFarAudit, industryFarInfo, industryFarExport, industryFarEdit } from '@/api/bee';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import ContentDetail from './index/common.vue';
export default {
  components: {
    ContentDetail,
  },
  name: 'industryAllianceBodyIndexCon',
  data() {
    var validateImage = (rule, value, callback) => {
      if (!this.fileList.length) {
        callback(new Error('请上传图片'));
      } else {
        callback();
      }
    };
    return {
      imgVisible: false,
      dialogImageUrl: '',
      ruleForm: {
        image: '',
        imageId: '',
        area: '',
        name: '',
        card: '',
        mobile: '',
        gender: '',
        town_id: '',
        village_id: '',
        address: '',
        bank_name: '',
        bank_account: '',
      },
      rules: {
        date: [{ required: true, message: '请填写', trigger: 'blur' }],
        area: [{ required: true, message: '请填写', trigger: 'blur' }],
        name: [{ required: true, message: '请填写', trigger: 'blur' }],
        card: [{ required: true, message: '请填写', trigger: 'blur' }],
        mobile: [{ required: true, message: '请填写', trigger: 'blur' }],
        gender: [{ required: true, message: '请填写', trigger: 'blur' }],
        address: [{ required: true, message: '请填写', trigger: 'blur' }],
        town_id: [{ required: true, message: '请填写', trigger: 'blur' }],
        village_id: [{ required: true, message: '请填写', trigger: 'blur' }],
        image: [{ validator: validateImage, trigger: 'blur' }],
        bank_name: [{ required: true, message: '请填写', trigger: 'blur' }],
        bank_account: [{ required: true, message: '请填写', trigger: 'blur' }],
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
      status: '',
      type: '',
      addressOptions: [],
      publish2Options: [],
      statusMap: {
        0: '待审批',
        1: '审批中',
        2: '已通过',
        3: '已拒绝',
        4: '已取消',
      },
      statusOptions: [
        {
          value: '',
          label: '状态(全部)',
        },
        {
          value: '0',
          label: '待审批',
        },
        {
          value: '1',
          label: '审批中',
        },
        {
          value: '2',
          label: '已通过',
        },
        {
          value: '3',
          label: '已拒绝',
        },
        {
          value: '4',
          label: '已取消',
        },
      ],
      options: [],
      content: '',
      name: '',
      card: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      tableData: [],
      loading: false,
      publishOptions: [],
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      currentItem: {},
      detailVisible: false,
      auditVisible: false,
      auditValue: '2',
      fileList: [],
      action: '/web/public/upload',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      editVisible: false,
      formAble: false,
      typeSecOptions: [
        {
          label: '男',
          value: '男',
        },
        {
          label: '女',
          value: '女',
        },
      ],
    };
  },
  mounted() {
    this.fetchTown();
    this.fetchList();
  },
  methods: {
    handleRemoveFile(file) {
      let trackIndex = this.fileList.findIndex((ele) => {
        return ele.id == file.id;
      });
      this.fileList.splice(trackIndex, 1);
      this.$refs.ruleForm.validateField('image');
    },
    handlePicturePreview(file) {
      this.imgVisible = true;
      this.dialogImageUrl = file.url;
    },
    //   上传成功
    successFile(res) {
      this.fileList.push({
        id: res.data.id,
        url: res.data.url,
      });
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
    exportAction() {
      industryFarExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '主题管理农户管理导出' + Date.now() + '.xlsx';
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
            id: this.ruleForm.id,
            name: this.ruleForm.name,
            card: this.ruleForm.card,
            mobile: this.ruleForm.mobile,
            gender: this.ruleForm.gender,
            town_id: this.ruleForm.town_id,
            village_id: this.ruleForm.village_id,
            address: this.ruleForm.address,
            area: this.ruleForm.area,
            bank_name: this.ruleForm.bank_name,
            bank_account: this.ruleForm.bank_account,
          };
          data.manage_img_str = this.fileList
            .map((ele) => {
              return ele.id;
            })
            .join(',');
          industryFarEdit(data).then((res) => {
            if (res && res.code == 0) {
              this.$message.success('操作成功');
              this.$refs[formName].resetFields();
              this.editVisible = false;
              this.fetchList();
            }
          });
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
    popAuditItem(row) {
      this.currentItem = row;
      this.auditVisible = true;
    },
    popDetail(row) {
      this.detailVisible = true;
      this.currentItem = row;
    },
    fetchTown() {
      TownInfo().then((res) => {
        if (res && res.code === 0) {
          let addressInfo = checkIdenity();
          if (addressInfo && addressInfo.town_id) {
            this.addressOptions = res.data.filter((ele) => {
              return ele.id == addressInfo.town_id;
            });
            this.town_id = addressInfo.town_id;
            this.fetchVillage(addressInfo.town_id);
          } else {
            this.addressOptions = res.data;
          }
        }
      });
    },
    town2Change(val) {
      this.fetch2Village(val);
      this.ruleForm.village_id = '';
      this.publish2Options = [];
    },
    fetch2Village(val) {
      const data = {
        town_id: val,
      };
      VillageInfo(data).then((res) => {
        if (res && res.code === 0) {
          this.publish2Options = res.data;
        }
      });
    },
    townChange(val) {
      this.fetchVillage(val);
      this.village_id = '';
      this.publishOptions = [];
    },
    fetchVillage(val) {
      const data = {
        town_id: val,
      };
      VillageInfo(data).then((res) => {
        if (res && res.code === 0) {
          let addressInfo = checkIdenity();
          if (addressInfo && addressInfo.village_id) {
            this.publishOptions = res.data.filter((ele) => {
              return ele.id == addressInfo.village_id;
            });
            this.village_id = addressInfo.village_id;
          } else {
            this.publishOptions = res.data;
          }
        }
      });
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.status = '';
      this.name = '';
      this.card = '';
      this.currentPage = 1;
      this.town_id = '';
      this.village_id = '';
      this.timeRange = [];
      this.fetchList();
    },
    timeFilter(val) {
      return this.Dayjs(val).format('YYYY-MM-DD');
    },
    fetchList() {
      let data = {
        status: this.status,
        name: this.name,
        card: this.card,
        page: this.currentPage,
        page_size: this.pageSize,
        town_id: this.town_id,
        village_id: this.village_id,
      };
      if (this.timeRange && this.timeRange.length) {
        data.start_time = this.timeFilter(this.timeRange[0]) + ` 00:00:00`;
        data.end_time = this.timeFilter(this.timeRange[1]) + ` 23:59:59`;
      }
      industryFarLists(data).then((res) => {
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
    shutAudit() {
      let data = {
        status: this.auditValue,
        id: this.currentItem.id,
      };
      industryFarAudit(data).then((res) => {
        if (res && res.code == 0) {
          this.auditVisible = false;
          this.$message.success('操作成功');
          this.fetchList();
        }
      });
    },
    cancelAudit() {
      this.auditVisible = false;
    },
    popEdit(row) {
      this.editVisible = true;
      industryFarInfo({
        id: row.id,
      }).then((res) => {
        if (res && res.code == 0) {
          this.ruleForm.id = res.data.id;
          this.ruleForm.name = res.data.name;
          this.ruleForm.card = res.data.card;
          this.ruleForm.mobile = res.data.mobile;
          this.ruleForm.gender = res.data.gender;
          this.ruleForm.town_id = res.data.town_id;
          this.ruleForm.village_id = res.data.village_id;
          this.ruleForm.address = res.data.address;
          this.ruleForm.area = res.data.area;
          this.ruleForm.bank_name = res.data.bank_name;
          this.ruleForm.bank_account = res.data.bank_account;
          this.fetch2Village(res.data.town_id);
          let ids = res.data.manage_img_str.split(',');
          let mix = ids.map((ele, index) => {
            return {
              id: ele,
              url: res.data.manage_img_list[index],
            };
          });
          this.fileList = mix;
        }
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
  height: 280px;
}
.scroll2Con {
  overflow-y: auto;
  height: 320px;
}
.scroll1Con {
  overflow-y: auto;
  height: 60px;
}
.scroll2Con {
  overflow-y: auto;
  height: 480px;
  overflow-x: hidden;
}
.inputNumberUnit {
  margin-left: 20px;
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
.industryAllianceBodyIndexCon {
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
.industryAllianceBodyIndexCon {
  .removePlus {
    .el-upload--picture-card {
      display: none;
    }
  }
  .upload3Dialog {
    .el-dialog {
      height: 460px;
    }
  }
  .upload2Dialog {
    .el-dialog {
      height: 240px;
    }
  }
  .upload5Dialog {
    .el-dialog {
      height: 660px;
    }
  }
  .upload1Dialog {
    .el-dialog {
      height: 670px;
    }
  }
}
</style>

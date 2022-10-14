<template>
  <div class="cropBeeCon">
    <div class="innerCon">
      <div class="blockArea">
        <Blocks :array="blockArray" />
      </div>
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="town_id" class="fixInput" placeholder="请选择乡镇" @change="townChange(town_id)">
            <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="village_id" class="fixInput" placeholder="请选择村名">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.village_name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model.trim="company_name" placeholder="企业名称"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="type" class="fixInput" placeholder="请选择性质">
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="status" class="fixInput" placeholder="请选择性质">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="btnarea">
        <el-button type="primary" @click="popUpload">上传名单</el-button>
        <el-button type="primary" @click="downloadAction">下载模版</el-button>
        <el-button type="primary" @click="batchExport">批量导出</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="town_name" label="乡镇" align="center"></el-table-column>
          <el-table-column label="村名" prop="village_name" align="center"></el-table-column>
          <el-table-column prop="company_name" label="企业名称" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.company_name || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="legal_rep" label="法人代表" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="access_hive_num" label="蜂箱数" align="center"></el-table-column>
          <el-table-column prop="access_type" label="性质" align="center">
            <template slot-scope="scope">
              <div>{{ typeMap[scope.row.access_type] }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="100">
            <template slot-scope="scope">
              <div>{{ statusMap[scope.row.status] }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="star" label="评级" align="center">
            <template slot-scope="scope">
              <div>{{ (scope.row.star && starMap[scope.row.star]) || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="matchNum" label="结对户数" align="center"></el-table-column>
          <el-table-column prop="profitTotal" label="收益(元)" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.profitTotal || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="receiptTotal" label="已收款(元)" align="center">
            <template slot-scope="scope">
              <span @click="popBenefit(scope.row)">
                <el-link type="primary">{{ scope.row.receiptTotal || '-' }}</el-link>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="type_name" label="养蜂信息" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.reportNum ? scope.row.reportNum + '次' : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type_name" label="工作" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workNum ? scope.row.workNum + '次' : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type_name" label="培训" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.trainNum ? scope.row.trainNum + '次' : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240">
            <template slot-scope="scope">
              <div>
                <el-button type="text" v-if="scope.row.major_id && scope.row.status == 2" @click="popPayment(scope.row)">打款</el-button>
                <el-button type="text" v-if="scope.row.major_id" @click="popDetail(scope.row)">查看详情</el-button>
                <el-button type="text" @click="popEditItem(scope.row)">编辑</el-button>
                <el-button type="text" @click="popDeleteMainItem(scope.row)">删除</el-button>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="note">
        注：星级评定一年一次。核定的蜂箱以上年度的养殖蜂箱为准，五星核准帮扶箱数为该养殖户上年度养殖箱数的80%；四星核准帮扶箱数为该养殖户上年度养殖箱数的70%；三星核准帮扶箱数为该养殖户上年度养殖箱数的50%
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
    <el-dialog class="setMiddleDialog uploadDialog" title="上传文件" width="630px" :before-close="handleCloseForNew" :visible.sync="addVisible">
      <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label=" " prop="file" class="flexFormItem">
          <el-upload
            :headers="headers"
            ref="upload"
            :on-success="successFile"
            :on-error="failedFile"
            :action="action"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :data="extraParams"
            :limit="1"
            :on-remove="handleRemoveFile"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary" v-if="!fileList.length">点击上传</el-button>
            <div class="el-upload__tip" slot="tip">支持上传文件格式：xls，xlsx单个文件大小在50M以内。</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="medium_dialog" title="编辑" width="600px" :before-close="handleCloseForEdit" :visible.sync="editVisible">
      <el-form :model="editForm" status-icon :rules="editRules" ref="editForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="乡镇" prop="town_id" class="flexFormItem">
          <el-select v-model="editForm.town_id" class="fixInput" placeholder="请选择乡镇" @change="townDialogFormChange(editForm.town_id)">
            <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="村名" prop="village_id" class="flexFormItem">
          <el-select v-model="editForm.village_id" class="fixInput" placeholder="请选择村名">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.village_name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name" class="flexFormItem">
          <el-input v-model="editForm.name" maxlength="10" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile" class="flexFormItem">
          <el-input v-model.trim="editForm.mobile" maxlength="11" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="蜂箱数" prop="hive_num" class="flexFormItem">
          <el-input v-model.trim="editForm.hive_num" maxlength="10" placeholder="请输入蜂箱数"></el-input>
        </el-form-item>
        <el-form-item label="性质" prop="type" class="flexFormItem">
          <el-select v-model="editForm.type" class="fixInput" placeholder="请选择性质">
            <el-option v-for="item in typeCopyOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetEditField('editForm')">取 消</el-button>
        <el-button type="primary" @click="confirmEditAction('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload2Dialog" title="打款" width="670px" :visible.sync="paymentVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <cropPaymentForm :selectId="beenSelected" @shutPayment="closePayment" v-if="paymentVisible" />
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="medium_dialog" title="查看汇款单" width="600px" :visible.sync="remitVisible" :close-on-press-escape="false">
      <div class="setHeight">
        <cropRemit :data="remitData" v-if="remitVisible" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutRemit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="setMiddleDialog upload3Dialog" title="详情" width="600px" :visible.sync="detailVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="cropDetailCon">
        <cropDetail v-if="detailVisible" :data="currentItem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { majorManageLists, majorManageDelete, majorManageEdit, beeMajorManageExport, majorManageInfo, majorManageReceipt } from '@/api/bee';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import Blocks from '../components/Blocks.vue';
import cropPaymentForm from './components/cropPaymentForm.vue';
import cropRemit from './components/cropRemit.vue';
import cropDetail from './components/cropDetail.vue';
export default {
  components: {
    Blocks,
    cropPaymentForm,
    cropRemit,
    cropDetail,
  },
  name: 'cropBeeCon',
  data() {
    var validateFile = (rule, value, callback) => {
      if (!this.fileList.length) {
        callback(new Error('请上传文件'));
      } else {
        callback();
      }
    };
    return {
      detailVisible: false,
      beenSelected: [],
      paymentVisible: false,
      blockArray: [
        {
          title: '中蜂企业(家)',
          amount: '0',
        },
        {
          title: '总养殖箱数(箱)',
          amount: '0',
        },
        {
          title: '可接对箱数(箱)',
          amount: '0',
        },
        {
          title: '结对企业(家)',
          amount: '0',
        },
        {
          title: '应发放(元)',
          amount: '0',
        },
        {
          title: '应发放户数(户)',
          amount: '0',
        },
        {
          title: '已发放(元)',
          amount: '0',
        },
      ],
      action: '/web/plan/bee/MajorManage/import',
      extraParams: {},
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      fileList: [],
      editVisible: false,
      editForm: {
        type: '',
        village_id: '',
        town_id: '',
        name: '',
        mobile: '',
        hive_num: '',
        id: '',
      },
      editRules: {
        type: [
          {
            required: true,
            message: '性质不能为空',
            trigger: 'blur',
          },
        ],
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
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur',
          },
        ],
        mobile: [
          {
            required: true,
            message: '联系电话不能为空',
            trigger: 'blur',
          },
        ],
        hive_num: [
          {
            required: true,
            message: '蜂箱数不能为空',
            trigger: 'blur',
          },
        ],
      },
      newForm: {
        file: '',
        fileId: '',
        type: '',
      },
      newRules: {
        file: [{ validator: validateFile, trigger: 'blur' }],
        type: [
          {
            required: true,
            message: '请选择上传类型',
            trigger: 'blur',
          },
        ],
      },
      addVisible: false,
      type: '',
      name: '',
      mobile: '',
      addressOptions: [],
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      status: '',
      statusOptions: [
        {
          id: '',
          name: '状态(全部)',
        },
        {
          id: '0',
          name: '待审批',
        },
        {
          id: '2',
          name: '已通过',
        },
        {
          id: '3',
          name: '已拒绝',
        },
        {
          id: '5',
          name: '待提交资料',
        },
        {
          id: '6',
          name: '退出申请审批中',
        },
        {
          id: '7',
          name: '已退出',
        },
      ],
      typeOptions: [
        {
          id: '',
          name: '性质(全部)',
        },
        {
          id: '1',
          name: '合作社',
        },
        {
          id: '2',
          name: '家庭农场',
        },
        {
          id: '3',
          name: '企业',
        },
      ],
      typeCopyOptions: [
        {
          id: '1',
          name: '合作社',
        },
        {
          id: '2',
          name: '家庭农场',
        },
        {
          id: '3',
          name: '企业',
        },
      ],
      options: [],
      town_id: '',
      tableData: [],
      loading: false,
      publishOptions: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      village_id: '',
      currentItem: {},
      remitData: [],
      remitVisible: false,
      company_name: '',
      starMap: {
        1: '一星',
        2: '二星',
        3: '三星',
        4: '四星',
        5: '五星',
      },
      statusMap: {
        0: '待审核',
        2: '已通过',
        3: '已拒绝',
        5: '待提交资料',
        null: '待提交资料',
        7: '已退出',
        6: '退出申请审批中',
      },
      typeMap: {
        1: '合作社',
        2: '家庭农场',
        3: '企业',
      },
    };
  },
  mounted() {
    this.fetchList();
    this.fetchTown();
  },
  methods: {
    popDetail(row) {
      majorManageInfo({
        major_id: row.major_id,
      })
        .then((res) => {
          if (res && res.code == 0) {
            this.currentItem = res.data;
            this.detailVisible = true;
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    closeDetail() {
      this.detailVisible = false;
    },
    shutRemit() {
      this.remitVisible = false;
    },
    popBenefit(row) {
      this.currentItem = row;
      if (row.receiptTotal) {
        majorManageReceipt({
          major_id: row.major_id,
          page: 1,
          page_size: 99999,
        })
          .then((res) => {
            if (res && res.code == 0) {
              this.remitData = res.data.data;
            }
            this.remitVisible = true;
          })
          .catch((err) => {
            console.log('err', err);
          });
      }
    },
    popPayment(row) {
      this.paymentVisible = true;
      this.beenSelected = [row];
    },
    closePayment() {
      this.paymentVisible = false;
      this.fetchList();
    },
    batchExport() {
      beeMajorManageExport()
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = '中蜂产业折股量化中蜂企业批量导出' + Date.now() + '.xlsx';
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
    downloadAction() {
      let url = '/上传养殖大户资格名单模板.xlsx';
      var nowA = document.createElement('a');
      nowA.setAttribute('href', url);
      nowA.setAttribute('download', name);
      nowA.style.display = 'none';
      document.body.appendChild(nowA);
      nowA.click();
      document.body.removeChild(nowA);
    },
    resetEditField(formName) {
      this.$refs[formName].resetFields();
      this.editVisible = false;
    },
    confirmEditAction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            type: this.editForm.type,
            village_id: this.editForm.village_id,
            town_id: this.editForm.town_id,
            name: this.editForm.name,
            mobile: this.editForm.mobile,
            hive_num: this.editForm.hive_num,
            id: this.editForm.id,
          };
          majorManageEdit(data).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('编辑成功');
              this.editVisible = false;
              this.$refs['editForm'].resetFields();
              this.currentPage = 1;
              this.fetchList();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    popEditItem(row) {
      this.editVisible = true;
      this.editForm = {
        type: String(row.access_type),
        village_id: row.village_id,
        town_id: row.town_id,
        name: row.legal_rep,
        mobile: row.mobile,
        hive_num: row.access_hive_num,
        id: row.id,
      };
      this.townDialogChange(row.town_id);
    },
    handleCloseForEdit(done) {
      this.$refs['editForm'].resetFields();
      done();
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
            this.fetchVillage(this.town_id);
          } else {
            this.addressOptions = res.data;
          }
        }
      });
    },
    townDialogChange(val) {
      this.fetchVillage(val);
    },
    townDialogFormChange(val) {
      this.publishOptions = [];
      this.editForm.village_id = '';
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
    popDeleteMainItem(row) {
      this.$alert(`确定删除该条目`, '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action == 'confirm') {
            majorManageDelete({
              id: row.id,
            })
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('删除成功');
                  this.currentPage = 1;
                  this.fetchList();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
      });
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.village_id = '';
      this.town_id = '';
      this.type = '';
      this.status = '';
      this.company_name = '';
      this.currentPage = 1;
      this.fetchList();
    },
    fetchList() {
      let data = {
        village_id: this.village_id,
        town_id: this.town_id,
        type: this.type,
        status: this.status,
        company_name: this.company_name,
        page: this.currentPage,
        page_size: this.pageSize,
      };
      majorManageLists(data).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.blockArray = [
            {
              title: '中蜂企业(家)',
              amount: res.data.erpNum,
            },
            {
              title: '总养殖箱数(箱)',
              amount: res.data.hiveNum,
            },
            {
              title: '可接对箱数(箱)',
              amount: res.data.actHiveNum,
            },
            {
              title: '结对企业(家)',
              amount: res.data.matchErpNum,
            },
            {
              title: '应发放(元)',
              amount: res.data.shouldAmount,
            },
            {
              title: '应发放户数(户)',
              amount: res.data.remitErpNum,
            },
            {
              title: '已发放(元)',
              amount: res.data.receiptAmount,
            },
          ];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    popUpload() {
      this.addVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多上传1个文件');
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
    },
    failedFile(err) {
      console.log('err', err);
      this.$message.error('上传失败');
    },
    successFile(res, file) {
      if (res.code == 0) {
        this.$message.success('上传成功');
        window.timer2 = setTimeout(() => {
          this.addVisible = false;
          this.resetField();
          clearTimeout(window.timer2);
          this.currentPage = 1;
          this.fetchList();
        }, 700);
      } else {
        this.$message.error('上传失败');
      }
    },
    handleCloseForNew(done) {
      this.$refs['newForm'].resetFields();
      this.fileList = [];
      done();
      this.currentPage = 1;
      this.fetchList();
    },
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      const isExcel = file.type == 'application/vnd.ms-excel' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        this.$message.error('请上传xls或者xlsx格式');
        return false;
      }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB');
        return false;
      }
    },
    resetField() {
      this.$refs['newForm'].resetFields();
      this.fileList = [];
    },
    shutUpload() {
      this.$refs.upload.submit();
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
  },
};
</script>
<style scoped lang="scss">
.setHeight {
  height: 300px;
  overflow-y: scroll;
}
.note {
  font-size: 13px;
  color: #999;
  margin-top: 10px;
}
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.cropBeeCon {
  background-color: #fff;
  .innerCon {
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
.tableCon {
}
.cropDetailCon {
  height: 460px;
  overflow-y: scroll;
}
</style>
<style lang="scss">
.cropBeeCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
  .upload2Dialog {
    .el-dialog {
      height: 650px;
    }
  }
  .upload3Dialog {
    .el-dialog {
      height: 650px;
    }
  }
}
</style>

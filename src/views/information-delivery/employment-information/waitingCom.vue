<template>
  <div class="base_warp employment_information">
    <div class="search_content">
      <el-form ref="form" :model="formData">
        <!-- <el-col :span="6">
          <el-form-item label="就业ID" prop="id">
            <el-input v-model="formData.id" placeholder="" />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="发布人" prop="operator">
            <el-input v-model="formData.operator" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标题" prop="issue_title">
            <el-input v-model="formData.issue_title" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发布类型">
            <el-select v-model="formData.issue_category" clearable placeholder="全部">
              <el-option v-for="item in selectFirstOpts" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发布分类">
            <el-select v-model="formData.crop_category" clearable placeholder="全部">
              <el-option v-for="item in selectOpts" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="发布时间" prop="date">
            <el-date-picker v-model="formData.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审核类型" prop="audit_type">
            <el-select v-model="formData.audit_type" clearable placeholder="全部">
              <el-option v-for="item in o2ptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="button_list">
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="reset('form')">重置</el-button>
          </div>
        </el-col>
      </el-form>
    </div>
    <!-- <div class="addBtnArea">
      <el-button

        type="primary"
        @click="
          addVisible = true
          editFlag = false
        "
        >岗位发布</el-button
      >
    </div> -->
    <div class="table_box">
      <el-table v-loading="loading" :data="tableData">
        <el-table-column label="就业ID" prop="id" align="center" />
        <el-table-column label="发布人" prop="operator" align="center" />
        <el-table-column label="发布类型" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.edit_status == 1 ? scope.row.edit_info.category_data : scope.row.category_data }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发布分类" align="center" prop="category_data">
          <template slot-scope="scope">
            <div>{{ scope.row.edit_status == 1 ? scope.row.edit_info.crop_category_name : scope.row.crop_category_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="issue_title" align="center"
          ><template slot-scope="scope">
            <div>{{ scope.row.edit_status == 1 ? scope.row.edit_info.issue_title : scope.row.issue_title }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发布内容" prop="issue_content" align="center"
          ><template slot-scope="scope">
            <div>{{ scope.row.edit_status == 1 ? scope.row.edit_info.issue_content : scope.row.issue_content }}</div>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="image_path" align="center">
          <template slot-scope="scope">
            <div class="image_box" v-if="scope.row.edit_status == 1">
              <preview-image :src="scope.row.edit_info.image_path ? scope.row.edit_info.image_path[0] : ''" :src-list="scope.row.edit_info.image_path ? scope.row.edit_info.image_path : []" />
              <span>{{ '共' + (scope.row.edit_info.image_path ? scope.row.edit_info.image_path.length : 0) + '张' }}</span>
            </div>
            <div class="image_box" v-else>
              <preview-image :src="scope.row.image_path ? scope.row.image_path[0] : ''" :src-list="scope.row.image_path ? scope.row.image_path : []" />
              <span>{{ '共' + (scope.row.image_path ? scope.row.image_path.length : 0) + '张' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价（元）" prop="price" align="center"
          ><template slot-scope="scope">
            <div>{{ scope.row.edit_status == 1 ? scope.row.edit_info.price : scope.row.price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" align="center"
          ><template slot-scope="scope">
            <div>{{ scope.row.edit_status == 1 ? scope.row.edit_info.unit : scope.row.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所在地址" prop="address" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.edit_status == 1 ? scope.row.edit_info.address : scope.row.address }}</div>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="mobile" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.edit_status == 1 ? scope.row.edit_info.mobile : scope.row.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column label="审核类型" prop="audit_status" width="180" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.audit_status == 1 ? '新增审核' : '编辑审核' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="created_at" align="center" width="180" />
        <!-- <el-table-column label="更新时间" prop="updated_at" align="center"></el-table-column> -->
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)">审批</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="medium_dialog" title="审核" :visible.sync="auditVisible" :before-close="handleCloseAudit" destroy-on-close>
      <auditCom :detail-data="detailData" />
      <el-form :model="auditForm" status-icon :rules="auditRules" ref="auditForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="审批" class="flexFormItem" prop="status">
          <el-radio-group v-model="auditForm.status">
            <el-radio label="2">通过</el-radio>
            <el-radio label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因" class="flexFormItem">
          <el-input placeholder="请输入原因" type="textarea" :row="5" v-model="auditForm.audit_comment"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAuditField('auditForm')">取消</el-button>
        <el-button type="primary" @click="confirmAuditAction('auditForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import deliver from './modules/deliver';
import auditCom from './modules/auditCom';
import detail from './modules/detail';
import previewImage from '@/components/previewImage/index';
import { CheckDetail, CheckList, DeleteMessage, issue_messageTypeList, auditIssue } from '@/api/information';
export default {
  components: {
    deliver,
    detail,
    previewImage,
    auditCom,
  },
  data() {
    return {
      formData: {
        issue_type: 2, // 就业信息
        start_at: '',
        end_at: '',
        crop_category: '',
        issue_category: '',
        issue_content: '',
        id: undefined,
        date: [],
        issue_title: '',
        audit_type: '',
      },
      isDeleting: false, // 删除状态标识
      detailData: {},
      addVisible: false,
      detailVisible: false,
      selectFirstOpts: [
        { label: '求职', value: 1 },
        { label: '招聘', value: 2 },
      ],
      o2ptions: [
        { label: '新增审核', value: 1 },
        { label: '修改审核', value: 2 },
      ],
      selectOpts: [],
      currentItem: {},
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      initFunc: CheckList,
      editFlag: false,
      auditForm: {
        audit_comment: '',
        status: '2',
        id: '',
        audit_status: '',
      },
      auditVisible: false,
      auditRules: {
        status: [
          {
            required: true,
            message: '请选择发布类型',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  watch: {
    auditVisible(newVal) {
      if (!newVal) this.detailData = {};
    },
  },
  mounted() {
    this.destroy();
    this.getList();
    this.fetchTypeListForHome();
  },
  methods: {
    fetchTypeListForHome() {
      issue_messageTypeList({
        page_size: 10000,
        page: 1,
        type: 4,
      })
        .then((res) => {
          if (res && res.code === 0) {
            this.selectOpts = res.data.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    async getList() {
      if (this.initFunc) {
        const params = {
          page: this.currentPage,
          page_size: this.pageSize,
          ...this.formData,
          audit_status: 1,
        };
        this.loading = true;
        try {
          const { code, data } = await this.initFunc(params);
          if (code === 0) {
            this.tableData = data.data;
            this.total = data.total;
          }
        } catch (err) {
          console.log(err);
        }
        this.loading = false;
      }
    },
    async reset(formName) {
      this.formData.crop_category = '';
      this.formData.issue_category = '';
      this.$refs[formName] && this.$refs[formName].resetFields();
      this.changeDate && (await this.changeDate());
      this.getList();
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        'Y+': date.getFullYear().toString(),
        'm+': (date.getMonth() + 1).toString(),
        'd+': date.getDate().toString(),
        'H+': date.getHours().toString(),
        'M+': date.getMinutes().toString(),
        'S+': date.getSeconds().toString(),
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
        }
      }
      return fmt;
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.getList();
    },
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    handleDelete(id) {
      this.$confirm('确定删除？')
        .then((_) => {
          this.deleteInfo(id);
        })
        .catch((_) => {});
    },
    deleteInfo(id) {
      this.isDeleting = true;
      DeleteMessage({ id: String(id) })
        .then(({ code }) => {
          if (code === 0) {
            this.$message({ type: 'success', message: '删除成功' });
            this.detailVisible = false;
            this.getList();
          }
          this.isDeleting = false;
        })
        .catch((_) => {
          this.isDeleting = false;
        });
    },
    changeDate() {
      console.log(this.formData.date);
      this.formData.start_at = this.formData.date[0] ? this.dateFormat('YYYY-mm-dd HH:MM:SS', this.formData.date[0]) : '';
      this.formData.end_at = this.formData.date[1] ? this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date(this.formData.date[1].getTime() + 86400000 - 1)) : '';
    },
    closeDialog() {
      this.addVisible = false;
      this.detailVisible = false;
    },
    showEdit(row) {
      this.currentItem = row;
      this.editFlag = true;
      this.addVisible = true;
    },
    showDetail(row) {
      this.auditForm.id = row.id;
      this.auditForm.audit_status = row.audit_status;
      this.auditForm.edit_status = row.edit_status;
      this.auditVisible = true;
      if (row.edit_status == 1) {
        this.detailData = row.edit_info;
      } else {
        this.detailData = row;
      }
      //   const params = {
      //     id: String(row.id),
      //     issue_type: 2
      //   }
      //   CheckDetail(params).then(({ code, data }) => {
      //     if (code === 0) {
      //       this.detailData = data
      //     } else {
      //       this.detailVisible = false
      //     }
      //   })
    },
    resetAuditField(formName) {
      this.$refs[formName].resetFields();
    },
    handleCloseAudit(done) {
      this.auditForm.audit_comment = '';
      this.auditForm.status = '2';
      this.$refs['auditForm'].resetFields();
      done();
    },
    confirmAuditAction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            status: this.auditForm.status,
            comment: this.auditForm.audit_comment,
            type: this.auditForm.audit_status == 1 ? '1' : '2',
          };
          data.id = String(this.auditForm.id);
          const requestAction = (data) => {
            auditIssue(data)
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('操作成功');
                  this.currentPage = 1;
                  this.getList();
                  this.auditForm.audit_comment = '';
                  this.auditForm.status = '2';
                  this.$refs.auditForm.resetFields();
                  this.auditVisible = false;
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          };
          if (data.status == 3) {
            if (data.comment) {
              requestAction(data);
            } else {
              this.$message.error('请输入拒绝原因');
            }
          } else {
            requestAction(data);
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.addBtnArea {
  margin-bottom: 20px;
  padding-left: 30px;
}
</style>

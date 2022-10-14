<template>
  <div class="beeQuantifyCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <header>
      <div class="header-top">
        <div class="topLeft">
          <div class="header-item">
            <el-select v-model="auditStatus" size="medium" placeholder="请选择审核状态" @change="statusChange">
              <el-option v-for="(item, index) in auditStatusList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </div>
        </div>
        <div class="header-export-div" v-if="tabArray.length && this.userType == '1'" key="1">
          <el-button size="medium" class="header-export" @click="exportPassedList" :disabled="exportPassedDisabled">导出通过名单</el-button>
          <el-button size="medium" class="header-search" @click="popNameList">代养协议名单</el-button>
        </div>
        <div class="header-export-div" v-if="tabArray.length && this.userType == '2'" key="2">
          <el-button size="medium" class="header-export" @click="exportPassedList" :disabled="exportPassedDisabled">导出通过名单</el-button>
          <el-button size="medium" class="header-search" @click="popNameList">代养协议名单</el-button>
        </div>
      </div>
    </header>
    <!-- 表格 -->
    <el-table class="table-info" v-loading="loading" :data="tableData" key="1" v-if="this.userType == '1'">
      <el-table-column prop="company_name" label="申报单位名称" align="center"></el-table-column>
      <el-table-column prop="credit_code" label="社会统一信用代码" width="150" align="center"></el-table-column>
      <el-table-column prop="linkman" label="联系人" align="center"></el-table-column>
      <el-table-column prop="linkman_mobile" label="电话" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.linkman_mobile">
            {{ scope.row.linkman_mobile.replace(scope.row.linkman_mobile.substr(3, 4), '****') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="user_num" label="申报低收入农户户数" align="center"></el-table-column>
      <el-table-column prop="bank_name" label="基本户开户银行" width="150" align="center"></el-table-column>
      <el-table-column prop="created_at" label="申请日期" align="center"></el-table-column>
      <el-table-column prop="status_name" label="审批结果" align="center"></el-table-column>
      <el-table-column prop="applyProcess" label="审批进度" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="check1Progress(scope)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.operate == 1"></span>
            <el-button v-else size="mini" :class="[scope.row.operate == 3 ? 'greyText' : '']" :type="scope.row.operate == 2 ? 'primary' : 'text'" @click="operate1Item(scope)">{{
              scope.row.operate == 3 ? '已审核' : '审核'
            }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table class="table-info" v-loading="loading" :data="tableData" key="2" v-if="this.userType == '2'">
      <el-table-column prop="company_name" label="申报单位名称" align="center"></el-table-column>
      <el-table-column prop="credit_code" label="社会统一信用代码" width="150" align="center"></el-table-column>
      <el-table-column prop="linkman" label="联系人" align="center"></el-table-column>
      <el-table-column prop="linkman_mobile" label="电话" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.linkman_mobile">
            {{ scope.row.linkman_mobile.replace(scope.row.linkman_mobile.substr(3, 4), '****') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bank_name" label="基本户开户银行" width="150" align="center"></el-table-column>
      <el-table-column prop="created_at" label="申请日期" align="center"></el-table-column>
      <el-table-column prop="status_name" label="审批结果" align="center"></el-table-column>
      <el-table-column prop="applyProcess" label="审批进度" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="check2Progress(scope)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.operate == 1"></span>
            <el-button v-else size="mini" :class="[scope.row.operate == 3 ? 'greyText' : '']" :type="scope.row.operate == 2 ? 'primary' : 'text'" @click="operate2Item(scope)">{{
              scope.row.operate == 3 ? '已审核' : '审核'
            }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog :visible="toDialogInfo.visible" class="setMiddleDialog rainExport" width="80%" :title="`中蜂产业折股量化${userType == '1' ? '村集体' : '养殖大户'}确认通过名单`" @close="closeDialog">
      <exportDialog v-if="toDialogInfo.visible" :userType="userType" @shutDown="toDialogInfo.visible = false" @confirmExport="runExportAction" />
    </el-dialog>
    <el-dialog :visible="nameListVisivle" class="setMiddleDialog nameList" width="80%" title="代养协议名单" @close="closeNameListDialog">
      <div class="nameListDialogCon">
        <div class="endBtnCon">
          <el-button type="primary" @click="popTransfer">新增结对</el-button>
        </div>
        <el-table :data="nameListData" max-height="450" ref="nameListTable" key="111" v-loading="nameListLoading" @selection-change="handleNameListSelectionChange" class="export-table">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="养殖大户名单" prop="major_name"></el-table-column>
          <el-table-column label="联系人" prop="major_link" align="center"></el-table-column>
          <el-table-column label="电话" width="150" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.major_mobile">
                {{ scope.row.major_mobile.replace(scope.row.major_mobile.substr(3, 4), '****') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="村集体名单" prop="group_name"></el-table-column>
          <el-table-column label="联系人" prop="group_link" align="center"></el-table-column>
          <el-table-column label="电话" prop="group_mobile" width="150" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.group_mobile">
                {{ scope.row.group_mobile.replace(scope.row.group_mobile.substr(3, 4), '****') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="蜂箱数量" prop="bee_num" width="150" align="center"></el-table-column>
          <el-table-column label="金额" prop="total_income" width="150" align="center"></el-table-column>
          <el-table-column label="协议图片" prop="protocol_image_path" width="150" align="center">
            <template slot-scope="scope">
              <div class="image_box">
                <preview-image :src="scope.row.protocol_image_path ? scope.row.protocol_image_path[0] : ''" :src-list="scope.row.protocol_image_path ? scope.row.protocol_image_path : []" />
                <span>{{ '共' + (scope.row.protocol_image_path ? scope.row.protocol_image_path.length : 0) + '张' }}</span>
                <el-button v-if="!scope.row.protocol_image_path || (scope.row.protocol_image_path && scope.row.protocol_image_path.length < 2)" size="mini" @click="popNew(scope.row)">添加</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="created_at" align="center">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" @click="popDeleteMainItem(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-footer">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="nameListpage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="nameListTotal"
            class="pagination-info"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible="contactListVisivle" class="setMiddleDialog contactList" width="1344px" title="结对" @close="closeContactListDialog">
      <div class="complicateCon">
        <div class="complicateLeftCon">
          <el-table ref="singleTable" height="350" class="singleTable" :data="singleTableData" @current-change="handleSingleCurrentChange" :highlight-current-row="leftDisable">
            <el-table-column property="company_name" label="审批通过养殖大户" width="220"> </el-table-column>
          </el-table>
          <div class="pagination-footer">
            <el-pagination
              @current-change="handleSinglePagCurrentChange"
              :current-page.sync="singlepage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="contactListTotal"
              class="pagination-info"
            ></el-pagination>
          </div>
        </div>
        <div class="complicateMidleCon">
          <el-button size="middle" type="primary" @click="firstFetch" :disabled="!!!chossenOne.company_name || selfAble">开始结对</el-button>
          <div class="chossenOneStyle">
            <div>当前选中养殖大户：</div>
            <div style="margin-top: 20px; color: #409eff">
              {{ chossenOne.company_name }}
            </div>
          </div>
        </div>
        <div class="complicateRightCon">
          <el-table :data="contactListData" height="350" ref="contactTable" key="111" v-loading="contactListLoading" @selection-change="handleContactListSelectionChange" class="complicateTable">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="审批通过村集体" prop="company_name"></el-table-column>
            <el-table-column label="养殖法乎承担蜂箱数量（箱）" prop="group_mobile" align="center">
              <template v-slot="scope">
                <el-input-number size="small" v-model="scope.row.bee_num" @change="(value) => tableItemBeeNumChange(value, scope.row)" :precision="0" :controls="false" :min="0" :max="999999" />
              </template>
            </el-table-column>
            <el-table-column label="共计金额（元）" prop="created_at" align="center">
              <template slot-scope="scope">
                <el-input-number
                  size="small"
                  v-model="scope.row.total_income"
                  @change="(value) => tableItemTotalIncomeChange(value, scope.row)"
                  :precision="2"
                  :controls="false"
                  :min="0"
                  :max="999999"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-footer">
            <el-pagination
              @current-change="handleSpecialCurrentChange"
              :current-page.sync="nameListpage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="contactListTotal"
              class="pagination-info"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer centerFooter">
        <el-button type="primary" @click="confirmMaster">确定</el-button>
        <el-button @click="cancelMaster">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="medium_dialog" title="添加图片" width="800px" :before-close="handleCloseForNew" :visible.sync="addVisible">
      <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="上传图片" prop="image" class="flexFormItem is-required">
          <el-upload
            :class="['avatar-uploader']"
            :action="action"
            :headers="headers"
            ref="upload"
            :file-list="fileList"
            list-type="picture-card"
            :show-file-list="true"
            :before-upload="beforeUpload"
            :on-success="successFile"
            :limit="dynamicLimit"
            :on-remove="handleRemoveFile"
            :on-exceed="handleExceed"
            accept="image/*"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">至少上传1张jpg/png/gif图片,且大小不超过50M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetField('newForm')">取 消</el-button>
        <el-button type="primary" @click="confirmAddAction('newForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { PlanBeeLists, PlanBeeInfo, PlanBeeAudit, PlanBeeExport, PlanBeeProList, PlanBeeProDelete, PlanBeeProEdit, PlanBeeProAdd } from '@/api/rain';
import _ from 'lodash';
import { ListUser } from '@/api/household';
import previewImage from '@/components/previewImage/index';
import exportDialog from './dialog/index';
export default {
  name: 'beeQuantify',
  components: {
    exportDialog,
    previewImage,
  },
  data() {
    var validateImage = (rule, value, callback) => {
      if (!this.fileList.length) {
        callback(new Error('请上传图片'));
      } else {
        callback();
      }
    };
    return {
      passedOptions: [],
      nameListVisivle: false,
      tabArray: [
        { label: '村集体', name: 'first' },
        { label: '养殖大户', name: 'second' },
      ],
      newForm: {
        image: '',
      },
      newRules: {
        image: [{ validator: validateImage, trigger: 'blur' }],
      },
      activeName: 'first',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      toDialogInfo: { visible: false },
      exportPassedDisabled: false,
      loading: false,
      userType: '1',
      auditStatus: '',
      auditStatusList: [
        {
          label: '审核状态(全部)',
          value: '',
        },
        {
          label: '通过',
          value: 2,
        },
        {
          label: '不通过',
          value: 3,
        },
        {
          label: '审核中',
          value: 1,
        },
        {
          label: '未审核',
          value: 0,
        },
      ],
      tableData: [],
      nameListData: [],
      nameListLoading: false,
      nameListpage: 1,
      nameListTotal: 0,
      contactListData: [],
      contactListLoading: false,
      contactListpage: 1,
      contactListTotal: 0,
      contactListVisivle: false,
      multipleSelection: [],
      oneDimensionMultipleSelection: [],
      prevData: [],
      fileList: [],
      action: '/web/public/upload',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      dynamicLimit: 2,
      addVisible: false,
      uploadImgBridge: {},
      singleTableData: [],
      currentRow: null,
      chossenOne: {
        company_name: '',
      },
      singlepage: 1,
      leftDisable: true,
      selfAble: true,
    };
  },
  created() {
    this.initArray();
    this.destroy();
  },
  methods: {
    handleSinglePagCurrentChange(e) {
      this.singlepage = e;
      this.initLeftList(e);
    },
    handleSingleCurrentChange(val) {
      //   this.singleTableData;
      console.log(val);
      if (val) {
        if (this.leftDisable) {
          this.chossenOne = val;
          this.selfAble = false;
        }
        this.currentRow = val;
      }
    },
    initLeftList() {
      const data = {
        type: 2,
        audit_status: 2,
        page: this.singlepage,
        page_size: 10,
      };
      PlanBeeLists(data)
        .then((res) => {
          if (res.code === 0) {
            this.passedOptions = res.data.data;
            this.singleTableData = res.data.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    popNew(row) {
      if (row.protocol_image_path) {
        this.dynamicLimit = 2 - row.protocol_image_path.length;
      } else {
        this.dynamicLimit = 2;
      }
      this.addVisible = true;
      this.uploadImgBridge = row;
      this.fileList = [];
    },
    handleCloseForNew(done) {
      this.$refs['newForm'].resetFields();
      done();
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多绑定2张图片');
    },
    handleRemoveFile(file, fileList) {
      //   console.log(file, fileList);
      this.fileList = fileList;
    },
    //   上传成功
    successFile(res, file) {
      //   console.log(res, file);
      this.fileList.push(file);
    },
    // 图片上传
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB');
        return false;
      }
    },
    confirmAddAction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.dynamicLimit);
          let imgIds = this.fileList
            .map((ele) => {
              return ele.response.data.id;
            })
            .join(',');
          if (this.dynamicLimit == 1) {
            imgIds = imgIds + ',' + this.uploadImgBridge.protocol_image;
          }
          console.log('imgIds', imgIds);
          let data = {
            id: this.uploadImgBridge.id,
            protocol_image: imgIds,
          };
          PlanBeeProEdit(data).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('添加成功');
              this.addVisible = false;
              this.$refs['newForm'].resetFields();
              this.nameListpage = 1;
              this.fetchNameList();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    resetField(formName) {
      console.log('asdgajs');
      this.$refs[formName].resetFields();
      this.addVisible = false;
    },

    confirmMaster() {
      const track = _.cloneDeep(this.multipleSelection);
      //   console.log(track);
      const afterEmpty = track.map((ele) => {
        if (ele) {
          return ele;
        } else {
          return [];
        }
      });
      //   console.log(afterEmpty);
      const newGuy = afterEmpty.reduce(function (a, b) {
        return a.concat(b);
      }, []);
      this.oneDimensionMultipleSelection = _.cloneDeep(newGuy);
      this.prevData = _.cloneDeep(newGuy);

      if (this.prevData.length) {
        let trackBee_num = newGuy.filter((ele) => {
          return !ele.bee_num;
        });
        let trackTotal_income = newGuy.filter((ele) => {
          return !ele.total_income;
        });
        if (trackBee_num.length || trackTotal_income.length) {
          this.$message.error('请检查勾选的数据，勾选项不能为空，蜂箱数量或者金额不能为0');
        } else {
          this.addNewGroupAction();
          //   sessionStorage.removeItem(`BeeNum`);
          //   sessionStorage.removeItem(`TotalIncome`);
        }
      } else {
        this.$message.error('请勾选结对对象');
      }
    },
    addNewGroupAction() {
      let productObj = this.prevData.map((ele) => {
        return {
          group_id: ele.id,
          bee_num: ele.bee_num,
          total_income: ele.total_income,
        };
      });
      let productStr = JSON.stringify(productObj);
      console.log(this.chossenOne.id);
      let data = {
        group_str: productStr,
        major_id: this.chossenOne.id,
      };
      PlanBeeProAdd(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.contactListVisivle = false;
            this.$message.success('添加成功');
            this.nameListpage = 1;
            this.fetchNameList();
            sessionStorage.removeItem(`BeeNum`);
            sessionStorage.removeItem(`TotalIncome`);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelMaster() {
      this.contactListVisivle = false;
      sessionStorage.removeItem(`BeeNum`);
      sessionStorage.removeItem(`TotalIncome`);
    },
    tableItemBeeNumChange(value, row) {
      let BeeNum = sessionStorage.getItem(`BeeNum`) ? sessionStorage.getItem(`BeeNum`) : '';
      if (BeeNum) {
        let obj = JSON.parse(BeeNum);
        obj[`${row.ID}BeeNum`] = value;
        sessionStorage.setItem(`BeeNum`, JSON.stringify(obj));
      } else {
        sessionStorage.setItem(`BeeNum`, JSON.stringify({ [`${row.ID}BeeNum`]: value }));
      }
    },
    tableItemTotalIncomeChange(value, row) {
      //   console.log(value);
      let TotalIncome = sessionStorage.getItem(`TotalIncome`) ? sessionStorage.getItem(`TotalIncome`) : '';
      if (TotalIncome) {
        // console.log(BeeNum);
        let obj = JSON.parse(TotalIncome);
        obj[`${row.ID}TotalIncome`] = value;
        // console.log("obj", obj);
        sessionStorage.setItem(`TotalIncome`, JSON.stringify(obj));
      } else {
        sessionStorage.setItem(`TotalIncome`, JSON.stringify({ [`${row.ID}TotalIncome`]: value }));
      }
    },
    popTransfer() {
      sessionStorage.removeItem(`BeeNum`);
      sessionStorage.removeItem(`TotalIncome`);
      this.contactListData = [];
      this.leftDisable = true;
      this.selfAble = true;
      this.chossenOne = {
        company_name: '',
      };
      this.contactListVisivle = true;
      this.initLeftList();
    },
    handleSpecialCurrentChange(e) {
      this.contactListpage = e;
      this.startFetch(e);
    },
    firstFetch() {
      this.selfAble = true;
      this.leftDisable = false;
      this.startFetch(1);
    },
    startFetch(e) {
      //   let data = {
      //     page: this.contactListpage,
      //     page_size: 10
      //   };
      //   ListUser(data).then(res => {
      //     this.contactListData = res.data.data;
      //     this.contactListTotal = res.data.total;
      //     if (e) {
      //       const track = _.cloneDeep(this.multipleSelection);
      //       if (track[e - 1]) {
      //         track[e - 1].forEach(row => {
      //           const findIndex = this.contactListData.findIndex(ele => {
      //             return ele.ID == row.ID;
      //           });
      //           setTimeout(() => {
      //             this.$refs.contactTable.toggleRowSelection(
      //               this.contactListData[findIndex]
      //             );
      //             console.log(this.contactListData[findIndex].ID);
      //             let BeeNum = sessionStorage.getItem(`BeeNum`)
      //               ? JSON.parse(sessionStorage.getItem(`BeeNum`))
      //               : "";
      //             let TotalIncome = sessionStorage.getItem(`TotalIncome`)
      //               ? JSON.parse(sessionStorage.getItem(`TotalIncome`))
      //               : "";
      //             if (BeeNum) {
      //               this.contactListData[findIndex].bee_num =
      //                 BeeNum[`${this.contactListData[findIndex].ID}BeeNum`];
      //             }
      //             if (TotalIncome) {
      //               this.contactListData[findIndex].total_income =
      //                 TotalIncome[
      //                   `${this.contactListData[findIndex].ID}TotalIncome`
      //                 ];
      //             }
      //           }, 0);
      //         });
      //       }
      //     }
      //   });

      const data = {
        type: 1,
        audit_status: 2,
        page: this.contactListpage,
        page_size: 10,
      };
      PlanBeeLists(data)
        .then((res) => {
          if (res.code === 0) {
            this.contactListData = res.data.data;
            this.contactListTotal = res.data.total;
            if (e) {
              const track = _.cloneDeep(this.multipleSelection);
              if (track[e - 1]) {
                track[e - 1].forEach((row) => {
                  const findIndex = this.contactListData.findIndex((ele) => {
                    return ele.id == row.id;
                  });
                  setTimeout(() => {
                    this.$refs.contactTable.toggleRowSelection(this.contactListData[findIndex]);
                    console.log(this.contactListData[findIndex].id);
                    let BeeNum = sessionStorage.getItem(`BeeNum`) ? JSON.parse(sessionStorage.getItem(`BeeNum`)) : '';
                    let TotalIncome = sessionStorage.getItem(`TotalIncome`) ? JSON.parse(sessionStorage.getItem(`TotalIncome`)) : '';
                    if (BeeNum) {
                      this.contactListData[findIndex].bee_num = BeeNum[`${this.contactListData[findIndex].id}BeeNum`];
                    }
                    if (TotalIncome) {
                      this.contactListData[findIndex].total_income = TotalIncome[`${this.contactListData[findIndex].id}TotalIncome`];
                    }
                  }, 0);
                });
              }
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    closeContactListDialog() {
      this.contactListVisivle = false;
      sessionStorage.removeItem(`BeeNum`);
      sessionStorage.removeItem(`TotalIncome`);
    },
    handleContactListSelectionChange(val) {
      //               contactListData:[],
      // contactListLoading:false,
      console.log(val);
      this.multipleSelection[this.contactListpage - 1] = val;
    },
    handleNameListSelectionChange() {
      //       nameListData
      // nameListLoading
      //   this.nameListpage = 1;
      //   this.nameListTotal = 1;
    },
    popDeleteMainItem(row) {
      this.$alert(`确定删除该条目`, '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action == 'confirm') {
            PlanBeeProDelete({
              id: row.id,
            })
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('删除成功');
                  this.nameListpage = 1;
                  this.fetchNameList();
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
    fetchNameList() {
      //       nameListData
      // nameListLoading
      //   this.nameListpage = 1;
      //   this.nameListTotal = 1;
      this.nameListLoading = true;
      const data = {
        bee_num: '',
        income: '',
        major_name: '',
        group_name: '',
        page: this.nameListpage,
        page_size: this.pageSize,
      };
      PlanBeeProList(data)
        .then((res) => {
          if (res.code === 0) {
            this.nameListData = res.data.data;
            this.nameListTotal = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.nameListLoading = false;
        });
      //          PlanBeeProList,
      //   PlanBeeProDelete,
      //   PlanBeeProEdit,
      //   PlanBeeProAdd
    },
    statusChange() {
      this.currentPage = 1;
      this.fetchList();
    },
    handleClick(tab, event) {
      if (this.tabArray && this.tabArray.length == 2) {
        this.currentPage = 1;
        this.auditStatus = '';
        this.fetchList();
      }
    },
    initArray() {
      this.fetchList();
    },
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
    runExportAction(val) {
      console.log(val); //批量数据获取
      this.toDialogInfo.visible = false;
      if (val.length) {
        const KungLao = val
          .map((ele) => {
            return ele.id;
          })
          .join(',');
        let token = sessionStorage.getItem('token');
        const Raiden = {
          ids: KungLao,
          Authorization: token,
          type: this.$route.query.type,
        };
        PlanBeeExport(Raiden)
          .then((res) => {
            if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = '中蜂产业折股量化批量导出' + Date.now() + '.xlsx';
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
      } else {
        this.$message({
          message: '未选中任何条目',
        });
      }
    },
    closeDialog() {
      this.toDialogInfo.visible = false;
    },
    closeNameListDialog() {
      this.nameListVisivle = false;
    },
    fetchList() {
      if (this.tabArray.length) {
        let track = this.tabArray.find((ele) => {
          return ele.name == this.activeName;
        });
        let typeMap = {
          村集体: '1',
          养殖大户: '2',
        };
        let type = typeMap[track.label];
        this.userType = type;
        this.loading = true;
        const data = {
          type: type,
          audit_status: this.auditStatus,
          page: this.currentPage,
          page_size: this.pageSize,
        };
        PlanBeeLists(data)
          .then((res) => {
            if (res.code === 0) {
              this.tableData = res.data.data;
              this.total = res.data.total;
            } else {
              this.$message.error(res.msg);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    check1Progress(item) {
      this.$router.push({
        path: 'beeQuantifyProgress',
        query: {
          justForCheck: 'true',
          ID: item.row.id,
          type: '1',
          operate: item.row.operate,
        },
      });
    },
    check2Progress(item) {
      this.$router.push({
        path: 'beeQuantifyProgress',
        query: {
          justForCheck: 'true',
          ID: item.row.id,
          type: '2',
          operate: item.row.operate,
        },
      });
    },
    operate1Item(item) {
      if (item.row.operate == 2) {
        this.$router.push({
          path: 'beeQuantifyProgress',
          query: {
            justForCheck: 'false',
            ID: item.row.id,
            type: '1',
            operate: item.row.operate,
          },
        });
      }
    },
    operate2Item(item) {
      if (item.row.operate == 2) {
        this.$router.push({
          path: 'beeQuantifyProgress',
          query: {
            justForCheck: 'false',
            ID: item.row.id,
            type: '2',
            operate: item.row.operate,
          },
        });
      }
    },
    popNameList() {
      this.nameListVisivle = true;
      this.nameListpage = 1;
      this.fetchNameList();
    },
    exportPassedList() {
      this.exportPassedDisabled = true;
      setTimeout(() => {
        this.exportPassedDisabled = false;
      }, 500);
      this.toDialogInfo.visible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.complicateTable {
  width: 600px;
}
.singleTable {
  width: 300px;
}
.centerFooter {
  display: flex;
  justify-content: center;
}
.pagination-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.nameListDialogCon {
  .endBtnCon {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    margin-bottom: 20px;
  }
}

.datePickerCon {
  //   margin-top: 20px;
}
.expandInput {
  width: 200px;
}
.greyText {
  color: #999;
  cursor: not-allowed;
}
.beeQuantifyCon {
  width: 98%;
  margin: 15px 0px 0px 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  header {
    width: 95%;
    display: flex;
    align-items: center;
    padding-top: 10px;
    margin: 0 auto 0;
  }
  .tabContainer {
    width: 95%;
    padding-top: 20px;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .header-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .topLeft {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  .header-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
  }
  .header-search {
    // padding: 0px 20px;
  }
  .header-export {
    width: 150px;
    // padding: 0px 20px;
  }
  .header-export-div {
    margin-bottom: 20px;
    // display: flex;
    // align-content: center;
    // margin-left: auto;
  }
  .table-info {
    width: 95%;
    margin: 20px auto;
  }
}

.complicateCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
}
.complicateLeftCon {
}
.complicateMidleCon {
  .chossenOneStyle {
    margin-top: 20px;
  }
}
.complicateRightCon {
}
</style>
<style lang="scss">
.rainExport {
  .el-dialog {
    height: 700px;
  }
}
.nameList {
  .el-dialog {
    height: 700px;
  }
}
.contactList {
  .el-dialog {
    height: 600px;
  }
}
</style>

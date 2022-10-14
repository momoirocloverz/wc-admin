<template>
  <div class="healthBureauCon">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in tabArray">
          <el-tab-pane
            :key="index"
            :label="item.label"
            :name="item.name"
          ></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="innerCon" v-if="activeName == 'first'">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input
            v-model="user_name"
            placeholder="文件名称"
            clearable
          ></el-input>
        </div>
        <div class="datePickerCon marginAddon marginBootomAddon">
          <el-date-picker
            size="medium"
            v-model="timeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="发布日期"
            end-placeholder="发布日期"
            align="right"
          >
          </el-date-picker>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select
            v-model="searchType"
            class="fixInput"
            placeholder="请选择上传分类"
            clearable
          >
            <el-option
              v-for="item in publishOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="addBtnArea">
        <el-button type="primary" @click="popUpload">上传文件</el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column
            prop="user_name"
            label="图标"
            width="250"
            align="center"
          >
            <template slot-scope="scope">
              <img class="listIcon" :src="excelIcon" />
            </template>
          </el-table-column>
          <el-table-column prop="address" label="信息" align="center">
            <template slot-scope="scope">
              <div class="infoCon">
                <div class="infoTitle">{{ scope.row.title }}</div>
                <div class="infoDetail">
                  <div class="infoItem">
                    上传账号：{{ scope.row.admin_name }}
                  </div>
                  <div class="infoItem">
                    分类：{{ scope.row.file_type_name }}
                  </div>
                  <div class="infoItem">
                    下载次数：{{ scope.row.download_num }}次
                  </div>
                  <div class="infoItem">
                    上传日期：{{ scope.row.created_at }}
                  </div>
                  <div class="infoItem">
                    数据大小：{{ scope.row.file_size }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" @click="popPreview(scope.row)"
                  >在线预览</el-button
                >
                <el-button size="mini" @click="downloadCurrent(scope.row)"
                  >下载文件</el-button
                >
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
    <div class="innerCon" v-if="activeName == 'second'">
      <div class="addBtnArea">
        <el-button type="primary" @click="pop2Upload">上传文件</el-button>
      </div>
      <el-table v-loading="loading2" :data="tableData2">
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="card" label="身份证" align="center">
        </el-table-column>
        <el-table-column prop="save_type" label="救助类型" align="center">
        </el-table-column>
        <el-table-column prop="save_num" label="年度就诊次数" align="center">
        </el-table-column>
        <el-table-column prop="diagnose" label="主要诊断" align="center">
        </el-table-column>
        <el-table-column prop="total" label="合计" align="center">
        </el-table-column>
        <el-table-column prop="basic_pay" label="基本医保支付" align="center">
        </el-table-column>
        <el-table-column prop="illness_pay" label="大病保险支付" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                size="mini"
                type="primary"
                @click="startSend(scope.row)"
                >发送预警</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-footer">
        <el-pagination
          @current-change="handleCurrent2Change"
          :current-page.sync="current2Page"
          :page-size="page2Size"
          layout="prev, pager, next, jumper"
          :total="total2"
          class="pagination-info"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      class="setMiddleDialog upload2Dialog"
      title="上传文件"
      width="630px"
      :before-close="handleCloseFor2New"
      :visible.sync="add2Visible"
    >
      <el-form
        :model="new2Form"
        status-icon
        :rules="new2Rules"
        ref="new2Form"
        label-width="120px"
        class="deemo-MixruleForm2m2"
      >
        <el-form-item label=" " prop="file" class="flexFormItem">
          <el-upload
            :action="action"
            :headers="headers"
            ref="upload"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :on-success="successFile2"
            :on-error="failedFile"
            :limit="1"
            :auto-upload="false"
            :on-remove="handleRemoveFile"
            :on-exceed="handleExceed"
            accept="application/*"
          >
            <el-button size="small" type="primary" v-if="!fileList.length"
              >点击上传</el-button
            >
            <div class="el-upload__tip" slot="tip">
              支持上传文件格式：xls，xlsx单个文件大小在50M以内。
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutUpload2">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="setMiddleDialog uploadDialog"
      title="上传文件"
      width="630px"
      :before-close="handleCloseForNew"
      :visible.sync="addVisible"
    >
      <el-form
        :model="newForm"
        status-icon
        :rules="newRules"
        ref="newForm"
        label-width="120px"
        class="deemo-MixruleForm2m"
      >
        <el-form-item
          label="上传分类"
          prop="type"
          class="flexFormItem"
          required
        >
          <el-select
            v-model="newForm.type"
            class="fixInput"
            @change="formTypeChange"
            placeholder="请选择上传分类"
          >
            <el-option
              v-for="item in publishWithoutAllOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="newForm.type"
          label=" "
          prop="file"
          class="flexFormItem"
        >
          <el-upload
            :action="action2"
            :headers="headers"
            ref="upload"
            :data="extraParams"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :on-success="successFile"
            :on-error="failedFile"
            :limit="1"
            :auto-upload="false"
            :on-remove="handleRemoveFile2"
            :on-exceed="handleExceed"
            accept="application/*"
          >
            <el-button size="small" type="primary" v-if="!fileList.length"
              >点击上传</el-button
            >
            <div class="el-upload__tip" slot="tip">
              支持上传文件格式：xls，xlsx单个文件大小在50M以内。
            </div>
            <!-- doc，docx，ppt，pptx， -->
          </el-upload>
        </el-form-item>
        <!-- <div>
          <div class="generateBtnCon">
            <el-button
              size="small"
              type="primary"
              v-if="showGenerate"
              @click="generateAction"
              :disabled="generateAble"
              >{{ generateAble ? "名单已生成" : "一键查询名单" }}</el-button
            >
          </div>
        </div> -->
        <!-- <div class="filterCon" v-if="showFilter">
          <div>筛选文件</div>
          <div class="newFileCon">
            <div class="newFileLeft">
              <img class="newFileImg" :src="excelIcon" />
              <div>
                <div>低收入名单</div>
                <div>数据大小</div>
              </div>
            </div>
            <div class="downLoadTrigCon">
              <el-button size="small" type="primary" @click="downLoadTrigger">
                下载
              </el-button>
            </div>
          </div>
        </div> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="setMiddleDialog previewDialog"
      title="文件预览"
      width="1200px"
      :visible.sync="previewVisible"
    >
      <div class="previewCon">
        <iframe
          width="100%"
          class="innerIframe"
          height="520"
          :src="iframeSource"
        ></iframe>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutPreview">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchDeptYb,
  deptYbSend,
  fetchDeptYbList,
  fetchDeptType,
  deptDownload
} from "@/api/dataService";
export default {
  name: "healthBureauCon",
  data() {
    var validateFile = (rule, value, callback) => {
      if (!this.fileList.length) {
        callback(new Error("请上传文件"));
      } else {
        callback();
      }
    };
    return {
      activeName: "first",
      tabArray: [
        { label: "文件管理", name: "first" },
        { label: "农户预警", name: "second" }
      ],
      action2: "/web/dept/upload",
      action: "/web/dept/yb/import",
      extraParams: {},
      headers: {
        Authorization: sessionStorage.getItem("token")
      },
      showGenerate: false,
      excelIcon:
        "https://img.hzanchu.com/acimg/434617a2ac9628b0ec77ffc9601dab6e.png",
      wordIcon:
        "https://img.hzanchu.com/acimg/cd357c7c01ea16db05b93046da09489d.png",
      powerpointIcon:
        "https://img.hzanchu.com/acimg/03be6ced6d25c52cc12847f9a389193f.png",
      options: [],
      addVisible: false,
      add2Visible: false,
      user_name: "",
      fileList: [],
      new2Form: {
        file: ""
      },
      new2Rules: {
        file: [{ validator: validateFile, trigger: "blur" }]
      },
      newForm: {
        file: "",
        fileId: "",
        type: ""
      },
      newRules: {
        file: [{ validator: validateFile, trigger: "blur" }],
        type: [
          {
            required: true,
            message: "请选择上传类型",
            trigger: "blur"
          }
        ]
      },
      option:
        this.$store.getters.option.length !== 0
          ? this.$store.getters.option
          : JSON.parse(sessionStorage.getItem("option"))
          ? JSON.parse(sessionStorage.getItem("option"))
          : [],
      tableData: [],
      loading: false,
      loading2: false,
      tableData2: [],
      publishOptions: [],
      publishWithoutAllOptions: [],
      timeRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      page2Size: 10,
      total2: 0,
      current2Page: 1,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchType: "",
      previewVisible: false,
      previewObj: {},
      iframeSource: "",
      generateAble: false,
      showFilter: false,
      smsObj: {}
    };
  },
  mounted() {
    this.fetchTypeList();
    this.fetchList();
    this.destroy();
  },
  methods: {
    handleClick(tab, event) {
      this.fileList = [];
      if (tab == "first") {
        this.currentPage = 1;
        this.fetchList();
      } else {
        this.current2Page = 1;
        this.fetch2List();
      }
    },
    startSend(item) {
      // this.smsObj
      this.$confirm("此操作将发送短信, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deptYbSend({
            id: item.id
          }).then(res => {
            if (res && res.code === 0) {
              this.$message.success("发送短信成功");
            } else {
              this.$message.error(res.msg);
            }
          });
          //   this.$message({
          //     type: "success",
          //     message: "删除成功!"
          //   });
        })
        .catch(() => {
          //   this.$message({
          //     type: "info",
          //     message: "已取消"
          //   });
        });
    },
    downLoadTrigger() {
      console.log();
    },
    generateAction() {
      setTimeout(() => {
        this.generateAble = true;
        this.showFilter = true;
      }, 500);
    },
    formTypeChange() {
      this.extraParams = {
        dept_type: "3",
        file_type: this.newForm.type
      };
    },
    shutUpload() {
      //   this.addVisible = false;
      //   this.resetField();
      //   this.currentPage = 1;
      //   this.fetchList();
      this.$refs.upload.submit();
      window.timer2 = setTimeout(() => {
        this.addVisible = false;
        this.resetField();
        clearTimeout(window.timer2);
      }, 700);
    },
    shutUpload2() {
      this.$refs.upload.submit();
      window.timer2 = setTimeout(() => {
        this.add2Visible = false;
        this.reset2Field();
        clearTimeout(window.timer2);
      }, 700);
    },
    popUpload() {
      this.addVisible = true;
      this.showGenerate = false;
      this.generateAble = false;
      this.showFilter = false;
    },
    pop2Upload() {
      this.add2Visible = true;
    },
    popPreview(row) {
      this.previewObj = row;
      this.previewVisible = true;
      if (this.previewObj.file_path) {
        this.iframeSource =
          "https://view.officeapps.live.com/op/view.aspx?src=" +
          this.previewObj.file_path;
      }
    },
    downloadCurrent(row) {
      this.previewObj = row;
      deptDownload({
        id: row.id
      }).then(res => {
        if (res && res.code === 0) {
          this.currentPage = 1;
          this.fetchList();
        } else {
          this.$message.error(res.msg);
        }
      });
      window.open(row.file_path);
    },
    shutPreview() {
      this.previewVisible = false;
    },
    handleExceed(files, fileList) {
      this.$message.warning("最多上传1个文件");
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
      this.showGenerate = false;
      this.generateAble = false;
      this.showFilter = false;
    },
    handleRemoveFile2(file, fileList) {
      this.fileList = fileList;
    },
    successFile(res, file) {
      console.log(res);
      if (res.code == 0) {
        // this.fileList.push(file);
        //   this.showGenerate = true;
      } else {
        this.$message.error("上传失败");
      }
      this.currentPage = 1;
      this.fetchList();
    },
    successFile2(res, file) {
      console.log(res);
      if (res.code == 0) {
        // this.fileList.push(file);
        //   this.showGenerate = true;
      } else {
        this.$message.error("上传失败");
      }
      this.current2Page = 1;
      this.fetch2List();
    },
    failedFile() {
      this.$message.error("上传失败");
    },
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      const isExcel =
        file.type == "application/vnd.ms-excel" ||
        file.type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        this.$message.error("请上传xls或者xlsx格式");
        return false;
      }
      if (!isLt50M) {
        this.$message.error("上传文件大小不能超过 50MB");
        return false;
      }
    },
    resetField() {
      this.$refs["newForm"].resetFields();
      this.fileList = [];
    },
    reset2Field() {
      this.$refs["new2Form"].resetFields();
      this.fileList = [];
    },
    handleCloseFor2New() {
      this.$refs["newForm"].resetFields();
      this.fileList = [];
      done();
      this.current2Page = 1;
      this.fetch2List();
    },
    handleCloseForNew(done) {
      this.$refs["newForm"].resetFields();
      this.fileList = [];
      done();
      this.currentPage = 1;
      this.fetchList();
    },
    destroy() {
      sessionStorage.removeItem("isRefresh");
      sessionStorage.removeItem("childRouterQuery");
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.searchType = "";
      this.user_name = "";
      this.timeRange = [];
      this.currentPage = 1;
      this.fetchList();
    },
    fetchTypeList() {
      fetchDeptType({ type: "3" })
        .then(res => {
          if (res && res.code === 0) {
            this.publishOptions = res.data;
            this.publishWithoutAllOptions = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchList() {
      this.loading = true;
      fetchDeptYb({
        file_type: this.searchType,
        title: this.user_name,
        start_time: this.timeRange ? this.timeRange[0] : undefined,
        end_time: this.timeRange ? this.timeRange[1] : undefined,
        page: this.currentPage,
        page_size: this.pageSize
      })
        .then(res => {
          if (res && res.code === 0) {
            this.tableData = res.data.data;
            this.total = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
    handleCurrent2Change(e) {
      this.current2Page = e;
      this.fetch2List();
    },
    fetch2List() {
      this.loading2 = true;
      fetchDeptYbList({
        id: this.previewObj.id,
        page: this.current2Page,
        page_size: this.page2Size
      })
        .then(res => {
          if (res && res.code === 0) {
            this.tableData2 = res.data.data;
            this.total2 = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.loading2 = false;
        });
    }
  }
};
</script>
<style scoped lang="scss">
.addBtnArea {
  margin-bottom: 20px;
}
.filterCon {
  margin-top: 20px;
}
.previewTableCon {
  //   height: 400px;
  //   overflow-y: auto;
}
.newFileCon {
  padding-left: 80px;
  padding-right: 80px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.newFileLeft {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}
.newFileImg {
  width: 100px;
  height: 100px;
}
.downLoadTrigCon {
  text-align: center;
}
.generateBtnCon {
  text-align: center;
}
.infoTitle {
  font-size: 18px;
  font-weight: 500;
}
.infoCon {
}
.infoDetail {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 500px;
  margin: 0 auto;
  .infoItem {
    text-align: left;
    width: 50%;
  }
}
.innerIframe {
  border: 0;
}
.listIcon {
  width: 120px;
  height: 120px;
}
.fixInput {
  width: 100%;
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
.flexFormItem {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  width: 600px;
}
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.tabContainer {
  width: 95%;
  padding-top: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  //   background-color: #fff;
}
.healthBureauCon {
  padding: 10px;
  width: 98%;
  margin: 15px 0px 0px 15px;
  background-color: #fff;
  .innerCon {
    // background-color: #fff;
    width: 98%;
    margin: 0 auto;
    padding: 30px;
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
  .topLeft {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin-bottom: 20px;
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
.tableCon {
}
</style>
<style lang="scss">
.healthBureauCon {
  .uploadDialog {
    .el-dialog {
      height: 600px;
    }
  }
  .upload2Dialog {
    .el-dialog {
      height: 400px;
    }
  }
  .previewDialog {
    .el-dialog {
      height: 700px;
    }
  }
  .el-upload--text {
    border: none;
  }
  .flexFormItem {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    width: 650px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .datePickerCon {
    .el-date-editor {
      width: 260px;
    }
  }
  .deemo-MixruleForm2m {
    height: 400px;
    .el-form-item__content {
      width: 70%;
      margin-left: 0 !important;
    }
  }
  .deemo-MixruleForm2m2 {
    height: 200px;
    .el-form-item__content {
      width: 70%;
      margin-left: 0 !important;
    }
  }
}
</style>

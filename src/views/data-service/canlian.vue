<template>
  <div class="disabledCon">
    <div class="innerCon">
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
        <el-button type="primary" @click="addVisible = true"
          >上传文件</el-button
        >
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
        class="demo-ruleForm"
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
            placeholder="请选择上传分类"
            @change="formTypeChange"
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
            :action="action"
            :headers="headers"
            ref="upload"
            :file-list="fileList"
            :data="extraParams"
            :before-upload="beforeUpload"
            :on-success="successFile"
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
            <!-- doc，docx，ppt，pptx， -->
          </el-upload>
        </el-form-item>
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
import { fetchDeptCl, fetchDeptType, deptDownload } from "@/api/dataService";
export default {
  name: "disabledCon",
  data() {
    var validateFile = (rule, value, callback) => {
      if (!this.fileList.length) {
        callback(new Error("请上传文件"));
      } else {
        callback();
      }
    };
    return {
      action: "/web/dept/upload",
      extraParams: {},
      headers: {
        Authorization: sessionStorage.getItem("token")
      },
      excelIcon:
        "https://img.hzanchu.com/acimg/434617a2ac9628b0ec77ffc9601dab6e.png",
      wordIcon:
        "https://img.hzanchu.com/acimg/cd357c7c01ea16db05b93046da09489d.png",
      powerpointIcon:
        "https://img.hzanchu.com/acimg/03be6ced6d25c52cc12847f9a389193f.png",
      options: [],
      fileList: [],
      addVisible: false,
      user_name: "",
      fileList: [],
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
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchType: "",
      previewVisible: false,
      previewObj: {},
      iframeSource: ""
    };
  },
  mounted() {
    this.fetchTypeList();
    this.fetchList();
    this.destroy();
  },
  methods: {
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
    popUpload() {
      this.addVisible = true;
    },
    resetField() {
      this.$refs["newForm"].resetFields();
      this.fileList = [];
    },
    handleCloseForNew(done) {
      this.$refs["newForm"].resetFields();
      this.fileList = [];
      done();
      this.currentPage = 1;
      this.fetchList();
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
          message.error(res.msg);
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
    },
    successFile(res, file) {
      this.fileList.push(file);
      this.currentPage = 1;
      this.fetchList();
    },
    formTypeChange() {
      this.extraParams = {
        dept_type: "5",
        file_type: this.newForm.type
      };
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
      fetchDeptType({ type: "5" })
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
      fetchDeptCl({
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
    }
  }
};
</script>
<style scoped lang="scss">
.addBtnArea {
  margin-bottom: 20px;
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
  margin-bottom: 20px;
  margin-top: 20px;
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
.disabledCon {
  padding: 10px;
  .innerCon {
    width: 98%;
    margin: 0 auto;
    margin-top: 15px;
    background-color: #fff;
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
.disabledCon {
  .uploadDialog {
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
  .demo-ruleForm {
    height: 200px;
    .el-form-item__content {
      width: 70%;
      margin-left: 0 !important;
    }
  }
}
</style>

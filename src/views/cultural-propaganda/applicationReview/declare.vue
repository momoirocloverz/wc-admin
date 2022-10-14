<template>
  <div class="applicationReviewDeclareCon">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input v-model="user_name" placeholder="乡镇"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select
            v-model="searchType"
            class="fixInput"
            placeholder="请输入村名"
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
        <div class="marginAddon marginBootomAddon">
          <el-input v-model="user_name" placeholder="姓名"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model="content" placeholder="联系电话"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="type" class="fixInput" placeholder="请选择类型">
            <el-option
              v-for="item in typeOptions"
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
      <div class="btnarea">
        <el-button type="primary" @click="popUpload">上传名单 </el-button>
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column
            prop="town_name"
            label="乡镇"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            label="村名"
            prop="village_name"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column prop="name" label="类型" align="center">
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="name" label="身份证号" align="center">
          </el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center">
          </el-table-column>
          <el-table-column prop="mobile" label="地址" align="center">
          </el-table-column>
          <el-table-column prop="mobile" label="开户银行" align="center">
          </el-table-column>
          <el-table-column
            prop="hive_num"
            label="自动定位"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="type_name"
            label="身份证号"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="type_name"
            label="寄养承诺书"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button
 
                  size="mini"
                  @click="popDeleteMainItem(scope.row)"
                  >删除</el-button
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
        <el-form-item label=" " prop="file" class="flexFormItem">
          <el-upload
            :headers="headers"
            ref="upload"
            :on-success="successFile"
            :action="action"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :data="extraParams"
            :limit="1"
            :on-remove="handleRemoveFile"
            :on-exceed="handleExceed"
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
        <el-button type="primary" @click="shutUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { beeMatchLists } from "@/api/bee";
import previewImage from "@/components/previewImage/index";
import { TownInfo } from "@/api/common";
export default {
  components: {
    previewImage
  },
  name: "applicationReviewDeclareCon",
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
      addVisible: false,
      activeName: "first",
      tabArray: [
        { label: "申报", name: "first" },
        { label: "结对", name: "second" },
        { label: "审核", name: "third" }
      ],
      type: "",
      addressOptions: [],
      typeOptions: [
        {
          id: "1",
          name: "合作社"
        },
        {
          id: "2",
          name: "家庭农场"
        },
        {
          id: "3",
          name: "企业"
        }
      ],
      options: [],
      content: "",
      user_name: "",
      option:
        this.$store.getters.option.length !== 0
          ? this.$store.getters.option
          : JSON.parse(sessionStorage.getItem("option"))
          ? JSON.parse(sessionStorage.getItem("option"))
          : [],
      userName: "",
      tableData: [],
      loading: false,
      publishOptions: [],
      publishWithoutAllOptions: [],
      timeRange: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchType: 0
    };
  },
  mounted() {
    this.fetchTypeList();
    this.fetchList();
    // this.fetchTown();
  },
  methods: {
    handleClick(tab, event) {
      if (this.tabArray && this.tabArray.length == 2) {
        // this.currentPage = 1;
        // this.auditStatus = "";
        // this.fetchList();
      }
    },
    townChange() {
      this.$refs.newForm.validateField("address");
    },
    fetchTown() {
      TownInfo().then(res => {
        if (res && res.code === 0) {
          this.addressOptions = res.data;
        }
      });
    },
    popDeleteMainItem(row) {
      this.$alert(`确定删除该条目`, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          if (action == "confirm") {
            propertyDelete({
              property_id: row.id
            })
              .then(res => {
                if (res && res.code === 0) {
                  this.$message.success("删除成功");
                  this.currentPage = 1;
                  this.fetchList();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      });
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetSearch() {
      this.searchType = 0;
      this.content = "";
      this.user_name = "";
      this.timeRange = [];
      this.currentPage = 1;
      this.fetchList();
    },
    fetchTypeList() {
      //   propertyType({})
      //     .then(res => {
      //       if (res && res.code === 0) {
      //         this.publishOptions = res.data;
      //         this.publishWithoutAllOptions = res.data.filter(ele => {
      //           return ele.id;
      //         });
      //       } else {
      //         this.$message.error(res.msg);
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
    },
    fetchList() {
      beeMatchLists({
        // type: this.searchType,
        // content: this.content,
        // user_name: this.user_name,
        page: this.currentPage,
        page_size: this.pageSize
      }).then(res => {
        if (res && res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    popUpload() {
      this.addVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning("最多上传1个文件");
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
    },
    successFile(res, file) {
      //   this.fileList.push(file);
      //   this.currentPage = 1;
      //   this.fetchList();
    },
    handleCloseForNew(done) {
      //   this.$refs["newForm"].resetFields();
      //   this.fileList = [];
      //   done();
      //   this.currentPage = 1;
      //   this.fetchList();
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
    shutUpload() {
      this.$refs.upload.submit();
      window.timer2 = setTimeout(() => {
        this.addVisible = false;
        this.resetField();
        clearTimeout(window.timer2);
      }, 700);
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    }
  }
};
</script>
<style scoped lang="scss">
.tabContainer {
  width: 95%;
  padding-top: 20px;
  box-sizing: border-box;
  margin: 0 auto;
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
.applicationReviewDeclareCon {
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
</style>
<style lang="scss">
.applicationReviewDeclareCon {
  .uploadDialog {
    .el-dialog {
      height: 330px;
    }
  }
}
</style>

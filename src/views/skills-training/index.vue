<template>
  <div class="skillsTraining">
    <!-- <video controls>
      <source
        src="https://img.anchumall.cn/wenchengxkm/9a27311fa10b126b8ea3289b9d550d57.mov"
        type="video/mp4"
      />
    </video> -->
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="type" class="fixInput" placeholder="请选择视频类型" :clearable="true">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
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
          <el-select v-model="publishType" class="fixInput" placeholder="请输入发布状态" :clearable="true">
            <el-option v-for="item in publish2Options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetAction">重置</el-button>
        </div>
      </div>
      <div class="tableCon">
        <div class="publishArea">
          <el-button type="primary" @click="popUploadDialog">视频上传</el-button>
          <el-button type="primary" @click="popAddType">新增视频类型</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="release_name" label="视频类型" width="150" align="center"></el-table-column>
          <el-table-column prop="is_register" label="视频内容" align="center">
            <template slot-scope="scope">
              <video
                v-if="scope.row.video_path && scope.row.video_path.length"
                class="fixWidthVideo"
                preload="metadata"
                :src="scope.row.video_path[0]"
                @click="popVideoPlayer(scope.row.video_path[0])"
              ></video>
              <div v-else>无</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="video_time" label="视频时长" align="center">
          </el-table-column> -->
          <el-table-column prop="click_num" label="视频播放次数" align="center"></el-table-column>
          <el-table-column prop="created_at" label="上传时间" width="180" align="center"></el-table-column>
          <el-table-column prop="is_open" label="发布状态" align="center">
            <template slot-scope="scope">
              <!-- v-model="scope.row.is_open == 1 ? true : false" -->
              <el-switch @change="changeSwitch(scope)" v-model="scope.row.is_open" active-text="开" inactive-text="关"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" @click="popDeleteMainItem(scope.row)">删除</el-button>
                <el-button size="mini" @click="checkDetail(scope.row)">详情</el-button>
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
    <div class="mask" v-if="showVideo">
      <div class="videoCon">
        <div class="shutCon">
          <i class="el-icon-close shutIcon" @click="shutVideo"></i>
        </div>
        <video controls preload="metadata">
          <source :src="dynamicVideo" />
        </video>
      </div>
    </div>

    <el-dialog title="上传视频" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="选择视频类型" prop="type" class="flexFormItem" required>
          <el-select v-model="ruleForm.type" class="fixInput" placeholder="请选择视频类型">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写标题" prop="title" class="flexFormItem">
          <el-input v-model="ruleForm.title" maxlength="10" placeholder="标题少于10个字"></el-input>
        </el-form-item>
        <el-form-item label="填写内容" prop="content" class="flexFormItem">
          <el-input placeholder="内容至少10个字" type="textarea" :row="5" v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item label="上传视频" prop="video" class="flexFormItem" required>
          <el-upload
            :class="['avatar-uploader']"
            :action="action"
            :headers="headers"
            ref="uploadVideo"
            :show-file-list="false"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
            :on-success="successFileVideo"
            :on-remove="handleRemoveFileVideo"
            accept="video/*"
          >
            <video v-if="ruleForm.video" :src="ruleForm.video" id="listVideo" class="avatar"></video>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传1个视频,且大小不超过50M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传视频封面" prop="image" class="flexFormItem" required>
          <el-upload
            :class="['avatar-uploader']"
            :action="action"
            :headers="headers"
            ref="upload"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="successFile"
            :on-remove="handleRemoveFile"
            accept="image/*"
          >
            <img v-if="ruleForm.image" :src="ruleForm.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传1张jpg/png/gif图片,且大小不超过50M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布" class="flexFormItem">
          <el-switch v-model="ruleForm.publish" active-text="开" inactive-text="关"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetField('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirmAddAction('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="detailVisible" width="800px">
      <el-form :model="infoForm" status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="选择视频类型" prop="type" class="flexFormItem">
          <el-select :disabled="true" v-model="infoForm.type" class="fixInput" placeholder="请选择视频类型">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写标题" prop="title" class="flexFormItem">
          <el-input :disabled="true" v-model="infoForm.title" maxlength="10" placeholder="标题少于10个字"></el-input>
        </el-form-item>
        <el-form-item label="填写内容" prop="title" class="flexFormItem">
          <el-input placeholder="内容至少10个字" :disabled="true" type="textarea" :row="5" v-model="infoForm.content"></el-input>
        </el-form-item>
        <el-form-item label="上传视频" prop="video" class="flexFormItem" required>
          <video controls v-if="infoForm.video_path && infoForm.video_path.length" :src="infoForm.video_path[0]" class="avatar"></video>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-form-item>
        <el-form-item label="上传视频封面" prop="video" class="flexFormItem">
          <img v-if="infoForm.image_path && infoForm.image_path[0]" :src="infoForm.image_path[0]" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-form-item>
        <el-form-item label="发布" prop="publish" class="flexFormItem">
          <el-switch :disabled="true" v-model="infoForm.is_open" active-text="开" inactive-text="关"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增视频类型" :visible.sync="typeDialogVisible" width="50%" :before-close="handleClose">
      <div>
        <el-button @click="popTypeDialog" type="primary">新增类型</el-button>
      </div>
      <el-table v-loading="typeLoading" :data="typeTableData" height="400">
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="视频类型" width="150" align="center"></el-table-column>
        <el-table-column prop="count" label="视频数量" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" @click="popTypeDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-footer">
        <el-pagination
          @current-change="handleSecCurrentChange"
          :current-page.sync="currentSecPage"
          :page-size="pageSecSize"
          layout="prev, pager, next, jumper"
          :total="secTotal"
          class="pagination-info"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog title="类型名称" :visible.sync="typeNameVisible" width="30%" :before-close="handleClose">
      <div>
        <el-input placeholder="最多20个字" maxlength="20" v-model.trim="newTypeName"> </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddType">确 定</el-button>
      </span>
    </el-dialog>
    <div class="videoMask" v-if="showVideoMask" v-loading="showVideoMask" element-loading-text="视频上传中，请耐心等待" element-loading-spinner="el-icon-loading"></div>
  </div>
</template>
<script>
import { skillTypeList, skillTypeAdd, skillTypeDelete, skillList, skillDelete, skillInfo, skillAdd, skillEdit } from '@/api/information';

export default {
  name: 'skillsTraining',
  data() {
    var validateVideo = (rule, value, callback) => {
      if (!this.ruleForm.video) {
        callback(new Error('请上传视频'));
      } else {
        callback();
      }
    };
    var validateImage = (rule, value, callback) => {
      if (!this.ruleForm.image) {
        callback(new Error('请上传视频封面'));
      } else {
        callback();
      }
    };
    return {
      showVideoMask: false,
      videoFlag: false,
      videoUploadPercent: 0,
      newTypeName: '',
      typeNameVisible: false,
      typeLoading: false,
      typeTableData: [],
      publish2Options: [
        { label: '关', value: '0' },
        { label: '开', value: '1' },
      ],
      typeDialogVisible: false,
      fileList: [],
      action: '/web/public/upload',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      detailVisible: false,
      infoForm: {},
      ruleForm: {
        video: '',
        videoId: '',
        image: '',
        imageId: '',
        is_open: '',
        publish: true,
      },
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      rules: {
        video: [{ validator: validateVideo, trigger: 'blur' }],
        image: [{ validator: validateImage, trigger: 'blur' }],
        content: [
          {
            required: true,
            min: 10,
            max: 255,
            message: '不少于10个字',
            trigger: 'blur',
          },
        ],
        title: [
          {
            required: true,
            min: 1,
            max: 10,
            message: '不超过10个字',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择视频类型',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      showVideo: false,
      dynamicVideo: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      userName: '',
      tableData: [],
      options: {
        initialViewIndex: 0,
      },
      images: [],
      loading: false,
      publishOptions: [],
      publishType: '',
      type: '',
      publisher: '',
      searchId: '',
      timeRange: [],
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
      total: 0,
      pageSize: 10,
      currentPage: 1,
      currentSecPage: 1,
      pageSecSize: 10,
      secTotal: 0,
      globalLoading: '',
    };
  },
  mounted() {
    this.fetchTypeListForHome();
    this.fetchList();
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    runSearch() {
      this.currentPage = 1;
      this.fetchList();
    },
    resetAction() {
      this.type = '';
      this.timeRange = [];
      this.currentPage = 1;
      this.pageSize = 10;
      this.publishType = '';
      this.fetchList();
    },
    popDeleteMainItem(row) {
      this.$alert(`确定删除该条目`, '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action == 'confirm') {
            skillDelete({
              skill_id: row.id,
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
    changeSwitch(scope) {
      let data = {
        skill_id: scope.row.id,
        is_open: scope.row.is_open ? 1 : 0,
      };
      skillEdit(data).then((res) => {
        if (res && res.code == 0) {
          this.$message.success('修改成功');
          this.fetchList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    confirmAddAction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let track = this.publishOptions.find((ele) => {
            return ele.id == this.ruleForm.type;
          });
          let data = {
            release_type: this.ruleForm.type,
            release_name: track.name,
            title: this.ruleForm.title,
            content: this.ruleForm.content,
            video: this.ruleForm.videoId,
            image: this.ruleForm.imageId,
            is_open: this.ruleForm.publish ? 1 : 0,
          };
          skillAdd(data)
            .then((res) => {
              if (res && res.code === 0) {
                this.$message.success('添加成功');
                this.currentPage = 1;
                this.fetchList();
                this.dialogVisible = false;
                this.$refs[formName].resetFields();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    resetField(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    checkDetail(row) {
      skillInfo({
        skill_id: row.id,
      })
        .then((res) => {
          if (res && res.code === 0) {
            this.detailVisible = true;
            this.infoForm = res.data;
            this.infoForm.type = res.data.release_type;
            this.infoForm.is_open = Boolean(res.data.is_open);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    confirmAddType() {
      if (this.newTypeName) {
        skillTypeAdd({
          name: this.newTypeName,
        })
          .then((res) => {
            if (res && res.code === 0) {
              this.$message.success('新增成功');
              this.typeNameVisible = false;
              this.currentSecPage = 1;
              this.newTypeName = '';
              this.fetchTypeListForHome();
              this.fetchTypeList();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message.error('请填写名称');
      }
    },
    fetchTypeListForHome() {
      skillTypeList({
        page: 1,
        page_size: 10000,
      })
        .then((res) => {
          if (res && res.code === 0) {
            this.publishOptions = res.data.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchTypeList() {
      skillTypeList({
        page: this.currentSecPage,
        page_size: this.pageSecSize,
      })
        .then((res) => {
          if (res && res.code === 0) {
            this.typeTableData = res.data.data;
            this.secTotal = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSecCurrentChange(e) {
      this.currentSecPage = e;
      this.fetchTypeList();
    },
    popTypeDelete(row) {
      this.$alert(`该类型下存在${row.count}个视频，删除该类型将一起删除，确定执行该操作`, '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action == 'confirm') {
            skillTypeDelete({
              id: row.id,
            })
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('删除成功');
                  this.typeNameVisible = false;
                  this.currentSecPage = 1;
                  this.newTypeName = '';
                  this.fetchTypeListForHome();
                  this.fetchTypeList();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.typeNameVisible = false;
          }
        },
      });
    },
    fetchList() {
      skillList({
        type: this.type,
        start_time: this.timeRange ? this.timeRange[0] : undefined,
        end_time: this.timeRange ? this.timeRange[1] : undefined,
        page: this.currentPage,
        page_size: this.pageSize,
        is_open: this.publishType,
      }).then((res) => {
        if (res && res.code === 0) {
          res.data.data.forEach((item) => {
            item.is_open = item.is_open == 0 ? false : true;
          });
          this.tableData = res.data.data;
          this.total = res.data.total;
          //   this.initVideo();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.fetchList();
    },
    popAddType() {
      this.fetchTypeList();
      this.typeDialogVisible = true;
    },
    popVideoPlayer(src) {
      this.showVideo = true;
      this.dynamicVideo = src;
    },
    shutVideo() {
      this.showVideo = false;
    },
    handleClose(done) {
      done();
    },
    popUploadDialog() {
      this.dialogVisible = true;
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.showVideoMask = true;
    },
    successFileVideo(res) {
      this.ruleForm.video = res.data.url;
      this.ruleForm.videoId = res.data.id;
      this.videoFlag = false;
      this.$message.success('视频上传成功');
      setTimeout(() => {
        this.showVideoMask = false;
      }, 400);
    },
    handleRemoveFileVideo() {
      console.log();
    },
    handleRemoveFile() {
      console.log();
    },
    //   上传成功
    successFile(res) {
      this.ruleForm.image = res.data.url;
      this.ruleForm.imageId = res.data.id;
    },
    // 图片上传
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB');
        return false;
      }
    },
    beforeUploadVideo(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      const isLegal = file.type === 'video/mp4' || file.type === 'video/avi' || file.type === 'video/wmv';
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB');
        return false;
      }
      if (!isLegal) {
        this.$message.error('视频格式支持mp4/avi/wmv');
        return false;
      }
    },
    popTypeDialog() {
      this.typeNameVisible = true;
    },
  },
};
</script>
<style scoped lang="scss">
.flexFormItem {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  width: 600px;
}
.videoMask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3000;
  bottom: 0;
}
.mask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  bottom: 0;
  .videoCon {
    border-radius: 10px;
    background-color: #fff;
    width: 800px;
    height: 610px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    box-sizing: border-box;
    video {
      width: 300px;
    }
    .shutCon {
      height: 50px;
      text-align: right;
      padding-right: 40px;
      padding-top: 20px;
    }
    .shutIcon {
      font-size: 30px;
    }
  }
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
.fixWidthVideo {
  width: 200px;
}
.skillsTraining {
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
  .publishArea {
    margin-bottom: 20px;
  }
}
.demo-ruleForm {
  //   width: 400px;
}
</style>
<style lang="scss">
.skillsTraining {
  .el-loading-spinner {
    .el-loading-text {
      font-size: 20px;
      font-weight: 500;
      color: #5692ca;
    }
    i {
      font-size: 30px;
      color: #5692ca;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .datePickerCon {
    .el-date-editor {
      width: 260px;
    }
  }
  .demo-ruleForm {
    .el-form-item__content {
      width: 70%;
      margin-left: 0 !important;
    }
  }
}
</style>

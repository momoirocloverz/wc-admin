<template>
  <div class="file_uplaod">
    <el-upload
      ref="upload"
      class="avatar-uploader"
      :action="action"
      list-type="picture-card"
      :show-file-list="true"
      :file-list="fileList"
      :on-success="handleAvatarSuccess"
      :before-upload="handleBeforeUpload"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :headers="headers"
      :multiple="false"
      name="file"
      accept="image/*"
      :limit="limit"
    >
      <i class="el-icon-plus" />
      <template
        slot="file"
        v-if="file.status === 'success'"
        slot-scope="{ file }"
      >
        <div class="upload-file-content">
          <img class="el-upload-list__item-thumbnail" :src="file.url" />
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePicturePreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="preview_dialog"
      append-to-body
    >
      <img v-if="dialogVisible" width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    limit: {
      // 图片数量限制
      type: Number,
      default: 0
    },
    size: {
      // 上传大小上限MB
      type: Number,
      default: 0
    },
    originList: {
      type: [Array, String], // 单张为String, 多张为Array
      default: ""
    },
    fileId: {
      type: [String, Number], // 单张为Number, 多张为String
      default: ""
    }
  },
  data() {
    return {
      action: "/web/public/upload",
      fileAction: "/web/user/import/nhxx",
      headers: {
        Authorization: sessionStorage.getItem("token")
      },
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  mounted() {
    if (!this.fileId) return;
    let fileId = this.fileId;
    let originList = this.originList;
    if (typeof fileId === Number) {
      this.fileList.push({ id: fileId, url: originList });
    } else {
      if (!Array.isArray(fileId)) {
        fileId = String(fileId).split(",");
      }
      if (!Array.isArray(originList)) {
        originList = originList.split(",");
      }
      fileId.forEach((item, index) => {
        this.fileList.push({ id: item, url: originList[index] });
      });
    }
    // 初始化时 将处理后的图片信息 传回父组件
    this.getFileList();
  },
  methods: {
    handlePicturePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    handleAvatarSuccess(res) {
      // const { url, id } = res.data
      // this.formData.imageUrl.push(url)
      // this.formData.image.push(id)
    },
    handleExceed(files, fileList) {
      this.$message({
        type: "warning",
        message: `上传文件最大数量为：${this.limit}个`
      });
    },
    handleRemove(file, fileList) {
      const index = this.$refs.upload.uploadFiles.findIndex(
        item => item === file
      );
      this.$refs.upload.uploadFiles.splice(index, 1);
      this.handleChange();
    },
    handleChange() {
      this.$emit("handleChange", this.getFileList());
    },
    getFileList() {
      const uploadFiles = this.$refs.upload.uploadFiles.filter(
        item => item.status === "success"
      );
      return uploadFiles.map(item => {
        return item.response ? +item.response.data.id : +item.id;
      });
    },
    handleBeforeUpload(file) {
      if (this.size) {
        const fileSize = file.size / 1024 / 1024;
        if (this.size < fileSize) {
          this.$message({
            type: "warning",
            message: `上传文件限制大小为：${this.size}MB`
          });
          return false;
        }
      }
      if (this.limit) {
        const uploadFiles = this.$refs.upload.uploadFiles;
        const length = uploadFiles.length;
        if (this.limit < length) {
          this.$message({
            type: "warning",
            message: `上传文件最大数量为：${this.limit}个`
          });
          return false;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.file_uplaod {
  .el-upload-list__item,
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
  }
  .el-upload--picture-card {
    line-height: 100px;
    width: 100px;
    height: 100px;
  }
  .el-progress,
  .el-progress-circle {
    width: 80px !important;
    height: 80px !important;
  }
  .upload-file-content {
    width: 100px;
    height: 100px;
    img {
      width: 800%;
      height: 100%;
    }
  }
}
</style>

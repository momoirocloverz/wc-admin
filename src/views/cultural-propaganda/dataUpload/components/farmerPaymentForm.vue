<template>
  <div class="commonCon1">
    <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="120px" class="demo-ruleForm">
      <div class="selectText">
        <div v-if="multipleFlag">已选{{ selectId.length }}家低收入农户</div>
        <div v-else>已选低收入农户"{{ selectId[0].TName }}"</div>
      </div>
      <el-form-item label="打款金额(元/户)" prop="amount" class="flexFormItem">
        <el-input-number v-model="newForm.amount" :precision="2" :min="0" :step="1" :max="99999999999" placeholder="请输入"></el-input-number>
      </el-form-item>
      <el-form-item label="总金额(元)" class="flexFormItem">
        <div>{{ moneyFormat(newForm.amount * selectId.length) }}</div>
      </el-form-item>
      <div class="scrollCon">
        <el-form-item label="付款凭证" prop="image" class="flexFormItem fakeRequired">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            ref="upload"
            list-type="picture-card"
            :on-success="successFile"
            :on-change="fileChange"
            :action="action"
            :show-file-list="true"
            :before-upload="beforeUpload"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveFile"
            accept="image/*"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">上传1张jpg/png/gif图片,且大小不超过50M</div>
          </el-upload>
        </el-form-item>
      </div>
      <el-form-item>
        <div class="btnFlex">
          <el-button @click="cancelPayment('newForm')">取 消</el-button>
          <el-button type="primary" @click="closePayment('newForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { farmerManageRemit } from '@/api/bee';
export default {
  components: {},
  name: 'applicaCon',
  props: {
    data: {},
    multipleFlag: false,
    selectId: {},
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
      fileList: [],
      action: '/web/public/upload',
      extraParams: {},
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      newForm: {
        amount: '',
        allAmount: '',
      },
      newRules: {
        amount: {
          required: true,
          message: '打款金额不能为空',
          trigger: 'blur',
        },
        allAmount: {
          required: true,
          message: '总金额不能为空',
          trigger: 'blur',
        },
        image: [{ validator: validateImage, trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.info = this.data;
  },
  methods: {
    moneyFormat(value) {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
        return fix;
      }
    },
    cancelPayment(formName) {
      this.fileList = [];
      this.$refs[formName].resetFields();
      this.$emit('shutPayment');
    },
    closePayment(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newForm.amount == 0) {
            return this.$message.error('金额不能为0');
          } else {
            let data = {
              farmer_str: this.selectId
                .filter((ele) => {
                  return ele.farmer_id;
                })
                .map((ele) => {
                  return ele.farmer_id;
                })
                .join(','),
              amount: this.newForm.amount,
              img_id: this.fileList
                .map((ele) => {
                  return ele.response.data.id;
                })
                .join(','),
            };
            farmerManageRemit(data)
              .then((res) => {
                if (res && res.code == 0) {
                  this.$message.success('提交成功');
                  this.fileList = [];
                  this.$refs[formName].resetFields();
                  this.$emit('shutPayment');
                }
              })
              .catch((err) => {
                console.log('err', err);
              });
          }
        }
      });
    },
    handlePictureCardPreview(file) {
      window.open(file.url);
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
      //   console.log('fileList', fileList);
    },
    fileChange(file, fileList) {
      //   console.log('file', file);
      //   console.log('fileList', fileList);
      this.fileList = fileList;
      //   console.log( this.fileList )
    },
    successFile(res, file) {
      //   this.fileList.push(file);
      //   console.log('file', file);
      //   console.log('this.fileList', this.fileList);
    },
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      const isExcel = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
      if (!isExcel) {
        this.$message.error('请上传jpeg,gif,png格式');
        return false;
      }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB');
        return false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.scrollCon {
  overflow-y: auto;
  height: 340px;
}
.fakeRequired {
  position: relative;
  &::before {
    content: '*';
    color: #f56c6c;
    left: 40px;
    top: 10px;
    font-size: 16px;
    position: absolute;
  }
}
.commonCon1 {
  background-color: #fff;
}
.selectText {
  margin-bottom: 22px;
  font-weight: 700;
}
.btnFlex {
  display: flex;
  margin-left: 100px;
}
</style>

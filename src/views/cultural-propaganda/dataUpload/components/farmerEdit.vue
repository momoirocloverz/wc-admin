<template>
  <div class="commonCon1">
    <div class="scrollCon">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="姓名">
          <div>{{ ruleForm.name }}</div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" class="fixInput" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号">
          <div>{{ ruleForm.identity }}</div>
        </el-form-item>
        <!-- <el-form-item label="电话号码" prop="mobile">
          <el-input v-model.trim="ruleForm.mobile"></el-input>
        </el-form-item> -->
        <el-form-item label="电话号码">
          <!-- <el-input v-model.trim="ruleForm.mobile"></el-input> -->
          <div>{{ ruleForm.mobile }}</div>
        </el-form-item>
        <el-form-item label="家庭地址" prop="address">
          <el-input v-model.trim="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bank_name">
          <el-input v-model.trim="ruleForm.bank_name" v-if="ruleForm.matchStatus == 2"></el-input>
          <div v-else>{{ ruleForm.bank_name }}</div>
        </el-form-item>
        <el-form-item label="银行账号" prop="bank_card">
          <el-input v-model.trim="ruleForm.bank_card" v-if="ruleForm.matchStatus == 2"></el-input>
          <div v-else>{{ ruleForm.bank_card }}</div>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnFlex">
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="resetForm('ruleForm')">取消</el-button>
    </div>
    <viewer :images="images" :options="options" @inited="inited" class="viewer" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
  </div>
</template>
<script>
import { farmerManageInfo, farmerManageEdit } from '@/api/bee';
export default {
  components: {},
  name: 'applicaCon',
  props: {
    data: {},
  },
  data() {
    return {
      statusOptions: [
        {
          id: '1',
          name: '未脱贫',
        },
        {
          id: '2',
          name: '已脱贫',
        },
        {
          id: '3',
          name: '已去世',
        },
      ],
      status: '',
      info: {},
      options: {
        initialViewIndex: 0,
      },
      idList: [],
      images: [],
      userStatusMap: {
        1: '未脱贫',
        2: '已脱贫',
        3: '已去世',
      },
      ruleForm: {
        comment: '',
      },
      rules: {
        status: [{ required: true, message: '请选择', trigger: 'blur' }],
        comment: [{ required: true, message: '请填写', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.info = this.data;
    if (this.info.farmer_id) {
      farmerManageInfo({
        farmer_id: this.info.farmer_id,
      }).then((res) => {
        if (res && res.code === 0) {
          this.ruleForm = res.data;
          //   this.ruleForm.status = String(res.data.status);
          this.ruleForm.mobile = this.data.Tel;
          this.ruleForm.status = String(this.data.userStatus);
          this.ruleForm.matchStatus = this.data.matchStatus;
          //   this.idList = res.data.identity_image_url;
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      this.ruleForm = this.data;
      this.ruleForm.status = String(this.data.userStatus);
      this.ruleForm.name = this.data.TName;
      this.ruleForm.mobile = this.data.Tel;
      this.ruleForm.address = this.data.Address;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(' 是否确认操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let data = {
                userId: this.info.userId,
                userStatus: this.ruleForm.status,
                address: this.ruleForm.address,
                bank_name: this.ruleForm.bank_name || '',
                bank_card: this.ruleForm.bank_card || '',
              };
              farmerManageEdit(data).then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('修改成功');
                  this.$emit('shutEdit');
                } else {
                  this.$message.error(res.msg);
                }
              });
            })
            .catch(() => {
              //
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit('shutEdit');
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(index, item) {
      this.options.initialViewIndex = index;
      this.images = item;
      setTimeout(() => {
        this.$viewer.show();
      }, 400);
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .fixDescri {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fixInput {
  width: 97%;
}
.btnFlex {
  display: flex;
  justify-content: center;
}
.commonCon1 {
  background-color: #fff;
  .flexStart {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .flexBetween {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }
  .ml20 {
    margin-left: 20px;
  }
  .divide {
    width: 33%;
  }
  .distribute {
    width: 50%;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .scrollCon {
    height: 450px;
    overflow-y: scroll;
  }
  .idListItem {
    img {
      width: 80px;
      height: 80px;
      cursor: pointer;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .itemTitle {
    font-weight: 500;
    width: 100px;
  }
}
</style>

<template>
  <el-dialog
    :visible="dialogData.visible"
    :title="dialogData.title"
    :width="dialogData.width"
    @close="closeDialog"
  >
    <img
      :src="dialogData.imgSrc"
      v-if="dialogData.status == 1"
      class="dialog-pic"
    />
    <!-- 新增干部档案 -->
    <el-form
      :model="pairedModel"
      :rules="pairedRules"
      ref="paireInfo"
      label-width="100px"
      v-if="dialogData.status == 2"
    >
      <el-form-item label="干部姓名：" prop="Name">
        <el-input
          type="text"
          v-model="pairedModel.Name"
          placeholder="请输入干部姓名"
        />
      </el-form-item>
      <el-form-item label="干部电话：" prop="Mobile">
        <el-input
          type="text"
          v-model="pairedModel.Mobile"
          placeholder="请输入干部电话"
        />
      </el-form-item>
      <el-form-item label="干部单位：" prop="Department">
        <el-input
          type="text"
          v-model="pairedModel.Department"
          placeholder="请输入干部单位"
        />
      </el-form-item>
      <div class="paired-button">
        <el-button type="primary" @click="submitPaired('paireInfo')"
          >确定</el-button
        >
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-form>
    <!-- 新增医生档案 -->
    <el-form
      :model="doctorModel"
      :rules="doctorRules"
      ref="doctorInfo"
      label-width="100px"
      v-if="dialogData.status == 3"
    >
      <el-form-item label="医生姓名：" prop="Name">
        <el-input
          type="text"
          v-model="doctorModel.Name"
          placeholder="请输入医生姓名"
        />
      </el-form-item>
      <el-form-item label="医生电话：" prop="Mobile">
        <el-input
          type="text"
          v-model="doctorModel.Mobile"
          placeholder="请输入医生电话"
        />
      </el-form-item>
      <div class="paired-button">
        <el-button type="primary" @click="submitDoctor('doctorInfo')"
          >确定</el-button
        >
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { addDoctorOrParied, editDcotorOrParied } from "@/api/pairedOrDoctor";
import { message } from "element-ui";
export default {
  name: "pairedsubmit",
  props: ["dialogData"],
  data() {
    return {
      pairedModel: {
        Name: this.dialogData.data ? this.dialogData.data.row.name : "",
        Mobile: this.dialogData.data ? this.dialogData.data.row.tel : "",
        Department: this.dialogData.data ? this.dialogData.data.row.dept : "",
      },
      pairedRules: {
        Name: [
          {
            required: true,
            message: "请输入干部姓名",
          },
        ],
        Mobile: [
          {
            required: true,
            message: "请输入干部电话",
          },
        ],
        Department: [
          {
            required: true,
            message: "请输入干部单位",
          },
        ],
      },
      doctorModel: {
        Name: this.dialogData.data ? this.dialogData.data.row.name : "",
        Mobile: this.dialogData.data ? this.dialogData.data.row.tel : "",
      },
      doctorRules: {
        Name: [
          {
            required: true,
            message: "请输入医生姓名",
          },
        ],
        Mobile: [
          {
            required: true,
            message: "请输入医生电话",
          },
        ],
      },
    };
  },
  methods: {
    // 提交
    submitDoctor(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 添加
          if (this.dialogData.isAdd) {
            let data = {
              type: 2,
              name: this.doctorModel.Name,
              tel: this.doctorModel.Mobile,
            };
            addDoctorOrParied(data).then((res) => {
              if (res.code === 0) {
                this.$message.success("添加成功");
                this.closeDialog1();
              }
            });
          } else {
            // 编辑
            let data = {
              type: 2,
              id: this.dialogData.data.row.id,
              name: this.doctorModel.Name,
              tel: this.doctorModel.Mobile,
            };
            editDcotorOrParied(data).then((res) => {
              if (res.code === 0) {
                this.$message.success("编辑成功");
                this.closeDialog1();
              }
            });
          }
        }
      });
    },
    // 干部添加按钮
    submitPaired(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 添加
          if (this.dialogData.isAdd) {
            let data = {
              type: 1,
              name: this.pairedModel.Name,
              dept: this.pairedModel.Department,
              tel: this.pairedModel.Mobile,
            };
            addDoctorOrParied(data).then((res) => {
              if (res.code === 0) {
                this.$message.success("添加成功");
                this.closeDialog1();
              }
            });
          } else {
            // 编辑
            let data = {
              id: this.dialogData.data.row.id,
              name: this.pairedModel.Name,
              dept: this.pairedModel.Department,
              tel: this.pairedModel.Mobile,
            };
            editDcotorOrParied(data).then((res) => {
              if (res.code === 0) {
                this.$message.success("编辑成功");
                this.closeDialog1();
              }
            });
          }
        }
      });
    },
    closeDialog() {
      if (this.dialogData.status == 2) {
        this.$refs["paireInfo"].resetFields();
      } else if (this.dialogData.status == 3) {
        this.$refs["doctorInfo"].resetFields();
      }
      this.$emit("closeDialogInfo");
    },
    closeDialog1() {
      if (this.dialogData.status == 2) {
        this.$refs["paireInfo"].resetFields();
      } else if (this.dialogData.status == 3) {
        this.$refs["doctorInfo"].resetFields();
      }
      this.$emit("closeDialogInfo1");
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-pic {
  width: 100%;
}
.paired-button {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
}
</style>
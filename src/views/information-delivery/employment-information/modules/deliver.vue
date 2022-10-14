<template>
  <div class="deliver base_form">
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item
        label="发布类型"
        prop="issue_category"
        :rules="rules.issue_category"
      >
        <el-radio-group v-model="formData.issue_category">
          <el-radio
            v-for="item in selectFirstOpts"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="发布分类"
        prop="crop_category"
        :rules="rules.crop_category"
      >
        <el-radio-group v-model="formData.crop_category">
          <el-radio
            v-for="item in selectOpts"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题" prop="issue_title" :rules="rules.issue_title">
        <el-input v-model="formData.issue_title" placeholder="不超过十个字" />
      </el-form-item>
      <el-form-item
        label="发布内容"
        prop="issue_content"
        :rules="rules.issue_content"
      >
        <el-input
          v-model="formData.issue_content"
          type="textarea"
          placeholder="不低于十个字"
        />
      </el-form-item>
      <el-form-item label="上传图片" prop="image" :rules="rules.image">
        <file-upload
          v-if="showUpload"
          ref="fileUpload"
          :originList="fileList"
          :fileId="fileIdObj"
          :limit="5"
          :size="50"
          @handleChange="handleChange"
        />
        <span>至少上传一张jpg/png/gif图片,且大小不超过50M</span>
      </el-form-item>
      <!-- <el-form-item label="单价(元)" prop="price" :rules="rules.price">
        <el-input-number v-model="formData.price" :controls="false" :precision="2" :min="0" />
      </el-form-item> -->
      <el-form-item
        label="单价(元)"
        prop="price"
        :rules="rules.price"
        class="is-required"
      >
        <el-radio-group v-model="radio">
          <div class="radioItem firstRadioItem">
            <el-radio label="1">单价</el-radio>
            <el-input-number
              v-model="formData.price1"
              :precision="2"
              :step="1"
              :max="99999999"
              :controls="false"
              placeholder="输入价格"
              :disabled="radio == '2'"
            ></el-input-number>
          </div>
          <div class="radioItem">
            <el-radio label="2">范围</el-radio>
            <el-input-number
              v-model="formData.price2"
              :precision="2"
              :step="1"
              :max="99999999"
              :controls="false"
              placeholder="输入最低价格"
              :disabled="radio == '1'"
            ></el-input-number>
            <div class="dashLine">-</div>
            <el-input-number
              v-model="formData.price3"
              :precision="2"
              :step="1"
              :max="99999999"
              :controls="false"
              placeholder="输入最高价格"
              :disabled="radio == '1'"
            ></el-input-number>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单位" prop="unit" :rules="rules.unit">
        <el-select v-model="formData.unit" placeholder="请选择">
          <el-option
            v-for="item in unitOptios"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="address" :rules="rules.address">
        <el-input v-model="formData.address" type="textarea" />
      </el-form-item>
      <el-form-item label="电话" prop="mobile" :rules="rules.tel">
        <el-input-number v-model="formData.mobile" :controls="false" />
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { AddMessage, EditMessage } from "@/api/information";
import fileUpload from "@/components/fileUpload/index";
export default {
  components: {
    fileUpload
  },
  props: {
    selectOpts: {
      type: Array,
      default: () => {
        [];
      }
    },
    selectFirstOpts: {
      type: Array,
      default: () => {
        [];
      }
    },
    currentItem: {
      default: {}
    },
    editFlag: {
      default: false
    }
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3-9]\d{9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    var validatePrice = (rule, value, callback) => {
      if (this.radio == "1") {
        if (this.formData.price1) {
          callback();
          this.formData.price = this.formData.price1;
        } else {
          callback(new Error("请输入单价"));
        }
      } else {
        if (!this.formData.price2 || !this.formData.price3) {
          callback(new Error("请输入单价"));
        } else if (+this.formData.price2 > +this.formData.price3) {
          callback(new Error("最低价不能大于最高价"));
        } else {
          callback();
          this.formData.price = `${this.formData.price2}-${this.formData.price3}`;
        }
      }
    };
    return {
      showUpload: false,
      radio: "1",
      formData: {
        issue_category: "",
        crop_category: "",
        issue_title: "",
        issue_content: "",
        issue_type: 2,
        image: "",
        price: "",
        price2: "",
        price3: "",
        price1: "",
        unit: "",
        address: "",
        mobile: undefined,
        operator: ""
      },
      select2Opts: [],
      fileList: [],
      fileIdObj: "1",
      rules: {
        crop_category: [
          {
            required: true,
            message: "请选择发布分类",
            trigger: "blur"
          }
        ],
        issue_category: {
          required: true,
          message: "请选择发布类型",
          trigger: "blur"
        },
        issue_title: {
          required: true,
          min: 1,
          max: 10,
          message: "不超过十个字",
          trigger: "blur"
        },
        issue_content: {
          required: true,
          min: 10,
          max: 255,
          message: "不少于十个字",
          trigger: "blur"
        },
        image: {
          required: true,
          message: "请至少上传一张图片",
          trigger: "blur"
        },
        // price: { required: true, message: '请输入单价', trigger: 'blur' },
        price: [{ validator: validatePrice, trigger: "blur" }],
        unit: { required: true, message: "请选择单位", trigger: "blur" },
        address: { required: true, message: "请输入地址", trigger: "blur" },
        tel: { validator: checkPhone, trigger: "blur", required: true }
      },
      headers: {
        Authorization: sessionStorage.getItem("token")
      },
      unitOptios: [
        // 单位
        { label: "月", value: "月" },
        { label: "天", value: "天" },
        { label: "小时", value: "小时" },
        { label: "件", value: "件" }
      ]
    };
  },
  mounted() {
    this.analyseData();
  },
  methods: {
    analyseData() {
      if (this.editFlag) {
        this.formData.issue_category = this.currentItem.issue_category;
        this.formData.crop_category = +this.currentItem.crop_category;
        this.formData.id = this.currentItem.id;
        this.formData.issue_title = this.currentItem.issue_title;
        this.formData.issue_content = this.currentItem.issue_content;
        this.formData.unit = this.currentItem.unit;
        this.formData.address = this.currentItem.address;
        this.formData.mobile = this.currentItem.mobile;
        let checkPriceType = this.currentItem.price.includes("-");
        if (checkPriceType) {
          this.radio = "2";
          let splitRes = this.currentItem.price.split("-");
          this.formData.price2 = splitRes[0];
          this.formData.price3 = splitRes[1];
        } else {
          this.radio = "1";
          this.formData.price1 = this.currentItem.price;
        }
        if (this.currentItem.image_path) {
          if (this.currentItem.image_path.length > 1) {
            this.fileList = this.currentItem.image_path;
            this.fileIdObj = this.currentItem.image;
            this.showUpload = true;
            this.formData.image = this.currentItem.image;
          } else {
            this.fileIdObj = this.currentItem.image;
            this.fileList = this.currentItem.image_path[0];
            this.formData.image = this.currentItem.image;
            this.showUpload = true;
          }
        }
      } else {
        this.showUpload = true;
        this.fileList = [];
        this.fileIdObj = "";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formData.operator = this.$store.getters.name;
          this.addMessage(this.formData);
        } else {
          return false;
        }
      });
    },
    handleChange(e) {
      console.log("e", e);
      this.formData.image = e.join(",");
    },
    addMessage(e) {
      if (this.editFlag) {
        e.id = String(this.currentItem.id);
        EditMessage(e).then(({ code }) => {
          if (code === 0) {
            this.cancel();
            this.$emit("getList");
            this.$message.success("编辑成功");
            this.$refs["form"].resetFields();
            this.formData.price2 = "";
            this.formData.price3 = "";
            this.formData.price1 = "";
            this.radio = "1";
          }
        });
      } else {
        AddMessage(e).then(({ code }) => {
          if (code === 0) {
            this.cancel();
            this.$emit("getList");
            this.$message.success("添加成功");
            this.$refs["form"].resetFields();
            this.formData.price2 = "";
            this.formData.price3 = "";
            this.formData.price1 = "";
            this.radio = "1";
          }
        });
      }
    },
    cancel() {
      this.$refs["form"].resetFields();
      this.formData.price2 = "";
      this.formData.price3 = "";
      this.formData.price1 = "";
      this.radio = "1";
      this.$refs.fileUpload.$refs.upload.clearFiles();
      this.$emit("closeDialog");
    }
  }
};
</script>

<style scoped lang="scss">
.radioItem {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}
.firstRadioItem {
  margin-bottom: 10px;
}
</style>

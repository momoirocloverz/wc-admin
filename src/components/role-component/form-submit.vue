<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible="visible"
    @close="handleCancel"
  >
    <div v-if="chooseList.length > 0" class="tab-list">
      <div
        v-for="(item, index) in chooseList"
        :key="item.name"
        :label="item.name"
        :class="index == chooseIndex ? 'select' : 'unselect'"
        @click="changeNew(index)"
      >
        {{ item.name }}
        <span
          class="close"
          v-if="index != chooseIndex"
          @click.stop="onEdit(index, 'remove')"
        >
          x
        </span>
      </div>

      <div class="unselect" @click.stop="onEdit(0, 'add')">+</div>
    </div>

    <el-form
      label-width="100px"
      :model="userModel"
      :rules="userRules"
      ref="formUser"
    >
      <el-form-item label="用户名：" prop="userName">
        <el-input
          type="text"
          v-model="userModel.userName"
          maxlength="20"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="真实姓名：" prop="trueName">
        <el-input
          type="text"
          v-model="userModel.trueName"
          placeholder="请输入真实姓名"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="密码：" prop="pwd">
        <el-input
          type="password"
          v-model="userModel.pwd"
          placeholder="请输入密码"
          maxlength="20"
          show-password
          @change="passwordChange"
        />
      </el-form-item>
      <el-form-item label="电话：" prop="mobile">
        <el-input
          type="text"
          maxlength="11"
          v-model="userModel.mobile"
          placeholder="请输入电话号码"
        />
      </el-form-item>
      <el-form-item label="角色：" prop="role">
        <el-select
          v-model="userModel.role"
          placeholder="请选择用户角色"
          class="role-select"
        >
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="授权区域：" class="role-textarea" prop="roleArea">
        <el-cascader
          placeholder="请选择授权区域"
          v-model="userModel.roleArea"
          :options="options"
          @change="handleChange"
          :clearable="true"
          :change-on-select="true"
          class="select-textarea"
        ></el-cascader>
      </el-form-item>
      <div class="el-form-btn">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitHandleOk('formUser')"
          >确定</el-button
        >
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { TownInfo, VillageInfo } from "@/api/common";
import { getRoleManageList } from "@/api/role";
import { cityJson } from "@/utils/city";
import {
  addAccountList,
  editAccountList,
  zzdAccessToken,
  zzdTicket
} from "@/api/account";
import dd from "gdt-jsapi";
export default {
  name: "roleformsubmit",
  props: ["title", "width", "visible", "isAdd", "scope"],
  data() {
    var validatePass = (rule, value, callback) => {
      let reg = /^(?=.*[a-zA-Z])(?=.*\d)/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("至少8位, 包括至少一个数字和一个字母"));
      }
    };
    return {
      options: cityJson,
      roleList: [],
      userModel: {
        roleArea: this.scope
          ? this.scope.row.village_id
            ? [this.scope.row.town_id, this.scope.row.village_id]
            : [this.scope.row.town_id]
          : [],
        userName: this.scope ? this.scope.row.username : "",
        trueName: this.scope ? this.scope.row.real_name : "",
        pwd: "",
        mobile: this.scope ? this.scope.row.mobile : "",
        role: this.scope ? this.scope.row.role_id : ""
      },
      brigeData: { validator: validatePass, trigger: "blur" },
      userRules: {
        userName: [
          {
            required: true,
            message: "请输入用户名"
          },
          {
            min: 5,
            max: 20,
            message: "用户名最少输入5位最多20位"
          }
        ],
        roleArea: [
          {
            required: true,
            message: "请选择授权区域"
          }
        ],
        trueName: [
          {
            required: true,
            message: "请输入真实姓名"
          },
          {
            max: 20,
            message: "真实姓名最多20位"
          }
        ],
        pwd: [
          {
            required: true,
            message: "请输入密码"
          },
          {
            min: 8,
            max: 20,
            message: "密码最少输入8位最多20位"
          },
          { validator: validatePass, trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            message: "请输入电话号码"
          },
          {
            min: 11,
            max: 11,
            message: "请输入11位手机号"
          }
        ],
        role: [
          {
            required: true,
            message: "请选择用户角色"
          }
        ]
      },
      chooseList: [], // 当前浙政钉选择的人，所有的数据都在这里维护
      chooseListLength: 0, // 当前数组的长度
      chooseIndex: 0, // 当前选择
      chooseName: "", // 当前选中的人
      chooseFirst: true // 当前是否是第一次选择人
    };
  },
  created() {
    if (!this.isAdd) {
      this.userRules.pwd = [];
    }
    this.getRoleListInfo();
  },
  watch: {
    chooseListLength(newV, oldV) {
      console.log(newV);
      // 监听当前数据是否变化，如果有变化则重置第一条数据
      if (newV > 0) {
        this.changeNew(this.chooseIndex); // 返回到第一个数据
      }
    }
  },
  methods: {
    passwordChange() {
      this.$nextTick(() => {
        if (!this.isAdd) {
          if (this.userModel.pwd) {
            this.userRules.pwd = [
              {
                min: 8,
                max: 20,
                message: "密码最少输入8位最多20位"
              },
              this.brigeData
            ];
          } else {
            this.userRules.pwd = [];
          }
        }
      });
    },
    handleChange(e) {
      if (e.length != 2) {
        let data = {
          town_id: e[0]
        };
        VillageInfo(data).then(res => {
          if (res.code === 0) {
            res.data.map(item => {
              item.value = item.id;
              item.label = item.village_name;
            });
            let index = 0;
            this.options.map((item, indexs) => {
              if (item.id == e[0]) {
                index = indexs;
              }
            });
            this.options[index].children = res.data;
          }
        });
      }
    },
    submitHandleOk(formName) {
      if (this.isAdd) {
        dd.getAuthCode({})
          .then(res => {
            // 如果浙政钉环境下
            this.handleNewOk();
          })
          .catch(() => {
            this.handleOk("formUser");
          });
      } else {
        this.handleOk("formUser");
      }
    },
    handleOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            username: this.userModel.userName,
            real_name: this.userModel.trueName,
            password: this.userModel.pwd,
            mobile: this.userModel.mobile,
            role_id: this.userModel.role,
            town_id: this.userModel.roleArea[0],
            village_id:
              this.userModel.roleArea.length == 2
                ? this.userModel.roleArea[1]
                  ? this.userModel.roleArea[1]
                  : 0
                : 0
          };
          if (this.isAdd == true) {
            addAccountList(data).then(res => {
              if (res.code === 0) {
                this.$message.success("添加成功");
                this.resetInfo(formName);
              }
            });
          } else {
            if (!this.userModel.pwd) {
              delete data.password;
            }
            editAccountList({ admin_id: this.scope.row.id, ...data }).then(
              res => {
                if (res.code === 0) {
                  this.$message.success("编辑成功");
                  this.resetInfo(formName);
                }
              }
            );
          }
        }
      });
    },
    resetInfo(formName) {
      this.userModel = {
        userName: "",
        trueName: "",
        pwd: "",
        mobile: "",
        role: ""
      };
      this.$refs[formName].resetFields();
      this.$emit("hideAccountOption");
    },
    getRoleListInfo() {
      let data = {
        page: 1,
        page_size: 100
      };
      getRoleManageList(data).then(res => {
        if (res.code === 0) {
          res.data.data.map(item => {
            item.label = item.name;
            item.value = item.role_id;
          });
          this.roleList = res.data.data;
          this.userModel.role = this.scope ? this.scope.row.role_id : "";
        }
      });
    },
    handleCancel() {
      this.$emit("clickCancel");
    },
    // 获取accessToken
    getAccessToken() {
      zzdAccessToken({}).then(res => {
        if (res.code == 0 && res.data.success && res.data.content.success) {
          this.getTicket(res.data.content.data.accessToken);
        }
      });
    },
    //获取tikcet
    getTicket(access_token) {
      zzdTicket({ access_token }).then(res => {
        this.getContact(res.data.content.data.accessToken);
      });
    },
    // 获取组织
    getContact(ticket) {
      dd.authConfig({
        ticket,
        jsApiList: ["chooseContactWithComplexPicker"]
      })
        .then(res1 => {
          dd.chooseContactWithComplexPicker({
            panelTypes: 1,
            responseUserOnly: true
          })
            .then(res => {
              this.dealContact(res);
            })
            .catch(err => {
              this.cancelChoose();
            });
        })
        .catch(err1 => {
          this.cancelChoose();
        });
    },
    // 取消选择
    cancelChoose() {
      this.$alert(this.chooseList.length, "cancelChoose", {
        confirmButtonText: "确定",
        callback: action => {}
      });
      // 如果没有选择，那么则直接emit，关闭当前弹窗
      if (this.chooseList.length == 0) {
        this.$emit("cancel");
      }
    },
    // 从浙政钉新增用户，本地处理数据
    dealContact(e) {
      if (e.users && e.users.length > 0) {
        // 这里多做一层判断，理论上一定会返回数组
        let newList = e.users; // 当前新选择用户数据
        let connectList = []; // 最终的列表数据
        let list = JSON.parse(JSON.stringify(this.chooseList));
        for (let item1 of newList) {
          item1.closable = true;
          item1.userName = item1.name;
          item1.trueName = item1.name;
          item1.roleArea = [];
          item1.pwd = "";
          item1.role = ""; // 后台角色
          item1.mobile = "";
          item1.zzdUserId = item1.userid; // 浙政钉员工id
          item1.isFinish = 0; // 标记是否已经处理完毕
          if (this.chooseList.length > 0) {
            let isEqual = false; // 判断是否相等过
            for (let item of this.chooseList) {
              if (item.userid == item1.userid) {
                isEqual = true;
                break;
              }
            }
            if (!isEqual) {
              connectList.push(item1);
            }
          } else {
            connectList.push(item1);
          }
        }
        if (this.chooseList.length > 0) {
          this.chooseFirst = false;
        }
        this.chooseList = list.concat(connectList);
        this.chooseListLength = this.chooseList.length;
        // if (connectList.length == 0) {
        //   this.changeNew(0);
        // }
      }
    },

    // 点击切换新增的人，index参数必传，为当前列表数组下标
    changeNew(index) {
      // 处理当前列表数据
      if (!this.chooseFirst) {
        this.dealNewForm();
      } else {
        // 这里同步当前是否已经选择过了
        this.chooseFirst = false;
      }
      // 这里做个延时处理
      setTimeout(() => {
        let item = this.chooseList[index];
        // console.log(item);
        this.userModel = {
          userName: item.userName,
          trueName: item.trueName,
          pwd: item.pwd,
          mobile: item.mobile,
          role: item.role,
          roleArea: item.roleArea
        };
        // console.log(this.userModel);
        this.chooseIndex = index;
        this.chooseName = item.name;
      }, 350);
    },

    // 这里处理当前表单数据
    dealNewForm() {
      let item = this.chooseList[this.chooseIndex];
      let chooseList1 = JSON.parse(JSON.stringify(this.chooseList));

      this.$refs["formUser"].validate(valid => {
        let isFinish = 0;
        // 这里判断当前表单是否已经全部
        if (valid) {
          isFinish = 1;
        }
        // console.log("userModel", this.userModel);
        // this.$alert(JSON.stringify(this.userModel), "提示" + isFinish, {
        //   confirmButtonText: "确定",
        // });
        let data = {
          userid: item.userid,
          name: item.name,
          zzdUserId: item.zzdUserId,
          isFinish,
          userName: this.userModel.userName,
          trueName: this.userModel.trueName,
          pwd: this.userModel.pwd,
          mobile: this.userModel.mobile,
          role: this.userModel.role,
          roleArea: this.userModel.roleArea
        };
        chooseList1[this.chooseIndex] = data;
        this.chooseList = chooseList1;
        // console.log(this.chooseList);
      });
    },
    // 浙政钉： 这里新增人员
    handleNewOk(e) {
      // 提交之前先处理一遍当前表单数据
      this.dealNewForm();
      setTimeout(() => {
        let isFinish = true;
        let list = this.chooseList;
        for (let index in list) {
          if (list[index].isFinish == 0) {
            isFinish = false;
            setTimeout(() => {
              this.changeNew(index);
            }, 250);
            break;
          }
        }
        if (isFinish) {
          // 如果数据已经填写完毕，那么则执行接口
          this.$alert("确定创建管理员吗？", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              if (action == "confirm") {
                this.adminCreate();
              }
            }
          });
        } else {
          this.$message.warning("请先完善人员信息！");
        }
      }, 500);
    },
    // 点击删除、新增操作
    onEdit(index, action) {
      if (action == "remove") {
        let item = this.chooseList[index];
        let list = JSON.parse(JSON.stringify(this.chooseList));
        // 如果是移除
        this.$alert("确定移除" + item.name + "吗？", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            if (action == "confirm") {
              list.splice(index, 1); // 删除一条数据
              this.chooseList = JSON.parse(JSON.stringify(list)); // 重新赋值
              if (index < this.chooseIndex) {
                this.chooseIndex--;
              }
            }
          }
        });
      } else if (action == "add") {
        // 如果是新增
        this.addPeople();
      }
    },
    // 点击继续追加管理人员操作
    addPeople() {
      this.getAccessToken();
    },
    // 请求接口新增用户
    adminCreate() {
      for (let item of this.chooseList) {
        let data = {
          // 基本数据
          username: item.userName,
          password: item.pwd,
          role_id: item.role,
          zzdUserId: item.zzdUserId,
          real_name: item.trueName,
          mobile: item.mobile,
          town_id: item.roleArea[0],
          village_id:
            item.roleArea.length == 2
              ? item.roleArea[1]
                ? item.roleArea[1]
                : 0
              : 0
        };
        addAccountList(data)
          .then(res => {
            if (res && res.code === 0) {
              // console.log(res)
              this.$message.success("新建管理员成功！");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      this.chooseList = []; // 循环完毕之后清空数据，这里不考虑请求失败问题
      this.$emit("addSuccess");
    }
  }
};
</script>
<style lang="scss" scoped>
.role-select {
  width: 100%;
}
.el-form-btn {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.tab-list {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .select {
    height: 30px;
    line-height: 28px;
    margin-right: 10px;
    padding: 0 10px;
    background-color: rgba(13, 115, 255, 0.2);
    border: 1px solid rgba(13, 115, 255, 0.4);
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    color: rgba(13, 115, 255, 0.8);
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    span {
      width: 20px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      font-size: 16px;
    }
  }
  .unselect {
    height: 30px;
    line-height: 28px;
    margin-right: 10px;
    padding: 0 10px;
    border-radius: 4px;
    background-color: ffffff;
    border: 1px solid #f0f0f0;
    box-sizing: border-box;
    font-size: 16px;
    color: #c0c0c0;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    span {
      width: 20px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      font-size: 16px;
    }
  }

  .unselect:hover {
    background-color: rgba(13, 115, 255, 0.2);
    border: 1px solid rgba(13, 115, 255, 0.4);
    color: rgba(13, 115, 255, 0.8);
  }
}
</style>

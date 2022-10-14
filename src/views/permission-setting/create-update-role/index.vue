<template>
  <div class="create-role">
    <div class="role-back">
      <el-button type="primary" class="role-back" @click="backRole">返回</el-button>
    </div>
    <el-form label-width="100px" class="role-form" :model="formData" :rules="formRules" ref="formRule"  :disabled="type == 3 ? true : false">
      <el-form-item label="角色名称：" prop="roleName">
        <el-input type="text" v-model="formData.roleName" placeholder="请输入角色名称" :disabled="type == 3 ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="角色描述：" prop="roleDesc">
        <el-input type="text" v-model="formData.roleDesc" placeholder="请输入角色描述" :disabled="type == 3 ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="权限配置：" v-if="option.includes(56)"></el-form-item>
      <!-- <el-form-item label="授权区域：" class="role-textarea" prop="roleArea" v-if="option.includes(56)">
        <el-cascader
          placeholder="请选择授权区域"
          v-model="formData.roleArea"
          :options="options"
          @change="handleChange"
          :disabled="type == 3 ? true : false"
          :clearable="true"
          :change-on-select="true"
          class="select-textarea"
        ></el-cascader>
      </el-form-item> -->
      <!-- <ul class="role-ul-info">
        <li class="role-li-info">
          <span>导航</span>
          <span>权限名</span>
        </li>
        <li v-for="(item, index) in permiseList" :key="item.id">
          <div class="first-div">
            <el-checkbox
              class="role-checkout"
              v-model="item.checked"
              @change="changeAllPermise(index)"
              :disabled="type == 3 ? true : false"
              >{{ item.name }}</el-checkbox
            >
          </div>
          <div class="last-div">
            <el-checkbox
              class="role-checkout"
              v-model="items.checked"
              v-for="(items, indexs) in item.related"
              :key="items.id"
              :disabled="type == 3 ? true : false"
              @change="changeChecked(index, indexs)"
              >{{ items.name }}</el-checkbox
            >
          </div>
        </li>
      </ul> -->
      <el-tree :data="permiseList" default-expand-all ref="tree" check-on-click-node show-checkbox node-key="id" :props="defaultProps" :check-strictly="true"> </el-tree>
      <!-- @check="clickDeal" -->
      <!-- @check-change="handleCheckChange" -->
      <el-button type="primary" class="role-submit" @click="submitRole('formRule')" :disabled="type == 3 ? true : false">提交</el-button>
    </el-form>
  </div>
</template>
<script>
import { TownInfo, VillageInfo } from '@/api/common';
import { getPermiseRoleList, createRoleInfo, getRoleListDetail, editRoleInfo } from '@/api/role';
import { cityJson } from '@/utils/city';
export default {
  name: 'createupdaterole',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      formData: {
        roleName: '',
        roleDesc: '',
        roleArea: '',
      },
      formRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
          },
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
          },
        ],
        roleArea: [
          {
            required: true,
            message: '请选择授权区域',
          },
        ],
      },
      options: cityJson,
      permiseList: [],
      type: this.$route.query.type,
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.getRoleDetailInfo();
    } else {
      this.getPermiseRoleListInfo();
    }
  },
  methods: {
    clickDeal(currentObj, treeStatus) {
      console.log('currentObj', currentObj);
      console.log('treeStatus', treeStatus);
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中
      console.log('selected', selected);
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj);
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true);
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj && currentObj.children && currentObj.children.length !== 0) {
          this.uniteChildSame(currentObj, false);
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      console.log(treeList);
      console.log(isSelected);
      let len = treeList && treeList.children && treeList.children.length > 0;
      console.log(len);
      this.$refs.tree.setChecked(treeList.id, isSelected);
      for (let i = 0; i < len; i++) {
        this.uniteChildSame(treeList.children[i], isSelected);
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      let currentNode = this.$refs.tree.getNode(currentObj);
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true);
        this.selectedParent(currentNode.parent);
      }
    },

    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },

    // 获取详情信息
    getRoleDetailInfo() {
      let data = {
        role_id: this.$route.query.id,
      };
      getRoleListDetail(data).then((res) => {
        if (res.code == 0) {
          this.formData = {
            roleName: res.data.name,
            roleDesc: res.data.comment,
            roleArea: res.data.village ? [parseInt(res.data.town), parseInt(res.data.village)] : [parseInt(res.data.town)],
          };
          res.data.navigate.map((item) => {
            item.is_selected ? (item.checked = true) : (item.checked = false);
            if (item.related && item.related.length > 0) {
              item.related.map((items) => {
                items.is_selected ? (items.checked = true) : (items.checked = false);
              });
            }
          });
          this.permiseList = res.data.navigate;
          let empty = [];
          function loopItem(ele) {
            if (ele) {
              if (ele.is_selected) {
                empty.push(ele);
              }
            }
            if (ele.children && ele.children.length) {
              ele.children.forEach((sub) => {
                if (sub.is_selected) {
                  empty.push(sub);
                }
                loopItem(sub);
              });
            }
          }
          this.permiseList.forEach((ele) => {
            loopItem(ele);
          });
          let ids = empty.map((ele) => {
            return ele.id;
          });
          let pureCode = ids;
          this.$refs.tree.setCheckedKeys(pureCode);
        }
      });
    },
    // 选择单个所有
    changeAllPermise(index) {
      if (!this.permiseList[index].checked) {
        this.permiseList[index].related.map((item) => {
          item.checked = false;
        });
      }
    },
    // 选择权限
    changeChecked(index, indexs) {
      let isChecked = this.permiseList[index].related.some((item) => item.checked);
      if (isChecked) {
        this.permiseList[index].checked = true;
      }
    },
    getPermiseRoleListInfo() {
      getPermiseRoleList().then((res) => {
        if (res.code === 0) {
          res.data.map((item) => {
            item.checked = false;
            if (item.related && item.related.length > 0) {
              item.related.map((items) => {
                items.checked = false;
              });
            }
          });
          this.permiseList = res.data;
        }
      });
    },
    handleChange(e) {
      if (e.length != 2) {
        let data = {
          town_id: e[0],
        };
        VillageInfo(data).then((res) => {
          if (res.code === 0) {
            res.data.map((item) => {
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
    getTownListInfo() {
      TownInfo().then((res) => {
        if (res.code === 0) {
          res.data.map((item) => {
            item.label = item.town_name;
            item.value = item.id;
            item.children = [];
          });
          this.options = res.data;
        }
      });
    },
    submitRole(formName) {
      let permCodeList = this.$refs.tree.getCheckedNodes(false, true);
      console.log('permCodeList', permCodeList);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let permiseId = [];
          if (permCodeList && permCodeList.length) {
            permiseId = permCodeList.map((ele) => {
              return ele.id;
            });
          }
          /*  if (permiseId.length == 0) {
            return this.$message.error('请选择导航信息');
          } */
          let data = {
            name: this.formData.roleName,
            comment: this.formData.roleDesc,
            // town:this.formData.roleArea[0],
            // village:this.formData.roleArea.length==2?this.formData.roleArea[1]:undefined,
            permission_id: permiseId.join(','),
          };
          // 创建角色
          if (this.type == 1) {
            createRoleInfo(data).then((res) => {
              if (res.code == 0) {
                this.$message.success('创建角色成功');
                this.$router.back();
              }
            });
          } else {
            // 编辑角色
            editRoleInfo({ role_id: this.$route.query.id, ...data }).then((res) => {
              if (res.code == 0) {
                this.$message.success('编辑角色成功');
                this.$router.back();
              }
            });
          }
        }
      });
    },
    backRole() {
      this.$router.back();
    },
  },
};
</script>
<style lang="scss" scoped>
.create-role {
  width: 98%;
  margin: 15px auto 0px auto;
  background: #fff;
  padding-bottom: 30px;
  .role-back {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .role-back {
    margin: 20px 20px 0px 0px;
  }
  .role-form {
    width: 70%;
    display: flex;
    flex-direction: column;
    margin: 40px auto 0px auto;
  }
  .role-textarea {
    margin-left: 100px;
    margin-top: -30px;
  }
  .select-textarea {
    width: 260px;
  }
  .area-table {
    width: 80%;
    margin: 0px auto;
  }
  .role-ul-info {
    width: 92%;
    display: flex;
    flex-direction: column;
    margin-left: 70px;
    li {
      padding: 15px 0px;
      border-bottom: #eee solid 1px;
      list-style-type: none;
      display: flex;
      flex-direction: row;
      .first-div {
        width: 40%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .last-div {
        width: 70%;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }
    }
    .role-li-info {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      background: #eee;
      span {
        margin-left: 10px;
      }
      :first-child {
        width: 40%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      :last-child {
        width: 60%;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }
    }
    .role-checkout {
      //   width: 18%;
      width: 40%;
      margin-left: 10px;
      margin-top: 5px;
    }
  }
  .role-submit {
    width: 100px;
    margin: 20px auto 0px auto;
  }
}
</style>

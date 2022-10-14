<template>
  <div class="hotNewsCon">
    <div class="hotNewsInner">
      <div class="editBtnArea">
        <div class="editAreaTitle">文章内容</div>
        <div>
          <div v-if="editStutus == false">
            <el-button type="primary" @click="editTrigger">修改</el-button>
          </div>
          <div v-else>
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="confirmEdit">完成</el-button>
          </div>
        </div>
      </div>
      <div class="textArea">
        <el-input :disabled="!editStutus" type="textarea" :rows="25" placeholder="请输入内容" v-model.trim="textarea"> </el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { articleEditFlow, articleFlow } from '@/api/information';
export default {
  name: 'laborHallCon',
  data() {
    return {
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      userName: '',
      editStutus: false,
      textarea: '',
    };
  },
  mounted() {
    this.destroy();
    this.fetchInfo();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    fetchInfo() {
      articleFlow({})
        .then((res) => {
          if (res && res.code === 0) {
            this.textarea = res.data.content;
          } else {
            this.$message.success(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelEdit() {
      this.editStutus = false;
    },
    saveAction() {
      if (this.textarea) {
        articleEditFlow({
          content: this.textarea,
        })
          .then((res) => {
            if (res && res.code === 0) {
              this.$message.success('修改成功');
              this.editStutus = false;
            } else {
              this.$message.success(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message.error('内容不能为空');
      }
    },
    confirmEdit() {
      this.saveAction();
    },
    editTrigger() {
      this.editStutus = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.hotNewsCon {
  padding: 10px;
  box-sizing: border-box;
  .hotNewsInner {
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
  }
  .editBtnArea {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    margin-bottom: 20px;
    .editAreaTitle {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .textArea {
  }
}
</style>

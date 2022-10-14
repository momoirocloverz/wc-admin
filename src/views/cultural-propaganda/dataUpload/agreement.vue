<template>
  <div class="">
    <div class="firstLine">
      <div class="titleText">模版信息</div>
    </div>
    <div id="editor" ref="editorElem" class="editerCon"></div>
    <div class="bottomArea">
      <el-button type="primary" @click="saveAction">保存</el-button>

    </div>
  </div>
</template>

<script>
import { beeProtocolInfo, beeProtocolEdit } from '@/api/bee';
import E from 'wangeditor';
export default {
  data() {
    return {
      editor: null,
      text: '',
      editorContent: '',
      currentId: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
    };
  },
  mounted() {
    this.initAction();
  },
  methods: {
    fetchData() {
      beeProtocolInfo({}).then((res) => {
        if (res && res.code === 0) {
          this.currentId = res.data.protocol.id;
          if (res.data.protocol.content) {
            this.text = res.data.protocol.content;
            this.editor.txt.html(this.text);
          } else {
            this.editor.txt.html(this.text);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initRich() {
      let that = this;
      this.editor = new E(document.getElementById('editor'));
      this.editor.config.height = 450;
      this.editor.config.uploadImgServer = '/web/public/upload';
      this.editor.config.uploadImgHeaders = {
        Authorization: sessionStorage.getItem('token'),
      };
      this.editor.config.uploadFileName = 'file';
      this.editor.config.uploadImgHooks = {
        customInsert: function (insertImgFn, result) {
          let url = result.data.url;
          insertImgFn(url);
        },
      };
      this.editor.config.onchange = function (newHtml) {
        that.editorContent = newHtml;
      };
      this.editor.create();
      this.editor.txt.html(this.text);
    },
    initAction() {
      this.initRich();
      this.fetchData();
    },
    saveAction() {
      if (!this.editorContent) {
        return this.$message.error('内容不能为空');
      }
      beeProtocolEdit({
        id: this.currentId,
        content: this.editorContent,
      }).then((res) => {
        if (res && res.code === 0) {
          this.$message.success('保存成功');
        } else {
          //   this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.firstLine {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
  .titleText {
    font-size: 20px;
  }
}
.bottomArea {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
</style>

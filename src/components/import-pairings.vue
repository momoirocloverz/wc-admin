<template>
  <div style="display: inline-block">
    <el-button @click="openModal" style="margin-right:15px;">{{ buttonText }}</el-button>

    <el-dialog
      :title="modalTitle"
      :visible.sync="visible"
      width="40%"
      center
    >
      <div class="modal-body">
        <div class="desc"><span class="label">样表下载：	</span>
          <a v-if="context===ACTION_CONTEXT.DOCTOR" class="file-link" download :href="exampleFile">贫困户签约医生信息.xlsx</a>
          <a v-if="context===ACTION_CONTEXT.GOVERNMENT_EMPLOYEE" class="file-link" download :href="exampleFile">低收入农户干部结对信息.xlsx</a>
        </div>
        <div class="desc"><span class="label">样表说明：	</span>
          <ol v-if="context===ACTION_CONTEXT.DOCTOR" class="requirement-list">
            <li>表名：sheet1</li>
            <li>字段：乡镇、姓名、身份证、签约医生姓名 、医生电话</li>
          </ol>
          <ol v-if="context===ACTION_CONTEXT.GOVERNMENT_EMPLOYEE" class="requirement-list">
            <li>表名：sheet1</li>
            <li>字段：乡镇、姓名、身份证、结对单位、结对干部、结对干部电话</li>
            <li>用Ctrl+End检查是否存在空白行，请删除空白行</li>
          </ol>
        </div>
        <el-upload
          drag
          :action="uploadAPIEndpoint"
          :headers="token"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-success="onSuccess"
          :on-error="onError"
          :file-list="fileList"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">拖拽文件到这里或<em>点击上传</em></div>
          <!--          <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>-->
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ACTION_CONTEXT } from '@/utils/const'
import store from '@/store'

export default {
  name: 'ImportPairings',
  props: {
    context: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      fileList: []
    }
  },
  computed: {
    ACTION_CONTEXT() {
      return ACTION_CONTEXT
    },
    token() {
      return { Authorization: sessionStorage.getItem('token') }
    },
    modalTitle() {
      let title = '批量导入农户签约医生信息'
      switch (this.context) {
        case ACTION_CONTEXT.GOVERNMENT_EMPLOYEE: title = '批量导入农户干部对接档案'; break
        case ACTION_CONTEXT.DOCTOR: title = '批量导入农户签约医生信息'; break
        default:
      }
      return title
    },
    buttonText() {
      let title = '批量导入信息'
      switch (this.context) {
        case ACTION_CONTEXT.GOVERNMENT_EMPLOYEE: title = '导入结对档案'; break
        case ACTION_CONTEXT.DOCTOR: title = '导入签约档案'; break
        default:
      }
      return title
    },
    uploadAPIEndpoint() {
      let apiEndpoint = '/'
      switch (this.context) {
        case ACTION_CONTEXT.GOVERNMENT_EMPLOYEE: apiEndpoint = '/web/user/import/jdgb'; break
        case ACTION_CONTEXT.DOCTOR: apiEndpoint = '/web/user/import/qyys'; break
        default:
      }
      return apiEndpoint
    },
    exampleFile() {
      let url = ''
      switch (this.context) {
        case ACTION_CONTEXT.GOVERNMENT_EMPLOYEE: url = '/低收入农户干部结对信息.xlsx'; break
        case ACTION_CONTEXT.DOCTOR: url = '/贫困户签约医生信息.xlsx'; break
        default:
      }
      return url
    }
  },
  watch: {
    visible(newV, oldV) {
      if (!newV) {
        this.fileList = []
      }
    }
  },
  methods: {
    openModal() {
      this.visible = true
    },
    onSuccess(e) {
      this.visible = false
      if (e.code) {
        this.onError(e)
      } else {
        this.$message({
          message: '上传成功!',
          type: 'success'
        })
      }
    },
    onError(e) {
      // 自带的e没有用信息..
      this.$message({
        message: `上传遇到错误: ${e.msg || '请检查控制台日志'}`,
        type: 'error'
      })
    }
  }
}
</script>

<style scoped>
.modal-body{
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
.desc{
  align-self: flex-start;
}
.label{
  font-weight: bold;
}
.file-link{
  color: #409EFF;
}
.file-link:hover{
  filter: brightness(1.5);
}
.requirement-list{
  margin-top: 0;
}
</style>

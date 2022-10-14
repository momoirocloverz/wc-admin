<template>
  <div class="landLeasing">
    <div class="innerCon">
      <div class="header-top">
        <div class="marginAddon marginBootomAddon">
          <el-input v-model="user_name" placeholder="发布人"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-input v-model="title" placeholder="标题"></el-input>
        </div>
        <div class="marginAddon marginBootomAddon">
          <el-select v-model="searchType" class="fixInput" placeholder="请输入发布状态">
            <el-option v-for="item in publishOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </div>

        <div class="datePickerCon marginAddon marginBootomAddon">
          <el-date-picker
            size="medium"
            v-model="timeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="发布日期"
            end-placeholder="发布日期"
            align="right"
          >
          </el-date-picker>
        </div>
        <div class="button_list marginBootomAddon">
          <el-button type="primary" @click="runSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="addBtnArea">
        <el-button
          type="primary"
          @click="
            addVisible = true
            editFlag = false
          "
          >发布信息</el-button
        >
      </div>
      <div class="tableCon">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="user_name" label="发布人" width="150" align="center"></el-table-column>
          <el-table-column label="发布类型" prop="release_name" width="150" align="center"></el-table-column>
          <el-table-column prop="title" label="标题" align="center"> </el-table-column>
          <el-table-column prop="content" label="发布内容" align="center"> </el-table-column>
          <el-table-column label="图片" prop="image_path" align="center">
            <template slot-scope="scope">
              <div class="image_box">
                <preview-image :src="scope.row.image_path ? scope.row.image_path[0] : ''" :src-list="scope.row.image_path ? scope.row.image_path : []" />
                <span>{{ '共' + (scope.row.image_path ? scope.row.image_path.length : 0) + '张' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格（元）" align="center"></el-table-column>
          <el-table-column prop="area" label="面积" width="150" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位 " align="center"></el-table-column>
          <el-table-column prop="address" label="所在地址" align="center">
            <template slot-scope="scope">
              <!-- scope.row.town_name  -->
              <div>
                {{ scope.row.address }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="created_at" label="发布时间" width="180" align="center"></el-table-column>
          <el-table-column label="下架时间" prop="updated_at" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="popEditItem(scope.row)">编辑</el-button>

                <el-button type="text" @click="popDeleteMainItem(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-footer">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
          class="pagination-info"
        ></el-pagination>
      </div>
    </div>
    <el-dialog class="medium_dialog" title="信息发布" width="800px" :before-close="handleCloseForNew" :visible.sync="addVisible">
      <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="发布类型" prop="type" class="flexFormItem" >
          <el-select v-model="newForm.type" class="fixInput" placeholder="请选择发布类型">
            <el-option v-for="item in publishWithoutAllOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写标题" prop="title" class="flexFormItem">
          <el-input v-model="newForm.title" maxlength="10" placeholder="标题少于10个字"></el-input>
        </el-form-item>
        <el-form-item label="填写内容" prop="content" class="flexFormItem">
          <el-input placeholder="内容至少10个字" type="textarea" :row="5" v-model="newForm.content"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="image" class="flexFormItem is-required">
          <el-upload
            :class="['avatar-uploader']"
            :action="action"
            :headers="headers"
            ref="upload"
            :file-list="fileList"
            list-type="picture-card"
            :show-file-list="true"
            :before-upload="beforeUpload"
            :on-success="successFile"
            :limit="5"
            :on-remove="handleRemoveFile"
            :on-exceed="handleExceed"
            accept="image/*"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">至少上传1张jpg/png/gif图片,且大小不超过50M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price" class="flexFormItem is-required">
          <el-radio-group v-model="radio">
            <div class="radioItem firstRadioItem">
              <el-radio label="1">单价</el-radio>
              <el-input-number v-model="newForm.price1" :precision="2" :step="1" :max="99999999" :controls="false" placeholder="输入价格" :disabled="radio == '2'"></el-input-number>
            </div>
            <div class="radioItem">
              <el-radio label="2">范围</el-radio>
              <el-input-number v-model="newForm.price2" :precision="2" :step="1" :max="99999999" :controls="false" placeholder="输入最低价格" :disabled="radio == '1'"></el-input-number>
              <div class="dashLine">-</div>
              <el-input-number v-model="newForm.price3" :precision="2" :step="1" :max="99999999" :controls="false" placeholder="输入最高价格" :disabled="radio == '1'"></el-input-number>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单位" prop="unit" class="flexFormItem" >
          <el-select v-model="newForm.unit" class="fixInput" placeholder="请选择单位">
            <el-option v-for="item in unitOpts" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面积（㎡）" prop="area" class="flexFormItem" >
          <el-input placeholder="请输入面积" v-model="newForm.area"></el-input>
        </el-form-item>
        <el-form-item label="详细地址 " prop="address" class="flexFormItem is-required">
          <div class="addressFlex">
            <div class="leftAddress">
              <el-select v-model="newForm.town" class="fixInput" placeholder="请选择地区" @change="townChange">
                <el-option v-for="item in addressOptions" :key="item.id" :label="item.town_name" :value="item.id"> </el-option>
              </el-select>
            </div>
            <div class="rightAddress">
              <el-input placeholder="请输入详细地址" v-model="newForm.address"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" class="flexFormItem is-required" >
          <el-input placeholder="请输入电话" maxlength="11" v-model="newForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetField('newForm')">取 消</el-button>
        <el-button type="primary" @click="confirmAddAction('newForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { propertyList, propertyInfo, propertyEdit, propertyDelete, propertyType, propertyAdd } from '@/api/information'
import previewImage from '@/components/previewImage/index'
import { TownInfo } from '@/api/common'
import moment from 'moment'
export default {
  components: {
    previewImage
  },
  name: 'landLeasing',
  data() {
    var validateImage = (rule, value, callback) => {
      if (!this.fileList.length) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      const phoneReg = /^1[3-9]\d{9}$/
      const result = phoneReg.test(this.newForm.mobile)
      if (!this.newForm.mobile) {
        callback(new Error('手机号不能为空'))
      } else {
        if (result) {
          callback()
        } else {
          callback(new Error('请填写正确的手机号'))
        }
      }
    }
    var validateAddress = (rule, value, callback) => {
      if (!this.newForm.town || !this.newForm.address) {
        callback('地址不能为空')
      } else {
        callback()
      }
    }
    var validatePrice = (rule, value, callback) => {
      if (this.radio == '1') {
        if (this.newForm.price1) {
          callback()
          this.newForm.price = this.newForm.price1
        } else {
          callback(new Error('请输入单价'))
        }
      } else {
        if (!this.newForm.price2 || !this.newForm.price3) {
          callback(new Error('请输入单价'))
        } else if (+this.newForm.price2 > +this.newForm.price3) {
          callback(new Error('最低价不能大于最高价'))
        } else {
          callback()
          this.newForm.price = `${this.newForm.price2}-${this.newForm.price3}`
        }
      }
    }
    return {
      action: '/web/public/upload',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      selectOpts: [],
      addressOptions: [],
      options: [],
      fileList: [],
      radio: '1',
      unitOpts: [
        { label: '平方米', value: '平方米' },
        { label: '公顷', value: '公顷' },
        { label: '亩', value: '亩' },
        { label: '平方厘米', value: '平方厘米' },
        { label: '平方公里', value: '平方公里' }
      ],
      addVisible: false,
      unknown1: '',
      content: '',
      title: '',
      user_name: '',
      newTypeName: '',
      typeLoading: false,
      ruleForm: {
        pass: '',
        cover: '',
        video: ''
      },
      newForm: {
        area: '',
        image: '',
        imageId: '',
        address: '',
        unit: '',
        price: '',
        price1: '',
        price2: '',
        price3: '',
        mobile: '',
        content: '',
        title: '',
        type: ''
      },
      newRules: {
        address: [{ validator: validateAddress, trigger: 'blur' }],
        area: [
          {
            required: true,
            message: '面积不能为空',
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: '单位不能为空',
            trigger: 'blur'
          }
        ],
        price: [{ validator: validatePrice, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        image: [{ validator: validateImage, trigger: 'blur' }],
        content: [
          {
            required: true,
            min: 10,
            max: 255,
            message: '不少于10个字',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            min: 1,
            max: 10,
            message: '不超过10个字',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择发布类型',
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      dynamicVideo: '',
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      userName: '',
      tableData: [],
      loading: false,
      publishOptions: [],
      publishWithoutAllOptions: [],
      publishType: '',
      publisher: '',
      timeRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchType: 0,
      editFlag: false
    }
  },
  mounted() {
    this.fetchTypeList()
    this.fetchList()
    this.destroy()
    this.fetchTown()
  },
  methods: {
    popEditItem(item) {
      this.addVisible = true
      this.editFlag = true
      let ids = item.image.split(',')
      this.fileList = item.image_path.map((ele, index) => {
        return {
          url: ele,
          response: {
            data: {
              id: ids[index],
              url: ele
            }
          }
        }
      })
      this.newForm.type = item.release_type
      this.newForm.title = item.title
      this.newForm.content = item.content
      this.newForm.price = item.price
      this.newForm.unit = item.unit
      this.newForm.area = item.area
      this.newForm.address = item.address
      this.newForm.town = item.town_id
      this.newForm.mobile = item.mobile
      this.newForm.id = item.id
      let checkPriceType = item.price.includes('-')
      if (checkPriceType) {
        this.radio = '2'
        let splitRes = item.price.split('-')
        this.newForm.price2 = splitRes[0]
        this.newForm.price3 = splitRes[1]
      } else {
        this.radio = '1'
        this.newForm.price1 = item.price
      }
    },
    townChange() {
      this.$refs.newForm.validateField('address')
    },
    fetchTown() {
      TownInfo().then((res) => {
        if (res && res.code === 0) {
          this.addressOptions = res.data
        }
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多上传5张图片')
    },
    handleRemoveFile(file, fileList) {
      //   console.log(file, fileList);
      this.fileList = fileList
    },
    //   上传成功
    successFile(res, file) {
      // console.log(res, file);
      this.fileList.push(file)
    },
    // 图片上传
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB')
        return false
      }
    },
    confirmAddAction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let track = this.publishOptions.find((ele) => {
            return ele.id == this.newForm.type
          })
          const imgIds = this.fileList
            .map((ele) => {
              return ele.response.data.id
            })
            .join(',')
          let data = {
            release_type: this.newForm.type,
            release_name: track.name,
            operator: this.$store.getters.name,
            title: this.newForm.title,
            content: this.newForm.content,
            image: imgIds,
            price: this.newForm.price,
            unit: this.newForm.unit,
            area: this.newForm.area,
            address: this.newForm.address,
            mobile: this.newForm.mobile,
            town_id: this.newForm.town
          }
          if (this.editFlag) {
            data.id = this.newForm.id
            propertyEdit(data).then((res) => {
              if (res && res.code === 0) {
                this.$message.success('编辑成功')
                this.addVisible = false
                this.newForm.price2 = ''
                this.newForm.price3 = ''
                this.newForm.price1 = ''
                this.radio = '1'
                this.fileList = []
                this.$refs['newForm'].resetFields()
                this.currentPage = 1
                this.fetchList()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            propertyAdd(data).then((res) => {
              if (res && res.code === 0) {
                this.$message.success('添加成功')
                this.addVisible = false
                this.newForm.price2 = ''
                this.newForm.price3 = ''
                this.newForm.price1 = ''
                this.radio = '1'
                this.fileList = []
                this.$refs['newForm'].resetFields()
                this.currentPage = 1
                this.fetchList()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    },
    resetField(formName) {
      this.$refs[formName].resetFields()
      this.newForm.price2 = ''
      this.newForm.price3 = ''
      this.newForm.price1 = ''
      this.radio = '1'
      this.fileList = []
      this.addVisible = false
    },
    handleCloseForNew(done) {
      this.$refs['newForm'].resetFields()
      this.newForm.price2 = ''
      this.newForm.price3 = ''
      this.newForm.price1 = ''
      this.radio = '1'
      this.fileList = []
      this.newForm.type = ''
      this.newForm.title = ''
      this.newForm.content = ''
      this.newForm.unit = ''
      this.newForm.area = ''
      this.newForm.address = ''
      this.newForm.mobile = ''
      this.newForm.town = ''
      done()
    },
    destroy() {
      sessionStorage.removeItem('isRefresh')
      sessionStorage.removeItem('childRouterQuery')
    },
    popDeleteMainItem(row) {
      this.$alert(`确定删除该条目`, '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action == 'confirm') {
            propertyDelete({
              property_id: row.id
            })
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('删除成功')
                  this.currentPage = 1
                  this.fetchList()
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch((err) => {
                console.log(err)
              })
          }
        }
      })
    },
    runSearch() {
      this.currentPage = 1
      this.fetchList()
    },
    resetSearch() {
      this.searchType = 0
      this.title = ''
      this.user_name = ''
      this.timeRange = []
      this.currentPage = 1
      this.fetchList()
    },
    fetchTypeList() {
      propertyType({})
        .then((res) => {
          if (res && res.code === 0) {
            this.publishOptions = res.data
            this.publishWithoutAllOptions = res.data.filter((ele) => {
              return ele.id
            })
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    fetchList() {
      propertyList({
        type: this.searchType,
        content: this.content,
        title: this.title,
        user_name: this.user_name,
        start_time: this.timeRange ? this.timeRange[0] : '',
        end_time: this.timeRange ? this.timeRange[1] : '',
        page: this.currentPage,
        page_size: this.pageSize,
        audit_status: 2,
        is_open: 0
      }).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.data.data
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.fetchList()
    }
  }
}
</script>
<style scoped lang="scss">
.addBtnArea {
  margin-bottom: 20px;
}
.addressFlex {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.leftAddress {
  width: 50%;
}
.rightAddress {
  width: 50%;
}
.fixInput {
  width: 100%;
}
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.flexFormItem {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  width: 600px;
}
.mask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  bottom: 0;
  .videoCon {
    border-radius: 10px;
    background-color: #fff;
    width: 800px;
    height: 610px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    box-sizing: border-box;
    video {
      width: 400px;
    }
    .shutCon {
      height: 50px;
      text-align: right;
      padding-right: 40px;
      padding-top: 20px;
    }
    .shutIcon {
      font-size: 30px;
    }
  }
}

.pagination-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.fixWidthVideo {
  width: 200px;
}
.landLeasing {
  padding: 10px;
  .innerCon {
    width: 98%;
    margin: 0 auto;
    margin-top: 15px;
    background-color: #fff;
    padding: 30px;
    box-sizing: border-box;
  }
  .header-top {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .topLeft {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
}
.button_list {
}
.marginAddon {
  margin-right: 20px;
}
.fixInput {
  width: 100%;
}
.marginBootomAddon {
  margin-bottom: 20px;
}
.tableCon {
}
.demo-ruleForm {
  //   width: 400px;
}
</style>
<style lang="scss">
.landLeasing {
  .radioItem {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .firstRadioItem {
    margin-bottom: 10px;
  }
  .dashLine {
    width: 20px;
    height: 2px;
    margin-left: 4px;
    margin-right: 4px;
    background-color: #dcdfe6;
  }
  .flexFormItem {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    width: 650px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .datePickerCon {
    .el-date-editor {
      width: 260px;
    }
  }
  .demo-ruleForm {
    .el-form-item__content {
      width: 70%;
      margin-left: 0 !important;
    }
  }
}
</style>

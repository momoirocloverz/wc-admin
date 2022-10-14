<template>
  <div class="base_warp agricultural_products">
    <div class="search_content">
      <el-form ref="form" :model="formData">
        <!-- <el-col :span="6">
          <el-form-item label="农产品ID" prop="id">
            <el-input v-model="formData.id" placeholder="" />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="发布人" prop="operator">
            <el-input v-model="formData.operator" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标题" prop="issue_title">
            <el-input v-model="formData.issue_title" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审核类型" prop="issue_category">
            <el-select v-model="formData.issue_category" clearable placeholder="全部">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发布分类">
            <el-select v-model="formData.crop_category" clearable placeholder="全部">
              <el-option v-for="item in selectOpts" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="发布内容" prop="issue_content">
            <el-input v-model="formData.issue_content" placeholder="" />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="发布时间" prop="date">
            <el-date-picker v-model="formData.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <div class="button_list">
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="reset('form')">重置</el-button>
          </div>
        </el-col>
      </el-form>
    </div>
    <div class="addBtnArea">
      <el-button  type="primary" @click="popAddType">新增分类</el-button>
      <el-button type="primary" @click="popNew">市场发布</el-button>
    </div>
    <div class="table_box">
      <el-table v-loading="loading" :data="tableData">
        <el-table-column label="农产品ID" prop="id" align="center" />
        <el-table-column label="发布人" prop="operator" align="center" />
        <el-table-column label="发布类型" prop="issue_category" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.issue_category === 1 ? "供应" : "求购" }}</span> -->
            <span>{{ scope.row.category_data }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.crop_category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="issue_title" align="center" />
        <el-table-column label="发布内容" prop="issue_content" align="center" />
        <el-table-column label="图片" prop="image_path" align="center">
          <template slot-scope="scope">
            <div class="image_box">
              <!--              <el-image-->
              <!--                :src="scope.row.image_path ? scope.row.image_path[0] : ''"-->
              <!--                fit="scale-down"-->
              <!--                lazy-->
              <!--                :preview-src-list="scope.row.image_path ? scope.row.image_path : []"-->
              <!--              />-->
              <preview-image :src="scope.row.image_path ? scope.row.image_path[0] : ''" :src-list="scope.row.image_path ? scope.row.image_path : []" />
              <span>{{ '共' + (scope.row.image_path ? scope.row.image_path.length : 0) + '张' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价（元）" prop="price" align="center" />
        <el-table-column label="单位" prop="unit" align="center" />
        <el-table-column label="所在地址" prop="address" align="center" />
        <el-table-column label="联系电话" prop="mobile" align="center" />
        <el-table-column label="发布时间" prop="created_at" width="180" align="center" />
        <el-table-column label="下架时间" prop="updated_at" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="showEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="medium_dialog" title="农产品信息详情" :visible.sync="dialogVisible">
      <detail :detail-data="detailData" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" :loading="idDeleting" @click="handleDelete(detailData.id)">删除</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增分类" :visible.sync="addTypeVisible" width="50%">
      <div>
        <el-button @click="popTypeDialog" type="primary">新增类型</el-button>
      </div>
      <el-table v-loading="typeLoading" :data="typeTableData" height="400">
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="分类名称" width="150" align="center"></el-table-column>
        <el-table-column prop="count" label="分类数量" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" @click="popTypeDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-footer">
        <el-pagination
          @current-change="handleSecCurrentChange"
          :current-page.sync="currentSecPage"
          :page-size="pageSecSize"
          layout="prev, pager, next, jumper"
          :total="secTotal"
          class="pagination-info"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog title="类型名称" :visible.sync="typeNameVisible" width="30%">
      <div>
        <el-input placeholder="最多20个字" maxlength="20" v-model.trim="newTypeName"> </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddType">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog key="12" title="市场发布" :visible.sync="newFormVisible" width="800px" :before-close="handleCloseForNew" destroy-on-close>
      <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="发布类型" prop="type" class="flexFormItem" required>
          <el-select v-model="newForm.type" class="fixInput" placeholder="请选择发布类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布分类" prop="crop_category" class="flexFormItem" required>
          <el-select v-model="newForm.crop_category" class="fixInput" placeholder="请选择发布分类">
            <el-option v-for="item in selectOpts" :key="item.id" :label="item.name" :value="item.id"> </el-option>
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
        <el-form-item label="单位" prop="unit" class="flexFormItem" required>
          <el-select v-model="newForm.unit" class="fixInput" placeholder="请选择单位">
            <el-option v-for="item in unitOpts" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址 " prop="address" class="flexFormItem" required>
          <el-input placeholder="请输入详细地址" type="textarea" :row="5" v-model="newForm.address"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" class="flexFormItem" required>
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
import detail from './modules/detail'
import { CheckDetail, CheckList, DeleteMessage, AddMessage, EditMessage, issue_messageTypeList, issue_messageTypeAdd, issue_messageTypeDelete } from '@/api/information'
import previewImage from '@/components/previewImage/index'
export default {
  components: {
    detail,
    previewImage
  },
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
      fileList: [],
      activeName: '1',
      tabArray: [
        { label: '通过', name: '1' },
        { label: '不通过', name: '2' },
        { label: '待审批', name: '3' }
      ],
      unitOpts: [
        { label: '斤', value: '斤' },
        { label: '公斤', value: '公斤' },
        { label: '吨', value: '吨' },
        { label: '袋', value: '袋' },
        { label: '只', value: '只' },
        { label: '棵', value: '棵' },
        { label: '亩', value: '亩' },
        { label: '天', value: '天' },
        { label: '小时', value: '小时' },
        { label: '台', value: '台' },
        { label: '箱', value: '箱' },
        { label: '间', value: '间' }
      ],
      newFormVisible: false,
      addTypeVisible: false,
      currentSecPage: 1,
      pageSecSize: 10,
      radio: '1',
      secTotal: 0,
      newTypeName: '',
      typeLoading: false,
      typeTableData: [],
      typeNameVisible: false,
      formData: {
        issue_type: 1, // 农产品
        start_at: '',
        end_at: '',
        crop_category: '',
        issue_category: '',
        issue_content: '',
        id: undefined,
        date: [],
        issue_title: ''
      },
      categoryMap: {
        1: '农产品',
        2: '农用物资',
        3: '其他'
      },
      idDeleting: false,
      dialogVisible: false,
      detailData: {},
      selectOpts: [],
      options: [
        { label: '供应', value: 1 },
        { label: '求购', value: 2 }
      ],
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      newForm: {
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
        type: '',
        crop_category: ''
      },
      editFlag: false,
      newRules: {
        address: [
          {
            required: true,
            message: '地址不能为空',
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
        ],
        crop_category: [
          {
            required: true,
            message: '请选择发布分类',
            trigger: 'blur'
          }
        ]
      },
      initFunc: CheckList
    }
  },
  watch: {
    dialogVisible(newVal) {
      if (!newVal) this.detailData = {}
    }
  },
  mounted() {
    this.destroy()
    this.getList()
    this.fetchTypeListForHome()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab)
      console.log(this.activeName)
    },
    async getList() {
      if (this.initFunc) {
        const params = {
          page: this.currentPage,
          page_size: this.pageSize,
          ...this.formData,
          audit_status: 2,
          is_open: 0
        }
        this.loading = true
        try {
          const { code, data } = await this.initFunc(params)
          if (code === 0) {
            this.tableData = data.data
            this.total = data.total
          }
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      }
    },
    async reset(formName) {
      this.formData.crop_category = ''
      this.formData.issue_category = ''
      this.$refs[formName] && this.$refs[formName].resetFields()
      this.changeDate && (await this.changeDate())
      this.getList()
    },
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(),
        'm+': (date.getMonth() + 1).toString(),
        'd+': date.getDate().toString(),
        'H+': date.getHours().toString(),
        'M+': date.getMinutes().toString(),
        'S+': date.getSeconds().toString()
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
        }
      }
      return fmt
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.getList()
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
      //   console.log(res, file);
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
          const imgIds = this.fileList
            .map((ele) => {
              return ele.response.data.id
            })
            .join(',')
          let data = {
            issue_category: this.newForm.type,
            issue_type: '1',
            crop_category: this.newForm.crop_category,
            issue_title: this.newForm.title,
            issue_content: this.newForm.content,
            image: imgIds,
            price: this.newForm.price,
            unit: this.newForm.unit,
            address: this.newForm.address,
            mobile: this.newForm.mobile,
            operator: this.$store.getters.name
          }
          if (this.editFlag) {
            data.id = String(this.newForm.id)
            EditMessage(data)
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('编辑成功')
                  this.newForm.price1 = ''
                  this.newForm.price2 = ''
                  this.newForm.price3 = ''
                  this.radio = '1'
                  this.fileList = []
                  this.currentPage = 1
                  this.getList()
                  this.$refs[formName].resetFields()
                  this.newFormVisible = false
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            AddMessage(data)
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('添加成功')
                  this.newForm.price1 = ''
                  this.newForm.price2 = ''
                  this.newForm.price3 = ''
                  this.radio = '1'
                  this.fileList = []
                  this.currentPage = 1
                  this.getList()
                  this.$refs[formName].resetFields()
                  this.newFormVisible = false
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
    resetField(formName) {
      this.$refs[formName].resetFields()
      this.newFormVisible = false
      this.newForm.price1 = ''
      this.newForm.price2 = ''
      this.newForm.price3 = ''
      this.radio = '1'
      this.fileList = []
    },
    resetAction() {
      this.newForm = {
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
        type: '',
        crop_category: ''
      }
      this.radio = '1'
      this.fileList = []
    },
    popNew() {
      this.newFormVisible = true
      this.editFlag = false
      setTimeout(() => {
        this.resetAction()
        this.$refs['newForm'].resetFields()
      }, 200)
    },
    showEdit(item) {
      this.resetAction()
      this.editFlag = true
      this.newFormVisible = true
      setTimeout(() => {
        this.$refs['newForm'].resetFields()
      }, 200)
      this.newForm.type = item.issue_category
      this.newForm.crop_category = +item.crop_category
      this.newForm.title = item.issue_title
      this.newForm.content = item.issue_content
      this.newForm.mobile = item.mobile
      this.newForm.address = item.address
      this.newForm.unit = item.unit
      this.newForm.id = item.id
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
    handleCloseForNew(done) {
      this.$refs['newForm'].resetFields()
      done()
    },
    destroy() {
      sessionStorage.removeItem('isRefresh')
      sessionStorage.removeItem('childRouterQuery')
    },
    popTypeDialog() {
      this.typeNameVisible = true
    },
    popAddType() {
      this.addTypeVisible = true
      this.currentSecPage = 1
      this.fetchTypeList()
    },
    confirmAddType() {
      if (this.newTypeName) {
        issue_messageTypeAdd({
          name: this.newTypeName
        })
          .then((res) => {
            if (res && res.code === 0) {
              this.typeNameVisible = false
              this.newTypeName = ''
              this.$message.success('新增成功')
              this.currentSecPage = 1
              this.fetchTypeList()
              this.fetchTypeListForHome()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        this.$message.error('请输入名称')
      }
    },
    handleSecCurrentChange(e) {
      this.currentSecPage = e
      this.fetchTypeList()
    },
    popTypeDelete(row) {
      this.$alert(`该类型下存在${row.count}个信息，删除该类型将一起删除，确定执行该操作`, '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action == 'confirm') {
            issue_messageTypeDelete({
              id: row.id
            })
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('删除成功')
                  this.typeNameVisible = false
                  this.currentSecPage = 1
                  this.newTypeName = ''
                  this.fetchTypeListForHome()
                  this.fetchTypeList()
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            this.typeNameVisible = false
          }
        }
      })
    },
    fetchTypeListForHome() {
      issue_messageTypeList({
        page_size: 10000,
        page: 1
      })
        .then((res) => {
          if (res && res.code === 0) {
            this.selectOpts = res.data.data
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    fetchTypeList() {
      issue_messageTypeList({
        page_size: this.pageSecSize,
        page: this.currentSecPage
      }).then((res) => {
        if (res && res.code === 0) {
          this.secTotal = res.data.total
          this.typeTableData = res.data.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确定删除？')
        .then((_) => {
          this.deleteInfo(id)
        })
        .catch((_) => {})
    },
    showDetail(id) {
      this.dialogVisible = true
      const params = {
        id: String(id),
        issue_type: 1
      }
      CheckDetail(params).then(({ code, data }) => {
        if (code === 0) {
          this.detailData = data
        } else {
          this.dialogVisible = false
        }
      })
    },
    deleteInfo(id) {
      this.idDeleting = true
      DeleteMessage({ id: String(id) })
        .then(({ code }) => {
          if (code === 0) {
            this.$message({ type: 'success', message: '删除成功' })
            this.dialogVisible = false
            this.getList()
          }
          this.idDeleting = false
        })
        .catch((_) => {
          this.idDeleting = false
        })
    },
    changeDate() {
      this.formData.start_at = this.formData.date[0] ? this.dateFormat('YYYY-mm-dd HH:MM:SS', this.formData.date[0]) : ''
      this.formData.end_at = this.formData.date[1] ? this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date(this.formData.date[1].getTime() + 86400000 - 1)) : ''
    }
  }
}
</script>

<style scoped lang="scss">
.fixInput {
  width: 100%;
}
.agricultural_products {
  //   padding: 30px;
  .addBtnArea {
    margin-bottom: 20px;
    padding-left: 30px;
  }
}
</style>
<style lang="scss">
.agricultural_products {
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
  .demo-ruleForm {
    .el-form-item__content {
      width: 70%;
      margin-left: 0 !important;
    }
  }
}
</style>

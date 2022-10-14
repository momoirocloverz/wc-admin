export default {
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      option: this.$store.getters.option.length !== 0
        ? this.$store.getters.option
        : JSON.parse(sessionStorage.getItem('option'))
          ? JSON.parse(sessionStorage.getItem('option'))
          : []

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      if (this.initFunc) {
        const params = {
          page: this.currentPage,
          page_size: this.pageSize,
          ...this.formData
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
      this.$refs[formName] && this.$refs[formName].resetFields()
      this.changeDate && await this.changeDate()
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
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
      }
      return fmt
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.getList()
    }
  }
}

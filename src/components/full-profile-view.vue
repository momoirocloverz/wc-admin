<template>
  <el-dialog
    :title="modalTitle"
    :visible="visible"
    center
    width="90%"
    @close="onClose"
  >
    <div class="look-user">
      <div class="look-header">
        <ul class="look-header-left">
          <li>
            <span class="look-header-title">人员类型：</span>
            <em>{{ userInfo.lb_name }}</em>
          </li>
          <li>
            <span class="look-header-title">户编号：</span>
            <em>{{ userInfo.HBH }}</em>
          </li>
          <li>
            <span class="look-header-title">姓名：</span>
            <em>{{ userInfo.TName }}</em>
          </li>
          <li>
            <span class="look-header-title">身份证号：</span>
            <em>{{ userInfo.Card }}</em>
          </li>
          <li>
            <span class="look-header-title">片区：</span>
            <em>{{ userInfo.town_name }}</em>
          </li>
          <li>
            <span class="look-header-title">家庭地址：</span>
            <em>{{ userInfo.Address }}</em>
          </li>
          <li>
            <span class="look-header-title">低保编号：</span>
            <em>{{ userInfo.DBBH }}</em>
          </li>
          <li>
            <span class="look-header-title">残疾证号：</span>
            <em>{{ userInfo.CJBH }}</em>
          </li>
          <li>
            <span class="look-header-title">结对干部：</span>
            <em>{{ userInfo.JDGB }}</em>
          </li>
          <li>
            <span class="look-header-title">签约医生：</span>
            <em>{{ userInfo.QYYS }}</em>
          </li>
          <li>
            <span class="look-header-title">是否党员：</span>
            <em>{{ userInfo.IsDY?'是':'否' }}</em>
          </li>
          <!-- <li>
              <span class="look-header-title">注销原因：</span>
              <em></em>
            </li> -->
        </ul>
        <ul class="look-header-left">
          <li>
            <span class="look-header-title">与户主关系：</span>
            <em>{{ userInfo.GX }}</em>
          </li>
          <li>
            <span class="look-header-title">人编号：</span>
            <em>{{ userInfo.RBH }}</em>
          </li>
          <li>
            <span class="look-header-title">性别：</span>
            <em>{{ userInfo.SEX }}</em>
          </li>
          <li>
            <span class="look-header-title">联系方式：</span>
            <em>{{ userInfo.Tel }}</em>
          </li>
          <li>
            <span class="look-header-title">行政村：</span>
            <em>{{ userInfo.village_name }}</em>
          </li>
          <li>
            <span class="look-header-title">保障人数：</span>
            <em>{{ userInfo.BZRS }}</em>
          </li>
          <li>
            <span class="look-header-title">救助证编号：</span>
            <em>{{ userInfo.JZBH }}</em>
          </li>
          <li>
            <span class="look-header-title">结对单位：</span>
            <em>{{ userInfo.JDDW }}</em>
          </li>
          <li>
            <span class="look-header-title">干部联系方式：</span>
            <em>{{ userInfo.JDGBtel }}</em>
          </li>
          <li>
            <span class="look-header-title">医生联系方式：</span>
            <em>{{ userInfo.QYYSTel }}</em>
          </li>
          <li>
            <span class="look-header-title">状态：</span>
            <em>{{ userInfo.ZT==1?'未脱贫':userInfo.ZT==2?'已脱贫':'注销' }}</em>
          </li>
          <!-- <li>
              <span class="look-header-title">注销时间：</span>
              <em></em>
            </li> -->
        </ul>
        <div class="look-header-pic">
          <img
            :src="userInfo.image"
          >
        </div>
      </div>
      <div class="look-content">
        <!-- 家庭成员 -->
        <p class="look-weight">家庭成员</p>
        <el-table :data="familyTable">
          <el-table-column
            prop="no"
            label="序号"
            width="70"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="GX"
            label="关系"
            align="center"
          />
          <el-table-column
            prop="TName"
            label="姓名"
            align="center"
          />
          <el-table-column
            prop="Card"
            label="身份证号"
            align="center"
          />
          <el-table-column
            prop="ZT"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.ZT==1?'未脱贫':scope.row.ZT==2?'已脱贫':'注销' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="参加时间"
            align="center"
          />
          <el-table-column
            prop="cancelTime"
            label="注销时间"
            align="center"
          />
        </el-table>
        <!-- 致病原因 -->
        <p class="look-weight">致贫原因</p>
        <p>{{ userInfo.ZPYY }}</p>
        <!-- 帮扶措施 -->
        <p class="look-weight">帮扶措施</p>
        <p>{{ userInfo.BFCS }}</p>
        <!-- 备注 -->
        <p class="look-weight">备注</p>
        <p>{{ userInfo.Content }}</p>
        <!-- 干部结对 -->
        <div class="group-team">
          <span class="group-span">干部结对</span>
          <span class="group-date">日期</span>
          <el-date-picker
            v-model="groupYear"
            type="year"
            value-format="yyyy"
            placeholder="选择干部结对年份"
            class="group-year"
            @change="changeGroupTime"
          />
          <span>共计随访次数：{{ pairingTable.visit_count }}</span>
        </div>
        <el-table :data="pairingTable.list?pairingTable.list.data:[]">
          <el-table-column
            prop="visit_at"
            label="随访日期"
            align="center"
          />
          <el-table-column
            prop="visit_name"
            label="随访姓名"
            align="center"
          />
          <el-table-column label="随访内容" align="center">
            <template slot-scope="scope">
              <div class="content-scope" v-if="scope.row.image">
                  <span>{{ scope.row.content }}</span>
                  <img :src="scope.row.image" />
                </div>
                <div class="content-scope" v-html="scope.row.content" v-else></div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="groupTotal>10"
          :current-page.sync="groupPage"
          :page-size="groupPageSize"
          layout="prev, pager, next, jumper"
          :total="groupTotal"
          class="pagination-info"
          @current-change="handleCurrentChangeGroup"
        />
        <!-- 医生结对 -->
        <div class="group-team">
          <span class="group-span">医生结对</span>
          <span class="group-date">日期</span>
          <el-date-picker
            v-model="doctorYear"
            type="year"
            value-format="yyyy"
            placeholder="选择医生结对年份"
            class="group-year"
            @change="changeDoctorYear"
          />
          <span>共计随访次数：{{ doctorTable.visit_count }}</span>
        </div>
        <el-table :data="doctorTable.list?doctorTable.list.data:[]">
          <el-table-column
            prop="visit_at"
            label="随访日期"
            align="center"
          />
          <el-table-column
            prop="visit_name"
            label="随访姓名"
            align="center"
          />
          <el-table-column label="随访内容" align="center">
            <template slot-scope="scope">
              <div class="content-scope" v-if="scope.row.image">
                  <span>{{ scope.row.content }}</span>
                  <img :src="scope.row.image" />
                </div>
                <div class="content-scope" v-html="scope.row.content" v-else></div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="doctorTotal>10"
          :current-page.sync="doctorPage"
          :page-size="groupPageSize"
          layout="prev, pager, next, jumper"
          :total="doctorTotal"
          class="pagination-info"
          @current-change="handleCurrentChangeDoctor"
        />
        <!-- 就医详情 -->
        <div class="group-team">
          <span class="group-span">就医详情</span>
          <span class="group-date">日期</span>
          <el-date-picker
            v-model="hospitalYear"
            type="year"
            value-format="yyyy"
            placeholder="选择就医详情的年份"
            class="group-year"
            @change="changeHospital"
          />
        </div>
        <el-table :data="seeDoctorTable">
          <el-table-column
            prop="JZRQ"
            label="就诊日期"
            align="center"
          />
          <el-table-column
            prop="XM"
            label="就医姓名"
            align="center"
          />
          <el-table-column
            prop="SFZH"
            label="身份证号"
            align="center"
          />
          <el-table-column
            prop="mobile"
            label="电话号"
            align="center"
          />
          <el-table-column
            prop="JZKH"
            label="就诊卡号"
            align="center"
          />
          <el-table-column
            prop="ZD"
            label="就诊诊断"
            align="center"
          />
          <el-table-column
            prop="KSDM"
            label="科室代码"
            align="center"
          />
          <el-table-column
            prop="KSMC"
            label="科室名称"
            align="center"
          />
          <el-table-column
            prop="FYLB"
            label="费用类别"
            align="center"
          />
          <el-table-column
            prop="FYXZ"
            label="费用性质"
            align="center"
          />
          <el-table-column
            prop="FYZJE"
            label="就诊费用总金额"
            align="center"
            width="120"
          />
          <el-table-column
            prop="ZFJE"
            label="自付金额"
            align="center"
          />
          <el-table-column
            prop="BXJE"
            label="报销金额"
            align="center"
          />
        </el-table>
        <el-pagination
          v-show="hospitalTotal>10"
          :current-page.sync="hospitalPage"
          :page-size="groupPageSize"
          layout="prev, pager, next, jumper"
          :total="hospitalTotal"
          class="pagination-info"
          @current-change="handleCurrentChangeHospital"
        />
        <div class="group-close">
          <el-button
            type="primary"
            @click="onClose"
          >关闭</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getIndividualProfile } from '@/api/pairings'
import { GetBaseInfo, GetDoctorDetailInfo, GetDoctorInfo, GetGBJDInfo } from '@/api/household'
import { TownInfo, VillageInfo } from '@/api/common'

export default {
  name: 'FullProfileView',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    uid: {
      type: [String, Number],
      required: true
    },
    modalTitle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      profileData: {},
      pairingTable: [],
      doctorTable: [],
      seeDoctorTable: [],
      sendTable: [
        {
          no: 1,
          name: '吴晋如',
          ship: '户主',
          time: '2021年3月',
          money: '724',
          person: 1,
          intro: '哈哈哈'
        }
      ],
      sendList: [
        { name: '民政', choose: false },
        { name: '低保补助', choose: false },
        { name: '临时救助', choose: false }
      ],
      userInfo: {},
      familyTable: [
        {
          no: 1,
          relationship: '户主',
          name: '吴晋如',
          idCard: '42356745236467423',
          status: '正享受低保',
          joinTime: '2020-12-21',
          cancelTime: '2021-1-12'
        }
      ],
      sendMoneyYear: '',
      hospitalYear: '',
      doctorYear: '',
      groupYear: '',
      groupTotal: 0,
      lookTitle: '',
      dialogTitle: '新增农户档案',
      dialogVisible: false,
      userTypeValue: '',
      listTypeValue: '',
      townTypeValue: '',
      villageTypeValue: '',
      doctorPage: 1,
      hospitalPage: 1,
      groupPage: 1,
      groupPageSize: 10,
      total: 0,
      doctorTotal: 0,
      hospitalTotal: 0,
    }
  },
  watch: {
    uid() {
      this.loadData()
    }
  },
  methods: {
    async loadProfile() {
      try {
        const sourceData = (await getIndividualProfile(this.uid)).data
        if (!sourceData) {
          throw new Error('用户不存在')
        }
      } catch (e) {
        this.profileData = {}
        this.$message({
          message: `读取个人信息数据失败: ${e.message}`,
          type: 'error'
        })
      }
    },
    // 获取就医详情列表
    getDoctorDetailInfo() {
      const data = {
        page: this.hospitalPage,
        Card: this.uid,
        page_size: this.pageSize,
        year: this.hospitalYear ? this.hospitalYear : (new Date()).getFullYear()
      }
      GetDoctorDetailInfo(data).then(res => {
        if (res.code == 0) {
          this.hospitalTotal = res.data.total
          this.seeDoctorTable = res.data.data
        }
      })
    },
    // 获取列表信息
    getDoctorListInfo() {
      const data = {
        Card: this.uid,
        year: this.doctorYear ? this.doctorYear : (new Date()).getFullYear(),
        page: this.doctorPage,
        page_size: this.pageSize
      }
      GetDoctorInfo(data).then(res => {
        if (res.code === 0) {
          this.doctorTable = res.data
          this.doctorTotal = res.data.list.total
        }
      })
    },
    // 获取用户基础信息
    getUserBasicInfo() {
      const data = {
        Card: this.uid
      }
      GetBaseInfo(data).then(res => {
        if (res.code === 0) {
          this.lookTitle = res.data.TName + '用户信息'
          this.userInfo = res.data
          this.familyTable = res.data.family_list
        }
      })
    },
    // 获取干部结对列表
    getGbjdListInfo() {
      const data = {
        Card: this.uid,
        year: this.groupYear ? this.groupYear : (new Date()).getFullYear(),
        page: this.groupPage,
        page_size: this.groupPageSize
      }
      GetGBJDInfo(data).then(res => {
        if (res.code == 0) {
          this.pairingTable = res.data
          this.groupTotal = res.data.list.total
        }
      })
    },
    loadData() {
      // 获取用户信息
      this.getUserBasicInfo()
      this.getGbjdListInfo()
      this.getDoctorListInfo()
      this.getDoctorDetailInfo()
    },
    // ============================================
    changeHospital(e) {
      this.hospitalPage = 1
      this.hospitalYear = e
      this.getDoctorDetailInfo()
    },
    handleCurrentChangeHospital(e) {
      this.hospitalPage = e
      this.getDoctorDetailInfo()
    },
    // 选择结对医生时间
    changeDoctorYear(e) {
      this.doctorPage = 1
      this.doctorYear = e
      this.getDoctorListInfo()
    },
    // 选择医生结对
    handleCurrentChangeDoctor(e) {
      this.doctorPage = e
      this.getDoctorListInfo()
    },
    // 选择结对干部年份
    changeGroupTime(e) {
      this.groupPage = 1
      this.groupYear = e
      this.getGbjdListInfo()
    },
    // 搜索按钮点击
    handleSearch() {
      this.currentPage = 1
      this.getListInfo()
    },
    changFormTown(e) {
      this.formData.village = ''
      this.getVillageList(e)
    },
    // 改变搜索中的乡镇
    changeTownType(e) {
      this.villageTypeValue = ''
      this.getVillageList(e)
    },
    // 获取乡村信息
    getVillageList(e) {
      const data = {
        town_id: e
      }
      VillageInfo(data).then((res) => {
        this.villageType = res.data
      })
    },
    //  获取城镇信息
    getTownList() {
      TownInfo().then((res) => {
        this.townType = res.data
      })
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.getListInfo()
    },
    handleCurrentChangeGroup(e) {
      this.groupPage = e
      this.getGbjdListInfo()
    },
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.look-user {
  width: 100%;
  display: flex;
  flex-direction: column;
  .look-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    .look-header-left {
      width: 40%;
      height: 360px;
      display: flex;
      flex-direction: column;
      li {
        width: 100%;
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        em {
          font-style: normal;
          margin-left: 10px;
        }
      }
      .look-header-title {
        width: 120px;
        text-align: right;
      }
    }
    .look-header-pic {
      width: 20%;
      height: 360px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      img {
        width: 150px;
        height: 200px;
      }
    }
  }
  .look-weight {
    font-weight: bold;
    font-size: 16px;
  }
  p {
    margin: 10px 0px;
  }
  .group-team {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    .group-span {
      font-weight: bold;
      font-size: 16px;
    }
    .group-date {
      margin-left: 10px;
    }
    .group-year {
      margin: 0px 10px;
    }
  }
}
.group-team-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  .group-info-left {
    width: 150px;
    display: flex;
    flex-direction: column;
    li {
      height: 30px;
      margin-bottom: 5px;
      border: #eee solid 1px;
      list-style: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .group-active {
      background: #409eff;
      color: #fff;
      border: #409eff solid 1px;
    }
  }
}
.group-infomation {
  width: 88%;
  margin-left: 2%;
  display: flex;
  flex-direction: column;
}
.group-total {
  height: 50px;
  margin-left: 2%;
  display: flex;
  flex-direction: row;
  align-items: center;
  .group-total-span {
    margin-left: 43.5%;
    font-weight: bold;
  }
  .group-total-money {
    font-size: 16px;
    font-style: normal;
    margin-left: 13%;
  }
}
.group-close {
  width: 180px;
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.look-content {
  width: 88%;
  display: flex;
  flex-direction: column;
  margin: 0px auto;
}
.content-scope {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  img {
    height: 80px;
    margin: 0px 5px;
  }
}
.pagination-info {
  width: 98%;
  margin: 0px 2% 20px 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>

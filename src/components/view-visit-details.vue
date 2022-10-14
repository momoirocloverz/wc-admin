<template>
  <div>
    <el-button type="text" @click="openModal">查看</el-button>

    <el-dialog
      :title="`${context}随访记录 - ${name}`"
      :visible.sync="visible"
      width="1200px"
      center
    >
      <div v-if="visible" class="modal-body">
        <article class="profile-section">
          <Profile :data="profileData" />
        </article>
        <article class="record-section">
          <el-date-picker
            v-model="selectedCalendarYear"
            size="small"
            type="year"
            @change="loadData"
          />
          <el-table
            :data="records"
            class="record-table"
            size="small"
            max-height="600px"
            cell-class-name="table-row-cell"
          >
            <el-table-column
              type="expand"
            >
              <template slot-scope="scope">
                <div class="content" v-if="scope.row.image">
                  {{scope.row.content}}&nbsp;&nbsp;
                  <img :src="scope.row.image" class="content-img"/>
                </div>
                <div class="content" v-html="scope.row.content" v-else></div>
              </template>
            </el-table-column>
            <!-- FIXME: infinitely growing width bug???-->
            <el-table-column
              property="visit_at"
              label="随访时间"
            />
            <el-table-column
              v-if="context===ACTION_CONTEXT.DOCTOR"
              property="visit_name"
              label="医生名称"
            />
            <el-table-column
              v-if="context===ACTION_CONTEXT.GOVERNMENT_EMPLOYEE"
              property="visit_name"
              label="干部名称"
            />
            <el-table-column
              property="user_ip"
              label="IP地址"
            />
            <!--            <el-table-column-->
            <!--              label="管理操作"-->
            <!--            />-->
          </el-table>
        </article>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Profile from './individual-profile'
import { VISIT_RECORD_TYPES, ACTION_CONTEXT } from '@/utils/const'
import { getIndividualProfile, getVisitRecords } from '@/api/pairings'

export default {
  name: 'ViewVisitDetails',
  components: { Profile },
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    rid: {
      type: [String, Number],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    context: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      records: [],
      visible: false,
      profileData: {},
      selectedCalendarYear: new Date()
    }
  },
  computed: {
    ACTION_CONTEXT() {
      return ACTION_CONTEXT
    }
  },
  watch: {
    visible(newV, oldV) {
      if (newV) {
        Promise.all([this.loadData(), this.loadProfile()])
      } else {
        this.selectedCalendarYear = new Date()
      }
    }
  },
  mounted() {
  },
  methods: {
    async loadData() {
      try {
        this.records = (await getVisitRecords(this.rid, VISIT_RECORD_TYPES.indexOf(this.context), this.selectedCalendarYear?(this.selectedCalendarYear).getFullYear():undefined)).data
      } catch (e) {
        this.$message({
          message: `读取随访数据失败: ${e.message}`,
          type: 'error'
        })
      }
    },
    async loadProfile() {
      try {
        const sourceData = (await getIndividualProfile(this.id)).data
        this.profileData = {
          portrait: sourceData.image,
          group: sourceData.LB,
          relation: sourceData.GX,
          householdId: sourceData.HBH,
          individualId: sourceData.RBH,
          name: sourceData.TName,
          gender: sourceData.SEX,
          id: sourceData.Card,
          phoneNumber: sourceData.Tel,
          town: sourceData.town_name,
          village: sourceData.village_name,
          address: sourceData.Address,
          householdMembers: sourceData.BZRS,
          SSN: sourceData.DBBH,
          cardId: sourceData.JZBH,
          disabilityId: sourceData.CJBH,
          pairedOfficialTitle: sourceData.JDDW,
          pairedOfficialName: sourceData.JDGB,
          pairedOfficialPhoneNumber: sourceData.JDGBtel,
          pairedDoctor: sourceData.QYYS,
          pairedDoctorPhoneNumber: sourceData.QYYSTel,
          isPartyMember: sourceData.IsDY,
          status: sourceData.ZT,
          reasonForCancellation: sourceData.ZXYY,
          dateOfCancellation: sourceData.deleted_at,
          causeOfPoverty: sourceData.ZPYY,
          povertyReductionProgramme: sourceData.BFCS,
        }
      } catch (e) {
        this.$message({
          message: `读取个人信息数据失败: ${e.message}`,
          type: 'error'
        })
      }
    },
    openModal() {
      this.visible = true
    }
  }
}
</script>

<style scoped>
.record-table{
  max-height: 80vh;
}
.modal-body{
  /*display: grid;*/
  /*grid-template-columns: 1fr 3fr;*/
  /*column-gap: 1ch;*/
  display: flex;
  flex-flow: column nowrap;
  row-gap: 1ch;
  min-width: 800px;
}
.profile-section{
  width: 100%;
}
.record-section{
  /*max-width: 800px;*/
}
.content{
  max-width: 600px;
}
.content-img{
  width: 80px;
}
</style>

<template>
  <div style="display: inline-block">
    <el-button type="primary" @click="openModal" style="margin-right:15px;">新增结对档案</el-button>

    <el-dialog
      :title="`新增结对档案`"
      :visible.sync="visible"
      width="min-content"
      center
    >
      <div class="modal-body">
        <article class="profile-section">
          <Profile :data="profileData" />
        </article>
        <article class="form-section">
          <el-form ref="form" :model="form" label-width="120px" :rules="rules" class="form">
            <el-form-item label="农户人员身份证" prop="id">
              <el-input
                v-model="form.id"
                v-loading="loadingProfile"
                maxlength="18"
                show-word-limit
              />
            </el-form-item>
            <!--            <el-form-item label="贫困人员姓名">-->
            <!--              <el-input v-model="form.name" disabled></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="结对单位" prop="officialTitle">
              <el-input v-model="form.officialTitle" :disabled="isDisabled" />
            </el-form-item>
            <el-form-item label="结对干部" prop="officialName">
              <el-input v-model="form.officialName" :disabled="isDisabled" />
            </el-form-item>
            <el-form-item label="干部联系方式" prop="officialPhoneNumber">
              <el-input v-model="form.officialPhoneNumber" :disabled="isDisabled" />
            </el-form-item>
          </el-form>
          <div class="additional-info">
            <div class="item"><div class="label">致贫原因: </div><div>{{ profileData.causeOfPoverty }}</div></div>
            <div class="item"><div class="label">帮扶措施: </div><div>{{ profileData.povertyReductionProgramme }}</div></div>
            <div class="item"><div class="label">备注: </div><div>{{ profileData.additionalNotes }}</div></div>
          </div>
        </article>
      </div>
      <template slot="footer">
        <el-button :disabled="isDisabled" :loading="submitting" @click="submit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Profile from './individual-profile'
import { createPairing, getIndividualProfile } from '@/api/pairings'

export default {
  name: 'CreateOfficialPairing',
  components: { Profile },
  props: [],
  data() {
    return {
      visible: false,
      submitting: false,
      loadingProfile: false,
      profileData: {},
      form: {
        id: '',
        officialTitle: '',
        officialName: '',
        officialPhoneNumber: ''
      },
      rules: {
        id: [
          { required: true, message: '身份证号码为必填项', trigger: 'blur' },
          { min: 18, max: 18, message: '长度为18位', trigger: 'blur' },
          { validator: this.validateId, trigger: 'blur' }
        ],
        officialTitle: [
          { required: true, message: '结对单位为必填项', trigger: 'blur' }
        ],
        officialName: [
          { required: true, message: '结对干部名字为必填项', trigger: 'blur' }
        ],
        officialPhoneNumber: [
          { required: true, message: '干部联系方式为必填项', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isPairedAlready() {
      return !!this.profileData.pairedOfficialName
    },
    profileExist() {
      return (!!this.profileData.householdId) && this.form.id.length === 18 && !this.loadingProfile
    },
    isDisabled() {
      return (!this.profileExist) || this.isPairedAlready
    }
  },
  watch: {
    visible(newV, oldV) {
      if (!newV) {
        this.profileData = {}
        this.form = {
          id: '',
          officialTitle: '',
          officialName: '',
          officialPhoneNumber: ''
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    async loadProfile() {
      if (this.profileData.id !== this.form.id) {
        this.loadingProfile = true
        try {
          const sourceData = (await getIndividualProfile(this.form.id)).data
          if (!sourceData) {
            throw new Error('用户不存在')
          }
          if (!this.visible) {
            this.loadingProfile = false
            return
          }
          this.profileData = {
            rowId: sourceData.ID,
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
            additionalNotes: sourceData.Content
          }
          if (this.profileData.pairedOfficialName) {
            this.form.officialName = this.profileData.pairedOfficialName
            this.form.officialTitle = this.profileData.pairedOfficialTitle
            this.form.officialPhoneNumber = this.profileData.pairedOfficialPhoneNumber
          } else {
            this.form.officialName = ''
            this.form.officialTitle = ''
            this.form.officialPhoneNumber = ''
          }
        } catch (e) {
          this.profileData = {}
          this.form.name = ''
          this.form.phoneNumber = ''
          this.$message({
            message: `读取个人信息数据失败: ${e.message}`,
            type: 'error'
          })
        }
        this.loadingProfile = false
      }
    },
    async validateId(rule, value, callback) {
      await this.loadProfile()
      if (this.profileData.householdId) {
        return callback()
      }
      callback(new Error('该人员不存在,无法添加信息！'))
    },
    async submit() {
      const params = {
        ID: this.profileData.rowId,
        JDDW: this.form.officialTitle,
        JDGB: this.form.officialName,
        JDGBtel: this.form.officialPhoneNumber
      }
      this.submitting = true
      try {
        await this.$refs['form'].validate()
        try {
          await createPairing(params)
          this.visible = false
          this.$message({
            message: '上传成功!',
            type: 'success'
          })
        } catch (e) {
          this.$message({
            message: `上传失败: ${e.message}`,
            type: 'error'
          })
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
      this.submitting = false
    },
    openModal() {
      this.visible = true
    }
  }
}
</script>

<style scoped>
.modal-body{
  display: flex;
  flex-flow: column nowrap;
  row-gap: 1ch;
  /*min-width: 800px;*/
}
.profile-section{
  width: fit-content;
  max-width: 100vw;
}
.form-section{
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
}
.additional-info{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 28px;
  row-gap: 30px;
}
.form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 28px;
}
.item{
  display: flex;
  flex-flow: row nowrap;
}
.label{
  min-width: 120px;
  text-align: right;
  display: inline-block;
  padding-right: 12px;
  font-size: 14px;
  font-weight: 700;
  color: black;
}
</style>
<style lang="scss">
.form{
  .el-form-item__label {
    font-size: 14px;
    font-weight: 700;
    color: black;
  }
}
</style>

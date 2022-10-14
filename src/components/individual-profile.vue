<template>
  <div class="profile-container">
    <div class="profile-picture-container">
      <img
        class="profile-picture"
        :src="data.portrait||defaultPortrait"
        alt="头像"
      >
    </div>
    <div class="profile-information">
      <div class="profile-section">
        <div><span>姓名: </span>{{ data.name || '--' }}</div>
        <div><span>性别: </span>{{ data.gender || '--' }}</div>
        <div><span>与户主关系: </span>{{ data.relation || '--' }}</div>
        <div><span>人员类型: </span>{{ getGroupName(data.group) }}</div>
        <div><span>联系方式: </span>{{ data.phoneNumber || '--' }}</div>
        <div><span>保障人数: </span>{{ data.householdMembers || '未知' }}</div>
        <div><span>是否党员: </span>{{ data.isPartyMember?'是':'否' }}</div>
        <div><span>状态: </span>{{ getStatusString(data.status) }}</div>
      </div>
      <div class="profile-section">
        <div><span>户编号: </span>{{ data.householdId || '--' }}</div>
        <div><span>人编号: </span>{{ data.individualId || '--' }}</div>
        <div><span>身份证号: </span>{{ data.id || '--' }}</div>
        <div><span>低保编号: </span>{{ data.SSN || '--' }}</div>
        <div><span>救助证编号: </span>{{ data.cardId || '--' }}</div>
        <div><span>残疾证编号: </span>{{ data.disabilityId || '--' }}</div>
      </div>
      <div class="profile-section">
        <div><span>片区: </span>{{ data.town || '--' }}</div>
        <div><span>社区: </span>{{ data.village || '--' }}</div>
        <div><span>家庭地址: </span>{{ data.address || '--' }}</div>
      </div>
      <div class="profile-section">

        <div><span>结对单位: </span>{{ data.pairedOfficialTitle || '--' }}</div>
        <div><span>结队干部: </span>{{ data.pairedOfficialName || '--' }}</div>
        <div><span>干部联系方式: </span>{{ data.pairedOfficialPhoneNumber || '--' }}</div>
        <div><span>签约医生: </span>{{ data.pairedDoctor || '--' }}</div>
        <div><span>医生联系方式: </span>{{ data.pairedDoctorPhoneNumber || '--' }}</div>
      </div>
      <div class="profile-section">
        <div><span>注销原因: </span>{{ data.reasonForCancellation || '--' }}</div>
        <div><span>注销时间: </span>{{ data.dateOfCancellation || '--' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { GROUP_NAMES, POVERTY_STATUS } from '@/utils/const'

export default {
  name: 'IndividualProfile',
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      defaultPortrait: require('@/assets/User-Profile-256.png')
      // defaultPortrait: 'https://source.unsplash.com/400x300/?face'
    }
  },
  mounted() {
  },
  methods: {
    getGroupName(id) {
      return GROUP_NAMES[id]
    },
    getStatusString(id) {
      return POVERTY_STATUS[id]
    }
  }
}
</script>
<style scoped>
.profile-container{
  display: flex;
  flex-flow: row nowrap;
  font-size: small;
  border-radius: 10px;
  min-width: 1000px;
  border: 1px solid #F0EFEF;
  overflow: hidden;
  align-items: center;
}
.profile-picture-container{
  border-radius: 10px ;
  margin: 1em;
  width: 150px;
  aspect-ratio: 150 / 120;
  overflow: hidden;
}
.profile-picture{
  object-fit: cover;
  overflow: hidden;
  width: 100%;
}
.profile-information{
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
}
.profile-section{
  border: 1px solid #F0EFEF;
  border-bottom: none;
  padding: 2px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  word-break: break-word;
}
.profile-section:first-child{
  border-top: none;
}
.profile-section:not(:last-child){
  border-bottom: none;
}
.profile-section>div>span{
  font-size: 14px;
  font-family: Microsoft YaHei Bold, Microsoft YaHei Bold-Bold;
  font-weight: 700;
  text-align: left;
  color: black;
  line-height: 32px;
}
</style>

<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="企业信息" labelClassName="fixTitle"></el-descriptions-item>
      <el-descriptions-item label="企业名称">{{ info && info.company_name }}</el-descriptions-item>
      <el-descriptions-item label="社会统一信用代码">{{ info && info.credit_code }}</el-descriptions-item>
      <el-descriptions-item label="法定代表人">{{ info && info.legal_rep }}</el-descriptions-item>
      <el-descriptions-item label="电话号码">{{ info && info.mobile }}</el-descriptions-item>
      <el-descriptions-item label="开户银行">{{ info && info.bank_name }}</el-descriptions-item>
      <el-descriptions-item label="开户名称">{{ info && info.bank_user }}</el-descriptions-item>
      <el-descriptions-item label="银行账号">{{ info && info.bank_card }}</el-descriptions-item>
      <el-descriptions-item label="联系人信息" labelClassName="fixTitle"></el-descriptions-item>
      <el-descriptions-item label="村镇">{{ info && info.town_name + info.village_name }}</el-descriptions-item>
      <el-descriptions-item label="联系人">{{ info && info.linkman }}</el-descriptions-item>
      <el-descriptions-item label="电话">{{ info && info.linkman_mobile }}</el-descriptions-item>
      <el-descriptions-item label="蜂箱信息" labelClassName="fixTitle"></el-descriptions-item>
      <el-descriptions-item label="养殖地点">{{ info && info.address }}</el-descriptions-item>
      <el-descriptions-item label="蜂箱数量">{{ info && info.act_train_hive }}</el-descriptions-item>
      <el-descriptions-item label="主要蜜源">{{ info && info.bee_desc }}</el-descriptions-item>
      <el-descriptions-item label="蜂箱照片">
        <div class="idListItem">
          <template v-for="(sub, subIndex) in idList">
            <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
          </template>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="资格认定" labelClassName="fixTitle"></el-descriptions-item>
    </el-descriptions>
    <div class="mb22">农产品质量安全</div>
    <div class="flexStart">
      <div>蜂蜜抽检不合格事件</div>
      <div class="ml20">
        <el-radio v-model="illegal" label="2" disabled>有</el-radio>
        <el-radio v-model="illegal" label="1" disabled>无</el-radio>
      </div>
    </div>
    <selfAssess :fromClient="initForm" :fromBack="initAudit" :clientDisable="formDisable" :backDisable="auditDisable" />
    <viewer :images="images" :options="options" @inited="inited" class="viewer" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
  </div>
</template>
<script>
import selfAssess from '../../components/selfAssessment.vue';
export default {
  components: {
    selfAssess,
  },
  name: 'applicaCon',
  props: {
    data: {},
  },
  data() {
    return {
      initForm: {},
      initAudit: {},
      formDisable: true,
      auditDisable: true,
      illegal: '1',
      info: {},
      options: {
        initialViewIndex: 0,
      },
      idList: [],
      images: [],
    };
  },
  mounted() {
    this.info = this.data;
    this.initForm = this.data;
    // let after = JSON.parse(this.info.eva_info);
    let eva_info = this.info.eva_info;
    // eva_info = eva_info.replaceAll("'", '"');
    // let after = JSON.parse(eva_info);
    let after = eva_info
    if (after && after.addonData) {
      this.initAudit = after.addonData;
    }
    this.formDisable = true;
    this.auditDisable = true;
    this.illegal = this.data.seniority_status ? String(this.data.seniority_status) : '1';
    this.idList = this.info.bee_image_url;
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(index, item) {
      this.options.initialViewIndex = index;
      this.images = item;
      setTimeout(() => {
        this.$viewer.show();
      }, 400);
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .fixTitle {
  font-size: 18px;
  font-weight: 500;
}
.mb22 {
  margin-bottom: 22px;
}
.ml20 {
  margin-left: 20px;
}
.commonCon1 {
  background-color: #fff;
  .flexStart {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .idListItem {
    img {
      width: 80px;
      height: 80px;
      cursor: pointer;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>

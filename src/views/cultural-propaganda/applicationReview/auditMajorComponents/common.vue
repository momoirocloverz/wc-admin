<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="企业信息" labelClassName="fixTitle"></el-descriptions-item>
      <el-descriptions-item label="企业名称">{{ this.info.company_name }}</el-descriptions-item>
      <el-descriptions-item label="社会统一信用代码">{{ this.info.credit_code }}</el-descriptions-item>
      <el-descriptions-item label="法定代表人">{{ this.info.legal_rep }}</el-descriptions-item>
      <el-descriptions-item label="电话号码">{{ this.info.mobile }}</el-descriptions-item>
      <el-descriptions-item label="开户银行">{{ this.info.bank_name }}</el-descriptions-item>
      <el-descriptions-item label="开户名称">{{ this.info.bank_user }}</el-descriptions-item>
      <el-descriptions-item label="银行账号">{{ this.info.bank_card }}</el-descriptions-item>
      <el-descriptions-item label="联系人信息" labelClassName="fixTitle"></el-descriptions-item>
      <el-descriptions-item label="村镇">{{ this.info.town_name + this.info.village_name }}</el-descriptions-item>
      <el-descriptions-item label="联系人">{{ this.info.linkman }}</el-descriptions-item>
      <el-descriptions-item label="电话">{{ this.info.linkman_mobile }}</el-descriptions-item>
      <el-descriptions-item label="蜂箱信息" labelClassName="fixTitle"></el-descriptions-item>
      <el-descriptions-item label="养殖地点">{{ this.info.address }}</el-descriptions-item>
      <el-descriptions-item label="蜂箱数量">{{ this.info.train_hive }}</el-descriptions-item>
      <el-descriptions-item label="主要蜜源">{{ this.info.bee_desc }}</el-descriptions-item>
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
        <el-radio-group v-model="illegal" @change="illegalChange" :disabled="justForShow">
          <el-radio label="2">有</el-radio>
          <el-radio label="1">无</el-radio>
        </el-radio-group>
      </div>
    </div>
    <selfAssess :fromClient="initForm" :fromBack="initAudit" :clientDisable="formDisable" :backDisable="auditDisable" @fetchInputValue="transInput" />
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
    isAudit: false,
  },
  data() {
    return {
      illegal: '1',
      info: {},
      options: {
        initialViewIndex: 0,
      },
      idList: [],
      images: [],
      initForm: {},
      initAudit: {},
      formDisable: true,
      auditDisable: false,
      justForShow: false,
    };
  },
  mounted() {
    if (this.isAudit) {
      this.auditDisable = false;
      this.justForShow = false;
    } else {
      this.auditDisable = true;
      this.justForShow = true;
    }
    this.info = this.data;
    this.idList = this.data.bee_image_url;
    this.initForm = this.data;
    let eva_info = this.info.eva_info;
    // eva_info = eva_info.replaceAll("'", '"');
    // let after = JSON.parse(eva_info);
    // let after = JSON.parse(this.info.eva_info);
    let after = eva_info;
    if (this.data.seniority_status) {
      this.illegal = String(this.data.seniority_status);
    }
    if (after && after.addonData) {
      this.initAudit = after.addonData;
    }
  },
  methods: {
    illegalChange() {
      this.$emit('seniorityChange', this.illegal);
      if (this.illegal == '2') {
        this.auditDisable = true;
      } else {
        this.auditDisable = false;
      }
    },
    transInput(val) {
      this.$emit('bridgeTrans', val);
    },
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
.commonCon1 {
  ::v-deep .fixTitle {
    font-size: 18px;
    font-weight: 500;
  }
  background-color: #fff;
  .flexStart {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .ml20 {
    margin-left: 20px;
  }
  .mb22 {
    margin-bottom: 22px;
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

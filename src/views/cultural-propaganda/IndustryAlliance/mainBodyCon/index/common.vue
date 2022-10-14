<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="姓名">{{ this.info.name }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{ this.info.card }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ this.info.mobile }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ this.info.gender }}</el-descriptions-item>
      <el-descriptions-item label="开户银行">{{ this.info.bank_name }}</el-descriptions-item>
      <el-descriptions-item label="银行卡号">{{ this.info.bank_account }}</el-descriptions-item>
      <el-descriptions-item label="家庭地址">{{ this.info.address }}</el-descriptions-item>
      <el-descriptions-item label="土地经营面积">{{ this.info.area }}</el-descriptions-item>
      <el-descriptions-item label="经营权合同及证明">
        <div class="idListItem">
          <template v-for="(sub, subIndex) in idList">
            <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
          </template>
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <viewer :images="images" :options="options" @inited="inited" class="viewer" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
  </div>
</template>
<script>
export default {
  name: 'applicaCon',
  props: {
    data: {},
    isAudit: false,
  },
  data() {
    return {
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
    this.idList = this.data.manage_img_list;
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
.commonCon1 {
  ::v-deep .fixTitle {
    font-size: 18px;
    font-weight: 500;
  }
  background-color: #fff;
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

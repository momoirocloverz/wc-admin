<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="企业名称">{{ this.info.name }}</el-descriptions-item>
      <el-descriptions-item label="统一信用代码">{{ this.info.social_code }}</el-descriptions-item>
      <el-descriptions-item label="法人姓名">{{ this.info.legal_name }}</el-descriptions-item>
      <el-descriptions-item label="法人身份证">{{ this.info.legal_card }}</el-descriptions-item>
      <el-descriptions-item label="联系人">{{ this.info.contact_name }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ this.info.contact_mobile }}</el-descriptions-item>
      <el-descriptions-item label="经营地址">{{ this.info.address }}</el-descriptions-item>
      <el-descriptions-item label="统一社会信用代码证">
        <div class="idListItem">
          <template v-for="(sub, subIndex) in idList">
            <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
          </template>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="食品卫生许可证">
        <div class="idListItem">
          <template v-for="(sub, subIndex) in idList2">
            <img @click="() => show(subIndex, idList2)" :key="subIndex" :src="sub" />
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
      idList2: [],
      images: [],
    };
  },
  mounted() {
    this.info = this.data;
    this.idList = this.data.social_img_list;
    this.idList2 = this.data.product_img_list;
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

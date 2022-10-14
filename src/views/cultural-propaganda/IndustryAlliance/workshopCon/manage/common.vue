<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="加工类型">{{ this.info.type == 1 ? '委托加工' : '定制加工' }}</el-descriptions-item>
      <el-descriptions-item label="预约人">{{ this.info.name }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ this.info.mobile }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{ this.info.card }}</el-descriptions-item>
      <el-descriptions-item label="家庭地址">{{ this.info.address }}</el-descriptions-item>
      <el-descriptions-item label="加工量">{{ this.info.weight }}</el-descriptions-item>
      <el-descriptions-item label="加工费用">{{ this.info.price }}</el-descriptions-item>
      <el-descriptions-item label="预期完成时间">{{ this.info.limit_date }}</el-descriptions-item>
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
    this.idList = this.data.bee_image_url;
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

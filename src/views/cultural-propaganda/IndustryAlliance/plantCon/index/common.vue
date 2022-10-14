<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="标题名称">{{ this.info.title }}</el-descriptions-item>
      <el-descriptions-item label="认种类型">{{ this.info.type }}</el-descriptions-item>
      <el-descriptions-item label="认种面积">{{ this.info.area }}</el-descriptions-item>
      <el-descriptions-item label="收购价格">{{ this.info.price }}</el-descriptions-item>
      <el-descriptions-item label="最低认种面积">{{ this.info.low_area }}</el-descriptions-item>
      <el-descriptions-item label="最高认种面积">{{ this.info.high_area }}</el-descriptions-item>
      <el-descriptions-item label="预约截止日期">{{ this.info.limit_date }}</el-descriptions-item>
      <el-descriptions-item label="认种要求">{{ this.info.demand }}</el-descriptions-item>
      <el-descriptions-item label="农作物照片">
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
    this.idList = this.data.img_list;
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

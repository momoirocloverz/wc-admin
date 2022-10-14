<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="车间名称">{{ this.info.name }}</el-descriptions-item>
      <el-descriptions-item label="车间地址">{{ this.info.address }}</el-descriptions-item>
      <el-descriptions-item label="管理员">{{ this.info.manage_name }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ this.info.mobile }}</el-descriptions-item>
      <el-descriptions-item label="车间状态">{{ this.info.is_open == '1' ? '开放预约' : '结束预约' }}</el-descriptions-item>
      <el-descriptions-item label="车间人数">{{ this.info.num }}</el-descriptions-item>
      <el-descriptions-item label="车间介绍">{{ this.info.introduce }}</el-descriptions-item>
      <el-descriptions-item label="预约设置">{{ this.info.start_date }}{{ this.info.end_date }}</el-descriptions-item>
      <el-descriptions-item label="车间照片">
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

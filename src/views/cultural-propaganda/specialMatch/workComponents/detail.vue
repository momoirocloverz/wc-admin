<template>
  <div class="specialMatchDetailCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="姓名">{{ this.info.name }}</el-descriptions-item>
      <el-descriptions-item label="乡镇">{{ this.info.town_name }}</el-descriptions-item>
      <el-descriptions-item label="村名">{{ this.info.village_name }}</el-descriptions-item>
      <el-descriptions-item label="手机号码">{{ this.info.mobile }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{ this.info.identity }}</el-descriptions-item>
      <el-descriptions-item label="家庭住址"
        ><div class="limit">{{ this.info.address }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="开户银行">{{ this.info.bank_name }}</el-descriptions-item>
      <el-descriptions-item label="银行账户">{{ this.info.bank_card }}</el-descriptions-item>
      <el-descriptions-item label="结对干部">{{ this.info.admin_name }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ statusMap[this.info.status] }}</el-descriptions-item>
    </el-descriptions>
    <viewer :images="images" :options="options" @inited="inited" class="viewer" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'applicaCon',
  props: {
    data: {},
  },
  data() {
    return {
      info: {},
      options: {
        initialViewIndex: 0,
      },
      idList1: [],
      idList: [],
      images: [],
      statusMap: {
        0: '待结对',
        1: '已结对',
        2: '已拒绝',
        3: '结对中',
      },
    };
  },
  mounted() {
    this.info = this.data;
    this.idList1 = this.data.salary_image_path;
    this.idList = this.data.work_image_path;
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
.specialMatchDetailCon1 {
  background-color: #fff;
  .limit {
    width: 450px;
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

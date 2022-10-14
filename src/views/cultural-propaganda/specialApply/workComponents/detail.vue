<template>
  <div class="detailCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="企业名称">{{ this.info.company_name }}</el-descriptions-item>
      <el-descriptions-item label="工作内容">{{ this.info.content }}</el-descriptions-item>
      <el-descriptions-item label="工作日期">{{ this.info.start_time + '-' + info.end_time }}</el-descriptions-item>
      <el-descriptions-item label="工作时段">{{ this.info.work_time }}</el-descriptions-item>
      <el-descriptions-item label="工作地点">{{ this.info.address }}</el-descriptions-item>
      <el-descriptions-item label="工作要求"
        ><div class="limit">{{ this.info.demand }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="薪资">{{ this.info.salary }}</el-descriptions-item>
      <el-descriptions-item label="招聘人数">{{ this.info.work_num }}</el-descriptions-item>
      <el-descriptions-item label="实际招聘人数">{{ this.info.workApplyNum }}</el-descriptions-item>
      <el-descriptions-item label="工资单">
        <div class="idListItem">
          <template v-for="(sub, subIndex) in idList1">
            <img @click="() => show(subIndex, idList1)" :key="subIndex" :src="sub" />
          </template>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="工作照片">
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
.detailCon1 {
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

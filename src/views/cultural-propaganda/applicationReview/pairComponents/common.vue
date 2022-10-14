<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="低收入农户">{{ info.farmer_info }}</el-descriptions-item>
      <el-descriptions-item label="企业名称">{{ info.major_info }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ info.status_name }}</el-descriptions-item>
      <el-descriptions-item label="蜂箱编号">{{ info.hive_info && info.hive_info.hive_no }}</el-descriptions-item>
      <el-descriptions-item label="养蜂信息"></el-descriptions-item>
      <template v-for="item in beeArray">
        <el-descriptions-item label="蜂箱照片">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in item.img_url">
              <img @click="() => show(subIndex, item.img_url)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="蜂箱地址">
          {{ item.address }}
        </el-descriptions-item>
        <el-descriptions-item label="蜂箱经纬度">
          <div class="flexStart ml20">
            <div>经度：</div>
            <div>{{ item.lon }}</div>
          </div>
          <div class="flexStart ml20">
            <div>纬度：</div>
            <div>{{ item.lat }}</div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="上传时间">
          <div>{{ item.created_at }}</div>
        </el-descriptions-item>
      </template>
    </el-descriptions>
    <viewer :images="images" :options="options" @inited="inited" class="viewer" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
  </div>
</template>
<script>
import { beeMatchInfo } from '@/api/bee';
export default {
  components: {},
  name: 'applicaCon',
  props: {
    data: {},
  },
  data() {
    return {
      info: {},
      beeArray: [],
      options: {
        initialViewIndex: 0,
      },
      images: [],
    };
  },
  mounted() {
    this.info = this.data;
    this.fetchInfo();
  },
  methods: {
    fetchInfo() {
      beeMatchInfo({
        id: this.data.id,
        page: 1,
        page_size: 9999,
      })
        .then((res) => {
          if (res && res.code == 0) {
            this.info = res.data;
            this.beeArray = (res.data.reportList && res.data.reportList.data) || [];
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
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

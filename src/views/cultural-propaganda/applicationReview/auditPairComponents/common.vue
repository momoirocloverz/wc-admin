<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="低收入农户">{{ info.farmer_name }}</el-descriptions-item>
      <el-descriptions-item label="企业名称">{{ info.major_name }}</el-descriptions-item>
      <el-descriptions-item label="养殖大户是否同意">同意</el-descriptions-item>
      <el-descriptions-item label="蜂箱照片">
        <div class="idListItem">
          <template v-for="(sub, subIndex) in idList">
            <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
          </template>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="蜂箱地址">
        <div class="flexBetween">
          <div>{{ info.address }}</div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="蜂箱经纬度">
        <div class="flexStart ml20">
          <div>经度：</div>
          <div>{{ info.lon }}</div>
        </div>
        <div class="flexStart ml20">
          <div>纬度：</div>
          <div>{{ info.lat }}</div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="提交时间">
        {{ info.created_at }}
      </el-descriptions-item>
      <!-- <template v-for="(item, index) in beeArray">
        <el-descriptions-item label="蜂箱照片"
          ><div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template></div
        ></el-descriptions-item>
        <el-descriptions-item label="蜂箱地址">
          <div class="flexBetween">
            <div>adasd</div>
            <div class="flexStart ml20">
              <div>经度：</div>
              <div>2</div>
            </div>
            <div class="flexStart ml20">
              <div>纬度：</div>
              <div>2</div>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="提交时间"></el-descriptions-item>
      </template> -->
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
      beeArray: [],
      options: {
        initialViewIndex: 0,
      },
      idList: [],
      images: [],
    };
  },
  mounted() {
    this.info = this.data;
    this.idList = this.data.img_url;
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
  background-color: #fff;
  .flexStart {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .flexBetween {
    display: flex;
    justify-content: space-between;
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

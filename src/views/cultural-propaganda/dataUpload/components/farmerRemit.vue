<template>
  <div class="commonCon1">
    <el-timeline>
      <template v-for="(item, index) in beeArray">
        <el-timeline-item :timestamp="item.created_at" placement="top" :key="index">
          <div class="marginT30">
            <div class="flexStart padLeft10 mb10">
              <div class="padRight10">打款金额：</div>
              <div>{{ item.amount }}元/户</div>
            </div>
            <div class="flexStart padLeft10">
              <div class="padRight10">付款凭证：</div>
              <div>
                <div class="idListItem">
                  <template v-for="(sub, subIndex) in item.img_url">
                    <img @click="() => show(subIndex, item.img_url)" :key="subIndex" :src="sub" />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </template>
    </el-timeline>
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
      beeArray: [],
      options: {
        initialViewIndex: 0,
      },
      idList: [],
      images: [],
    };
  },
  mounted() {
    this.beeArray = this.data;
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
    align-items: center;
    align-content: center;
  }
  .padLeft10 {
    padding-left: 10%;
  }
  .padRight10 {
    padding-right: 10px;
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
  .marginT30 {
    margin-top: 30px;
  }
  .mb10 {
    margin-bottom: 10px;
  }
}
</style>

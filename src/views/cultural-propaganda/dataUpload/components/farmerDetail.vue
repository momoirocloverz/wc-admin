<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="姓名">{{ detail.name }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ detail.status_name }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{ detail.identity }}</el-descriptions-item>
      <el-descriptions-item label="电话号码">{{ detail.mobile }}</el-descriptions-item>
      <el-descriptions-item label="家庭地址">{{ detail.address }}</el-descriptions-item>
      <el-descriptions-item label="开户银行">{{ detail.bank_name }}</el-descriptions-item>
      <el-descriptions-item label="银行账号">{{ detail.bank_card }}</el-descriptions-item>
      <el-descriptions-item label="身份证照">
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
import { farmerManageInfo } from '@/api/bee';
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
      detail: {},
    };
  },
  mounted() {
    this.info = this.data;
    if (this.info.farmer_id) {
      farmerManageInfo({
        farmer_id: this.info.farmer_id,
      }).then((res) => {
        if (res && res.code === 0) {
          this.detail = res.data;
          this.idList = res.data.identity_image_url;
        } else {
          this.$message.error(res.msg);
        }
      });
    }
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
  .divide {
    width: 33%;
  }
  .distribute {
    width: 50%;
  }
  .mb20 {
    margin-bottom: 20px;
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
  .itemTitle {
    font-weight: 500;
    width: 100px;
  }
}
</style>

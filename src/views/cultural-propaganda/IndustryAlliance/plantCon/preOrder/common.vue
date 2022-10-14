<template>
  <div class="commonCon1">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="标题名称">{{ this.info.title }}</el-descriptions-item>
      <el-descriptions-item label="认种类型">{{ this.info.type }}</el-descriptions-item>
      <el-descriptions-item label="认种农户">{{ this.info.name }}</el-descriptions-item>
      <el-descriptions-item label="联系方式">{{ this.info.mobile }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{ this.info.card }}</el-descriptions-item>
      <el-descriptions-item label="认种面积">{{ this.info.area }}</el-descriptions-item>
      <el-descriptions-item label="预估收益">{{ this.info.pre_income }}</el-descriptions-item>
      <el-descriptions-item label="预付款">{{ this.info.pre_pay }}</el-descriptions-item>
      <el-descriptions-item label="电子协议">
        <span>《土地种植协议》</span>
        <div class="flexDownload">
          <div @click="downloadNow">下载</div>
          <div @click="() => show(0, idList2)">查看</div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="打款凭证">
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
      idList2: [],
      images: [],
    };
  },
  mounted() {
    this.info = this.data;
    this.idList = this.data.confirm_img_list;
    this.idList2 = this.data.sign_img_list;
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    downloadFuction(url) {
      // window.location.href = 'https://ningbo-xcdn.oss-cn-hangzhou.aliyuncs.com/live/enterprise/村庄图片/余姚市/横坎头村/横坎头初新农庄.jpg';
      function downloadImgByBase64(url) {
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d');
          // 将img中的内容画到画布上
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // 将画布内容转换为base64
          var base64 = canvas.toDataURL();
          // 创建a链接
          var a = document.createElement('a');
          a.href = base64;
          a.download = '协议' + Date.now() + '.png';
          // 触发a链接点击事件，浏览器开始下载文件
          a.click();
        };
        img.src = url;
        // 必须设置，否则canvas中的内容无法转换为base64
        img.setAttribute('crossOrigin', 'Anonymous');
      }
      downloadImgByBase64(url);
      //   window.location.href = url;
      //   downloadImgByBase64('https://ningbo-xcdn.oss-cn-hangzhou.aliyuncs.com/live/enterprise/村庄图片/余姚市/横坎头村/横坎头初新农庄.jpg');
    },
    downloadNow() {
      if (this.info && this.info.sign_img_list && this.info.sign_img_list.length) {
        this.downloadFuction(this.info.sign_img_list[0]);
      }
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
.flexDownload {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  div {
    margin-right: 30px;
    cursor: pointer;
    color: #409eff;
  }
}
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

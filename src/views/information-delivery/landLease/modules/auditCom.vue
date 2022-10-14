<template>
  <div class="details">
    <div class="list">
      <span>发布类型：</span>
      <div>{{ detailData.release_name }}</div>
    </div>
    <!-- <div class="list">
      <span>发布分类：</span>
      <div>{{ detailData.crop_category_name }}</div>
    </div> -->
    <div class="list">
      <span>标题：</span>
      <div>{{ detailData.title || "-" }}</div>
    </div>
    <div class="list">
      <span>发布内容：</span>
      <div>{{ detailData.content || "-" }}</div>
    </div>
    <div class="list">
      <span>图片：</span>
      <div class="image">
        <el-image
          v-for="item in detailData.image_path"
          :key="item"
          :src="item"
          lazy
          fit="scale-down"
          :preview-src-list="detailData.image_path"
        />
      </div>
    </div>
    <div class="list">
      <span>单价(元)：</span>
      <div>{{ detailData.price || "-" }}</div>
    </div>
    <div class="list">
      <span>单位：</span>
      <div>{{ detailData.unit || "-" }}</div>
    </div>
    <div class="list">
      <span>详细地址：</span>
      <div>{{ detailData.address || "-" }}</div>
    </div>
    <div class="list">
      <span>电话：</span>
      <div>{{ detailData.mobile || "-" }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
.details {
  .list {
    display: flex;
    padding: 5px;
    span {
      width: 80px;
      line-height: 24px;
      text-align: right;
    }
    div {
      width: 0;
      line-height: 24px;
      flex: 1;
      padding-left: 10px;
    }
    .image {
      .el-image {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>

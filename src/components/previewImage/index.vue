<template>
  <div class="preview-image">
    <el-image
      :src="src"
      alt=""
      @click="previewBig"
    />
    <el-dialog
      title="查看图片"
      width="1000px"
      height="75%"
      append-to-body
      :visible.sync="visible"
      custom-class="preview_dialog"
    >
      <div class="preview_image">
        <el-carousel
          v-if="visible"
          :interval="0"
          :arrow="srcList.length > 1 ? 'always' : 'never'"
          :initial-index="activeIndex"
        >
          <el-carousel-item v-for="(item, index) in srcList" :key="index">
            <img :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    srcList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      visible: false,
      activeIndex: 0,
      renderSrc: ''
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.activeIndex = 0
        return
      }

      this.srcList.some((item, index) => {
        if (item === this.src) {
          this.activeIndex = index
          return true
        }
      })
    }
  },
  created() {
    // const index = this.srcList.findIndex(this.src)
  },
  methods: {
    previewBig(e) {
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
  .preview-image {
    width: 100%;
    height: 100%;
  }
  .el-image {
    width: 100%;
    height: 100%;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .preview_image {
    // 左右滑动指示器
    .el-carousel__arrow {
      background: #1f2d3d;
      i {
        font-size: 24px;
      }
    }
    // 下标指示器
    .el-carousel__indicators {
      .el-carousel__indicator {
        .el-carousel__button {
          background: #1f2d3d;
          height: 4px;
          border-radius: 2px;
        }
      }
    }
    // 轮播区域
    .el-carousel__container {
      height: 70vh;
      .el-carousel__item {
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

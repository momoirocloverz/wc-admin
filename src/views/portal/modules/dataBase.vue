<template>
  <div class="data-base">
    <div class="item" v-for="item in list" :key="item.name" :style="{background: 'url(' + item.bg + ') no-repeat', backgroundSize: '100%'}">
      <div>
        <p>{{ item.name }}</p>
        <span>·</span>
        <p>{{ item.month }}</p>
        <i :class="item.type === 1 ? 'el-icon-top bule' : 'el-icon-bottom red'" />
      </div>
      <div>
        <p>{{ item.number }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { name: '低收入农民户数', month: '较上月+21', type: 1, number: '12089人', bg: 'https://img.hzanchu.com/acimg/329925b374a32053aee35df706282ff5.png?x-oss-process=image/resize,l_300' },
        { name: '累计脱贫人数', month: '较上月-18', type: 2, number: '1208人', bg: 'https://img.hzanchu.com/acimg/074fdf4da59e0866a90acf2e13d40b74.png?x-oss-process=image/resize,l_300' },
        { name: '签订代养协议数量', month: '较上月-1', type: 2, number: '1630份', bg: 'https://img.hzanchu.com/acimg/71b785672a4838f7abe3b997fd1c80b3.png?x-oss-process=image/resize,l_300' },
        { name: '养蜂大户/蜂箱数量', month: '较上月+100', type: 2, number: '193人/356箱', bg: 'https://img.hzanchu.com/acimg/2ac8be194c5d0f5c49e1595ced6fdc21.png?x-oss-process=image/resize,l_300' },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.data-base {
  display: flex;
  justify-content: space-between;
  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 20px;
    width: calc(25% - 10px);
    height: 120px;
    border-radius: 6px;
    div {
      color: #fff;
      &:nth-of-type(1) {
        display: flex;
        margin-bottom: 30px;
        span {
          padding: 0 5px;
          font-weight: 600;
        }
      }
      &:nth-of-type(2) {
        font-size: 24px;
      }
      .bule {
        color: blue;
      }
      .red {
        color: red;
      }
    }
  }
}
</style>


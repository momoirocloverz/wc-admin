<template>
  <div class="outer">
    <div class="content">
      <div v-show="active === 0">
        <img src="https://img.hzanchu.com/acimg/aa9a9c0647fdd5eeb743d5f89cc28a27.png">
      </div>
      <div class="db" v-show="active === 1">
        <img v-show="s_active === 1" src="https://img.hzanchu.com/acimg/85e84d49f167545f126f016923e464f3.png?x-oss-process=image/resize,l_3300" alt="">
        <img v-show="s_active === 2" src="https://img.hzanchu.com/acimg/c2b866e5ffb2c8349e6adc6967af98a2.png" alt="">
        <div @click="s_active = 1"></div>
        <div @click="s_active = 2"></div>
      </div>
      <div v-show="active === 2">
        <img src="https://img.hzanchu.com/acimg/5699bb561584dc2dac98c10aac6a2dd1.png" alt="">
      </div>
      <div v-show="active === 3">
        <img src="https://img.hzanchu.com/acimg/ef1b114a5fdcda8be26b7e163048dea0.png" alt="">
      </div>
      <div v-show="active === 4">
        <img src="https://img.hzanchu.com/acimg/fb212ef5432e0f284f2af4c3b5aa587b.png" alt="">
      </div>
      <div v-show="active === 5">
        <img src="https://img.hzanchu.com/acimg/8bf26244c4125173530d48acf8a1b4e7.png" alt="">
      </div>
      <div v-show="active === 6">
        <img src="https://img.hzanchu.com/acimg/be533706d6f9c16e808cee8a99110568.png" alt="">
      </div>
      <div v-show="active === 7">
        <img src="https://img.hzanchu.com/acimg/0c8f4438f32ea056a778b0d138835afd.png" alt="">
      </div>
      <div v-show="active === 8">
        <img src="https://img.hzanchu.com/acimg/296db8019529c994222d041aeeccc30d.png" alt="">
      </div>
      <div v-show="active === 9">
        <img src="https://img.hzanchu.com/acimg/15bfaf79a5961ae08992925dfdb0e1c9.png" alt="">
      </div>
      <div v-show="active === 10">
        <img src="https://img.hzanchu.com/acimg/c40fce9a463d993196ff0d3e3186fb0a.png" alt="">
      </div>
    </div>
    <div class="menu">
      <div class="title" @click="active = 0">十大场景</div>
      <div class="item" v-for="item in menuList" :key="item.id" @click="active = item.value">
        <span :style="{ color: item.color }">{{item.text}}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      s_active: 1,
      menuList: [
        { value: 1, text: '1.未来邻里', color: '#D67635' },
        { value: 2, text: '2.未来教育', color: '#D67635' },
        { value: 3, text: '3.未来健康', color: '#D67635' },
        { value: 4, text: '4.未来交通', color: '#D67635' },
        { value: 5, text: '5.未来文化', color: '#C76BB1' },
        { value: 6, text: '6.未来低碳', color: '#1F9E2E' },
        { value: 7, text: '7.未来建筑', color: '#1F9E2E' },
        { value: 8, text: '8.未来生产', color: '#EB6565' },
        { value: 9, text: '9.未来智慧', color: '#376FC1' },
        { value: 10, text: '10.未来治理', color: '#376FC1' },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .outer {
    overflow: hidden;
    display: flex;
    padding: 39px;
    .content {
      flex: 1;
      background: #fff;
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
      img {
        width: 100%;
        object-fit: cover;
      }
      .db {
        position: relative;
        div {
          position: absolute;
          top: 7%;
          width: 100px;
          height: 60px;
        }
        div:nth-of-type(1) {
          left: 2.6%;
        }
        div:nth-of-type(2) {
          left: 11%;
        }
      }
    }
    .menu {
      width: 214px;
      background: #fff;
      border-radius: 10px;
      padding: 0 35px;
      margin-left: 26px;
      overflow: hidden;
      .title {
        color: #333;
        font-size: 22px;
        font-weight: bold;
        margin-top: 28px;
        cursor: pointer;
      }
      .item {
        height: 60px;
        border-bottom: 1px solid #E9E9E9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        cursor: pointer;
        span {
          font-size: 18px;
        }
      }
    }
  }
</style>
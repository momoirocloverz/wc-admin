<template>
  <div class="CommonBlock">
    <template v-for="(item, index) in array">
      <div :key="index" class="itemCon">
        <img src="https://img.hzanchu.com/acimg/33364d0434cec7982121967c8791d37e.png" />
        <div class="blockRight">
          <div class="itemTitle">{{ item.title }}</div>
          <div class="itemAmount">{{ item.amount }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'CommonBlock',
  props: {
    array: {
      default: [],
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss">
.CommonBlock {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.itemCon {
  margin-right: 24px;
  border-radius: 2px;
  color: #fff;
  width: 215px;
  height: 80px;
  margin-bottom: 24px;
  padding-left: 13px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  img {
    width: 48px;
    height: 48px;
    margin-right: 18px;
  }
  .blockRight {
    height: 48px;
  }
  .itemTitle {
    font-size: 14px;
    line-height: 20px;
  }
  .itemAmount {
    font-size: 21px;
    font-weight: 500;
    line-height: 29px;
  }

  &:nth-child(1) {
    background-image: url(https://img.hzanchu.com/acimg/14d695d442adc4528f76cfc42aa5b9af.png);
  }
  &:nth-child(2) {
    background-image: url(https://img.hzanchu.com/acimg/a048d7b3904dd32370b6ef0191369f32.png);
  }
  &:nth-child(3) {
    background-image: url(https://img.hzanchu.com/acimg/485d28c8e710595bd145ab1b527b19b9.png);
  }
  &:nth-child(4) {
    background-image: url(https://img.hzanchu.com/acimg/4f4c53a854da59c1871197ee44098198.png);
  }
  &:nth-child(5) {
    background-image: url(https://img.hzanchu.com/acimg/14d695d442adc4528f76cfc42aa5b9af.png);
  }
  &:nth-child(6) {
    background-image: url(https://img.hzanchu.com/acimg/a048d7b3904dd32370b6ef0191369f32.png);
  }
  &:nth-child(7) {
    background-image: url(https://img.hzanchu.com/acimg/485d28c8e710595bd145ab1b527b19b9.png);
  }
  &:nth-child(8) {
    background-image: url(https://img.hzanchu.com/acimg/4f4c53a854da59c1871197ee44098198.png);
  }
  &:nth-child(9) {
    background-image: url(https://img.hzanchu.com/acimg/14d695d442adc4528f76cfc42aa5b9af.png);
  }
  &:nth-child(10) {
    background-image: url(https://img.hzanchu.com/acimg/a048d7b3904dd32370b6ef0191369f32.png);
  }
  &:nth-child(11) {
    background-image: url(https://img.hzanchu.com/acimg/485d28c8e710595bd145ab1b527b19b9.png);
  }
  &:nth-child(12) {
    background-image: url(https://img.hzanchu.com/acimg/4f4c53a854da59c1871197ee44098198.png);
  }
}
</style>

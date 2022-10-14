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
    font-size: 14px !important ;
    line-height: 20px !important;
    margin-bottom: 0 !important;
  }
  .itemAmount {
    font-size: 21px !important ;
    font-weight: 500;
    line-height: 29px !important ;
  }

  &:nth-child(1) {
    background-image: url(https://img.hzanchu.com/acimg/14d695d442adc4528f76cfc42aa5b9af.png);
  }
  &:nth-child(2) {
    background-image: url(https://img.hzanchu.com/acimg/a048d7b3904dd32370b6ef0191369f32.png);
  }

  .itemTitle {
    font-size: 18px;
    margin-bottom: 22px;
  }
  .itemAmount {
    font-size: 36px;
  }
}
</style>

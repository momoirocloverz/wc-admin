<template>
  <div class="detailCon1">
    <Common :data="data" :showAddon="showAddon" :tableData="tableData" />
  </div>
</template>
<script>
import Common from './common.vue';
export default {
  components: {
    Common,
  },
  name: 'applicaCon',
  props: {
    data: {},
    tableData: {},
    showAddon:false,
  },
  data() {
    return {
      info: {},
    };
  },
  mounted() {
    this.info = this.data;
  },
};
</script>
<style scoped lang="scss">
.detailCon1 {
  background-color: #fff;
}
</style>

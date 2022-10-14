<template>
  <div class="develop_wrap realizationa_assets">
    即将开放，敬请期待...
  </div>
</template>

<script>
export default {
     mounted() {
    this.destroy();
  },
  methods: {
    destroy() {
      sessionStorage.removeItem("isRefresh");
      sessionStorage.removeItem("childRouterQuery");
    }
  },
}
</script>

<style scoped lang="">

</style>

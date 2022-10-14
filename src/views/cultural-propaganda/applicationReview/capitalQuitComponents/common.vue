<template>
  <div>
    <div class="commonCon1">
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="企业名称">{{ info.original_major_name }}</el-descriptions-item>
        <el-descriptions-item label="村镇" v-if="showAddon">{{ info.town_name + info.village_name }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ info.created_at }}</el-descriptions-item>
        <el-descriptions-item label="分配方案">
          <template v-for="(item, index) in info.list">
            <div :key="index" @click="popItem(item)" class="itemBody">
              <i class="el-icon-paperclip"></i>
              <span> {{ item.name }} </span>
            </div>
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- height="200" -->
    <el-table :data="tableData">
      <el-table-column prop="farmer_name" label="结对低收入农户" align="center"> </el-table-column>
      <el-table-column prop="target_major_name" label="移交中蜂企业" align="center"> </el-table-column>
      <el-table-column prop="town_name" v-if="showAddon" label="乡镇" align="center"></el-table-column>
      <el-table-column label="村名" prop="village_name" v-if="showAddon" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'applicaCon',
  props: {
    data: {},
    showAddon: true,
    tableData: {},
  },
  data() {
    return {
      info: {},
    };
  },
  mounted() {
    this.info = this.data;
  },
  methods: {
    popItem(item) {
      window.open(item.url, '_blank');
    },
  },
};
</script>
<style scoped lang="scss">
.commonCon1 {
  background-color: #fff;
  .itemBody {
    cursor: pointer;
    color: #2200ab;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

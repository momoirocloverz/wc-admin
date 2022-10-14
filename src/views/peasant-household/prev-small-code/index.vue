<template>
  <div class="house-code">
    <div class="basic-header">
      <span class="house-title">关键字：</span>
      <el-input type="text"
                placeholder="请输入要搜素的关键字"
                v-model="search.keyWord"
                class="house-ipt"></el-input>
      <el-select v-model="search.type"
                 placeholder="请选择类型"
                 class="basic-select">
        <el-option v-for="item in typeInfo"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="search.town"
                 placeholder="请选择乡镇"
                 class="basic-select"
                 @change="changeTownInfo">
        <el-option v-for="item in town_list"
                   :key="item.id"
                   :label="item.town_name"
                   :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="search.village"
                 placeholder="请选择行政村"
                 class="basic-select">
        <el-option v-for="item in village_list"
                   :key="item.id"
                   :label="item.village_name"
                   :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary"
                 @click="searchInfoma">搜索</el-button>
      <el-button
                 class="marginLeft"
                 @click="$router.go(-1)">返回</el-button>
    </div>
    <ul class="code-list">
      <template v-for="( item,index ) in codeList">
        <img class="code-info"
             :src="item.xkm_image"
             :key="index">
      </template>
    </ul>
    <el-pagination @current-change="handleCurrentChange"
                   :current-page.sync="page"
                   :page-size="pageSize"
                   layout="prev, pager, next, jumper"
                   :total="total"
                   class="pagination-info"></el-pagination>
  </div>
</template>
<script>
import { ListCode } from '@/api/smallCode';
import { TownInfo, VillageInfo } from "@/api/common";
export default {
  name: "householdCode",
  data () {
    return {
      search: {
        keyWord: "",
        type: "",
        town: '',
        village: ''
      },
      typeInfo: [
        {
          value: 1,
          label: '低保救助(低保)'
        },
        {
          value: 2,
          label: '低保边缘救助(低边)'
        },
        {
          value: 3,
          label: '特困救助(五保)'
        },
        {
          value: 4,
          label: '残疾人'
        }
      ],
      town_list: [],
      village_list: [],
      page: 1,
      pageSize: 21,
      codeList: [],
      total: 0
    };
  },
  created () {
    this.getTownListInfo();
    this.getListInfo();
  },
  methods: {
    // 搜索
    searchInfoma () {
      this.page = 1;
      this.getListInfo();
    },
    getListInfo () {
      let data = {
        page: this.page,
        page_size: this.pageSize,
        keyword: this.search.keyWord,
        lb: this.search.type,
        town_id: this.search.town,
        village_id: this.search.village
      };
      ListCode(data).then(res => {
        if (res.code == 0) {
          this.codeList = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    handleCurrentChange (e) {
      this.page = e;
      this.getListInfo();
    },
    changeTownInfo (e) {
      this.getVillageListInfo(e);
    },
    // 获取城镇信息
    getTownListInfo () {
      TownInfo().then((res) => {
        if (res.code === 0) {
          this.town_list = res.data;
        }
      });
    },
    // 获取行政村信息
    getVillageListInfo (town_id) {
      let data = {
        town_id,
      };
      VillageInfo(data).then((res) => {
        if (res.code == 0) {
          this.village_list = res.data;
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.house-code {
  width: 98%;
  margin: 15px 0px 0px 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .basic-header {
    width: 95%;
    margin: 30px auto 0px auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 10px;
    .house-title {
      color: #333;
      font-size: 15px;
    }
  }
}
.basic-select {
  margin-right: 20px;
}
.house-ipt {
  width: 204px;
  margin-right: 20px;
}
.code-list {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .code-info {
    width: 32%;
    margin-bottom: 20px;
  }
}
.pagination-info {
  width: 94%;
  margin: 10px 3%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.marginLeft {
  margin-left: 80px;
}
</style>
<style lang="scss" scoped>
.basic-select {
  .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
  .el-input__suffix {
    top: 3px;
  }
}
.el-select .el-input .el-select__caret.is-reverse {
  margin-top: -4px;
}
</style>

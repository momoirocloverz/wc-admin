<template>
  <el-dialog :visible="dialogData.visible"
             class="setMiddleDialog manyExport"
             :width="dialogData.width"
             :title="dialogData.title"
             @close="closeDialog">
    <div class="export-dialog"
         v-show="dialogData.status==1">
      <div class="export-dialog-header">
        <el-select v-model="town"
                   placeholder="请选择搜索的乡镇">
          <el-option v-for="item in town_list"
                     :key="item.id"
                     :label="item.town_name"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="village"
                   placeholder="请选择要搜索的行政村"
                   class="export-left">
          <el-option v-for="item in village_list"
                     :key="item.id"
                     :label="item.village_name"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="sendStatus"
                   placeholder="请选择发放状态"
                   class="export-left">
          <el-option v-for="item in sendList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-input type="text"
                  placeholder="请输入姓名或户号"
                  class="export-left"
                  v-model="keyword" />
        <el-button type="primary"
                   class="export-left-info"
                   @click="searchAction">搜索</el-button>
        <el-button type="primary"
                   class="export-left-info"
                   @click="exportExcelPrev">导出名单预览</el-button>
      </div>
      <el-table :data="exportData"
                max-height="400"
                ref="multipleTable"
                key="111"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                class="export-table">
        <el-table-column type="selection"
                         fixed="left"
                         width="55"></el-table-column>
        <el-table-column label="编号"
                         prop="ID"></el-table-column>
        <el-table-column label="人员类别"
                         prop="lb_name"
                         width="150"
                         align="center"></el-table-column>
        <el-table-column label="关系"
                         prop="GX"
                         align="center"></el-table-column>
        <el-table-column label="户号"
                         prop="HBH"
                         width="150"
                         align="center"></el-table-column>
        <el-table-column label="姓名"
                         prop="TName"
                         align="center"></el-table-column>
        <el-table-column label="性别"
                         prop="SEX"
                         align="center"></el-table-column>
        <el-table-column label="身份证号"
                         prop="Card"
                         width="200"
                         align="center"></el-table-column>
        <el-table-column label="保障人数"
                         prop="BZRS"
                         align="center"></el-table-column>
        <el-table-column label="乡镇"
                         prop="town_name"
                         align="center"></el-table-column>
        <el-table-column label="行政村"
                         prop="village_name"
                         width="100"
                         align="center"></el-table-column>
        <el-table-column label="状态"
                         prop="ZT"
                         align="center">
          <template slot-scope="scope">
            <span>{{
            scope.row.ZT == 1
              ? "未脱贫"
              : scope.row.ZT == 2
              ? "已脱贫"
              : "已注销"
          }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发放"
                         prop="IS_PROVIDE"
                         align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.IS_PROVIDE == 0 ? "未发放" : "已发放" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发放时间"
                         prop="provide_at"
                         width="160"
                         align="center"></el-table-column>
        <el-table-column label="发放次数"
                         prop="PROVIDE_NUM"
                         align="center"></el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange"
                     :current-page.sync="page"
                     :page-size="pageSize"
                     layout="prev, pager, next, jumper"
                     :total="total"
                     class="pagination-info"></el-pagination>
    </div>
    <!-- 状态2 -->
    <div class="export-prev"
         v-show="dialogData.status==2">
      <el-table :data="prevData" key="222"
                max-height="400">
        <el-table-column label="选择"
                         fixed="left"
                         align="center">
          <template slot-scope="scope">
            <span class="prev-delete"
                  @click="deleteCurrent(scope)">[<em>删除</em>]</span>
          </template>
        </el-table-column>
        <el-table-column label="编号"
                         prop="ID"
                         width="70"></el-table-column>
        <el-table-column label="人员类别"
                         prop="lb_name"
                         align="center"
                         width="120"></el-table-column>
        <el-table-column label="关系"
                         prop="GX"
                         align="center"></el-table-column>
        <el-table-column label="户号"
                         prop="HH"
                         align="center"
                         width="150"></el-table-column>
        <el-table-column label="姓名"
                         prop="name"
                         align="center"></el-table-column>
        <el-table-column label="性别"
                         prop="SEX"
                         align="center"></el-table-column>
        <el-table-column label="身份证号"
                         prop="idCard"
                         align="center"
                         width="150"></el-table-column>
        <el-table-column label="保障人数"
                         prop="BZRS"
                         align="center"></el-table-column>
        <el-table-column label="乡镇"
                         prop="town"
                         align="center"></el-table-column>
        <el-table-column label="行政村"
                         prop="village"
                         align="center"
                         width="120"></el-table-column>
        <el-table-column label="状态"
                         prop="ZT"
                         align="center"></el-table-column>
        <el-table-column label="发放"
                         prop="FF"
                         align="center"></el-table-column>
        <el-table-column label="发放时间"
                         prop="FFTime"
                         align="center"
                         width="160"></el-table-column>
        <el-table-column label="发放次数"
                         prop="FFCount"
                         align="center"></el-table-column>
      </el-table>
      <div class="again-add">
        <el-button @click="aginAddExport">继续添加</el-button>
      </div>
    </div>
    <div class="export-button">
      <el-button type="primary"
                 @click="confirmAction">确定导出</el-button>
      <el-button @click="cancelOption">取消操作</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { TownInfo, VillageInfo } from "@/api/common";
import _ from 'lodash'
import { ListCode } from "@/api/smallCode";
export default {
  name: "manyexport",
  props: ["dialogData"],
  data () {
    return {
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      town: "",
      village: "",
      sendStatus: "",
      sendList: [
        {
          label: "已发放",
          value: 1,
        },
        {
          label: "未发放",
          value: 0,
        },
      ],
      multipleSelection: [],
      oneDimensionMultipleSelection: [],
      exportData: [],
      prevData: [],
      town_list: [],
      village_list: [],
      keyword: ''
    };
  },
  created () {
    this.getSmallCodeList();
    this.getTownListInfo();
  },
  methods: {
    // 获取城镇信息
    getTownListInfo () {
      TownInfo().then((res) => {
        if (res.code === 0) {
          this.town_list = res.data;
        }
      });
    },
    getSmallCodeList () {
      this.loading = true;
      let data = {
        page: this.page,
        page_size: this.pageSize,
        town_id: this.town ? this.town : undefined,
        village_id: this.village ? this.village : undefined,
        is_provide: this.send_status,
        keyword: this.keyword,
      };
      ListCode(data).then((res) => {
        this.exportData = res.data.data;
        this.total = res.data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    forPageList (e) {
      this.loading = true;
      let data = {
        page: this.page,
        page_size: this.pageSize,
        town_id: this.town ? this.town : undefined,
        village_id: this.village ? this.village : undefined,
        is_provide: this.send_status,
        keyword: this.keyword,
      };
      ListCode(data).then((res) => {
        this.exportData = res.data.data;
        this.total = res.data.total;
        if (e) {
          const track = _.cloneDeep(this.multipleSelection)
          if (track[e - 1]) {
            track[e - 1].forEach(row => {
              const findIndex = this.exportData.findIndex(ele => {
                return ele.ID == row.ID
              })
              setTimeout(() => {
                this.$refs.multipleTable.toggleRowSelection(this.exportData[findIndex]);
              }, 0);
            });
          }
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    deleteCurrent (scope) {
      console.log(scope.row)
      this.prevData.splice(scope.$index, 1)
      const temp = _.cloneDeep(this.oneDimensionMultipleSelection.filter(ele => {
        return ele
      }));
      this.oneDimensionMultipleSelection = temp
      let simpleIndex = temp.findIndex((ele, index) => {
        console.log(ele.ID, index)
        return ele.ID == scope.row.ID
      })
      this.oneDimensionMultipleSelection.splice(simpleIndex, 1)
      console.log(this.multipleSelection)
      const track = _.cloneDeep(this.multipleSelection)
      const afterEmpty = track.map(ele => {
        if (ele) {
          return ele
        } else {
          return []
        }
      })
      console.log(afterEmpty)
      console.log(this.oneDimensionMultipleSelection)
      let outerBridge;
      let outerIndex = afterEmpty.findIndex(ele => {
        console.log('ele', ele)
        let innerIndex = ele.findIndex(sub => {
          console.log('sub', sub)
          return sub.ID == scope.row.ID
        })
        console.log('innerIndex', innerIndex)
        if (innerIndex > -1) {
          outerBridge = innerIndex
        }
        return innerIndex > -1
      })
      afterEmpty[outerIndex].splice(outerBridge, 1)
      const afterClean = _.cloneDeep(afterEmpty)
      this.multipleSelection = afterClean
      this.$forceUpdate()      
      this.forPageList(this.page);
    },
    aginAddExport () {
      this.$emit('aginAdd');
      this.$forceUpdate()
    },
    handleCurrentChange (e) {
      this.page = e;
      this.forPageList(e);
    },
    closeDialog () {
      this.$emit('close')
    },
    searchAction () {
      this.getSmallCodeList()
    },
    // 导出预览
    exportExcelPrev () {
      const track = _.cloneDeep(this.multipleSelection)
      const afterEmpty = track.map(ele => {
        if (ele) {
          return ele
        } else {
          return []
        }
      })
      console.log(afterEmpty)
      const newGuy = afterEmpty.reduce(function (a, b) {
        return a.concat(b)
      }, [])
      this.oneDimensionMultipleSelection = _.cloneDeep(newGuy);
      this.prevData = _.cloneDeep(newGuy);
      console.log('newGuy', newGuy)
      this.$emit('exportPrev');
    },
    // 选择
    handleSelectionChange (val) {
      this.multipleSelection[this.page - 1] = val
    },
    confirmAction () {
      const track = _.cloneDeep(this.multipleSelection)
      const afterEmpty = track.map(ele => {
        if (ele) {
          return ele
        } else {
          return []
        }
      })
      const newGuy = afterEmpty.reduce(function (a, b) {
        return a.concat(b)
      }, [])
      this.oneDimensionMultipleSelection = _.cloneDeep(newGuy);      
      this.$emit( 'confirmExport',this.oneDimensionMultipleSelection )
    },
    cancelOption () {
      this.$emit('cancelExport');
    }
  },
};
</script>
<style lang="scss" scoped>
.export-left {
  width: 190px;
  margin-left: 10px;
}
.export-left-info {
  margin-left: 10px;
}
.export-dialog {
  display: flex;
  flex-direction: column;
  .export-dialog-header {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .export-table {
    margin-top: 20px;
  }
}
.pagination-info {
  width: 98%;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.export-button {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
}
.export-prev {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.prev-delete {
  color: #409eff;
  cursor: pointer;
  em {
    font-style: normal;
  }
}
.again-add {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 20px 0px;
}
</style>
<style lang="scss" >
.manyExport {
  .el-dialog {
    height: 700px;
  }
}
</style>
<template>
  <div class="outer"
       v-loading="loading">
    <div class="top">
      <div class="backBtnCon">
        <el-button size="small"
                   @click="goBack">返回</el-button>
      </div>
      <div class="topMain">
        <div class="progressCon">
          <template v-for="(item,index) in threeLinesList">
            <div class="progressLine"
                 :class="[ item.status ]"
                 :key="index"></div>
          </template>
        </div>
        <div class="steps">
          <div class="item"
               v-for="(item) in fourItemList"
               :key="item.id">
            <img :src="item.status_img">
            <p>{{item.status_name}}</p>
            <p>{{item.type}}</p>
            <div class="content">
              <div class="contentItemCon"><label>操作人：</label><span>{{item.handlers | emptyFilter}}</span></div>
              <div class="contentItemCon"><label>时 间：</label><span>{{item.time| emptyFilter}}</span></div>
              <div class="contentItemCon"><label>备 注：</label>
                <div class="remark"
                     :class="[ item.dynamicText == '收起' ? 'noHideLine'  : '' ]">{{item.remark | emptyFilter}}</div>
                <span class="expandTag"
                      v-if="item.remark&&item.remark.length > 30"
                      @click="expandCurrent(item)"><span class="ellipsisMark"
                        v-show="item.dynamicText == '收起' ? false  : true ">...</span>{{ item.dynamicText}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"
         :class="[ justForCheck ? 'setFlexStart' : '' ]">
      <div class="base-info boxCommon box">
        <div class="header">详细信息<span></span></div>
        <p><span>所属乡镇</span>{{globalData.town_name}}</p>
        <p><span>所属村名</span>{{globalData.village_name}}</p>
        <p><span>农户类型</span>{{globalData.type}}</p>
        <p><span>手否低收入农户</span>{{globalData.low_income}}</p>
        <p><span>状态</span>{{globalData.is_register}}</p>
        <p><span>户主姓名</span>{{globalData.head_name}}</p>
        <p><span>户主电话</span>{{globalData.head_contact}}</p>
        <p><span>户主身份证号</span>{{globalData.head_card}}</p>
        <p><span>子女姓名</span>{{globalData.children_name}}</p>
        <p><span>子女身份证号</span>{{globalData.children_card}}</p>
        <p><span>关系</span>{{globalData.relation}}</p>
        <p><span>就读院校</span>{{globalData.college_name}}</p>
        <p><span>院校类型</span>{{globalData.college_type}}</p>
        <p><span>申请日期</span>{{globalData.apply_at}}</p>
      </div>
      <div class="prove box boxMiddle "
           :class="[ justForCheck ? 'boxMiddleMarginLeft':'' ]">
        <div class="header">证明材料<span></span></div>
        <div class="item">
          <div class="img-de">
            <p>低收入农户户主户口本</p>
            <img @click="()=>show(0,globalData.hkb_hz_img)"
                 :src="globalData.hkb_hz_img">
          </div>
          <div class="img-de">
            <p>户主身份证</p>
            <div>
              <template v-for="( item,index ) in idList">
                <img @click="()=>show(index,idList)"
                     :key="index"
                     :src="item.src">
              </template>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="img-de">
            <p>低收入农户子女户口本</p>
            <img @click="()=>show(0,globalData.hkb_zn_img)"
                 :src="globalData.hkb_zn_img">
          </div>
          <div class="img-de">
            <p>子女身份证</p>
            <div>
              <template v-for="( item,index ) in children1List">
                <img @click="()=>show(index,children1List)"
                     :key="index"
                     :src="item.src">
              </template>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="img-de">
            <p>子女高等职业院校就读证明</p>
            <img @click="()=>show(0,globalData.zv_jdzm_img)"
                 :src="globalData.zv_jdzm_img">
          </div>
          <div class="img-de">
            <p>子女社保卡</p>
            <div>
              <template v-for="( item,index ) in children2List">
                <img @click="()=>show(index,children2List)"
                     :key="index"
                     :src="item.src">
              </template>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="img-de">
            <p>信息真实性书面承诺</p>
            <img @click="()=>show(0,globalData.smcn_img)"
                 :src="globalData.smcn_img">
          </div>
        </div>
      </div>
      <div class="handle boxCommon box"
           v-if="!justForCheck">
        <!-- <div class="header">{{ afterEdit ? '审批结果' :'审批操作'}}<span></span></div> -->
        <div class="header">审批操作<span></span></div>
        <el-radio-group v-model="radio"
                        style="margin-top: 20px;">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">拒绝</el-radio>
        </el-radio-group>
        <!-- <div class="resultMap"
             v-else>{{ resultMap[radio] }}</div> -->
        <el-input type="textarea"
                  :rows="16"
                  resize="none"
                  maxlength="200"
                  placeholder="备注（审批不通过时必填，不超过200字）"
                  style="margin-top:20px;"
                  v-model.trim="content">
        </el-input>
        <el-button size="medium"
                   type="primary"
                   style="margin-top:20px;"
                   @click="submit">提 交</el-button>
        <!-- <el-button v-else
                   size="medium"
                   type="primary"
                   style="margin-top:20px;"
                   @click="goBack">返 回</el-button> -->
      </div>
    </div>
    <div class="confirmBtnCon"
         v-if="justForCheck">
      <el-button type="primary"
                 @click="goBack">确定</el-button>
    </div>
    <viewer :images="images"
            :options="options"
            @inited="inited"
            class="viewer"
            ref="viewer"
            v-show=" false">
      <img v-for="(src,index) in images"
           :src="src"
           :key="index">
    </viewer>
  </div>
</template>
<script>
import { PlanInfo, PlanAudit } from '@/api/rain'
export default {
  name: "approvalprogress",
  data () {
    return {
      loading: false,
      options: {
        initialViewIndex: 0,
      },
      fakeImg: 'https://cn.bing.com/th?id=OHR.ShikisaiBiei_ZH-CN9063139813_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp',
      images: [],
      fourItemList: [],
      threeLinesList: [
        {
          status: 'grey'
        },
        {
          status: 'grey'
        },
        {
          status: 'grey'
        },
      ],
      radio: 1,
      content: '',
      justForCheck: false,
      afterEdit: false,
      resultMap: {
        1: '通过',
        2: '拒绝'
      },
      globalData: {},
      idList: [],
      children2List: [],
      children1List: [],
    }
  },
  filters: {
    emptyFilter (val) {
      if (val) {
        return val
      } else {
        return '无'
      }
    }
  },
  created () {
    this.initCurrentData()
  },
  beforeDestroy () {
    sessionStorage.removeItem('afterFlag', 'temp')
  },
  methods: {
    initCurrentData () {
      const afterFlag = sessionStorage.getItem('afterFlag');
      if (afterFlag) {
        this.justForCheck = true
      } else {
        this.justForCheck = this.$route.query.justForCheck == 'true'
      }
      this.loading = true
      const Kabel = {
        id: this.$route.query.ID
      }
      PlanInfo(Kabel).then(res => {
        if (res.code === 0) {
          this.globalData = res.data
          this.idList = [
            { src: this.globalData.hz_card_zm_img },
            { src: this.globalData.hz_card_fm_img },
          ]
          this.children1List = [
            { src: this.globalData.zv_card_zm_img },
            { src: this.globalData.zv_card_fm_img },
          ]
          this.children2List = [
            { src: this.globalData.zv_sb_zm_img },
            { src: this.globalData.zv_sb_fm_img },
          ]
          const statusImg = {
            0: 'https://img.hzanchu.com/acimg/fe729b0323bb31883c8b0569ee3bc8bc.png?x-oss-process=image/resize,l_300',
            2: 'https://img.hzanchu.com/acimg/dafa09d9efc2676ec9f8f9074e1f280f.png?x-oss-process=image/resize,l_300',
            3: 'https://img.hzanchu.com/acimg/89bb7fc898710ae15f361d956bead76d.png?x-oss-process=image/resize,l_300'
          }
          const statusNameMap = {
            0: '待审核',
            2: '已通过',
            3: '已拒绝',
          }
          this.fourItemList = [
            {
              status: this.globalData.village_audit,
              remark: this.globalData.village_comment,
              dynamicText: '展开',
              status_img: statusImg[this.globalData.village_audit],
              status_name: statusNameMap[this.globalData.village_audit],
              type: '村级审核',
              handlers: this.globalData.village_name ? `${this.globalData.village_name}管理员` : '',
              time: this.globalData.village_operate_date
            },
            {
              status: this.globalData.town_audit,
              remark: this.globalData.town_comment,
              dynamicText: '展开',
              status_img: statusImg[this.globalData.town_audit],
              status_name: statusNameMap[this.globalData.town_audit],
              type: '镇级审核',
              handlers: this.globalData.town_name ? `${this.globalData.town_name}管理员` : '',
              time: this.globalData.town_operate_date
            },
            {
              status: this.globalData.edu_audit,
              remark: this.globalData.edu_comment,
              dynamicText: '展开',
              status_img: statusImg[this.globalData.edu_audit],
              status_name: statusNameMap[this.globalData.edu_audit],
              type: '教育局审核',
              handlers: this.globalData.edu_name ? `${this.globalData.edu_name}管理员` : '',
              time: this.globalData.edu_operate_date
            },
            {
              status: this.globalData.farm_audit,
              remark: this.globalData.farm_comment,
              dynamicText: '展开',
              status_img: statusImg[this.globalData.farm_audit],
              status_name: statusNameMap[this.globalData.farm_audit],
              type: '农业农村局审核',
              handlers: this.globalData.farm_name ? `${this.globalData.farm_name}管理员` : '',
              time: this.globalData.farm_operate_date
            },
          ];
          this.statusAnalyse()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      }).finally(() => {
        this.loading = false
      })
    },
    statusAnalyse () {
      if (this.fourItemList[0].status === 0) {
        this.threeLinesList = [
          {
            status: 'grey'
          },
          {
            status: 'grey'
          },
          {
            status: 'grey'
          },
        ];
      } else if (this.fourItemList[0].status === 2) {
        if (this.fourItemList[1].status === 0) {
          this.threeLinesList = [
            {
              status: 'grey'
            },
            {
              status: 'grey'
            },
            {
              status: 'grey'
            },
          ];
        } else if (this.fourItemList[1].status === 2) {
          if (this.fourItemList[2].status === 0) {
            this.threeLinesList = [
              {
                status: 'passLine'
              },
              {
                status: 'grey'
              },
              {
                status: 'grey'
              },
            ];
          } else if (this.fourItemList[2].status === 2) {
            if (this.fourItemList[3].status === 0) {
              this.threeLinesList = [
                {
                  status: 'passLine'
                },
                {
                  status: 'passLine'
                },
                {
                  status: 'grey'
                },
              ];
            } else if (this.fourItemList[3].status === 2) {
              this.threeLinesList = [
                {
                  status: 'passLine'
                },
                {
                  status: 'passLine'
                },
                {
                  status: 'passLine'
                },
              ];
            } else if (this.fourItemList[3].status === 3) {
              this.threeLinesList = [
                {
                  status: 'passLine'
                },
                {
                  status: 'passLine'
                },
                {
                  status: 'notPassLine'
                },
              ];
            }
          } else if (this.fourItemList[2].status === 3) {
            this.threeLinesList = [
              {
                status: 'passLine'
              },
              {
                status: 'notPassLine'
              },
              {
                status: 'grey'
              },
            ];
          }
        } else if (this.fourItemList[1].status === 3) {
          this.threeLinesList = [
            {
              status: 'notPassLine'
            },
            {
              status: 'grey'
            },
            {
              status: 'grey'
            },
          ];
        }
      } else if (this.fourItemList[0].status === 3) {
        this.threeLinesList = [
          {
            status: 'grey'
          },
          {
            status: 'grey'
          },
          {
            status: 'grey'
          },
        ];
      }
    },
    inited (viewer) {
      this.$viewer = viewer
    },
    show (index, item) {
      this.options.initialViewIndex = index
      if (typeof item == 'object') {
        this.images = item.map(ele => {
          return ele.src
        })
      } else {
        this.images = [item]
      }
      setTimeout(() => {
        this.$viewer.show()
      }, 400)
    },
    submit () {
      if (this.radio === 2 && !this.content) {
        return this.$message.error('请填写备注');
      }
      const shaoKahn = {
        id: this.globalData.id,
        audit_status: this.radio === 2 ? '3' : '2',
        comment: this.content
      }
      PlanAudit(shaoKahn).then(res => {
        if (res.code === 0) {
          this.$message.success('提交成功')
          sessionStorage.setItem('afterFlag', 'temp')
          this.initCurrentData()
          this.afterEdit = true
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    expandCurrent (item) {
      if (item.dynamicText == '展开') {
        item.dynamicText = '收起'
      } else {
        item.dynamicText = '展开'
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.outer {
  overflow: hidden;
  background: #f3f6f9;
  padding: 20px;
}
.top {
  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 50px;
  background: #fff;
  overflow: hidden;
  margin-bottom: 20px;
}
.resultMap {
  margin-top: 20px;
  color: #333;
  font-size: 14px;
}
.topMain {
  position: relative;
  box-sizing: border-box;
  width: 1273px;
  margin: 0 auto;
}
.setFlexStart {
  justify-content: flex-start !important;
}
.backBtnCon {
  display: flex;
  justify-content: flex-end;
}
.noHideLine {
  -webkit-line-clamp: 1000 !important;
  height: auto !important;
}
.remark {
  height: 72px;
  width: 200px;
  overflow: hidden;
  font-size: 14px;
  color: #333;
  line-height: 18px;
}
.progressCon {
  position: absolute;
  left: 194px;
  top: 43px;
  width: 900px;
  height: 1px;
  display: flex;
  justify-content: space-between;
}
.progressLine {
  height: 6px;
  background: #dcdcdc;
  width: 260px;
}
.passLine {
  background: #3178d0;
}
.notPassLine {
  background: #e48b8b;
}
.steps {
  display: flex;
  justify-content: space-between;
  .item {
    overflow: hidden;
    text-align: center;
    width: 302px;
    position: relative;
    img {
      width: 90px;
      height: 90px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    p:nth-of-type(1) {
      font-size: 20px;
      color: #333;
      font-weight: 600;
      margin-top: 104px;
    }
    p:nth-of-type(2) {
      font-size: 16px;
      color: #333;
      margin-top: 14px;
    }
    .content {
      width: 300px;
      overflow: hidden;
      box-sizing: border-box;
      padding: 10px 16px 16px;
      margin-top: 14px;
      border: 1px solid #e5e5e5;
      text-align: left;
      .contentItemCon {
        position: relative;
        margin-top: 6px;
        display: flex;
        align-items: flex-start;
        .expandTag {
          background-color: #fff;
          position: absolute;
          color: #3178d0;
          right: -4px;
          bottom: 0;
          font-size: 14px;
          cursor: pointer;
          .ellipsisMark {
            position: absolute;
            left: -12px;
            background-color: #fff;
            bottom: 0;
          }
        }
        label {
          color: #999;
          font-size: 14px;
          line-height: 18px;
        }
        span {
          font-size: 14px;
          color: #333;
          display: block;
          line-height: 18px;
          flex: 1;
        }
      }
    }
  }
}
.confirmBtnCon {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.bottom {
  display: flex;
  justify-content: space-between;
  .boxCommon {
    width: 30% !important;
  }
  .boxMiddle {
    width: 37% !important;
  }
  .boxMiddleMarginLeft {
    margin-left: 20px !important;
  }
  .box {
    background: #fff;
    padding: 0 30px;
    width: 440px;
    height: 670px;
    .header {
      font-size: 16px;
      color: #333;
      font-weight: 600;
      margin-top: 26px;
      span {
        display: block;
        width: 65px;
        height: 4px;
        background: #3178d0;
        margin-top: 6px;
      }
    }
    p {
      line-height: 16px;
      margin-top: 20px;
      color: #333;
      font-size: 14px;
      span {
        color: #999999;
        width: 200px;
        display: inline-block;
      }
    }
  }
  .prove {
    .item {
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      .img-de {
        width: 50%;
        img {
          width: 80px;
          height: 80px;
          margin-top: 20px;
          cursor: pointer;
        }
        img:nth-of-type(2) {
          margin-left: 16px;
        }
      }
      //   .img-de:nth-of-type(1) {
      //     width: 180px;
      //   }
    }
  }
}
</style>
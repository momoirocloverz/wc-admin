<template>
  <div class="selfForm">
    <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="80px" class="demo-ruleForm">
      <div class="flexStart">
        <div class="mainTitle">基础分项</div>
        <div class="flexStart ml20">
          <div>自评分数：</div>
          <div>100分</div>
        </div>
        <div class="flexStart ml20">
          <div>评分：</div>
          <div>{{ count1 + count2 + count3 + count4 + count5 + count6 }}分</div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="group">
        <div class="flexBetween countText mb30">
          <div class="">企业建设(20分)</div>
          <div class="pink">自评分数：{{ count1 }}分</div>
        </div>
        <div class="mb20 hint">1、合作社(家庭农场)、企业资格</div>
        <div>
          <el-checkbox-group v-model="checkList1" :disabled="clientDisable" @change="checkList1Change">
            <template v-for="(item, index) in afterData.step1 && afterData.step1[0].sub">
              <div :key="index">
                <el-checkbox class="mb10" :label="String(index)">{{ item.title }}</el-checkbox>
                <div class="mb10 pl20" v-if="item.option && item.option.length">
                  <template v-for="(third, thirdIndex) in item.option">
                    <div :key="thirdIndex">
                      <el-radio class="mb10" v-model="radio1" :label="String(third.point)" :disabled="clientDisable">{{ third.title }}</el-radio>
                    </div>
                  </template>
                </div>
                <div class="resetFontSize">
                  <div class="idListItem">
                    <template
                      v-for="(sub, subIndex) in item.upload &&
                      item.upload.map((ele) => {
                        return ele.url;
                      })"
                    >
                      <img
                        @click="
                          () =>
                            show(
                              subIndex,
                              item.upload &&
                                item.upload.map((ele) => {
                                  return ele.url;
                                }),
                            )
                        "
                        :key="subIndex"
                        :src="sub"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <!-- <el-checkbox class="mb10" label="0">取得县级龙头合作社(家庭农场)、企业资格(2分)</el-checkbox>
            <div class="resetFontSize">
              <div class="idListItem">
                <template v-for="(sub, subIndex) in idList">
                  <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
                </template>
              </div>
            </div>
            <el-checkbox class="mb10" label="1">加入998质量安全联盟实施主体(2分)</el-checkbox>
            <div class="resetFontSize">
              <div class="idListItem">
                <template v-for="(sub, subIndex) in idList">
                  <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
                </template>
              </div>
            </div>
            <el-checkbox class="mb10" label="2">取得省级龙头合作社(家庭农场、企业资格)(5分)</el-checkbox>
            <div class="resetFontSize">
              <div class="idListItem">
                <template v-for="(sub, subIndex) in emptyList">
                  <img @click="() => show(subIndex, emptyList)" :key="subIndex" :src="sub" />
                </template>
              </div>
            </div>
            <el-checkbox class="mb10" label="3">取得市级龙头合作社(家庭农场、企业资格)(8分)</el-checkbox>
            <div class="resetFontSize">
              <div class="idListItem">
                <template v-for="(sub, subIndex) in idList">
                  <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
                </template>
              </div>
            </div>
            <el-checkbox class="mb10" label="4">荣誉证书</el-checkbox>
            <div class="mb10">
              <div>
                <el-radio class="mb10" v-model="radio1" label="1" :disabled="clientDisable">县级(1分)</el-radio>
              </div>
              <div>
                <el-radio class="mb10" v-model="radio1" label="2" :disabled="clientDisable">市级(2分)</el-radio>
              </div>
              <div>
                <el-radio class="mb10" v-model="radio1" label="3" :disabled="clientDisable">省级(3分)</el-radio>
              </div>
            </div>
            <div class="resetFontSize">
              <div class="idListItem">
                <template v-for="(sub, subIndex) in idList">
                  <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
                </template>
              </div>
            </div> -->
          </el-checkbox-group>
          <el-form-item label="评分(分)" class="fakeRequired">
            <el-input-number v-model="newForm.point1" :disabled="backDisable" controls-position="right" @change="handleChange" :min="0" :max="20" :precision="0" placeholder="请输入"></el-input-number>
          </el-form-item>
        </div>
      </div>
      <div class="group">
        <el-divider></el-divider>
        <div class="flexBetween countText mb30">
          <div class="">养殖规模和年份(20分)</div>
          <div class="pink">自评分数：{{ count2 }}分</div>
        </div>
        <div class="mb20 hint">2、养殖规模</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step2 && afterData.step2[0].sub">
            <div :key="index">
              <el-radio class="mb10" v-model="radio2" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
            </div>
          </template>
          <!-- <div>
            <el-radio class="mb10" v-model="radio2" label="2" :disabled="clientDisable">100-199箱(2分)</el-radio>
          </div> -->
        </div>
        <div class="mb10 boxCount">具体箱数:{{ step2Input }}箱</div>
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point2" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
        <el-divider></el-divider>
        <div class="mb20 hint">3、养殖年份</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step2 && afterData.step2[1].sub">
            <div :key="index">
              <el-radio class="mb10" v-model="radio3" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
            </div>
          </template>
          <!-- <div><el-radio class="mb10" v-model="radio3" label="2" :disabled="clientDisable">2年(2分)</el-radio></div> -->
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step2 &&
              afterData.step2[1].sub &&
              afterData.step2[1].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step2[1].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- 
        <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point3" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
      <div class="group">
        <el-divider></el-divider>
        <div class="flexBetween countText mb30">
          <div class="">品牌和蜂蜜销量(20分)</div>
          <div class="pink">自评分数：{{ count3 }}分</div>
        </div>
        <div class="mb20 hint">4、品牌或商标</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step3 && afterData.step3[0].sub">
            <div :key="index">
              <el-radio class="mb10" v-model="radio4" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
            </div>
          </template>
          <!-- <div><el-radio class="mb10" v-model="radio4" label="0" :disabled="clientDisable">无(0分)</el-radio></div> -->
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step3 &&
              afterData.step3[0].sub &&
              afterData.step3[0].sub.find((ele) => {
                return ele.select;
              }) &&
              afterData.step3[0].sub.find((ele) => {
                return ele.select;
              }).upload &&
              afterData.step3[0].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step3[0].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point4" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
        <el-divider></el-divider>
        <div class="mb20 hint">5、蜂蜜销量</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step3 && afterData.step3[1].sub">
            <div :key="index">
              <el-radio class="mb10" v-model="radio5" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
            </div>
          </template>
          <!-- <div><el-radio class="mb10" v-model="radio5" label="0" :disabled="clientDisable">10万元以下(0分)</el-radio></div>         
          <div>
            <el-radio class="mb10" v-model="radio5" label="10" :disabled="clientDisable">100万以上(10分)</el-radio>
          </div> -->
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step3 &&
              afterData.step3[1].sub &&
              afterData.step3[1].sub.find((ele) => {
                return ele.select;
              }) &&
              afterData.step3[1].sub.find((ele) => {
                return ele.select;
              }).upload &&
              afterData.step3[1].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step3[1].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point5" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
      <div class="group">
        <el-divider></el-divider>
        <div class="flexBetween countText mb30">
          <div class="">扶贫帮扶经历(10分)</div>
          <div class="pink">自评分数：{{ count4 }}分</div>
        </div>
        <div class="mb20 hint">6、扶贫帮扶年限</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step4 && afterData.step4[0].sub">
            <div :key="index">
              <el-radio class="mb10" v-model="radio6" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
            </div>
          </template>
          <!-- <div><el-radio class="mb10" v-model="radio6" label="0" :disabled="clientDisable">1年以下(0分)</el-radio></div>
          <div><el-radio class="mb10" v-model="radio6" label="10" :disabled="clientDisable">5年以上(10分)</el-radio></div> -->
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step4 &&
              afterData.step4[0].sub &&
              afterData.step4[0].sub.find((ele) => {
                return ele.select;
              }) &&
              afterData.step4[0].sub.find((ele) => {
                return ele.select;
              }).upload &&
              afterData.step4[0].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step4[0].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point6" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
      <div class="group">
        <el-divider></el-divider>
        <div class="flexBetween countText mb30">
          <div class="">养殖台账和健康证(15分)</div>
          <div class="pink">自评分数：{{ count5 }}分</div>
        </div>
        <div class="mb20 hint">7、规范填写养殖台账</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step5 && afterData.step5[0].sub">
            <el-radio :key="index" class="mb10" v-model="radio7" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
          </template>
          <!-- <el-radio class="mb10" v-model="radio7" label="0" :disabled="clientDisable">无(0分)</el-radio> -->
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step5 &&
              afterData.step5[0].sub &&
              afterData.step5[0].sub.find((ele) => {
                return ele.select;
              }) &&
              afterData.step5[0].sub.find((ele) => {
                return ele.select;
              }).upload &&
              afterData.step5[0].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step5[0].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point7" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
        <el-divider></el-divider>
        <div class="mb20 hint">8、健康证</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step5 && afterData.step5[1].sub">
            <el-radio :key="index" class="mb10" v-model="radio8" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
          </template>
          <!-- <el-radio class="mb10" v-model="radio8" label="0" :disabled="clientDisable">无(0分)</el-radio>
          <el-radio class="mb10" v-model="radio8" label="5" :disabled="clientDisable">有(5分)</el-radio> -->
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step5 &&
              afterData.step5[1].sub &&
              afterData.step5[1].sub.find((ele) => {
                return ele.select;
              }) &&
              afterData.step5[1].sub.find((ele) => {
                return ele.select;
              }).upload &&
              afterData.step5[1].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step5[1].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point8" controls-position="right" @change="handleChange" :min="0" :max="5" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
      <div class="group">
        <el-divider></el-divider>
        <div class="flexBetween countText mb30">
          <div class="">养殖保险(15分)</div>
          <div class="pink">自评分数：{{ count6 }}分</div>
        </div>
        <div class="mb20 hint">9、参加中蜂政策性养殖保险</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step6 && afterData.step6[0].sub">
            <el-radio :key="index" class="mb10" v-model="radio9" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
          </template>
          <!-- <el-radio class="mb10" v-model="radio9" label="0" :disabled="clientDisable">否(0分)</el-radio>     -->
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step6 &&
              afterData.step6[0].sub &&
              afterData.step6[0].sub.find((ele) => {
                return ele.select;
              }) &&
              afterData.step6[0].sub.find((ele) => {
                return ele.select;
              }).upload &&
              afterData.step6[0].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step6[0].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point9" controls-position="right" @change="handleChange" :min="0" :max="15" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
      <div class="flexStart">
        <div class="mainTitle">加分项</div>
        <div class="flexStart ml20">
          <div>自评分数：</div>
          <div>20分</div>
        </div>
        <div class="flexStart ml20">
          <div>评分：</div>
          <div>{{ count8 + count7 }}分</div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="group">
        <div class="flexBetween countText mb30">
          <div class="">雇佣低收入农户(10分)</div>
          <div class="pink">自评分数：{{ count7 }}分</div>
        </div>
        <div class="mb20 hint">10、雇佣低收入农户参与中蜂养殖</div>
        <div class="mb10">
          <template v-for="(item, index) in afterData.step7 && afterData.step7[0].sub">
            <div :key="index">
              <el-radio class="mb10" v-model="radio10" :label="String(item.point)" :disabled="clientDisable">{{ item.title }}</el-radio>
            </div>
          </template>
          <!-- <div>
            <el-radio class="mb10" v-model="radio10" label="0" :disabled="clientDisable">无(0分)</el-radio>
          </div>         
          <div>
            <el-radio class="mb10" v-model="radio10" label="10" :disabled="clientDisable">工资>=10000/年(10分)</el-radio>
          </div> -->
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step7 &&
              afterData.step7[0].sub &&
              afterData.step7[0].sub.find((ele) => {
                return ele.select;
              }) &&
              afterData.step7[0].sub.find((ele) => {
                return ele.select;
              }).upload &&
              afterData.step7[0].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step7[0].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point10" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
      <div class="group">
        <el-divider></el-divider>
        <div class="flexBetween countText mb30">
          <div class="">增加低收入农户收益(10分)</div>
          <div class="pink">自评分数：{{ count8 }}分</div>
        </div>
        <div class="mb20 hint">11、低收入农户和村集体保底收益</div>
        <div class="mb10 boxCount">
          <div>保底收益:{{ afterData.step8 && afterData.step8[0].sub && afterData.step8[0].sub.length && afterData.step8[0].sub[0].input }}元</div>
        </div>
        <div class="resetFontSize">
          <div class="idListItem">
            <template
              v-for="(sub, subIndex) in afterData.step8 &&
              afterData.step8.length &&
              afterData.step8[0].sub &&
              afterData.step8[0].sub.length &&
              afterData.step8[0].sub.find((ele) => {
                return ele.select;
              }) &&
              afterData.step8[0].sub.find((ele) => {
                return ele.select;
              }).upload &&
              afterData.step8[0].sub
                .find((ele) => {
                  return ele.select;
                })
                .upload.map((ele) => {
                  return ele.url;
                })"
            >
              <img
                @click="
                  () =>
                    show(
                      subIndex,
                      afterData.step8[0].sub
                        .find((ele) => {
                          return ele.select;
                        })
                        .upload.map((ele) => {
                          return ele.url;
                        }),
                    )
                "
                :key="subIndex"
                :src="sub"
              />
            </template>
          </div>
        </div>
        <!-- <div class="resetFontSize">
          <div class="idListItem">
            <template v-for="(sub, subIndex) in idList">
              <img @click="() => show(subIndex, idList)" :key="subIndex" :src="sub" />
            </template>
          </div>
        </div> -->
        <div class="mb10 boxCount">
          <div>分数:{{ afterData.step8 && afterData.step8[0].sub && afterData.step8[0].sub.length && afterData.step8[0].sub[0].input1 }}分</div>
        </div>
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point11" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
      <div class="group">
        <el-divider></el-divider>
        <div class="flexBetween countText mb30">
          <div class="">主管单位布署的各项工作完成情况(10分)</div>
          <div class="pink"></div>
        </div>
        <div class="mb20 hint">12、主管单位布署的各项工作完成情况</div>
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point14" controls-position="right" @change="handleChange" :min="0" :max="10" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
      <div class="flexStart">
        <div class="mainTitle">减分项</div>
        <div class="flexStart ml20">
          <div>自评分数：</div>
          <div>10分</div>
        </div>
        <div class="flexStart ml20">
          <div>评分：</div>
          <div>{{ count9 + count10 }}分</div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="group">
        <div class="flexBetween countText mb30">
          <div class="">实时更新养殖信息(6分)</div>
          <div class="pink">自评分数：{{ count9 }}分</div>
        </div>
        <div class="mb20 hint">13、实时更新养殖信息</div>
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point12" controls-position="right" @change="handleChange" :min="0" :max="6" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
        <el-divider></el-divider>
        <div class="flexBetween countText mb30">
          <div class="">按时将蜂蜜收益支付给低收入农户(4分)</div>
          <div class="pink">自评分数：{{ count10 }}分</div>
        </div>
        <div class="mb20 hint">14、按时将蜂蜜收益支付给低收入农户</div>
        <el-form-item label="评分(分)" class="fakeRequired">
          <el-input-number v-model="newForm.point13" controls-position="right" @change="handleChange" :min="0" :max="4" :precision="0" placeholder="请输入" :disabled="backDisable"></el-input-number>
        </el-form-item>
      </div>
    </el-form>
    <viewer :images="images" :options="options" @inited="inited" class="viewer" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
  </div>
</template>
<script>
export default {
  name: 'selfForm',
  props: {
    fromClient: {},
    fromBack: {},
    clientDisable: true,
    backDisable: true,
  },
  data() {
    return {
      step2Input: 0,
      count1: 0,
      count2: 0,
      count3: 0,
      count4: 0,
      count5: 0,
      count6: 0,
      count7: 0,
      count8: 0,
      count9: 0,
      count10: 0,
      newForm: {
        point14: undefined,
        point13: undefined,
        point12: undefined,
        point11: undefined,
        point10: undefined,
        point9: undefined,
        point8: undefined,
        point7: undefined,
        point6: undefined,
        point5: undefined,
        point4: undefined,
        point3: undefined,
        point2: undefined,
        point1: undefined,
      },
      newRules: {},
      checkList1: [],
      options: {
        initialViewIndex: 0,
      },
      emptyList: [],
      radio1: '',
      radio2: '',
      radio3: '',
      radio4: '',
      radio5: '',
      radio6: '',
      radio7: '',
      radio8: '',
      radio9: '',
      radio10: '',
      idList: [],
      images: [],
      afterData: {},
    };
  },
  mounted() {
    this.parseData();
  },
  methods: {
    checkList1Change() {
      console.log(this.checkList1);
    },
    parseData() {
      setTimeout(() => {
        let eva_info = this.fromClient.eva_info;
        // eva_info = eva_info.replaceAll("'", '"');
        // this.afterData = JSON.parse(eva_info);
        this.afterData = eva_info;
        if (this.afterData) {
          if (this.afterData.step1) {
            this.count1 = this.afterData.step1[0].point;
            let flag1 = [];
            let checkbox1 = this.afterData.step1[0].sub.filter((ele, index) => {
              if (ele.select) {
                flag1.push(String(index));
              }
              return ele.select;
            });
            let radio1Parent = checkbox1.find((ele) => {
              return ele.option;
            });
            if (radio1Parent) {
              let inner = radio1Parent.option.find((ele) => {
                return ele.select;
              });
              if (inner) {
                this.radio1 = String(inner.point);
              }
            }
            this.checkList1 = flag1;
          }
          let step2Sub = this.afterData.step2[0].sub.find((ele) => {
            return ele.select;
          });
          if (step2Sub) {
            this.step2Input = step2Sub.input;
            this.radio2 = String(step2Sub.point);
          }
          let step2SubAno = this.afterData.step2[1].sub.find((ele) => {
            return ele.select;
          });
          if (step2SubAno) {
            this.radio3 = String(step2SubAno.point);
          }
          this.count2 = this.afterData.step2[0].point + this.afterData.step2[1].point;
          let step3Sub = this.afterData.step3[0].sub.find((ele) => {
            return ele.select;
          });
          if (step3Sub) {
            this.radio4 = String(step3Sub.point);
          }
          let step3SubAno = this.afterData.step3[1].sub.find((ele) => {
            return ele.select;
          });
          if (step3SubAno) {
            this.radio5 = String(step3SubAno.point);
          }
          this.count3 = this.afterData.step3[0].point + this.afterData.step3[1].point;
          let step4Sub = this.afterData.step4[0].sub.find((ele) => {
            return ele.select;
          });
          if (step4Sub) {
            this.radio6 = String(step4Sub.point);
          }
          this.count4 = this.afterData.step4[0].point;
          let step5Sub = this.afterData.step5[0].sub.find((ele) => {
            return ele.select;
          });
          if (step5Sub) {
            this.radio7 = String(step5Sub.point);
          }
          let step5SubAno = this.afterData.step5[1].sub.find((ele) => {
            return ele.select;
          });
          if (step5SubAno) {
            this.radio8 = String(step5SubAno.point);
          }
          this.count5 = this.afterData.step5[0].point + this.afterData.step5[1].point;
          let step6Sub = this.afterData.step6[0].sub.find((ele) => {
            return ele.select;
          });
          if (step6Sub) {
            this.radio9 = String(step6Sub.point);
          }
          this.count6 = this.afterData.step6[0].point;
          let step7Sub = this.afterData.step7[0].sub.find((ele) => {
            return ele.select;
          });
          if (step7Sub) {
            this.radio10 = String(step7Sub.point);
          }
          this.count7 = this.afterData.step7[0].point;
          this.count8 = this.afterData.step8[0].point;
          this.count9 = this.afterData.step9[0].point;
          this.count10 = this.afterData.step9[1].point;
        }
        // console.log(this.fromBack);
        this.newForm = {
          point13: this.fromBack.point13 == 0 || this.fromBack.point13 ? this.fromBack.point13 : undefined,
          point12: this.fromBack.point12 == 0 || this.fromBack.point12 ? this.fromBack.point12 : undefined,
          point11: this.fromBack.point11 == 0 || this.fromBack.point11 ? this.fromBack.point11 : undefined,
          point14: this.fromBack.point14 == 0 || this.fromBack.point14 ? this.fromBack.point14 : undefined,
          point10: this.fromBack.point10 == 0 || this.fromBack.point10 ? this.fromBack.point10 : undefined,
          point9: this.fromBack.point9 == 0 || this.fromBack.point9 ? this.fromBack.point9 : undefined,
          point8: this.fromBack.point8 == 0 || this.fromBack.point8 ? this.fromBack.point8 : undefined,
          point7: this.fromBack.point7 == 0 || this.fromBack.point7 ? this.fromBack.point7 : undefined,
          point6: this.fromBack.point6 == 0 || this.fromBack.point6 ? this.fromBack.point6 : undefined,
          point5: this.fromBack.point5 == 0 || this.fromBack.point5 ? this.fromBack.point5 : undefined,
          point4: this.fromBack.point4 == 0 || this.fromBack.point4 ? this.fromBack.point4 : undefined,
          point3: this.fromBack.point3 == 0 || this.fromBack.point3 ? this.fromBack.point3 : undefined,
          point2: this.fromBack.point2 == 0 || this.fromBack.point2 ? this.fromBack.point2 : undefined,
          point1: this.fromBack.point1 == 0 || this.fromBack.point1 ? this.fromBack.point1 : undefined,
        };
      }, 300);
    },
    handleChange(value) {
      this.$emit('fetchInputValue', this.newForm);
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(index, item) {
      this.options.initialViewIndex = index;
      this.images = item;
      setTimeout(() => {
        this.$viewer.show();
      }, 400);
    },
  },
};
</script>
<style scoped lang="scss">
.resetFontSize {
  font-size: 15px;
}
.idListItem {
  img {
    width: 80px;
    height: 80px;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.selfForm {
  margin-top: 30px;
}
.mainTitle {
  font-size: 23px;
  font-weight: 700;
}
.flexStart {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  align-content: center;
}
.ml20 {
  margin-left: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
.group {
  width: 83%;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
}
.flexBetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.mb20 {
  margin-bottom: 20px;
}
.mb30 {
  margin-bottom: 30px;
}
.pl20 {
  padding-left: 20px;
  box-sizing: border-box;
}
.hint {
  font-weight: 700;
  font-size: 16px;
}
.pink {
  color: #7069eb;
}
.countText {
  font-size: 17px;
  font-weight: 500;
}
.boxCount {
  font-size: 15px;
  font-weight: 500;
}
.fakeRequired {
  position: relative;
  &::before {
    content: '*';
    color: #f56c6c;
    left: 10px;
    top: 10px;
    font-size: 16px;
    position: absolute;
  }
}
</style>

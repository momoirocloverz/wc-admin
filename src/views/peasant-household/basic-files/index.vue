<template>
  <div class="basic-files">
    <div class="basic-header">
      <el-select v-model="userTypeValue" placeholder="请选择用户档案类型" size="medium" class="basic-select" :clearable="true">
        <el-option v-for="item in userFileType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-select v-model="listTypeValue" placeholder="请选择" size="medium" class="basic-select" :clearable="true">
        <el-option v-for="item in listType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>

      <el-select v-model="townTypeValue" placeholder="请选择乡镇" size="medium" class="basic-select" @change="changeTownType" :clearable="true">
        <el-option v-for="item in townType" :key="item.id" :label="item.town_name" :value="item.id"> </el-option>
      </el-select>
      <el-select v-model="villageTypeValue" placeholder="请选择行政村" class="basic-select" size="medium" :clearable="true">
        <el-option v-for="item in villageType" :key="item.id" :label="item.village_name" :value="item.id"> </el-option>
      </el-select>
      <el-select v-model="typeValue" placeholder="请选择" class="basic-select" size="medium" :clearable="true">
        <el-option v-for="item in userType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </div>
    <div class="basic-second">
      <div>
        <el-input v-model="name" placeholder="请输入姓名或户号" size="medium" class="basic-input"></el-input>
      </div>
      <div class="export-info">
        <el-button type="primary" size="medium" class="basic-search" @click="handleSearch">搜索</el-button>
        <div class="basic-infoma" v-if="option.includes(61)">
          <el-button size="medium" class="basic-btn">批量导入</el-button>
          <el-upload class="basic-upload" :action="fileAction" :headers="headers" accept="application/ms-excel" name="file" :on-success="uploadFile">批量导入</el-upload>
        </div>
        <!-- <el-button size="medium" class="basic-search" @click="handleSearch">模板下载</el-button> -->
        <el-button class="basic-btn" size="medium" @click="setDialogVisible(1)" v-if="option.includes(62)">新增农户档案</el-button>
      </div>
    </div>
    <el-table class="basic-table" :data="basicTable">
      <el-table-column label="人员类别" align="center" prop="LB" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.LB == 1 ? '低保救助(低保)' : scope.row.LB == 2 ? '低保边缘救助(低边)' : scope.row.LB == 3 ? '特困救助(五保)' : '残疾人' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="残疾" align="center" prop="CJBH">
        <template slot-scope="scope">
          <span>{{ scope.row.CJBH ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关系" align="center" prop="GX"> </el-table-column>
      <el-table-column label="户号" align="center" prop="HBH">
        <template slot-scope="scope">
          <div v-if="scope.row.HBH">
            {{ scope.row.HBH.slice(0, 8) + '****' + scope.row.HBH.slice(13, 18) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="TName">
        <template slot-scope="scope">
          <span v-if="option.includes(65)" class="basic-link" @click="sketch(scope)">{{ scope.row.TName }}</span>
          <span v-else>{{ scope.row.TName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="SEX" width="80"> </el-table-column>
      <el-table-column label="身份证号" align="center" prop="">
        <template slot-scope="scope">
          <div v-if="scope.row.Card">
            {{ scope.row.Card.slice(0, 8) + '****' + scope.row.Card.slice(13, 18) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="保障人数" align="center" prop="BZRS"> </el-table-column>
      <el-table-column label="联系方式" align="center" prop="Tel" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.Tel">
            {{ scope.row.Tel.replace(scope.row.Tel.substr(3, 4), '****') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="乡镇" align="center" prop="town_name"> </el-table-column>
      <el-table-column label="行政村" align="center" prop="village_name"> </el-table-column>
      <el-table-column label="地址" align="center" prop="Address"> </el-table-column>
      <!-- <el-table-column label="状态" align="center" prop="ZT">
        <template slot-scope="scope">
          <span>{{ scope.row.ZT == 1 ? '未脱贫' : scope.row.ZT == 2 ? '已脱贫' : '注销' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="管理操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="lookXkm(scope)" v-if="option.includes(63)">小康码</el-button>
          <el-button type="text" size="small" @click="dialogLink(scope)" v-if="option.includes(65)">详情</el-button>
          <el-button type="text" size="small" @click="setDialogVisible(2, scope)" v-if="option.includes(64)">修改</el-button>
          <el-button type="text" size="small" style="color='#F56C6C'" @click="deleteTable(scope)" v-if="option.includes(66)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <div class="pagination-footer">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        class="pagination-info"
      ></el-pagination>
      <el-button type="primary" size="mini" class="pagination-goto" @click="getListInfo">跳转</el-button>
    </div>
    <!--  弹框 -->
    <el-dialog width="75%" :title="dialogTitle" :visible.sync="dialogVisible" @close="resetForm('formData')" center>
      <el-form class="basic-dialog" :model="formData" :rules="formRules" ref="formData" label-width="120px">
        <el-form-item label="人员类型：" prop="personType">
          <el-select v-model="formData.personType" size="small" placeholder="请选择">
            <el-option v-for="item in personTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="户编号：" prop="accountNum">
          <el-input v-model="formData.accountNum" placeholder="请输入户编号" size="small" class="basic-ipt"></el-input>
          <span class="basic-red">(填写户主身份证)</span>
        </el-form-item>
        <el-form-item label="用户肖像：" size="small">
          <div style="display: flex; align-items: flex-end">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="handleBeforeUpload"
              :headers="headers"
              :multiple="false"
              name="file"
              accept="image/*"
            >
              <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!-- <span class="basic-red">(建议尺寸：150px × 120px)</span> -->
          </div>
        </el-form-item>
        <el-form-item label="与户主关系：" prop="host">
          <el-input v-model="formData.host" placeholder="请输入" class="basic-ipt" size="small" />
          <span class="basic-red">(本人是户主，填写户主)</span>
        </el-form-item>

        <div class="basic-dialog-two">
          <div class="basic-tow-left">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" size="small" class="basic-ipt"></el-input>
            </el-form-item>
            <el-form-item label="乡镇：" prop="town">
              <el-select v-model="formData.town" size="small" @change="changFormTown" placeholder="请选择乡镇">
                <el-option v-for="item in townType" :key="item.id" :label="item.town_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="家庭地址：" prop="address">
              <el-input v-model="formData.address" placeholder="请输入家庭地址" size="small" class="basic-ipt"></el-input>
            </el-form-item>
            <el-form-item label="是否死亡：" prop="isDeal">
              <el-radio v-model="formData.isDeal" :label="1">是</el-radio>
              <el-radio v-model="formData.isDeal" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="低保编号：" prop="lowNumber">
              <el-input v-model="formData.lowNumber" size="small" placeholder="请输入低保编号" class="basic-ipt"></el-input>
            </el-form-item>
            <el-form-item label="结对单位：" prop="partyCompany">
              <el-input v-model="formData.partyCompany" size="small" placeholder="请输入结对单位" class="basic-ipt" @blur="changeDeptInfo" />
            </el-form-item>
            <el-form-item label="结对干部：" prop="Paired">
              <el-input v-model="formData.Paired" placeholder="请输入结对干部" size="small" class="basic-ipt" @blur="iptPairedInfo" :disabled="formData.partyCompany ? false : true"></el-input>
            </el-form-item>
            <el-form-item label="签约医生：" prop="signDoctor">
              <el-input v-model="formData.signDoctor" placeholder="请输入签约医生" size="small" class="basic-ipt" @blur="signDoctorList"></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-radio v-model="formData.status" :label="1">未脱贫</el-radio>
              <el-radio v-model="formData.status" :label="2">已脱贫</el-radio>
              <el-radio v-model="formData.status" :label="3">已注销</el-radio>
            </el-form-item>
            <el-form-item label="残疾证编号：" prop="Disability">
              <el-input v-model="formData.Disability" size="small" placeholder="请输入残疾证编号" class="basic-ipt"></el-input>
            </el-form-item>
            <el-form-item label="抱团增收：" prop="increment">
              <el-radio v-model="formData.increment" :label="1">未参加</el-radio>
              <el-radio v-model="formData.increment" :label="2">已参加</el-radio>
            </el-form-item>
            <el-form-item label="注销原因：" prop="cancellation" v-if="formData.status == 3">
              <el-input v-model="formData.cancellation" size="small" placeholder="请输入注销原因" class="basic-ipt" />
            </el-form-item>
          </div>
          <div class="basic-two-right">
            <el-form-item label="身份证号：" prop="name">
              <el-input v-model="formData.idCard" size="small" placeholder="请输入身份证号" class="basic-ipt"></el-input>
            </el-form-item>
            <el-form-item label="人编号：" prop="personNum">
              <el-input v-model="formData.personNum" size="small" placeholder="请输入人编号" class="basic-ipt" />
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-radio v-model="formData.sex" :label="1">男</el-radio>
              <el-radio v-model="formData.sex" :label="2">女</el-radio>
            </el-form-item>
            <el-form-item label="联系方式：" prop="link">
              <el-input v-model="formData.link" size="small" placeholder="请输入联系方式" class="basic-ipt" />
            </el-form-item>
            <el-form-item label="行政村：" prop="village">
              <el-select v-model="formData.village" size="small" placeholder="请选择行政村">
                <el-option v-for="item in villageType" :key="item.id" :label="item.village_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="保障人数：" prop="personInfo">
              <el-input v-model="formData.personInfo" placeholder="请输入保障人数" size="small" class="basic-ipt" />
            </el-form-item>
            <el-form-item label="干部联系方式：" prop="partyLink">
              <el-input v-model="formData.partyLink" placeholder="请输入干部联系方式" class="basic-ipt" size="small" :disabled="formData.partyCompany && formData.Paired ? false : true" />
            </el-form-item>
            <el-form-item label="医生联系方式：" prop="doctorLink">
              <el-input v-model="formData.doctorLink" placeholder="请输入医生联系方式" size="small" :disabled="formData.signDoctor ? false : true" class="basic-ipt" />
            </el-form-item>
            <el-form-item label="是否党员：" prop="isParty">
              <el-radio v-model="formData.isParty" :label="1">是</el-radio>
              <el-radio v-model="formData.isParty" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="救助证编号：" prop="salvageNum">
              <el-input v-model="formData.salvageNum" size="small" placeholder="请输入救助证编号" class="basic-ipt" />
            </el-form-item>
            <el-form-item label="注销时间：" prop="cancelTime" v-if="formData.status == 3">
              <el-date-picker v-model="formData.cancelTime" size="small" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
          </div>
          <!-- <div class="basic-right">

          </div> -->
        </div>
        <div class="basic-dialog-info">
          <span class="basic-bold">致贫原因</span>
          <el-input type="textarea" placeholder="请输入致贫原因" v-model="formData.reason" :rows="4" class="basic-area"></el-input>
        </div>
        <div class="basic-dialog-info">
          <span class="basic-bold">帮扶措施</span>
          <el-input type="textarea" placeholder="请输入帮扶措施" v-model="formData.measures" :rows="4" class="basic-area"></el-input>
        </div>
        <div class="basic-dialog-info">
          <span class="basic-bold">备注</span>
          <el-input type="textarea" placeholder="请输入备注" v-model="formData.remark" :rows="4" class="basic-area"></el-input>
        </div>
        <div class="basic-form-btn">
          <el-button type="primary" @click="submitForm('formData')">确定</el-button>
          <el-button @click="resetForm('formData')">返回</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 查看用户信息 -->
    <el-dialog :title="lookTitle" :visible="lookVisible" center width="90%" @close="lookVisible = false">
      <div class="look-user">
        <div class="look-header">
          <ul class="look-header-left">
            <li>
              <span class="look-header-title">人员类型：</span>
              <em>{{ userInfo.lb_name }}</em>
            </li>
            <li>
              <span class="look-header-title">户编号：</span>
              <em v-if="userInfo.HBH">{{ userInfo.HBH.slice(0, 8) + '****' + userInfo.HBH.slice(13, 18) }}</em>
            </li>
            <li>
              <span class="look-header-title">姓名：</span>
              <em>{{ userInfo.TName }}</em>
            </li>
            <li>
              <span class="look-header-title">身份证号：</span>
              <em v-if="userInfo.Card">{{ userInfo.Card.slice(0, 8) + '****' + userInfo.Card.slice(13, 18) }}</em>
            </li>
            <li>
              <span class="look-header-title">片区：</span>
              <em>{{ userInfo.town_name }}</em>
            </li>
            <li>
              <span class="look-header-title">家庭地址：</span>
              <em>{{ userInfo.Address }}</em>
            </li>
            <li>
              <span class="look-header-title">低保编号：</span>
              <em>{{ userInfo.DBBH }}</em>
            </li>
            <li>
              <span class="look-header-title">残疾证号：</span>
              <em>{{ userInfo.CJBH }}</em>
            </li>
            <li>
              <span class="look-header-title">结对干部：</span>
              <em>{{ userInfo.JDGB }}</em>
            </li>
            <li>
              <span class="look-header-title">签约医生：</span>
              <em>{{ userInfo.QYYS }}</em>
            </li>
            <li>
              <span class="look-header-title">是否党员：</span>
              <em>{{ userInfo.IsDY ? '是' : '否' }}</em>
            </li>
            <li>
              <span class="look-header-title">注销原因：</span>
              <em>{{ userInfo.ZXYY }}</em>
            </li>
          </ul>
          <ul class="look-header-left">
            <li>
              <span class="look-header-title">与户主关系：</span>
              <em>{{ userInfo.GX }}</em>
            </li>
            <li>
              <span class="look-header-title">人编号：</span>
              <em>{{ userInfo.RBH }}</em>
            </li>
            <li>
              <span class="look-header-title">性别：</span>
              <em>{{ userInfo.SEX }}</em>
            </li>
            <li>
              <span class="look-header-title">联系方式：</span>
              <em>{{ userInfo.Tel }}</em>
            </li>
            <li>
              <span class="look-header-title">行政村：</span>
              <em>{{ userInfo.village_name }}</em>
            </li>
            <li>
              <span class="look-header-title">保障人数：</span>
              <em>{{ userInfo.BZRS }}</em>
            </li>
            <li>
              <span class="look-header-title">救助证编号：</span>
              <em>{{ userInfo.JZBH }}</em>
            </li>
            <li>
              <span class="look-header-title">结对单位：</span>
              <em>{{ userInfo.JDDW }}</em>
            </li>
            <li>
              <span class="look-header-title">干部联系方式：</span>
              <em>{{ userInfo.JDGBtel }}</em>
            </li>
            <li>
              <span class="look-header-title">医生联系方式：</span>
              <em>{{ userInfo.QYYSTel }}</em>
            </li>
            <li>
              <span class="look-header-title">状态：</span>
              <em>{{ userInfo.ZT == 1 ? '未脱贫' : userInfo.ZT == 2 ? '已脱贫' : '注销' }}</em>
            </li>
            <li>
              <span class="look-header-title">注销时间：</span>
              <em>{{ userInfo.cancel_at }}</em>
            </li>
          </ul>
          <div class="look-header-pic">
            <img :src="userInfo.image" />
          </div>
        </div>
        <div class="look-content">
          <!-- 家庭成员 -->
          <p class="look-weight">家庭成员</p>
          <el-table :data="familyTable">
            <el-table-column prop="no" label="序号" width="70" align="center">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="GX" label="关系" align="center"></el-table-column>
            <el-table-column prop="TName" label="姓名" align="center"></el-table-column>
            <el-table-column prop="Card" label="身份证号" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.Card">
                  {{ scope.row.Card.slice(0, 8) + '****' + scope.row.Card.slice(13, 18) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ZT" label="状态" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.ZT == 1 ? '未脱贫' : scope.row.ZT == 2 ? '已脱贫' : '注销' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="参加时间" align="center"></el-table-column>
            <el-table-column prop="cancelTime" label="注销时间" align="center"></el-table-column>
          </el-table>
          <!-- 致病原因 -->
          <p class="look-weight">致贫原因</p>
          <p>{{ userInfo.ZPYY }}</p>
          <!-- 帮扶措施 -->
          <p class="look-weight">帮扶措施</p>
          <p>{{ userInfo.BFCS }}</p>
          <!-- 备注 -->
          <p class="look-weight">备注</p>
          <p>{{ userInfo.Content }}</p>
          <!-- 干部结对 -->
          <div class="group-team">
            <span class="group-span">干部结对</span>
            <span class="group-date">日期</span>
            <el-date-picker v-model="groupYear" type="year" value-format="yyyy" placeholder="选择干部结对年份" @change="changeGroupTime" class="group-year"> </el-date-picker>
            <span>共计随访次数：{{ pairingTable.visit_count }}</span>
          </div>
          <el-table :data="pairingTable.list ? pairingTable.list.data : []">
            <el-table-column prop="visit_at" label="随访日期" align="center"></el-table-column>
            <el-table-column prop="visit_name" label="随访姓名" align="center"></el-table-column>
            <el-table-column label="随访内容" align="center">
              <template slot-scope="scope">
                <div class="content-scope" v-if="scope.row.image">
                  <span>{{ scope.row.content }}</span>
                  <template v-for="(src, index) in scope.row.image">
                    <img class="cursorImg" :src="src" :key="index" @click="show(index, scope.row.image)" />
                  </template>
                </div>
                <div class="content-scope" v-html="scope.row.content" v-else></div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeGroup"
            :current-page.sync="groupPage"
            :page-size="groupPageSize"
            layout="prev, pager, next, jumper"
            :total="groupTotal"
            class="pagination-info"
            v-show="groupTotal > 10"
          ></el-pagination>
          <!-- 医生结对 -->
          <div class="group-team">
            <span class="group-span">医生结对</span>
            <span class="group-date">日期</span>
            <el-date-picker v-model="doctorYear" type="year" value-format="yyyy" placeholder="选择医生结对年份" @change="changeDoctorYear" class="group-year"> </el-date-picker>
            <span>共计随访次数：{{ doctorTable.visit_count }}</span>
          </div>
          <el-table :data="doctorTable.list ? doctorTable.list.data : []">
            <el-table-column prop="visit_at" label="随访日期" align="center"></el-table-column>
            <el-table-column prop="visit_name" label="随访姓名" align="center"></el-table-column>
            <el-table-column label="随访内容" align="center">
              <template slot-scope="scope">
                <div class="content-scope" v-if="scope.row.image">
                  <span>{{ scope.row.content }}</span>
                  <template v-for="(src, index) in scope.row.image">
                    <img class="cursorImg" :src="src" :key="index" @click="show(index, scope.row.image)" />
                  </template>
                </div>
                <div class="content-scope" v-html="scope.row.content" v-else></div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeDoctor"
            :current-page.sync="doctorPage"
            :page-size="groupPageSize"
            layout="prev, pager, next, jumper"
            :total="doctorTotal"
            class="pagination-info"
            v-show="doctorTotal > 10"
          ></el-pagination>
          <!-- 就医详情 -->
          <div class="group-team">
            <span class="group-span">就医详情</span>
            <span class="group-date">日期</span>
            <el-date-picker v-model="hospitalYear" @change="changeHospital" type="year" value-format="yyyy" placeholder="选择就医详情的年份" class="group-year"> </el-date-picker>
          </div>
          <el-table :data="seeDoctorTable">
            <el-table-column prop="JZRQ" label="就诊日期" align="center"></el-table-column>
            <el-table-column prop="XM" label="就医姓名" align="center"></el-table-column>
            <el-table-column prop="SFZH" label="身份证号" align="center"></el-table-column>
            <el-table-column prop="mobile" label="电话号" align="center"></el-table-column>
            <el-table-column prop="JZKH" label="就诊卡号" align="center"></el-table-column>
            <el-table-column prop="ZD" label="就诊诊断" align="center"></el-table-column>
            <el-table-column prop="KSDM" label="科室代码" align="center"></el-table-column>
            <el-table-column prop="KSMC" label="科室名称" align="center"></el-table-column>
            <el-table-column prop="FYLB" label="费用类别" align="center"></el-table-column>
            <el-table-column prop="FYXZ" label="费用性质" align="center"></el-table-column>
            <el-table-column prop="FYZJE" label="就诊费用总金额" align="center" width="120"></el-table-column>
            <el-table-column prop="ZFJE" label="自付金额" align="center"></el-table-column>
            <el-table-column prop="BXJE" label="报销金额" align="center"></el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeHospital"
            :current-page.sync="hospitalPage"
            :page-size="groupPageSize"
            layout="prev, pager, next, jumper"
            :total="hospitalTotal"
            class="pagination-info"
            v-show="hospitalTotal > 10"
          ></el-pagination>
          <div class="group-team">
            <span class="group-span">发放资金情况</span>
            <span class="group-date">日期</span>
            <el-date-picker v-model="distributeYear" @change="changeDistribute" type="year" value-format="yyyy" placeholder="选择发放资金的年份" class="group-year"> </el-date-picker>
          </div>
          <div class="distributeHeadCon">
            <el-tabs class="tabCustom" v-model="activeName" type="card" @tab-click="handleTabClick">
              <template v-for="(item, index) in tabArray">
                <el-tab-pane :label="item.label" :name="item.name"></el-tab-pane>
              </template>
            </el-tabs>
          </div>
          <div class="distributeTableCon">
            <div class="switchDistributeCon">
              <template v-for="(item, index) in sideBarArray">
                <div class="distributeItem" :key="index" @click="sideBarClick(index)" :class="[siderBarActive == index ? 'distributeActive' : '']">
                  {{ item.name }}
                </div>
              </template>
            </div>
            <el-table :data="distributeTable" show-summary :summary-method="getSummaries">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column prop="name" label="姓名" align="center"></el-table-column>
              <el-table-column prop="GX" label="关系" align="center"></el-table-column>
              <el-table-column prop="created_at" label="属期" align="center"></el-table-column>
              <el-table-column prop="total_fee" label="金额" align="center"></el-table-column>
              <!-- <el-table-column
                prop="KSMC"
                label="人数"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="FYLB"
                label="说明"
                align="center"
              ></el-table-column> -->
            </el-table>
          </div>
          <el-pagination
            @current-change="handleCurrentChangeDistribute"
            :current-page.sync="distributePage"
            :page-size="distributePageSize"
            layout="prev, pager, next, jumper"
            :total="distributeTotal"
            class="pagination-info"
            v-show="distributeTotal > 10"
          ></el-pagination>
          <!-- <div class="distributeLinkCount" v-if="distributeTable.length">
            全部累计发放:{{ allCount }}
          </div> -->
          <div class="group-close">
            <el-button type="primary" @click="lookVisible = false">关闭</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- @close="resetForm('formData')" -->
    <el-dialog class="sketchDialog" width="1600px" :visible.sync="sketchVisible" v-loading="sketchLoading" center>
      <div class="sketchCon">
        <div class="sketchLeft">
          <div class="leftImgCon">
            <img class="leftImgBack" src="https://img.hzanchu.com/acimg/1dde0708a4933203e3cf8195e5901867.png" />
            <div v-if="userInfo.image" class="leftImgReal" :style="'background-image: url(' + userInfo.image + ')'"></div>
            <div v-else class="leftImgRealHolder" :style="'background-image: url(' + 'https://img.hzanchu.com/acimg/d940b247d78055ba6810c2313605c4ad.jpeg' + ')'"></div>
          </div>
          <div class="rightImgCon">
            <img class="rightImgBack" src="https://img.hzanchu.com/acimg/8469a6527cc5bcdcc59e28cd0d6d3990.png" />
            <img class="rightImgReal" :src="dynamicLink + avatarBridge.ID" />
          </div>
          <img class="human" src="https://img.hzanchu.com/acimg/c41320fea310ddc1392834afd93f4119.png" />
        </div>
        <div class="sketchRight">
          <el-tabs v-model="sketchActive" @tab-click="handleSketchActiveClick">
            <el-tab-pane label="基础画像" name="first"></el-tab-pane>
            <el-tab-pane label="补贴清单" name="second"></el-tab-pane>
          </el-tabs>
          <div v-show="sketchActive == 'first'">
            <div class="sketchContentArea">
              <div class="sketchContentLeftPart">
                <div class="sketchTitle"><img src="https://img.hzanchu.com/acimg/6585d20f11c7499f44328ace348eefd8.png" /><span>基础画像</span></div>
                <div class="commonMargin">
                  <li>
                    <div class="sketch-header-title">人员类型</div>
                    <span>{{ userInfo.lb_name }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">与户主关系</div>
                    <span>{{ userInfo.GX }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">姓名</div>
                    <span>{{ userInfo.TName }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">性别</div>
                    <span>{{ userInfo.SEX }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">身份证号</div>
                    <span v-if="userInfo.Card">{{ userInfo.Card.slice(0, 8) + '****' + userInfo.Card.slice(13, 18) }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">居住地址</div>
                    <span>{{ userInfo.Address }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">保障人数</div>
                    <span>{{ userInfo.BZRS }}</span>
                  </li>
                </div>

                <div class="sketchTitle"><img src="https://img.hzanchu.com/acimg/6585d20f11c7499f44328ace348eefd8.png" /><span>致贫原因</span></div>
                <div class="commonMargin">
                  <li>
                    <div class="sketch-header-title">致贫原因</div>
                    <span>{{ userInfo.ZPYY }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">是否残疾</div>
                    <span>{{ userInfo.CJBH ? '是' : '否' }}</span>
                  </li>
                </div>
                <div class="sketchTitle"><img src="https://img.hzanchu.com/acimg/6585d20f11c7499f44328ace348eefd8.png" /><span>产业帮扶</span></div>
                <div class="commonMargin">
                  <li>
                    <div class="sketch-header-title">村集体</div>
                    <span>暂无</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">养殖大户</div>
                    <span>暂无</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">帮扶兜底金额</div>
                    <span>暂无</span>
                  </li>
                </div>
              </div>
              <div class="sketchContentRightPart">
                <div class="sketchTitle"><img src="https://img.hzanchu.com/acimg/6585d20f11c7499f44328ace348eefd8.png" /><span>结对干部</span></div>
                <div class="commonMargin">
                  <li>
                    <div class="sketch-header-title">结对单位</div>
                    <span>{{ userInfo.JDDW }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">结对干部</div>
                    <span>{{ userInfo.JDGB }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">干部电话</div>
                    <span v-if="userInfo.JDGBtel">{{ userInfo.JDGBtel.replace(userInfo.JDGBtel.substr(3, 4), '****') }}</span>
                  </li>
                </div>
                <div class="sketchTitle"><img src="https://img.hzanchu.com/acimg/6585d20f11c7499f44328ace348eefd8.png" /><span>签约医生</span></div>
                <div class="commonMargin">
                  <li>
                    <div class="sketch-header-title">医生姓名</div>
                    <span>{{ userInfo.QYYS }}</span>
                  </li>
                  <li>
                    <div class="sketch-header-title">联系电话</div>
                    <span v-if="userInfo.QYYSTel">{{ userInfo.QYYSTel.replace(userInfo.QYYSTel.substr(3, 4), '****') }}</span>
                  </li>
                </div>
                <div class="sketchTitle"><img src="https://img.hzanchu.com/acimg/6585d20f11c7499f44328ace348eefd8.png" /><span>家庭成员</span></div>
                <div class="commonMargin">
                  <div v-if="!this.familyTable.length">
                    <li>
                      <div class="sketch-header-title">成员姓名</div>
                      <span>暂无</span>
                    </li>
                    <li>
                      <div class="sketch-header-title">成员电话</div>
                      <span>暂无</span>
                    </li>
                  </div>
                  <div v-else class="scrollInner">
                    <div class="templateAllCon">
                      <template v-for="(item, index) in familyTable">
                        <div :key="index">
                          <li>
                            <div class="sketch-header-title">成员姓名</div>
                            <span>{{ item.TName }}</span>
                          </li>
                          <li>
                            <div class="sketch-header-title">身份证号</div>
                            <span v-if="item.Card">{{ item.Card.slice(0, 8) + '****' + item.Card.slice(13, 18) }}</span>
                          </li>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="sketchActive == 'second'">
            <div class="chartCon">
              <div id="mainChart"></div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- <transition name="fade"> -->
    <div class="portrait-dialog" v-show="showPopup">
      <img class="header" src="https://img.hzanchu.com/acimg/7a91aa0cab1a0e94a2201557c7290a28.png" alt="" />
      <i class="el-icon-close" @click="closePopup"></i>
      <div class="tab">
        <span v-for="item in tabList" :key="item.value" :class="isSelect === item.value ? 'is-select' : ''" @click="selectTab(item)">{{ item.title }}</span>
      </div>

      <div class="box1" v-if="isSelect === '1'">
        <div class="head-photo">
          <img :src="userInfo.image || 'https://img.hzanchu.com/acimg/d940b247d78055ba6810c2313605c4ad.jpeg'" alt="" />
        </div>
        <div class="qrcode">
          <img :src="dynamicLink + avatarBridge.ID" alt="" />
        </div>
        <img class="model" src="https://img.hzanchu.com/acimg/f7755ea2ee217e0ce95628cf890a3d21.png" alt="" />
        <div class="left">
          <div class="info jibenxinxi">
            <div>基本信息</div>
            <p>
              <span>人员类型：</span>
              <span>{{ userInfo.lb_name }}</span>
            </p>
            <p>
              <span>与户主关系：</span>
              <span>{{ userInfo.GX }}</span>
            </p>
            <p>
              <span>姓名：</span>
              <span>{{ userInfo.TName }}</span>
            </p>
            <p>
              <span>性别：</span>
              <span>{{ userInfo.SEX }}</span>
            </p>
            <p>
              <span>身份证号：</span>
              <span v-if="userInfo.Card">{{ userInfo.Card.slice(0, 8) + '****' + userInfo.Card.slice(13, 18) }}</span>
            </p>
            <p>
              <span>居住地址：</span>
              <span>{{ userInfo.Address }}</span>
            </p>
            <p>
              <span>保障人数：</span>
              <span>{{ userInfo.BZRS }}</span>
            </p>
          </div>
          <div class="info zhipinyuanyin">
            <div>致贫原因</div>
            <p>
              <span>是否因病：</span>
              <span>{{ userInfo.ZPYY }}</span>
            </p>
            <p>
              <span>是否残疾：</span>
              <span>{{ userInfo.CJBH ? '是' : '否' }}</span>
            </p>
          </div>
          <div class="info chanyebangfu">
            <div>产业帮扶</div>
            <p>
              <span>村集体：</span>
              <span>暂无</span>
            </p>
            <p>
              <span>养殖大户：</span>
              <span>暂无</span>
            </p>
            <p>
              <span>帮扶兜底金额：</span>
              <span>预计 640.00 元</span>
            </p>
          </div>
        </div>
        <div class="right">
          <div class="info jieduiganbu">
            <div>结对干部</div>
            <p>
              <span>结对单位：</span>
              <span>{{ userInfo.JDDW }}</span>
            </p>
            <p>
              <span>干部姓名：</span>
              <span>{{ userInfo.JDGB }}</span>
            </p>
            <p>
              <span>干部电话：</span>
              <span v-if="userInfo.JDGBtel">{{ userInfo.JDGBtel.replace(userInfo.JDGBtel.substr(3, 4), '****') }}</span>
            </p>
          </div>
          <div class="info qianyueyisheng">
            <div>签约医生</div>
            <p>
              <span>医生姓名：</span>
              <span>{{ userInfo.QYYS }}</span>
            </p>
            <p>
              <span>联系电话：</span>
              <span v-if="userInfo.QYYSTel">{{ userInfo.QYYSTel.replace(userInfo.QYYSTel.substr(3, 4), '****') }}</span>
            </p>
          </div>
          <div class="info jiatingchengyuan">
            <div>家庭成员</div>
            <p>
              <span>成员姓名：</span>
              <span>{{ familyTable.length ? familyTable[0].TName : '暂无' }}</span>
            </p>
            <p>
              <span>成员电话：</span>
              <span>{{ familyTable.length ? familyTable[0].Card.slice(0, 8) + '****' + familyTable[0].Card.slice(13, 18) : '暂无' }}</span>
            </p>
          </div>
          <div class="info butieshouru">
            <div>补贴收入</div>
            <p>
              <span>补贴收入：</span>
              <span>22725.68元</span>
            </p>
          </div>
        </div>
      </div>
      <div class="box2" v-if="isSelect === '2'">
        <img class="model" src="https://img.hzanchu.com/acimg/f7755ea2ee217e0ce95628cf890a3d21.png" alt="" />
        <div class="chart">
          <div class="content">
            <div id="incomeDetail" class="income-detail" style="width: 100%; height: 100%"></div>
            <p class="price">22725.68</p>
            <p class="label">补贴清单</p>
          </div>
        </div>
        <div class="list">
          <div class="item" v-for="(item, index) in incomeList" :key="index">
            <div :style="{ background: item.color }"></div>
            <div>
              <p>{{ item.name }}</p>
              <p :style="{ color: item.color }">{{ item.value }} 元</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </transition> -->
    <viewer :images="images" :options="options" @inited="inited" class="viewer" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { ListUser, DeleteUser, AddUser, EditUser, GetBaseInfo, GetGBJDInfo, GetDoctorInfo, GetDoctorDetailInfo, ExportHouseInfo, PairedAndDoctorInfo, userInfoZjqk } from '@/api/household';
import { TownInfo, VillageInfo } from '@/api/common';
import { checkIdenity } from '@/utils/business';
import { debounce } from '@/utils/common';
import path from 'path';
export default {
  name: 'basicFiles',
  data() {
    return {
      defaultAvatar: require('@/assets/1b918ca51.jpeg'),
      sketchVisible: false,
      xkm_id: '',
      xkmVisible: false,
      action: '/web/public/upload',
      fileAction: '/web/user/import/nhxx',
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      pageSize: 10,
      currentPage: 1,
      doctorPage: 1,
      hospitalPage: 1,
      groupPage: 1,
      groupPageSize: 10,
      total: 0,
      doctorTotal: 0,
      hospitalTotal: 0,
      distributePage: 0,
      distributePageSize: 100,
      distributeTotal: 0,
      familyTable: [],
      pairingTable: [],
      doctorTable: [],
      seeDoctorTable: [],
      distributeTable: [],
      allCount: 789,
      sendTable: [],
      sendList: [
        { name: '民政', choose: false },
        { name: '低保补助', choose: false },
        { name: '临时救助', choose: false },
      ],
      sendMoneyYear: '',
      hospitalYear: '',
      doctorYear: '',
      groupYear: '',
      groupTotal: 0,
      lookTitle: '',
      dialogTitle: '新增农户档案',
      lookVisible: false,
      dialogVisible: false,
      userTypeValue: '',
      listTypeValue: '',
      townTypeValue: '',
      villageTypeValue: '',
      typeValue: '',
      name: '',
      userFileType: [
        // { value: 0, label: "农户基本档案" },
        { value: 1, label: '低保人员档案' },
        { value: 2, label: '低边人员档案' },
        { value: 3, label: '五保人员档案' },
        { value: 4, label: '残疾人名单' },
      ],
      listType: [
        { value: 0, label: '在册农户列表' },
        { value: 1, label: '注销农户列表' },
      ],
      townType: [],
      villageType: [],
      userType: [
        { value: '', label: '全部' },
        { value: 2, label: '户主' },
        { value: 1, label: '其他' },
      ],
      basicTable: [],
      formData: {
        personType: '',
        accountNum: '',
        name: '',
        idCard: '',
        town: '',
        address: '',
        isDeal: 0,
        lowNumber: '',
        Disability: '',
        Paired: '',
        signDoctor: '',
        status: 1,
        cancellation: '',
        host: '',
        personNum: '',
        sex: 1,
        link: '',
        village: '',
        personInfo: '',
        isParty: 0,
        salvageNum: '',
        partyCompany: '',
        partyLink: '',
        doctorLink: '',
        increment: 1,
        cancelTime: '',
        imageUrl: '',
        imageId: '',
        reason: '',
        measures: '',
        remark: '',
      },
      formRules: {
        personType: [
          {
            required: true,
            message: '请选择人员类型',
          },
        ],
        accountNum: [
          {
            required: true,
            message: '请输入户编号',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入姓名',
          },
        ],
        idCard: [
          {
            required: true,
            message: '请输入身份证号',
          },
        ],
        town: [
          {
            required: true,
            message: '请选择乡镇信息',
          },
        ],
        address: [
          {
            required: true,
            message: '请输入家庭地址',
          },
        ],
        host: [
          {
            required: true,
            message: '请输入户主关系',
          },
        ],
        personNum: [
          {
            required: true,
            message: '请输入人编号',
          },
        ],
        link: [
          {
            required: true,
            message: '请输入联系方式',
          },
        ],
        village: [
          {
            required: true,
            message: '请选择行政村',
          },
        ],
        personInfo: [
          {
            required: true,
            message: '请输入保障人数',
          },
        ],
      },
      personTypeList: [
        { value: 1, label: '低保救助(低保)' },
        { value: 2, label: '低保边缘救助(低边)' },
        { value: 3, label: '特困救助(五保)' },
        { value: 4, label: '残疾人' },
      ],
      isAdd: true,
      userID: '',
      userInfo: {},
      row: {},
      pairedInfoList: [],
      doctorInfoList: [],
      option: this.$store.getters.option.length !== 0 ? this.$store.getters.option : JSON.parse(sessionStorage.getItem('option')) ? JSON.parse(sessionStorage.getItem('option')) : [],
      isError: false,
      options: {
        initialViewIndex: 0,
      },
      images: [],
      dynamicLink: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=http://wencheng-xkm.anchu.vip/#/home?id=',
      avatarBridge: {},
      sketchLoading: false,
      sketchActive: 'first',
      showPopup: false,
      tabList: [
        { title: '基础画像', value: '1' },
        { title: '补贴清单', value: '2' },
      ],
      isSelect: '1',
      incomeList: [],
      distributeYear: '',
      activeName: 'first',
      tabArray: [],
      sideBarArray: [],
      siderBarActive: 0,
    };
  },
  created() {
    this.setQrcodeLink();
    this.getListInfo();
    this.getTownList();
    this.destroy();
  },
  methods: {
    sideBarClick(index) {
      this.siderBarActive = index;
      let track = this.sideBarArray[index];
      console.log(track);
    },
    handleTabClick(tab, event) {
      this.siderBarActive = 0;
      if (this.activeName == 'first') {
        this.sideBarArray = [
          {
            name: '低保户',
          },
          {
            name: '低边户',
          },
          {
            name: '特困户',
          },
        ];
      } else if (this.activeName == 'second') {
        this.sideBarArray = [
          {
            name: '教育补贴',
          },
        ];
      } else if (this.activeName == 'third') {
        this.sideBarArray = [
          {
            name: '危旧房补助',
          },
          {
            name: '公租房补助',
          },
        ];
      } else if (this.activeName == 'fourth') {
        this.sideBarArray = [
          {
            name: '医疗救助',
          },
          //   {
          //     name: "参保名单"
          //   }
        ];
        this.file_type = '6';
      } else if (this.activeName == 'fifth') {
        this.sideBarArray = [
          {
            name: '医生名单',
          },
        ];
      } else if (this.activeName == 'sixth') {
        this.sideBarArray = [
          //   {
          //     name: "助学补贴"
          //   },
          //   {
          //     name: "就业创业"
          //   },
          //   {
          //     name: "辅具补贴"
          //   },
          {
            name: '两项补助',
          },
        ];
        this.file_type = '12';
      }
      this.distributePage = 1;
      this.getDistributeTable();
    },
    changeDistribute(e) {
      this.distributePage = 1;
      this.distributeYear = e;
      this.getDistributeTable();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 3) {
          sums[index] = '合计';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (index === 4) {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 元';
          } else {
            sums[index] = 'N/A';
          }
        }
      });
      return sums;
    },
    initChart() {
      // var myChart = document.getElementById('incomeDetail');
      this.$nextTick(() => {
        var myChart = echarts.init(document.getElementById('incomeDetail'));
        var option = {
          tooltip: {
            trigger: 'item',
          },
          series: [
            {
              name: '收入来源',
              type: 'pie',
              radius: ['50%', '90%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
              },
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: '40',
                  fontWeight: 'bold',
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: 1680, name: '民政局', color: '#5171cf' },
                { value: 2956.68, name: '残联', color: '#95da7b' },
                { value: 3099, name: '农业农村局', color: '#f9c05a' },
                { value: 3000, name: '住建局', color: '#eb5d5f' },
                { value: 2000, name: '教育局', color: '#73cdef' },
                { value: 3000, name: '医疗保障局', color: '#359769' },
                { value: 3000, name: '人社局', color: '#fb7a50' },
                { value: 3990, name: '其他', color: '#9f61bb' },
              ],
            },
          ],
        };
        this.incomeList = option.series[0].data;
        console.log(option, 'option');
        option && myChart.setOption(option);
      });
    },
    closePopup() {
      this.showPopup = false;
      this.isSelect = '1';
    },
    selectTab(item) {
      this.isSelect = item.value;
      if (this.isSelect === '2') {
        this.initChart();
      }
    },
    handleSketchActiveClick() {
      console.log();
    },
    setQrcodeLink() {
      if (process.env.NODE_ENV == 'production') {
        if (process.env.VUE_APP_TITLE == 'prod') {
          this.dynamicLink = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://wencheng-xkm.zjsszxc.com/#/home?id=';
        } else {
          this.dynamicLink = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=http://wencheng-xkm.anchu.vip/#/home?id=';
        }
      }
    },
    destroy() {
      sessionStorage.removeItem('isRefresh');
      sessionStorage.removeItem('childRouterQuery');
    },
    // 输入结对干部
    iptPairedInfo(e) {
      if (e.target.value == '') {
        return;
      }
      let pairedName = e.target.value;
      let isTrue = this.pairedInfoList.filter((item) => {
        return item.name == pairedName;
      });
      if (isTrue.length != 0) {
        this.pairedInfoList.map((item) => {
          if (item.name == pairedName) {
            this.formData.Paired = item.name;
            this.formData.partyLink = item.tel;
            this.isError = false;
            return;
          }
        });
      } else {
        this.formData.Paired = '';
        this.isError = true;
        this.$message.error('当前的结对干部不属于当前干部单位');
      }
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(index, item) {
      this.options.initialViewIndex = index;
      if (typeof item == 'object') {
        this.images = item.map((ele) => {
          return ele;
        });
      } else {
        this.images = [item];
      }
      setTimeout(() => {
        this.$viewer.show();
      }, 400);
    },
    // 改变结对干部
    changeDeptInfo(e) {
      debounce(() => {
        this.searchPairedOrDoctor(1, e.target.value);
      }, 50)();
    },
    signDoctorList(e) {
      debounce(() => {
        this.searchPairedOrDoctor(2, e.target.value);
      }, 50)();
    },
    // 搜索干部还是医生
    searchPairedOrDoctor(type, kw) {
      let data = {
        type,
        kw,
      };
      PairedAndDoctorInfo(data).then((res) => {
        if (res.code === 0) {
          if (type == 1) {
            this.pairedInfoList = res.data;
          } else {
            if (kw == '') {
              return;
            }
            this.doctorInfoList = res.data;
            let isTrue = res.data.filter((item) => {
              return item.name == kw;
            });
            if (isTrue.length != 0) {
              res.data.map((item) => {
                if (item.name == kw) {
                  this.formData.signDoctor = item.name;
                  this.formData.doctorLink = item.tel;
                  this.isError = false;
                  return;
                }
              });
            } else {
              this.isError = true;
              this.$message.error('当前医生不存在');
            }
          }
        }
      });
    },
    closeXkmVisible() {
      this.xkmVisible = false;
    },
    printEwm() {
      window.print();
    },
    sketch(scope) {
      this.sketchLoading = true;
      // this.sketchVisible = true;
      this.showPopup = true;

      this.$nextTick(() => {
        var chartDom = document.getElementById('incomeDetail');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          tooltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              data: [
                { value: 1048, name: '低保补助', color: '#617dd2' },
                { value: 735, name: '民政补助', color: '#addd8b' },
                { value: 580, name: '雨露计划补助', color: '#fadc74' },
                { value: 484, name: '医疗补助', color: '#ee7874' },
                { value: 300, name: '中蜂折股量化补助', color: '#91d2f0' },
                { value: 300, name: '卫健局补助', color: '#61af81' },
              ],
            },
          ],
        };
        option && myChart.setOption(option);
      });
      this.avatarBridge = scope.row;
      this.getUserBasicInfo(scope.row);
      this.groupPage = 1;
      this.getGbjdListInfo();
      this.getDoctorListInfo();
      setTimeout(() => {
        this.sketchLoading = false;
      }, 500);
    },
    lookXkm(scope) {
      this.$router.push({
        name: 'householdInformationonePrev',
        query: {
          id: scope.row.ID,
          address: scope.row.Address,
          card: scope.row.Card,
          name: scope.row.TName,
          isprint: 'true',
        },
      });
    },
    handleCurrentChangeDistribute(e) {
      this.distributePage = e;
      this.getDistributeTable();
    },
    changeHospital(e) {
      this.hospitalPage = 1;
      this.hospitalYear = e;
      this.getDoctorDetailInfo();
    },
    handleCurrentChangeHospital(e) {
      this.hospitalPage = e;
      this.getDoctorDetailInfo();
    },
    // 选择结对医生时间
    changeDoctorYear(e) {
      this.doctorPage = 1;
      this.doctorYear = e;
      this.getDoctorListInfo();
    },
    // 选择医生结对
    handleCurrentChangeDoctor(e) {
      this.doctorPage = e;
      this.getDoctorListInfo();
    },
    // 选择结对干部年份
    changeGroupTime(e) {
      this.groupPage = 1;
      this.groupYear = e;
      this.getGbjdListInfo();
    },
    // 搜索按钮点击
    handleSearch() {
      this.currentPage = 1;
      this.getListInfo();
    },
    changFormTown(e) {
      this.formData.village = '';
      this.getVillageList(e);
    },
    // 改变搜索中的乡镇
    changeTownType(e) {
      this.villageTypeValue = '';
      this.getVillageList(e);
    },
    // 获取乡村信息
    getVillageList(e) {
      let data = {
        town_id: e,
      };
      VillageInfo(data).then((res) => {
        let addressInfo = checkIdenity();
        if (addressInfo && addressInfo.village_id) {
          this.villageType = res.data.filter((ele) => {
            return ele.id == addressInfo.village_id;
          });
          if (this.townTypeValue) {
            this.villageTypeValue = addressInfo.village_id;
          }
        } else {
          this.villageType = res.data;
        }
      });
    },
    //  获取城镇信息
    getTownList() {
      TownInfo().then((res) => {
        let addressInfo = checkIdenity();
        if (addressInfo && addressInfo.town_id) {
          this.townType = res.data.filter((ele) => {
            return ele.id == addressInfo.town_id;
          });
          this.townTypeValue = addressInfo.town_id;
          this.getVillageList(addressInfo.town_id);
        } else {
          this.townType = res.data;
        }
      });
    },
    // 获取列表信息
    getListInfo() {
      let data = {
        lb: this.userTypeValue ? this.userTypeValue : undefined,
        zt: this.listTypeValue ? this.listTypeValue : undefined,
        gx: this.typeValue ? this.typeValue : undefined,
        keyword: this.name ? this.name : undefined,
        town_id: this.townTypeValue ? this.townTypeValue : undefined,
        village_id: this.villageTypeValue ? this.villageTypeValue : undefined,
        page: this.currentPage,
        page_size: this.pageSize,
      };
      ListUser(data).then((res) => {
        this.basicTable = res.data.data;
        this.total = res.data.total;
      });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.getListInfo();
    },
    handleCurrentChangeGroup(e) {
      this.groupPage = e;
      this.getGbjdListInfo();
    },
    dialogLink(scope) {
      // 获取用户信息
      this.lookVisible = true;
      this.row = scope.row;
      this.getUserBasicInfo(scope.row);
      this.getGbjdListInfo();
      this.getDoctorListInfo();
      this.getDoctorDetailInfo();
      this.initDistributeData();
    },
    initDistributeData() {
      this.activeName = 'fourth';
      this.siderBarActive = 0;
      this.tabArray = [
        // {
        //   name: "first",
        //   label: "民政局"
        // },
        // {
        //   name: "second",
        //   label: "教育局"
        // },
        // {
        //   name: "third",
        //   label: "住建局"
        // },
        {
          name: 'fourth',
          label: '医保局',
        },
        // {
        //   name: "fifth",
        //   label: "卫健局"
        // },
        {
          name: 'sixth',
          label: '残联',
        },
      ];
      if (this.activeName == 'first') {
        this.sideBarArray = [
          {
            name: '低保户',
          },
          {
            name: '低边户',
          },
          {
            name: '特困户',
          },
        ];
      } else if (this.activeName == 'second') {
        this.sideBarArray = [
          {
            name: '教育补贴',
          },
        ];
      } else if (this.activeName == 'third') {
        this.sideBarArray = [
          {
            name: '危旧房补助',
          },
          {
            name: '公租房补助',
          },
        ];
      } else if (this.activeName == 'fourth') {
        this.sideBarArray = [
          {
            name: '医疗救助',
          },
          //   {
          //     name: "参保名单"
          //   },
        ];
      } else if (this.activeName == 'fifth') {
        this.sideBarArray = [
          {
            name: '医生名单',
          },
        ];
      } else if (this.activeName == 'sixth') {
        this.sideBarArray = [
          {
            name: '助学补贴',
          },
          {
            name: '就业创业',
          },
          {
            name: '辅具补贴',
          },
          {
            name: '两项补贴',
          },
        ];
      }
      this.file_type = '6';
      this.getDistributeTable();
    },
    getDistributeTable() {
      let data = {
        page: this.distributePage,
        Card: this.row.Card,
        page_size: this.distributePageSize,
        file_type: this.file_type,
        year: this.distributeYear ? this.distributeYear : new Date().getFullYear(),
      };
      userInfoZjqk(data).then((res) => {
        if (res.code === 0) {
          //   console.log(res);
          this.distributeTable = res.data;
          // this.distributeTotal = res.data.list.total;
        }
      });
    },
    // 获取就医详情列表
    getDoctorDetailInfo() {
      let data = {
        page: this.hospitalPage,
        Card: this.row.Card,
        page_size: this.pageSize,
        year: this.hospitalYear ? this.hospitalYear : new Date().getFullYear(),
      };
      GetDoctorDetailInfo(data).then((res) => {
        if (res.code == 0) {
          this.hospitalTotal = res.data.total;
          this.seeDoctorTable = res.data.data;
        }
      });
    },
    // 获取列表信息
    getDoctorListInfo() {
      let data = {
        Card: this.row.Card,
        year: this.doctorYear ? this.doctorYear : new Date().getFullYear(),
        page: this.doctorPage,
        page_size: this.pageSize,
      };
      GetDoctorInfo(data).then((res) => {
        if (res.code === 0) {
          this.doctorTable = res.data;
          this.doctorTotal = res.data.list.total;
        }
      });
    },
    // 获取用户基础信息
    getUserBasicInfo(row) {
      let data = {
        Card: row.Card,
      };
      GetBaseInfo(data).then((res) => {
        if (res.code === 0) {
          this.lookTitle = res.data.TName + '用户信息';
          this.userInfo = res.data;
          this.familyTable = res.data.family_list;
        }
      });
    },
    // 获取干部结对列表
    getGbjdListInfo() {
      let data = {
        Card: this.row.Card,
        year: this.groupYear ? this.groupYear : new Date().getFullYear(),
        page: this.groupPage,
        page_size: this.groupPageSize,
      };
      GetGBJDInfo(data).then((res) => {
        if (res.code == 0) {
          this.pairingTable = res.data;
          this.groupTotal = res.data.list.total;
        }
      });
    },
    chooseList(index) {
      this.sendList[index].choose = !this.sendList[index].choose;
    },
    setDialogVisible(status, scope) {
      this.dialogVisible = true;
      this.dialogTitle = status == 1 ? '新增农户档案' : '修改农户档案';
      this.isAdd = status == 1 ? true : false;
      if (scope) {
        this.updateSetFormData(scope.row);
      }
    },
    updateSetFormData(row) {
      this.getVillageList(row.XZID);
      this.formData = {
        personType: row.LB,
        accountNum: row.HBH,
        name: row.TName,
        idCard: row.Card,
        town: row.XZID,
        address: row.Address,
        isDeal: row.IsSW,
        lowNumber: row.DBBH,
        Disability: row.CJBH,
        Paired: row.JDGB,
        signDoctor: row.QYYS,
        status: row.ZT,
        host: row.GX,
        personNum: row.RBH,
        sex: row.SEX == '男' ? 1 : 2,
        link: row.Tel,
        village: row.XCID,
        personInfo: row.BZRS,
        isParty: row.IsDY,
        salvageNum: row.JZBH,
        partyCompany: row.JDDW,
        partyLink: row.JDGBtel,
        doctorLink: row.QYYSTel,
        increment: row.ZS,
        imageUrl: row.image,
        imageId: row.Image_id,
        reason: row.ZPYY,
        measures: row.BFCS,
        remark: row.Content,
        cancelTime: row.cancel_at,
        cancellation: row.ZXYY,
      };
      if (this.formData.partyCompany) {
        this.searchPairedOrDoctor(1, this.formData.partyCompany);
      } else if (this.formData.signDoctor) {
        this.searchPairedOrDoctor(2, this.formData.signDoctor);
      }
      this.userID = row.ID;
    },
    submitForm(formData) {
      if (this.isError) {
        return;
      }
      this.$refs[formData].validate((valid) => {
        if (valid) {
          // 成功
          let data = {
            // 人员类型
            LB: this.formData.personType,
            // 与户主关系
            GX: this.formData.host,
            // 户编号
            HBH: this.formData.accountNum,
            // 人编号
            RBH: this.formData.personNum,
            // 姓名
            TName: this.formData.name,
            // 性别
            SEX: this.formData.sex == 1 ? '男' : '女',
            // 身份证号
            Card: this.formData.idCard,
            // 联系方式
            Tel: this.formData.link,
            // 乡镇id
            XZID: this.formData.town,
            // 行政村id
            XCID: this.formData.village,
            // 家庭地址
            Address: this.formData.address,
            // 保障人数
            BZRS: this.formData.personInfo,
            // 是否死亡
            IsSW: this.formData.isDeal,
            // 是否党员
            IsDY: this.formData.isParty,
            // 低保编号
            DBBH: this.formData.lowNumber ? this.formData.lowNumber : '',
            // 救助证编号
            JZBH: this.formData.salvageNum ? this.formData.salvageNum : '',
            // 残疾证编号
            CJBH: this.formData.Disability ? this.formData.Disability : '',
            // 结对单位
            JDDW: this.formData.partyCompany ? this.formData.partyCompany : '',
            // 结对干部
            JDGB: this.formData.Paired ? this.formData.Paired : '',
            // 干部联系方式
            JDGBtel: this.formData.partyLink ? this.formData.partyLink : '',
            // 签约医生
            QYYS: this.formData.signDoctor ? this.formData.signDoctor : '',
            // 签约医生联系方式
            QYYSTel: this.formData.doctorLink ? this.formData.doctorLink : '',
            // 是否脱贫
            ZT: this.formData.status != '' ? this.formData.status : '',
            // 是否抱团
            ZS: this.formData.increment != '' ? this.formData.increment : '',
            // 注销原因
            ZXYY: this.formData.status == 3 ? this.formData.cancellation : '',
            // 注销时间
            cancel_at: this.formData.status == 3 ? this.formData.cancelTime : '',
            // 致贫原因
            ZPYY: this.formData.reason ? this.formData.reason : '',
            // 帮扶措施
            BFCS: this.formData.measures ? this.formData.measures : '',
            // 备注
            Content: this.formData.remark ? this.formData.remark : '',
            // 图片id
            Image_id: this.formData.imageId ? this.formData.imageId : '',
          };
          if (this.isAdd) {
            AddUser(data).then((res) => {
              if (res.code === 0) {
                this.$message.success('添加成功');
                this.setFormData();
                this.$refs[formData].resetFields();
                this.dialogVisible = false;
                this.getListInfo();
              }
            });
          } else {
            // 修改
            EditUser({ ID: this.userID, ...data }).then((res) => {
              if (res.code == 0) {
                this.$message.success('编辑成功');
                this.setFormData();
                this.$refs[formData].resetFields();
                this.dialogVisible = false;
                this.getListInfo();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    setFormData() {
      this.formData = {
        personType: '',
        accountNum: '',
        name: '',
        idCard: '',
        town: '',
        address: '',
        isDeal: 0,
        lowNumber: '',
        Disability: '',
        Paired: '',
        signDoctor: '',
        status: 1,
        cancellation: '',
        host: '',
        personNum: '',
        sex: 1,
        link: '',
        village: '',
        personInfo: '',
        isParty: 0,
        salvageNum: '',
        partyCompany: '',
        partyLink: '',
        doctorLink: '',
        increment: 1,
        cancelTime: '',
        imageUrl: '',
        imageId: '',
        reason: '',
        measures: '',
        remark: '',
      };
    },
    resetForm(formData) {
      this.setFormData();
      this.$refs[formData].resetFields();
      this.dialogVisible = false;
    },
    handleAvatarSuccess(res) {
      const { width, height, url, id } = res.data;
      //   if (width != 150 && height != 120) {
      //     this.$message.error("您上传的图片宽高不符合150x120");
      //   } else {
      this.formData.imageUrl = url;
      this.formData.imageId = id;
      //   }
    },
    // 上传
    handleBeforeUpload(file) {},
    // 上传文件
    uploadFile(res) {
      if (res.code === 0) {
        this.$message.success('导入成功');
        this.currentPage = 1;
        this.getListInfo();
      }
    },
    deleteTable(scope) {
      this.$confirm('您确定要删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let data = {
          ID: scope.row.ID,
        };
        DeleteUser(data).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getListInfo();
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.distributeLinkCount {
  margin-top: 20px;
  margin-bottom: 20px;
}
.tabCustom {
  margin-top: 20px;
  margin-bottom: 20px;
}
.distributeHeadCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  .distributeHeadItem {
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 10px;
  }
  .distributeHeadActive {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
}
.distributeTableCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
  .switchDistributeCon {
    margin-right: 20px;
  }
  .distributeItem {
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .distributeActive {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
}
.sketchCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
  li {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    span {
      font-size: 18px;
      text-align: left;
      color: #333;
    }
  }
}
.sketch-header-title {
  font-size: 18px;
  text-align: left;
  color: #999;
  width: 130px;
}
.scrollInner {
  height: 240px;
  overflow-y: auto;
  .templateAllCon {
  }
}
.human {
  width: 398px;
  height: 583px;
  margin-top: 90px;
}
.leftImgCon {
  position: absolute;
  left: 36px;
  top: 40px;
  width: 160px;
  height: 207px;
}
.leftImgBack {
  width: 160px;
  height: 207px;
}
.leftImgRealHolder {
  position: absolute;
  left: 35px;
  top: 50px;
  width: 90px;
  height: 90px;
  left: 10px;
  top: 8px;
  width: 140px;
  height: 190px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.leftImgReal {
  position: absolute;
  left: 10px;
  top: 8px;
  width: 140px;
  height: 190px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.rightImgCon {
  position: absolute;
  right: 11px;
  top: 60px;
  width: 160px;
  height: 160px;
}
.rightImgBack {
  width: 160px;
  height: 160px;
}
.rightImgReal {
  position: absolute;
  left: 5px;
  top: 5px;
  width: 150px;
  height: 150px;
}
.sketchLeft {
  background-color: #fff;
  width: 525px;
  box-sizing: border-box;
  padding-top: 30px;
  height: 740px;
  text-align: center;
  position: relative;
}
#mainChart {
  width: 900px;
  height: 600px;
}
.commonMargin {
  margin-top: 24px;
  margin-bottom: 40px;
}
.commonMargin1 {
  margin-top: 26px;
}
.sketchLeftBottom {
  padding-left: 50px;
  box-sizing: border-box;
}
.commonSubTitle {
  font-size: 22px;
  text-align: left;
  color: #333;
  position: relative;
  height: 40px;
  &::after {
    position: absolute;
    left: 0;
    top: 30px;
    content: ' ';
    width: 90px;
    height: 4px;
    background-color: #3178d0;
  }
}
.sketchRightBottom {
  padding-left: 50px;
  box-sizing: border-box;
}
.sketchRight {
  background-color: #fff;
  width: 1000px;
  box-sizing: border-box;
  padding: 50px;
  padding-top: 20px;
  height: 740px;
}
.sketchContentArea {
  padding-top: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
  .sketchContentLeftPart {
    width: 50%;
  }
  .sketchContentRightPart {
    width: 50%;
  }
}
.sketchTitle {
  //   font-size: 26px;
  //   font-weight: 600;
  //   text-align: center;
  //   color: #034392;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  img {
    width: 25px;
    height: 25px;
    margin-right: 5px;
  }
  span {
    font-size: 22px;
    color: #333;
  }
}
.cursorImg {
  cursor: pointer;
}
.basic-files {
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
    flex-wrap: wrap;
    overflow: hidden;
    .basic-select {
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
  .basic-second {
    width: 95%;
    margin: 0px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .basic-input {
      width: 196px;
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
  .basic-btn {
    margin-bottom: 20px;
    margin-right: 15px;
  }
  .basic-table {
    width: 95%;
    margin: 20px auto;
  }
}
.basic-dialog {
  width: 100%;
  display: flex;
  flex-direction: column;
  .basic-dialog-two {
    width: 100%;
    display: flex;
    flex-direction: row;
    .basic-tow-left {
      width: 42%;
      display: flex;
      flex-direction: column;
    }
    .basic-two-right {
      width: 44%;
      display: flex;
      flex-direction: column;
    }
    .basic-right {
      width: 14%;
      height: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
.basic-ipt {
  width: 300px;
}
// .basic-ipt {
//   width: 204px;
//   .el-input__inner {
//     height: 35px;
//     line-height: 35px;
//   }
// }
.basic-red {
  color: red;
  margin-left: 5px;
}
.basic-dialog-info {
  width: 92%;
  display: flex;
  flex-direction: column;
  margin: 20px auto 0px auto;
}
.basic-bold {
  font-weight: bold;
}
.basic-area {
  margin-top: 15px;
}
.basic-form-btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
<style lang="scss" scope>
// .basic-select {
//   .el-input__inner {
//     height: 35px;
//     line-height: 35px;
//   }
//   .el-input__suffix {
//     top: 3px;
//   }
// }
// .basic-input {
//   .el-input__inner {
//     height: 35px;
//     line-height: 35px;
//   }
// }
.basic-search {
  // width: 204px;
  margin-bottom: 20px;
}
.el-select .el-input .el-select__caret.is-reverse {
  margin-top: -4px;
}

.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 120px;
  display: block;
}
.basic-link {
  color: #409eff;
  cursor: pointer;
}
.look-user {
  width: 100%;
  display: flex;
  flex-direction: column;
  .look-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    .look-header-left {
      width: 40%;
      height: 360px;
      display: flex;
      flex-direction: column;
      li {
        width: 100%;
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        em {
          font-style: normal;
          margin-left: 10px;
        }
      }
      .look-header-title {
        width: 120px;
        text-align: right;
      }
    }
    .look-header-pic {
      width: 20%;
      height: 360px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      img {
        width: 150px;
        height: 200px;
      }
    }
  }
  .look-weight {
    font-weight: bold;
    font-size: 16px;
  }
  p {
    margin: 10px 0px;
  }
  .group-team {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    .group-span {
      font-weight: bold;
      font-size: 16px;
    }
    .group-date {
      margin-left: 10px;
    }
    .group-year {
      margin: 0px 10px;
    }
  }
}
.group-team-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  .group-info-left {
    width: 150px;
    display: flex;
    flex-direction: column;
    li {
      height: 30px;
      margin-bottom: 5px;
      border: #eee solid 1px;
      list-style: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .group-active {
      background: #409eff;
      color: #fff;
      border: #409eff solid 1px;
    }
  }
}
.group-infomation {
  width: 88%;
  margin-left: 2%;
  display: flex;
  flex-direction: column;
}
.group-total {
  height: 50px;
  margin-left: 2%;
  display: flex;
  flex-direction: row;
  align-items: center;
  .group-total-span {
    margin-left: 43.5%;
    font-weight: bold;
  }
  .group-total-money {
    font-size: 16px;
    font-style: normal;
    margin-left: 13%;
  }
}
.group-close {
  width: 180px;
  margin: 20px auto 0px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.look-content {
  width: 88%;
  display: flex;
  flex-direction: column;
  margin: 0px auto;
}
.content-scope {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  img {
    height: 80px;
    margin: 0px 5px;
  }
}
.pagination-info {
  width: 98%;
  margin: 0px 2% 20px 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.pagination-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.pagination-goto {
  width: 60px;
  margin-right: 20px;
}
.xkm-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.xkm-ewm {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .xkm-code-bg {
    width: 80%;
    margin: 20px auto;
  }
  .xkm-id-info {
    width: 140px;
    height: 140px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -70px;
    margin-left: -70px;
  }
  .xkm-address {
    position: absolute;
    top: 68%;
    left: 18%;
    display: flex;
    flex-direction: column;
    color: #000;
    font-size: 18px;
    line-height: 30px;
  }
}
.basic-infoma {
  // width: 150px;
  // height: 35px;
  position: relative;
  overflow: hidden;
  margin-left: 15px;
}
.export-info {
  display: flex;
  flex-direction: row;
}
.basic-upload {
  width: 150px;
  height: 35px;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0;
  .el-upload {
    width: 100%;
    height: 35px;
  }
}
.basic-files {
  .sketchDialog {
    .el-dialog {
      background-color: #f6f8fa;
      margin-top: 1vh !important;
      height: 810px;
    }
  }
  .sketchRight {
    .el-tabs__item.is-active {
      color: #034392;
    }
    .el-tabs__item {
      color: #999;
      font-size: 22px;
      margin-bottom: 10px;
    }
    .el-tabs__active-bar {
      background-color: #034392;
      height: 4px;
    }
  }
}
.portrait-dialog {
  width: 75%;
  height: 720px;
  background: #060d33;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  z-index: 9999;
  overflow: hidden;
  i {
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    position: absolute;
    top: 18px;
    right: 40px;
    cursor: pointer;
    transition: all 0.3s;
    display: block;
    z-index: 999;
  }
  i:hover {
    color: #ffd449;
    transform: rotate(90deg);
  }
  .header {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .tab {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    font-size: 20px;
    font-weight: bold;
    padding: 0 20%;
    z-index: 99;
    span {
      cursor: pointer;
      color: #fff;
      transition: all 0.3s;
    }
    .is-select {
      color: #ffd449;
    }
  }

  .box1 {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .head-photo {
      width: 110px;
      height: 150px;
      position: absolute;
      top: 80px;
      left: 33%;
      background: url(https://img.hzanchu.com/acimg/dcd1c3a4d1705502e188d2287706675f.png) no-repeat;
      background-size: 100%;
      img {
        width: 90px;
        height: 120px;
        margin: 15px auto 0;
        display: block;
      }
    }
    .qrcode {
      width: 110px;
      height: 110px;
      position: absolute;
      top: 90px;
      left: 55%;
      background: url(https://img.hzanchu.com/acimg/8469a6527cc5bcdcc59e28cd0d6d3990.png) no-repeat;
      background-size: 100%;
      img {
        width: 90px;
        height: 90px;
        margin: 10px auto 0;
        display: block;
      }
    }
    .model {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 100%;
    }
    .left {
      width: 332px;
      overflow: hidden;
      float: left;
      margin-left: 40px;

      .jibenxinxi {
        height: 247px;
        background: url(https://img.hzanchu.com/acimg/3666af56ed8f8023d7e17c3f516f829a.png) no-repeat;
        background-size: 100%;
        margin-top: 100px;
      }
      .zhipinyuanyin {
        height: 116px;
        background: url(https://img.hzanchu.com/acimg/8438631b3ba3d5327f77e293ac825222.png) no-repeat;
        background-size: 100%;
        margin-top: 30px;
      }
      .chanyebangfu {
        height: 156px;
        background: url(https://img.hzanchu.com/acimg/84ec24a795292bfcc3daf591f654dd19.png) no-repeat;
        background-size: 100%;
        margin-top: 30px;
      }
    }
    .right {
      width: 332px;
      overflow: hidden;
      float: right;
      margin-right: 40px;
      .jieduiganbu {
        height: 136px;
        background: url(https://img.hzanchu.com/acimg/84ec24a795292bfcc3daf591f654dd19.png) no-repeat;
        background-size: 100%;
        margin-top: 100px;
      }
      .qianyueyisheng {
        height: 116px;
        background: url(https://img.hzanchu.com/acimg/8438631b3ba3d5327f77e293ac825222.png) no-repeat;
        background-size: 100%;
        margin-top: 30px;
      }
      .jiatingchengyuan {
        height: 116px;
        background: url(https://img.hzanchu.com/acimg/8438631b3ba3d5327f77e293ac825222.png) no-repeat;
        background-size: 100%;
        margin-top: 30px;
      }
      .butieshouru {
        height: 116px;
        background: url(https://img.hzanchu.com/acimg/8438631b3ba3d5327f77e293ac825222.png) no-repeat;
        background-size: 100%;
        margin-top: 30px;
      }
    }
    .info {
      width: 100%;
      overflow: hidden;
      div {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        line-height: 50px;
      }
      p {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        span:nth-of-type(1) {
          display: block;
          width: 100px;
          font-size: 14px;
          color: #fff;
          margin-left: 52px;
        }
        span:nth-of-type(2) {
          font-size: 14px;
          color: #01f5f2;
          margin-left: 20px;
        }
      }
    }
  }
  .box2 {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .model {
      height: 100%;
      margin: 0 0 0 -260px;
      float: left;
    }
    .chart {
      float: left;
      width: 360px;
      height: 360px;
      position: absolute;
      left: 460px;
      top: 50%;
      transform: translateY(-50%);
      .content {
        position: relative;
        width: 360px;
        height: 360px;
        .income-detail {
          width: 360px;
          height: 360px;
        }
        .price {
          font-size: 38px;
          font-weight: 600;
          color: #f3c86b;
          position: absolute;
          left: 50%;
          top: 40%;
          transform: translateX(-50%);
        }
        .label {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          position: absolute;
          left: 50%;
          top: 56%;
          transform: translateX(-50%);
        }
      }
    }
    .list {
      overflow: hidden;
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateY(-50%);
      width: 340px;
      .item {
        display: flex;
        align-items: center;
        margin-top: 30px;
        div:nth-of-type(1) {
          width: 5px;
          height: 40px;
          border-radius: 2px;
        }
        div:nth-of-type(2) {
          margin-left: 20px;
          p:nth-of-type(1) {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
          }
          p:nth-of-type(2) {
            font-size: 16px;
            font-weight: 700;
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>

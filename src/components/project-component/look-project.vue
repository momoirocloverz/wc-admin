<template>
    <el-dialog
        :visible="lookData.visible"
        :title="lookData.title"
        :width="lookData.width"
        @close="cancelLook"
        >
        <div class="look-project">
            <!-- 基础信息 -->
            <div class="project-basic clear-padding">
                <p class="basic-weight">基本信息</p>
                <p class="basic-title">这是测试这是测试这是测试这是测试这是测试这是测试这是测试这是测试这是测试</p>
                <ul class="basic-ul">
                    <li>
                        <span>年 份：</span>
                        <em>2020年</em>
                    </li>
                    <li>
                        <span>项目类别：</span>
                        <em>产业发展类</em>
                    </li>
                    <li>
                        <span>项目名称：</span>
                        <em>这是个测试项目</em>
                    </li>
                    <li>
                        <span>实施单位：</span>
                        <em>文成县大元测试单位</em>
                    </li>
                    <li>
                        <span>乡镇：</span>
                        <em>南田镇</em>
                    </li>
                    <li>
                        <span>实施地点：</span>
                        <em>南天镇黄花村</em>
                    </li>
                    <li>
                        <span>总投资：</span>
                        <em>17万元</em>
                    </li>
                    <li>
                        <span>补助资金：</span>
                        <em>11万元</em>
                    </li>
                    <li>
                        <span>资金来源：</span>
                        <em>县级资金</em>
                    </li>
                    <li>
                        <span>项目计划文件：</span>
                        <em>文农字[2020] 125号</em>
                    </li>
                    <li>
                        <span>项目资金文件：</span>
                        <em>文农字[2020] 164号</em>
                    </li>
                    <li>
                        <span>建设周期：</span>
                        <em>12个月</em>
                    </li>
                    <li>
                        <span>预计竣工日期：</span>
                        <em>2021-12-30</em>
                    </li>
                    <li>
                        <span>开始建设日期：</span>
                        <em>2020-04-02</em>
                    </li>
                    <li>
                        <span>实际竣工日期：</span>
                        <em>2021-12-30</em>
                    </li>
                    <li>
                        <span>项目负责人：</span>
                        <em>赵东夏</em>
                    </li>
                    <li>
                        <span>负责人电话：</span>
                        <em>686002</em>
                    </li>
                    <li>
                        <span>项目联系人：</span>
                        <em>钟伟杰</em>
                    </li>
                    <li>
                        <span>联系人电话：</span>
                        <em>6644441</em>
                    </li>
                    <li>
                        <span>项目状态：</span>
                        <em>已开工</em>
                    </li>
                </ul>
            </div> 
            <!-- 建设内容 -->
            <div class="project-basic">
                <p class="basic-weight">建设内容</p>
                <div class="basic-content">这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容</div>
            </div>
            <!-- 验收时间 -->
            <div class="project-basic">
                <p class="basic-weight">验收时间：<span>2021-04-02</span></p>
            </div>
            <!-- 验收内容 -->
            <div class="project-basic">
                <p class="basic-weight">验收内容</p>
                <div class="basic-content">这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容</div>
            </div>
            <!-- 备注 -->
            <div class="project-basic">
                <p class="basic-weight">备注</p>
                <div class="basic-content">这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容</div>
            </div>
            <!-- 项目进度记录 -->
            <div class="project-basic">
                <div class="basic-ul">
                    <div :class="[chooseTab==index?'basic-tab basic-active':'basic-tab']" v-for="(item,index) in tabList" :key="index" @click="chooseBasic(index)">{{item}}</div>
                </div>
                <el-table>
                    <el-table-column prop="recordNo" label="记录编号" width="100"></el-table-column>
                    <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
                    <el-table-column prop="company" label="实施单位" align="center"></el-table-column>
                    <el-table-column prop="progressDesc" label="项目进度描述" align="center"></el-table-column>
                    <el-table-column prop="writer" label="填写人" align="center"></el-table-column>
                    <el-table-column prop="writeTime" label="填写时间" align="center"></el-table-column>
                    <el-table-column prop="recordTime" label="记录生成时间" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name:'lookproject',
    props:{
        lookData:{
            type:Object,
            required:true
        }
    },
    data(){
        return{
            chooseTab:0,
            tabList:['项目进度记录','项目督查记录']
        }
    },
    methods:{
        chooseBasic(index){
            this.chooseTab=index;
        },
        cancelLook(){
            this.$emit('handleCancel')
        }
    }
}
</script>
<style lang="scss" scoped>
    .look-project{
        width: 100%;
        display: flex;
        flex-direction: column;
        .project-basic{
            width: 100%;
            display: flex;
            flex-direction: column;
            border-bottom: #ccc solid 1px;
            padding: 20px 0px;
        }
        .basic-ul{
            display: flex;
            flex-direction: row;
            align-items: center;
            .basic-tab{
                width: 120px;
                height: 30px;
                line-height: 30px;
                background: #fff;
                color: #333;
                text-align: center;
                cursor: pointer;
            }
            .basic-active{
                background:#409eff;
                color: #fff;
                border-radius: 2px;
            }
        }
        .clear-padding{
            padding-top: 0px;
        }
        .basic-weight{
            font-size: 18px;
            font-weight: bold;
            margin: 0px;
            span{
                font-weight: normal;
            }
        }
        .mb20{
            margin-bottom: 20px;
        }
        .basic-title{
            text-align: center;
        }
        .basic-ul{
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-bottom: 0px;
            li{
                width: 50%;
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 10px 0px;
                span{
                    width: 120px;
                    text-align: right;
                }
                em{
                    font-style: normal;
                }
            }
        }
        .basic-content{
            font-size: 14px;
            line-height: 28px;
            margin-top: 10px;
        }
    }
</style>    
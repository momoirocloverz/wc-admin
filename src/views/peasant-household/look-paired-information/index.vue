<template>
    <div class="look-paired">
        <div class="look-paired-header">
            <div class="look-header-left">
                <el-input type="text" placeholder="请输入姓名或户号" v-model="userName" class="look-header-ipt"/>
                <el-button type="primary" class="look-header-btn" @click="searchVisitList">搜索</el-button>
            </div>
            <div class="look-header-right">
                <el-button>批量导出</el-button>
            </div>
        </div>
        <div class="look-paired-content">
            <div class="look-paired-top">
                <span class="look-paired-title">标题：干部结对</span>
                <div class="look-time">
                    <span>日期：</span>
                    <el-date-picker type="year" v-model="yearInfo" placeholder="请选择随访日期" value-format="yyyy" class="visit-time" @change="changeTime"></el-date-picker>
                </div>
                <span class="look-paired-title">所属单位：{{dept}}</span>
                <span class="look-paired-title1">干部姓名：{{pairedName}}</span>
                <span class="look-paired-title1">共计随访次数：{{visit_count}}</span>
            </div>
            <el-table :data="tableData">
                <el-table-column label="随访日期" prop="visit_at"></el-table-column>
                <el-table-column label="被随访姓名" prop="user_name"></el-table-column>
                <el-table-column label="随访内容">
                    <template slot-scope="scope">
                        <div class="content-infomation">
                            <span>{{scope.row.content}}</span>
                            <em class="content-look-pic" @click="lookPicInfo(scope)">查看图片</em>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <look-component :dialogData="dialogData" @closeDialogInfo="handleCloseDialog"></look-component>
    </div>
</template>
<script>
import LookComponent from '@/components/paired-component/paired-submit';
import {lookDoctorOrPaired} from '@/api/pairedOrDoctor';
export default {
    name:'lookpaired',
    data(){
        return{
            pairedName:this.$route.query.name,
            userName:'',
            yearInfo:'',
            tableData:[],
            dialogData:{
                imgSrc:'',
                visible:false,
                title:'查看图片',
                width:'40%',
                status:1
            },
            visit_count:0,
            dept:this.$route.query.dept,
        }
    },
    created(){
        this.lookPairedList();
    },
    methods:{
        searchVisitList(){
            this.lookPairedList();
        },
        changeTime(time){
            this.lookPairedList();
        },
        lookPairedList(){
            let data={
                type:1,
                visit_name:this.$route.query.name,
                user_name:this.userName,
                year:this.yearInfo?this.yearInfo:undefined
            };
            lookDoctorOrPaired(data).then(res=>{
                if(res.code===0){
                    this.tableData=res.data.list.data;
                    this.visit_count=res.data.visit_count;
                }
            });
        },
        // 关闭
        handleCloseDialog(){
            this.dialogData.visible=false;
        },
        lookPicInfo(scope){
            this.dialogData={
                imgSrc:scope.row.image,
                visible:true,
                title:'查看图片',
                width:'40%',
                status:1
            };
        },
        closePic(){
            this.visible=false;
        }
    },
    components:{
        LookComponent
    }
}
</script>
<style lang="scss" scoped>
    .look-paired{
        width: 98%;
        margin: 15px 0px 0px 15px;
        background: #fff;
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
        .look-paired-header{
            width: 95%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 0px auto;
        }
        .look-header-left{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 20px;
        }
        .look-header-ipt{
            width: 300px;
        }
        .look-header-btn{
            margin-left: 20px;
        }
        .look-header-right{
            margin-top: 20px;
        }
        .look-paired-content{
            width: 95%;
            display: flex;
            flex-direction: column;
            margin: 40px auto 0px auto;
        }
        .look-paired-top{
            width: 100%;
            height: 50px;
            display: flex;
            flex-direction: row;
            align-items: center;
            background: #eee;
        }
        .look-paired-title{
            margin-left: 20px;
            color: #333;
        }
        .look-paired-title1{
            margin-left: 50px;
            color: #333;
        }
        .look-time{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-left: 50px;
            color: #333;
        }
        .content-infomation{
            display: flex;
            flex-direction: row;
        }
        .content-look-pic{
            font-style: normal;
            margin-left: 20px;
            color: #409EFF;
            cursor: pointer;
        }
        .dialog-pic{
            width: 100%;
        }
    }
</style>
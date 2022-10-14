<template>
    <div class="rich-page">
        <div class="rich-page-info" v-html="richPage"></div>
    </div>
</template>
<script>
export default {
    name:'pageInfo',
    data(){
        return{
            richPage:sessionStorage.getItem('contentHtml')
        }
    }
}
</script>
<style lang="scss" scoped>
    .rich-page{
        width: 98%;
        height: 80vh;
        margin: 15px auto;
        background: #fff;
        padding: 20px 0px;
        .rich-page-info{
            width: 98%;
            padding-top: 0px;
            margin: 0px auto;
            display: flex;
            flex-direction: column;
        }
    }
</style>
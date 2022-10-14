<template>
    <div class="one-prev" v-loading="loading">
        <div style="display:flex;align-items:center;">
            <el-button type="primary" v-if="isPrint == 'true'" @click="printInfo">打印</el-button>
            <el-button @click="toBack">返回</el-button>
        </div>
        <div class="xkm-ewm" id="xkmCode" v-if="show">
            <div class="halfContainer" id="halfContainer" ref="halfContainer">
                <img :src="staticPic" class="xkm-code-bg" />
                <img @load="currentImgLoad" :src="dynamicLink + id" class="xkm-id-info" />
                <div class="xkm-address">
                    <div class="xkm-addressTitle">
                        <div>地址：</div>
                        <div class="xkm-addressDetail">{{ address }}</div>
                    </div>
                    <div class="xkm-addressTitle">
                        <div>姓名：</div>
                        <div
                            class="xkm-addressDetail"
                        >{{ name }}({{ card && card.slice(0, 10) }}****{{ card && card.slice(card.length - 4, card.length) }})</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fakeOuter halfContainer" v-if="theOneShow">
            <div class="target">
                <img ref="target" :src="newImg" />
            </div>
        </div>
    </div>
</template>
<script>
import html2canvas from 'html2canvas';
export default {
    name: "oneprevcode",
    data () {
        return {
            id: this.$route.query.id,
            address: this.$route.query.address,
            card: this.$route.query.card,
            name: this.$route.query.name,
            isPrint: this.$route.query.isprint,
            show: false,
            staticPic: require('@/assets/8dd.png'),
            showOrNot: false,
            newImg: '',
            theOneShow: false,
            loading: false,
            dynamicLink: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://wencheng-xkm.zjsszxc.com/#/home?id=',
        }
    },
    created () {
        // console.log('http://wencheng-xkm.anchu.vip');    
        this.loading = true
        this.show = true;
    },
    mounted () {
        this.setQrcodeLink()
    },
    methods: {
        setQrcodeLink () {
            if (process.env.NODE_ENV == 'production') {
                if (process.env.VUE_APP_TITLE == 'prod') {
                    this.dynamicLink = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://wencheng-xkm.zjsszxc.com/#/home?id=';
                } else {
                    this.dynamicLink = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=http://wencheng-xkm.anchu.vip/#/home?id=';                    
                }
            }
        },
        currentImgLoad () {
            this.loading = false
        },
        printInfo () {
            const that = this;
            this.loading = true
            if (this.theOneShow) {
                setTimeout(() => {
                    this.$print(this.$refs.target)
                    this.loading = false
                }, 100)
            } else {
                html2canvas(this.$refs.halfContainer, { useCORS: true, scale: 1 }).then((canvas) => {
                    let imgUrl = canvas.toDataURL('image/png');
                    that.newImg = imgUrl
                    this.theOneShow = true
                    this.show = false
                    setTimeout(() => {
                        this.$print(this.$refs.target)
                        this.loading = false
                    }, 1400)
                });
            }
        },
        toBack () {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="scss" scoped>
.fakeOuter {
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
}
.one-prev {
    width: 98%;
    margin: 15px 0px 0px 15px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0px;
}
.xkm-ewm {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    .halfContainer {
        position: relative;
        width: 500px;
        height: 400px;
        margin: 0 auto;
    }
    .xkm-code-bg {
        width: 100%;
    }
    .xkm-id-info {
        width: 132px;
        height: 132px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -66px;
        margin-left: -66px;
    }
    .xkm-address {
        position: absolute;
        bottom: 65px;
        left: 48px;
        color: #333;
        font-size: 21px;
        line-height: 24px;
        .xkm-addressTitle {
            display: flex;
            justify-content: flex-start;
            font-weight: 700;
        }
        .xkm-addressDetail {
            font-weight: 400;
        }
    }
}
</style>

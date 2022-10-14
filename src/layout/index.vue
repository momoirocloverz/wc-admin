<template>
  <div :class="classObj" class="app-wrapper out1Wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div class="mainLeft">
      <div :class="{ 'has-logo': showLogo }">
        <div class="sidebar-logo-container" :class="{ collapse: isCollapse }">
          <transition name="sidebarLogoFade">
            <span v-if="isCollapse" key="collapse" class="sidebar-logo-link" @click="toHome">
              <img v-if="logo" :src="logo" class="sidebar-logo" />
            </span>
            <span v-else key="expand" class="sidebar-logo-link" @click="toHome">
              <img v-if="logo" :src="logo" class="sidebar-logo" />
              <h1 class="sidebar-title">{{ title }}</h1>
            </span>
          </transition>
        </div>
        <el-menu text-color="#bfcbd9" active-text-color="#409EFF" :unique-opened="false" :collapse="isCollapse" :default-active="activeMenu" class="sidebar-container anotherSider" mode="vertical">
          <template v-for="(item, index) in routeList">
            <el-submenu :key="index" :index="item.path" v-if="item.children && item.children.length">
              <template slot="title"
                ><img class="iconImg" v-if="item.icon" :src="item.normalIcon" /><span slot="title">{{ item.name }}</span></template
              >
              <template v-for="(subItem, subIndex) in item.children">
                <el-submenu class="third" :key="subIndex" :index="subItem.path" v-if="subItem.children && subItem.children.length">
                  <template slot="title"
                    ><span slot="title">{{ subItem.name }}</span></template
                  >
                  <template v-for="(thirdItem, thirdIndex) in subItem.children">
                    <el-submenu class="fourth" :key="thirdIndex" :index="thirdItem.path" v-if="thirdItem.children && thirdItem.children.length">
                      <template slot="title"
                        ><span slot="title">{{ thirdItem.name }}</span></template
                      >
                      <template v-for="(fourthItem, fourthIndex) in thirdItem.children">
                        <el-menu-item :key="fourthIndex" :index="fourthItem.path" @click="clickFourth(fourthItem)">
                          <template
                            ><span slot="title">{{ fourthItem.name }}</span></template
                          >
                        </el-menu-item>
                      </template>
                    </el-submenu>
                    <el-menu-item class="thirdStyleItem" :key="thirdIndex" @click="clickThird(thirdItem)" :index="thirdItem.path" v-else>
                      <template slot="title"
                        ><span slot="title">{{ thirdItem.name }}</span></template
                      >
                      <template v-for="(fourthItem, fourthIndex) in thirdItem.children">
                        <el-menu-item :key="fourthIndex" :index="fourthItem.path">{{ fourthItem.name }}</el-menu-item>
                      </template>
                    </el-menu-item>
                  </template>
                </el-submenu>
                <el-menu-item v-else :key="subIndex" :index="subItem.path" @click="clickSub(subItem)" class="resetItem1">{{ subItem.name }}</el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item :key="index" :index="item.path" v-else @click="clickSingle(item)">
              <template
                ><img class="iconImg" v-if="item.icon" :src="item.icon" /><span slot="title">{{ item.name }}</span></template
              >
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>
<script>
import { Navbar, AppMain } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { getNavigateList } from '@/api/role';
import _ from 'lodash';
import { mapGetters } from 'vuex';
export default {
  name: 'Layout',
  components: {
    Navbar,
    AppMain,
  },
  data() {
    return {
      logo: 'https://img.hzanchu.com/acimg/0be4b8f839cbd41f4564f36b06bbad76.png',
      title: '',
      routeList: [],
      staticRouter: [],
    };
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      activeMenu: 'activeMenu',
    }),
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      };
    },
  },
  created() {
    this.navigator();
  },
  methods: {
    toHome() {
      const dynamicLink = sessionStorage.getItem('logoLink') ? sessionStorage.getItem('logoLink') : '';
      if (dynamicLink) {
        this.$store.commit('user/setMenuActive', dynamicLink);
        this.$router.push({
          path: dynamicLink,
        });
      }
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
    },
    clickSingle(item) {
      this.$store.commit('user/setMenuActive', item.path);
      this.$router.push(item.path);
    },
    clickSub(item) {
      this.$store.commit('user/setMenuActive', item.path);
      this.$router.push(item.path);
    },
    clickThird(item) {
      this.$store.commit('user/setMenuActive', item.path);
      this.$router.push(item.path);
    },
    clickFourth(item) {
      this.$store.commit('user/setMenuActive', item.path);
      this.$router.push(item.path);
    },
    setLogoLink() {
      if (this.routeList.length) {
        let track1 = this.routeList.find((ele) => {
          return ele.name == '数据服务';
        });
        let trackRealFirst = this.routeList[0];
        let trackRealSec = null;
        let trackRealThird = null;
        let trackRealFourth = null;
        let finalResFirst = null;
        if (trackRealFirst && trackRealFirst.children.length) {
          trackRealSec = trackRealFirst.children[0];
          if (trackRealSec.children && trackRealSec.children.length) {
            trackRealThird = trackRealSec.children[0];
            if (trackRealThird) {
              if (trackRealThird.children && trackRealThird.children.length) {
                trackRealFourth = trackRealThird.children[0];
              }
            }
          }
        }
        if (trackRealFourth && trackRealFourth.path) {
          finalResFirst = trackRealFourth.path;
        } else {
          if (trackRealThird && trackRealThird.path) {
            finalResFirst = trackRealThird.path;
          } else {
            if (trackRealSec && trackRealSec.path) {
              finalResFirst = trackRealSec.path;
            } else {
              finalResFirst = trackRealFirst.path;
            }
          }
        }
        sessionStorage.setItem('logoLink', finalResFirst);
        if (track1) {
          if (track1.children && track1.children.length) {
            let track2 = track1.children.find((ele) => {
              return ele.name == '农户信息';
            });
            if (track2) {
              if (track2.children && track2.children.length) {
                let track3 = track2.children.find((ele) => {
                  return ele.name == '农户基础档案';
                });
                if (track3) {
                  sessionStorage.setItem('logoLink', track3.path);
                }
              }
            }
          }
        }
      }
    },
    navigator() {
      getNavigateList().then((res) => {
        let btnPermise = [];
        if (res.code == 0) {
          let original = _.cloneDeep(res.data);
          function loopMenuItem(ele) {
            if (ele.children && ele.children.length) {
              let empty = [];
              ele.children.forEach((sub, index) => {
                if (sub.type == 'LIST') {
                  empty.push(sub);
                }
                ele.children = empty;
                loopMenuItem(sub);
              });
            }
          }
          original.forEach((ele) => {
            loopMenuItem(ele);
          });

          let firstGuy = original.find((ele) => {
            return ele.name == '产业帮扶';
          });
          if (firstGuy) {
            firstGuy.icon = 'https://img.hzanchu.com/acimg/fe1807ae3cc3d750d1420922456cc8ea.png';
            firstGuy.normalIcon = 'https://img.hzanchu.com/acimg/1918a9644f5540e1bfc617da78fa7e83.png';
          }

          let secondGuy = original.find((ele) => {
            return ele.name == '多元增收';
          });
          if (secondGuy) {
            secondGuy.icon = 'https://img.hzanchu.com/acimg/0101500258d8344ab7378c7b0f05f8db.png';
            secondGuy.normalIcon = 'https://img.hzanchu.com/acimg/1133f259000c4dee5c9e0a8d99e45dce.png';
          }

          let thirdGuy = original.find((ele) => {
            return ele.name == '信息动态';
          });
          if (thirdGuy) {
            thirdGuy.icon = 'https://img.hzanchu.com/acimg/f6d18715bdccb09a147f6d2809ff27ca.png';
            thirdGuy.normalIcon = 'https://img.hzanchu.com/acimg/111a6e9d46480483e05b94723590d94f.png';
          }

          let fourthGuy = original.find((ele) => {
            return ele.name == '数据服务';
          });
          if (fourthGuy) {
            fourthGuy.icon = 'https://img.hzanchu.com/acimg/d53bbeaf77a6cda11b6cc47dcc58b836.png';
            fourthGuy.normalIcon = 'https://img.hzanchu.com/acimg/cfa18bc0fc83d21480630cd017fea2cc.png';
          }

          let fifthGuy = original.find((ele) => {
            return ele.name == '权限设置';
          });
          if (fifthGuy) {
            fifthGuy.icon = 'https://img.hzanchu.com/acimg/0ca047dbc58250e70c7bbac38e1f2493.png';
            fifthGuy.normalIcon = 'https://img.hzanchu.com/acimg/eda3921551ccad8bc31fde9ab9114617.png';
          }

          this.routeList = original;
          let empty = [];
          function loopItem(ele) {
            if (ele.children && ele.children.length) {
              ele.children.forEach((sub) => {
                if (sub.type == 'BUTTON') {
                  empty.push(sub);
                }
                loopItem(sub);
              });
            }
          }
          res.data.forEach((ele) => {
            loopItem(ele);
          });
          empty.map((items) => {
            btnPermise.push(items.id);
          });
          this.$store.dispatch('option/commitAction', btnPermise);
          sessionStorage.setItem('option', JSON.stringify(btnPermise));
          this.setLogoLink();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.mainLeft {
  transition: width 0.28s;
  //   width: $sideBarWidth !important;
  background-color: $menuBg;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  overflow-y: auto;
}
.third {
  //   background-color: $menuBg !important;
}
.iconImg {
  width: 16px;
  height: 16px;
  margin-right: 20px;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.setWidth {
  // width: 200px;
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: transparent;
  text-align: center;
  overflow: hidden;
  cursor: pointer;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 22px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.el-submenu__title {
  padding-left: 24px;
}
.thirdStyleItem {
  padding-left: 80px !important;
}
</style>
<style lang="scss">
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
.out1Wrapper {
  .resetItem1 {
    padding-left: 60px !important;
  }
  .third {
    background-color: $subMenuBg !important;
    .el-submenu__title {
      padding-left: 60px !important;
    }
  }
  .fourth {
    background-color: $subMenuBg !important;
    // &:hover {
    //   background-color: $subMenuHover !important;
    // }
    .el-submenu__title {
      padding-left: 80px !important;
    }
    .el-menu-item {
      padding-left: 90px !important;
    }
  }
}
.sidebar-container:not(.el-menu--collapse) {
  width: 230px;
}
.el-submenu__title:hover {
  background-color: #304156 !important;
}
</style>

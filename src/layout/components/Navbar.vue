<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span class="nameStyle">{{ $store.getters.name }}</span>
          <img :src="defaultAvatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="goToHome"> 首页 </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
    defaultAvatar() {
      return require('@/assets/1b918ca51.jpeg');
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      //   sessionStorage.setItem('token','');
      sessionStorage.clear();
      //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`);
    },
    goToHome() {
      const dynamicLink = sessionStorage.getItem('logoLink') ? sessionStorage.getItem('logoLink') : '';
      if (dynamicLink) {
        sessionStorage.setItem('routerPath', dynamicLink);
        sessionStorage.setItem('routerActive', dynamicLink);
        sessionStorage.setItem('notChildrouter', '1');
        sessionStorage.removeItem('isRefresh');
        sessionStorage.removeItem('childRouterQuery');
        this.$store.commit('user/setMenuActive', dynamicLink);
        this.$router.push({
          path: dynamicLink,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  .nameStyle {
    color: #409eff;
    margin-right: 20px;
  }
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          font-size: 12px;
        }
      }
    }
  }
}
</style>

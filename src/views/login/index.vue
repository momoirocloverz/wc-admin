<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <!-- <div class="title-container">
        <h3 class="title">小康码管理系统</h3>
      </div> -->
      <div class="login-left">
        <p class="login-welcome">Welcome</p>
        <p class="login-code">共富帮管理系统</p>
      </div>
      <div class="login-right">
        <div class="login-radio">
          <el-radio v-model="loginWay" label="1">账号登录</el-radio>
          <el-radio v-model="loginWay" disabled label="2">浙政钉扫码登录</el-radio>
        </div>
        <el-form-item prop="username" class="login-form-item mt50">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password" class="login-form-item mt10">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入登录密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" class="login-btn" @click.native.prevent="handleLogin">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';
import { getNavigateList } from '@/api/role';
import { login } from '@/api/user';
import _ from 'lodash';
import md5 from 'js-md5';
import dd from 'gdt-jsapi';
import { zzdAuthUserInfo, zzdAccessToken } from '@/api/account';

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      callback();
      // if (!validUsername(value)) {
      //   callback(new Error('用户不存在'))
      // } else {
      //   callback()
      // }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少为6位'));
      } else {
        callback();
      }
    };
    return {
      staticRouter: [],
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      loginWay: '1',
      routeList: [],
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  mounted: function () {
    // 这里判断是否在浙政钉环境，如果是，那么则尝试自动登录
    dd.getAuthCode({}).then((res) => {
      this.getAccessToken();
    });
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const { username, password } = this.loginForm;
          let pwd = md5(password) + 'xkm' + md5(username);
          this.gotoLogin({ username: username.trim(), password: pwd });
        } else {
          return false;
        }
      });
    },
    // 正常登录
    gotoLogin(data) {
      login(data)
        .then((res) => {
          sessionStorage.clear();
          this.$store.commit('user/SET_NAME', res.data.real_name);
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('loginGuy', JSON.stringify(res.data));
          getNavigateList().then((res) => {
            if (res.code == 0) {
              this.routeList = res.data;
              let empty = [];
              let btnPermise = [];
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
              this.$store.commit('option/SETOPTION', btnPermise);
              this.setLogoLink();
              this.$nextTick(() => {
                let track = sessionStorage.getItem('logoLink');
                this.$store.commit('user/setMenuActive', track);
                this.$router.push({ path: track });
              });
            }
          });
          setTimeout(() => {
            this.loading = false;
          }, 200);
        })
        .catch((e) => {
          // this.$message({
          //   message: `登录失败: ${e.message}`,
          //   type: 'error'
          // })
          this.loading = false;
        });
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
    // 获取accessToken
    getAccessToken() {
      zzdAccessToken({})
        .then((res) => {
          if (res.code == 0) {
            if (res.data.success) {
              if (res.data.content.success) {
                this.getUserInfo(res.data.content.data.accessToken);
              } else {
                message.error(res.data.content.responseMessage);
              }
            } else {
              message.error(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log('err', err);
        });
    },
    // 获取用户信息
    getUserInfo(access_token) {
      dd.getAuthCode({})
        .then((result) => {
          if (result) {
            zzdAuthUserInfo({ auth_code: result.auth_code, access_token })
              .then((res) => {
                // this.$alert(JSON.stringify(res), "提示", {
                //   confirmButtonText: "确定",
                // });
                let data = res.data.content.data;
                this.loginType(data);
                try {
                  // 用户信息埋点
                  // 如采集用户信息是异步行为需要先执行这个BLOCK埋点

                  // Modal.confirm({
                  //   content: "aplus_queue.try" + JSON.stringify(aplus_queue) + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds(),
                  //   onOk: async () => { },
                  // });
                  aplus_queue.push({
                    action: 'aplus.setMetaInfo',
                    arguments: ['_hold', 'BLOCK'],
                  });

                  // 设置会员昵称
                  aplus_queue.push({
                    action: 'aplus.setMetaInfo',
                    arguments: ['_user_nick', data.nickNameCn],
                  });
                  // 设置会员ID
                  aplus_queue.push({
                    action: 'aplus.setMetaInfo',
                    arguments: ['_user_id', data.accountId],
                  });

                  // 如采集用户信息是异步行为，需要先设置完用户信息后再执行这个START埋点
                  // 此时被block住的日志会携带上用户信息逐条发出
                  aplus_queue.push({
                    action: 'aplus.setMetaInfo',
                    arguments: ['_hold', 'START'],
                  });
                } catch (e) {
                  // Modal.confirm({
                  //   content: "aplus_queue.catch" + JSON.stringify(e) + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds(),
                  //   onOk: async () => { },
                  // });
                }
              })
              .catch((e) => {});
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    },
    // 正常登录
    loginType(data) {
      let loginData = {
        login_type: '3',
        tenantUserId: data.tenantUserId,
        accountId: data.accountId,
        account: data.account,
        realmId: data.realmId,
        nickname: data.nickNameCn,
      };
      this.gotoLogin(loginData);
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #333 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background: url('../../assets/login_bg.png') no-repeat;
  background-size: 100%;
  background-position: center;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .login-form {
    // position: relative;
    // width: 520px;
    // max-width: 100%;
    // padding: 160px 35px 0;
    // margin: 0 auto;
    // overflow: hidden;
    width: 945px;
    height: 500px;
    background: #fff;
    display: flex;
    flex-direction: row;
    border-radius: 52px;
  }
  .login-left {
    width: 466px;
    height: 501px;
    background: url('../../assets/bg_left.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .login-welcome {
    color: #fff;
    font-size: 40px;
    margin-left: 52px;
    margin-bottom: 18px;
  }
  .login-code {
    margin-left: 52px;
    font-size: 34px;
    color: #fff;
    margin-top: 18px;
  }
  .login-right {
    width: 412px;
    display: flex;
    flex-direction: column;
    margin: 0px 28px;
  }
  .login-radio {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 84px;
    padding-bottom: 27px;
    border-bottom: #ccc solid 1px;
  }
  .login-form-item {
    background: #fff;
    border: #c5c5c5 solid 1px;
    height: 53px;
  }
  .mt50 {
    margin-top: 50px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .login-btn {
    width: 100%;
    height: 60px;
    margin-top: 20px;
    border-radius: 30px;
    font-size: 27px;
    background-color: #0c78d4;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style lang="scss">
.login-container {
  .el-form-item__content {
    font-size: 16px;
  }
  .el-input {
    font-size: 16px;
  }
  .el-input__inner {
    font-size: 16px;
  }
  .login-radio {
    .el-radio__input.is-checked .el-radio__inner {
      background-color: #f7a32c;
      border-color: #f7a32c;
    }
    .el-radio__input.is-checked + .el-radio__label {
      color: #f7a32c;
    }
    .el-radio__label {
      font-size: 21px;
    }
    .el-radio {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
    }
    .el-radio__inner {
      font-size: 17px;
    }
  }
}
</style>

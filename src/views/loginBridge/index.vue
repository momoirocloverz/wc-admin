<template>
  <div class="login-container">加载中</div>
</template>

<script>
import { loginBridge } from '@/api/user';
import { getNavigateList } from '@/api/role';
import _ from 'lodash';
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      staticRouter: [],
      routeList: [],
    };
  },
  mounted() {
    this.loginAction();
  },
  methods: {
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
    loginAction() {
      if (this.$route.query.secret) {
        loginBridge({
          secret: this.$route.query.secret,
        })
          .then((res) => {
            if (res && res.code == 0) {
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
            } else {
              this.$router.push('/login');
            }
          })
          .catch((err) => {
            this.$router.push('/login');
          });
      }
    },
  },
};
</script>

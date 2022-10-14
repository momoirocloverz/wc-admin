import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { routeInfo } from '@/router/routerSet'
import { getNavigateList } from '@/api/role'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasToken = sessionStorage.getItem('token')
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          let route = [], route1 = [];
          getNavigateList().then(res => {
            if (res.code === 0) {
              res.data.map(item => {
                route.push(item.component.split('/')[1]);
                route1.push({ name: item.component.split('/')[2], option: item.related });
              });
              route = [...new Set(route)];
              routeInfo.map((item, index) => {
                if (item.path) {
                  if (!route.includes(item.path.slice(1, item.path.length))) {
                    routeInfo[index] = {};
                  }
                  item.child = [];
                  item.children.map(items => {
                    route1.map(itemss => {
                      if (itemss.name == items.path) {
                        items.option = itemss.option;
                        item.child.push(items);
                        return;
                      }
                    })
                  });
                  delete item.children;
                  item.children = item.child;
                  delete item.child;
                }
              });
            }
          });
          // setTimeout(() => {
            // console.log(router.options.routes);
            router.addRoutes(routeInfo)
            router.options.routes = router.options.routes.concat(routeInfo)
            console.log(router.options.routes);
            next();
          // }, 1000);
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

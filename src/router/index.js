import Vue from 'vue';
import Router from 'vue-router';
import Empty from '@/layout/empty.vue';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/loginBridge',
    component: () => import('@/views/loginBridge/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dataService/householdInformation/basicFiles',
    name: '',
    hidden: true,
  },
  {
    path: '/dataService',
    component: Layout,
    name: 'dataService',
    meta: { title: '数据服务' },
    children: [
      {
        path: 'dataUniform',
        name: 'dataUniform',
        meta: { title: '数据协同' },
        component: Empty,
        children: [
          {
            path: 'minzhengju',
            name: 'dataUniformminzhengju',
            meta: { title: '民政局' },
            component: () => import('@/views/data-service/minzhengju'),
          },
          {
            path: 'tongjiju',
            name: 'dataUniformtongjiju',
            meta: { title: '统计局' },
            component: () => import('@/views/data-service/tongjiju'),
          },
          {
            path: 'jiaoyuju',
            name: 'dataUniformjiaoyuju',
            meta: { title: '教育局' },
            component: () => import('@/views/data-service/jiaoyuju'),
          },
          {
            path: 'zhujianju',
            name: 'dataUniformzhujianjus',
            meta: { title: '住建局' },
            component: () => import('@/views/data-service/zhujianju'),
          },
          {
            path: 'yibaoju',
            name: 'dataUniformyibaoju',
            meta: { title: '医保局' },
            component: () => import('@/views/data-service/yibaoju'),
          },
          {
            path: 'weijianju',
            name: 'dataUniformweijianju',
            meta: { title: '卫健局' },
            component: () => import('@/views/data-service/weijianju'),
          },
          {
            path: 'nongshanghang',
            name: 'dataUniformnongshanghang',
            meta: { title: '农商行' },
            component: () => import('@/views/data-service/nongshanghang'),
          },
          {
            path: 'canlian',
            name: 'dataUniformcanlian',
            meta: { title: '残联' },
            component: () => import('@/views/data-service/canlian'),
          },
          {
            path: 'rensheju',
            name: 'dataUniformrenshejus',
            meta: { title: '人社局' },
            component: () => import('@/views/data-service/rensheju'),
          },
          {
            path: 'caizhengju',
            name: 'dataUniformcaizhengju',
            meta: { title: '财政局' },
            component: () => import('@/views/data-service/caizhengju'),
          },
        ],
      },
      {
        path: 'povertyAlleviationFund',
        name: 'povertyAlleviationFund',
        meta: { title: '扶贫资金' },
        component: Empty,
        children: [
          {
            path: 'officeOfBudget',
            name: 'officeOfBudget',
            component: () => import('@/views/poverty-alleviation-fund/office-of-budget'),
            meta: { title: '财政局' },
          },
          {
            path: 'departmentOfHealth',
            name: 'departmentOfHealth',
            component: () => import('@/views/poverty-alleviation-fund/department-of-health'),
            meta: { title: '卫健局' },
          },
        ],
      },
      {
        path: 'householdInformation',
        component: Empty,
        name: 'householdInformation',
        meta: { title: '农户信息' },
        children: [
          {
            path: 'basicFiles',
            name: 'householdInformationbasicFiles',
            meta: { title: '农户基础档案' },
            component: () => import('@/views/peasant-household/basic-files'),
          },
          {
            path: 'householdCode',
            name: 'householdInformationhouseholdCode',
            meta: { title: '农户小康码' },
            component: () => import('@/views/peasant-household/household-code'),
          },
          {
            path: 'pairedInfomation',
            name: 'householdInformationpairedInfomation',
            meta: { title: '结对干部信息' },
            component: () => import('@/views/peasant-household/paired-information'),
          },
          {
            path: 'signDoctorInfomation',
            name: 'householdInformationsignDoctorInfomation',
            meta: { title: '签约医生信息' },
            component: () => import('@/views/peasant-household/sign-doctor-information'),
          },
          {
            path: 'prevCodeOne',
            name: 'householdInformationonePrev',
            meta: {
              activeMenu: '1',
            },
            component: () => import('@/views/peasant-household/one-prevcode'),
          },
          {
            path: 'look-doctor',
            name: 'householdInformationLookDoctor',
            meta: {
              activeMenu: '1',
            },
            component: () => import('@/views/peasant-household/look-doctor-infomation'),
          },
          {
            path: 'look-paired',
            name: 'householdInformationlookPaired',
            meta: {
              activeMenu: '1',
            },
            component: () => import('@/views/peasant-household/look-paired-information'),
          },
          {
            path: 'prev-code',
            name: 'householdInformationprevCode',
            meta: {
              activeMenu: '1',
            },
            component: () => import('@/views/peasant-household/prev-small-code'),
          },
        ],
      },
      {
        path: 'pairings',
        component: Empty,
        name: '结对帮扶',
        meta: { title: '结对帮扶' },
        children: [
          {
            path: 'governmentEmployees',
            name: 'pairingsgovernmentEmployees',
            component: () => import('@/views/pairings/government-employees'),
            meta: { title: '结对干部' },
          },
          {
            path: 'familyDoctors',
            name: 'pairingsfamilyDoctors',
            component: () => import('@/views/pairings/family-doctors'),
            meta: { title: '签约医生' },
          },
        ],
      },
    ],
  },
  {
    path: '/announcements',
    component: Layout,
    name: 'announcements',
    meta: { title: '信息动态' },
    children: [
      {
        path: 'advertisementRelease',
        name: 'advertisementRelease',
        meta: { title: '广告发布' },
        component: () => import('@/views/information-delivery/advertisement-release'),
      },
      {
        path: 'povertyAlleviation',
        name: 'povertyAlleviation',
        meta: { title: '信息动态' },
        component: () => import('@/views/information-delivery/poverty-alleviation'),
      },
      {
        path: 'farmerSuggestions',
        name: 'farmerSuggestions',
        meta: { title: '意见反馈' },
        component: () => import('@/views/information-delivery/framer-suggestions'),
      },
    ],
  },
  {
    path: '/multipleUniverse',
    component: Layout,
    name: 'multipleUniverse',
    meta: { title: '多元增收' },
    children: [
      {
        path: 'page-info',
        name: 'multipleUniversepage-info',
        component: () => import('@/views/information-delivery/page-info'),
      },
      {
        path: 'agriculturalProducts',
        name: 'multipleUniverseagriculturalProducts',
        meta: { title: '我要买卖' },
        component: () => import('@/views/information-delivery/agricultural-products'),
      },
      {
        path: 'employmentInformation',
        name: 'multipleUniverseemploymentInformation',
        meta: { title: '劳务大厅' },
        component: () => import('@/views/information-delivery/employment-information'),
      },
      //   {
      //     path: "hotNews",
      //     name: "热点资讯",
      //     meta: {
      //       title: "热点资讯",
      //       icon: "el-icon-receiving"
      //     },
      //     component: () => import("@/views/information-delivery/hotNews/index")
      //   },
      {
        path: 'landLease',
        name: 'landLease',
        meta: { title: '资产租赁' },
        component: () => import('@/views/information-delivery/landLease/index'),
      },
      {
        path: 'skillTraining',
        name: 'skillTraining',
        meta: { title: '技能培训' },
        component: () => import('@/views/skills-training'),
      },
      {
        path: 'claimRecord',
        name: 'claimRecord',
        meta: { title: '申领记录' },
        component: () => import('@/views/claimRecord/index'),
      },
    ],
  },
  {
    path: '/household-information',
    component: Layout,
    name: '农户管理',
    meta: { title: '农户管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'sign-doctor-infomation',
        name: '签约医生信息',
        meta: { title: '签约医生信息' },
        component: () => import('@/views/peasant-household/sign-doctor-information'),
      },
      {
        path: 'index',
        name: '用户列表',
        component: () => import('@/views/user/index'),
        meta: { title: '用户列表' },
      },
    ],
  },
  // {
  //   path: "/userInfo",
  //   component: Layout,
  //   name: "用户列表",
  //   meta: { title: "用户列表", icon: "el-icon-refrigerator" },
  //   children: [
  //     {
  //       path: "index",
  //       name: "用户列表",
  //       component: () => import("@/views/user/index"),
  //       meta: { title: "用户列表" }
  //     }
  //   ]
  // },
  {
    path: '/alleviation',
    component: Layout,
    name: '扶贫项目',
    meta: { title: '扶贫项目', icon: 'el-icon-s-promotion' },
    children: [
      {
        path: 'project-manage',
        name: '项目管理',
        meta: { title: '项目管理' },
        component: () => import('@/views/alleviation-projects/project-management'),
      },
      {
        path: 'project-class',
        name: '项目分类',
        meta: { title: '项目分类' },
        component: () => import('@/views/alleviation-projects/project-classification'),
      },
    ],
  },
  {
    path: '/approval',
    component: Layout,
    name: '申报审批',
    meta: { title: '申报审批', icon: 'el-icon-help' },
    children: [
      {
        path: 'rainproject',
        name: '雨露计划',
        meta: { title: '雨露计划' },
        component: () => import('@/views/approval/rain-project'),
      },
      {
        path: 'approvalprogress',
        name: '审批进度',
        meta: { title: '审批进度', activeMenu: '1' },
        component: () => import('@/views/approval/approval-progress'),
      },
      //   {
      //     path: "beeQuantifyProgress",
      //     name: "中蜂产业审批进度",
      //     meta: { title: "中蜂产业审批进度", icon: "", activeMenu: "1" },
      //     component: () => import("@/views/approval/beeQuantifyProgress")
      //   }
    ],
  },
  /*   {
    path: '/announcements',
    component: Layout,
    name: '信息发布',
    meta: { title: '信息发布', icon: 'el-icon-s-comment' },
    children: [
      {
        path: 'advertisement-relase',
        name: '广告发布',
        meta: { title: '广告发布' },
        component: () => import('@/views/information-delivery/advertisement-release'),
      },
      {
        path: 'poverty-alleviation',
        name: '信息动态',
        meta: { title: '信息动态' },
        component: () => import('@/views/information-delivery/poverty-alleviation'),
      },
      {
        path: 'framer-suggestions',
        name: '意见反馈',
        meta: { title: '意见反馈' },
        component: () => import('@/views/information-delivery/framer-suggestions'),
      },
      {
        path: 'page-info',
        name: '富文本信息',
        component: () => import('@/views/information-delivery/page-info'),
      },
      {
        path: 'agricultural-products',
        name: '我要买卖',
        meta: { title: '我要买卖' },
        component: () => import('@/views/information-delivery/agricultural-products'),
      },
      {
        path: 'employment-information',
        name: '劳务大厅',
        meta: { title: '劳务大厅' },
        component: () => import('@/views/information-delivery/employment-information'),
      },
      //   {
      //     path: "hotNews",
      //     name: "热点资讯",
      //     meta: {
      //       title: "热点资讯",
      //       icon: "el-icon-receiving"
      //     },
      //     component: () => import("@/views/information-delivery/hotNews/index")
      //   },
      {
        path: 'landLease',
        name: '资产租赁',
        meta: { title: '资产租赁' },
        component: () => import('@/views/information-delivery/landLease/index'),
      },
    ],
  }, */
  {
    path: '/industryHelp',
    name: '产业帮扶',
    meta: {
      title: '产业帮扶',
    },
    component: Layout,
    children: [
      {
        path: 'beeQuantify',
        name: 'industryHelpbeeQuantify',
        meta: { title: '保底增收' },
        component: Empty,
        children: [
          {
            path: 'declare',
            name: 'industryHelpbeeQuantifydeclare',
            meta: { title: '申报管理' },
            component: Empty,
            children: [
              {
                path: 'approval',
                name: 'industryHelpbeeQuantifydeclareapproval',
                meta: { title: '审批' },
                component: () => import('@/views/cultural-propaganda/applicationReview/index'),
              },
              {
                path: 'pairings',
                name: 'industryHelpbeeQuantifydeclarepairings',
                meta: { title: '结对' },
                component: () => import('@/views/cultural-propaganda/applicationReview/indexSec'),
              },
              {
                path: 'protocol',
                name: 'industryHelpbeeQuantifydeclareprotocol',
                meta: { title: '协议' },
                component: () => import('@/views/cultural-propaganda/applicationReview/indexThird'),
              },
              {
                path: 'work',
                name: 'industryHelpbeeQuantifydeclarework',
                meta: { title: '工作' },
                component: () => import('@/views/cultural-propaganda/applicationReview/indexFourth'),
              },
              {
                path: 'training',
                name: 'industryHelpbeeQuantifydeclaretraining',
                meta: { title: '培训' },
                component: () => import('@/views/cultural-propaganda/applicationReview/indexFifth'),
              },
            ],
          },
          {
            path: 'help',
            name: 'industryHelpbeeQuantifyhelp',
            meta: { title: '代替办理' },
            component: Empty,
            children: [
              {
                path: 'pairings',
                name: 'industryHelpbeeQuantifyhelppairings',
                meta: { title: '代理中蜂结对' },
                component: () => import('@/views/cultural-propaganda/applicationReview/indexSixth'),
              },
              {
                path: 'apply',
                name: 'industryHelpbeeQuantifyhelpapply',
                meta: { title: '代理中蜂申请' },
                component: () => import('@/views/cultural-propaganda/applicationReview/indexSeventh'),
              },
            ],
          },
          {
            path: 'state',
            name: 'industryHelpbeeQuantifystate',
            meta: { title: '申报管理' },
            component: Empty,
            children: [
              {
                path: 'crop',
                name: 'industryHelpbeeQuantifystatecrop',
                meta: { title: '中蜂企业' },
                component: () => import('@/views/cultural-propaganda/applicationReview/indexEighth'),
              },
              {
                path: 'farmer',
                name: 'industryHelpbeeQuantifystatefarmer',
                meta: { title: '低收入农户' },
                component: () => import('@/views/cultural-propaganda/applicationReview/indexNinth'),
              },
            ],
          },
        ],
      },
      {
        path: 'groupIncrease',
        name: 'industryHelpgroupIncrease',
        meta: { title: '抱团增收' },
        component: () => import('@/views/cultural-propaganda/groupIncrease'),
      },
      {
        path: 'IndustryAlliance',
        name: 'industryHelpIndustryAlliance',
        meta: { title: '产业联盟' },
        component: () => import('@/views/cultural-propaganda/IndustryAlliance'),
      },
    ],
  },
  {
    path: '/cultural-propagand',
    name: '产业帮扶',
    meta: {
      title: '产业帮扶',
    },
    component: Layout,
    children: [
      //   {
      //     path: "index",
      //     name: "产业帮扶",
      //     meta: { title: "产业帮扶" },
      //     component: () => import("@/views/cultural-propaganda")
      //   },
      //   {
      //     path: "beeQuantify",
      //     name: "产业折股量化",
      //     meta: { title: "产业折股量化" },
      //     component: () => import("@/views/approval/beeQuantify")
      //   },
      //   {
      //     path: "unite",
      //     name: "产业联合体",
      //     meta: { title: "产业联合体" },
      //     component: () => import("@/views/cultural-propaganda")
      //   },
      //   {
      //     path: "beeQuantifyProgress",
      //     name: "产业审批进度",
      //     meta: { title: "产业审批进度", activeMenu: "1" },
      //     component: () => import("@/views/approval/beeQuantifyProgress")
      //   }
      //   {
      //     path: 'beeQuantify',
      //     name: '产业折股量化',
      //     meta: { title: '产业折股量化' },
      //     component: Empty,
      //     children: [
      //       {
      //         path: 'dataUpload',
      //         name: '资料上传',
      //         meta: { title: '资料上传' },
      //         component: () => import('@/views/cultural-propaganda/dataUpload'),
      //       },
      //       {
      //         path: 'applicationReview',
      //         name: '申报审核',
      //         meta: { title: '申报审核' },
      //         component: () => import('@/views/cultural-propaganda/applicationReview/index'),
      //       },
      //       {
      //         path: 'applicationReviewAuditFarmerDetail',
      //         name: '低收入农户申报审核详情',
      //         meta: { title: '申报审核详情' },
      //         component: () => import('@/views/cultural-propaganda/applicationReview/auditFarmerDetail'),
      //       },
      //       {
      //         path: 'applicationReviewAuditMajorDetail',
      //         name: '养殖大户申报审核详情',
      //         meta: { title: '申报审核详情' },
      //         component: () => import('@/views/cultural-propaganda/applicationReview/auditMajorDetail'),
      //       },
      //       {
      //         path: 'dynamicTracking',
      //         name: '动态跟踪',
      //         meta: { title: '动态跟踪' },
      //         component: () => import('@/views/cultural-propaganda/dynamicTracking'),
      //       },
      //       {
      //         path: 'fundRelease',
      //         name: '资金发放',
      //         meta: { title: '资金发放' },
      //         component: () => import('@/views/cultural-propaganda/fundRelease'),
      //       },
      //       {
      //         path: 'terminationAgreement',
      //         name: '终止协议',
      //         meta: { title: '终止协议' },
      //         component: () => import('@/views/cultural-propaganda/terminationAgreement'),
      //       },
      //     ],
      //   },
      {
        path: 'beeQuantify',
        name: '中蜂折股量化',
        meta: { title: '中蜂折股量化' },
        component: () => import('@/views/cultural-propaganda/applicationReview/index'),
      },
    ],
  },
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    meta: { title: '权限设置' },
    children: [
      {
        path: 'create-update-role',
        name: 'permissioncreate-update-role',
        meta: {
          activeMenu: '1',
        },
        component: () => import('@/views/permission-setting/create-update-role'),
      },
      {
        path: 'roleManage',
        name: 'permissionroleManage',
        meta: { title: '角色管理' },
        component: () => import('@/views/permission-setting/role-manage'),
      },
      {
        path: 'accountManage',
        name: 'permissionaccountManage',
        meta: { title: '账号管理' },
        component: () => import('@/views/permission-setting/account-manage'),
      },
    ],
  },
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/portal/gfb',
    component: () => import('@/views/portal/gongfubang'),
    name: '共富帮门户',
    meta: {
      title: '共富帮',
    },
  },
  {
    path: '/portal/industrial',
    component: () => import('@/views/portal/indusChain'),
    name: '产业链门户',
    meta: {
      title: '产业链门户',
    },
  },
  {
    path: '/portal/gfbportal',
    component: () => import('@/views/portal/portal'),
    name: '共富帮门户',
    meta: {
      title: '共富帮门户',
    },
  },
  {
    path: '/protal/futureRural',
    component: () => import('@/views/portal/futureRural/index'),
    name: '未来乡村',
    meta: {
      title: '未来乡村',
    },
  },
];

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.innerText;
    el.remove();
  },
});

export default router;

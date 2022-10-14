# 1.项目名称：）admin

# 2.项目分支 dev/pre/master

# 3.关于上架平台说明，目前已经上线了网页端以及浙政钉

# 4.关于部署发布

## 发布时需要自行 build 并提交代码

---

# 5.关于文件结构

## 1.细分结构 public/index.html 内部说明

![image](https://img.hzanchu.com/acimg/cb47040281b4f48aa6b0b51e85adfcad.png)

### 浙政钉埋点

---

## 2.细分结构 public/xlsx 内部说明

### 页面内业务下载源

---

## 3.细分结构 vue.config.js 内部说明

### plugins Quill 富文本编辑器插件注册

---

## 4.细分结构 postcss.config.js 内部说明

### 代码内部有两套页面，分别是小康码后台与部分静态页面，详情查看 router/index.js。 静态页面配置了 px2rem 页面适配

---

## 5.细分结构 views/loginBridge/index.vue 内部说明

### 对接文成数字工作台单点登录

---

## 6.细分结构 views/login/index.vue 内部说明

### 1.登录页面,登录完成之后，获取用户导航列表，执行跳转，判断菜单权限是否有农户基础档案页面（首页）权限，有则跳转到，没有则跳转到导航列表里第一个页面作为首页

### 2.内有浙政钉环境跳转逻辑

### 3.获取账户拥有的按钮权限，同步到 vuex 中。

---

## 7.细分结构 views/permission-setting/account-manage/index.vue 内部说明

### 内有浙政钉环境跳转逻辑

---

## 8.细分结构 utils/business.js 内部说明

### 适用于部分页面村镇筛选功能

---

## 9.细分结构 layout/index.vue 内部说明

### 1.每次刷新之后，重新获取当前用户菜单、按钮权限以及当前账户首页地址

### 2.向第一层级菜单分别注入图标

---

# 6.备注

## 1.浙政钉相关依赖 gdt-jsapi

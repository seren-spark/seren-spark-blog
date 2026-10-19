---
title: "NProgress 效果和网页进度不一致问题"
description: "解决路由跳转、异步组件加载与进度条结束时机不一致的问题。"
type: journal
occurredAt: 2025-06-06
publishedAt: 2025-06-06
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/148481254
sourceName: CSDN
relatedDocs: []
---

之前在写项目时，用到了进度条插件（效果如下），但是遇到了一个比较影响用户体验的问题，就是当路由还没进行跳转，进度条已经加载完，也就是说，用户想要进入其他页面时，明明已经看到进度条加载完了，但是仍然停留在当前页面，进度条完成之后还要等待一段时间，路由才能进行跳转
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/cbcbb7160eaa4fa79557f7c77984bac9.png)

```javascript
nprogress.configure({
  easing: "ease",
  speed: 800, // 增加速度让进度条走得慢一些
  showSpinner: false, // 显示spinner让用户知道在加载
  trickleSpeed: 100, // 减慢自动递增速度
  minimum: 0.1, // 降低最小值
});

router.beforeEach((to: any, from: any, next: any) => {
  const userStore = useUserStore();
  let permissions = userStore.permissions;
  nprogress.start();

  const token = getLocalStorageWithExpire("token");

  // 白名单：登录页,首页和报名页不需要 token
  if (to.path === "/login" || to.path === "/" || to.path === "/application") {
    if (token) {
      // 已登录时特殊处理
      if (to.path === "/login") {
        // 已登录访问登录页，跳转到首页
        return next("/");
      } else if (to.path === "/application") {
        // 已登录访问报名页，跳转首页并提示
        showAlert("已登录用户不可访问报名页", "error");
        return next("/");
      }
    }
    // 其他白名单情况正常放行
    return next();
  }

  // 未登录且访问其他页面，跳转登录页
  if (!token) {
    return next("/login");
  }
  // 权限判断
  if (to.path.startsWith("/admin") && !permissions.includes(to.meta.roles)) {
    router.push("/404");
  }

  next();
});
//关键所在
 router.afterEach((to: any, from: any) => {
  nprogress.done();
});
```

# 原因

后来在控制台查看了网络请求，发现网络请求时间过长，
因此也就有了一个推测：
NProgress 在 router.afterEach 中结束，但此时懒加载的组件可能还在kukuku的网络请求中
路由已经"跳转完成"，但组件内容还没加载完

# 解决方案

## 方案1（尝试且有效）

使用beforeResolve,这样进度条会等待组件懒加载完成（关键）
修改nprogress 设置，让其慢一些（这个可改可不改）

```javascript
router.beforeResolve((to, from, next) => {
  // 此时组件已经加载完成，地址栏也会更新
  nprogress.done();
  next();
});
```

```javascript
nprogress.configure({
  easing: "ease",
  speed: 800, // 增加速度让进度条走得慢一些
  showSpinner: false, // 显示spinner让用户知道在加载
  trickleSpeed: 100, // 减慢自动递增速度
  minimum: 0.1, // 降低最小值
});
```

## 方案2

处理懒加载组件的加载状态
由于项目使用的是自动导入路由，这个方法没有试

```javascript
// 创建一个包装函数来处理懒加载
function lazyLoadComponent(importFunc) {
  return () => {
    NProgress.start();

    return importFunc()
      .then((module) => {
        NProgress.done();
        return module;
      })
      .catch((error) => {
        NProgress.done();
        console.error("组件加载失败:", error);
        throw error;
      });
  };
}

// 使用包装函数
const routes = [
  {
    path: "/",
    name: "Home",
    component: lazyLoadComponent(() => import("@/views/Home.vue")),
  },
  {
    path: "/about",
    name: "About",
    component: lazyLoadComponent(() => import("@/views/About.vue")),
  },
];
```

## 方案3

使用全局混入

```javascript
app.mixin({
  async beforeRouteEnter(to, from, next) {
    NProgress.done();
    next();
  },
});
```

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/148481254)

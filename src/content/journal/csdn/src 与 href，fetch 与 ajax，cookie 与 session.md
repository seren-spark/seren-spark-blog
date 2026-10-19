---
title: "src 与 href，fetch 与 ajax，cookie 与 session"
description: "对比资源加载、Fetch 请求、Ajax 以及浏览器状态管理的基础概念。"
type: journal
occurredAt: 2024-06-08
publishedAt: 2024-06-08
tags:
  - 前端
sourceUrl: https://blog.csdn.net/HBR666_/article/details/139543614
sourceName: CSDN
relatedDocs: []
---

# src和href的区别

## 1.请求资源类型不同

> href，超文本引用，用于建立文档与资源的联系，常用的有：link、a。
> src，将其所指向的资源下载并应用到当前页面，常见的有script、img。

## 2.作用结果不同

> href，用于文档与资源之间确立联系。
> src，请求到的资源替换当前内容。

## 3.浏览器的解析不同

> href，将资源解析成css文件，并行加载请求资源，不会阻塞对当前文档的处理。
> src，会暂停其他资源的处理，直到该资源加载、解析和执行完毕，将其所指向资源应用到当前内容。这也是为什么把js文件放在底部而不是头部原因。

# cookie，sessionStorage，localStorage

> 1、存储大小不同，cookie：4k，web storage：5m

> 2、数据有效期不同：
>
> cookie可以设置， 设置过期时间， 也可以手动清空；
>
> session：仅在浏览器关闭前有效；
>
> local：永久有效，除非手动清除。

> 3、作用域：
> cookie在所有同源窗口共享；
>
> session仅在一个浏览器共享，不同浏览器不共享；
>
> local在所有同源窗口共享。

> 4、通信：
>
> cookie通过http,在浏览器和服务器传递；
>
> session仅在客户端；
>
> local仅在客户端。

> 5、应用：
>
> cookie判断用户是否登陆过，记忆密码自动登录；
>
> session敏感账号一次登录，关闭浏览器删除；
>
> local个人长期登录， 长期保存数据。

# fetch和ajax

ajax与fetch都是前端开发过程中常用到的数据请求方式。fetch是一种http数据请求的方式，是XMLHttpRequest的一种替代方案；ajax使用 JavaScript 向服务器提出请求并处理响应而不阻塞用户核心对象XMLHttpRequest。

## 1.ajax

创建XMLHttpRequest对象
创建HTTP请求（调用open方法设置基本请求信息）
发送请求
注册事件
获取返回数据，对页面进行更新

```javascript
//1.创建Ajax对象
if (window.XMLHttpRequest) {
  var oAjax = new XMLHttpRequest();
} else {
  var oAjax = new ActiveXObject("Microsoft.XMLHTTP");
}

//2.创建HTTP请求
oAjax.open("GET", url, true);

//3.发送请求
oAjax.send();

//4.注册事件
oAjax.onreadystatechange = function () {
  if (oAjax.readyState == 4) {
    if (oAjax.status == 200) {
      //5.获取返回数据
      fnSucc(oAjax.responseText);
    } else {
      //alert('失败了');
      if (fnFaild) {
        fnFaild();
      }
    }
  }
};
```

## 2.fetch

> Fetch API 提供了一个 JavaScript 接口，用于访问和操纵 HTTP 管道的部分，例如请求和响应。它还提供了一个全局
> fetch()方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源

- 第一个参数是URL
- 第二个是可选参数，可以控制不同配置的 init 对象
- 使用了 JavaScript Promises 来处理结果/回调

```javascript
window.Fetch = (url, option) => {
  return new Promise((resolve, reject) => {
    let data = {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: {},
    };
    data = JSON.parse(
      (JSON.stringify(data) + JSON.stringify(option)).replace(/}{/, ","),
    );
    fetch(url, data)
      .then((res) => {
        // .text()：返回字符串
        // .json()：返回一个JSON对象
        // .formData()：返回一个FormData对象
        // .blob()：返回一个blob对象
        // .arrayBuffer()：返回一个二进制数组
        resolve(res.json());
      })
      .catch(function (res) {
        reject(res);
      });
  });
};
```

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/139543614)

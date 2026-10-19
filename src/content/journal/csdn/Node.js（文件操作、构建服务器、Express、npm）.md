---
title: "Node.js（文件操作、构建服务器、Express、npm）"
description: "从文件操作到 Express 和 npm，回顾 Node.js 服务端开发基础。"
type: journal
occurredAt: 2024-05-26
publishedAt: 2024-05-26
tags:
  - Node.js
sourceUrl: https://blog.csdn.net/HBR666_/article/details/139220367
sourceName: CSDN
relatedDocs: []
---

# 文件操作

## 1.读取文件

### 1）步骤

- 使用require方法加载fs核心模块
- 读取文件

```javascript
//使用require方法加载fs核心模块
var fs = require("fs");
//读取文件
// 参数1：读取的文件的路径
// 参数2：回调函数
//     成功：data:数据
//           error: null
//     失败：data：undefined
//           error：错误对象

fs.readFile("", function (error, data) {});
```

### 2）范例

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2dbbaa2c95cc309de3c5dea1a3b81481.png)
helloworld.js

```javascript
var fs = require("fs");

fs.readFile("hello.txt", function (error, data) {
  console.log(data);
});
```

hello.txt

```javascript
hello Node
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6a262d3c4ecdea4bc4137ac42c967f27.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/10d0c8f50ab3901e850e9843a46c0542.png)

## 2.写文件

### 1）步骤

```javascript
//使用require方法加载fs核心模块
var fs = require("fs");
//写文件
// 参数1：文件的路径
// 参数3：文件内容
// 参数2：回调函数
//     成功：文件写入成功
//           error: null
//     失败：文件写入失败
//           error：错误对象

fs.readFile("", function (error) {});
```

### 2）范例

写文件.js

```javascript
var fs = require("fs");
fs.writeFile("写文件.txt", "腹有诗书气自华", function (error) {
  console.log("文件写入成功");
});
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/cb5fa7ab74eeb6b1dba4dea8bdd1fd10.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8682cc27aba9c29be72f853c68f77b54.png)

注意：如果文件不存在，会创建文件，并写入指定内容，如果文件存在，则内容会被重新覆盖

要想不被覆盖，可以使用appendFile，追加在后面

## 3.删除文件

```javascript
var fs=require('fs');
fs.unlink('./创建文件.txt',function(error){
})
3.创建文件夹
var fs=require('fs');
fs.mkdir('./创建文件',function(error){
})
```

## 4.重命名文件夹

```javascript
var fs = require("fs");
fs.mkdir("./创建文件", "./重命名文件", function (error) {});
```

## 5删除文件夹

注意只能删除空文件

```javascript
var fs = require("fs");
fs.rmdir("./创建文件", function (error) {});
```

# Url

## 1.url.parse()

将url字符串转换成对象

```javascript
var url = require("url");
let urlString = "http:49.95.207.1:3000/fcj/recommend/hot/hehe?us=123#nihao";
let urlObj = url.parse(urlString);
console.log(urlObj);
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0ee39f0a37869f6096e69d8e6091f17d.png)

## 2.url.fomat()

将url对象转换成字符串

```javascript
let obj = {
  protocol: "http:",
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: "#nihao",
  search: "?us=123",
  query: "us=123",
  pathname: "49.95.207.1:3000/fcj/recommend/hot/hehe",
  path: "49.95.207.1:3000/fcj/recommend/hot/hehe?us=123",
  href: "http:49.95.207.1:3000/fcj/recommend/hot/hehe?us=123#nihao",
};
let string = url.format(obj);
console.log(string);
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d248f3bea1e0928f95ea7354667b8692.png)

# Query

## 1.query.parse()

将字符串变为对象
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/03fa488de8b7460cddafcc5bedb5fed9.png)

## 2.query.stringfy()

将对象变为字符串
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/937347ef11ae76e336bc4e95e150fecf.png)

## 3.编码和解码

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b0a66eedece2401bc6cb97271f2fe57c.png)

# 第三方模块

## 1.nodemailer

```javascript
const nodemailer = require("nodemailer");
// 创建发送邮件的请求对象
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com", //发送方邮箱 通过lib/wellknown/services.json
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "2843306836@qq.com", //发送方的邮箱地址
    pass: "vsclqhgqfpuxdecd", //mtp验证码
  },
});
// 邮件信息
let mailobj = {
  from: '"Maddison Foo Koch 👻" <2843306836@qq.com>', // sender address
  to: "2843306836@qq.com", // list of receivers  初设bar@example.com, baz@example.com
  subject: "Hello ✔", // Subject line
  // 文本信息和html信息只能有一个
  text: "您的验证码是8520,有效期为五分钟", // plain text body

  // html: "<b>Hello world?</b>", // html body
};
// 发送邮件
transporter.sendMail(mailobj, function (error, data) {});
```

## 2.body-parser

```javascript
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
// app.use表示使用中间件

// 解析表单数据
app.use(bodyParser.urlencoded({ extended: false }));

// 解析json数据
app.use(bodyParser.json());

app.use(function (req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.write("you posted:\n");
  res.end(JSON.stringify(req.body, null, 2));
});
```

# 构建服务器

在Node中提供了一个核心模块，http
这个模块用来创建编写服务器
1.简单的http服务
1）步骤
● 加载http核心模块
● 使用http.createServer()方法加载一个服务器
● 提供服务：对数据的服务
发请求
接收请求
处理请求
给反馈（发送响应）
注册request请求事件
当客户端请求过来，就会自动触发服务器的request请求事件，执行第二个参数，回调处理函数
● 绑定端口号，启动服务器

```javascript
// 加载http核心模块
var http=require('http');
// 使用http.createServer()方法加载一个服务器
// 返回一个Server实例
var server=http.createServer();
// 提供服务(当服务器接受请求之后要干的事)
sever.on('request'，function(){...})
// 绑定端口号，启动服务器
server.listen(3000,function(){});
```

2）范例
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/44419382da27eb90026006de848af5e5.png)
注意：当运行时会打印出![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/352cb260eb4062e484f8dc0cf0896028.png)
此时控制台无法输入任何东西，因为在等待客户端请求
只有当在浏览器输入网址时，控制台会打印出
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c4e7f26b1c7d4ceb8d000f98ef8d8c33.png)
ctrl+c可以直接关闭服务器

## 2.响应

> request请求事件处理函数需要接受两个参数：
> Request请求对象
> 请求对象可以用来获取客户端的一些请求信息，例如请求路径
> Response响应对象
> 响应对象可以用来给客户端发送响应消息

> response对象有一个方法：write可以用来给客户端发送响应数据

> write可以使用多次，但是最后一定要使用end来结束响应（告诉客户端话说完了，可以呈递给用户），否则客户端会一直等待
> 响应内容只能是二进制数据或者字符串

### 范例1

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e3252d61b3fa0c7658a9db8db63a53c1.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e162b4566fcd3f62ae1c2fd212da9c7d.png)

### 范例2（end）

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7debc0957809d44adbe7e8c06943bad6.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c10aff4d29b63f92dff1172710aef33f.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/df3c5444aaddf6a61800103695bb530f.png)

### 范例3（将对象等变为字符串）

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e8c73176000bddf04f6b60aec92533d3.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/23812d631b6fd31f46e00a30f6ae2060.png)

# Node中的js

Node只能执行一个文件

## 1.核心模块(内置~)

Node 为js提供了很多服务器级别的API，这些API绝大多数都被包装到了一个具名的核心模块中
例如文件操作的fs核心模块，http服务构建的http模块，path路径操作模块，os操作信息模块
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/546e5e659244ff384013cf76513a557d.png)

## 2.模块系统

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a29387a4d51761a9abadf8d08589071b.png)
equire是一个方法，它的作用之一就是用来加载模块的
在Node中，模块有三种：
具名的核心模块：fs，http...
用户自己编写的文件模块

注意：在node中没有全局作用域只有模块作用域（即超出文件的函数或者变量声明不起作用）
外部访问不到内部，内部也访问不到外部
相对路径必须加./
可以省略后缀名

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9a371da0640df375ce1e5d2e7bc27440.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/362ee663f2801be7b504d22e76e8661e.png)

### 1）加载与导出

require方法有两个作用：
1.加载文件模块并执行里面的代码
2.拿到被加载文件模块导出的接口对象

在每个文件中都提供了一个对象：exports
exports默认是一个空对象
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/28461e11a7ab640cb9718b765bef06a8.png)
要做的就是把所有需要被外部访问的成员挂载到exports对象中
若要直接使用foo， 打印 ret.foo 输出hello
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3ccab5d072ecb1954e299c2fb0d1107d.png)

# ip地址和端口的概念

> 所有联网的程序都需要进行网络通信
> 计算机中只有一个物理网卡，而且同一个局域网中，网卡的地址必须是唯一的
> 网卡是通过唯一的ip地址来进行定位的
> ip地址用来定位计算机，端口号用来定位具体的应用程序
> 所有需要联网通信的软件都需要端口号
> 端口号的范围0~65536之间
> 可以同时开启多个服务，但一定要确保不同服务占用的端口号不一致

# 响应内容类型 Content-Type

浏览器在不知道服务器响应内容的编码的情况下会按照当前操作系统的默认编码（utf8）去解析
会导致中文乱码，中文操作系统默认是gbk

在http协议中，Content-Type就是用来告知对方发送的数据内容是什么类型
在线查询工具
https://tool.oschina.net/ 中的Http Mime-type

```javascript
var http = require("http");
var server = http.createServer();
server.listen(3000, function () {
  console.log("Server is running");
});
server.on("", function (req, res) {
  //防止乱码
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  res.end("hello 世界");
});
```

# 发送文件中的数据

1.结合fs发送文件中的数据
2.Content-Type
不同资源对应的Content-Type不一样
图片不需要指定编码，一般只为字符数据指定编码

# npm

1.npm命令

```javascript
npm init -y // 可以跳过向导 ，快速生成
npm install //一次性把dependencies全部安装
npm install 包名  //只下载   简写 npm i 包名
npm install --save 包名  //下载并保存依赖项（package.json文件中的dependencies）  简写npm -S 包名

npm uninstall 包名  //只删除，依赖项会保存  简写 npm un 包名
npm uninstall --save //删除的同时依赖信息也去除  简写 npm un -S包名
```

# Node 简易爬虫

获取目标网站
分析网站内容
获取有效信息，下载或者其他操作

# Express

通过express框架书写API
非关系数据库mongodb
1.什么是API
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/295254c97fa7563838b7ec75fd04b3bc.png)
2.登录接口逻辑分析
● 接收用户传递数据
● 处理数据
● 返回数据

## 1.Experss基本使用

### 1）步骤

安装express

```javascript
var express = require("express");
var app = express();
// 最简单的APi接口
app.get("/user/login", function (req, res) {
  console.log("你好");
  res.send("注册成功");
});
app.listen(3000, function () {
  //监听300端口 开启服务器
  console.log("server start");
});
```

### 2）API接口的构成要素

ip
port
pathname
method ：get post
接收用户数据 数据格式后端决定

get请求 用req.query接受参数
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/60ff07c4df588b407833247c3cbf7f6a.png)

### 3）API接口的书写

接收数据

> ● get req.query
> ● post req.body  
> 需要第三方插件body-parser 插件进行解析
> 注意数据格式 json x-www-form-urlencoded formdata

# express 路由

由于接口会有公共的网址 例如user/del user/add
为了使代码简化，可以使用路由
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e3e1e12f42c4587cd11f911be21b8674.png)

userRouter.js

```javascript
var express = require("express");
var router = express.Router();

router.get("/add", function (req, res) {
  res.send("user add");
});

router.get("/del", function (req, res) {
  res.send("user del");
});

module.exports = router;
```

server.js

```javascript
var express = require("express");
var app = express();

let userRouter = require("./router/userRouter");
app.use("/user", userRouter);

app.listen(3000, function () {
  console.log("server start");
});
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1e4e04f6e9c31df390f470ea4af3215f.png)

# 中间件(middlewear)

内置中间件
自定义中间件（全局 局部）
第三方中间件

## 1.自定义中间件

### 1）全局

全局自定义

```javascript
var express = require("express");
var app = express();

// next 是否继续往下执行
app.use("/", function (req, res, next) {
  console.log("中间件");
  // next()
});

// 如果是根路径/  即上面代码等价于
// app.use(function (req, res, next) {
//   console.log("中间件");
//   // next()
// });

app.listen(3000, function () {
  console.log("server.start");
});
app.get("/test1", function (req, res) {
  console.log("test1");
  let { token } = req.query;
  if (token) {
    res.send("ok");
  } else {
    res.send("no");
  }
});
app.get("/test2", function (res, req) {
  console.log("test2");
  if (token) {
    res.send("ok");
  } else {
    res.send("no");
  }
});
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0a3adaae9ad63a12c6712274f75e63a7.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b24b131c76dca979e24cebfa16bfae41.png)

> 当运行并发送请求时，被app.use拦截
> 因为中间件用的 /  
> /text1 /text2 中间件都具有这个符号
> 当发送请求时，会优先处理中间件的处理函数
> 如果中间件处理函数中有next() 会继续往下执行

### 2）局部中间件

```javascript
var express = require("express");
var app = express();

app.listen(3000, function () {
  console.log("server.start");
});

app.get(
  "/test1",
  function (req, res, next) {
    console.log("fun1");
    next();
  },
  function (req, res) {
    console.log("fun2");
    res.send("test1");
  },
);
```

## 2.内置中间件(静态资源目录）

指定一个目录（如hehe），可以被访问
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/20ba6ca48c339b46d78f018daee03058.png)
__dirname可以获得代码所在文件的绝对路径E:\Nodejs\products，然后将目标目录相对于staitc.js的相对路径拼接拼接

static.js

```javascript
// 让hehe变为可访问
var express = require("express");
var app = express();
var path = require("path");
// console.log(__dirname);
// console.log(path.join(__dirname, "./hehe"));

app.listen(3000, function () {
  console.log("server start");
});

app.use(express.static(path.join(__dirname, "./hehe")));
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7863e5d5cc1cf8983ca1891ff99b4819.png)
如果app.use('/public',express.static(path.join(__dirname, "./hehe")));
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/44ae7cd88db642212763e1258c1372bb.png)

# node 中的异步操作

● fs模块对文件的几乎所有操作都有同步和异步两种形式
● 例如：readFile()和readFileSync()
● 区别：
同步调用会阻塞代码的执行，异步则不会
异步调用会将读取任务下达到任务队列，直到任务执行完成才会回调
异常处理方面，同步必须使用try，catch方式，异步可以通过回调函数的第一个参数

# 异步回调promise

如果异步操作需要保持一定的执行顺序 则需要回调函数的嵌套来实现 会导致回调地域

解决方法：promise asyc /await(es7)

## 1.promise

promise是抽象的异步处理对象以及对其进行各种操作的组件，promise并不是从javaScript中发祥的概念
promise最初被提出是在E语言中，它是基于并列/并行处理设计的一种编程语言
现在js也拥有该特性，就是js promise

```javascript
var fs = require("fs");

// 将异步操作封装到promise函数里
function delfile() {
  return new Promise(function (resolve, reject) {
    // 异步操作

    fs.unlink("./hehe.js", function (err) {
      if (err) {
        reject("失败了"); //会向.then 函数传递信息 msg=失败了
      } else {
        resolve("成功"); //err=成功
      }
    });
  });
}
// promise对象可以跟两个函数.then .catch
// 如果执行reject 走catch
// 如果执行resolve 走.then
delfile()
  .then(function (msg) {
    console.log("then" + msg);
  })
  .catch(function (err) {
    console.log("catch" + err);
  });
```

## 2.promise链式调用

在一组链式调用中只需要一个catch

```javascript
var fs = require("fs");
const { resolve } = require("path");
// 1.封装
function isExist() {
  return new Promise(function (resolve, reject) {
    fs.stat("./hehe.js", function (err, stats) {
      if (err) {
        reject("文件不存在");
      } else {
        resolve("文件存在");
      }
    });
  });
}

function delfile() {
  return new Promise(function (resolve, reject) {
    fs.unlink("./hehe.js", function (err) {
      if (err) {
        reject("删除失败");
      } else {
        resolve("删除成功");
      }
    });
  });
}

isExist()
  .then(function () {
    console.log("isExist 的成功处理");
    return delfile();
  })
  .then(function () {
    console.log("删除文件的成功处理");
  })
  .catch(function (err) {
    console.log("catch");
    console.log(err);
  });
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8d1ce65b01428843263c6152eba98178.png)
理解：isExist函数返回的是一个promise对象，使用.then 方法后执行到return delFile（），会返回一个新的promise对象（用来删除文件），新的promise对象的.then方法会继续执行
无论哪个函数中间执行错误，都会调用catch函数（）
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/497479bb33eb7e8308abf9125917e45f.png)

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/139220367)

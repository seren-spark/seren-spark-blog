---
title: "01 【创建一个electron应用】"
description: "01 【创建一个electron应用】：前端知识库章节。"
sidebar:
  order: 1
---

## 1.Electron 初探

### 1.1 常见的桌面GUI工具介绍

| 名称     | 语音   | 优点                     | 缺点                     |
| -------- | ------ | ------------------------ | ------------------------ |
| QT       | C++    | 跨平台、性能好、生态好   | 依赖多，程序包大         |
| PyQT     | Python | 底层集成度高、易上手     | 授权问题                 |
| WPF      | C#     | 类库丰富、扩展灵活       | 只支持Windows，程序包大  |
| WinForm  | C#     | 性能好，组件丰富，易上手 | 只支持Windows，UI差      |
| Swing    | Java   | 基于AWT，组件丰富        | 性能差，UI一般           |
| NW.js    | JS     | 跨平台性好，界面美观     | 底层交互差、性能差，包大 |
| Electron | JS     | 相比NW发展更好           | 底层交互差、性能差，包大 |
| CEF      | C++    | 性能好，灵活集成，UI美观 | 占用资源多，包大         |

- 底层依赖 + 调用：CEF、QT、Swing
- UI美观：Electron（NW.js）、PyQT
- 跨平台：Swing（JAVA）、PyQT（Python、C++）、Electron（前端）

技术是为业务服务的，选择合适的最重要！

### 1.2 桌面端设计与开发要点

1、UX/UI设计概念

**UX设计：** UX（User Experience）即用户体验，其核心是用户，体验指用户在使用产品以及与产品发生交互时出现的主观感受和需求满足。

**UI设计：** UI（User Interface）使用者界面，可以说是 UX 设计的一部分，其中重要的**图形化或者可视化** 部分，都是由 UI 设计来完成的。

2、核心原则

简单易用。

3、通用原则

交互简单：上手就会，一看就懂

风格统一：菜单、导航、按钮反馈、颜色、预知提示

认知一致：名词、友好提示、划分信息、突出展示

4、桌面端设计

保持与PC端统一的风格设计与交互设计。

加入定制的菜单与专业操控设计。

减少资源加载。

## 2.初始化 npm 项目

Electron 应用基于 npm 搭建，以 package.json 文件作为入口点。 首先创建一个文件夹，然后在其中执行 `npm init` 初始化项目。

```sh
npm init
```

这条命令会配置 package.json 中的一些字段。 有几条规则需要遵循：

- *入口点* 应当是 `main.js` (我们很快就会创建它)
- *author* (作者)、*license* (开源许可证) 和 *description* (描述) 可以为任意内容，不过在晚些的 [打包应用程序](https://www.electronjs.org/zh/docs/latest/tutorial/打包教程) 步骤中可能是需要的。

然后，将 Electron 安装为项目的 **devDependencies** ，即仅在开发环境需要的额外依赖。

```sh
npm install electron --save-dev
```

在初始化并且安装完 Electron 之后，文件夹中会出现一个 `node_modules` 文件夹，其中包含了 Electron 可执行文件；还有一个 `package-lock.json` 文件，指定了各个依赖的确切版本。

启动命令写 `"start": "nodemon --watch index.js --exec electron ."` ，这个命令会告诉 Electron 在当前目录下寻找主脚本，并以开发模式运行它。这样子最后在终端输入 `npm start`这样每次修改`index.js` 主进程文件都会重新启动项目了，`index.js`可以自行修改 `main.js`等等

来看看最后的的 `package.json`文件吧

`package.json`

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "dselegent",
  "license": "MIT",
  "scripts": {
    "start": "nodemon --exec electron ."
  },
  "devDependencies": {
    "electron": "22.0.0"
  }
}
```

## 3.运行 Electron 应用

在 package.json 中指定的脚本文件 [`main`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#main) 是所有 Electron 应用的入口点。 这个文件控制 **主程序 (main process)** ，它运行在 Node.js 环境里，负责控制应用的生命周期、显示原生界面、执行特殊操作并管理渲染器进程 (renderer processes)，稍后会详细介绍。

在继续编写 Electron 应用之前，将使用一个小小的脚本来确保主进程入口点已经配置正确。 在根目录的 `main.js` 文件中写一行代码：

`main.js`

```js
console.log(`欢迎来到 Electron 👋`)
```

因为 Electron 的主进程是一个 Node.js 运行时，可以使用 `electron` 命令执行任意 Node.js 代码（甚至将其用作 [REPL](https://www.electronjs.org/zh/docs/latest/tutorial/repl)）。 

```shell
npm run start
```

终端应该会输出 `欢迎来到 Electron 👋`。接下来会学习如何用 HTML 创建用户界面，并将它们装载到原生窗口中。

## 4.将网页装载到 BrowserWindow

在 Electron 中，每个窗口展示一个页面，后者可以来自本地的 HTML，也可以来自远程 URL。 在本例中，我们将会装载本地的文件。 在我们项目的根目录中创建一个 `index.html` 文件，并写入下面的内容：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <meta
      http-equiv="X-Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <title>Hello from Electron renderer!</title>
  </head>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
  </body>
</html>
```

现在有了一个网页，可以将它装载到 Electron 的 [BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window) 上了。 将 `main.js` 中的内容替换成下列代码。 我们马上会逐行解释。

`main.js`

```js
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
```

### 4.1 导入模块

`main.js (Line 1)`

```js
const { app, BrowserWindow } = require('electron')
```

在第一行中，我们使用 CommonJS 语法导入了两个 Electron 模块：

- [app](https://www.electronjs.org/zh/docs/latest/api/app)，它控制应用的事件生命周期。
- [BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window)，它负责创建和管理应用的窗口。

> **在 ELECTRON 中使用 ES 语法**
>
> Electron 目前对 [ECMAScript 语法](https://nodejs.org/api/esm.html) (如使用 `import` 来导入模块) 的支持还不完善。 我们可以在 [electron/electron#21457](https://github.com/electron/electron/issues/21457) 这个 issue 中查看 ESM 的适配进展。

### 4.2 将可复用的函数写入实例化窗口

`createWindow()` 函数将我们的页面加载到新的 BrowserWindow 实例中：

`main.js (Lines 3-10)`

```js
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  win.loadFile('index.html')
}
```

### 4.3 在应用准备就绪时调用函数

`main.js (Lines 12-14)`

```js
app.whenReady().then(createWindow)
```

Electron 的很多核心模组是 Node.js [事件触发器](https://nodejs.org/api/events.html#events)，遵守 Node.js 的异步事件驱动架构。 app 模块就是其中一个。

在 Electron 中，只有在 app 模组的 [`ready`](https://www.electronjs.org/zh/docs/latest/api/app#event-ready) 事件能触发后才能创建 BrowserWindows 实例。 我们可以借助 [`app.whenReady()`](https://www.electronjs.org/zh/docs/latest/api/app#appwhenready) API 来等待此事件，并在该 API 的 promise 被 resolve 时调用 `createWindow()` 方法。

> **提醒**
>
> 通常我们使用触发器的 `.on` 函数来监听 Node.js 事件。
>
> ```diff
> + app.on('ready').then(() => {
> - app.whenReady().then(() => {
>   createWindow()
> })
> ```
>
> 但是 Electron 暴露了 `app.whenReady()` 方法，作为其 `ready` 事件的专用监听器，这样可以避免直接监听 .on 事件带来的一些问题。 参见 [electron/electron#21972](https://github.com/electron/electron/pull/21972) 。

此时，运行 `start` 命令应该能成功地打开一个包含我们网页内容的窗口！

![image-20230109143800738](https://i0.hdslb.com/bfs/album/a736cdbc76451e914f62e998c62154b6e3f47f23.png)

应用中的每个页面都在一个单独的进程中运行，我们称这些进程为 **渲染器 (*renderer*)** 。 渲染器也能访问前端开发常会用到的 API 和工具，例如用于打包并压缩代码的 [webpack](https://webpack.js.org/)，还有用于构建用户界面的 [React](https://reactjs.org/) 。

## 5.管理应用的窗口生命周期

应用窗口在不同操作系统中的行为也不同。 Electron 允许自行实现这些行为来遵循操作系统的规范，而不是采用默认的强制执行。 我们可以通过监听 app 和 BrowserWindow 模组的事件，自行实现基础的应用窗口规范。

> **针对特定进程的控制流**
>
> 可以检查 Node.js 的 [`process.platform`](https://nodejs.org/api/process.html#process_process_platform) 变量，帮助我们在不同操作系统上运行特定代码。 请注意，Electron 目前只支持三个平台：`win32` (Windows), `linux` (Linux) 和 `darwin` (macOS) 。

### 5.1 关闭所有窗口时退出应用 (Windows & Linux)

在 Windows 和 Linux 上，我们通常希望在关闭一个应用的所有窗口后让它退出。 若要在 Electron 中实现这一点，我们可以监听 [`window-all-closed`](https://www.electronjs.org/zh/docs/latest/api/app#event-window-all-closed) 事件，并调用 [`app.quit()`](https://www.electronjs.org/zh/docs/latest/api/app#appquit) 来让应用退出。这不适用于 macOS。

```js
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

### 5.2 如果没有窗口打开则打开一个窗口 (macOS)

与前二者相比，即使没有打开任何窗口，macOS 应用通常也会继续运行。 在没有窗口可用时调用 app 会打开一个新窗口。

为了实现这一特性，可以监听模组的 [`activate`](https://www.electronjs.org/zh/docs/latest/api/app#event-activate-macos) 事件，如果没有任何活动的 BrowserWindow，调用 `createWindow()` 方法新建一个。

因为窗口无法在 `ready` 事件前创建，你应当在你的应用初始化后仅监听 `activate` 事件。 要实现这个，仅监听 `whenReady()` 回调即可。

```js
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
```

## 6.完整实现代码

`main.js`

```js
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

`index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <meta
      http-equiv="X-Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <title>Hello from Electron renderer!</title>
  </head>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
    <p id="info"></p>
  </body>
  <script src="./renderer.js"></script>
</html>
```

## 7.摘要

Electron 程序是通过 npm 包创建的。 我们应将 Electron 依赖安装到 `devDependencies` ，然后在 package.json 中设置一个脚本来运行。

执行命令后，Electron 程序会运行我们在 package.json 文件的 `main` 字段设置的入口文件。 这个入口文件控制着 Electron 的**主进程** ，后者运行于 Node.js 实例，负责应用的生命周期、展示原生窗口、执行特殊操作和管理渲染进程。

**渲染器进程** (简称渲染器) 负责展示图形内容。 我们可以将渲染的网页指向 web 地址或本地 HTML 文件。 渲染器和常规的网页行为很相似，访问的 web API 也相同。

在教程下一节，我们将会学习如何使用 API 给渲染器提前 ，以及如何在进程间通信。

## 8.BrowserWindow 常用配置

```js
const { app, BrowserWindow } = require('electron')
let win
// 监听electron 加载完毕的时候的创建窗口等等
app.on('ready', function () {
    // 创建一个窗口 设置属性
    win = new BrowserWindow({
    //fullscreen: true   //全屏
    //frame: false,   	//让桌面应用没有边框，这样菜单栏也会消失
    resizable: false,   //不允许用户改变窗口大小
    width: 800,         //设置窗口宽高
    height: 600,
    icon: iconPath,     //应用运行时的标题栏图标
    minWidth: 300,     // 最小宽度
    minHeight: 500,    // 最小高度
    maxWidth: 300,    // 最大宽度
    maxHeight: 600,    // 最大高度
    // 进行对首选项的设置
    webPreferences:{    
      backgroundThrottling: false,   //设置应用在后台正常运行
      nodeIntegration:true,     //设置能在页面使用nodejs的API
      contextIsolation: false,  //关闭警告信息
      //preload: path.join(__dirname, './preload.js')
    }
  })
  // 这里让主进程加载一个index.html
  win.loadFile('index.html')
  // 设置为最顶层
  //win.setAlwaysOnTop(true)
  //win.loadURL(`www.baidu.com`) 可以让主进程打开文件或者一个链接
  // 监听窗口关闭事件
  win.on('closed',()=>{
      //释放win
      win = null
  })
})

// 监听所有的窗口都关闭了
app.on('window-all-closed', () => {
    
    console.log('窗口全部都关闭了')
})
```

## 9.Electron 核心概念

### 9.1 Electron 主进程与渲染进程

**主进程：** 启动项目时运行的 main.js 脚本就是我们说的主进程。在主进程运行的脚本可以以创建 Web 页面的形式展示 GUI。**主进程只有一个** 。

**渲染进程：** 每个 Electron 的页面都在运行着自己的进程，这样的进程称之为渲染进程（基于Chromium的多进程结构）。

![image-20220622220437989](https://i0.hdslb.com/bfs/album/f2d00b1ecfb24d029bd5ca450b23b60258cfb358.png)

主进程使用 BrowserWindow 创建实例，主进程销毁后，对应的渲染进程回被终止。主进程与渲染进程通过 IPC 方式（事件驱动）进行通信。

### 9.2 主进程事件生命周期

> main process modules/app/event：https://www.electronjs.org/zh/docs/latest/api/app

```js
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  // 对于 MacOS 系统 -> 关闭窗口时，不会直接推出应用
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  console.log('quit')
})

app.whenReady().then(() => {
  createWindow()
  // 在MacOS下，当全部窗口关闭，点击 dock 图标，窗口再次打开。
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
```

### 9.3 渲染进程如何使用 Node 模块

**1、通过 webPreferences/nodeIntegration**

```js
const win = new BrowserWindow({
  width: 800,
  height: 400,
  webPreferences: {
  	nodeIntegration: true,
  	contextIsolation: false
  }
})
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electron Demo</title>
  <script src="https://unpkg.com/vue@next"></script>
</head>
<body>
  <h1>
    hello Electron
  </h1>
  <div id="root">
    <p>electronVersion: {{electronVersion}}</p>
    <p>nodeVersion: {{nodeVersion}}</p>
    <p>chromeVersion: {{chromeVersion}}</p>
  </div>
  <script>
    // const path = require('path')
    // console.log(path)
    const app = Vue.createApp({
      data() {
        return {
          electronVersion: process.versions.electron,
          nodeVersion: process.versions.node,
          chromeVersion: process.versions.chrome
        }
      }
    })
    app.mount('#root')
  </script>
</body>
</html>
```

**2、通过 webPreferences/preload 实现**

```js
const win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      // 在启动应用时在渲染进程里预加载 js
      preload: path.join(__dirname, './preload-js/index.js')
    }
  })
```

```js
// preload-js/index.js

// const { contextBridge } = require('electron')
// contextBridge.exposeInMainWorld('myAPI', {
//  desktop: true
// })

const { createApp } = require('vue')
window.addEventListener('load', () => {
  const app = createApp({
    data() {
      return {
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node,
        chromeVersion: process.versions.chrome
      }
    }
  })
  app.mount('#root')
})
```

**3、代码改造**

```js
// index.js
 win.loadFile('./renderer/index.html')
```

```html
<!-- renderer/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- <meta http-equiv="Content-Security-Policy" content="script-src 'self';"> -->
  <title>Electron Demo</title>
  <script src="./vue.global.js"></script>
</head>
<body>
  <h1>hello Electron</h1>
  <div id="root"></div>
  <script src="./main.js"></script>
</body>
</html>
```

```js
// renderer/main.js
const app = Vue.createApp({
  template: `
    <p>electronVersion: {{electronVersion}}</p>
    <p>nodeVersion: {{nodeVersion}}</p>
    <p>chromeVersion: {{chromeVersion}}</p>
  `,
  data() {
    return {
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      chromeVersion: process.versions.chrome
    }
  }
})
app.mount('#root')
```

```html
<!-- 配置CSP -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'">
```

```js
// 暂时关闭安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
```


---
title: "回顾 WebSocket 心跳机制以及断线重连（Node 服务端）"
description: "整理 WebSocket 心跳检测、超时判断、网络监听和断线重连的完整思路。"
type: journal
occurredAt: 2025-08-27
publishedAt: 2025-08-27
tags:
  - 网络
sourceUrl: https://blog.csdn.net/HBR666_/article/details/150919272
sourceName: CSDN
relatedDocs: []
---
#  前言
之前一直对websocket 的心跳机制和断线重连有个模糊的了解，项目中也不是我负责写这块的，最近有点时间，但是看网上的文章   总感觉过于冗长且直接贴代码，阅读感受不太好，因此自己总结一篇
# 心跳机制触发过程
##  核心原理
心跳机制通过定时发送 "无业务意义的探测包" 来实现的
若发送方在规定时间内未收到响应，则判断链接失效，触发重连
实际上就是客户端和服务端有来有回的检测，若服务端不回应，则判定异常并重连
##  思路&实现
**需要的变量**： 
心跳发送计时器          `heartbeatTimer` 
心跳超时检测计时器  ` heartbeatTimeoutTimer; `
发送心跳间隔：`const HEARTBEAT_INTERVAL = 5000;`
超时阈值：`const HEARTBEAT_TIMEOUT = 10000;`
**需要的函数**
开启心跳的函数：`startHeartbeat()`
停止心跳：`stopHeartbeat()`
心跳超时检测函数：`startHeartbeatTimeout(）`


**流程**
 - 在连接成功后启动心跳检测 
 - 每隔3S发送心跳消息
 - 如果服务端超过阈值时间，则判定异常，触发重连

**核心代码**

 - `startHeartbeat()`
 本质上就是开启一个计时器而已，每n秒发送一次无交互意义的消息，并启动检测（10s 倒计时）

```typescript
 //  心跳机制
    function startHeartbeat() {
        stopHeartbeat(); // 先清理之前的心跳定时器
        heartbeatInterval = setInterval(function () {
            if (ws && ws.readyState === WebSocket.OPEN) {
                // 发送心跳消息
                ws.send('Heartbeat 心跳检测');
            }
        }, HEARTBEAT_INTERVAL); // 每5秒发送一次心跳
        // 启动检测
        startHeartbeatTimeout()
    }
```

- `startHeartbeatTimeout`
当开启心跳的时候进行超时检测，如果后端响应心跳消息了那么重新进行倒计时，未响应则关闭
```typescript
    // 心跳超时检测
    function startHeartbeatTimeout() {
        console.log("心跳超时检测开始");
        // 重新计算
        clearTimeout(heartbeatTimeoutTimer);
        heartbeatTimeoutTimer = setTimeout(() => {
            // 超时未收到响应，主动断开并重连
            console.error('心跳超时，连接异常');
            ws.close(1000, 'header timeout'); // 主动关闭
        }, HEARTBEAT_TIMEOUT);
    }
```
- `stopHeartBeat`

```typescript
    function stopHeartbeat() {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
        }
    }
```

1. **在连接上websocket 后进行心跳**

```typescript
    ws.onopen = function (e) {
            console.log('ws 已经连接', e);
            ws.send('Hello server')
            // 开始心跳
            startHeartbeat()
        }
```
2. **在接收到心跳消息后进行倒计时检测**

```typescript
   ws.onmessage = function (e) {
            const msg = e.data.trim();
            console.log("接收到的消息", msg);
            // 关键：仅当消息是「心跳响应」时，才重置超时计时器
            if (msg === "Heartbeat_ack") {
                startHeartbeatTimeout()
            }
            // 其他消息（如服务端的"hello client!"）不处理心跳超时，避免误重置
        }
```

#  断线重连触发过程
断线重连 实际上就是当非正常关闭时进行重连逻辑
**需要的变量**
是否主动关闭：`isManualClose`
**需要的函数**
重连函数：`startReconnect()`
监听网络：`window.addEventListener('online/offline')   `

```typescript
    // 启动重连
    function startReconnect() {
        // 清除之前的重连定时器（因为可能之前重连过）
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
        }
        // 检查网络状态，仅在线时重连
        if (!navigator.onLine) {
            console.log('网络离线，等待恢复...');
            return;
        }

        reconnectTimeout = setTimeout(() => {
            console.log('尝试重连...');
            connect(); // 重建连接
        }, RECONNECT_INTERVAL);
    }
```

```typescript
    // // 监听网络状态变化
    window.addEventListener('online', function () {
        console.log('网络已连接');
        // 网络恢复时尝试重连
        if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
            console.log('网络恢复，尝试重新连接...');
            isManualClose = false; // 重置手动关闭标志
            startReconnect();
        }
    });
    window.addEventListener('offline', function () {
        console.log('网络已断开');
        // 网络断开时的处理
        if (ws) {
            console.log('网络断开，WebSocket连接可能已失效');
            ws.close()
        }
        // 清理重连定时器
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
        }
    });
```

#  完整代码
注意：server.js 中我只发送了4次心跳响应，是为了测试心跳逻辑是否正确
  如果要测试断线重连，可以在谷歌开发者工具中的network 模块进行网络离线，不需要手动关闭wifi
##  server.js

```typescript
// 引入需要的模块
const WebSocket = require("ws");
const express = require("express");

// 创建 Express 应用
const app = express();

// 设置静态文件服务
app.use(express.static("public"));

// 添加 CORS 头
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// 基本路由
app.get("/", (req, res) => {
  res.send("hello world");
});

// 创建 HTTP 服务器
const http = require("http");
const server = http.createServer(app);
let once = 0;
// 在 HTTP 服务器上挂载 WebSocket 服务器
const wss = new WebSocket.Server({ server });
// 心跳检测间隔（毫秒）
const heartbeatInterval = 3000;
// 当有客户端连接时触发
wss.on("connection", (socket) => {
  console.log("客户端已连接...");
  socket.send("hello client!");
  // 处理收到的消息
  socket.on("message", (data) => {
    console.log(`收到客户端发送的消息： ${data}`);
    // 如果是心跳消息，可以不做特殊处理或者回应
    if (data.toString() === "Heartbeat 心跳检测") {
      console.log("收到心跳消息");
      //   // 可以选择回应心跳(回应一次)
      if (once < 4) {
        socket.send("Heartbeat_ack");
        once++;
      }

      // !!!!! 测试 故意不回复
    } else {
      // 处理其他消息
      // 这里可以添加你的业务逻辑
    }
  });
});

// 监听端口
server.listen(3000, () => {
  console.log("服务器已经在端口3000启动");
  console.log("HTTP服务示例已经启动 http://localhost:3000");
  console.log("WebSocket服务示例已经启动 ws://localhost:3000");
});

```



##  index.html

```typescript
<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Socket.IO chat</title>
    <style>
        body {
            margin: 0;
            padding-bottom: 3rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        #form {
            background: rgba(0, 0, 0, 0.15);
            padding: 0.25rem;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            height: 3rem;
            box-sizing: border-box;
            backdrop-filter: blur(10px);
        }

        #input {
            border: none;
            padding: 0 1rem;
            flex-grow: 1;
            border-radius: 2rem;
            margin: 0.25rem;
        }

        #input:focus {
            outline: none;
        }

        #form>button {
            background: #333;
            border: none;
            padding: 0 1rem;
            margin: 0.25rem;
            border-radius: 3px;
            outline: none;
            color: #fff;
        }

        #messages {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }

        #messages>li {
            padding: 0.5rem 1rem;
        }

        #messages>li:nth-child(odd) {
            background: #efefef;
        }
    </style>
</head>

<body>
    <div>前后端 Websocket 连接交互</div>
    <button id="createBtn">创建连接</button>
    <button id="closeBtn">断开连接</button>
    <button id="sendBtn">发送消息(未启用)</button>

</body>
<script>

    const createBtn = document.getElementById('createBtn');
    const closeBtn = document.getElementById('closeBtn');
    const sendBtn = document.getElementById('sendBtn');
    // 是否手动关闭
    let isManualClose = false;
    let ws;
    let reconnectTimeout;
    // 心跳间隔
    const HEARTBEAT_INTERVAL = 3000;
    // 如果10s未响应则超时
    const HEARTBEAT_TIMEOUT = 10000;
    // 重连
    const RECONNECT_INTERVAL = 5000;

    let heartbeatInterval; // 心跳发送计时器
    let heartbeatTimeoutTimer; // 心跳超时检测计时器
    function connect() {
        // 如果已有连接，先关闭
        if (ws) {
            ws.close();
        }
        ws = new WebSocket('ws://localhost:3000');
        ws.onopen = function (e) {
            console.log('ws 已经连接', e);
            ws.send('Hello server')
            // 开始心跳检测
            startHeartbeat()
        }
        ws.onmessage = function (e) {
            const msg = e.data.trim();
            console.log("接收到的消息", msg);
            // 关键：仅当消息是「心跳响应」时，才重置超时计时器
            if (msg === "Heartbeat_ack") {
                startHeartbeatTimeout()
            }
            // 其他消息（如服务端的"hello client!"）不处理心跳超时，避免误重置
        }
        ws.onerror = function () {
            console.log('WebSocket error');
            //如果链接错误 则关闭链接 触发重连
            ws.close();
            // 停止心跳
        };

        ws.onclose = function () {
            console.log('WebSocket closed');
            // 停止心跳
            stopHeartbeat();
            // 非主动关闭
            if (!isManualClose) {
                console.log("异常关闭，尝试重连");

                startReconnect()
            }

        };
    }

    createBtn.addEventListener('click', () => {
        isManualClose = false
        connect();

    })


    closeBtn.addEventListener('click', () => {
        manualClose()
    });


    // 启动重连
    function startReconnect() {
        // 清除之前的重连定时器（因为可能之前重连过）
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
        }
        // 检查网络状态，仅在线时重连
        if (!navigator.onLine) {
            console.log('网络离线，等待恢复...');
            return;
        }

        reconnectTimeout = setTimeout(() => {
            console.log('尝试重连...');
            connect(); // 重建连接
        }, RECONNECT_INTERVAL);
    }

    //  心跳机制
    function startHeartbeat() {
        stopHeartbeat(); // 先清理之前的心跳定时器
        heartbeatInterval = setInterval(function () {
            if (ws && ws.readyState === WebSocket.OPEN) {
                // 发送心跳消息
                ws.send('Heartbeat 心跳检测');
            }
        }, HEARTBEAT_INTERVAL); // 每3秒发送一次心跳
        // 启动检测
        startHeartbeatTimeout()
    }
    function stopHeartbeat() {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
        }
    }

    // 心跳超时检测

    function startHeartbeatTimeout() {
        // debugger;
        console.log("心跳超时检测开始");

        // 重新计算
        clearTimeout(heartbeatTimeoutTimer);
        heartbeatTimeoutTimer = setTimeout(() => {
            // 超时未收到响应，主动断开并重连
            console.error('心跳超时，连接异常');
            ws.close(1000, 'header timeout'); // 主动关闭
            // 触发重连逻辑（此处省略，可参考之前的断线重连实现）
        }, HEARTBEAT_TIMEOUT);
    }

    // 手动关闭连接（不触发重连）
    function manualClose() {
        //停止一切操作
        isManualClose = true;
        if (ws) {
            ws.close(1000, 'manual close');
        }
        stopHeartbeat();
    }
    // // 监听网络状态变化
    window.addEventListener('online', function () {
        console.log('网络已连接');
        // 网络恢复时尝试重连
        if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
            console.log('网络恢复，尝试重新连接...');
            isManualClose = false; // 重置手动关闭标志
            startReconnect();
        }
    });
    window.addEventListener('offline', function () {
        console.log('网络已断开');
        // 网络断开时的处理
        if (ws) {
            console.log('网络断开，WebSocket连接可能已失效');
            ws.close()
        }
        // 清理重连定时器
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
        }
    });

</script>

</html>
```


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/150919272)

---
title: "Node 环境的事件循环"
description: "对比浏览器与 Node.js 事件循环，回顾 V8、libuv 与异步任务。"
type: journal
occurredAt: 2024-12-01
publishedAt: 2024-12-01
tags:
  - Node.js
sourceUrl: https://blog.csdn.net/HBR666_/article/details/144167172
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/b3ad8971fc524d7fa00d630db222be0f.png
---

#  前言
参考文章:
[浏览器与Node事件循环有何区别？](https://juejin.cn/post/6844903761949753352?searchId=20241201112635560E1E0B2E40DA372101#heading-13)

[这么通俗易懂的Node事件循环，背就完了](https://juejin.cn/post/7209698674905382973)
#  node简介
Node 中的 Event Loop 和浏览器中的是完全不相同的东西。Node.js采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现


#  六个阶段
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b3ad8971fc524d7fa00d630db222be0f.png)
从上图中，大致看出node中的事件循环的顺序：
外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段（按照该顺序反复运行）...

 - timers 阶段：这个阶段执行timer（setTimeout、setInterval）的回调 
 - I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调 
 - idle, prepare 阶段：仅node内部使用
 -  poll  阶段：获取新的I/O事件, 适当的条件下node将阻塞在这里 
 - check 阶段：执行 setImmediate() 的回调 
 - close
   callbacks 阶段：执行 socket 的 close 事件回调
上面六个阶段都不包括 process.nextTick()

**接下去我们详细介绍timers、poll、check这3个阶段，因为日常开发中的绝大部分异步任务都是在这3个阶段处理的**
##  (1)timer
timer阶段会执行setTimeout 和setInterval回调 并且是由poll阶段控制的，同样 在Node中定时器指定的时间也不是准确时间 只能是尽快执行
## (2）poll
poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

> 1.回到 timer 阶段执行回调
> 2.执行 I/O 回调 并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情
> 
> 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制 如果 poll 队列为空时，会有两件事发生
> 
> 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调 如果没有 setImmediate
> 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去



当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

##  (3) check阶段
setImmediate()的回调会被加入check队列中，从event loop的阶段图可以知道，check阶段的执行顺序在poll阶段之后。 
#  Micro-Task Macro-Task
Node端事件循环中的异步队列也是这两种：macro（宏任务）队列和 micro（微任务）队列。

常见的 macro-task 比如：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作等。
常见的 micro-task 比如: process.nextTick、new Promise().then(回调)等。

# 注意点：
## （1）setTImeOut  setImmediate
二者非常相似 区别主要在于调用时机不同    他们的执行时机并不是固定的setTimeout 先  setImmediate后 因为事件循环有一定的准备阶段   当setTimeout没有准备好时  不会进入该次循环  该次只有setImmediate  setTimeout会在下次循环中执行

## (2）process.nextTick()
这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行。




---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/144167172)

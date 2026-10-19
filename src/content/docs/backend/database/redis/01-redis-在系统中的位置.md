---
title: "01 Redis 在系统中的位置"
description: "理解 Redis、MySQL、浏览器缓存与应用内存各自解决的问题。"
type: note
category: 服务端 / 数据库 / Redis
tags:
  - Redis
  - 缓存
  - 后端基础
firstLearnedAt: 2026-09-21
updatedAt: 2026-09-21
status: active
sidebar:
  order: 1
---
## 先理解它的位置，再学习命令

<p class="redis-goal">学习目标 · 能画出一次请求的路径，并判断一个需求是否值得引入 Redis。</p>

### 1.1 从你熟悉的前端出发

前端的 `Map` 可以暂存接口结果，刷新页面后就可能消失。后端也可以在 JVM 的内存里放一个 Map，但如果部署了 3 个 Spring Boot 实例，它们的 Map 不会自动同步。Redis 是一个独立运行的服务：多个后端通过网络连接它，读写同一份数据。它主要在内存中处理数据，也能把数据持久化到磁盘。

**Redis 是工具，缓存是用途。** 你可以用 Redis 存缓存，也可以用它做排行榜、共享登录态和计数。不能因为它支持持久化，就默认它能替代关系型数据库的约束、事务与查询能力。

<figure class="redis-diagram"><div class="redis-flow"><div>浏览器<small>fetch / axios</small></div><b>→ HTTP →</b><div>Spring Boot<small>鉴权、业务逻辑</small></div><b>→ TCP →</b><div class="redis-accent">Redis<small>共享数据 / 缓存</small></div></div><div class="redis-flow redis-flow-secondary"><div>缓存未命中</div><b>→</b><div>MySQL<small>持久业务事实</small></div><b>→</b><div>回填 Redis，再返回 JSON</div></div><figcaption>图 01 · Redis 客户端运行在后端。网页不直接连接 Redis，Redis 凭据不放进前端代码。</figcaption></figure>

### 1.2 四种“存数据”，解决四种问题

| 位置 | 谁能看见 | 常见用途 | 需要面对的边界 |
| --- | --- | --- | --- |
| 浏览器 HTTP 缓存 / localStorage | 当前客户端；具体受来源和浏览器规则约束 | 静态资源、界面偏好 | 用户能改；不能作为权限或余额的可信来源 |
| 后端本地缓存 | 一个进程 | 极热配置、短期只读数据 | 多实例不同步，重启丢失，占用 JVM 内存 |
| Redis | 能连接它的后端实例 | 可重建缓存、计数、共享状态 | 网络会失败，内存有限，一致性需要设计 |
| MySQL | 经数据库连接访问的业务服务 | 订单、账户、关系查询 | 需要索引、事务和容量规划 |

例子：商品名称和介绍可以缓存 5 分钟。库存扣减不能直接相信一个可能过期的商品详情缓存；下单时要由具有正确并发约束的库存流程重新校验。**能展示，不等于能作为交易依据。**

### 1.3 一次缓存命中的价值

假设数据库查询加对象组装需要 30ms，Redis 读取加反序列化需要 2ms。命中率为 95%，未命中按 32ms 粗算：平均时间约为 `0.95 × 2 + 0.05 × 32 = 3.5ms`。这是理解收益的假设，不是性能承诺；真实系统还包括连接等待、排队、网络、写缓存和请求并发。

另一面：假设入口每秒 10,000 次读取，缓存命中率 95%，约 500 次回源；命中率掉到 80%，约 2,000 次回源。命中率只降了 15 个百分点，数据库压力却变成 4 倍。缓存与数据库必须一起观察。

<aside class="redis-note"><strong>前端经验可以迁移</strong><p>Cache Aside 像“先检查本地是否有结果，没有再请求并保存”；区别是服务端有多线程、多实例、事务和网络故障。Java 的同步调用也不是 Promise：一次慢 Redis 调用可能一直占用请求线程，直到返回或超时。</p></aside>

### 常见误区

- “用了 Redis 就一定更快”：低重复访问的数据可能只是多一次网络往返和序列化。
- “所有东西都要缓存”：先找到慢查询、重复读取或跨实例共享状态的真实需求。
- “缓存丢了没有任何影响”：即使数据可重建，集中回源也可能拖垮数据库。

### 动手练习

给个人博客设计三项数据：文章正文、浏览次数、用户支付记录。分别写出事实来源、是否适合 Redis、丢失或过期后的影响。先不要写代码。

<details class="redis-answer"><summary>自测与答案 · 为什么三个后端实例不能只用一个 Java Map？</summary><p>每个实例都有自己的内存，A 写入后 B 不能直接看见。Redis 提供共享访问点，但会增加网络和故障处理。练习参考：文章正文可由数据库重建，适合缓存；浏览次数可以在 Redis 聚合，但要明确是否允许少量丢失、如何持久化及去重；支付记录以可靠数据库和支付核对流程为准，Redis 只能辅助查询或幂等，不能成为唯一正确性保障。</p></details>

<p class="redis-sources">继续阅读：<a href="https://redis.io/docs/latest/develop/data-types/">Redis 数据模型</a></p>

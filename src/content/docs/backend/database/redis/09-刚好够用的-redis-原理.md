---
title: "09 刚好够用的 Redis 原理"
description: "理解线程模型、底层编码、过期删除与内存淘汰。"
type: note
category: 服务端 / 数据库 / Redis
tags:
  - Redis
  - 原理
  - 内存
firstLearnedAt: 2026-09-21
updatedAt: 2026-09-21
status: active
sidebar:
  order: 9
---
## 原理学到能解释现象，就够用了

<p class="redis-goal">学习目标 · 解释 Redis 为什么快、为什么也会卡，区分过期与淘汰，并看懂常见内存编码的意义。</p>

### 9.1 为什么快，为什么单条慢命令很危险

Redis 的基础优势来自内存操作、适合业务操作的数据结构和高效网络处理。主线里的普通命令主要在主线程串行执行，减少了复杂的数据结构并发争用；网络 I/O 可以采用多线程，持久化、异步释放等也有其他进程或线程参与。不能把“命令主要串行”说成“整个 Redis 只有一个线程”，也不能把 I/O 多线程说成“所有命令随便并行执行”。

可以类比前端事件循环：一个很重的同步任务会卡住后续事件。Redis 中长 Lua、大范围集合操作、大 Value 编解码等也会让其他请求等待。I/O 多路复用的重点是用少量线程管理很多连接，不必为每个连接常驻一个线程等待数据；这不改变慢命令本身的成本。

<aside class="redis-note"><strong>面试答到这一层</strong><p>先讲内存、数据结构、命令执行与网络模型，再说明瓶颈可能落在 CPU、网络、内存、客户端或磁盘。不要只背“单线程所以快”。这一轮不要求手写 epoll 服务端。</p></aside>

### 9.2 数据类型与底层编码：知道关系，不背旧阈值

| 概念 | 需要理解的意义 |
| --- | --- |
| SDS / 字符串编码 | Redis 字符串按长度处理字节，能保存二进制；整数值可使用更紧凑的编码 |
| listpack | 小集合紧凑存储，减少每个元素的对象和指针开销；规模变化可能触发编码转换 |
| 哈希表与渐进式 rehash | 平均查找高效，扩容迁移分步推进，避免一次搬迁全部元素造成大停顿 |
| 跳表 + 哈希表 | 常见大 ZSet 编码结合按成员查找和有序范围访问；小 ZSet 可能走紧凑编码 |
| quicklist / listpack | List 的具体编码依版本与大小而变，重点是两端操作与中间访问的成本不同 |

```text
SET learn:encoding:number 123
SET learn:encoding:text hello
HSET learn:encoding:hash name Alice level 1
OBJECT ENCODING learn:encoding:number
OBJECT ENCODING learn:encoding:text
OBJECT ENCODING learn:encoding:hash
MEMORY USAGE learn:encoding:hash
```

观察本机返回值，不要求固定匹配某组字符串或字节数。Redis 版本、配置和内容都会影响编码。老视频中的 ziplist 和某些固定转换阈值不能无条件套到新版本；面试里能解释“紧凑存储节省内存，但查找和转换有成本”更重要。

### 9.3 过期与淘汰：一个看时间，一个看内存

**过期**：Key 设了期限，到期后访问不应再取得旧值；Redis 在访问检查与主动扫描中处理它。**淘汰**：内存超过配置上限时，根据策略提前移除一些数据，即使其 TTL 还没到。没有 TTL 也可能在 allkeys 策略下被淘汰。

| 策略 | 含义 | 典型取舍 |
| --- | --- | --- |
| noeviction | 不主动淘汰；需要分配内存的写命令可能被拒绝 | 容量与写失败必须处理；不代表所有写都成功 |
| allkeys-lru | 在全部 Key 中近似淘汰近期少访问的数据 | 通用缓存候选；可能误淘汰重要状态 |
| allkeys-lfu | 在全部 Key 中按衰减后的访问频率近似淘汰 | 适合热点相对稳定的缓存，要结合实际负载评估 |
| volatile-lru / volatile-lfu | 只在设有过期时间的 Key 中选择 | 没有可淘汰 Key 时不能凭空释放容量 |
| volatile-ttl | 优先淘汰接近过期的数据 | 用剩余寿命作为优先级 |

LRU 看“最近访问”，LFU 看“访问频率并考虑衰减”，都不是业务优先级。Redis 使用近似策略，不能要求严格全局排序。缓存与登录态、锁等重要状态混在同一个 allkeys 实例里，会产生不同的丢失代价，通常应按数据语义和容量需求隔离。

### 常见误区

- “TTL 没到数据不可能没了”：内存淘汰、人工删除、故障都可能影响它。
- “内存设 8GB，就给进程只留 8GB”：复制缓冲、客户端、持久化和运行开销也要空间。
- “淘汰策略可以保证不丢业务数据”：它只是内存压力下的取舍，不能代替业务持久化。

### 动手练习

对三个小 Key 执行 OBJECT ENCODING 与 MEMORY USAGE；读取 `CONFIG GET maxmemory` 和 `CONFIG GET maxmemory-policy`，不修改正在使用的实例。解释两种“提前不见”：TTL 到期、内存淘汰。

<details class="redis-answer"><summary>自测与答案 · 访问很频繁的 Key 为什么也可能失效？</summary><p>如果到达 TTL，它仍会过期，访问频率不会自动续期。LRU/LFU 是内存压力下的候选选择策略，与到期判断不是一回事。CONFIG 可能被托管服务禁用或受 ACL 限制，此时在平台控制台查看，不应绕过权限。能区分过期、淘汰和持久化，已经覆盖了多数初中级面试所需的基础原理。</p></details>

<p class="redis-sources">依据：<a href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/">内存编码</a> · <a href="https://redis.io/docs/latest/commands/object-encoding/">OBJECT ENCODING</a> · <a href="https://redis.io/docs/latest/develop/reference/eviction/">淘汰策略</a> · <a href="https://redis.io/docs/latest/commands/expire/">过期机制</a></p>

---
title: "06 六个常用 Redis 业务功能"
description: "验证码、登录态、点赞、排行榜、计数与限流的实现思路。"
type: note
category: 服务端 / 数据库 / Redis
tags:
  - Redis
  - Spring Boot
  - 业务实战
firstLearnedAt: 2026-09-21
updatedAt: 2026-09-21
status: active
sidebar:
  order: 6
---
## 六个常用功能，学会迁移思路

<p class="redis-goal">学习目标 · 能为验证码、登录态、点赞、排行榜、计数和限流选择 Key、命令及失败策略。</p>

### 6.1 验证码：短期状态，加一次性消费

验证码由服务端用安全随机数生成，设置 2–5 分钟有效期只是示例，具体由业务决定。不要记日志，也不要把真实手机号直接暴露在 Key 中。可用 `auth:otp:login:手机号摘要` 为 Key，Value 保存服务端带密钥的验证码摘要，避免六位数字普通哈希被快速枚举。验证码发送与校验都要限流，校验次数要有上限。

校验成功后消费凭证，避免重复使用。GET、Java 比较、DEL 三步之间有竞态；下面用 Lua 在服务端比较并删除，`ARGV[1]` 是后端算好的待比对摘要。

```lua
-- Lua · 脚本正文，通过 EVAL 或 Spring RedisScript 执行
-- KEYS[1]：验证码 key；ARGV[1]：后端算出的候选摘要
local expected = redis.call('GET', KEYS[1])
if not expected then return 0 end
if expected ~= ARGV[1] then return -1 end
redis.call('DEL', KEYS[1])
return 1
```

1 代表成功且消费；0 代表不存在或过期；-1 代表不匹配。这个脚本不包含发送流程和次数限制，要结合后面的限流逻辑；真实校验失败达到上限应锁定本轮验证码。Redis 故障时不能把校验结果当成功。验证码消费后用户创建失败，需重新验证或设计幂等流程，不假装两种存储已经处于同一个事务。

### 6.2 登录态：Token 是索引，不是用户 ID

服务端认证成功后生成难以猜测的随机 Token，Redis 保存 `auth:session:token摘要 → 最小用户信息`，配置 TTL。浏览器每次请求携带 Token，后端查询登录态，再检查具体资源权限。退出时删除对应 Key。

```java
// Java · 方法体片段；redis 是已注入的 StringRedisTemplate
// import java.time.Duration;
// tokenDigest：服务端对随机 Token 的摘要；userId：已经认证的用户
redis.opsForValue().set("auth:session:" + tokenDigest, userId,
        Duration.ofMinutes(30));
String currentUser = redis.opsForValue().get("auth:session:" + tokenDigest);
// currentUser == null：未登录或已过期；连接异常：鉴权服务不可用
```

如果需要滑动过期，可在合法请求时用 GETEX（Java 的 getAndExpire）读取并续期，另设绝对最长会话期限；避免把不存在的会话凭空创建回来。Token 不放 URL；根据跨站需求选择 HttpOnly/Secure Cookie 并处理 CSRF，或合理的 Authorization 方案。纯 JWT 不一定需要每次查 Redis，但注销、撤销和权限即时变化是另一套取舍。

### 6.3 点赞：不要“先判断，再决定加减”

```java
// Java · 方法体片段；userId 来源于鉴权结果
Long added = redis.opsForSet().add("social:post:88:likes", userId);
Long removed = redis.opsForSet().remove("social:post:88:likes", userId);
Long count = redis.opsForSet().size("social:post:88:likes");
```

上面三行是三个独立操作示例，不是一次请求全部执行。将“点赞”和“取消点赞”设计为两个明确动作：SADD / SREM 重复执行都不会累积错误。一个“切换点赞”接口重试两次会把状态翻回去。热门内容的成员集合要控制规模、按需求分页；长期点赞事实可落数据库并通过唯一约束保证用户与内容关系唯一，Redis 负责加速，双方同步需单独设计。

### 6.4 排行榜：累计积分与展示分离

```java
// Java · 方法体片段；需 StringRedisTemplate
redis.opsForZSet().incrementScore("game:rank:2026w39", "user-7", 10);
var top10 = redis.opsForZSet().reverseRangeWithScores("game:rank:2026w39", 0, 9);
Long rank = redis.opsForZSet().reverseRank("game:rank:2026w39", "user-7");
Long displayedRank = rank == null ? null : rank + 1;
```

按赛季或周划分 Key，并设置归档和过期策略。积分更新事件如果重投，ZINCRBY 会重复加分；需要事件 ID 去重，或以事实分数执行 ZADD。若通过“去重 Key + 更新积分”做 Lua 原子处理，在 Cluster 中相关 Key 还必须同槽，且去重信息保留期限不能短于重放窗口。

### 6.5 计数：INCR 解决并发，不解决重复请求

两个请求都 GET 到 10，再 SET 11，最后只增加一次。INCR 将读取、增加、写入合为一个操作，两个成功请求后为 12。但是客户端超时后重试 INCR，有可能第一次已执行，导致多加一次。**原子性与幂等性是不同问题。** 普通 PV 可以接受一定统计误差，账务扣减不能套同一策略。

### 6.6 固定窗口限流：用短脚本绑定计数与过期

下面表示每个 Key 从首次请求开始的一段窗口，窗口内最多放行 limit 次；不是精确对齐自然分钟。参数由后端配置校验，不能让终端用户任意提供。

```lua
-- Lua · KEYS[1]：限流 key；ARGV[1]：窗口秒数；ARGV[2]：允许次数
local seconds = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
if not seconds or seconds < 1 or seconds % 1 ~= 0 then
  return redis.error_reply('invalid window')
end
if not limit or limit < 1 or limit % 1 ~= 0 then
  return redis.error_reply('invalid limit')
end
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], seconds) end
if count > limit then return 0 end
return 1
```

脚本只使用一种受控类型的 Key，参数先校验再写入。1 放行，0 拒绝。首次 INCR 与 EXPIRE 在一段脚本中执行，消除应用两次调用之间退出的窗口；Lua 并不提供运行错误后的回滚。

**先不用 Java，也可以验证脚本。** 把上方 Lua 正文保存为当前文件夹的 `limit.lua`（不是 limit.lua.txt），然后在 PowerShell 执行下面两行。第一行把练习文件复制进学习容器，第二行运行脚本；逗号前是 Key，后面是参数，逗号两边要有空格。在 10 秒内连续执行第二行 4 次，观察返回值。

```powershell
# PowerShell · 前提：当前目录已有 limit.lua，学习容器已启动
docker cp .\limit.lua redis-learning:/tmp/limit.lua
docker exec redis-learning redis-cli --eval /tmp/limit.lua learn:limit:test , 10 3
```

```java
// Java · 方法片段；导入 java.util.List;
// org.springframework.data.redis.core.script.DefaultRedisScript;
// 将上方 Lua 正文保存为 String limitLua；redis 为已有模板
DefaultRedisScript<Long> script = new DefaultRedisScript<>(limitLua, Long.class);
Long allowed = redis.execute(script, List.of("api:limit:user-7:search"), "60", "100");
boolean pass = Long.valueOf(1L).equals(allowed);
```

实际项目将脚本对象复用为 Bean 或常量，避免每次请求创建。身份应取自可信鉴权信息；匿名接口可按 IP 等维度，但需处理代理与共享出口。Redis 超时时，登录/验证码类保护优先拒绝或采用严格本地兜底；普通浏览可用较宽松本地限额，必须事先明确策略。

| 算法 | 适合 | 局限 |
| --- | --- | --- |
| 固定窗口 | 简单 API 次数上限 | 窗口交界附近可能集中放行，短时间接近两倍限额 |
| 滑动窗口 | 更平滑地控制近期请求数 | 常用 ZSet，需裁剪历史和控制成员量 |
| 令牌桶 | 允许受控突发、限制长期速率 | 需要计算补充令牌，校准时间和突发上限 |

### 常见误区

- 用明文用户 ID 当登录 Token，任何人都能猜到。
- 用 Redis 的过期与淘汰机制代替业务确认，导致关键状态意外失效。
- 自动重试所有写操作，认为“单命令原子”就不怕重复。

### 动手练习

用 `learn:limit:test` 测试 10 秒窗口最多 3 次，连续运行限流脚本 4 次；等待窗口结束再试。再分析：点赞重复请求、排行榜加分重复请求，哪一个天然幂等？

<details class="redis-answer"><summary>自测与答案 · 限流为什么不每次请求都 EXPIRE？</summary><p>每次刷新 TTL 会让高频请求一直延长窗口，变成另一种语义。当前脚本只在第一次计数为 1 时设置过期，四次预期 1、1、1、0，过期后再次允许。明确的 SADD 点赞幂等，ZINCRBY 加分不幂等。限流脚本要测试非法参数不会先写入数据；不要把计数 Key 与其他用途混用。</p></details>

<p class="redis-sources">依据：<a href="https://redis.io/docs/latest/commands/incr/">INCR 与限流模式</a> · <a href="https://redis.io/docs/latest/commands/getex/">GETEX</a> · <a href="https://redis.io/docs/latest/develop/programmability/eval-intro/">Lua 脚本</a></p>

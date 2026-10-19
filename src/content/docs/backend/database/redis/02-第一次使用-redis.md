---
title: "02 第一次使用 Redis"
description: "在 Windows 与 Docker 中启动 Redis，掌握 Key、Value 和 TTL。"
type: note
category: 服务端 / 数据库 / Redis
tags:
  - Redis
  - Docker
  - redis-cli
firstLearnedAt: 2026-09-21
updatedAt: 2026-09-21
status: active
sidebar:
  order: 2
---
## 第一次把数据写进去

<p class="redis-goal">学习目标 · 在 Windows 上连接一个本地 Redis，理解 Key、Value、类型与 TTL，并能独立排查连接问题。</p>

### 2.1 环境与命令的执行位置

主线使用 **Redis 8.2、Java 17、Spring Boot 3.5.x** 的基础能力；这是一套教学基线，不表示最新版本。大部分核心命令也适用于 Redis 7.x，特定差异会单独注明。首次拉取镜像和下载依赖需要联网。HTML 本身不联网也能阅读。

先安装并启动 Docker Desktop，使用 Linux containers 后端；Windows 根据 Docker 的提示启用 WSL 2 / 虚拟化。下面在 **PowerShell** 逐行执行，不要在 redis-cli 里执行 Docker 命令。

```powershell
# PowerShell · 可直接执行；首次需要拉取镜像
docker version
docker run -d --name redis-learning -p 127.0.0.1:6379:6379 -v redis-learning-data:/data redis:8.2 redis-server --appendonly yes
docker exec redis-learning redis-cli PING
docker exec -it redis-learning redis-cli
```

预期：`docker version` 同时显示 Client 和 Server；`docker run` 返回容器 ID；PING 返回 `PONG`；最后出现 `127.0.0.1:6379>` 提示符。端口映射只绑定本机；命名卷保存 `/data`，容器退出后数据卷仍存在。`8.2` 是会更新补丁的标签，需要严格复现实验时记录镜像 digest。

### 2.2 在 redis-cli 里练一遍

下面的代码块只有命令，可以整段复制。右侧结果用文字说明，避免把输出误当成下一条命令。

```text
SET learn:hello "redis" EX 60
GET learn:hello
TYPE learn:hello
TTL learn:hello
EXPIRE learn:hello 120
EXISTS learn:hello
DEL learn:hello
GET learn:hello
```

| 步骤 | 预期结果 | 学到什么 |
| --- | --- | --- |
| SET / GET | OK / "redis" | Key 是名字，Value 是内容 |
| TYPE | string | 一个 Key 在同一时刻对应一种 Value 类型 |
| TTL | 0 到 60 左右，随操作耗时减少 | 返回剩余秒数；PTTL 是毫秒 |
| EXPIRE | 1 | 给已存在的 Key 更新过期时间 |
| EXISTS / DEL | 1 / 1 | 存在；成功删除一个 Key |
| 最后 GET | (nil) | 不存在，不是字符串 "null" |

**TTL 的特殊值：`-1` 表示存在但没有过期时间；`-2` 表示 Key 不存在。** 读 GET 不会自动续期。普通 SET 覆盖一个已有 Key 会移除原 TTL，除非设置新的 EX/PX，或明确使用 KEEPTTL。

```text
SET learn:ttl old EX 120
SET learn:ttl new
TTL learn:ttl
SET learn:ttl newest EX 120
SET learn:ttl final KEEPTTL
TTL learn:ttl
SET learn:once token-a NX EX 10
SET learn:once token-b NX EX 10
```

第一次 TTL 预期 `-1`；第二次为剩余正数。连续执行最后两条：第一次返回 OK，第二次通常返回 nil，因为 NX 只允许 Key 不存在时写入。EX 的单位是秒，PX 的单位是毫秒；把“检查存在”和“写入”合成一条命令，才能避免两条命令之间被另一个请求插入。

### 2.3 报错时先分清是哪一层

| 现象 | 先检查 | 做法 |
| --- | --- | --- |
| Docker 无法连接 daemon / pipe 不存在 | Docker Desktop 是否启动 | 等引擎就绪后重新执行 docker version |
| 名称 redis-learning 已占用 | 容器是否已经创建 | `docker ps -a` 查看；已有容器用 `docker start redis-learning` |
| 6379 已占用 | 本机是否有别的 Redis | 改成 `-p 127.0.0.1:6380:6379`，宿主机应用改连 6380 |
| Connection refused | 容器状态、端口映射、应用配置 | `docker logs redis-learning` 和 PING 验证 |
| WRONGTYPE | 用 TYPE 看 Value 类型 | 不要对 String 执行 HGET；核对命名冲突 |
| NOAUTH / NOPERM | 身份认证 / ACL | 用分配的账号和命令权限连接，不是数据不存在 |

`exit` 退出 redis-cli；PowerShell 执行 `docker stop redis-learning` 停止练习实例，`docker start redis-learning` 再启动。服务端数据库编号与 SQL 库不是同一个概念：单机默认有多个逻辑 DB，但不是安全隔离。Cluster 只支持 DB 0，教程统一使用 DB 0 和 `learn:` 前缀。

### 常见误区

- “SET 后再 EXPIRE 总是等价”：如果进程在两条命令之间退出，就留下无期限数据；优先 SET 带 EX/PX。
- “连上 Redis 就可以开放给互联网”：学习实例只监听本机；生产使用内网、ACL、适用的 TLS 与凭据管理。
- “清理练习用 FLUSHALL 最方便”：它会删除整个实例的数据。只操作明确属于练习的 Key，不使用清库命令。

### 动手练习

创建一个 10 秒后过期的 `learn:exercise:ttl`，在过期前后分别执行 GET、TTL；再创建一个不过期的 Key，对比结果。完成后只 DEL 这两个练习 Key。

<details class="redis-answer"><summary>自测与答案 · GET 会延长 TTL 吗？Key 到期就会立刻释放物理内存吗？</summary><p>GET 不会续期；GETEX 可把读取和更新过期时间合成一个操作。练习中到期后的 GET 是 nil，TTL 是 -2。Redis 通过访问时检查与主动过期扫描清理到期数据，不保证物理内存在到期瞬间就被释放；不要把过期事件当成精确的定时任务触发器。</p></details>

<p class="redis-sources">依据：<a href="https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/">Docker 安装说明</a> · <a href="https://redis.io/docs/latest/commands/set/">SET</a> · <a href="https://redis.io/docs/latest/commands/ttl/">TTL</a> · <a href="https://redis.io/docs/latest/commands/expire/">EXPIRE</a></p>

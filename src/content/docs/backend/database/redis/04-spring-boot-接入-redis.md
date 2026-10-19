---
title: "04 Spring Boot 接入 Redis"
description: "使用 Spring Data Redis、StringRedisTemplate、JSON 和 Spring Cache。"
type: note
category: 服务端 / 数据库 / Redis
tags:
  - Redis
  - Java
  - Spring Boot
firstLearnedAt: 2026-09-21
updatedAt: 2026-09-21
status: active
sidebar:
  order: 4
---
## 在 Spring Boot 里读写 Redis

<p class="redis-goal">学习目标 · 看懂连接配置、构造器注入、序列化与 TTL，能把一个 Redis 操作接进现有接口。</p>

### 4.1 三个角色：Spring、客户端、服务端

Spring Data Redis 提供统一操作接口；Lettuce 是实际负责连接和通信的客户端；Redis Server 执行命令。`StringRedisTemplate` 是 Spring 管理的 Bean：构造器参数让 Spring 把它注入你的 Service。它不是每次请求新建一个连接的指令，也不需要每次使用后销毁 Bean。

可以把 Controller 理解为接口入口，Service 理解为业务函数集合，Repository 理解为数据库访问层。JSON 序列化类似 `JSON.stringify`，反序列化类似 `JSON.parse`，但 Java 需要明确目标类型。

### 4.2 最少的依赖和配置

在已有 **Spring Boot 3.5.x、Java 17、Maven 3.6.3+** 项目中加入下面依赖。由项目的 Spring Boot BOM/parent 统一管理 Spring Data 与 Lettuce 版本，不分别指定随机版本；验证使用 3.5.0 教学基线，真实项目应跟随受维护的补丁版本。教程不提供整个项目。

```xml
<!-- pom.xml 的 dependencies 内；依赖 Spring Boot 的版本管理 -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

```yaml
# application.yml · 示例：Spring Boot 3.5.x
spring:
  data:
    redis:
      host: 127.0.0.1
      port: 6379
      connect-timeout: 2s
      timeout: 500ms
```

500ms 是教学起点，不是生产通用答案，要根据接口预算和实际 P99 调整。应用在宿主机时连 127.0.0.1；应用也放进 Docker 时，它的 localhost 是自己的容器，需在同一容器网络中使用 Redis 的服务名。生产凭据从环境或密钥系统注入，不提交到代码仓库。

### 4.3 可以放进现有项目的一个 Service

将下面保存为 `LearningRedisService.java` 并放在 Spring Boot 扫描路径下，按项目补 package 行。需要上面的依赖和配置。`StringRedisTemplate` 的 Key/Value 都是字符串，因此 CLI 中也能读懂。

```java
// Java · 完整类；依赖现有 Spring Boot 项目和运行中的 Redis
import java.time.Duration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class LearningRedisService {
    private final StringRedisTemplate redis;

    public LearningRedisService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public void remember(String userId, String nickname) {
        String key = "learn:nickname:" + userId;
        redis.opsForValue().set(key, nickname, Duration.ofMinutes(5));
    }

    public String find(String userId) {
        return redis.opsForValue().get("learn:nickname:" + userId);
    }

    public boolean forget(String userId) {
        return Boolean.TRUE.equals(redis.delete("learn:nickname:" + userId));
    }
}
```

从已有 Controller 或测试调用 `remember("7", "Alice")`，再调用 find。预期返回 Alice；在 CLI 执行 `GET learn:nickname:7` 也能看见；`TTL learn:nickname:7` 在 300 秒以内。调用 forget 后 find 返回 Java `null`。这里只演示读写，Controller 仍要校验参数与用户权限，不能让调用者任意改别人的资料。

### 4.4 JSON 要有确定类型

```java
// Java · 方法片段；放入已有类中
// 需要 import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.core.JsonProcessingException;
// import java.time.Duration;
// redis 为已注入的 StringRedisTemplate，mapper 为 Spring 注入的 ObjectMapper
public record ProductView(long id, String name, long priceInCents) {}

public void cacheProduct(ProductView product) throws JsonProcessingException {
    String json = mapper.writeValueAsString(product);
    redis.opsForValue().set("learn:product:" + product.id(), json,
            Duration.ofMinutes(5));
}

public ProductView readProduct(long id) throws JsonProcessingException {
    String json = redis.opsForValue().get("learn:product:" + id);
    return json == null ? null : mapper.readValue(json, ProductView.class);
}
```

这个片段把序列化和连接异常交给上层处理，下一章给出缓存降级模式。不要把连接超时、JSON 损坏、Key 不存在都混成一个“空对象”。对象字段变更时考虑兼容旧缓存，或者在 Key 加 `v2` 命名空间并自然淘汰旧版本。避免对不可信内容启用任意多态类型反序列化。

### 4.5 Spring Cache：方便，但仍需要策略

Spring Cache 用注解表达方法结果缓存；加入 `spring-boot-starter-cache`，用 `@EnableCaching` 启用。RedisCacheManager、TTL、序列化必须配套。以下配置片段放在已有 YAML 的相应层级下，不要重复声明两个 `spring:` 根节点。

```yaml
# 合并到现有 spring: 下面
spring:
  cache:
    type: redis
    redis:
      time-to-live: 5m
      cache-null-values: false
```

```java
// Java · 注解位置示意；方法体由你的数据库访问实现
// import org.springframework.cache.annotation.Cacheable;
@Cacheable(cacheNames = "products", key = "#p0", unless = "#result == null")
public ProductView findProduct(long id) {
    return repository.findView(id); // repository 是你已有的数据访问对象
}
```

默认代理模式下，同一个类里 `this.findProduct(...)` 不经过代理，通常不会触发缓存。`@Cacheable` 不自动解决穿透、跨实例防击穿或数据库事务一致性；`sync=true` 的效果依赖 provider，不能当作通用分布式锁。RedisCache 默认 Value 序列化与 StringRedisTemplate 并不相同，默认 JDK 序列化还要求对象可序列化；真实使用时通过 RedisCacheConfiguration 显式选择、测试序列化策略。先掌握显式模板，再用注解减少重复代码。

### 常见误区

- 旧教程中的 `spring.redis.*` 与 Boot 3.x 的 `spring.data.redis.*` 混用，导致配置没生效。
- RedisTemplate 的 Java 泛型不会自动决定 Redis 中的字节格式，序列化器才决定格式。
- 每次请求 new 客户端，造成连接和资源抖动；优先使用受容器管理的客户端和模板。

### 动手练习

把昵称 Service 接到你已有的测试或接口中，分别验证“存在、不存在、过期、Redis 停止”四条路径。记录最后一种是异常而不是 null；恢复 Redis 后再次尝试。

<details class="redis-answer"><summary>自测与答案 · 为什么 CLI 能看到 Key，但 Java 读不到？</summary><p>先检查是否连接同一主机、端口和 DB，再检查 Key 的序列化方式及前缀。StringRedisTemplate 使用字符串序列化，而使用其他序列化器的模板可能把 Key 编码成不同字节。Spring Cache 还会使用缓存名等前缀。昵称练习中未命中/过期返回 null，连接失败通常被 Spring 转换成数据访问异常，需要按业务策略处理。</p></details>

<p class="redis-sources">依据：<a href="https://docs.spring.io/spring-boot/3.5/system-requirements.html">Boot 3.5 环境要求</a> · <a href="https://docs.spring.io/spring-data/redis/reference/redis/template.html">RedisTemplate</a> · <a href="https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html">RedisCache</a> · <a href="https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html">缓存代理与注解</a></p>

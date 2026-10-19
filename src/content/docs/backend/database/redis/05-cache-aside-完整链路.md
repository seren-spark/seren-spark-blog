---
title: "05 Cache Aside 完整链路"
description: "从缓存读写、空值缓存到更新失效与一致性边界。"
type: note
category: 服务端 / 数据库 / Redis
tags:
  - Redis
  - 缓存
  - 一致性
firstLearnedAt: 2026-09-21
updatedAt: 2026-09-21
status: active
sidebar:
  order: 5
---
## 把“先查缓存”做成一条完整链路

<p class="redis-goal">学习目标 · 写出 Cache Aside 的读路径，理解空值缓存、失效策略，以及为什么“先更新数据库再删缓存”仍有边界。</p>

### 5.1 四种结果，四种处理

缓存读取可能得到正常数据、空值占位、没有 Key，或者抛出异常。这些不是同一种情况。正常数据直接返回；空值占位代表近期查过数据库，确认当时不存在；没有 Key 才回源；缓存故障则根据业务容量采取受控回源或降级。

<figure class="redis-diagram"><div class="redis-flow"><div>GET 商品缓存</div><b>→</b><div class="redis-accent">命中？</div><b>→ 是 →</b><div>反序列化并返回</div></div><div class="redis-flow redis-flow-secondary"><div>未命中</div><b>→</b><div>查 MySQL</div><b>→</b><div>有数据：缓存 5 分钟<br>无数据：短期占位 30 秒</div><b>→</b><div>返回结果</div></div><figcaption>图 02 · Cache Aside。数据库是事实来源，缓存由应用按需维护。</figcaption></figure>

Key 可以设计为 `shop:product:v1:101`：业务域、实体、格式版本、ID。TTL 同时受“允许多旧、回源成本、访问频率、内存”影响，不是统一越长越好。对可接受短期旧值的商品介绍，5 分钟加 0–60 秒随机抖动是教学例子；库存和价格决策需要单独约束。

### 5.2 一份读得完整的 Java 示例

下面是可编译的 Service 类，需现有项目提供 `ProductRepository` 的 Bean。它只展示正常读取、空值占位、序列化异常和 Redis 故障回源，**没有实现防击穿与回源限流**；高并发场景要按第 7 章补齐，不能直接据此承诺抗住流量。

```java
// Java · 完整类；项目需提供数据库 Repository 实现
import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class ProductCache {
    private static final Logger log = LoggerFactory.getLogger(ProductCache.class);
    private static final String ABSENT = "__ABSENT__";
    private final StringRedisTemplate redis;
    private final ObjectMapper mapper;
    private final ProductRepository repository;

    public ProductCache(StringRedisTemplate redis, ObjectMapper mapper,
                        ProductRepository repository) {
        this.redis = redis;
        this.mapper = mapper;
        this.repository = repository;
    }

    public record Product(long id, String name, long priceInCents) {}
    public interface ProductRepository {
        Product findById(long id); // 不存在返回 null；数据库失败则抛异常
    }

    public Product find(long id) {
        if (id <= 0) throw new IllegalArgumentException("id must be positive");
        String key = "shop:product:v1:" + id;
        boolean cacheUsable = true;
        try {
            String json = redis.opsForValue().get(key);
            if (ABSENT.equals(json)) return null;
            if (json != null) return mapper.readValue(json, Product.class);
        } catch (DataAccessException e) {
            cacheUsable = false; // 当前请求不再等待一次 Redis 写超时
            log.warn("Redis read failed for product {}", id);
        } catch (JsonProcessingException e) {
            log.warn("Invalid cached product {}", id); // 重新回源并覆盖损坏缓存
        }

        // 数据库异常不在 Redis catch 内：不能伪装成“查无此商品”
        Product product = repository.findById(id);
        if (cacheUsable) {
            try {
                String value = product == null ? ABSENT : mapper.writeValueAsString(product);
                long seconds = product == null ? 30 :
                        300 + ThreadLocalRandom.current().nextInt(61);
                redis.opsForValue().set(key, value, Duration.ofSeconds(seconds));
            } catch (DataAccessException | JsonProcessingException e) {
                log.warn("Cache fill failed for product {}", id);
            }
        }
        return product;
    }
}
```

ABSENT 是本例专用占位，不会与正常 JSON 对象混淆。创建新商品后也应使对应空值缓存失效，否则最多 30 秒内可能仍查不到。生产把失败记录为指标并做日志采样，避免 Redis 故障时每个请求打印日志造成第二次压力。

### 5.3 更新为什么通常删缓存

两名写入者都“改数据库再直接写缓存”时，数据库提交顺序与缓存写入顺序可能不同，旧数据最后覆盖新数据。Cache Aside 常用“**数据库事务提交成功后，再删除缓存**”，后续请求按需重建。只有数据库提交成功才删；在 `@Transactional` 方法体末尾 DEL 并不自动等于“提交之后”，事务通常要等代理完成提交。

```text
概念流程 · 不是可直接运行的 Java
更新请求：
  在数据库事务中：更新商品，并写入一条缓存失效 outbox 记录
  事务提交成功
  尝试 DEL shop:product:v1:101，尽快让旧缓存失效
  后台读取 outbox：可重试地执行 DEL，成功后标记已处理
  使用 TTL 作为旧缓存存活的最终上界之一
```

Outbox 是数据库里与业务更新一起提交的待办记录。它解决“数据库已经成功，但进程崩溃导致删除消息没发出”的可靠通知问题，处理时仍需重试、监控积压和幂等。它不会自动让所有并发读写强一致。

<figure class="redis-diagram"><div class="redis-race"><div class="redis-race-head">时间 ↓</div><div class="redis-race-head">读请求 A</div><div class="redis-race-head">写请求 B</div><div>①</div><div>缓存未命中，读到 DB 旧值 v1</div><div>—</div><div>②</div><div>暂时停顿</div><div>提交 DB 新值 v2，删除缓存</div><div>③</div><div class="redis-danger">把刚才的 v1 回填缓存</div><div>写请求已成功</div></div><figcaption>图 03 · 提交后删除仍可能遇到“旧读晚回填”。需要结合业务允许的陈旧窗口选择方案。</figcaption></figure>

常见的延迟双删是在稍后再删一次，能降低一类竞态概率，但固定睡眠无法覆盖任意长的数据库请求、暂停和网络延迟。严格场景可选择绕过缓存读事实来源，或设计受约束的版本校验、协调读写；不要把更复杂的协议带进普通商品介绍缓存。

### 常见误区

- “给缓存加 TTL 就一致了”：TTL 只能限制某次写入的存活时间，不能防止并发旧值重新回填。
- “缓存写失败就让商品查询失败”：如果数据库已读成功且缓存可丢，可以返回数据库结果并记录失败。
- “Redis 错误就无限回源”：没有并发上限时，会把 Redis 故障变成数据库故障。

### 动手练习

用纸画出：第一次查商品、第二次查商品、查不存在商品、数据库提交成功但 DEL 超时的四条路径。对每条路径回答：哪一层响应？什么会重试？会不会返回旧值？

<details class="redis-answer"><summary>自测与答案 · 为什么不能先删缓存再改数据库？</summary><p>删缓存后、数据库更新提交前，另一个请求可能回源读到旧值并把它缓存；随后数据库更新了，缓存却仍是旧值。提交后删除缩小了这类窗口，但如图 03，仍需考虑旧读晚回填。四条路径：首次回源并回填；再次命中缓存；不存在时短期占位；删除超时需可靠失效重试，期间允许出现旧值。业务若不容许该窗口，就不能仅依赖这一缓存策略。</p></details>

<p class="redis-sources">参考：<a href="https://redis.io/docs/latest/develop/reference/eviction/">缓存容量与淘汰</a> · <a href="https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html">事务提交后的事件处理</a></p>

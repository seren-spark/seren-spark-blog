# Seren Spark Blog TDD 任务拆分

原则：每个任务按 Red → Green → Refactor 完成；先写可失败的测试，再写最小实现，最后整理接口。

## 实施状态

- [x] TDD-001：工程与测试入口。
- [x] TDD-002：内容时间语义。
- [x] TDD-003：Schema 已接入构建并覆盖非法日期、标签和状态测试。
- [x] TDD-004：统一时间线聚合。
- [x] TDD-005：Heatmap 活动序列。
- [x] TDD-006：日志排序、年度归档与标签筛选。
- [x] TDD-007：跨内容关联校验。
- [x] TDD-008：首页数据接口。
- [ ] TDD-009：标签路由和 Pagefind 构建索引已完成，搜索交互验收留待 UI 阶段。
- [x] TDD-010：首页视觉接入 Timeline、Heatmap 和统计数据。

## TDD-001：建立工程与测试入口

- Red：确认测试命令、类型检查命令和构建命令存在。
- Green：建立 Astro、Starlight、Vitest 配置和最小测试入口。
- Refactor：统一脚本名称和目录结构。
- 完成条件：`npm test`、`npm run check`、`npm run build` 均有明确行为。

## TDD-002：内容时间语义

- Red：测试历史日期、发布时间、更新时间互不覆盖。
- Green：实现 `getContentDate` 和日期排序纯函数。
- Refactor：统一 `Date` 解析和时区策略。
- 完成条件：旧笔记可以显示原始积累日期。

## TDD-003：内容集合 Schema

- Red：测试非法类型、缺失标题、非法日期和错误标签会被拒绝。
- Green：实现 docs、journal、projects 的内容 Schema。
- Refactor：提取共享字段，减少重复定义。
- 完成条件：内容错误在构建期暴露。

## TDD-004：时间线聚合

- Red：测试不同内容类型可以映射成统一时间线事件并正确排序。
- Green：实现 `buildTimeline`。
- Refactor：定义稳定的 `TimelineEvent` 类型。
- 完成条件：时间线不需要单独维护 JSON。

## TDD-005：Heatmap 聚合

- Red：测试同一天多条内容的活动计数、空日期和跨年份数据。
- Green：实现 `buildActivityMap`。
- Refactor：将活动来源和权重定义为常量。
- 完成条件：Heatmap 数据可直接供页面或组件消费。

## TDD-006：日志索引与归档

- Red：测试按发生日期倒序、按年份分组和按标签筛选。
- Green：实现日志查询函数和 `/journal`、`/archive/[year]` 页面。
- Refactor：避免页面重复实现排序逻辑。
- 完成条件：日志列表和年度归档使用同一查询层。

## TDD-007：关联内容

- Red：测试日志关联笔记和项目关联日志的查询结果。
- Green：实现 `relatedDocs`、`relatedJournal` 查询。
- Refactor：对不存在的关联内容输出构建错误或可诊断警告。
- 完成条件：内容关系可追踪但不依赖数据库。

## TDD-008：首页数据接口

- Red：测试首页摘要统计和最近内容结果。
- Green：提供首页所需的统一数据函数。
- Refactor：页面只负责渲染，不负责业务聚合。
- 完成条件：未来替换 UI 不需要修改内容逻辑。

## TDD-009：搜索与标签

- Red：测试标题、摘要、标签和正文的查询边界。
- Green：接入静态搜索并实现标签索引。
- Refactor：确保搜索索引在构建阶段生成。
- 完成条件：搜索不依赖运行时数据库。

## TDD-010：首页视觉接入

- Red：测试年度热力图的闰年长度、星期起始对齐和活动强度分级。
- Green：接入构建期首页数据，渲染统计卡片、年度 Heatmap、最近 Timeline 和内容入口。
- Refactor：将首页热力图日期计算保持为纯函数，页面组件只负责组合展示。
- 完成条件：首页不请求运行时 API，内容变更后由 Astro 构建重新生成全部可视化结果。

## 当前执行顺序

1. TDD-001 工程与测试入口。
2. TDD-002 时间语义。
3. TDD-003 Schema。
4. TDD-004 时间线。
5. TDD-005 Heatmap。

UI 设计、动画和主题定制推迟到 TDD-008 之后，避免视觉工作反过来决定领域模型。

# Seren Spark Blog 软件设计说明书

版本：0.1  
状态：实施中  
范围：内容模型、构建流程、路由和可扩展性；不包含 UI 视觉方案。

## 1. 目标

Seren Spark Blog 是一个以个人长期知识积累为核心的静态内容网站。它同时承载三种内容：

- `docs`：结构化、可长期维护的知识笔记。
- `journal`：按实际发生时间记录的学习和工作日志。
- `projects`：阶段性项目及其关联内容。

网站必须支持将已有历史内容迁移进来，并区分内容发生时间、首次公开时间和最近更新时间。

## 2. 非目标

第一阶段不实现：

- 在线后台编辑器和数据库。
- 登录、权限和多用户协作。
- 评论、点赞和社交关系。
- 依赖 Git 提交记录伪造内容发生日期。
- 在没有内容模型和测试的前提下先制作复杂视觉效果。

## 3. 技术架构

```text
Markdown / MDX
        ↓
Astro Content Collections
        ↓
Schema 校验与纯函数聚合
        ├── Starlight docs 页面
        ├── journal 列表与详情
        ├── projects 页面
        ├── 时间线数据
        ├── 年度归档
        └── Heatmap 数据
        ↓
Astro 静态构建
        ↓
GitHub Pages / Cloudflare Pages
```

技术选择：

- Astro：站点框架和静态构建。
- Starlight：知识库文档能力。
- Markdown/MDX：内容源格式。
- Git：内容与代码版本管理。
- Vitest：纯业务逻辑的单元测试。

## 4. 目录约定

```text
src/
├── content/
│   ├── docs/       # Starlight 知识库
│   ├── journal/    # 时间日志
│   └── projects/   # 项目记录
├── lib/            # 与 UI 无关的领域逻辑
├── pages/          # Astro 页面路由
└── components/     # 后续页面组件
tests/              # 单元测试
docs/               # 设计和实施文档
```

## 5. 内容模型

### 5.1 知识笔记

```yaml
title: Java 线程池总结
type: note
category: Java
tags: [Java, 并发]
firstLearnedAt: 2023-08-15
publishedAt: 2026-09-09
updatedAt: 2026-09-09
status: stable
```

`firstLearnedAt` 表示知识最初形成的时间，`publishedAt` 表示首次发布到本站的时间，`updatedAt` 表示最近整理时间。

### 5.2 学习日志

```yaml
title: 完成线程池笔记整理
type: journal
occurredAt: 2023-08-15
publishedAt: 2026-09-09
updatedAt: 2026-09-09
tags: [学习, Java]
relatedDocs: [backend/java/thread-pool]
```

`occurredAt` 是日志实际发生的日期，不能用建站日期覆盖历史记录。

### 5.3 项目记录

```yaml
title: Seren Spark Blog
type: project
status: active
startedAt: 2026-09-09
updatedAt: 2026-09-09
tags: [Astro, Starlight]
```

## 6. 时间线与 Heatmap

时间线和 Heatmap 都是派生数据，不额外维护一份手工 JSON：

- 时间线读取 `firstLearnedAt`、`occurredAt`、`startedAt`。
- 最近发布读取 `publishedAt`。
- 最近修改读取 `updatedAt`。
- Heatmap 默认统计每天发生的内容活动：日志、笔记新增、笔记更新和项目变更。
- Git commit 只作为版本历史，不替代内容自身的日期语义。

领域逻辑必须是纯函数，输入内容条目，输出排序后的时间线或按日期聚合的活动数据，便于单独测试。

## 7. 路由契约

```text
/                         首页数据汇总
/[...slug]                Starlight 知识笔记（当前默认根路径）
/journal                  日志列表
/journal/[...slug]        日志详情
/archive/[year]           年度归档
/tags/[tag]               标签内容
/projects/[slug]          项目详情
```

路由的页面外观可以变化，但上述内容职责和 URL 稳定性作为第一阶段契约保留。

## 8. 构建约束

构建必须在以下情况失败：

- 必填标题缺失。
- 日期字段格式非法。
- 内容类型不在允许范围内。
- 标签不是字符串数组。
- 关联内容不存在（启用关联校验后）。

所有派生索引必须由内容源重新计算，不能依赖手工同步。

## 9. 验收标准

- 新增一个 Markdown 文件即可生成对应内容页。
- 历史内容可以使用过去日期。
- `publishedAt` 和 `updatedAt` 不覆盖历史发生日期。
- docs、journal、projects 三类内容互不混淆。
- 时间线和 Heatmap 可以从内容自动生成。
- 日期排序、活动聚合和标签查询有自动化测试。
- 构建命令能够在干净环境中完成。

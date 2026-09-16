import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dataSource = readFileSync("src/data/csdn-articles.ts", "utf8");
const articles = [
  ...dataSource.matchAll(
    /\{ id: (\d+), title: '((?:\\'|[^'])*)', date: '([^']+)', description: '((?:\\'|[^'])*)', category: '([^']+)'/g,
  ),
].map(([, id, title, date, description, category]) => ({
  id,
  title: title.replaceAll("\\'", "'"),
  date,
  description: description.replaceAll("\\'", "'"),
  category,
}));

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function addImagePolicy(html) {
  return html.replace(/<img\b([^>]*)>/gi, (tag, attributes) => {
    if (/\breferrerpolicy\s*=/i.test(attributes)) return tag;
    return `<img referrerpolicy="no-referrer"${attributes}>`;
  });
}

function fileNameFor(article) {
  const safeTitle = article.title
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "");
  return `${safeTitle || article.id}.md`;
}

function extractContent(html) {
  const start = html.indexOf('<div id="content_views"');
  if (start < 0) return "<p>暂时无法读取正文，请查看来源页面。</p>";

  const openEnd = html.indexOf(">", start) + 1;
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  let end = html.length;
  let match;
  while ((match = tags.exec(html))) {
    if (match[0].startsWith("</")) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      end = match.index;
      break;
    }
  }

  return addImagePolicy(
    html
      .slice(openEnd, end)
      .replace(/<svg[\s\S]*?<\/svg>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .trim(),
  );
}

function frontmatter(article) {
  return `---
title: ${JSON.stringify(article.title)}
description: ${JSON.stringify(article.description)}
type: journal
occurredAt: ${article.date}
publishedAt: ${article.date}
tags:
  - ${article.category}
sourceUrl: https://blog.csdn.net/HBR666_/article/details/${article.id}
sourceName: CSDN
relatedDocs: []
---

> 本文由 Seren Spark 从个人 CSDN 博客迁移，保留原始发布日期；正文内容会优先从公开页面同步。

`;
}

mkdirSync("src/content/journal/csdn", { recursive: true });
let imported = 0;
for (const article of articles) {
  const url = `https://blog.csdn.net/HBR666_/article/details/${article.id}`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  let content;
  if (!response.ok) {
    console.warn(
      `正文暂未读取 ${article.id}：HTTP ${response.status}，先写入文章摘要`,
    );
    content = `<p class="migration-notice">CSDN 暂时拦截了正文请求（HTTP ${response.status}）。当前先保留已同步摘要；重新运行本脚本可继续尝试补齐正文。</p><p>${escapeHtml(article.description)}</p>`;
  } else {
    const html = await response.text();
    content = extractContent(html);
  }
  const file = join("src/content/journal/csdn", fileNameFor(article));
  writeFileSync(
    file,
    frontmatter(article) + content + `\n\n---\n\n[查看 CSDN 原文](${url})\n`,
    "utf8",
  );
  imported += 1;
  console.log(`已导入 ${imported}/${articles.length}：${article.title}`);
}
console.log(`完成：${imported} 篇文章已写入博客。`);

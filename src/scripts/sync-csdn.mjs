import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const username = process.argv[2] ?? 'HBR666_';
const size = 20;
const endpoint = 'https://blog.csdn.net/community/home-api/v1/get-business-list';

function categoryFor(title) {
  const rules = [
    ['AI', /AI|FIM|Function Call|模型/i],
    ['Vue', /Vue|Vuex|NProgress/i],
    ['React', /React|Ant Design/i],
    ['Node.js', /Node|Express|中间件/i],
    ['TypeScript', /TypeScript|TS（|TS /i],
    ['算法', /BFS|前缀和|差分|算法/i],
    ['JavaScript', /JavaScript|jQuery|函数|数组|call|apply|bind/i],
    ['面试', /面试/i],
  ];
  return rules.find(([, pattern]) => pattern.test(title))?.[0] ?? '前端';
}

function normalize(row) {
  const title = String(row.title ?? '').trim();
  const id = Number(row.articleId ?? row.id);
  const date = String(row.postTime ?? row.publishTime ?? '').slice(0, 10);
  const category = categoryFor(title);
  return {
    id,
    title,
    date,
    description: String(row.description ?? '来自 CSDN 的技术记录。').replace(/\s+/g, ' ').trim(),
    category,
    tags: [category],
    ...(row.viewCount == null ? {} : { views: Number(row.viewCount) }),
  };
}

const articles = [];
let total = 0;
for (let page = 1; page <= 10; page += 1) {
  const url = `${endpoint}?page=${page}&size=${size}&businessType=blog&orderby=&noMore=false&year=&month=&username=${encodeURIComponent(username)}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`CSDN 返回 HTTP ${response.status}，请稍后重试或使用导出数据。`);
  const payload = await response.json();
  const rows = payload.data?.list ?? payload.data?.data ?? [];
  if (!Array.isArray(rows) || rows.length === 0) break;
  articles.push(...rows.map(normalize).filter((article) => article.id && article.title));
  total = Number(payload.data?.total ?? payload.data?.count ?? total);
  if (rows.length < size || payload.data?.noMore === true) break;
}

const unique = [...new Map(articles.map((article) => [article.id, article])).values()];
const output = resolve('src/data/csdn-articles.ts');
const header = `export type CsdnArticle = {\n  id: number;\n  title: string;\n  date: string;\n  description: string;\n  category: string;\n  tags: string[];\n  views?: number;\n};\n\nconst csdnBase = 'https://blog.csdn.net/${username}/article/details/';\n\nexport const csdnArticleTotal = ${total || unique.length};\n\nexport const csdnArticles: CsdnArticle[] = `;
const footer = `;\n\nexport function getCsdnArticleUrl(article: Pick<CsdnArticle, 'id'>): string {\n  return \`${'${csdnBase}'}${'${article.id}'}\`;\n}\n`;

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, header + JSON.stringify(unique, null, 2) + footer, 'utf8');
console.log(`已同步 ${unique.length} 篇 CSDN 文章${total ? `，账号总量 ${total} 篇` : ''}。`);

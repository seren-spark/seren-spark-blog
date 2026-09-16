import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const sitemapUrl = 'https://dselegent-blog.netlify.app/sitemap.xml';
const rawBase = 'https://raw.githubusercontent.com/dselegent/dselegent-blog/main/docs';

const sourceGroups = [
  { source: 'front_end/front_end_base/html_css', target: 'frontend/html-css' },
  { source: 'front_end/front_end_base/javascript', target: 'frontend/javascript' },
  { source: 'front_end/css_advanced/less', target: 'frontend/less' },
  { source: 'front_end/css_advanced/scss', target: 'frontend/scss' },
  { source: 'front_end/css_advanced/tailwind', target: 'frontend/tailwind' },
  { source: 'front_end/front_end_framework/vue2', target: 'frontend/vue/vue2' },
  { source: 'front_end/front_end_framework/vue3', target: 'frontend/vue/vue3' },
  { source: 'front_end/front_end_framework/react', target: 'frontend/react' },

  // 前端扩展专题
  { source: 'front_end/front_end_framework/uniapp', target: 'frontend/uniapp' },
  { source: 'front_end/js_advanced/ajax', target: 'frontend/javascript-advanced/ajax' },
  { source: 'front_end/js_advanced/echarts', target: 'frontend/javascript-advanced/echarts' },
  { source: 'front_end/js_advanced/es6', target: 'frontend/javascript-advanced/es6' },
  { source: 'front_end/js_advanced/typescript', target: 'frontend/typescript' },
  { source: 'front_end/js_advanced/webpack', target: 'frontend/javascript-advanced/webpack' },
  { source: 'front_end/other/electron', target: 'applications/electron' },

  // 应用
  { source: 'apps/Applist', target: 'applications/app-list', single: true },
  { source: 'apps/AppNotes', target: 'applications/app-notes', single: true },
  { source: 'apps/ChatGPT', target: 'applications/chatgpt', single: true },
  { source: 'apps/Chrome', target: 'applications/chrome', single: true },
  { source: 'apps/design', target: 'applications/design', single: true },

  // 服务端与部署
  { source: 'back_end/database/mongodb', target: 'backend/database/mongodb' },
  { source: 'back_end/database/mysql', target: 'backend/database/mysql' },
  { source: 'back_end/linux', target: 'backend/linux' },
  { source: 'back_end/nodeJs', target: 'backend/nodejs' },
  { source: 'deploy/Cloudflare', target: 'backend/deploy/cloudflare', single: true },
  { source: 'deploy/DNS', target: 'backend/deploy/dns', single: true },
  { source: 'deploy/GitHub', target: 'backend/deploy/github', single: true },
  { source: 'deploy/Static', target: 'backend/deploy/static', single: true },
  { source: 'deploy/VPS', target: 'backend/deploy/vps', single: true },

  // 专业知识
  { source: 'professional_knowledge/computer_network', target: 'professional/computer-network' },
  { source: 'professional_knowledge/software_engineer', target: 'professional/software-engineering' },

  // 工具
  { source: 'tool/efficiency/bookmark-scripts', target: 'tools/efficiency/bookmark-scripts', single: true },
  { source: 'tool/efficiency/online-tools', target: 'tools/efficiency/online-tools', single: true },
  { source: 'tool/efficiency/software', target: 'tools/efficiency/software' },
  { source: 'tool/git', target: 'tools/git' },
  { source: 'tool/lint', target: 'tools/lint' },

  // 笔记与站点记录
  { source: 'web/Comments', target: 'page-development/comments', single: true },
  { source: 'web/docsify', target: 'page-development/docsify', single: true },
  { source: 'web/VuePress', target: 'page-development/vuepress', single: true },
  { source: 'intro', target: 'notes/intro', single: true },
];

function normalizeMarkdownBody(markdown) {
  // 原文中的中文强调标记常紧贴后续文字，给闭合标记补一个空格后可被 Astro 正确解析。
  return markdown
    .split(/(```[\s\S]*?```)/g)
    .map((part, index) =>
      index % 2 === 1 ? part : part.replace(/\*\*([^*\r\n]+)\*\*(?=\S)/g, '**$1** '),
    )
    .join('');
}

function parseMarkdownDocument(markdown, sourcePath) {
  const normalized = markdown.replace(/\r\n/g, '\n');
  let body = normalized;
  let frontmatter = '';

  if (normalized.startsWith('---\n')) {
    const frontmatterEnd = normalized.indexOf('\n---', 4);
    if (frontmatterEnd !== -1) {
      frontmatter = normalized.slice(4, frontmatterEnd);
      body = normalized.slice(frontmatterEnd + 4).replace(/^\n+/, '');
    }
  }

  const heading = body.match(/^#{1,6}\s+(.+)$/m);
  const headingTitle = heading?.[1]?.trim();
  const frontmatterTitle = frontmatter.match(/^title:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m);
  const title = (frontmatterTitle?.[1] ?? frontmatterTitle?.[2] ?? frontmatterTitle?.[3] ?? headingTitle)?.trim();
  if (!title) throw new Error(`${sourcePath} 缺少标题或 frontmatter title`);

  return {
    title,
    body: normalizeMarkdownBody(body.replace(/^#{1,6}\s+.+\r?\n?/, '').trimStart()),
    order: Number(frontmatter.match(/^order:\s*(\d+)/m)?.[1] ?? sourcePath.match(/(\d+)$/)?.[1] ?? 1),
  };
}

async function fetchText(url, label) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${label}：${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }
  throw lastError;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const sitemap = await fetchText(sitemapUrl, '无法读取 sitemap');

const siteUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const pages = siteUrls
  .map((url) => new URL(url).pathname.replace(/\.html$/, ''))
  .map((path) => {
    const group = sourceGroups.find(
      ({ source }) => path === `/${source}` || path.startsWith(`/${source}/`),
    );
    return group ? { path, group } : null;
  })
  .filter(Boolean)
  .filter(({ path, group }) => group.single ? path === `/${group.source}` : /\/\d+$/.test(path));

if (!pages.length) throw new Error('sitemap 中没有找到目标章节');

// 清理本脚本上一次生成的带有中文书名号的文件，避免改名后留下重复页面。
for (const { target } of sourceGroups) {
  const directory = join(projectRoot, 'src/content/docs', target);
  try {
    const entries = await readdir(directory);
    await Promise.all(
      entries
        .filter((entry) => entry.includes('【') || entry.includes('】'))
        .map((entry) => unlink(join(directory, entry))),
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const imported = await mapWithConcurrency(pages, 8, async ({ path, group }) => {
    const sourcePath = `${path}.md`;
    const markdown = await fetchText(`${rawBase}${sourcePath}`, `无法读取 ${sourcePath}`);
    const { title, body, order } = parseMarkdownDocument(markdown, sourcePath);
    const content = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(`${title}：前端知识库章节。`)}\nsidebar:\n  order: ${order}\n---\n\n${body}\n`;
    const safeName = title
      .replace(/【([^】]*)】/g, '$1')
      .replace(/[<>:"/\\|?*]/g, '-')
      .replace(/[. ]+$/g, '')
      .trim();
    const output = join(projectRoot, 'src/content/docs', group.target, `${safeName}.md`);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, content, 'utf8');
    return { title, output, sourcePath, target: group.target };
  });

const summary = imported.reduce((groups, item) => {
  const key = item.target;
  groups.set(key, (groups.get(key) ?? 0) + 1);
  return groups;
}, new Map());

console.log(`已导入 ${imported.length} 个章节：`);
for (const [group, count] of summary) console.log(`- ${group}: ${count}`);

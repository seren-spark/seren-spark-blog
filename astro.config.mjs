import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightCelestiaTheme from "starlight-theme-celestia";

function addExternalImagePolicy() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === "element" && node.tagName === "img") {
        node.properties ??= {};
        node.properties.referrerPolicy = "no-referrer";
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

function wrapTables() {
  return (tree) => {
    const visit = (parent) => {
      parent.children?.forEach((node, index) => {
        if (node.type === "element" && node.tagName === "table") {
          parent.children[index] = {
            type: "element",
            tagName: "div",
            properties: { className: ["knowledge-table-scroll"] },
            children: [node],
          };
        } else {
          visit(node);
        }
      });
    };
    visit(tree);
  };
}

function useCodeThemes() {
  return {
    name: 'github-light-code-theme',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            shikiConfig: {
              themes: {
                light: 'github-light',
                dark: 'one-dark-pro',
              },
            },
          },
        });
      },
    },
  };
}

export default defineConfig({
  site: "https://seren-spark.site",
  markdown: {
    rehypePlugins: [addExternalImagePolicy, wrapTables],
  },
  integrations: [
    starlight({
      title: "Seren Spark 知识库",
      locales: {
        root: { label: "简体中文", lang: "zh-CN" },
      },
      customCss: ["./src/styles/knowledge.css"],
      plugins: [
        starlightCelestiaTheme({
          stylingSystem: "css",
          nav: [
            { label: "首页", href: "/" },
            { label: "个人主页", href: "/about/" },
            { label: "知识库", href: "/getting-started/" },
            { label: "博客", href: "/journal/" },
          ],
        }),
      ],
      components: {
        Header: "./src/components/knowledge/KnowledgeHeader.astro",
        Sidebar: "./src/components/knowledge/KnowledgeSidebar.astro",
      },
      sidebar: [
        {
          label: "知识库",
          items: [
            { label: "知识库首页", slug: "knowledge" },
            { label: "内容维护约定", slug: "getting-started" },
          ],
        },
        {
          label: "页面开发",
          items: [
            { label: "Docsify", autogenerate: { directory: "page-development/docsify" } },
            { label: "VuePress", autogenerate: { directory: "page-development/vuepress" } },
            { label: "评论系统", autogenerate: { directory: "page-development/comments" } },
          ],
        },
        {
          label: "应用",
          items: [
            { label: "必备应用", autogenerate: { directory: "applications/app-list" } },
            { label: "Chrome 扩展", autogenerate: { directory: "applications/chrome" } },
            { label: "ChatGPT", autogenerate: { directory: "applications/chatgpt" } },
            { label: "工具笔记", autogenerate: { directory: "applications/app-notes" } },
            { label: "平面设计", autogenerate: { directory: "applications/design" } },
          ],
        },
        {
          label: "专业知识",
          items: [
            { label: "软件工程", autogenerate: { directory: "professional/software-engineering" } },
            { label: "计算机网络", autogenerate: { directory: "professional/computer-network" } },
          ],
        },
        {
          label: "前端",
          items: [{ label: "前端目录", slug: "frontend" }],
        },
        {
          label: "基础",
          items: [
            {
              label: "三剑客",
              items: [
                { label: "HTML / CSS", autogenerate: { directory: "frontend/html-css" } },
                { label: "JavaScript", autogenerate: { directory: "frontend/javascript" } },
              ],
            },
          ],
        },
        {
          label: "CSS 提高",
          items: [
            {
              label: "Less / SCSS",
              items: [
                { label: "Less", autogenerate: { directory: "frontend/less" } },
                { label: "SCSS", autogenerate: { directory: "frontend/scss" } },
              ],
            },
            {
              label: "Tailwind CSS",
              autogenerate: { directory: "frontend/tailwind" },
            },
          ],
        },
        {
          label: "JavaScript 提高",
          items: [
            {
              label: "ES6",
              autogenerate: { directory: "frontend/javascript-advanced/es6" },
            },
            {
              label: "AJAX",
              autogenerate: { directory: "frontend/javascript-advanced/ajax" },
            },
            {
              label: "ECharts",
              autogenerate: { directory: "frontend/javascript-advanced/echarts" },
            },
            {
              label: "Webpack",
              autogenerate: { directory: "frontend/javascript-advanced/webpack" },
            },
            {
              label: "TypeScript",
              autogenerate: { directory: "frontend/typescript" },
            },
          ],
        },
        {
          label: "框架",
          items: [
            {
              label: "Vue",
              items: [
                { label: "Vue 2", autogenerate: { directory: "frontend/vue/vue2" } },
                { label: "Vue 3", autogenerate: { directory: "frontend/vue/vue3" } },
              ],
            },
            {
              label: "UniApp",
              autogenerate: { directory: "frontend/uniapp" },
            },
            {
              label: "React",
              autogenerate: { directory: "frontend/react" },
            },
          ],
        },
        {
          label: "其它",
          items: [
            {
              label: "Electron",
              autogenerate: { directory: "applications/electron" },
            },
          ],
        },
        {
          label: "服务端",
          items: [
            { label: "Node.js", autogenerate: { directory: "backend/nodejs" } },
            { label: "Linux", autogenerate: { directory: "backend/linux" } },
            { label: "MySQL", autogenerate: { directory: "backend/database/mysql" } },
            { label: "MongoDB", autogenerate: { directory: "backend/database/mongodb" } },
            {
              label: "部署与运维",
              items: [
                { label: "静态部署", autogenerate: { directory: "backend/deploy/static" } },
                { label: "GitHub 部署", autogenerate: { directory: "backend/deploy/github" } },
                { label: "Cloudflare", autogenerate: { directory: "backend/deploy/cloudflare" } },
                { label: "DNS 托管", autogenerate: { directory: "backend/deploy/dns" } },
                { label: "VPS", autogenerate: { directory: "backend/deploy/vps" } },
              ],
            },
          ],
        },
        {
          label: "工具",
          items: [
            { label: "Git", autogenerate: { directory: "tools/git" } },
            { label: "代码规范", autogenerate: { directory: "tools/lint" } },
            {
              label: "效率工具",
              items: [
                { label: "在线工具", autogenerate: { directory: "tools/efficiency/online-tools" } },
                { label: "书签脚本", autogenerate: { directory: "tools/efficiency/bookmark-scripts" } },
              ],
            },
          ],
        },
        {
          label: "笔记",
          collapsed: true,
          autogenerate: { directory: "notes" },
        },
      ],
    }),
    useCodeThemes(),
  ],
});

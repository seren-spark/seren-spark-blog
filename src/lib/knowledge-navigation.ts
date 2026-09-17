import type { StarlightIcon } from '@astrojs/starlight/types';

export type KnowledgeNavItem = {
  label: string;
  href: string;
  icon: StarlightIcon;
  menuIcon?: string;
  menuIconColor?: string;
  match?: string[];
};

export type KnowledgeNavGroup = {
  label: string;
  items: KnowledgeNavItem[];
};

export type KnowledgeNavEntry = KnowledgeNavItem & {
  groups?: KnowledgeNavGroup[];
};

export const knowledgeNavigation: KnowledgeNavEntry[] = [
  { label: '首页', href: '/', icon: 'star' },
  {
    label: '页面开发', href: '/page-development/', icon: 'mdx', groups: [
      { label: '文档站点', items: [
        { label: 'Docsify', href: '/page-development/docsify/docsify/', icon: 'mdx', match: ['/page-development/docsify/'] },
        { label: 'VuePress', href: '/page-development/vuepress/vuepress/', icon: 'seti:vue', match: ['/page-development/vuepress/'] },
      ] },
      { label: '站点能力', items: [
        { label: '评论系统', href: '/page-development/comments/评论插件/', icon: 'comment', match: ['/page-development/comments/'] },
      ] },
    ],
  },
  {
    label: '应用', href: '/applications/', icon: 'puzzle', groups: [
      { label: '软件与配置', items: [
        { label: '必备应用', href: '/applications/app-list/必备应用/', icon: 'laptop', match: ['/applications/app-list/'] },
        { label: 'Chrome 扩展', href: '/applications/chrome/chrome-扩展/', icon: 'puzzle', match: ['/applications/chrome/'] },
      ] },
      { label: 'AI 与效率', items: [
        { label: 'ChatGPT', href: '/applications/chatgpt/chatgpt/', icon: 'puzzle', match: ['/applications/chatgpt/'] },
        { label: '工具笔记', href: '/applications/app-notes/工具笔记/', icon: 'pencil', match: ['/applications/app-notes/'] },
      ] },
      { label: '设计', items: [
        { label: '平面设计', href: '/applications/design/平面设计/', icon: 'pencil', match: ['/applications/design/'] },
      ] },
    ],
  },
  {
    label: '专业知识', href: '/professional/', icon: 'open-book', groups: [
      { label: '软件工程', items: [
        { label: '软件工程', href: '/professional/software-engineering/01-软件工程学概述/', icon: 'pencil', match: ['/professional/software-engineering/'] },
      ] },
      { label: '计算机基础', items: [
        { label: '计算机网络', href: '/professional/computer-network/01-计算机网络-概述/', icon: 'node', match: ['/professional/computer-network/'] },
      ] },
    ],
  },
  {
    label: '前端', href: '/frontend/', icon: 'astro', groups: [
      { label: '基础', items: [
        { label: '三剑客', href: '/frontend/html-css-js/', icon: 'mdx', menuIcon: 'code-s-slash-line', menuIconColor: '#e56532', match: ['/frontend/html-css-js/', '/frontend/html-css/', '/frontend/javascript/'] },
      ] },
      { label: 'CSS 提高', items: [
        { label: 'Less / SCSS', href: '/frontend/css-advanced/', icon: 'seti:css', menuIcon: 'css3-line', menuIconColor: '#8a55b5', match: ['/frontend/css-advanced/', '/frontend/less/', '/frontend/scss/'] },
        { label: 'Tailwind CSS', href: '/frontend/tailwind/01-tailwind-css-安装使用/', icon: 'seti:css', menuIcon: 'tailwind-css-line', menuIconColor: '#0c9db4', match: ['/frontend/tailwind/'] },
      ] },
      { label: 'JavaScript 提高', items: [
        { label: 'ES6', href: '/frontend/javascript-advanced/es6/01-es6-介绍/', icon: 'seti:javascript', menuIcon: 'javascript-line', menuIconColor: '#c38c00', match: ['/frontend/javascript-advanced/es6/'] },
        { label: 'AJAX', href: '/frontend/javascript-advanced/ajax/01-ajax概述和基本使用/', icon: 'seti:javascript', menuIcon: 'exchange-2-line', menuIconColor: '#267fba', match: ['/frontend/javascript-advanced/ajax/'] },
        { label: 'ECharts', href: '/frontend/javascript-advanced/echarts/1echarts-介绍/', icon: 'seti:javascript', menuIcon: 'bar-chart-box-line', menuIconColor: '#6b5bc5', match: ['/frontend/javascript-advanced/echarts/'] },
        { label: 'Webpack', href: '/frontend/javascript-advanced/webpack/01-前言-基础使用-核心概念/', icon: 'seti:webpack', menuIcon: 'box-3-line', menuIconColor: '#4d86ba', match: ['/frontend/javascript-advanced/webpack/'] },
        { label: 'TypeScript', href: '/frontend/typescript/1简介/', icon: 'seti:typescript', menuIcon: 'braces-line', menuIconColor: '#3178c6', match: ['/frontend/typescript/'] },
      ] },
      { label: '框架', items: [
        { label: 'Vue', href: '/frontend/vue/', icon: 'seti:vue', menuIcon: 'vuejs-line', menuIconColor: '#369b71', match: ['/frontend/vue/'] },
        { label: 'UniApp', href: '/frontend/uniapp/01-微信小程序起步/', icon: 'seti:vue', menuIcon: 'smartphone-line', menuIconColor: '#2aa66d', match: ['/frontend/uniapp/'] },
        { label: 'React', href: '/frontend/react/01-react入门/', icon: 'seti:react', menuIcon: 'reactjs-line', menuIconColor: '#159bc4', match: ['/frontend/react/'] },
      ] },
      { label: '其它', items: [
        { label: 'Electron', href: '/applications/electron/01-创建一个electron应用/', icon: 'seti:javascript', menuIcon: 'cpu-line', menuIconColor: '#6b61b3', match: ['/applications/electron/'] },
      ] },
    ],
  },
  {
    label: '服务端', href: '/backend/', icon: 'node', groups: [
      { label: '运行环境', items: [
        { label: 'Node.js', href: '/backend/nodejs/01-nodejs简介/', icon: 'node', match: ['/backend/nodejs/'] },
        { label: 'Linux', href: '/backend/linux/01-入门篇-介绍和安装/', icon: 'laptop', match: ['/backend/linux/'] },
      ] },
      { label: '数据库', items: [
        { label: 'MySQL', href: '/backend/database/mysql/01-数据库概述/', icon: 'node', match: ['/backend/database/mysql/'] },
        { label: 'MongoDB', href: '/backend/database/mongodb/mongodb/', icon: 'node', match: ['/backend/database/mongodb/'] },
      ] },
      { label: '部署与运维', items: [
        { label: '静态部署', href: '/backend/deploy/static/静态部署/', icon: 'setting', match: ['/backend/deploy/static/'] },
        { label: 'GitHub 部署', href: '/backend/deploy/github/github/', icon: 'github', match: ['/backend/deploy/github/'] },
        { label: 'Cloudflare', href: '/backend/deploy/cloudflare/cloudflare/', icon: 'setting', match: ['/backend/deploy/cloudflare/'] },
        { label: 'DNS 托管', href: '/backend/deploy/dns/域名-dns-托管/', icon: 'node', match: ['/backend/deploy/dns/'] },
        { label: 'VPS', href: '/backend/deploy/vps/服务器-vps/', icon: 'laptop', match: ['/backend/deploy/vps/'] },
      ] },
    ],
  },
  {
    label: '工具', href: '/tools/', icon: 'setting', groups: [
      { label: '版本控制', items: [
        { label: 'Git', href: '/tools/git/01-版本控制和git的安装介绍/', icon: 'github', match: ['/tools/git/'] },
      ] },
      { label: '代码规范', items: [
        { label: 'JS 代码规范', href: '/tools/lint/01-js-代码规范/', icon: 'seti:javascript' },
        { label: 'CSS 代码规范', href: '/tools/lint/02-css-代码规范/', icon: 'seti:css' },
        { label: 'Git 提交规范', href: '/tools/lint/03-git-提交规范/', icon: 'github' },
      ] },
      { label: '效率工具', items: [
        { label: '在线工具', href: '/tools/efficiency/online-tools/在线工具/', icon: 'laptop', match: ['/tools/efficiency/online-tools/'] },
        { label: '书签脚本', href: '/tools/efficiency/bookmark-scripts/书签脚本/', icon: 'pencil', match: ['/tools/efficiency/bookmark-scripts/'] },
      ] },
    ],
  },
  { label: '笔记', href: '/notes/', icon: 'pencil' },
];

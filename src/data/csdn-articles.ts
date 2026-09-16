export type CsdnArticle = {
  id: number;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  views?: number;
};

const csdnBase = 'https://blog.csdn.net/HBR666_/article/details/';

export const csdnArticleTotal = 56;

export const csdnArticles: CsdnArticle[] = [
  { id: 159089312, title: '博客地址换啦', date: '2026-03-15', description: '最近忙于实习，更新不多。这里是博客地址迁移后的新入口。', category: '个人总结', tags: ['记录', '个人总结'], views: 35 },
  { id: 153641675, title: '一文带你彻底掌握 Function Call 的使用（Node.js 版）', date: '2025-10-20', description: '用 Node.js、SSE 和阿里云百炼模型完成 Function Calling，从工具判断到结果回传。', category: 'AI', tags: ['AI', 'Node.js', 'Function Call'], views: 898 },
  { id: 152609713, title: 'AI 编辑器（二）——调用模型的 FIM 功能', date: '2025-10-06', description: '记录通过 API 调用代码模型完成 FIM 补全的实现思路与示例。', category: 'AI', tags: ['AI', 'FIM', '编辑器'], views: 407 },
  { id: 152609427, title: 'AI 编辑器（FIM 补全、AI 扩写）简介', date: '2025-10-06', description: '介绍结合 React、Ant Design、Redux 与代码模型的 AI 辅助编辑器。', category: 'AI', tags: ['AI', 'React', '编辑器'], views: 579 },
  { id: 150919272, title: '回顾 WebSocket 心跳机制以及断线重连（Node 服务端）', date: '2025-08-27', description: '整理 WebSocket 心跳检测、超时判断、网络监听和断线重连的完整思路。', category: '网络', tags: ['WebSocket', 'Node.js', '网络'], views: 815 },
  { id: 150442168, title: 'Ant Design Form 登录表单切换问题', date: '2025-08-16', description: '分析条件渲染导致表单实例丢失的问题，并给出更稳定的切换方式。', category: 'React', tags: ['React', 'Ant Design', '表单'], views: 314 },
  { id: 148481254, title: 'NProgress 效果和网页进度不一致问题', date: '2025-06-06', description: '解决路由跳转、异步组件加载与进度条结束时机不一致的问题。', category: 'Vue', tags: ['Vue', 'NProgress', '路由'], views: 391 },
  { id: 148239887, title: 'CSS 基础', date: '2025-05-26', description: '从浏览器可视区、滚动距离和元素位置等概念开始回顾 CSS 基础。', category: '前端', tags: ['CSS', '前端'], views: 1201 },
  { id: 147960022, title: '面试——HTML', date: '2025-05-14', description: '整理 HTML 渲染模式对 CSS 代码和 JavaScript 解析的影响。', category: '面试', tags: ['HTML', '面试'], views: 1240 },
  { id: 147604597, title: 'Vue 3 定义全局防抖指令', date: '2025-04-29', description: '把防抖行为封装成全局指令，减少输入框使用时的重复代码。', category: 'Vue', tags: ['Vue3', '防抖', '指令'], views: 599 },
  { id: 147373490, title: 'Vue 3 Excel 文件导入', date: '2025-04-20', description: '记录在小组官网中导入 Excel 并展示成员信息的实现过程。', category: 'Vue', tags: ['Vue3', 'Excel', '文件处理'], views: 561 },
  { id: 147195193, title: '进程线程回顾', date: '2025-04-13', description: '重新梳理进程与线程的关系、资源共享和网络学习中的理解盲区。', category: '个人总结', tags: ['进程', '线程', '复习'], views: 860 },
  { id: 147021762, title: '前缀和与差分（一维）', date: '2025-04-06', description: '通过区间求和与区间修改的例子理解前缀和与差分数组。', category: '算法', tags: ['算法', '前缀和', '差分'], views: 451 },
  { id: 146719967, title: 'Marked 库：高效将 Markdown 转换为 HTML', date: '2025-03-30', description: '记录使用 Marked 处理 Markdown 文本、扩展渲染器和接入 AI 输出的过程。', category: '前端', tags: ['JavaScript', 'Markdown', '工具'], views: 2484 },
  { id: 146457388, title: '菜单（路由）权限、按钮权限与路由进度条', date: '2025-03-23', description: '从路由、接口和按钮三个层面整理前端权限控制的实现思路。', category: '前端', tags: ['Vue', '权限', '路由'], views: 977 },
  { id: 146298443, title: 'BFS（广度优先搜索，走迷宫问题）', date: '2025-03-16', description: '用走迷宫问题理解广度优先遍历和队列的使用方式。', category: '算法', tags: ['算法', 'BFS'], views: 728 },
  { id: 146127376, title: 'ECharts 数据可视化大屏（Vue 3 + ECharts）', date: '2025-03-09', description: '记录使用 Vue 3 和 ECharts 完成数据可视化大屏的实践。', category: 'Vue', tags: ['Vue3', 'ECharts', '可视化'], views: 3095 },
  { id: 145958494, title: 'Web Worker 计算 MD5', date: '2025-03-02', description: '将大文件 Hash 计算放到 Web Worker 中，避免长时间阻塞主线程。', category: '前端', tags: ['JavaScript', 'Web Worker', 'MD5'], views: 507 },
  { id: 145805203, title: 'Vue 3 大文件分片上传与断点续传（TS 核心思路）', date: '2025-02-23', description: '整理大文件分片、上传合并和断点续传的基本设计与实现思路。', category: '文件上传', tags: ['Vue3', 'TypeScript', '文件上传'], views: 1307 },
  { id: 144480742, title: '封装 confirm（Vue 3 + TS）', date: '2024-12-15', description: '通过动态挂载组件封装 confirm，并处理确定、取消与组件卸载。', category: 'Vue', tags: ['Vue3', 'TypeScript', '组件'], views: 1277 },
  { id: 144326256, title: '旧尘落定，新阳破晓吟风处', date: '2024-12-08', description: '谨以此篇，告别过去的自己。', category: '个人总结', tags: ['随笔', '记录'], views: 325 },
  { id: 144167172, title: 'Node 环境的事件循环', date: '2024-12-01', description: '对比浏览器与 Node.js 事件循环，回顾 V8、libuv 与异步任务。', category: 'Node.js', tags: ['Node.js', '事件循环'], views: 1185 },
  { id: 144011203, title: '伪数组和真数组', date: '2024-11-24', description: '从 length、索引和数组方法等角度区分伪数组与真数组。', category: 'JavaScript', tags: ['JavaScript', '数组'], views: 469 },
  { id: 143835553, title: 'Vue 3 组件通信', date: '2024-11-17', description: '记录 Vue 3 中组件之间传递数据与触发事件的常见方式。', category: 'Vue', tags: ['Vue3', '组件'], views: 908 },
  { id: 143665057, title: 'Vue 3 新组件与其他 API', date: '2024-11-10', description: '整理浅层响应式、原始对象和只读对象等 Vue 3 API。', category: 'Vue', tags: ['Vue3', 'API'], views: 1027 },
  { id: 143466755, title: 'TS（类、接口、泛型）', date: '2024-11-03', description: '从数据模型、类的契约和代码复用三个角度理解 TypeScript。', category: 'TypeScript', tags: ['TypeScript', '类', '泛型'], views: 1338 },
  { id: 143270412, title: 'TS 基础', date: '2024-10-27', description: '回顾 TypeScript 与 JavaScript 的关系、特点和使用环境。', category: 'TypeScript', tags: ['TypeScript', '基础'], views: 1319 },
  { id: 143087958, title: 'Vue（4）脚手架与 Vuex', date: '2024-10-20', description: '整理 Vue 构建版本、脚手架和 Vuex 的基础知识。', category: 'Vue', tags: ['Vue', 'Vuex', '脚手架'], views: 1564 },
  { id: 142908206, title: 'Vue（3）组件', date: '2024-10-14', description: '记录 Vue 组件事件、自定义事件和父子组件通信。', category: 'Vue', tags: ['Vue', '组件'], views: 1092 },
  { id: 142725143, title: 'Vue 基础（2）：检测数据原理与生命周期', date: '2024-10-06', description: '回顾 Vue 指令、配置对象回调和生命周期相关知识。', category: 'Vue', tags: ['Vue', '生命周期', '指令'], views: 1494 },
  { id: 142639364, title: 'Vue 基础（1）', date: '2024-09-29', description: '从数据代理和计算属性开始，重新梳理 Vue 的基础响应式概念。', category: 'Vue', tags: ['Vue', '响应式'], views: 1528 },
  { id: 142435157, title: '一些函数的封装', date: '2024-09-22', description: '记录日常开发中一些常用函数的封装。', category: 'JavaScript', tags: ['JavaScript', '工具'], views: 450 },
  { id: 142284426, title: 'Webpack', date: '2024-09-15', description: '回顾 Webpack 的模块打包、依赖管理和文件转换能力。', category: '前端', tags: ['Webpack', '工程化'], views: 2251 },
  { id: 139543614, title: 'src 与 href，fetch 与 ajax，cookie 与 session', date: '2024-06-08', description: '对比资源加载、Fetch 请求、Ajax 以及浏览器状态管理的基础概念。', category: '前端', tags: ['HTML', 'JavaScript', '网络'], views: 1155 },
  { id: 139398840, title: '中间件与模板引擎', date: '2024-06-02', description: '以 Node.js 服务端为例，理解中间件和模板引擎的执行过程。', category: 'Node.js', tags: ['Node.js', '中间件'], views: 1181 },
  { id: 139220367, title: 'Node.js（文件操作、构建服务器、Express、npm）', date: '2024-05-26', description: '从文件操作到 Express 和 npm，回顾 Node.js 服务端开发基础。', category: 'Node.js', tags: ['Node.js', 'Express', 'npm'], views: 1092 },
  { id: 139039128, title: '事件委托、call、apply、bind 用法', date: '2024-05-19', description: '整理事件冒泡、事件委托以及 call、apply、bind 的使用场景。', category: 'JavaScript', tags: ['JavaScript', '事件', '函数'], views: 909 },
  { id: 138758297, title: 'jQuery 的一些小操作以及遇到的问题', date: '2024-05-12', description: '记录 jQuery 在事件、DOM 操作和评论交互中的一些实践。', category: '前端', tags: ['jQuery', 'JavaScript'], views: 444 },
  { id: 138034762, title: 'Thymeleaf（2）', date: '2024-04-21', description: '记录项目推进过程中的 Thymeleaf 学习笔记。', category: 'Java', tags: ['Thymeleaf', 'Java'], views: 675 },
  { id: 137737928, title: 'Textarea 的常用属性与 Thymeleaf', date: '2024-04-14', description: '整理 textarea 常用属性，以及它在 Thymeleaf 模板中的使用方式。', category: 'Java', tags: ['HTML', 'Thymeleaf'], views: 3111 },
].map((article) => ({
  ...article,
  description: article.description.trim(),
}));

export function getCsdnArticleUrl(article: Pick<CsdnArticle, 'id'>): string {
  return `${csdnBase}${article.id}`;
}

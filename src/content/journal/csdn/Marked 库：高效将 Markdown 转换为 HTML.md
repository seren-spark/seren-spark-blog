---
title: "Marked 库：高效将 Markdown 转换为 HTML"
description: "记录使用 Marked 处理 Markdown 文本、扩展渲染器和接入 AI 输出的过程。"
type: journal
occurredAt: 2025-03-30
publishedAt: 2025-03-30
tags:
  - 前端
sourceUrl: https://blog.csdn.net/HBR666_/article/details/146719967
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/2601951fcd66489198e55798ba10df2c.png
---

# 前言
最近尝试了一下通过星火大模型将ai引入到项目上，但是ai返回的数据可以显而易见的发现是markedown语法的，那么就需要一个工具，将![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2601951fcd66489198e55798ba10df2c.png)类似这种的格式转换为markdown格式
Marked 是一个用 JavaScript 编写的开源库，专注于把 Markdown 格式的文本解析并转换为 HTML。它广泛应用于各类 Web 应用程序、文档生成工具、博客系统等场景中，实现 Markdown 到 HTML 的顺畅转换

然后我就搜索到了marked这个包，

# 使用

## 基本使用

[官网](https://marked.js.org/)
**安装**
`npm install marked`

每个页面引入如果是marked 那么所有页面的设置将会通用

```javascript
import { marked } from "marked";
// or const { marked } = require('marked');

const html = marked.parse("# Marked in Node.js\n\nRendered by **marked**.");
```

如果想要创建独立的marked

```javascript
import { Marked } from 'marked';
const marked = new Marked([options, extension, ...]);

```

**使用**

```javascript
//markdownString:要解析的markdown，必须为字符串
//options:marked.js的配置
marked.parse(markdownString [,options])

```

**options**
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2601951fcd66489198e55798ba10df2c.png)

## 自定义渲染器

自定义渲染器可以把解析后形成的数据再次进行二次修改

```javascript
const renderer = new marked.Renderer();
```

渲染器方法：
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8cd0e293507141248439200a9bd40dd5.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/48b2d5dc1ef5434d842633b513e58b96.png)

### 例子

```javascript
renderer.heading = (data) => {
  const { raw, text, depth } = data;
  console.log(text, depth);
  console.log();

  // 将一级标题转换为h1标签
  if (depth === 1) {
    return `<h1 class="hClass"> ${text}</h1>`;
  } else if (depth === 2) {
    return `<h2 class="hClass">${text}</h2>`;
  } else if (depth === 3) {
    return `<h3 class="hClass">${text}</h3>`;
  } else if (depth === 4) {
    return `<h4 class="hClass">${text}</h4>`;
  } else if (depth === 5) {
    return `<h5 class="hClass">${text}</h5>`;
  } else if (depth === 6) {
    return `<h6 class="hClass">${text}</h6>`;
  }
};
renderer.html = (html) => {
  console.log(html);
  const { text } = html;
  return `<div class="htmlClass">${text}</div>`;
};
marked.use(renderer);
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6cd8594c9c224357b21cc8515eb6bf4f.png)
当渲染到页面上时
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7cbd001432f4408f97d9659b56b92be9.png)

# 代码高亮

在markedown中是不可避免有代码块的，但是markedown返回的数据并不会想当然的带上样式，我们需要自己进行设置

```javascript
npm i highlight.js
npm i github-markdown-css
```

在main.js中写一个全局自定义指令

```javascript
import hljs from "highlight.js";
import "github-markdown-css";
import "highlight.js/styles/atom-one-dark.css";

Vue.directive("highlight", function (el) {
  let blocks = el.querySelectorAll("pre code");
  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  });
});
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7f5e246538da45f4a92fbb29bca39cfb.png)

如果想要改变一些样式的话 定义一个markdown样式 这里我叫做 markedown-body

```javascript
.markdown-body {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif !important;
  line-height: 20px;
  & ul {
    list-style: none;
    padding-left: 20px;
  }
  color: #000 !important;
  p {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }
  pre {
    padding: 5px !important;
    margin-bottom: 10px !important;
  }
  .hljs {
    color: #abb2bf;
    background: #282c34;
  }
  .hClass {
    //出现#则不转换为h1等标签
    font-size: 16px;
    color: #8a2328;
    font-weight: 600;
    margin: 10px 0;
  }
  /* 只改变普通 code 标签的颜色，不影响 pre 中的 code */
  code:not(pre) {
    color: red;
    font-weight: 600;
    background-color: rgba(175, 184, 193, 0.3);
    margin: 0 5px;
  }

  a {
    color: #1d71f7 !important;
  }
}
```

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/146719967)

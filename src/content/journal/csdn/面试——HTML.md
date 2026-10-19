---
title: "面试——HTML"
description: "整理 HTML 渲染模式对 CSS 代码和 JavaScript 解析的影响。"
type: journal
occurredAt: 2025-05-14
publishedAt: 2025-05-14
tags:
  - 面试
sourceUrl: https://blog.csdn.net/HBR666_/article/details/147960022
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/img_convert/237db389a61bc1e64300cb1a31cc937c.png
---

# 1.src和href的区别

**<font style="color:rgb(238, 63, 77);">总结来说：</font>**

- `<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">src</font>`<font style="color:rgb(44, 62, 80);">用于替换当前元素，指向的资源会嵌入到文档中，例如脚本、图像、框架等。</font>
- `<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">href</font>`<font style="color:rgb(44, 62, 80);">用于建立文档与引用资源之间的链接，例如链接到其他文档或引入外部样式表。</font>

<font style="color:#000000;">（1）src</font>

<font style="color:#000000;background-color:#F9EFCD;">src 指向外部资源的位置</font><font style="color:#000000;">，指向的内容将会</font><font style="color:#000000;background-color:#F9EFCD;">嵌入到文档中当前标签所在位置</font><font style="color:#000000;">；在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本。</font>

> <font style="color:#000000;">img/iframe标签加载资源是异步的，不会阻止浏览器解析HTML，但是在加载时元素尺寸未知会延迟渲染，直到确认尺寸；</font><font style="color:rgb(6, 6, 7);">在 </font>`<font style="color:rgb(6, 6, 7);"><img></font>`<font style="color:rgb(6, 6, 7);"> 和 </font>`<font style="color:rgb(6, 6, 7);"><iframe></font>`<font style="color:rgb(6, 6, 7);"> 标签中指定 </font>`<font style="color:rgb(6, 6, 7);">width</font>`<font style="color:rgb(6, 6, 7);"> 和 </font>`<font style="color:rgb(6, 6, 7);">height</font>`<font style="color:rgb(6, 6, 7);"> 属性，可以避免浏览器因等待资源加载而延迟渲染。</font>

```javascript
<script src =”js.js”></script>
```

<font style="color:#000000;">当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，这也是为什么将js 脚本放在底部而不是头部。 </font>

<font style="color:#000000;">（2）href</font>

<font style="color:#000000;">href 指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果在文档中添加 </font>

```javascript
<link href=”common.css” rel=”stylesheet”/>
```

<font style="color:#000000;">那么浏览器会识别该文档为 css 文件，就会并行下载资源并且不会停止对当前文档的处理。 这也是为什么建议使用 link 方式来加载 css，而不是使用@import 方式。</font>

> link会异步加载css，而@import会在页面加载完成后才开始加载，会出现页面初始无样式也就是白屏问题。

# <font style="color:#000000;">2.对HTML语义化的理解</font>

HTML语义化是指在编写HTML代码时，使用具有明确含义的标签来构建网页内容 使得网页内容更加清晰、易于理解和维护。

HTML语义化有以下几个优点：

- SEO优化：搜索引擎可以通过语义化的标签更好地理解网页内容，从而提高网站在搜索引擎中的排名。
- 可访问性：语义化标签使得网页在没有CSS的情况下也能呈现出良好的结构，便于辅助技术（如屏幕阅读器）为残障人士提供更好的访问体验。
- 代码可读性和可维护性：使用语义化标签可以使代码更加清晰和有组织，便于团队协作和代码维护。
- 对机器友好，带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，有利于SEO。除此之外，语义类还支持读屏软件，根据文章可以自动生成目录；

**语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化）**。通俗来讲就是用正确的标签做正确的事情。

常见的语义化标签：

```html
<header></header>
头部

<nav></nav>
导航栏

<section></section>
区块（有语义化的div）

<main></main>
主要区域

<article></article>
主要内容

<aside></aside>
侧边栏

<footer></footer>
底部
```

# 3.DOCTYPE（文档类型）的使用

DOCTYPE是HTML5中一种标准通用标记语言的文档类型声明，它的目的是**告诉浏览器（解析器）应该以什么样（html或xhtml）的文档类型定义来解析文档**，不同的渲染模式会影响浏览器对 CSS 代码甚⾄ JavaScript 脚本的解析。

浏览器渲染页面的两种模式（可通过document.compatMode获取，比如，语雀官网的文档类型是CSS1Compat：

- **CSS1Compat：标准模式（Strict mode）**，默认模式，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
- **BackCompat：怪异模式(混杂模式)(Quick mode)**，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。

> 前者让IE具有兼容标准的行为 后者让IE 像IE5一样（支持一些非标准的特性）

# 4.script标签中defer 和asnyc的区别

如果没有这两个属性，浏览器会立即加载并执行相应的脚本，阻塞后续文档的加载

![](https://i-blog.csdnimg.cn/img_convert/237db389a61bc1e64300cb1a31cc937c.png)

> 其中蓝色代表js脚本网络加载时间，红色代表js脚本执行时间，绿色代表html解析

<font style="color:#000000;">defer是“渲染完再执行” </font>

<font style="color:#000000;">async是“下载完就执行”</font>

<font style="color:#000000;">另外，如果有</font><font style="color:#000000;background-color:#F9EFCD;">多个defer脚本，会按照它们在页面出现的顺序加载</font><font style="color:#000000;">，而</font><font style="color:#000000;background-color:#F9EFCD;">多个async脚本是不能保证加载顺序</font><font style="color:#000000;">的。</font>

# <font style="color:#000000;">5.常用meta标签有哪些</font>

`meta` 标签由 `name` 和 `content` 属性定义，**用来描述网页文档的属性**，比如网页的作者，网页描述，关键词等，除了HTTP标准固定了一些`name`作为大家使用的共识，开发者还可以自定义name。

常用的meta标签：

（1）`charset`，用来描述HTML文档的编码类型：

```html
<meta charset="UTF-8" />
```

（2） `keywords`，页面关键词：

```html
<meta name="keywords" content="关键词" />
```

（3）`description`，页面描述：

```html
<meta name="description" content="页面描述内容" />
```

（4）`refresh`，页面重定向和刷新：

```html
<meta http-equiv="refresh" content="0;url=" />
```

（5）`viewport`，适配移动端，可以控制视口的大小和比例：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1"
/>
```

其中，`content` 参数有以下几种：

- `width viewport` ：宽度(数值/device-width)
- `height viewport` ：高度(数值/device-height)
- `initial-scale` ：初始缩放比例
- `maximum-scale` ：最大缩放比例
- `minimum-scale` ：最小缩放比例
- `user-scalable` ：是否允许用户缩放(yes/no）

（6）搜索引擎索引方式：

```html
<meta name="robots" content="index,follow" />
```

其中，`content` 参数有以下几种：

- `all`：文件将被检索，且页面上的链接可以被查询；
- `none`：文件将不被检索，且页面上的链接不可以被查询；
- `index`：文件将被检索；
- `follow`：页面上的链接可以被查询；
- `noindex`：文件将不被检索；
- `nofollow`：页面上的链接不可以被查询。

# 6.HTML5有哪些更新（未写完）

语义化标签

媒体标签：

# 7.行内元素有哪些？块级，空？[链接](https://blog.csdn.net/qq_51187159/article/details/124661063?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522e5f3e12f49e763bd3e0c18bb8d3ba50e%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=e5f3e12f49e763bd3e0c18bb8d3ba50e&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-124661063-null-null.142%5Ev102%5Epc_search_result_base1&utm_term=%E8%A1%8C%E5%86%85%E5%85%83%E7%B4%A0%E5%92%8C%E5%9D%97%E7%BA%A7%E5%85%83%E7%B4%A0&spm=1018.2226.3001.4187)

行内元素：span i em strong b a input select

块级：div p h1~h6 ul li ol

空元素，即没有内容的HTML元素。空元素是在开始标签中关闭的，也就是空元素没有闭合标签：

- 常见的有：`<br>`、`<hr>`、`<img>`、`<input>`、`<link>`、`<meta>`；
- 鲜见的有：`<area>`、`<base>`、`<col>`、`<colgroup>`、`<command>`、`<embed>`、`<keygen>`、`<param>`、`<source>`、`<track>`、`<wbr>`。

|            | 宽高         | margin（有效） | 自动换行 |
| ---------- | ------------ | -------------- | -------- |
| 行内元素   | 设置宽高无效 | 左右           | x        |
| 块级元素   | 能够识别宽高 | 上下左右       | √        |
| 行内块元素 | 能够识别     |                | x        |

# 8.对webworker的理解

**<font style="background-color:#F9EFCD;">Web Worker 是一种在后台运行的多线程技术，可以提高网页的性能和响应能力。然而，由于同源策略、无法直接操作 DOM、消息传递等限制，Web Worker 的使用场景和方式需要根据具体需求进行合理的设计和选择。</font>**

webworker是运行在后台的js 独立于其他脚本，在进行复杂操作时不会影响主线程

Web Worker 是 HTML5 提供的一项技术，允许 JavaScript 在后台创建多个线程来执行任务，以提高网页的性能和响应能力。Web Worker 可以在主线程之外运行，与主线程并行工作，并且不会阻塞页面的交互。

主要特点和用途：

- <font style="background-color:#F9EFCD;">多线程运行</font>：Web Worker 允许 JavaScript 代码在后台创建一个或多个线程，独立于主线程运行。这样可以执行一些耗时的计算、处理大量数据、执行复杂的算法等任务，而不会影响主线程的响应性能。
- <font style="background-color:#F9EFCD;">并行处理</font>：由于 Web Worker 运行在独立的线程中，可以与主线程并行工作，从而提高页面整体的性能和响应速度。
- <font style="background-color:#F9EFCD;">可以进行复杂的计算</font>：Web Worker 适用于需要进行复杂计算或处理大量数据的场景，例如图像处理、音视频编解码、物理模拟等。

Web Worker 的使用限制包括：

- <font style="background-color:#F9EFCD;">同源策略</font>：Web Worker 遵循同源策略，即只能与加载它的脚本具有相同的域、协议和端口。
- <font style="background-color:#F9EFCD;">无法直接操作 DOM</font>：Web Worker 不能直接访问或操作页面的 DOM 结构。这是为了确保多线程操作不会导致不可预测的结果或竞态条件。
- <font style="background-color:#F9EFCD;">消息传递</font>：Web Worker 与主线程之间的通信需要通过消息传递机制，即通过 postMessage() 方法发送消息，并通过 onmessage 事件接收消息。这种通信方式有一定的开销和限制。
- <font style="background-color:#F9EFCD;">无法访问某些全局对象和方法</font>：无法访问 window、document 和其他一些浏览器特定的全局对象和方法。

# <font style="color:#000000;">9.title&h1，b&strong，i&em的区别</font>

title是网页的标题，h1是网页内容某部分的标题

b标签只是一个简单的加粗标签，而strong标签有加强语气的效果，

i内容展示为斜体，em表示强调的文本

# 10.canvas和svg的区别

**（1）SVG：**

SVG可缩放矢量图形（Scalable Vector Graphics）是基于可扩展标记语言XML描述的2D图形的语言，SVG基于XML就意味着SVG DOM中的每个元素都是可用的，可以为某个元素附加Javascript事件处理器。在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。

其特点如下：

- 不依赖分辨率
- 支持事件处理器
- 最适合带有大型渲染区域的应用程序（比如谷歌地图）
- 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
- 不适合游戏应用

**（2）Canvas：**

Canvas是画布，通过Javascript来绘制2D图形，是逐像素进行渲染的。其位置发生改变，就会重新进行绘制。

其特点如下：

- 依赖分辨率
- 不支持事件处理器
- 弱的文本渲染能力
- 能够以 .png 或 .jpg 格式保存结果图像
- 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

注：矢量图，也称为面向对象的图像或绘图图像，在数学上定义为一系列由线连接的点。矢量文件中的图形元素称为对象。每个对象都是一个自成一体的实体，它具有颜色、形状、轮廓、大小和屏幕位置等属性。

<font style="background-color:#F9EFCD;">canvas按像素渲染，svg按xml绘制，所以canvas缩放会更模糊，但是动态效果更好，svg则反之。</font>

# 11.head 标签有什么作用，其中什么标签必不可少

# 12.WEB标准以及W3C标准是什么？

WEB标准是指由万维网联盟（World Wide Web Consortium，简称W3C）制定的一系列技术规范和指南，旨在确保网页在不同的浏览器和设备上具有一致的表现和行为。这些标准涵盖了HTML、CSS、JavaScript等前端技术，并规定了它们的语法、结构、样式以及交互行为等方面的规范。

W3C标准是由W3C组织制定和推广的一系列技术标准，旨在推动网络技术的发展和互操作性。W3C是一个国际性的标准化组织，由互联网行业的各大公司、研究机构和个人组成，致力于制定并推广互联网的开放标准。W3C标准包括HTML、CSS、XML、DOM、SVG等多个技术领域，并且不断更新和演进，以适应新的需求和技术发展。

**<font style="color:rgb(238, 63, 77);">具体来说，WEB标准和W3C标准强调以下几个方面：</font>**

- **<font style="color:rgb(238, 63, 77);">标签闭合</font>**<font style="color:rgb(44, 62, 80);">：</font>HTML标签必须按照规定的格式正确闭合，以确保页面结构的准确性和一致性<font style="color:rgb(44, 62, 80);">。</font>
- **<font style="color:rgb(238, 63, 77);">标签小写</font>**<font style="color:rgb(44, 62, 80);">：</font>HTML标签和属性应该使用小写字母，以避免浏览器解析错误。
- **<font style="color:rgb(238, 63, 77);">不乱嵌套</font>**<font style="color:rgb(44, 62, 80);">：</font>HTML标签应该按照正确的嵌套规则进行使用，不应该出现乱七八糟的嵌套结构，以确保页面结构的清晰和可维护性。
- **<font style="color:rgb(238, 63, 77);">使用外链CSS和JS</font>**<font style="color:rgb(44, 62, 80);">：</font>将CSS样式和JavaScript代码尽可能地放在外部文件中，并通过链接的方式引入，以实现结构、行为和表现的分离，提高代码的可重用性和可维护性。

通过遵循这些标准和规范，开发人员可以编写出更加规范、可靠和跨平台的网页，确保网页在不同的浏览器和设备上得到一致的显示和行为，提供更好的用户体验。此外，遵循WEB标准和W3C标准还有助于网页的可访问性、可维护性和可扩展性，同时推动互联网技术的进步和发展

---

# -------了解--------

# img的srcset属性的作用

响应式页面中经常用到根据屏幕密度设置不同的图片。这时就用到了 img 标签的srcset属性。srcset属性用于设置不同屏幕密度下，img 会自动加载不同的图片。用法如下：

```html
<img src="image-128.png" srcset="image-256.png 2x" />
```

使用上面的代码，就能实现在屏幕密度为1x的情况下加载image-128.png, 屏幕密度为2x时加载image-256.png。

按照上面的实现，不同的屏幕密度都要设置图片地址，目前的屏幕密度有1x,2x,3x,4x四种，如果每一个图片都设置4张图片，加载就会很慢。所以就有了新的srcset标准。代码如下：

```html
<img
  src="image-128.png"
  srcset="image-128.png 128w, image-256.png 256w, image-512.png 512w"
  sizes="(max-width: 360px) 340px, 128px"
/>
```

其中srcset指定图片的地址和对应的图片质量。sizes用来设置图片的尺寸零界点。对于 srcset 中的 w 单位，可以理解成图片质量。如果可视区域小于这个质量的值，就可以使用。浏览器会自动选择一个最小的可用图片。

sizes语法如下：

```html
sizes="[media query] [length], [media query] [length] ... "
```

sizes就是指默认显示128px, 如果视区宽度大于360px, 则显示340px。

> 屏幕密度

# HTML离线存储怎么使用，它的工作原理是什么

# 浏览器是如何对HTML5的离线储存资源进行管理和加载

# Label的作用是什么，如何使用？

Label标签来定义表单控件的关系：当用户选择label标签时，浏览器会自动将焦点转到和label标签相关的表单控件上

<font style="color:rgb(38, 38, 38);"></font>

# <font style="color:rgb(38, 38, 38);">文档声明（Doctype）和<!Doctype html>有何作用，严格模式与混杂模式如何区分，它们有何意义？</font>

[文档声明（Doctype）和<!Doctype html>有何作用，严格模式与混杂模式如何区分，它们有何意义](https://juejin.cn/post/6989264337143595044?searchId=20250510172432C1649BA11D22248C8BEC)

**文****档声明的作用**：文档声明是为了告诉浏览器，当前HTML文档使用什么版本的HTML来写的，这样浏览器才能按照声明的版本来正确的解析

**<!Doctype html>的作用：**`<!doctype html>` 的作用就是让浏览器进入标准模式，使用最新的 `HTML5` 标准来解析渲染页面；如果不写，浏览器就会进入混杂模式，我们需要避免此类情况发生。

**严格模式与混杂模式如何区分 **

严格模式：又称标准模式，是指浏览器按照 W3C 标准解析代码。

混杂模式：又称怪异模式或兼容模式，是指浏览器用自己的方式解析代码。

如何区分：浏览器解析时到底使用严格模式还是混杂模式，与网页中的 DTD 直接相关。

如果文档**<font style="background-color:#F9EFCD;">包含严格的 DOCTYPE</font>** ，那么它一般以<font style="background-color:#F9EFCD;">严格模式</font>呈现。（严格 DTD ——严格模式）

包含<font style="background-color:#F9EFCD;">过渡 DTD 和 URI 的 DOCTYPE</font> ，也以<font style="background-color:#F9EFCD;">严格模式</font>呈现，但有<font style="background-color:#F9EFCD;">过渡 DTD 而没有 URI</font> （统一资源标识符，就是声明最后的地址）会导致页面以混杂模式呈现。（有 URI 的过渡 DTD ——严格模式；没有 URI 的过渡 DTD ——混杂模式）

DOCTYPE 不存在或形式不正确会导致文档以混杂模式呈现。（DTD不存在或者格式不正确——混杂模式）

<font style="color:#DF2A3F;">HTML5 没有 DTD ，因此也就没有严格模式与混杂模式的区别</font>，HTML5 有相对宽松的语法，实现时，已经尽可能大的实现了向后兼容。（ HTML5 没有严格和混杂之分）

意义：严格模式与混杂模式存在的意义与其来源密切相关，如果说只存在严格模式，那么许多旧网站必然受到影响，如果只存在混杂模式，那么会回到当时浏览器大战时的混乱，每个浏览器都有自己的解析模式。

---

严格型：<font style="color:rgb(37, 41, 51);">结构中不能出现格式或表现的内容，以及弃用的元素（比如 font）</font>

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

过渡型：<font style="color:rgb(37, 41, 51);">结构中可以出现格式标记或表现(CSS)的内容 ，仍然可以使用废弃的元素。比如Html4.01 和XHTML1.0的过渡性</font>

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

框架型：<font style="color:rgb(37, 41, 51);">可以使用框架技术，实现多个网页在一个浏览器窗口中呈现 。比如Html4.01 和XHTML1.0的框架型。</font>

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

:::tips

- `<!DOCTYPE>` 声明位于文档中的最前面，处于 `<html>` 标签之前。告知浏览器的解析器， 用什么文档类型 规范来解析这个文档。
- `Document Type Definition`定义了XML或者HTML的特定版本中允许有什么，不允许有什么，在渲染解析页面的时候浏览器会根据这些规则检查页面的有效性并且采取相应的措施。
- DTD分为三种类型分别是严格型,过渡型,框架型。
- 浏览器解析文档的时有两种类型分别为严格模式和混杂模式,这两种模式的区分又与DTD有密切联系.(严格 DTD ——严格模式)，(有 URI 的过渡 DTD ——严格模式；没有 URI 的过渡 DTD ——混杂模式） ，（DTD不存在或者格式不正确——混杂模式），（ HTML5 没有严格和混杂之分）
- 严格模式与混杂模式存在的意义:如果说只存在严格模式，那么许多旧网站必然受到影响，如果只存在混杂模式，那么会回到当时浏览器大战时的混乱，每个浏览器都有自己的解析模式。

:::

# 渐进增强和优雅降级的区别

<font style="color:rgb(37, 41, 51);">在我们构建一个web项目的时候肯定要先考虑我们的项目是要以实现完整的功能为主还是以基本功能为主。这就引出了渐进增强vs优雅降级</font>

**（\****1）渐进增强（progressive enhancement）**：主要是针对低版本的浏览器进行页面重构，保证基本的功能情况下，再针对高级浏览器进行效果、交互等方面的改进和追加功能，以达到更好的用户体验。

**（2）优雅降级 graceful degradation**<font style="color:rgb(37, 41, 51);">： 一开始就构建完整的功能，然后再针对低版本的浏览器进行兼容。</font>

**两者区别：**

- <font style="color:rgb(37, 41, 51);">优雅降级是从复杂的现状开始的，并试图减少用户体验的供给；而渐进增强是从一个非常基础的，能够起作用的版本开始的，并在此基础上不断扩充，以适应未来环境的需要；</font>
- <font style="color:rgb(37, 41, 51);">降级（功能衰竭）意味着往回看，而渐进增强则意味着往前看，同时保证其根基处于安全地带。</font>

<font style="color:rgb(37, 41, 51);">“优雅降级”观点认为应该针对那些最高级、最完善的浏览器来设计网站。而将那些被认为“过时”或有功能缺失的浏览器下的测试工作安排在开发周期的最后阶段，并把测试对象限定为主流浏览器（如 IE、Mozilla 等）的前一个版本。 在这种设计范例下，旧版的浏览器被认为仅能提供“简陋却无妨 (poor, but passable)” 的浏览体验。可以做一些小的调整来适应某个特定的浏览器。但由于它们并非我们所关注的焦点，因此除了修复较大的错误之外，其它的差异将被直接忽略。 </font>

<font style="color:rgb(37, 41, 51);">“渐进增强”观点则认为应关注于内容本身。内容是建立网站的诱因，有的网站展示它，有的则收集它，有的寻求，有的操作，还有的网站甚至会包含以上的种种，但相同点是它们全都涉及到内容。这使得“渐进增强”成为一种更为合理的设计范例。这也是它立即被 Yahoo 所采纳并用以构建其“分级式浏览器支持 (Graded Browser Support)”策略的原因所在。 </font>

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/147960022)

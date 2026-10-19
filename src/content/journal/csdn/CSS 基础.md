---
title: "CSS 基础"
description: "从浏览器可视区、滚动距离和元素位置等概念开始回顾 CSS 基础。"
type: journal
occurredAt: 2025-05-26
publishedAt: 2025-05-26
tags:
  - 前端
sourceUrl: https://blog.csdn.net/HBR666_/article/details/148239887
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/7748cc8ee6f241c8b0c312f162b4ccbf.png
---
![](https://i-blog.csdnimg.cn/img_convert/7ed25916a6deb4704eecc16d20d90ebf.png)

![](https://i-blog.csdnimg.cn/direct/9f5e1bd067af4213be9b5db42ec1c8a5.png)



对于选择器的**优先级**：

+ 标签选择器、伪元素选择器：1；
+ 类选择器、伪类选择器、属性选择器：10；
+ id 选择器：100；
+ 内联样式：1000；

注意：

+ ！important声明的样式的优先级最高；
+ 如果优先级相同，则最后出现的样式生效；
+ 继承得到的样式的优先级最低；
+ 通用选择器（*）、子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以它们的权值都为 0 ；
+ 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。

<h1 id="AoCZO">css中可继承与不可继承属性有哪些</h1>
**一、无继承性的属性**

1. **display**：规定元素应该生成的框的类型
2. **文本属性**：
+ vertical-align：垂直文本对齐
+ text-decoration：规定添加到文本的装饰
+ text-shadow：文本阴影效果
+ white-space：空白符的处理
+ unicode-bidi：设置文本的方向
3. **盒子模型的属性**：width、height、margin、border、padding
4. **背景属性**：background、background-color、background-image、background-repeat、background-position、background-attachment
5. **定位属性**：float、clear、position、top、right、bottom、left、min-width、min-height、max-width、max-height、overflow、clip、z-index
6. **生成内容属性**：content、counter-reset、counter-increment
7. **轮廓样式属性**：outline-style、outline-width、outline-color、outline
8. **页面样式属性**：size、page-break-before、page-break-after
9. **声音样式属性**：pause-before、pause-after、pause、cue-before、cue-after、cue、play-during



**二、有继承性的属性**

1. **字体系列属性**
+ font-family：字体系列
+ font-weight：字体的粗细
+ font-size：字体的大小
+ font-style：字体的风格
2. **文本系列属性**
+ text-indent：文本缩进
+ text-align：文本水平对齐
+ line-height：行高
+ word-spacing：单词之间的间距
+ letter-spacing：中文或者字母之间的间距
+ text-transform：控制文本大小写（就是uppercase、lowercase、capitalize这三个）
+ color：文本颜色
3. **元素可见性**
+ visibility：控制元素显示隐藏
4. **列表布局属性**
+ list-style：列表风格，包括list-style-type、list-style-image等
5. **光标属性**
+ cursor：光标显示为何种形态









<h1 id="pyFcN">display的属性值及其作用</h1>
| **属性值** | **作用** |
| :---: | :---: |
| none | 元素不显示，并且会从文档流中移除。 |
| block | 块类型。默认宽度为父元素宽度，可设置宽高，换行显示。 |
| inline | 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。 |
| inline-block | 默认宽度为内容宽度，可以设置宽高，同行显示。 |
| list-item | 像块类型元素一样显示，并添加样式列表标记。 |
| table | 此元素会作为块级表格来显示。 |
| inherit | 规定应该从父元素继承display属性的值。 |


<h1 id="Hb80Z">display的block、inline和inline-block的区别</h1>
　（1）**block：**会独占一行，多个元素会另起一行，可以设置width、height、margin和padding属性；

　（2）**inline：**元素不会独占一行，设置width、height属性无效。但可以设置水平方向的margin和padding属性，不能设置垂直方向的padding和margin；

　（3）**inline-block：**将对象设置为inline对象，但对象的内容作为block对象呈现，之后的内联对象会被排列在同一行内。

对于行内元素和块级元素，其特点如下：

**（1）行内元素**

+ 设置宽高无效；
+ 可以设置水平方向的margin和padding属性，不能设置垂直方向的padding和margin；
+ 不会自动换行；

**（2）块级元素**

+ 可以设置宽高；
+ 设置margin和padding都有效；
+ 可以自动换行；
+ 多个块状，默认排列从上到下。



<h1 id="l0sHT"> 隐藏元素的方法有哪些</h1>
+ **display: none**：渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也**<font style="color:#DF2A3F;">不会响应</font>**绑定的监听事件。
+ **visibility: hidden**：元素在页面中仍占据空间，但是**<font style="color:#DF2A3F;">不会响应</font>**绑定的监听事件。
+ **clip/clip-path** ：使用元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是**<font style="color:#DF2A3F;">不会响应</font>**绑定的监听事件。
+ **transform: scale(0,0)**：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是**<font style="color:#DF2A3F;">不会响应</font>**绑定的监听事件。



+ **opacity: 0**：将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
+ **position: absolute**：通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
+ **z-index: 负值**：来使其他元素遮盖住该元素，以此来实现隐藏。





<h1 id="QQK5f">link和@import的区别</h1>
1. `<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><link></font>`<font style="color:rgb(44, 62, 80);">是HTML方式，</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">@import</font>`<font style="color:rgb(44, 62, 80);">是CSS方式。</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><link></font>`<font style="color:rgb(44, 62, 80);">标签在HTML文档的</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><head></font>`<font style="color:rgb(44, 62, 80);">部分中使用，用于引入外部CSS文件；</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">@import</font>`<font style="color:rgb(44, 62, 80);">是在CSS文件中使用，用于引入其他CSS文件。</font>
2. `<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><link></font>`<font style="color:rgb(44, 62, 80);">标签最大限度地支持并行下载，浏览器会同时下载多个外部CSS文件；而</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">@import</font>`<font style="color:rgb(44, 62, 80);">引入的CSS文件会导致串行下载，浏览器会按照顺序逐个下载CSS文件，这可能导致页面加载速度变慢，出现FOUC（Flash of Unstyled Content）问题。</font>
3. `<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><link></font>`<font style="color:rgb(44, 62, 80);">标签可以通过</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">rel="alternate stylesheet"</font>`<font style="color:rgb(44, 62, 80);">指定候选样式表，用户可以在浏览器中切换样式；而</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">@import</font>`<font style="color:rgb(44, 62, 80);">不支持</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">rel</font>`<font style="color:rgb(44, 62, 80);">属性，无法提供候选样式表功能。</font>
4. <font style="color:rgb(44, 62, 80);">浏览器对</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><link></font>`<font style="color:rgb(44, 62, 80);">标</font>签的支持<font style="color:rgb(44, 62, 80);">早于</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">@import</font>`<font style="color:rgb(44, 62, 80);">，一些古老的浏览器可能不支持</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">@import</font>`<font style="color:rgb(44, 62, 80);">方式引入CSS文件，而可以正确解析</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><link></font>`<font style="color:rgb(44, 62, 80);">标签。</font>
5. `<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">@import</font>`<font style="color:rgb(44, 62, 80);">必须出现在样式规则之前，而且只能在CSS文件的顶部引用其他文件；而</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><link></font>`<font style="color:rgb(44, 62, 80);">标签可以放置在文档的任何位置。</font>
+ <font style="color:rgb(44, 62, 80);background-color:#F9EFCD;">link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。</font>
6. <font style="color:rgb(44, 62, 80);">总体来说，</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);"><link></font>`<font style="color:rgb(44, 62, 80);">标签在性能、兼容性和灵活性方面优于</font>`<font style="color:rgb(238, 39, 70);background-color:rgb(249, 241, 219);">@import</font>`<font style="color:rgb(44, 62, 80);">。</font>

<h1 id="ij83i"><font style="color:rgb(44, 62, 80);"> </font>display:none与visibility:hidden的区别</h1>
这两个属性都是让元素隐藏，不可见。**两者****区别如下：**

（1）**在渲染树中**

+ `display:none`会让元素完全从渲染树中消失，渲染时不会占据任何空间；，但在dom树中还有
+ `visibility:hidden`不会让元素从渲染树中消失，渲染的元素还会占据相应的空间，只是内容不可见。

（2）**是否是****继承属性**

+ `display:none`是非继承属性，子孙节点会随着父节点从渲染树消失，通过修改子孙节点的属性也无法显示；
+ `visibility:hidden`是继承属性，子孙节点消失是由于继承了`hidden`，通过设置`visibility:visible`可以让子孙节点显示；

（3）修改常规文档流中元素的 `display` 通常会造成文档的重排，但是修改`visibility`属性只会造成本元素的重绘；

（4）如果使用读屏器，设置为`display:none`的内容不会被读取，设置为`visibility:hidden`的内容会被读取。

<h1 id="SfsLw"><font style="background-color:#F9EFCD;"></font></h1>
<h1 id="xn5ms">伪元素和伪类的区别和作用</h1>
伪元素：在内容元素的前后插入额外的元素或样式，但是这些元素实际上并不在文档中生成，它们只在外部显示可见，但不会在文档的源代码中找到它们

伪类：将特殊的效果添加到特定的选择器上，它是已有元素上添加类别，不会产生新的元素



<h1 id="oRK3g">对盒模型的理解</h1>
CSS3中的盒模型有以下两种：标准盒子模型、IE盒子模型

![](https://i-blog.csdnimg.cn/img_convert/bd3d7f0138eb640a921b1b8c0b87f873.png)

![](https://i-blog.csdnimg.cn/img_convert/7bb03f70910fb943c8d4f6a2c9eb2155.png)

盒模型都是由四个部分组成的，分别是margin、border、padding和content。



标准盒模型和IE盒模型的区别在于设置width和height时，所对应的范围不同：

+ 标准盒模型的width和height属性的范围只包含了content，
+ IE盒模型的width和height属性的范围包含了border、padding和content。



可以通过修改元素的box-sizing属性来改变元素的盒模型：

+ `box-sizing: content-box`表示标准盒模型（默认值）
+ `box-sizing: border-box`表示IE盒模型（怪异盒模型）

<h1 id="AYeU5">为什么有时候用translate改变位置而不是定位</h1>
t<font style="color:#000000;">ranslate 是 transform 属性的⼀个值。</font><font style="color:#000000;background-color:#F9EFCD;">改变transform或opacity不会触发浏览器重新布局（reflow）或重绘</font><font style="color:#000000;">（repaint），只会触发复合（compositions）。而改变绝对定位会触发重新布局，进而触发重绘和复合。transform使浏览器为元素创建⼀个 GPU 图层，但改变绝对定位会使用到 CPU。 因此translate()更高效，可以缩短平滑动画的绘制时间。 ⽽translate改变位置时，元素依然会占据其原始空间，绝对定位就不会发⽣这种情况。</font>

<font style="color:#000000;"></font>

**复合是将页面中不同的图层（Layers）按层级叠放，并最终合并成一个完整帧的过程**<font style="color:rgba(0, 0, 0, 0.85);">。每个图层在渲染树中是独立的渲染单元，</font>

**<font style="color:rgb(0, 0, 0);">为什么修改 </font>**`**transform**`**<font style="color:rgb(0, 0, 0);">/</font>**`**opacity**`**<font style="color:rgb(0, 0, 0);"> 只触发复合？</font>**

不影响布局（Reflow），因为不影响元素的集合属性如宽高位置

不影响绘制：<font style="color:rgba(0, 0, 0, 0.85);">元素的视觉属性（如颜色、边框）未改变</font>

<h1 id="Zfcdg">CSS3有哪些新特性</h1>
+ 新增各种CSS选择器 （: not(.input)：所有 class 不是“input”的节点）
+ 圆角 （border-radius:8px）
+ 多列布局 （multi-column layout）
+ 阴影和反射 （Shadoweflect）
+ 文字特效 （text-shadow）
+ 文字渲染 （Text-decoration）
+ 线性渐变 （gradient）
+ 旋转 （transform）
+ 增加了旋转,缩放,定位,倾斜,动画,多背景

<h1 id="zrKpG">常见的图片格式以及应用场景</h1>
（1）**BMP**，是无损的、既支持索引色也支持直接色的点阵图。这种图片格式几乎没有对数据进行压缩，所以BMP格式的图片通常是较大的文件。



（2）**GIF**是无损的、采用索引色的点阵图。采用LZW压缩算法进行编码。文件小，是GIF格式的优点，同时，GIF格式还具有支持动画以及透明的优点。但是GIF格式仅支持8bit的索引色，所以GIF格式适用于对色彩要求不高同时需要文件体积较小的场景。



（3）**JPEG**是有损的、采用直接色的点阵图。JPEG的图片的优点是采用了直接色，得益于更丰富的色彩，JPEG非常适合用来存储照片，与GIF相比，JPEG不适合用来存储企业Logo、线框类的图。因为有损压缩会导致图片模糊，而直接色的选用，又会导致图片文件较GIF更大。



（4）**PNG-8**是无损的、使用索引色的点阵图。PNG是一种比较新的图片格式，PNG-8是非常好的GIF格式替代者，在可能的情况下，应该尽可能的使用PNG-8而不是GIF，因为在相同的图片效果下，PNG-8具有更小的文件体积。除此之外，PNG-8还支持透明度的调节，而GIF并不支持。除非需要动画的支持，否则没有理由使用GIF而不是PNG-8。



（5）**PNG-24**是无损的、使用直接色的点阵图。PNG-24的优点在于它压缩了图片的数据，使得同样效果的图片，PNG-24格式的文件大小要比BMP小得多。当然，PNG24的图片还是要比JPEG、GIF、PNG-8大得多。



（6）**SVG**是无损的矢量图。SVG是矢量图意味着SVG图片由直线和曲线以及绘制它们的方法组成。当放大SVG图片时，看到的还是线和曲线，而不会出现像素点。SVG图片在放大时，不会失真，所以它适合用来绘制Logo、Icon等。



（7）**WebP**是谷歌开发的一种新图片格式，WebP是同时支持有损和无损压缩的、使用直接色的点阵图。从名字就可以看出来它是为Web而生的，什么叫为Web而生呢？就是说相同质量的图片，WebP具有更小的文件体积。现在网站上充满了大量的图片，如果能够降低每一个图片的文件大小，那么将大大减少浏览器和服务器之间的数据传输量，进而降低访问延迟，提升访问体验。目前只有Chrome浏览器和Opera浏览器支持WebP格式，兼容性不太好。

+ 在无损压缩的情况下，相同质量的WebP图片，文件大小要比PNG小26%；
+ 在有损压缩的情况下，具有相同图片精度的WebP图片，文件大小要比JPEG小25%~34%；
+ WebP图片格式支持图片透明度，一个无损压缩的WebP图片，如果要支持透明度只需要22%的格外文件大小。

<h1 id="iUPwh">对CSSSprites的理解</h1>
CSSSprites(精灵图)，将一个页面涉及到的所有图片都包含到一张大图中去，然后利用CSS的background-image，background-repeat，background-position属性的组合进行背景定位

**优点：**

利用CSS Sprites 可以很好的减少页面的http请求，从而大大的提高了页面的性能，这是CSS Sprites最大的优点

CSS Sprites能减少图片的字节，把三张图片合并成一张图片的字节总是小于这3张图片的字节总和

**缺点：**

在图片合并时，要把多张图片有序的，合理的合并成一张图片，还要留好足够的空间，防止板块内出现不必要的背景，在宽屏及高分辨率下的自适应页面，如果背景不够宽，很容易出现背景断裂；

CSS Sprites在开发的时候相对来说有点麻烦，要借助ps或其他工具对每个背景单元测量其准确的位置

维护方面：CSS Sprites在维护的时候比较麻烦，页面背景有少许改动时，就要改这张合并的图片，无需改的地方尽量不要动，这样避免改动更多的CSS 如果在原来的地方放不下，又只能（最好）往下加图片，这样图片的字节就增加了，还要改动`CSS`。

<h1 id="AYEfP">CSS预处理器/后处理器是什么，为什么要使用它们</h1>
预处理器：less  sass stylus  用来预编译sass或者less  增加了css代码的复用性。层级，mixin,变量 循环，函数等对编写以及开发UI组件都极为方便

后处理器：如：postCss，通常是<font style="background-color:#F5D480;">在完成的样式表中根据css规范处理css</font> 让其更加有效，目前最常做的是给css属性添加浏览器私有前缀，实现跨浏览器兼容性的问题

<h1 id="IwWyV">对line-height的理解</h1>
line-height指一行文本的高度，包含了字间距，实际上是下一行基线到上一行基线的距离，

如果一个标签没有定义height 那么最终表现高度由line-height决定

一个容器没有设置高度，那么撑开容器高度的是line-height 而不是容器内的文本内容

<h1 id="aGagy">Sass Less 是什么 为什么要使用它们</h1>
都是css预处理器，是css上的一种抽象层 <font style="color:#000000;">他们是一种特殊的语法/语言编译成 CSS。 例如 Less 是一种动态样式语言，将 CSS 赋予了动态语言的特性，如变量，继承，运算， 函数，LESS 既可以在客户端上运行 (支持 IE 6+, Webkit, Firefox)，也可以在服务端运行 (借助 Node.js)</font>

**<font style="color:#000000;">为什么要使用它们？ </font>**

+ 结构清晰，便于扩展。 可以方便地屏蔽浏览器私有语法差异。封装对浏览器语法差异的重复处理， 减少无意义的机械劳动。 
+ 可以轻松实现多重继承。 完全兼容 CSS 代码，可以方便地应用到老项目中。LESS 只是在 CSS 语法上做了扩展，所以老的 CSS 代码也可以与 LESS 代码一同编译。

<h1 id="V50UE">stylus/sass/less区别</h1>
Sass, Less, 和 Stylus 是三种常用的 CSS 预处理器，它们在功能和语法上有一些区别：

+ **语法差异**：Sass 使用类似 Ruby 的缩进语法，而 Less 和 Stylus 使用类似 CSS 的语法。Sass 使用严格的缩进表示层次与嵌套关系，而 Less 和 Stylus 可以使用大括号 `<font style="background-color:rgb(249, 241, 219);">{}</font>` 表示层次和嵌套关系。
+ **变量**：Sass、Less 和 Stylus 都支持变量，用于存储和复用值。在 Sass 和 Less 中，变量以 `<font style="background-color:rgb(249, 241, 219);">$</font>` 符号开头，而在 Stylus 中，变量以 `<font style="background-color:rgb(249, 241, 219);">$</font>` 或者 `<font style="color:#DF2A3F;background-color:rgb(249, 241, 219);">@</font>` 符号开头。
+ **混合**：混合（Mixins）允许将一组 CSS 规则集合存储为一个可重用的样式块。Sass 和 Less 使用 `<font style="background-color:rgb(249, 241, 219);">@mixin</font>` 定义混合，而 Stylus 使用 `<font style="background-color:rgb(249, 241, 219);">mixin</font>` 关键字定义混合。
+ **嵌套**：Sass、Less 和 Stylus 都支持嵌套规则，可以在父级规则内部定义子级规则。Sass 使用缩进表示嵌套关系，Less 和 Stylus 使用大括号 `<font style="background-color:rgb(249, 241, 219);">{}</font>` 表示嵌套关系。
+ **继承**：继承（Inheritance）允许一个选择器继承另一个选择器的样式。在 Sass 中，使用 `<font style="background-color:rgb(249, 241, 219);">@extend</font>` 实现继承，而在 Less 和 Stylus 中，使用 `<font style="background-color:rgb(249, 241, 219);">&</font>` 符号实现继承。
+ **颜色混合**：颜色混合（Color blending）允许将两个颜色混合生成一个新的颜色。Sass 使用 `<font style="background-color:rgb(249, 241, 219);">mix()</font>` 函数实现颜色混合，Less 使用 `<font style="background-color:rgb(249, 241, 219);">blend()</font>` 函数，而 Stylus 使用 `<font style="background-color:rgb(249, 241, 219);">mix()</font>` 函数。
+ **环境和工具支持**：Sass 是基于 Ruby 的，需要安装 `<font style="background-color:rgb(249, 241, 219);">Ruby</font>` 环境来编译，而 Less 和 `<font style="background-color:rgb(249, 241, 219);">Stylus</font>` 可以通过 Node.js 的 NPM 安装相应的库来编译。

总的来说，`<font style="background-color:rgb(249, 241, 219);">Sass</font>`、`<font style="background-color:rgb(249, 241, 219);">Less</font>` 和 `<font style="background-color:rgb(249, 241, 219);">Stylus</font>` 在功能上大致相似，它们都提供了类似的特性，如变量、混合、嵌套、继承等，但在语法和一些细节上有一些差异。选择哪种预处理器取决于个人偏好、团队需求和项目要求



<h1 id="oVMaB">对媒体查询的理解</h1>
<font style="color:#000000;">媒体查询由⼀个可选的媒体类型和零个或多个使⽤媒体功能的限制了样式表范围的表达式组成，例如宽度、高度和颜色。媒体查询，添加自CSS3，允许内容的呈现针对⼀个特定范围的输出设备而进行裁剪，而不必改变内容本身，适合web网页应对不同型号的设备而做出对应的响应适配。 </font>

<font style="color:#000000;">媒体查询包含⼀个可选的媒体类型和满⾜CSS3规范的条件下，包含零个或多个表达式，这些表达式描述了媒体特征，最终会被解析为true或false。如果媒体查询中指定的媒体类型匹配展示⽂档所使⽤的设备类型，并且所有的表达式的值都是true，那么该媒体查询的结果为true。那么媒体查询内的样式将会⽣效。 </font>

<font style="color:#000000;">简单来说，</font><font style="color:#000000;background-color:#F9EFCD;">使用 @media 查询，可以针对不同的媒体类型定义不同的样式。@media 可以针对不同的屏幕尺寸设置不同的样式，特别是需要设置设计响应式的页面</font><font style="color:#000000;">，@media 是非常有用的。当重置浏览器大小的过程中，页面也会根据浏览器的宽度和高度重新渲染页面。</font>

<h1 id="DFsmA"><font style="color:#000000;">单行，多行文本溢出隐藏</font></h1>
单行

```css
overflow:hidden; //溢出隐藏
text-overflow:ellipsis;//溢出用省略号显示
white-space:nowrap;//文本不换行
```

多行

```css
overflow:hidden;// 溢出隐藏
text-overflow:ellipsis;//溢出用省略号显示
display:-webkit-box;  //作为弹性伸缩盒模型
-webkit-box-orient:vertical; //垂直
-webkit-line-camp:3; //显示的行数
```



<h1 id="h66PL">z-index属性在什么情况下会失效</h1>
+ 父元素position为relative，且设z-index，子元素的z-index失效。解决：父元素position改为absolute或static；
+ 元素没有设置position属性为非static属性。解决：设置该元素的position属性为relative，absolute或是fixed中的一种；
+ 元素在设置z-index的同时还设置了float浮动。解决：float去除，改为display：inline-block；





<h1 id="mMb2n">---------考查少---------</h1>
<h1 id="uWDFN">li与li之间有看不见的空白间隔是什么原因引起的，如何解决？</h1>
浏览器会把inline内联元素间的空白字符（空格、换行、Tab等）渲染成一个空格。为了美观，通常是一个`<li>`放在一行，这导致`<li>`换行后产生换行字符，它变成一个空格，占用了一个字符的宽度。



**解决办法：**

（1）为`<li>`设置float:left。不足：有些容器是不能设置浮动，如左右切换的焦点图等。

（2）将所有`<li>`写在同一行。不足：代码不美观。

（3）将`<ul>`内的字符尺寸直接设为0，即font-size:0。不足：`<ul>`中的其他字符尺寸也被设为0，需要额外重新设定其他字符尺寸，且在Safari浏览器依然会出现空白间隔。

（4）消除`<ul>`的字符间隔letter-spacing:-8px，不足：这也设置了`<li>`内的字符间隔，因此需要将`<li>`内的字符间隔设为默认letter-spacing:normal。



<h1 id="Ep4Lx">可替换元素</h1>
<font style="color:rgb(43, 43, 43);">可替换元素（replaced element），是外观渲染独立于 CSS 的一种外部对象，它们的展示效果不是由 CSS 控制的，而是其内部内容控制的。 例如典型的可替换元素 img，它内容色彩等并不由 css 控制，而是 img 的 src 带来的内容。</font>

<font style="color:rgb(43, 43, 43);"></font>

<h1 id="FdXLP"><font style="color:rgb(43, 43, 43);">transition和animation的区别</font></h1>
Transition是过渡属性，强调过渡，它的实现需要一个触发事件（比如点击，焦点）才执行动画，它类似于flash的补间动画，设置一个开始关键帧，一个结束关键帧

animation是动画属性，它的实现不需要触发事件，设定好时间之后可以自己执行，且可以循环一个动画，它也类似于flash的补间动画，但是它可以设置多个关键帧（用@keyframe定义）完成动画。

<h1 id="zDcUH">什么是物理像素，逻辑像素和像素密度，为什么在移动端开发时需要用到@3x 和@2x</h1>






<h1 id="xK50c">如何判断元素是否到达可视区域</h1>
以图片显示为例：

+ `window.innerHeight` 是浏览器可视区的高度；
+ `document.body.scrollTop || document.documentElement.scrollTop` 是浏览器滚动的过的距离；
+ `imgs.offsetTop` 是元素顶部距离文档顶部的高度（包括滚动条的距离）；
+ 内容达到显示区域的：`img.offsetTop < window.innerHeight + document.body.scrollTop;`

![](https://i-blog.csdnimg.cn/img_convert/d6d1aeffd1ac7b33f926d96e96caf2eb.png)


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/148239887)

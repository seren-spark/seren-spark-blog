---
title: "jQuery 的一些小操作以及遇到的问题"
description: "记录 jQuery 在事件、DOM 操作和评论交互中的一些实践。"
type: journal
occurredAt: 2024-05-12
publishedAt: 2024-05-12
tags:
  - 前端
sourceUrl: https://blog.csdn.net/HBR666_/article/details/138758297
sourceName: CSDN
relatedDocs: []
---

#  写页面时遇到的一些问题
## 1.评论
###  1）点赞等
在写二级评论时，如果二级评论较多，则应该改为弹窗样式
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c0cd09dd0b70cee2f8cc630ca97c4ea8.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0961bb967bcac527419af54d6b2b0a5b.png)
那么会容易遇到一个bug，如果在弹窗中删除评论，或者取消点赞，弹窗关闭时，页面上的点赞量和评论的展示应该也随之改变，最简单粗暴的方式就是取消弹窗后重新获取文章的id，渲染评论的页面
###  2.删除
当删除二级评论时，需要通过删除按钮获取祖先元素中的整个二级评论，这里需要用到jq的方法
当删除一级评论时，需要删除该评论以及该评论下的所有二级
###  3.添加
当回复二级评论时，需要将自己的评论放在最开头的地方，这里可以用js的拼接，也可以用jq的prepend 方法

发布评论的同时，还需要利用函数判断该评论是不是自己的
##  2.一些小点
display：none只是改变了元素在html上的展现方式，用DOM获取的时候还是可以获取到的
因此在for循环遍历进行一些操作时，不能忽略这些元素的影响
由于js是单线程的，当有多个函数在同级进行调用时，如果前一个函数出错，那么下一个函数也不会执行，不能想当然的认为函数会异步执行；
#  JQ获取父节点，兄弟节点
##  获取节点

```javascript
    $("#test1").parent(); // 父节点
    $("#test1").parents(); // 全部父节点
    $("#test1").parents(".mui-content");
    $("#test").children(); // 全部子节点
    $("#test").children("#test1");
    $("#test").contents(); // 返回#test里面的所有内容，包括节点和文本
    $("#test").contents("#test1");
    $("#test1").prev();  // 上一个兄弟节点
    $("#test1").prevAll(); // 之前所有兄弟节点
    $("#test1").next(); // 下一个兄弟节点
    $("#test1").nextAll(); // 之后所有兄弟节点
    $("#test1").siblings(); // 所有兄弟节点
    $("#test1").siblings("#test2");
    $("#test").find("#test1");


```
##  元素筛选

```javascript
// 以下方法都返回一个新的jQuery对象，他们包含筛选到的元素
    $("ul li").eq(1); // 选取ul li中匹配的索引顺序为1的元素(也就是第2个li元素)
    $("ul li").first(); // 选取ul li中匹配的第一个元素
    $("ul li").last(); // 选取ul li中匹配的最后一个元素
    $("ul li").slice(1, 4); // 选取第2 ~ 4个元素
    $("ul li").filter(":even"); // 选取ul li中所有奇数顺序的元素

```


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/138758297)

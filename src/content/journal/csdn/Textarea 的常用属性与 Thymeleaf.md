---
title: "Textarea 的常用属性与 Thymeleaf"
description: "整理 textarea 常用属性，以及它在 Thymeleaf 模板中的使用方式。"
type: journal
occurredAt: 2024-04-14
publishedAt: 2024-04-14
tags:
  - Java
sourceUrl: https://blog.csdn.net/HBR666_/article/details/137737928
sourceName: CSDN
relatedDocs: []
---

> 本文由 Seren Spark 从个人 CSDN 博客迁移，保留原始发布日期；正文内容会优先从公开页面同步。

# textarea
>-webkit-scrollbar：width：0；让滚动条隐藏，宽度为0
>resize：none   禁止textarea可以手动拉伸，
>overflow-y：visible   长度伸展可视

```css
.reply-text {
overflow-y: visible;
&::-webkit-scrollbar {
width: 0;
}
resize: none;
outline: none;
font-size: 20px;
border-radius: 5px;
border: 1.2px solid #f26026;
width: 100%;
min-height: 80px;
margin-bottom: 10px;
}
```

>通过监听input，实时判断是否有内容输入，若无内容输入，则按钮禁点

>this.style.height = "inherit";
  this.style.height = `${this.scrollHeight}px`让文本框长度随输入内容的长度改变而改变

```javascript
textarea.addEventListener("input", function (e) {
if (textarea.value == "") {
replyBtn.setAttribute("disabled", true);
replyBtn.classList.add("disable");
} else {
replyBtn.removeAttribute("disabled");
replyBtn.classList.remove("disable");
}
this.style.height = "inherit";
this.style.height = `${this.scrollHeight}px`;
});
```

>限制输入字数
```javascript
textarea.onkeyup = function () {
  let ddl = document.querySelector(".ddl");
  let str = textarea.value;

  ddl.innerHTML = `还可输入${100 - textarea.value.length}字`;
  if (textarea.value.length >= 100) {
    ddl.innerHTML = "还可输入0字";
    textarea.value = textarea.value.substr(0, 100);
  }
};
```
#  thymeleaf
##  1.基础使用
- th:text ：设置当前元素的文本内容，相同功能的还有th:utext，两者的区别在于前者不会转义html标签，后者会。优先级不高：order=7
- th:value：设置当前元素的value值，类 似修改指定属性的还有th:src，th:href。优先级不高：order=6
- th:each：遍历循环元素，和th:text或th:value一起使用。注意该属性修饰的标签位置，详细往后看。优先级很高：order=2
- th:if：条件判断，类似的还有th:unless，th:switch，th:case。优先级较高：order=3
- th:insert：代码块引入，类似的还有th:replace，th:include，三者的区别较大，若使用不恰当会破坏html结构，常用于公共代码块提取的场景。优先级最高：order=1
- th:fragment：定义代码块，方便被th:insert引用。优先级最低：order=8
- th:object：声明变量，一般和*一起配合使用，达到偷懒的效果。优先级一般：order=4
- th:attr：修改任意属性，实际开发中用的较少，因为有丰富的其他th属性帮忙，类似的还有th:attrappend，th:attrprepend。优先级一般：order=5
  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f474b2df4f4a6033757671180705fc29.png)

用 | | 进行字符串的拼接 类似于es6 中的反引号
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/19902d3b38d67fe122f2169412967434.png)


```html
<!DOCTYPE html>
<!--名称空间-->
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
<meta charset="UTF-8">
<title>Thymeleaf 语法</title>
</head>
<body>
<h2>ITDragon Thymeleaf 语法</h2>
<!--th:text 设置当前元素的文本内容，常用，优先级不高-->

<p th:text="${thText}" />
<p th:utext="${thUText}" />

<!--th:value 设置当前元素的value值，常用，优先级仅比th:text高-->
<input type="text" th:value="${thValue}" />

<!--th:each 遍历列表，常用，优先级很高，仅此于代码块的插入-->
<!--th:each 修饰在div上，则div层重复出现，若只想p标签遍历，则修饰在p标签上-->
<div th:each="message : ${thEach}"> <!-- 遍历整个div-p，不推荐-->
<p th:text="${message}" />
</div>
<div> <!--只遍历p，推荐使用-->
<p th:text="${message}" th:each="message : ${thEach}" />
</div>

<!--th:if 条件判断，类似的有th:switch，th:case，优先级仅次于th:each, 其中#strings是变量表达式的内置方法-->
<p th:text="${thIf}" th:if="${not #strings.isEmpty(thIf)}"></p>

<!--th:insert 把代码块插入当前div中，优先级最高，类似的有th:replace，th:include，~{} ：代码块表达式 -->
<div th:insert="~{grammar/common::thCommon}"></div>

<!--th:object 声明变量，和*{} 一起使用-->
<div th:object="${thObject}">
<p>ID: <span th:text="*{id}" /></p><!--th:text="${thObject.id}"-->
<p>TH: <span th:text="*{thName}" /></p><!--${thObject.thName}-->
<p>DE: <span th:text="*{desc}" /></p><!--${thObject.desc}-->
</div>

</body>
</html>

```

##  2.代码块的切换

```css
<!--th:fragment定义代码块标识-->
<footer th:fragment="copy">
  &copy; 2011 The Good Thymes Virtual Grocery
</footer>

<!--三种不同的引入方式-->
<div th:insert="footer :: copy"></div>
<div th:replace="footer :: copy"></div>
<div th:include="footer :: copy"></div>

<!--th:insert是在div中插入代码块，即多了一层div-->
<div>
  <footer>
    &copy; 2011 The Good Thymes Virtual Grocery
  </footer>
</div>

<!--th:replace是将代码块代替当前div，其html结构和之前一致-->
<footer>
  &copy; 2011 The Good Thymes Virtual Grocery
</footer>

<!--th:include是将代码块footer的内容插入到div中，即少了一层footer-->
<div>
  &copy; 2011 The Good Thymes Virtual Grocery
</div>

```


##  3.链接表达式

无参：@{/xxx}
有参：@{/xxx(k1=v1,k2=v2)} 对应url结构：xxx?k1=v1&k2=v2
引入本地资源：@{/项目本地的资源路径}
引入外部资源：@{/webjars/资源在jar包中的路径}



```html
<link th:href="@{/webjars/bootstrap/4.0.0/css/bootstrap.css}" rel="stylesheet">
<link th:href="@{/main/css/itdragon.css}" rel="stylesheet">
<form class="form-login" th:action="@{/user/login}" th:method="post" >
<a class="btn btn-sm" th:href="@{/login.html(l='zh_CN')}">中文</a>
<a class="btn btn-sm" th:href="@{/login.html(l='en_US')}">English</a>

```


###  1）范例
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/bd283c38630b6dfa7996cfc5564c7941.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d73e978d5cda238d16fd7582a4ceeba9.png)
注意@{/。。。}大括号里边要用 / 开头表示根目录，不然渲染不到

##  4.前后端
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/87b491b25380968c1e3acb7f344cae45.png)
通过th:object 可直接引用变量

```html
<!--原始  -->
<h2 th:text="${user.username}"></h2>
<p th:text="${user.age}"></p>
<!-- 代码优化 -->
<div th:object="${user}">
  <h2 th:text="*{username}"></h2>
   <p th:text="*{age}"></p>
</div>
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/cd228de2ac33c06fff274a4c26053d0c.png)
若语句为true，则会显示标签中的内容“会员”


##  5.遍历
###  1.th:each
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1e2382d1133228a290b3fca55b1fc824.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0bbf2b8b07c7f6b744cb827c555c9b7d.png)
### 2.th:switch
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7742268f5d835262b17b1516114444f5.png)
### 3.添加属性
追加一个active属性
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8d85366e87d8e871886cd425d56fef4e.png)
给最后一个元素追加属性（stat是自定义名字）
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ba6641c8109a558399aa7ca011533bfd.png)
## 组件替换
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2bbd3c42d5cc43f17034d29567b01d45.png)


![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9228d770a4bd1608b16dbe0b3cfa71c8.png)
也可以直接使用id不用th：fragment
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7108aaf132e4ad80c2276324fc50880b.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1eadc6b98a1856cf6de7c7a2f72cbcf5.png)

# 每周总结
项目写的好累，头懵的快炸了

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/137737928)

---
title: "事件委托、call、apply、bind 用法"
description: "整理事件冒泡、事件委托以及 call、apply、bind 的使用场景。"
type: journal
occurredAt: 2024-05-19
publishedAt: 2024-05-19
tags:
  - JavaScript
sourceUrl: https://blog.csdn.net/HBR666_/article/details/139039128
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/blog_migrate/baf495acf4c08d83835877cff62bde55.png
---

# call apply bind

## 1.用法

### 1)call

用法

```javascript
fn.call(thisArg, arg1, arg2, arg3, ...)
```

call方法会改变this指向，指向第一个参数thisArg，将后面的参数传入给fn,并立即执行函数fn。

```javascript
let obj = {
  name: "xiaoming",
  age: 24,
  sayHello: function (job, hobby) {
    console.log(
      `我叫${this.name},今年${this.age}岁。我的工作是: ${job}，我的爱好是: ${hobby}。`,
    );
  },
};
obj.sayHello("程序员", "看美女"); // 我叫xiaoming,今年24岁。我的工作是: 程序员，我的爱好是: 看美女。

let obj1 = {
  name: "lihua",
  age: 30,
};
// obj1.sayHello(); // Uncaught TypeError: obj1.sayHello is not a function
obj.sayHello.call(obj1, "设计师", "画画"); // 我叫lihua,今年30岁。我的工作是: 设计师，我的爱好是: 画画。
```

上面的代码中，我们obj1对象也想使用obj对象中的sayHello方法；我们就可以使用call方法调用obj.sayHello, 并将obj.sayHello中的this修改为obj1，把 ‘设计师’, ‘画画’ 这两个参数出给obj.sayHello。

### 2)apply

```javascript
apply(thisArg, [argsArr]);
```

fn.apply作用和call相同，改变this指向并立即执行fn，区别在于传参不同，apply传两个参数，第一个参数指向this指向，第二个参数是一个数组，数组元素会被展开传入fn，作为fn的参数

```javascript
let obj = {
  name: "xiaoming",
  age: 24,
  sayHello: function (job, hobby) {
    console.log(
      `我叫${this.name},今年${this.age}岁。我的工作是: ${job}，我的爱好是: ${hobby}。`,
    );
  },
};
obj.sayHello("程序员", "看美女"); // 我叫xiaoming,今年24岁。我的工作是: 程序员，我的爱好是: 看美女。

let obj1 = {
  name: "lihua",
  age: 30,
};

obj.sayHello.apply(obj1, ["设计师", "画画"]); // 我叫lihua,今年30岁。我的工作是: 设计师，我的爱好是: 画画。
```

### 3)bind

```javascript
bind(thisArg, arg1, arg2, arg3, ...)
```

fn.bind的作用是只修改this指向，但不会立即执行fn；会返回一个修改了this指向后的fn。需要调用才会执行:bind(thisArg, arg1, arg2, arg3, ...)()。bind的传参和call相同。

```javascript
let obj = {
  name: "xiaoming",
  age: 24,
  sayHello: function (job, hobby) {
    console.log(
      `我叫${this.name},今年${this.age}岁。我的工作是: ${job}，我的爱好是: ${hobby}。`,
    );
  },
};
// obj.sayHello('程序员', '看美女'); // 我叫xiaoming,今年24岁。我的工作是: 程序员，我的爱好是: 看美女。

let obj1 = {
  name: "lihua",
  age: 30,
};

obj.sayHello.bind(obj1, "设计师", "画画"); // 无输出结果
obj.sayHello.bind(obj1, "设计师", "画画")(); // 我叫lihua,今年30岁。我的工作是: 设计师，我的爱好是: 画画。
```

## 2.区别

### 1）相同点

三个都是用于改变this指向；
接收的第一个参数都是this要指向的对象；
都可以利用后续参数传参。

### 2）不同点

call和bind传参相同，多个参数依次传入的；
apply只有两个参数，第二个参数为数组；
call和apply都是对函数进行直接调用，而bind方法不会立即调用函数，而是返回一个修改this后的函数

# 事件委托

## 简介

> 利用 JS 事件冒泡动态为元素绑定事件的方法称为事件委托（也称为“事件代理”）。
> 事件委托就是把原本需要绑定在子元素上的事件（onclick、onkeydown 等）委托给它的父元素，让父元素来监听子元素的冒泡事件，并在子元素发生事件冒泡时找到这个子元素。

好处

> 在 JavaScript 中，页面内事件处理程序的个数会直接影响页面的整体性能，因为每个事件处理程序都是对象，对象会占用内存，内存中的对象越多，页面的性能则越差。此外，事件处理程序需要与 DOM 节点进行交互，访问 DOM 的次数越多，引起浏览器重绘和重排的次数也就越多，从而影响页面的性能。

使用for循环会导致浏览器缓存过多，使用事件委托可以解决这个问题

html

```javascript
<ul id="myLinks">
  <li id="goSomewhere">Go somewhere</li>
  <li id="doSomething">Do something</li>
  <li id="sayHi">Say hi</li>
</ul>
```

js

```javascript
var item1 = document.getElementById("goSomewhere");
var item2 = document.getElementById("doSomething");
var item3 = document.getElementById("sayHi");

document.addEventListener("click", function (event) {
  var target = event.target;
  switch (target.id) {
    case "doSomething":
      document.title = "事件委托";
      break;
    case "goSomewhere":
      location.href = "http://www.baidu.com";
      break;
    case "sayHi":
      alert("hi");
      break;
  }
});
```

## 1.冒泡与捕获

冒泡：由子到父
捕获：由父到子

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/baf495acf4c08d83835877cff62bde55.png)
三个盒子的顺序是d1 d2 d3

### 1）冒泡

如果点击d1，则控制台只会报d1
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/da390affca03b349fb98d763d0b3e43a.png)
如果点击d2
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c9c57b7a46488b6273b9e61c70515ca8.png)

### 2）捕获

在捕获事件触发的前提，我们需要使用事件监听 document.addEventListener('event',funciton(){},true)

> **这里的true是布尔值判断是否为捕获事件，当为true时，这里为捕获事件，如果为false时，这里就是冒泡事件。**

用代码给大家解释一下：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b4e727b356b2416ba6cea5854a77e857.png)
当我们点击d1时，打印d1.但是当我们点击d3时，打印结果依次为d1 d2 d3

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6b6bcbfea3e7a2328a26f744cc885e39.png)

结果由父级传递向子级，这个过程称为捕获事件。
e.stoppropagation()阻止冒泡

# onclick和addEventListener的区别

## 1.为一个按钮绑定多个点击事件

### 1）使用onclick（不行）

```javascript
    <button id="btn">点击</button>
    <script>
        btn.onclick = function(){
            console.log('第一次点击');
        }
        btn.onclick = function(){
            console.log('第二次点击');
        }
    </script>
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/aaada97e1e14f8ef088ddd5be2d86578.png)

### 2)addEventListener

```javascript
  <button id="btn">点击</button>
    <script>
        btn.addEventListener('click',()=>{console.log('第一次点击');},false);
        btn.addEventListener('click',()=>{console.log('第二次点击'),false});
    </script>
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/09fe75b1e340a144bd09561b0ef9a4d8.png)

## 2.决定触发顺序

### 1）使用冒泡

```javascript
  <div id="div1">
        <button id="btn">点击</button>
    </div>
    <script>
        div1.onclick = function(){
            console.log('div1的事件');
        }
        btn.onclick = function(){
            console.log('btn的事件');
        }
    </script>
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/af250b38bcdafe8a1622716cc5ef73f8.png)

### 2） 使用捕获

```javascript
   <div id="div1">
        <button id="btn">点击</button>
    </div>
    <script>
        btn.onclick = function(){
            console.log('btn的事件');
        }
        div1.addEventListener('click',()=>{console.log('div1的事件');},true);
    </script>
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/aa760e1c2c3153742615b32ad3785070.png)

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/139039128)

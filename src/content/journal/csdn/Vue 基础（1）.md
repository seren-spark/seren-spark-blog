---
title: "Vue 基础（1）"
description: "从数据代理和计算属性开始，重新梳理 Vue 的基础响应式概念。"
type: journal
occurredAt: 2024-09-29
publishedAt: 2024-09-29
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/142639364
sourceName: CSDN
relatedDocs: []
---

# 是什么
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fc64f7ba141343f8860c8a24cfc489ee.png)

# 特点
1.采用组件化模式 提高代码复用率 且让代码更好维护
2.声明式代码，让编码人员无需直接操作DOM，提高开发率
3.使用虚拟DOM+优秀的Diff算法 尽量复用DOM节点

初识vue

> 1.想让vue工作 必须创建一个vue实例 且要传入一个配置对象
> 2.root容器里的代码依然符合html规范 只不过混入了一些特殊的vue语法
> 3.root容器里的代码被称作【Vue模板】
> 4.双括号里写js表达式
> 5.Vue实例和容器是一一对应的
> 6.真实开发中只有一个vue实例 并且会配合着组件一起使用：
> 7.{{xxx}}中的xxx要写js表达式 且xxx可以自动读取到data中的所有属性 
> 8.一旦data中的数据发生改变 那么页面中用到该数据的地方也会自动更新
> 
> 注意区分 js表达式和js代码（语句）
>   1.表达式:一个表达式会产生一个值，可以放在任何一个需要值的地方：
>                   (1). a
>                   (2). a+b
>                   (3). demo（1）
>                   (4). x===y?'a':'b'
>    2.js代码（语句）
>                   (1). if等判断语句
>                   (2). for等循环语句

```go
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script type="text/javascript" src="../js/vue.js"></script>
  </head>
  <body>
    <!-- 准备好一个容器 -->
    <div id="root">
      <h1>Hello {{name}}</h1>
    </div>
    <script type="text/javascript">
      // 创建vue实例
      const x = new Vue({
        el: "#root", //用于指定当前vue实例为哪个容器服务 ，值通常 为css选择器字符串
        data: {
          //data用于存储数据 数据供el所指定的容器去使用，值我们暂且先写成一个对象
          name: "Bro",
        },
      });
      //也可写作
      new Vue({
        el: "#root", //用于指定当前vue实例为哪个容器服务 ，值通常 为css选择器字符串
        data: {
          //data用于存储数据 数据供el所指定的容器去使用，值我们暂且先写成一个对象
          name: "Bro",
        },
      });
    </script>
  </body>
</html>
```

# 模板语法

>  插值语法
>     功能:用于解析标签体内容
>     写法：{{xxx}}  xxx是js表达式 且可以直接读取到data中的所有属性 指令语法：
>     功能:用于解析标签（包括标签属性、标签体内容、绑定事件.....）.
>     举例：v-bind：href=“xxx”或简写为：href="xxx"   
>               xxx同样要写js表达式 且可以直接读取到data中的所有属性 
>     备注:Vue中有很多的指令，且形式都是v-？？？

## 1.插值语法
插值语法 ({{ }}): 在Vue中用于在HTML模板中显示绑定的数据。例如 {{ name }} 将会显示变量 name 的值。
{{ }}   
三所用语法就是插值语法
## 2.指令语法
指令语法 (v-xxx): Vue提供的特殊属性，以v-前缀开始，用于操作DOM。例如 v-bind:href="url" 可以用来动态绑定href属性到变量url的值。

```go
<h1>指令语法</h1>
  <a v-bind:href="url">点我去硅谷</a>//url 为一个js表达式，是一个变量


  new Vue({
        el: ".root", //用于指定当前vue实例为哪个容器服务 ，值通常 为css选择器字符串
        data: {
          //data用于存储数据 数据供el所指定的容器去使用，值我们暂且先写成一个对象
          name: "Bro",
          url: "http://www.atguigu.com",
        },
      });
```

# 数据绑定
Vue中有两种数据绑定的方式：
1.单向绑定（v-bind）：数据只能从data流向页面
2.双向绑定（v-model）：数据不仅能从data流向页面 还可以从页面流向data
  备注
      1.双向绑定一般用在表单元素上（如input，单选框 双选框 select框）
       2.v-model：value 可简写为v-model  因为 v-model默认收集的就是value值
    <!-- 普通写法 -->
    <!-- <div class="root">
      单向数据绑定：<input type="text" v-bind:value="name" /><br />
      双向数据绑定：<input type="text" v-model:value="name" />
    </div> -->
    <!-- 简写 -->
    <div class="root">
      单向数据绑定：<input type="text" :value="name" /><br />
      双向数据绑定：<input type="text" v-model="name" />
    </div>
    <!-- 如下代码是错误的，因为v-model只能应用在表单类元素 -->
    <h2 v-model:x="name"></h2>
# el与data的两种写法

注意：由Vue管理的函数一定不要写箭头函数 一旦写了箭头函数 this就不再是Vue实例了
## 1.el的两种写法
(1).    new Vue 时候配置el属性
(2).  先创建Vue实例 随后再通过vm.$mount{'#root}指定el的值
const v = new Vue({
  data: {
    // el: ".root",第一种写法
    name: "Bro",
    url: "http://www.atguigu.com",
  },
});

v.$mount(".root"); //第二种写法
## 2.data的两种写法
(1).  对象式
(2).  函数式
如何选择:目前哪种写法都可以 以后学习到组件时 data必须使用函数式 否则会报错

```go
new Vue({
  el: ".root",
  // data的第一种写法：对象式
  data: {
    name: "Bro",
    url: "http://www.atguigu.com",
  },
  // data的第二种写法 函数式
   // 简写 data(){...}
  data: function () {
    console.log(this); //此处的this是vue实例对象 如果写成箭头函数 this是window
    return {
      name: "111",
    };
  },
});
```

# MVVM模型
data中所有的属性 最后都出现在了vm身上
vm身上的所有属性 及Vue原型上的所有属性 在Vue模板中都可以直接使用


# 数据代理
### 1.回顾Object.defineproperty方法

```go

```go
let person = {
        name: "张三",
        sex: "男",
      };
// 注意 用Object添加的属性是不可枚举（遍历）的且值不可改变
      Object.defineProperty(person, "age", {
        value: 18,
        enumerable: true,//控制属性是否可枚举，默认值是false
        writable: true,//控制属性是否可以被修改，默认值是false
        configurable: true, //控制属性是否可以被删除 默认值是false
      });
      console.log(person);
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d58b0184f60a4ddf987ab84b345d8eda.png)


 

```go
let number = 18;
      let person = {
        name: "张三",
        sex: "男",
        //age:number
      };
      Object.defineProperty(person, "age", {
        // value: 18,
        // enumerable: true,
        // writable: true,
        // configurable: true,
        // 当有人读取person的age属性时 get(getter)函数就执行且返回值就是age的值
        get: function () {
          return number;
        },
        // 当有人修改person的age属性时，set（setter）函数就会被调用 且会收到修改的具体值
        set(value){
          console.log("有人修改了age属性，且值是：",value)
          number=value;
          
        }

      });
      console.log(person);
```


> 如果在对象里直接使用number,要想改变age的值 要进行以下操作 number =19; person.age=number
> 若想让age随着number的改变变成实时可变的 （即不写person.age=number）要使用get方法
> 如果要设置get和set，不能同时设置value和writable，但是可以设置enumerable和configurable
> 
> age的内容是以省略号形式出现的（因为使用的set get方法）
> 2.数据代理的理解 通过一个对象代理对另一个对象的属性的操作（读/写） 如果直接更改obj2中的x obj中的x也会更改 即通过一个对象（obj2）对另一个对象obj的属性（x）的操作
> 
> 3.Vue中的数据代理
> 1.Vue中的数据代理：    通过vm对象来代理data对象中的属性的操作（读/写）
> 2.Vue中的数据代理的好处：    更加方便的操作data中的数据
> 3.基本原理   通过Object.defineproperty()把data对象中的属性添加到vm上   为每一个添加到vm上的属性，都指定一个getter setter方法   在getter
> setter内部去操作（读/写）data中的对应的属性




# 事件处理
## 1.事件的基本使用
    使用v-on：xxx 或者 @xxx绑定事件 其中xxx是事件名
    事件的回调需要配置在methods对象中 最终会在vm上
    methods中配置的函数 不要用箭头函数 否则this就不是vm了
    methods 中配置的函数 都是被Vue所管理的函数 this的指向是vm或者组件实例对象
    @click="demo"  和@click="demo($event)" 效果一致但后者可以传参
注意：由于传参的时候Event会传不进去  所以可以用$event 去占位，来达到传参的效果 但是Event是一直存在的哪怕没有传参

## 2.事件修饰符
.stop: 调用 event.stopPropagation()，阻止事件冒泡（常用）
.prevent: 调用 event.preventDefault()，阻止默认事件（常用）。
.once: 触发一次后自动删除该事件处理器 （常用）
.capture: 使用捕获模式添加事件监听器。
.self: 只有event.target是当前操作的元素时才触发事件
.passive: 事件的默认行为立即执行 无需等待事件回调执行完毕
    正常情况下是先执行函数中东西然后再执行默认行为 
     如果此时有个及其耗时的循环语句  则默认行为不会立即触发 会等待循环完毕之后执行

## 3.键盘事件
1.Vue中常用的按键别名
  
注意：如果按键名是两个词组成，如CapsLock  则需要写成.caps-lock

2.Vue中未提供别名的按键可以使用按键原始的key值去绑定 但要注意转为keybab-case
3.系统修饰键（用法特殊）：ctrl alt  shift  win
    （1）配合keyup使用：按下修饰键的同时 再按 下其他键 随后释放其他键 事件才被触发
    （2）配合keydown使用 正常触发事件
      @keyup.ctrl.y  意思是按着ctrl+y才会执行函数
4.也可以使用keyCode去指定具体的按键（不推荐）
5.Vue.config.keyCodes.自定义键名=键码，可以去定制按键别名
#  计算属性

v-model可以进行双向数据绑定，当检测到数据有所改变时，会引起整个绿色模版重新解析，解析到插值语法时，浏览器无法判断是否真的改变，会重新解析一次，即重新调用一次fullname方法

函数每次渲染都会被调用并重新计算，但是计算属性是带有缓存的，只有在相关属性值变动的时候才会重新计算

## 1.计算属性
对于vue来说 data中的东西就是属性
vm._data 中不会有计算属性的东西

```go
 <div id="root">
      姓：<input type="text" v-model="firstName" /><br />
      名:<input type="text" v-model="lastName" /><br />
      姓名：<span>{{fullName}}</span>
    </div>
    <script type="text/javascript">
      new Vue({
        el: "#root",
        data: {
          firstName: "张",
          lastName: "三",
        },
        computed: {
          fullName: {
            // get有什么作用?当有人读取fullName时，get就会被调用，且返回值就作为fullname的值
            // get什么时候调用?：1.初次读取fullName时 2.当fullName依赖的数据发生变化时
            get() {
              return this.firstName + "-" + this.lastName;
            },

            // set什么时候调用? 当fullName被修改时
            set(value) {
              const arr = value.split("-");
              this.firstName = arr[0];
              this.lastName = arr[1];
            },
          },
        },
      });
```

> 过程理解：当直接修改fullName时，set方法被调用 ， firstName和lastName会修改
> 当发现被修改时，页面中用到两者的地方会自动更新，而计算属性是依赖着data中的来改变的，则会再次调用fullName，调用get方法，达到页面中插值fullName修改的效果
> 1.定义：要用的属性不存在，要通过已有属性计算得来
> 2.原理：底层借助了Object.defineproperty 方法提供的getter和setter
>              直接暴露在vm中
> 3.get函数什么时候执行？    (1). 初次读取时会执行一次  （2). 当依赖的数据发生改变时会再次调用
> 4.优势：与methods相比 ，computed内部有缓存机制（复用），效率更高，调试方便
> 5.备注：
>     计算属性最终会出现在vm上，直接读取使用即可
>     如果计算属性要被修改 那必须写set函数去响应修改，且set中要引起计算时依赖的数据发生

## 2.计算属性简写
一般计算属性是不会被修改的，也就是说set方法不会被调用，即可省略
插值语法中不带括号
   原因：表面上是个函数，但是实际上是将函数执行完之后在vm上放了个fullName属性，值是函数调用的结果

```go
 <div id="root">
      姓：<input type="text" v-model="firstName" /><br />
      名:<input type="text" v-model="lastName" /><br />
      姓名：<span>{{fullName}}</span>
    </div>
    <script type="text/javascript">
      const vm = new Vue({
        el: "#root",
        data: {
          firstName: "张",
          lastName: "三",
        },

        computed: {
          // 简写
          fullName() {
            return this.firstName + "-" + this.lastName;
          },
        },
      });
    </script>
```

# 监视属性

> 当被监视的属性变化时，回调函数会自动调用，进行相关操作 监视的属性（计算属性也算属性）必须存在，才能进行监视 监视的两种写法：
>     new Vue时传入watch配置
>     通过vm.$watch监视

第一种写法

```go
<div id="root">
      <h2>今天天气很{{info}}</h2>
      <button @click="this.alert(this)">切换天气</button>
    </div>
    <script type="text/javascript">
      const vm = new Vue({
        el: "#root",
        data: {
          isHot: true,
        },
        computed: {
          // 简写
          info() {
            return this.isHot ? "很热" : "很冷";
          },
        },
        methods: {
          changeWhether() {
            this.isHot = !this.isHot;
          },
        },
        watch: {
          isHot: {
            // handler什么时候调用？ 当isHot发生变化时
            handler(newValue, oldValue) {
              console.log(newValue, oldValue);
            },
            immediate: true,//初始化时让handler调用一下
          },
        },
      });
    </script>
```

第二种写法
错误写法
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/15add20ae3cd47b69fb79ac4cf37bd1f.png)

为什么watch中这样写不会错？
因为原始写法就是‘ isHot’，只是由于习惯，引号不写了

```go
<div id="root">
      <h2>今天天气很{{info}}</h2>
      <button @click="this.alert(this)">切换天气</button>
    </div>
    <script type="text/javascript">
      const vm = new Vue({
        el: "#root",
        data: {
          isHot: true,
        },
        computed: {
          // 简写
          info() {
            return this.isHot ? "很热" : "很冷";
          },
        },
        methods: {
          changeWhether() {
            this.isHot = !this.isHot;
          },
        },
      });

// 正确写法
      vm.$watch("isHot",{
            // handler什么时候调用？ 当isHot发生变化时
            handler(newValue, oldValue) {
              console.log(newValue, oldValue);
            },
            immediate: true,//初始化时让handler调用一下
          },);
    </script>
```

## 1.深度监视

> 深度监视：
>       vue中的watch默认不监测对象内部值的改变（一层）。
>       配置deep：true可以监测对象内部值改变（多层） 备注:
>       Vue自身可以监测对象内部值的改变，但Vue提供的watch默认不可以 要想行，写deep：true
>      使用watch时根据数据的具体结构，决定是否采用深度监视



```go
<div id="root">
      <h2>今天天气很{{info}}</h2>
      <button @click="this.alert(this)">切换天气</button>
      <hr />
      <h3>a的值是:{{numbers.a}}</h3>
      <button @click="numbers.a++">让a+1</button>
    </div>
    <script type="text/javascript">
      const vm = new Vue({
        el: "#root",
        data: {
          isHot: true,
          numbers: {
            a: 1,
            b: 1,
          },
        },
        watch: {
          isHot: {
            // handler什么时候调用？ 当isHot发生变化时
            handler(newValue, oldValue) {
              console.log(newValue, oldValue);
            },
            immediate: true, //初始化时让handler调用一下
          },
          //   只监视.a
          "numbers.a": {
            handler(newValue, oldValue) {
              console.log(newValue, oldValue);
            },
            immediate: true, //初始化时让handler调用一下},
          },
        },
      });
    </script>
```

如果想要监视a和b
错误写法：
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e5176104fb714ea69eb4a958d818dc8f.png)

理解：这样确实是在监视numbers，但并不会监视numbers里面的东西，监视的是numbers{....},numbers是data里的一个key，value是{....}的一个地址值
正确写法：![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/cb3ac6e4d9d94bbbaae0d58fc2c5c4f8.png)


## 2.监视的简写
简写的前提是不对immediate和deep做要求
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d4a29310fae443f992bd47759c5e962a.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5db0e47b5d994705815aeabf7806c3a0.png)


## 3.watch和computed的区别

> computed和watch之间的区别：
>   1.computed能完成的功能，watch都可以完成
>   2.watch能完成的功能，computed不一定完成，例如watch可以进行异步操作 
>   两个重要的小原则：
>   1.所被Vue管理的函数，最好写成普通函数，这样this的指向才是vm或组件实例对象
>   2.所有不被Vue管理的函数（定时器的回调函数，ajax的回调函数等，promise的回调函数），最好写成箭头函数
>      这样this的指向才是vm或组件实例对象

# 绑定样式 

> class样式: 
>             ：class="xxx"             xxx可以是字符串，对象，数组
>              字符串写法适用于：类名不确定，要动态获取 
>             对象写法适用于：要绑定多个样式，个数不确定，名字也不确定
>             数组写法适用于：绑定多个样式，个数确定，名字确定，但不确定用不用  style样式：
>             ：style=" {fontSize: xxx}"  其中xxx是动态值
>             ：style="[a,b]" 其中a，b是样式对象

## 1.绑定class样式
字符串写法
适用于：样式的类名不确定，需要动态指定
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/170cc44978614f55b10d64f2f09950c5.png)

数组写法
适用于:要绑定的样式的个数不确定，名字也不确定
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3aa500f42006400089e494bb0899d8b2.png)

对象写法
适用于要绑定的样式的个数确定，名字确定，但要动态决定用不用
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8fd0a01787854cfeb6391096ec89b3dd.png)

## 2.绑定style样式
### 对象写法

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/df14b00b5fea447cb7292fbbfc5158ba.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d0d10990fe7e412988019f59bc325be0.png)


### 数组写法
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c75d4f888f0247e98d103133ed47a844.png)



# 条件渲染

> v-if      写法：
> （1）v-if="表达式"
>              （2）v-else-if=“表达式”
>              （3）v-else=“表达式”    适用于:切换频率较低的场景    
>              特点: 不展示DOM元素直接被移除   
>               注意：v-if可以和 v-else-if、v-else一起使用 但要求结构不能被“打断” v-show    
> 写法：v-show="表达式"    
> 适用于：切换频率较高的场景    
> 特点:不展示的DOM元素未被移除
> 仅仅是使用样式（display：none）隐藏掉 
> 
> ps：使用v-if时 元素可能无法获取到，但是使用v-show一定可以获取到
>        v-if可以和template搭配使用，但是v-show不行
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3cc619789d8b441fa655582587621450.png)

# 列表渲染
## 1.v-for
v-for
  用于展示列表数据
  语法：v-for="(item,index) in xxx"  :key="yyy"
  可遍历：数组 对象 字符串（用的很少） 指定次数（用的很少）

```go
<div id="root">
  <!-- 遍历数组 -->
  <ul>
    // 也可用of
    <li v-for="(p,index) in persons" :key="p.id">{{p}}---{{index}}</li>
  </ul>
  <!-- 遍历对象 -->
  <ul>
    // 也可用in
    <li v-for="(value,k) of car" :key="k">{{value}}---{{k}}</li>
  </ul>
  <!-- 遍历字符串 -->
  <ul>
    <li v-for="(char,index) of str" :key="index">{{char}}---{{index}}</li>
  </ul>
  <!-- 测试遍历次数 -->
  <ul>
    <li v-for="(number,index) of 5" :key="index">{{number}}---{{index}}</li>
  </ul>
</div>
</body>
<script type="text/javascript">
  new Vue({
    el: "#root",
    data: {
      persons: [
        { id: "001", name: "张三", age: 20 },
        { id: "002", name: "李四", age: 20 },
        { id: "003", name: "王五", age: 20 },
      ],
      car: {
        name: "奔驰",
        price: 100000,
        color: "黑色",
      },
      str: "hello",
    },
  });
  </script>
```

## 2.key作用与原理
面试题:react vue中key的作用？（key的内部原理）

> 1.虚拟DOM中key的作用:
>       key是虚拟DOM对象的标识，当状态中的数据发生变化时，Vue会根据【新数据】生成【新的虚拟DOM】
>       随后Vue进行【新虚拟DOM】与【旧虚拟DOM】的差异比较，比较规则如下:
> 2.对比规则:
>      (1).旧虚拟DOM中找到了与新虚拟DOM相同的key:
>                若虚拟DOM中内容没变，直接使用之前的真实DOM!
>                若虚拟DOM中内容变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM.
>      (2).旧虚拟DOM中未找到与新虚拟DOM相同的key创建新的真实DOM，随后渲染到到页面。
> 3.用index作为key可能会引发的问题:
>       (1).若对数据进行:逆序添加、逆序删除等破坏顺序操作:
>              会产生没有必要的真实DOM更新  ==>界面效果没问题，但效率低。
>       (2).如果结构中还包含输入类的DOM：
>              会产生错误DOM更新 ==>界面有问题。
> 4.开发中如何选择key?:
>        (1).最好使用每条数据的唯一标识作为key，比如id、手机号、身份证号、学号等唯一值
>        (2).如果不存在对数据的逆序添加、逆序删除等破坏顺序操作
>              仅用于渲染列表用于展示使用index作为key是没有问题的。


### index作为key
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c191d428cfe0432890a2b6ef24cffc4c.png)


> 理解：
> 1. 当index作为key时，如果真实DOM的input框有一些值  且新的数据添加到开头 会造成错误
> 2. 首先有个初始数据， vue中会生成一个虚拟DOM （虚拟DOM中是有key的），虚拟DOM再转换成真实DOM
> 3. 当有新数据，且数据添加到开头时
> 4. 根据新数据生成一个虚拟DOM 但虚拟DOM并不会直接转换成真实DOM，会与旧的虚拟DOM进行对比
> 5. 新的虚拟DOM与旧的key值相同的进行对比 
> 6. 发现老数据的  张三  变成了新数据中的  老刘  那么不能复用，就会产生一个新的节点
> 7. 但是发现 后面input框是一样（虚拟DOM中没有input框中的值）的，vue就会认为直接复用即可
> 8. 但是真实DOM中的input有值，则会出现这个现象![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/92d4ffec157c4425bdc8b47255f47c3b.png)

### id作为key
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2445d6ba60d74c4a863128b0d6c95f86.png)

如果不写key vue会自动把index赋值给key


## 3.列表过滤
用watch实现

```go
<div id="root">
      <input type="text" placeholder="请输入名字" v-model="keyword" />
      <ul>
        <li v-for="(p,index) in filePersons" :key="index">
          {{p.name}}-{{p.age}}-{{p.sex}}
        </li>
      </ul>
    </div>
  </body>
  <script type="text/javascript">
    new Vue({
      el: "#root",
      data: {
        keyword: "",
        persons: [
          { id: "001", name: "马冬梅", age: 18, sex: "女" },
          { id: "002", name: "周冬雨", age: 19, sex: "女" },
          { id: "003", name: "周杰伦", age: 20, sex: "男" },
          { id: "004", name: "温兆伦", age: 21, sex: "男" },
        ],
        filePersons: [],
      },

      watch: {
        keyword: {
          immediate: true,

          handler(newVal) {
           

            this.filePersons = this.persons.filter((p) => {
              return p.name.indexOf(newVal) !== -1;
            });
          },
        },
      },
    });
  </script>
```

用computed实现

```go
// 用computed实现
new Vue({
  el: "#root",
  data: {
    keyword: "",
    persons: [
      { id: "001", name: "马冬梅", age: 18, sex: "女" },
      { id: "002", name: "周冬雨", age: 19, sex: "女" },
      { id: "003", name: "周杰伦", age: 20, sex: "男" },
      { id: "004", name: "温兆伦", age: 21, sex: "男" },
    ],
  },
  computed: {
    filePersons() {
      return this.persons.filter((p) => {
        return p.name.indexOf(this.keyword) !== -1;
      });
    },
  },
});
4.列表排序
 <div id="root">
      <input type="text" placeholder="请输入名字" v-model="keyword" />
      <button @click="sortType=2">年龄升序</button>
      <button @click="sortType=1">年龄降序</button>
      <button @click="sortType=0">原顺序</button>
      <ul>
        <li v-for="(p,index) in filePersons" :key="index">
          {{p.name}}-{{p.age}}-{{p.sex}}
        </li>
      </ul>
    </div>
  </body>
  <script type="text/javascript">
    // 用computed实现
    new Vue({
      el: "#root",
      data: {
        // 0原顺序  1降序  2升序
        sortType: 0,
        keyword: "",
        persons: [
          { id: "001", name: "马冬梅", age: 18, sex: "女" },
          { id: "002", name: "周冬雨", age: 30, sex: "女" },
          { id: "003", name: "周杰伦", age: 20, sex: "男" },
          { id: "004", name: "温兆伦", age: 41, sex: "男" },
        ],
      },
      computed: {
        filePersons() {
          const arr = this.persons.filter((p) => {
            return p.name.indexOf(this.keyword) !== -1;
          });
          //   判断一下是否需要排序
          if (this.sortType) {
            arr.sort((p1, p2) => {
              return this.sortType === 1 ? p2.age - p1.age : p1.age - p2.age;
            });
          }
          return arr;
        },
      },
    });
  </script>
```





---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/142639364)

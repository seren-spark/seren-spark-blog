---
title: "Vue（3）组件"
description: "记录 Vue 组件事件、自定义事件和父子组件通信。"
type: journal
occurredAt: 2024-10-14
publishedAt: 2024-10-14
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/142908206
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/72cc116658e746288688fde5049df78a.jpeg
---
#  对组件的理解
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/11a8c796dd4b4c10be13c0beb3b48a81.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c041c32c0eee4171ad2d8b987426dba2.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9eeac4bbdac1492c9e56ab53fec9ab09.png)


#  单文件组件
一个文件中包含一个组件
暴露一般选择默认暴露

```plaintext
export { school }  //import {？？？} from ？？？
export default school;//import ？？？ from ？？？
```

```vue
<template>
  <!-- 组件的结构 -->
  <div class="demo">
    <h2>学校名称：{{ name }}</h2>
    <h2>学校地址：{{ address }}</h2>
    <button @click="showName"></button>
  </div>
</template>
<script>
//组件交互相关的代码（数据方法等）

// 第三种暴露方式（推荐）
export default {
  name: "School",
  data() {
    return {
      name: "尚硅谷",
      address: "背景昌平",
    };
  },
  methods: {
    showName() {
      console.log(this.name);
    },
  },
};
// 第一种方式
// export { school };
// 第二种方式
// export default school;
</script>
<style lang="" scoped>
/* 组件的样式 */
.demo {
  background-color: skyblue;
}
</style>

```


#  非单文件组件
一个文件中包含n个组件
## 基本使用

> Vue使用组件的三大步骤：   
>  一、定义组件（创建组件）   
>   二、注册组件    
>   三、使用组件（写组件标签） 
一、如何定义一个组件
>        使用Vue.extend(options)创建 其中 options 和new  Vue (options）时传入的那个几乎一样，但也有点区别；
>        区别如下：
>         1.el 不要写，为什么？——最终所有组件都要经过一个vm管理，由vm中的el决定服务哪个容器
>         2.data必须写成函数，为什么？——避免组件被复用时，数据存在引用关系
>        备注：使用template可以配置组件结构 
> 二、如何注册组件？
>      1.局部注册：靠new Vue的时候传入components选项
>      2.全局注册：靠Vue.component（'组件名'，组件）
> 三、编写组件标签 : <school></school>




```go
<body>
    <div id="root">
      <h1>{{msg}}</h1>
      <hr />
      <!-- 第三步：编写组件标签 -->
      <school-info></school-info>
      <hr />
      <student></student>
    </div>
</body>
  <script type="text/javascript">
    // 第一步：创建school组件
    const school = Vue.extend({
      name:'atGuiGu', //在开发者工具的时候如果有name配置项则显示该项的名字，没有就显示注册组件时定义的名字
      template: `
        <div>
            <h2>学校名称：{{schoolName}}</h2>
            <h2>学校地址：{{address}}</h2>
            <button @click="showName">点我提示学校名</button>
        </div>
        `,
      // el: "#root", //组件定义时，不要写el配置项，因为最终的组件都要被一个vm管理，由vm决定服务于哪个容器。
      data() {
        return {
          schoolName: "尚硅谷",
          address: "背景昌平",
        };
      },
      methods: {
        showName() {
          alert(this.schoolName);
        },
      },
    });
    // 第一步：创建student组件
    const student = Vue.extend({
      template: `
        <div>
            <h2>学生姓名：{{studentName}}</h2>
            <h2>学生年龄：{{age}}</h2>
        </div>
        `,
      data() {
        return {
          studentName: "张三",
          age: 18,
        };
      },
    });
    // 第一步：创建hello组件
    const hello = Vue.extend({
      template: `
       <div>
           <h2>{{msg}}</h2>
       </div>
       `,
      data() {
        return {
          msg: "你好啊",
        };
      },
    });

    
    // 创建全局组件，全局注册
    Vue.component("hello", hello);

    const vm = new Vue({
      el: "#root",
      data: {
        msg: "hello",
      },
      // 第二步：注册组件（局部注册）
      components: {
        "school-info": school,
        student,
      },
    });
  </script>
```
##  几个注意点

> 1.关于组件名：
    一个单词组成：
           第一种写法（首字母小写） school
           第二种写法（首字母大写） School
    多个单词组成：
           第一种写法（kebab-case命名）：my-school
           第二种写法（CamelCase命名）：MySchool（需要Vue脚手架的支持）
     备注：
     （1）组件名尽可能回避HTML中已有的元素名称，例如：h2，H2都不行
     （2）可以使用name配置项指定组件在开发者工具中呈现的名字
2.关于组件标签
  第一种写法：<school></school>
  第二种写法：<school/>  
 备注：不用使用脚手架时，<school/>会导致后续组件不能渲染
3.一个简写方式
  const school=Vue.extend(options)  可简写为：const school =options

##  组件的嵌套

```go
<body>
  <!-- 页面上并不会出现<div id="root"></div>，会直接显示app的内容 -->
    <div id="root"></div>
  </body>
  <script type="text/javascript">
    //   定义student组件
    const student = Vue.extend({
      template: `
        <div>
            <h2>学生姓名：{{studentName}}</h2>
            <h2>学生年龄：{{age}}</h2>
        </div>
        `,
      data() {
        return {
          studentName: "张三",
          age: 18,
        };
      },
    });
    //定义school组件
    const school = Vue.extend({
      template: `
        <div>
            <h2>学校名称：{{schoolName}}</h2>
            <h2>学校地址：{{address}}</h2>
            <student></student>
        </div>
        `,
      // el: "#root", //组件定义时，不要写el配置项，因为最终的组件都要被一个vm管理，由vm决定服务于哪个容器。
      data() {
        return {
          schoolName: "尚硅谷",
          address: "背景昌平",
        };
      },
      components: {
        student,
      },
    });
    // 定义hello组件
    const hello = Vue.extend({
      template: `
       <div>
           <h2>{{msg}}</h2>
       </div>
       `,
      data() {
        return {
          msg: "你好啊",
        };
      },
    });
    // 定义app组件
    const app = Vue.extend({
      template: `<div>
             <hello></hello>
             <school></school>
        </div>`,
      components: {
        school,
        hello,
      },
    });

    const vm = new Vue({
      el: "#root",
      template: `
          <app></app>
  
      `,
      data: {
        msg: "hello",
      },
      // 第二步：注册组件（局部注册）
      components: {
        app,
      },
    });
  </script>
```

##  VueComponent构造函数

> 关于VueComponent
  1.school组件本质是一个名为VueComponent的构造函数，且不是程序员定义的，是Vue.extend生成的
  2.我们只需要写<school/>或<school></school> Vue解析时会帮我们创建school组件的实例对象
     即Vue帮我们执行的：new Component(options)
     每写一个<school/>，就会创建一次实例对象
 3.特别注意：每次调用Vue.extend 返回的都是一个全新的VueComponent
4.关于this指向：
  （1）组件配置中：
         data函数、methods中的函数、watch中的函数、computed中的函数  它们的this均是【VueComponent实例对象】
  （2） new Vue（options）配置中：
        data函数、methods中的函数、watch中的函数、computed中的函数  它们的this均是【Vue实例对象】
5.VueComponent的实例对象，  以后简称vc（也可称之为：组件实例对象）
   Vue的实例对象，                     以后简称vm
vc和vm有人说可以画等号，但是还是有一定区别的 比如 vm中可以有el 但是vc中没有


##  一个重要的内置关系
一个重要的内置关系：VueComponent.prototype.__proto__===Vue.prototype
为什么要有这个关系：让组件实例对象（vc）可以访问到Vue原型上的属性和方法

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6a56ec2c85f544d88038e301cb5d9f89.png)
#  组件的自定义事件
1.一种组件间的通信方式 适用于：子组件==>父组件
2.使用场景：子想给父传数据  那么就要在父中给子绑定自定义事件（事件的回调在父中）
3.绑定自定义事件

 

> 第一种方式：在父组件中：<Demo @atguigu="test" />或<Demo v-on：atguigu="test" />

App.vue
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7a02ffd9006b4e6482d52e4c18a4e91c.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1be75e4fef054de0bfdd65ff589a1329.png)
  理解：在组件上绑定一个事件atguigu 回调函数是getStudentName


> 第二种方式：在父组件中：< Demo ref="xxx">

App.vue
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/dd3b09fd3dd34f15ba289e267ce58874.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0e95bd6854e048c8be291518ffb9c7fc.png)
若想让自定义事件只能触发一次，可以使用once修饰符（@guigu.once），或$once方法
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3bffe04ff65f4eb595b404eadbae6790.png)
4.触发自定义事件

```go
this.$emit('atguigu',数据)
```
 注意：父组件绑定的自定义事件名和子组件的$emit(XXX)名字相同
上方绑定自定义事件的两种方式的触发方法均如图
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8d8b52c5688c4cf8a0fe3dad359e0d4f.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e9705c5c6116409aab53f7366e780c25.png)

>  理解：1.子组件点击按钮后触发sendStudentName 
>            2.触发Student身上的自定义事件atguigu （$emit），执行getStudentName函数
>             3.$emit中的this.name的值传递给父组件中的函数getStudentName


5.解绑自定义事件 

> this.$off('atguigu)

6.组件上也可以绑定原生DOM事件 需要使用native修饰符
 组件上如果直接写@click 等操作DOM的事件，Vue会认为是自定义事件，并不是内置事件，如  果想要组件上绑定内置事件如click等 需要 @click.native

7.注意：通过this.$refs.xxx.$on('atguigu'，回调) 绑定自定义事件时，回调要么配置在methods中，要么用箭头函数，否则this指向会出问题 
原因：
       如果在mounted中使用普通函数,this指向指的是调用的人（student组件）
   因此使用箭头函数，箭头函数没有this 会自动向父级寻找，即mouted函数的this  即app

App.vue
   配置在methods中
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3880600382c84820b83b486455a97132.png)
箭头函数 （在mouted中）
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/39cc4baeabcb4abda400b55c70d6cc09.png)

#  全局事件总线
一种组件间的通信方式：适用于任意组件间的通信
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5d1022d9c0f045b0ad99c8db0b5680f4.png)
要想有全局事件，必须所有vm vc都能看到 所以需要在某个的原型上添加

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f8e6e1ac7a1c477c859c67b74db776dd.png)
但是不能在Vuecomponent.prototype上添加，因为每创建一个不同的组件 都是一个全新的vueComponent 没办法固定，因此就需要在Vue的原型对象上添加

#  安装全局事件总线
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/af40d65a61254dd081696b4402c556b2.png)
#  使用事件总线
例子：Student组件给school组件发送数据
1.接受数据：A组件想接受数据，则在A组件中给$bus绑定自定义事件，事件的回调留在A组件自身
法一：在mouted中绑定自定义事件，并将函数写在mounted中（使用箭头函数)

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/71383e5a748c4944bb4b86dd6c8f88bb.png)
法二：在methods中把回调函数写好，再在mouted中调用
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4b1baa0d3deb4eeb81002da73d921ea8.png)
2.提供数据
  B组件触发事件并传递数据
  ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0caf1cb6ca8143d3826e750ea189916f.png)
#  解绑事件

最好在beforeDestroy钩子中，用$off去解绑当前组件所用到的事件
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/311ca4ee91b646cca53cd19cb8264d0f.png)

之前自定义事件中不用解绑是因为 是直接在Student身上定义的自定义事件，如果该组件销毁，那么自定义事件也会随之销毁
但是全局事件不同，全局事件是在一个总的$bus上定义的一个事件，就算组件没了，但是bus还在，定义的自定义事件还在bus上
#  消息订阅与发布
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2f3f7fa889a342d89bddf9e13ab785af.png)
需要数据的组件来订阅消息，有数据的发布消息
A组件订阅的消息（名为demo），函数是test  发布消息的人发布后，test执行
C组件发布消息（名为Demo）发布的数据是666 数据以参数的形式传给test

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/dba544b4d2f848389e77cf75da6e9e12.png)
##  简介
一种组件通信的方式，适用于任意组件的通信

##  使用步骤
1.安装pubsub 

```go
  npm i pubsub-js
```

2.引入

```go
import pubsub from "pubsub-js";
```

3.接受数据
至少两个参数：消息名，数据1


 A组件想接受数据，则在A组件中订阅消息，订阅的回调留在A组件自身
法一：将函数写在methods 
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/24dc20ce98f8472fbca1b559ddf05551.png)
法二：直接在mouted中写回调函数 （使用箭头函数）

> 使用箭头函数的原因:  因为普通函数，调用者是pubsub，是第三方库，this是undefined 箭头函数的this是vc
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/514aea76eda54b988a365c1fc0b933ff.png)

4.提供数据

```go
pubsub.publish('xxx’,数据)
```

5.取消订阅
最好在beforeDestroy钩子中，用pubsub.unsubscribe(this.pubid); 去取消订阅
传入的参数是订阅的id
##  范例
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b2315ae1a7fb47c889b79768240ec65b.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/51a7d78ce3a94f11bf4e6d9a98fe2ebb.png)
#  $nextTick

1.语法:this.$nextTick(回调函数)
2.作用：在下一次DOM更新结束后执行其指定的回调
3.什么时候用：当改变数据后，要基于更新后的DOM进行某些操作时，要在nextTick所指定的回调函数中执行


#  插槽
作用：让父组件可以向子组件指定位置插入html结构，也是一种组件间通信的方法  
适用于：父组件==>子组件

分类：默认插槽 具名插槽 作用域插槽

迷之总结hhh

> 默认插槽：我（子）挖坑，你（父）填土；具名插槽：我（子）挖坑，你（父）填土，我（子）再取个坑名；作用域插槽，我（子）挖坑，你（父）填土，我（子）在顺便给自己加点土
> 使用方式


##  1.默认插槽
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1dfb34c159434f57acfbdfce1d84d683.png)
Category.vue

```go
<template>
  <div class="categroy">
    <h3>{{ title }}分类</h3>
    <!-- 定义一个插槽（挖个坑，等着组件的使用者进行填充） -->
    <slot>我是一些默认值，当使用者没有传递具体结构时，我会出现</slot>
  </div>
</template>

<script>
export default {
  name: "Category",
  props: ["title"],
};
</script>

<style lang="scss" scoped>
...
</style>
```

App.vue

```go
<template>
  <div class="container">
    <Category title="美食">
      <img src="https://s3.ax1x.com/2021/01/16/srJlq0.jpg" alt="" />
    </Category>
    <Category title="游戏">
      <ul>
        <li v-for="g in games">{{ g }}</li>
      </ul>
    </Category>
    <Category title="电影">
      <video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></video>
    </Category>
  </div>
</template>

<script>
  import Category from "./components/Category.vue";

  export default {
    name: "App",
    components: { Category },
    data() {
      return {
        foods: ["火锅", "烧烤", "小龙虾", "牛排"],
        games: ["红色警戒", "穿越火线", "劲舞团", "超级玛丽"],
        films: ["《教父》", "拆弹专家", "《你好李焕英》", "《尚硅谷》"],
      };
    },
  };
</script>
<style lang="scss" scoped>
 ...
</style>
```

##  2.具名插槽
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fbdd68474fb742338798c4804e988726.png)
App.vue

```go
<template>
  <div class="container">
    <Category title="美食">
      <img
        slot="center"
        src="https://s3.ax1x.com/2021/01/16/srJlq0.jpg"
        alt=""
      />
      <a slot="footer" href="http://www.atguigu.com">更多美食</a>
    </Category>
    <Category title="游戏">
      <ul slot="center">
        <li v-for="g in games">{{ g }}</li>
      </ul>
      <div slot="footer" class="foot">
        <a href="http://www.atguigu.com">单机游戏</a>

        <a href="http://www.atguigu.com">网络游戏</a>
      </div>
    </Category>
    <Category title="电影">
      <video
        slot="center"
        src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
      ></video>
      <template slot="footer">
        <div class="foot">
          <a href="http://www.atguigu.com">经典</a>

          <a href="http://www.atguigu.com">热门</a>
          <a href="http://www.atguigu.com">推荐</a>
        </div>
      </template>
    </Category>
  </div>
</template>

<script>
import Category from "./components/Category.vue";

export default {
  name: "App",
  components: { Category },
  data() {
    return {
      foods: ["火锅", "烧烤", "小龙虾", "牛排"],
      games: ["红色警戒", "穿越火线", "劲舞团", "超级玛丽"],
      films: ["《教父》", "拆弹专家", "《你好李焕英》", "《尚硅谷》"],
    };
  },
};
</script>
<style lang="scss" scoped>
...
</style>

```

Category.vue

```go
<template>
  <div class="categroy">
    <h3>{{ title }}分类</h3>
    <!-- 定义一个插槽（挖个坑，等着组件的使用者进行填充） -->
    <slot name="center">
      我是一些默认值，当使用者没有传递具体结构时，我会出现
    </slot>
   <slot name="footer">
      我是一些默认值，当使用者没有传递具体结构时，我会出现
    </slot>
  </div>
</template>

<script>
export default {
  name: "Category",
  props: ["title"],
};
</script>

<style lang="scss" scoped>
...
</style>
```


##  作用域插槽
理解:
数据在组件的自身(定义插槽的组件 一般指子组件)，但根据数据生成的结构需要组件的使用者(父组件)来决定
（games数据在Category组件中，但使用数据所遍历出来的 结构由App决定）

父组件中的scope="xxx"  xxx是个对象，里面是一个一个传过来的数据对象
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/89e77009bc83487daf5f63d5728df4fa.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ee7599a6964d4cb89fe8f72482a3a0ea.png)


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/142908206)

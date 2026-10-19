---
title: "Vue 3 新组件与其他 API"
description: "整理浅层响应式、原始对象和只读对象等 Vue 3 API。"
type: journal
occurredAt: 2024-11-10
publishedAt: 2024-11-10
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/143665057
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/dd4ba76d3f034ca1a1cf0303a37123b0.jpeg
---
# Teleport
一种能够将我们的组件html结构移动到指定位置的技术

例如弹窗  通常 弹窗会相对于窗口定位  但父元素的属性有些会影响到弹窗的定位 （比如饱和度功能  当不设置饱和度功能时  弹窗可以相对于窗口正常定位  但是父元素一旦添加饱和度  定位失效 ）

```typescript
<Teleport to="body">
  <div class="model" v-show="isShow">
    <h2>我是弹窗的标题</h2>
    <p>我是弹窗的内容</p>
    <button @click="isShow = false">关闭弹窗</button>
  </div>
</Teleport>
```

#  Suspense
如果子组件ts中有异步任务执行  且子组件用的 ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fcef50cf51854078a285778e5be7ba49.png)
 则会造成子组件消失（await的原因）
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1a4a2a67dec34402a31ad1b311a50d82.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/409ff5a13ade4c9da6e9e28ceab708a8.png)
如果子组件包含着异步任务 并且异步任务提供的数据还要使用
等待异步组件时渲染一些额外的内容  让应用共有更好的用户体验
使用步骤：
        异步引入组件
        使用Suspense 包裹组件  并配置好default  和fallback

default 异步任务完成了才出现，fallback 异步任务没完成才出现

```typescript
<template>
    <div class="app">
        <h3>我是App组件</h3>
        <Suspense>
          <template v-slot:default>
            <Child/>
          </template>
          <template v-slot:fallback>
            <h3>加载中.......</h3>
          </template>
        </Suspense>
    </div>
</template>
```

#  全局API转移到应用对象
1.app.component
在App.vue中写上 app.component（组件名）  即可将组件注册成全局组件 
2.app.config
3.app.direactive(  '指令名'，（element,{value})=>{ })

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6e95538d875b49a2830130c665a64040.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/88b84f313b944622886f97d9dd279a3d.png)
4..app.mount
5.app.unmount
5.app.use

# 其他
● 过渡类名 v-enter 修改为 v-enter-from、过渡类名 v-leave 修改为 v-leave-from。
● keyCode 作为 v-on 修饰符的支持。
● v-model 指令在组件上的使用已经被重新设计，替换掉了 v-bind.sync。
● v-if 和 v-for 在同一个元素身上使用时的优先级发生了变化。(Vue2 是v-for 高 现在是v-if高)
● 移除了$on、$off 和 $once 实例方法。
● 移除了过滤器 filter。
● 移除了$children 实例 propert。


# 其他API
##  shallowRef  shallowReactive
### 1.shallowRef
作用：创建一个响应式数据 但只对顶层属性进行响应式处理
用法：let myVar = shallowRef(initialValue);
特点：只跟踪引用值的变化，不关心值内部的属性变化。
### 2.shallowReactive
1.作用：创建一个浅层响应式对象 只会使对象的最顶层属性变成响应式的，对象内部的嵌套属性则不会变成响应式的
2.用法：

```typescript
const myObj = shallowReactive({ ... });
```

3.特点：对象的顶层属性是响应式的，但嵌套对象的属性不是。
通过使用 shallowRef() 和 shallowReactive() 来绕开深度响应。浅层式 API 创建的状态只在其顶层是响应式的，对所有深层的对象不会做任何处理，避免了对每一个内部属性做响应式所带来的性能成本，这使得属性的访问变得更快，可提升性能。
##  readonly shallowReadonly
###   readonly
作用：作用于创建一个对象的深只读副本
用法:

```typescript
const original = reactive({ ... });
const readOnlyCopy = readonly(original);	
```
特点：
   对象的所有嵌套属性都会变成只读
   任何尝试修改这个属性的操作会被阻止  （开发模式下，还会在控制台中发出警告）
   
应用场景：
   创建不可变的状态快照
   保护全局状态或配置不被修改

###  shallowReadonly

 作用: 与readonly类似  但只作用于对象的顶层属性
 用法: 
 

```typescript
const original = reactive({ ... });
const shallowReadOnlyCopy = shallowReadonly(original);
```

特点：
只将对象的顶层属性设置为只读，对象内部的嵌套属性仍然是可变的
适用于只需保护对象顶层属性的场景


##   toRaw 与 markRaw
###   toRaw
作用：用于获取一个响应式对象的原始对象，toRaw 返回的对象不再是响应式的，不会触发视图更新
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/166557731fc54bc2a9be38d1b6ab838f.png)
官网描述：这是一个可以用于临时读取而不引起代理访问/跟踪开销（即没有响应式），或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。
何时使用？ —— 在需要将响应式对象传递给非 Vue 的库或外部系统时（如axios发的请求），使用 toRaw 可以确保它们收到的是普通对象

```typescript
import { reactive,toRaw,markRaw,isReactive } from "vue";

/* toRaw */
// 响应式对象
let person = reactive({name:'tony',age:18})
// 原始对象
let rawPerson = toRaw(person)
console.log("响应式对象",person)
console.log("原始对象",rawPerson)



/* markRaw */
let citysd = markRaw([
  {id:'asdda01',name:'北京'},
  {id:'asdda02',name:'上海'},
  {id:'asdda03',name:'天津'},
  {id:'asdda04',name:'重庆'}
])
// 根据原始对象citys去创建响应式对象citys2 —— 创建失败，因为citys被markRaw标记了
let citys2 = reactive(citys)
console.log(isReactive(person))
console.log(isReactive(rawPerson))
console.log(isReactive(citys))
console.log(isReactive(citys2))
```

###   markRaw

作用：标记一个对象 使其永远不会变成响应式的
 例如使用mockjs时 为了防止误把mockjs变为响应式对象 可以使用markRaw去标记mockjs
代码

```typescript
/* markRaw */
let citys = markRaw([
  {id:'asdda01',name:'北京'},
  {id:'asdda02',name:'上海'},
  {id:'asdda03',name:'天津'},
  {id:'asdda04',name:'重庆'}
])
// 根据原始对象citys去创建响应式对象citys2 —— 创建失败，因为citys被markRaw标记了
let citys2 = reactive(citys)
```
##  customRef
通常把自定义的ref 封装成一个hooks

```typescript
import { customRef } from "vue";

// 使用vue默认的ref定义响应式数据 数据变 页面更新（但是数据一变等1s更新  办不到）
// const msg = ref("你好");

// 使用vue提供的customRef定义响应式数据
let initValue = "你好";
// track(跟踪) trigger(触发)
let msg = customRef((track, trigger) => {
  return {
    // get何时调用？ msg被读取时
    get() {
      track(); //告诉vue msg重要  要对msg持续关注，一旦msg变化就去更新
      return initValue;
    },

    //set何时调用 msg被修改时
    set(value) {
      setTimeout(() => {
        initValue = value;
        trigger(); //通知vue 数据msg变化了
      }, 1000);
    },
  };
});
```


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/143665057)

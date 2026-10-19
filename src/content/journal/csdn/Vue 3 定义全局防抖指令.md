---
title: "Vue 3 定义全局防抖指令"
description: "把防抖行为封装成全局指令，减少输入框使用时的重复代码。"
type: journal
occurredAt: 2025-04-29
publishedAt: 2025-04-29
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/147604597
sourceName: CSDN
relatedDocs: []
---

在写项目时，总会有要进行防抖节流的时候，如果写一个debounce函数的话 用起来代码总会是有点长的，因此想到了用一个全局指令进行输入框的防抖，毕竟全局指令使用时只要v-xxx就行了，非常方便
#  代码
前提是需要全局注册
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/11ff27de10c54fc1b1cbd6ca8faf8742.png)
使用
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ea83db4b256b4c7ca194035a45b2d107.png)


```javascript


export default {
  debounce: {
    mounted(
      el: {
        addEventListener: (arg0: string, arg1: () => void) => void;
        value: any;
      },
      binding: { value: any; arg: any },
    ) {
      let timer: number | null = null;
      const { value, arg = 0 } = binding;
  

      el.addEventListener("input", () => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          value(el.value, arg);
        }, 1000);
      });
    },
    updated(
      el: {
        addEventListener: (arg0: string, arg1: (e: any) => void) => void;
        value: any;
        removeEventListener: (arg0: string, arg1: (e: any) => void) => void;
      },
      binding: { value: any; arg: any },
    ) {
      // 若指令的值更新，重新绑定事件处理函数
      let timer: number | null = null;
      let { value, arg = 0 } = binding;
      const existingListener = (e: any) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          value(el.value, arg);
        }, 1000);
      };
    //   el.removeEventListener("input", existingListener);
    //   el.addEventListener("input", existingListener);
    },
  },
};

```

v-debounce 后面的 :[typeId]就是传的参数 即arg

> 注意：如果写v-debounce.typeId 那么传的就是一个字符串“typeId” 而且[ ]只支持传一个参数 如果想要传多个参数的话  建议使用数组进行整体的传参

#  参数讲解
讲一下binding函数的几个参数

```javascript
  bind(el, binding, vnode, oldVnode) { }
```
el：指令绑定的元素的DOM。
binding：一个传参对象，包含以下的属性：

> value：传递给指令的值。例如：v-focus="1",获取到的值就是 1 
> oldValue：更新之前的值，仅在 beforeUpdate 和 updated 中可用。无论值是否更改，它都可用。
>  arg：传递给指令的参数 (如果有的话)。例如在
> v-my-directive:foo 中，参数是 "foo"。
>  modifiers：传入修饰符的对象 。例如在v-my-directive.foo.bar 中，修饰符对象是 { foo: true, bar: true }。
instance：使用该指令的组件实例。
 dir：指令的定义对象。
  
 vnode：代表绑定元素的底层 VNode。
 prevNode：之前的渲染中代表指令所绑定元素的 VNode。仅在 beforeUpdate 和 updated 钩子中可用。


举个例子
```javascript
<div v-example:foo.bar="baz">

```
binding参数会是一个这样的对象
```javascript
{
  arg: 'foo',
  modifiers: { bar: true },//传递的修饰符
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
}

```


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/147604597)

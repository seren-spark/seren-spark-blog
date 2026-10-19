---
title: "封装 confirm（Vue 3 + TS）"
description: "通过动态挂载组件封装 confirm，并处理确定、取消与组件卸载。"
type: journal
occurredAt: 2024-12-15
publishedAt: 2024-12-15
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/144480742
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/d2662b0fa99843b78716a58728b38a79.png
---

# 思路

封装confirm首先要在以前js封装confirm的基础上进行操作 之前封装confirm的时候 是通过调用自己写的confirm函数实现弹窗的出现以及消失并进行逻辑的 那么在Vue3中怎么实现呢？
首先要进行调用函数进行传参的操作，而且组件还要接收，那怎么才能只在调用函数的情况，没有父组件子组件这种关系进行支撑的情况下对一个组件进行传参？
这里要用到createApp了 我在网上查的时候查到的基本上都是这种方法，当时还在疑惑createApp怎么还会进行传参 组件竟然还能接收，搜索之后才发现，还真能这样

附上一个大佬的掘金文章：[一文带你学明白createApp创建`Vue3`应用对象](https://juejin.cn/post/7367182716998811698?searchId=202412150806260DB39EF12B0C137BAD32#heading-6)

# createApp

这里就简单的说一下createApp怎么用的 具体还是看我附上的那篇文章吧

有的人会觉得一个单文件应用只能有一个createApp 实际上并不是，一个单文件应用是可以使用多个createApp的

```javascript
function createApp(rootComponent: Component, rootProps?: object): App


```

通过类型可以看到createApp接收两个参数
1.第一个参数为根组件对象（可以是.vue单文件组件也可以是组件对象）必传参数
2.第二个参数为传递给根组件的props 第二个参数是可选参数

附上一小段源码：![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e03d85e5054645ee89ab9b128978860c.png)
从上面可以看到createApp的第二个参数是props，当挂载时可以直接给组件传递参数 组件用defineProps接收就行

# 封装confirm

组件文件

```html
<script setup lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Icon } from "@iconify/vue";
  import { ref } from "vue";

  const props = defineProps<{
    title?: string | undefined;
    content?: string | undefined;
    description?: string | undefined;
    confirmText?: string | undefined;
    cancelText?: string | undefined;
    onConfirm: Function;
    onCancel: Function;
  }>();
  const dialogVisible = ref(true);
</script>

<template>
  <AlertDialog :open="dialogVisible">
    <AlertDialogTrigger as-child> </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title ? title : "提示" }}</AlertDialogTitle>
        <AlertDialogDescription class="info flex">
          <Icon icon="pajamas:status-alert" />
          <span id="content"
            >{{ content ? content : "你确定执行该操作吗？" }}</span
          >
          <span id="description">
            {{ description ? `(${description})` : "" }}</span
          >
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel()"
          >{{ cancelText ? cancelText : "取消" }}</AlertDialogCancel
        >
        <AlertDialogAction @click="onConfirm()"
          >{{ confirmText ? confirmText : "确定" }}</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
<style lang="scss" scoped>
  .info {
    font-size: 16px;
    align-items: center;

    svg {
      color: #f1b357;
      font-size: 22px;
      margin-right: 10px;
    }

    #description {
      font-size: 14px;
    }
  }
</style>
```

在代码中可以看到用defineProps 接收参数

函数useConfirm组件

```typescript
import Confirm from "@/components/confirm/Confirm.vue";
import { createApp } from "vue";
export function showConfirm({
  title = "",
  content = "",
  description = "",
  confirmBtnTxt = "确定",
  cancelBtnTxt = "取消",
}) {
  return new Promise((resolve, reject) => {
    const app = createApp(Confirm, {
      title,
      content,
      description,
      confirmBtnTxt,
      cancelBtnTxt,
      onConfirm: () => {
        unmount();
        resolve(true);
      },
      onCancel: () => {
        unmount();
        reject(false);
      },
    });

    // 创建一个挂载容器
    const parentNode = document.createElement("div");
    document.body.appendChild(parentNode);

    // 卸载组件
    const unmount = () => {
      app.unmount();
      document.body.removeChild(parentNode);
    };

    // 挂载组件
    app.mount(parentNode);
  });
}
```

通过showConfirm函数 传递过来参数，在调用时通过createApp挂载组件，并传递过去参数，组件进行接收和渲染，当点击确定和取消时卸载该组件，.then 和.catch执行相关确定取消的逻辑

用法
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a75ac1de1408478e889792d844990160.png)

附上效果
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d2662b0fa99843b78716a58728b38a79.png)

# 下周计划

该期末考试了，也该复习复习知识点了不然包挂科的，然后下周还有一次面试，Vue也该复习复习了，虽然写过一个项目了，但是感觉对Vue的一些用法还是不太熟悉

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/144480742)

---
title: "Vue 3 大文件分片上传与断点续传（TS 核心思路）"
description: "整理大文件分片、上传合并和断点续传的基本设计与实现思路。"
type: journal
occurredAt: 2025-02-23
publishedAt: 2025-02-23
tags:
  - 文件上传
sourceUrl: https://blog.csdn.net/HBR666_/article/details/145805203
sourceName: CSDN
relatedDocs: []
---

# 前言
因为要写小组项目，其中涉及到了大文件的分片上传，之前进行了一些资料的参考 但是还是写了好几遍  这篇文章我先简单的介绍一下思路，以及一些最基本的核心代码 ，后续再进行一些优化

涉及技术：spark-md5  vue3 

大文件之所以要分片上传 是因为服务器在处理大文件上传时，需要分配大量的内存和资源来接收和处理数据。如果一次性上传大文件，服务器可能会因为资源耗尽而出现性能下降甚至崩溃的情况。而分片上传将大文件分成多个小块，服务器可以逐块处理，每次处理的数据量相对较小，减轻了服务器的负载压力。例如，对于一台配置普通的服务器，一次性处理一个 10GB 的文件可能会让服务器不堪重负；但如果将该文件分成 1000 个 10MB 的分片，服务器处理起来就会轻松很多
#  思路
**流程**：首先前端拿到超大文件  需要把文件进行切割分成固定大小的切片，再通过http请求把所有的切片传给后端，后端拿到切片后，处理每一个切片并返回是否处理成功给前端，等吧所有切片上传后 后端吧所有切片合并成一个完整的文件，代表大文件上传完成
考虑要把文件切片 那么每一个文件的唯一标识可以用到spark-md5 去计算hash值，这样如果就算文件同名，那么它的唯一标识也会不同，文件内容更改后得到的hash值也会不同
##  hash计算

> 在向服务器上传文件时，需要区分不同的文件，但是肯定不能通过文件名进行区分，因为文件名是可以随意修改的，所以不能根据文件名区分，但是每一份文件内容都不一样，我们可以根据文件内容去区分

可以根据文件的内容产生一个唯一的hash值，那么就要通过一个工具spark-md5，具体安装过程就不说了
直接附上代码

```typescript
function computeFileHash(file: File): Promise<any> {
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const buffer = e.target?.result;
      spark.append(buffer as ArrayBuffer);
      const hash: string = spark.end();
      if (!buffer) reject();
      // 获取文件后缀
      const ext: string = file.name.split(".").pop() as string;
      resolve({
        hash,
        ext,
      });
    };
    fileReader.readAsArrayBuffer(file);
  });
}
```

hash就是计算出的md5值，有时候后端会要求md5值携带上文件的后缀 
##   上传（单文件）
这个代码并没有进行过测试 只是根据网上视频写的demo，因为后端使用了minio服务器还需要进行一些操作 

```typescript
import axios from "axios";
import { reactive, ref } from "vue";
const percent = ref(0);
export async function uploadfile(e: Event, url: string, chunkSize: number) {
  //切片的大小
  let start =0 ;//开始位置
  let index=0 ;//切片索引
  const target = e.target as HTMLInputElement;
  if (target.files) {
    const file = target.files[0];
       //计算hash
    const { hash, ext } = await computeFileHash(file);
    let object = `${hash}.${ext}`;
    let res = await runCheckChunk(object);
    //....进行res的判断 是否上传
    const { name, size, type } = reactive(file) ;
    while (start < size) {
      let blob = null;
      if (start + chunkSize > size) {
        //如果切片长度大于文件实际长度
        blob = file.slice(start, size); //从0开始切片段到size
      } else {
        //如果切片长度小于文件实际长度
        blob = file.slice(start, start + chunkSize); //每次只切片一个切片大小的文件
      }
      start += chunkSize; //切片片段的偏移量
      let blobFile = new File([blob], `${name}`); //创建一个blob文件来存取切片片段
      let formData = new FormData(); //创建一个formData对象
      formData.append("file", blobFile); //添加文件
      formData.append("index", index + ""); //添加文件索引
      await axios.post(url, formData); //上传文件片段
      index++;
      percent.value = (start / size) * 100; //进度条
    }

    // 合并文件片段
    await axios.post("/api/merge", {
      name: name,
      size: size,
    });
    percent.value = 100;
  }
}
```

> 后端需要的接口有：
> 1.前端传递hash值 后端返回文件的状态 是否已上传，若上传了一部分则返回上传的索引
> 2.上传切片的接口
> 3.合并切片的接口
> 常见切片大小是5MB及以上


 - 计算md5值后 传给后端获取返回的数据
 - 如果没有上传 则开始进行上传（循环传递）
 - 如果要进行切片的大小是大于文件大小的 则截取所需大小即可
 - 如果进行切片的大小小于文件大小 则截取切片大小
 - 每次截取过后 都需要将开始截取的位置后移
 - 传递的数据格式由后端决定（这里使用的是formData）
 - 把所有的放到formData后传递给后端
 - 最后进行合并操作

这里面的index的作用是为了断点续传  通过传递给后端索引值 当检查md5发现文件上传但是没有进行过合并操作 后端可以返回索引值 继续上传

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/145805203)

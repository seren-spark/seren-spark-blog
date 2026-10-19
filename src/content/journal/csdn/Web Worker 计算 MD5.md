---
title: "Web Worker 计算 MD5"
description: "将大文件 Hash 计算放到 Web Worker 中，避免长时间阻塞主线程。"
type: journal
occurredAt: 2025-03-02
publishedAt: 2025-03-02
tags:
  - 前端
sourceUrl: https://blog.csdn.net/HBR666_/article/details/145958494
relatedDocs: []
---

#  前言
当上传的文件过于庞大时，计算的hash值时间非常长可能会导致主线程阻塞，因此可以使用webworkers在分线程进行hash值的计算然后再向主线程发送消息
# webworkers

先附上webworkers文档  [阮一峰webworkers](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)


##  使用方法
###   主线程
注意事项：
 - Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络。
 - Worker 线程不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。

新建主线程
```typescript
var worker = new Worker('work.js'); //子线程路径名
```
主线程通过worker.postMessage 发送消息   worker.onmessage接收消息  worker.terminate()  关闭主线程
###  子线程

```typescript
self.addEventListener('message', function (e) {
  self.postMessage('You said: ' + e.data);
}, false)
```


#  使用webworkers计算hash
子线程代码

```typescript
import SparkMD5 from "spark-md5";
function createFileMd5(file: File) {
  return new Promise((resolve, reject) => {
    const blobSlice =
      file.slice || (file as any).mozSlice || (file as any).webkitSlice;
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    const chunkSize = 2097152; // 2MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    const loadNext = () => {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    fileReader.onload = (e) => {
      if (e.target?.result) {
        try {
          if (e.target.result instanceof ArrayBuffer) {
            spark.append(e.target.result);
          } else {
            console.error("读取结果不是 ArrayBuffer 类型");
          }
        } catch (error) {
          console.log("获取Md5错误：" + currentChunk);
        }
      }
      if (currentChunk < totalChunks) {
        currentChunk++;
        loadNext();
      } else {
        //后端只接受了hash
        const md5 = spark.end();
        const ext = file.name.split(".").pop();
        resolve({ md5, totalChunks });
      }
    };

    fileReader.onerror = () => {
      console.warn("读取Md5失败，文件读取错误");
      reject(new Error("文件读取错误"));
    };

    loadNext();
  });
}
self.onmessage = async function (e) {
  const file = e.data;
  try {
    const result = await createFileMd5(file);
    postMessage(result); // 将计算结果返回给主线程
  } catch (error: any) {
    postMessage({ error: error.message });
  }
};
```

主线程 （其余代码省略）

```typescript
const worker = new Worker(new URL("@/worker/hash-worker.ts", import.meta.url), {
  type: "module",
});
const handler = async () => {
  console.log(uploadFileList, "上传文件列表");
  if (uploadFileList.length === 0) {
    showAlert("请先选择文件", "waring");
    return;
  }
  if (currentFileIndex >= uploadFileList.length) {
    showAlert("文件上传成功", "pass");

    return;
  }
  const currentFile = uploadFileList[currentFileIndex] as any;
  // console.log("当前操作文件：", currentFile);

  currentFile.status = FileStatus.getMd5;
  currentFile.chunkUploadedList = []; //先将上传过的列表初始化为空

  try {
    let checkResult: any;
    //使用webworker
    worker.postMessage(currentFile); //向子线程发送文件信息
    worker.onmessage = async (e) => {
      //当主线程接收到消息后
      const { md5, totalChunks } = e.data;
      checkResult = await checkFileUploadedByMd5(md5);
      console.log("检查是否已上传-->", checkResult);
      if (checkResult.code == 3400) {
        return showAlert("该文件已存在", "waring");
      }
      console.log("code", checkResult.code);
      if (checkResult.code == 200) {
        //文件已经存在的情况
        console.log("上传成功文件访问地址：" + checkResult.data.url);
        currentFile.status = FileStatus.success;
        currentFile.uploadProgress = 100;
        currentFileIndex++;
        handler();
        return;
      } else if (checkResult.code === 3401) {
        console.log("上传中：", checkResult);
        currentFile.status = FileStatus.uploading;
        let chunkUploadedList = checkResult.data.chunkUploadedList;

        currentFile.chunkUploadedList = chunkUploadedList;
        console.log("已经上传过的上传的分片信息", chunkUploadedList);
      } else {
        console.log("未上传");
      }

      currentFile.status = FileStatus.chip;
      let fileChunks = createFileChunk(currentFile, chunkSize);
      let type = fileSuffixTypeUtil(currentFile.name);

      let param = {
        fileName: currentFile.name,
        fileSize: currentFile.size,
        chunkSize: chunkSize,
        chunkNum: totalChunks,
        fileMd5: md5,
        contentType: "application/octet-stream",
        fileType: type,
        chunkUploadedList: currentFile.chunkUploadedList, //已上传的分片索引+1
      };

      let uploadIdInfoResult = await getFileUploadUrls(param);
      let uploadIdInfoData = uploadIdInfoResult.data;
      console.log("获取上传url-->", uploadIdInfoData);

      let uploadUrls = uploadIdInfoData.urlList;
      currentFile.chunkList = [];

      if (uploadUrls !== undefined) {
        if (fileChunks.length !== uploadUrls.length) {
          console.error("文件分片上传地址获取错误");
          return;
        }
      }

      fileChunks.map((chunkItem, index) => {
        if (currentFile.chunkUploadedList.indexOf(index + 1) !== -1) {
          currentFile.chunkList.push({
            chunkNumber: index + 1,
            chunk: chunkItem,
            uploadUrl: uploadUrls[index],
            progress: 100,
            progressStatus: "success",
            status: "上传成功",
          });
        } else {
          currentFile.chunkList.push({
            chunkNumber: index + 1,
            chunk: chunkItem,
            uploadUrl: uploadUrls[index],
            progress: 0,
            status: "—",
          });
        }
      });

      console.log("所有分片信息：", currentFile.chunkList);
      let tempFileChunks = [];

      currentFile.chunkList.forEach((item) => {
        tempFileChunks.push(item);
      });
      //更新状态
      currentFile.status = FileStatus.uploading;
      tempFileChunks = processUploadChunkList(tempFileChunks);
      console.log("删除已上传的分片-->", tempFileChunks);

      await uploadChunkBase(tempFileChunks);

      console.log("---上传完成---");

      if (uploadIdInfoData.uploadId === "SingleFileUpload") {
        console.log("单文件上传");
        currentFile.status = FileStatus.success;
        //文件下标偏移
        currentFileIndex++;
        //递归上传下一个文件
        handler();
      } else {
        console.log("合并文件-->", currentFile);
        const mergeResult = (await mergeFile({
          uploadId: uploadIdInfoData.uploadId,
          fileName: currentFile.name,
          fileMd5: md5,
          fileType: type,
          chunkNum: uploadIdInfoData.urlList.length,
          chunkSize: chunkSize,
          fileSize: currentFile.size,
        })) as mergeResponseData;
        console.log(mergeResult, "mergeResult");

        if (!mergeResult.data) {
          currentFile.status = FileStatus.error;
          console.error(mergeResult.message);
        } else {
          localStorage.removeItem(FILE_UPLOAD_ID_KEY);
          currentFile.status = FileStatus.success;
          console.log("文件访问地址：", mergeResult.data);
          currentFileIndex++;
          handler();
        }
      }
    };
  } catch (error) {
    console.error("上传过程中出现错误：", error);
  }
};
```

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/145958494)

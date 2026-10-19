---
title: "AI 编辑器（二）——调用模型的 FIM 功能"
description: "记录通过 API 调用代码模型完成 FIM 补全的实现思路与示例。"
type: journal
occurredAt: 2025-10-06
publishedAt: 2025-10-06
tags:
  - AI
sourceUrl: https://blog.csdn.net/HBR666_/article/details/152609713
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/7f7c651806ae4da3bb039731e3bc0a8e.png
---

网址：[阿里云百炼](https://bailian.console.aliyun.com/?spm=5176.29597918.J_tAwMEW-mKC1CPxlfy227s.1.378b7b08W37Q6N&tab=doc#/doc/?type=model&url=2850166)
 首先 使用的时候要有apiKey  怎么创建我就不多说了
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/be3b8e56c25a44b7a7f085efe31da3e2.png)
提示词模版
```csharp
<|fim_prefix|>{prefix_content}<|fim_suffix|>{suffix_content}<|fim_middle|>
```
**需要将{prefix_content}替换为传入的前缀信息，将{suffix_content}替换为传入的后缀信息。**
```javascript
import OpenAI from 'openai';


const client = new OpenAI({
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: process.env.DASHSCOPE_API_KEY  //使用你自己的key
});

const prefixContent = `xxxx`;
const suffixContent = "xxxx";

async function main() {
  const completion = await client.completions.create({
    model: "qwen2.5-coder-32b-instruct",
    prompt: `<|fim_prefix|>${prefixContent}<|fim_suffix|>${suffixContent}<|fim_middle|>`
  });

  console.log(completion.choices[0].text);  //请求结果
}

main();
```


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/152609713)

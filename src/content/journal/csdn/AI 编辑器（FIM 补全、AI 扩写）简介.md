---
title: "AI 编辑器（FIM 补全、AI 扩写）简介"
description: "介绍结合 React、Ant Design、Redux 与代码模型的 AI 辅助编辑器。"
type: journal
occurredAt: 2025-10-06
publishedAt: 2025-10-06
tags:
  - AI
sourceUrl: https://blog.csdn.net/HBR666_/article/details/152609427
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/1a6c72bc3da4427d8eb9e1ca9a22d8ae.png
---

#  前言
> 由于AI逐渐越来越流行，身为前端也要向AI靠拢a

打算写一个编辑器  当然也不能只是一个简单的编辑器，肯定要涉及点AI的东西  那很容易能够想到扩写等功能 :

涉及技术栈: react18   antd5.x  redux   unocss(样式库)  tiptap(富文本编辑库) 

涉及到的AI: Qwen/Qwen2.5-Coder-7B-Instruct

涉及到的功能：
 1. 支持md,各种文本操作（居中 下划线 高亮 斜线 插入链接 图片 blabla等等）
 2. 支持目录展示  目录定位
 3. **支持AI扩写  AI改错  AI文本补全  代码自动补全（类vscode 但是有bug  ）**
   
#  为什么选择千问的这个AI模型
   这也是别无选择a  **其他模型要钱**
   **我怎么知道的？**  [硅基流动](https://cloud.siliconflow.cn/me/models)
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5b538da883554b4788a060814210db8f.png)

在硅基流动中我看了看支持FIm模型并且免费的只有这个模型了 ，当然其他的我也不信邪的试过，然后失败了

当然最后我也没用硅基流动简介调用API  因为里面是python示例 而且信息较少 因此直接去阿里官网看了
#  什么是FIM
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2e4c6850bf5d48ae9edfb26efeee3e22.png)
简单来说 就是一般的AI 如果不使用fim 的话 就是通过prompt 提示词来进行一个补全，也就是所谓的前缀补全  一问一答
当然不使用FIM也可以通过前后缀补全 
你猜怎么用？  直接**在prompt 里告诉AI**  前缀是啥 后缀是啥 告诉他 我要中间的部分 给我补全一波，这种方法我也用了  是用来**降级处理**的  

**为什么不直接用prompt 的方式当做主方式
是因为使用下来我发现 准确度远远没有使用fim的准确度高**





---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/152609427)

---
title: "一文带你彻底掌握 Function Call 的使用（Node.js 版）"
description: "用 Node.js、SSE 和阿里云百炼模型完成 Function Calling，从工具判断到结果回传。"
type: journal
occurredAt: 2025-10-20
publishedAt: 2025-10-20
tags:
  - AI
sourceUrl: https://blog.csdn.net/HBR666_/article/details/153641675
sourceName: CSDN
relatedDocs: []
---
# 前言
本文使用的模型是阿里云百炼的模型  [直通阿里云百炼Function Calling](https://bailian.console.aliyun.com/?spm=5176.29619931.J__Z58Z6CX7MY__Ll8p1ZOR.1.74cd521c97f1y0&tab=doc#/doc/?type=model&url=2862208)

要求： 需要的为nodejs 做服务器 、会基础的sse(不会也没事，会cv就完了)

记得自己配一下apiKey~
# 简介
> AI 根据任务需求  主动触发对外部工具/服务/代码逻辑的调用

> Function Call 的核心逻辑不是AI自己执行函数，而是：
>- **判断是否需要调用**：AI 先分析用户需求 —— 如果靠自身知识库能回答（比如 “地球半径多少”），就不调用；如果需要外部数据 / 操作（比如 “实时股票价格”），就决定调用。
>- **正确构造函数参数**： AI 需要按照外部函数的格式要求，自动填充参数（比如调用天气API的时候，正确传入“城市”，“日期”，避免参数缺失）
>- **处理返回结果**：外部函数返回数据后，AI需要理解结果并转化为用户能懂的自然语言（而不是直接丢出API原始响应）


<p align=left><img src="https://img-home.csdnimg.cn/images/20230724024159.png?origin_url=https%3A%2F%2Fp0-xtjj-private.juejin.cn%2Ftos-cn-i-73owjymdk6%2F72f8399ee1554a878527d52fa0a41652~tplv-73owjymdk6-jj-mark-v1%3A0%3A0%3A0%3A0%3A5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2VyZW5kaXBpdHk3MzM%3D%3Aq75.awebp%3Fpolicy%3DeyJ2bSI6MywidWlkIjoiMTkyOTAwNDI2Mjg4NTc5MiJ9%26rk3s%3Df64ab15b%26x-orig-authkey%3Df32326d3454f2ac7e96d3d06cdbb035152127018%26x-orig-expires%3D1761447852%26x-orig-sign%3DJFrATT04ioo69FTPGXK8%252FDZ%252FLic%253D&pos_id=img-gzgXW4tg-1760955606458)" alt="image.png"  /></p>

# 预备函数

```js
// 工具执行映射
export const toolExecutors = {
  get_current_weather: getCurrentWeather,
  // 未来可以添加更多工具
  // get_stock_price: getStockPrice,
  // search_web: searchWeb,
};
// 执行工具函数
export const executeTool = (functionName, args) => {
  const executor = toolExecutors[functionName];
  if (!executor) {
    throw new Error(`未找到工具: ${functionName}`);
  }
  return executor(args);
};
```


```js
router.post("/stream", async (req, res) => {
  console.log(req.body, "req.body");

  try {
    const {
      message,
      model = "qwen-plus",
      sessionId = null,
      systemPrompt = null,
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message 参数不能为空" });
    }

    // 设置 SSE 头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    await streamChatWithTools(message, model, {
      onToken: (delta) => {
        console.log(delta, "token delta");
        //给前端逐字发送消息
        res.write(
          `data: ${JSON.stringify({ type: "token", content: delta })}\n\n`
        );
      },
      onToolCall: (name, args, result) => {
        console.log({ name, args, result }, "tool delta");

        res.write(
          `data: ${JSON.stringify({ type: "tool", name, args, result })}\n\n`
        );
      },
      onDone: ({ sessionId: sid, stats }) => {
        console.log("onDone");
        res.write(
          `data: ${JSON.stringify({ type: "done", sessionId: sid, stats })}\n\n`
        );
        res.end();
      },
      onError: (error) => {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: error.message,
          })}\n\n`
        );
        res.end();
      },
      sessionId,
      systemPrompt,
    });
  } catch (error) {
    console.error("❌ 工具流式聊天错误:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || "服务器内部错误",
      });
    }
  }
});
```

# 初步使用function call(非流式)
## 定义工具
```js
export const weatherTool = {
  type: "function",
  function: {
    name: "get_current_weather",
    description: "当你想查询指定城市的天气时非常有用。",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "城市或县区，比如北京市、杭州市、余杭区等。",
        },
      },
      required: ["location"],
    },
  },
};
```
注意:使用的时候是一个tools数组
`export const tools = [weatherTool];`

## 创建聊天函数
```js
export const chatWithTools = async (userMessage, model = "qwen-plus") => {
  //1.-----------------------------发起请求--------------------------------

  const messages = [
    {
      role: "user",
      content: userMessage,
    },
  ];
  //模型返回
  let response = await openai.chat.completions.create({
    model,
    messages,
    tools,//工具数组
  });
  let assistantMessage = response.choices[0].message;
  //2.-------------------------判断是否需要工具----------------------------
  //
  // 确保 AI 回复不是null
  //// 兜底：如果 content 是 null，置为空字符串
  if (!assistantMessage.content) {
    assistantMessage.content = "";
  }
  // 把模型的回复加入对话历史
  messages.push(assistantMessage);
  // 判断：模型有没有要求调用工具？
  if (!assistantMessage.tool_calls) {
    console.log(`无需调用天气查询工具，直接回复：${assistantMessage.content}`);
    return {
      needToolCall: false,
      finalResponse: assistantMessage.content,
      messages,
    };
  }
  
  //3 --------------------执行工具-------------------------------------
  // 工具调用循环
  const toolCallLogs = []; // 记录所有工具日志
  while (assistantMessage.tool_calls) {
    // 取第一个工具  因为现在只能调用一个 不支持多个
    const toolCall = assistantMessage.tool_calls[0];
    const toolCallId = toolCall.id; // "call_abc123"
    const funcName = toolCall.function.name;  // "get_current_weather"
    const funcArgs = JSON.parse(toolCall.function.arguments); // { location: "北京" }
    console.log(`🔧 正在调用工具 [${funcName}]，参数:`, funcArgs);
    // 执行工具函数（下方给）  返回："北京今天是晴天，温度25°C。"
    const toolResult = await executeTool(funcName, funcArgs);
   // 记录日志
    toolCallLogs.push({
      tool: funcName,
      args: funcArgs,
      result: toolResult,
    });

   // 构造工具返回消息（符合 OpenAI 规范）
    const toolMessage = {
      role: "tool",
      tool_call_id: toolCallId, // 必须对应上面的 id
      content: toolResult,   // 工具执行结果
    };
    console.log(`工具返回：${toolMessage.content}`);
    // 把工具结果加入对话历史
    messages.push(toolMessage);
    
    
    
    
// 4. ----------------------模型总结成自然语言-----------------------------
    response = await openai.chat.completions.create({
      model,
      messages,
      tools,
    });
    assistantMessage = response.choices[0].message;
     // 兜底
    if (!assistantMessage.content) {
      assistantMessage.content = "";
    }
    
   // 把模型的总结加入对话历史
    messages.push(assistantMessage);
  }
  console.log(`助手最终回复：${assistantMessage.content}`);
  return {
    needToolCall: true,
    finalResponse: assistantMessage.content,
    toolCallLogs,
    messages,
  };
};
```
### 代码逻辑（注释有讲解,数字对应每个步骤）
**1. 发起请求** 

创建用户信息，发起请求

模型返回
数据格式如下：
```js
{
  choices: [{
    message: {
      role: "assistant",
      content: null,  // 没有文本内容
      tool_calls: [    // 决定调用工具
        {
          id: "call_abc123",
          type: "function",
          function: {
            name: "get_current_weather",
            arguments: '{"location":"北京"}'  // 完整的 JSON 字符串
          }
        }
      ]
    }
  }]
}
```

**2.是否需要工具**

执行后的message状态

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4aa18bb4a20e4110b80e26b0b9b2a915.png)

**3. 执行工具**

message状态

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e410d37dfb004c0f9f1917bf5365f1ad.png)


**4.模型总结**

执行后的模型返回的`repsonse`结果

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1cad2b4c25284e3994355924a1880bf8.png)

此时message的最终形态

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/747deadaeb4b4efb8e17c9742c169250.png)


### 代码解惑
- **为什么要确保content不是null**

因为在“function call” 的场景下  模型返回的`assisant` 通常只有tool_calls(或function_call),规范允许省略文本内容，此时message.content 可能是`null/undefined`, 

如果后续： 把这条消息直接`messages.push(assistantOutput)`再继续对话或在日志/前端 里做字符串，渲染文都可能因为content 为空而报错 或显示异常。 

-  **tool_call_id 的作用**



模型返回的每个工具调用都有唯一 ID，工具结果必须带上对应的 ID，模型才能匹配"这是哪个工具的返回值"。

### 流程

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8a9a47d84d0f431e9a50be520f3d48b6.png)


## 接口请求

```js
router.post("/", async (req, res) => {
  try {
    const { message, model = "qwen-plus" } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "message 参数不能为空",
      });
    }

    console.log(`🤖 收到工具调用请求: ${message}`);

    const result = await chatWithTools(message, model);

    console.log(`✅ 工具调用完成，最终回复: ${result.finalResponse}`);

    res.json({
      success: true,
      response: result.finalResponse,
      needToolCall: result.needToolCall,
      toolCallLogs: result.toolCallLogs || [],
      model,
    });
  } catch (error) {
    console.error("❌ 工具调用错误:", error);
    res.status(500).json({
      success: false,
      error: error.message || "服务器内部错误",
    });
  }
});
```

# 流式调用（单个工具）

> 注意: 工具函数名称仅在第一个流式返回的对象（delta） 中出现
> 核心设置：stream:true

## 函数

```js
export const streamChatWithTools = async (
  userMessage,
  model = "qwen-plus",
  { onToken, onToolCall, onDone, onError } = {}
) => {
 // 1. ----------------------发起请求---------------------------
  const messages = [{ role: "user", content: userMessage }];
  console.log("streamChatWithTools");

  try {
    while (true) {
      const stream = await openai.chat.completions.create({
        model,
        messages,
        tools,
        stream: true,
      });

      // 单个工具调用
      let toolCall = null;  // 存储工具调用信息
      let contentBuffer = "";  //累积文本内容
      let finishReason = null; // 记录结束原因
      
      
  //2.-------------逐块处理流式数据（目的就是拼接成完整信息）-------------------

      for await (const chunk of stream) {
        const choice = chunk.choices?.[0];
        if (!choice) continue;

        // 文本增量
        const delta = choice.delta?.content || "";
        console.log(choice.delta, "choice.delta");

        if (delta) {
          contentBuffer += delta;
          onToken?.(delta);
        }

        // 工具调用增量（单个工具）
        const deltaToolCalls = choice.delta?.tool_calls || [];
        for (const tc of deltaToolCalls) {
          // 🔴 第一次出现时初始化
          if (!toolCall) {
            toolCall = {
              id: tc.id || "",
              type: "function",
              function: { name: "", arguments: "" },
            };
          }

          // 🔴 累积拼接
          if (tc.id) toolCall.id = tc.id;
          if (tc.function?.name) toolCall.function.name += tc.function.name;
          if (tc.function?.arguments) toolCall.function.arguments += tc.function.arguments;
        }

        // 结束原因
        if (choice.finish_reason) {
          finishReason = choice.finish_reason;
        }
      }

      //3.--------------- 构造标准assistant 消息 ---------------------
      const assistantMessage = {
        role: "assistant",
        content: contentBuffer || null,
      };
      if (toolCall && toolCall.id) {
        assistantMessage.tool_calls = [toolCall]; // 🔴 单个工具也要用数组
      }
      messages.push(assistantMessage);

      // 没有工具调用，流程结束
      if (!toolCall || !toolCall.id) {
        break;
      }

      // 执行单个工具
      const funcName = toolCall.function.name;
      const funcArgs = (() => {
        try {
          return JSON.parse(toolCall.function.arguments || "{}");
        } catch {
          return {};
        }
      })();

      const result = await executeTool(funcName, funcArgs);
      const resultStr = typeof result === "string" ? result : JSON.stringify(result);

      onToolCall?.(funcName, funcArgs, resultStr);

      // 🔴 添加工具消息
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: resultStr,
      });

      // 如果模型明确结束，不再继续
      if (finishReason && finishReason !== "tool_calls") {
        break;
      }
    }

    onDone?.();
  } catch (error) {
    onError?.(error);
  }
};
```


###  代码逻辑
> 建议结合完整代码看  截个图放旁边最佳

**处理流式数据**

**单工具调用时，无论返回了多少个chunk -->index 的值始终为0**

chunk1(告诉你函数名，没返回任何文本信息 delta为空):
```js
{
  choices: [{
    delta: {
      role: "assistant",
      tool_calls: [{
        index: 0,
        id: "call_abc123",
        type: "function",
        function: { name: "get_current_weather", arguments: "" }
      }]
    },
    finish_reason: null
  }]
}
```
这个chunk可以知道deltaToolCalls

然后因为一开始toolCall是个null   所以要进行初始化 然后拼接

chunk2：

```js
{
  choices: [{
    delta: {
      tool_calls: [{
        index: 0,
        function: { arguments: "{\"location\":" }
      }]
    }
  }]
}

```

chunk3：

```js
{
  choices: [{
    delta: {
      tool_calls: [{
        index: 0,
        function: { arguments: "\"北京\"}" }
      }]
    },
    finish_reason: "tool_calls"
  }]
}
```


拼接后 ：

```js
toolCall = {
  id: "call_abc123",
  type: "function",
  function: {
    name: "get_current_weather",
    arguments: "{\"location\":\"北京\"}"  // 完整的 JSON 字符串
  }
}
```

**3.构造标准assistant信息**

**！！！ toolCall 是有固定格式的**

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/14f82084bafa4051926a1bf31c87e218.png)


此时的message ：
```js
messages = [
  { role: "user", content: "北京天气怎么样？" },
  { 
    role: "assistant",
    content: null,
    tool_calls: [{
      id: "call_abc123",
      type: "function",
      function: {
        name: "get_current_weather",
        arguments: "{\"location\":\"北京\"}"
      }
    }]
  }
]
```
**将工具信息添加到messages**

此时的messages:


```js
 [
      { role: "user", content: "北京天气怎么样？" },
      { 
        role: "assistant",
        content: null,
        tool_calls: [{ id: "call_abc123", ... }]
      },
      {
        role: "tool",
        tool_call_id: "call_abc123",
        content: "{\"temperature\":15,\"weather\":\"晴天\"}"
      }
]
```
**进入二次循环**

再次循环调用AI 但这次messages包含了工具结果  AI看到工具结果后开始生成自然语言服务

这次`delta`有数据了 就开始调用`onToken`每次触发 前端可以逐字显示  最后的`contentBuffer`就是一个完整句子："北京今天天气晴朗，温度15度。"
<hr>
<br>
<br>



最终的messages:

```js
messages = [
  { role: "user", content: "北京天气怎么样？" },
  { role: "assistant", content: null, tool_calls: [...] },
  { role: "tool", tool_call_id: "call_abc123", content: "{...}" },
  { role: "assistant", content: "北京今天天气晴朗，温度15度。" }
]
```
循环结束 触发`onDone`  对话结束


# 流式调用（并行工具）
**核心参数 parallel_tool_calls:true**

并行工具实际上是为了支持询问多次

以北京上海天气为例

单个工具只会接收北京的天气  因为目前只能执行天气函数  location 是北京
并行工具就可以调用多次  

## 函数

```js
/**
 * 流式工具调用（支持多工具并行）
 * @param {string} userMessage - 用户消息
 * @param {string} model - 模型名称
 * @param {function} onToken - 文本增量回调 (delta: string) => void
 * @param {function} onToolCall - 工具调用回调 (toolName, args, result) => void
 * @param {function} onDone - 完成回调 () => void
 * @param {function} onError - 错误回调 (error) => void
 */
export const streamChatWithTools = async (
  userMessage,
  model = "qwen-plus",
  { onToken, onToolCall, onDone, onError } = {}
) => {
  const messages = [{ role: "user", content: userMessage }];
  console.log("streamChatWithTools");

  try {
    // 可能发生多轮：模型产生 tool_calls -> 执行工具 -> 继续流式总结
    while (true) {
      const stream = await openai.chat.completions.create({
        model,
        messages,
        tools,
        tool_choice: "auto",
        parallel_tool_calls: true, // 支持并行工具调用
        stream: true,
      });

      // 聚合流式增量：按 index 累积 tool_calls
      const toolCallsMap = new Map(); // 用来拼接工具调用的增量 index -> { id, type, function: { name, arguments } }
      let contentBuffer = ""; //用来拼接文本的增量
      let finishReason = null; // 用来记录结束原因

      for await (const chunk of stream) {
        // 工具函数名称：仅在第一个流式返回的对象（delta）中出现。
        const choice = chunk.choices?.[0];
        if (!choice) continue;
        // 文本增量
        const delta = choice.delta?.content || "";
        console.log(choice.delta, "choice.delta");

        if (delta) {
          contentBuffer += delta;
          onToken?.(delta);
        }

        // 工具调用增量（OpenAI 风格：按 index 累积）
        const deltaToolCalls = choice.delta?.tool_calls || [];
        for (const tc of deltaToolCalls) {
          const idx = tc.index ?? 0;

          //   先创建后赋值
            // 如果是这个工具的第一次出现，初始化空对象
          if (!toolCallsMap.has(idx)) {
            toolCallsMap.set(idx, {
              id: tc.id || "",
              type: "function",
              function: { name: "", arguments: "" },
            });
          }
           // 获取当前工具的累积对象
          const current = toolCallsMap.get(idx);
             // 拼接 ID（通常只在第一个 chunk 有）
          if (tc.id) current.id = tc.id;
           // 拼接函数名（可能分多次推送："get" + "_current" + "_weather"）
          if (tc.function?.name) current.function.name += tc.function.name;
             // 拼接参数（JSON 字符串分多次推送：'{"loc' + 'ation":"北京"}'）
          if (tc.function?.arguments)
            current.function.arguments += tc.function.arguments;
        }

        // 结束原因
        if (choice.finish_reason) {
          finishReason = choice.finish_reason;
        }
      }

      // 本轮流式结束，若有内容则加入消息
      const assistantMessage = {
        role: "assistant",
        content: contentBuffer || null,
      };
      const toolCalls = Array.from(toolCallsMap.values()).filter((tc) => tc.id);
      if (toolCalls.length > 0) {
        assistantMessage.tool_calls = toolCalls;
      }
      messages.push(assistantMessage);

      // 没有工具调用，流程结束
      if (toolCalls.length === 0) {
        break;
      }

      // 并行执行所有工具
      const toolMessages = await Promise.all(
        toolCalls.map(async (tc) => {
          const funcName = tc.function.name;
          const funcArgs = (() => {
            try {
              return JSON.parse(tc.function.arguments || "{}");
            } catch {
              return {};
            }
          })();

          const result = await executeTool(funcName, funcArgs);
          const resultStr =
            typeof result === "string" ? result : JSON.stringify(result);

          // 通知前端工具调用结果
          onToolCall?.(funcName, funcArgs, resultStr);

          return {
            role: "tool",
            tool_call_id: tc.id,
            content: resultStr,
          };
        })
      );

      // 批量加入工具消息
      messages.push(...toolMessages);

      // 如果模型明确 finish_reason !== 'tool_calls'，不再继续
      if (finishReason && finishReason !== "tool_calls") {
        break;
      }
    }

    onDone?.();
  } catch (error) {
    onError?.(error);
  }
};

```




这个我就不多说了
中间部分的实际上核心还是进行拼接 用`map` `数组`都可以   

然后使用`Promise.all`并行调用 拿到所有结果再给AI处理

**官方的单（多）个工具通用的方法：**


```js
const toolCalls = {};
for await (const responseChunk of stream) {
  const deltaToolCalls = responseChunk.choices[0]?.delta?.tool_calls;
  if (deltaToolCalls) {
    for (const toolCallChunk of deltaToolCalls) {
      const index = toolCallChunk.index;
      if (!toolCalls[index]) {
        toolCalls[index] = { ...toolCallChunk };
        if (!toolCalls[index].function) {
            toolCalls[index].function = { name: '', arguments: '' };
        }
      } 
      else if (toolCallChunk.function?.arguments) {
        toolCalls[index].function.arguments += toolCallChunk.function.arguments;
      }
    }
  }
}
```

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/153641675)

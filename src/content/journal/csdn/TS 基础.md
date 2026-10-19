---
title: "TS 基础"
description: "回顾 TypeScript 与 JavaScript 的关系、特点和使用环境。"
type: journal
occurredAt: 2024-10-27
publishedAt: 2024-10-27
tags:
  - TypeScript
sourceUrl: https://blog.csdn.net/HBR666_/article/details/143270412
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/56a78932bbdf4fb6a023e04d81441011.jpeg
---
# 基础
## 简介
1.以javascript 为基础构建的语言
2.一个js的超集
3.可以在任何支持js的平台中执行
4.Ts扩展了Js 并添加了类型
## 环境搭建
1.cmd   全局下载 npm i -g typescript
2.创建一个ts文件
3.使用tsc对ts文件进行编译
   进入命令行
    进入ts文件所在目录
   执行命令：tsc xxx.ts
##  为何需要TS
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b510c73522aa4ad3bfcf5feef9e6547e.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ef22e45fe35b47359d6ef8fff42323d2.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f8f8c0539f0f40558bf684d1e1e4c6bf.png)![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a14a06eeb8b441448aa88bc17be09f94.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b5dfe6f94a1f48cfa513f1d63b18a44e.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/73eacabb4fb7455a930f29e04a1a0073.png)
##  编译TS
浏览器不能直接运行TS代码，需要编译成JS再交由浏览器解析器执行

###  1.命令行编译
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e3184a2ab97242a4a617bc4c234525ad.png)
###  2.自动化编译
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0d9d41dac9314e1195d6e7cc9d8b2b24.png)

##  类型声明

使用：对变量或函数形参，进行类型声明
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5f8aff8cb54e4bb587d00e650014adc8.png)
在：后也可以写字面量类型  不过实际开发中用的不多

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/333ad1e3ec234dfba7c32470e3f25a52.png)

##  类型判断

TS会根据我们的代码，进行类型的推到，例如下面代码中的变量d，只能存储数字

```go
let d = -99 //TypeScript会推断出变量d的类型是数字
d = false //警告：不能将类型“boolean”分配给类型“number”
```

但要注意 类型推断不是万能的，面对复杂类型时推断容易出问题，所以尽量还是明确的编写类型声明！
##  类型总览
js中的数据类型
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a25bc371b62645f2883a53e467180ceb.png)
TS的数据类型
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ce1404d080104a1b92073d57e0894814.png)
注意点！

> 在 JavaScript 中的这些内置构造函数： Number 、 String 、 Boolean ，⽤于  创建对应的包装对象，
> 在⽇常开发时很少使⽤，在 TypeScript 中也是同理，所以  在 TypeScript 中进行类型声明时，通常都是用小写的
> number 、 string 、 boolean


例如下面代码

```javascript
let str1: string
str1 = 'hello'
str1 = new String('hello') //报错
let str2: String
str2 = 'hello'
str2 = new String('hello')
console.log(typeof str1) //string
console.log(typeof str2) //Object
```



原始类型VS包装对象

> 原始类型：如 number 、 string 、 boolean ，在 JavaScript 中是简单数据类型，它们在内存中占⽤空间少，处理速度快。
包装对象：如 Number 对象、 String 对象、 Boolean 对象，是复杂类型，在内存中占⽤更多空间，在⽇常开发时很少由开发⼈员⾃⼰创建包装对象
> 2. ⾃动装箱：JavaScript 在必要时会⾃动将原始类型包装成对象，以便调⽤⽅法或访 问属性 例如 字符串身上没有.length属性 但是 str.length的时候可以读取到值
> ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ad471f8ad56548a1958aae2697dec053.png)


##  常用类型
###  any
any的含义是：任意类型 一旦将变量类型限制为any，则意味着放弃了对该变量的类型检查
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/83bbedcb18174fa3ab51713a4e164c8d.png)
注意：any类型的变量，可以复制给任意类型的变量 且该变量的类型会随着any类型的变量改变
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ca1bebdc673545208c5c65b47e04d855.png)
console.log(typeof x); //number
###  unknown
unknown 的含义是：未知类型，适⽤于：起初不确定数据的具体类型，要后期才能确定
unknown 可以理解为⼀个类型安全的 any 。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/38938307cfac462c98405733da8728a3.png)
unknown 会强制开发者在使⽤之前进⾏类型检查，从⽽提供更强的类型安全性。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/93b8fe1eba83435ebca2ff566d02cc5f.png)
读取 any 类型数据的任何属性都不会报错，而 unknown 正好与之相反

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5738fef458ea4f478bd09afae2758f53.png)
###  never （几乎不用）
never的含义是：任何值都不是，即：不能有值，例如 undefined 、 null 、''、 0 都不行！
1.几乎不用never去直接限制变量，因为没有意义 例如：
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/126daa268013428b903a85009f7a3873.png)
2.never一般是TypeScript主动推断出来的，例如：
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/03e3c275998a41888e21482a4501863f.png)
3.never也可用于限制函数的返回值
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c7eca80b9ab045eab461352afafe0a97.png)
###  void
void含义是空   即：函数不返回任何值 调用者也不应依赖其返回值进行任何操作
1.void通常用于函数返回值声明
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7681ec6b65cd48f3b837b137c457624e.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b91fa6b0f3234cef8ae66c83c540412b.png)
2.以下写法均符合规范
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/cefb9a97ee2c477b90013714b8b29412.png)
3.限制函数返回值时 是不是undefined 和void 就没区别呢？ 
----有区别  因为还有这句话 【返回值类型为void 的函数 调用者不应依赖其返回值进行任何操作】
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/097cdc9bfa2145b592b67ec3927af724.png)
理解  声明void 后   在TS层面是不希望通过返回值来进行一系列操作 所以报错
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/915e0347ffa34f18b2f4b0cafbdf9d35.png)

> 理解：void & undefined
void 是一个广泛的概念  用来表达“空”  而undefined则是这种“空”的具体实现
因此可以说undefined 是void能接受的一种 "空" 的状态
也可以理解为  void 包含 undefined  但void所表达的语义超越了undefined  void是一种意图上的约定  而不仅仅是特定值的限制
总结：
如果一个函数的返回类型是void 那么：
从语法上讲：函数可以返回undefined  至于显式返回 还是 隐式返回  这无所谓  
从语义上讲  函数调用者不应关心函数返回的值  也不应依赖返回值进行任何操作!  即使我们知道了它返回了undefined



###  Object（少用）
关于 Object 和 object    实际开发中用的相对较少  因为范围太大了

object（小写）
object （⼩写）的含义是：所有⾮原始类型，可存储：对象、函数、数组等，由于限制 
的范围⽐较宽泛，在实际开发中使⽤的相对较少。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/10d65cbab58440878bd6ad972d295731.png)
Object（⼤写）
官⽅描述：所有可以调用 Object 方法的类型（如toString）。 
简单记忆：除了 undefined 和 null 的任何值。 
由于限制的范围实在太大了！所以实际开发中使⽤频率极低。 
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4458bd0ab2bd4cdeb8874f57a060ae64.png)
###  声明对象类型
1.实际开发中：限制一般对象 通常用以下形式
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3547dc8f210345eb96a4a5c1c324be2b.png)
2.索引签名：允许定义对象可以具有任意数量的属性 ， 这些属性的键和类型是可变的，
   常用于：描述类型不确定的属性（具有动态属性的对象）

含义:除了这两个以外  可以有任何一个key，只要key是字符串就可以  且key所对应的值可以是任何的值
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/43f0f4a6d8994d0ca846ee61c6a4be5f.png)
声明函数类型
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7e0479f1f07c411abd4e136847797bb1.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/eef9b4e4a19a4cba810f4a13b24ac087.png)
###  声明数组类型
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/723cf6b9e57a48f6a547faaee2e2eb4d.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c736dabb35a14614959218869ca30831.png)
###  tuple
元组是一种特殊的数组类型 可以存储固定数量的元素  并且 每个元素的类型是已知的且可以不同 元组用于精确描述一组值的类型    ？表示可选元素
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/41687b62bdb24f3ebaee26d39c5d3a34.png)

###  enum（重要）

> 枚举（enum）可以定义一组命名常量 它能增强代码的可读性  也让代码更好维护
> 
如下代码的功能是：根据调⽤ walk 时传⼊的不同参数，执行不同的逻辑，存在的问题是调用 w 
alk 时传参时没有任何提示，编码者很容易写错字符串内容；并且用于判断逻辑的 up 、 dow 
n 、 left 、 right 是连续且相关的⼀组值，那此时就特别适合使用 枚举（ enum ）
#### （1）数字枚举
数字枚举⼀种最常⻅的枚举类型，其成员的值会⾃动递增，且数字枚举还具备反向映射的 
特点，在下⾯代码的打印中，不难发现：可以通过值来获取对应的枚举成员名称 。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0f955c960a00458c9d16c7664bcfe91f.png)
也可以指定枚举成员的初始值 其后的成员值会自动递增
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/dd06ab266fb84a728f48e1c057c1ce41.png)
使⽤数字枚举完成刚才 walk 函数中的逻辑，此时我们发现： 代码更加直观易读，⽽且类 
型安全，同时也更易于维护
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3b8faa3fc0004a8995c86d41c0722a2f.png)
####  （2）字符串枚举
注意:字符串枚举没有反向映射
枚举成员的值是字符串
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2f08b32c73de48b7a5f77d6b775d99a0.png)
####   （3）常量枚举
> 
> 官方描述：常量枚举是一种特殊的枚举类型 它使用const关键字定义 在编译时会内联 避免产生一些额外的代码
> 
> 何为编译时内联？ （了解） 所谓“内联”其实就是 TypeScript 在编译时，会将枚举成员引⽤替换为它们的实际值，
> ⽽不是⽣成额外的枚举对象。这可以减少⽣成的 JavaScript 代码量，并提⾼运⾏时性能


###  type
type 可以为任意类型创建别名，让代码更简洁、可读性更强，同时能更方便地进行类型复用和 扩展

####  基本用法

> 类型别名使用 type 关键字定义， type 后跟类型名称，例如下面代码中 num 是类型别名。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/437641b5a3a247a1b63a260cf805a5a5.png)
#####  联合类型（或）
> 联合类型是⼀种⾼级类型，它表示⼀个值可以是⼏种不同类型之⼀。 
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8b00de4f65f84d7f8804ecb7dc887389.png)
#####   交叉类型（且）

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/20734078a42e4cceb81535cb3e27fb29.png)
###  一个特殊的情况
如下两段代码：
代码1（正常）：
在函数定义时，限制函数返回值为void 那么函数的返回值必须是空
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9034b8b1bdb94272a4d74393bd9fc869.png)
代码2（特殊）
使用 类型声明  限制函数返回值为 void 时， TypeScript 并不会严格要求函数返回空。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2fd67f7451f54ce9958e0146a5e9094a.png)
为什么？
是为了确保如下代码成立，我们知道 Array.prototype.push 的返回值是一个数字， 
⽽ Array.prototype.forEach 方法法期望其回调的返回类型是 void （即不用return）。

箭头函数如果只有一句话 那么会默认这句话是返回值 （而push的返回值是number），如果做严格限制会出错 
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a7c8b6402ae7439098019478e6da33dd.png)
下方代码 虽然有返回值x  但是不能进行任何操作   因为声明的返回值是void
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5135cc8b095f4eb984cf3d6f74ea72e7.png)
而map 和find需要返回值
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e40daeebc62c4ef5b00ba8cec2b6ad53.png)


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/143270412)

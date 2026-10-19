---
title: "TS（类、接口、泛型）"
description: "从数据模型、类的契约和代码复用三个角度理解 TypeScript。"
type: journal
occurredAt: 2024-11-03
publishedAt: 2024-11-03
tags:
  - TypeScript
sourceUrl: https://blog.csdn.net/HBR666_/article/details/143466755
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/06c21fcea23e4259ad8bc3b2985ad175.jpeg
---
#  类
##  复习相关知识
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/76ea4f9267314641abba61476795900d.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fb46a018ee584926afbf6e0dc3277936.png)
## 属性修饰符
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/aabbe611b76a4df788921cb4a87c9e3c.png)

###  public 修饰符
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d367cd298d7248618d2f8391e3f89bc5.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5e20c567b0af438ea63e5e26a5f2b0ea.png)
###  属性的简写形式
完整写法

```typescript
class Person {
  public name: string;
  public age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```
简写形式

```typescript
class Person {
  constructor(
    public name: string,
    public age: number
  ) { }
}
```

##  protected修饰符
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2e348b2b256641ff89bee8db2b2779c2.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2d9361d3d7854017b5cb5d325c44f9ac.png)


###  private修饰符
  

```typescript
class Person {
  constructor(
    public name: string,
    public age: number,
    // IDCard属性为私有的(private)属性，只能在【类内部】使⽤
    private IDCard: string
  ) {}
  private getPrivateInfo() {
    // 类内部可以访问私有的(private)属性 —— IDCard
    return `身份证号码为：${this.IDCard}`;
  }
  getInfo() {
    // 类内部可以访问受保护的(protected)属性 —— name和age
    return `我叫: ${this.name}, 今年刚满${this.age}岁`;
  }
  getFullInfo() {
    // 类内部可以访问公开的getInfo⽅法，也可以访问私有的getPrivateInfo⽅法
    return this.getInfo() + "，" + this.getPrivateInfo();
  }
}
const p1 = new Person("张三", 18, "110114198702034432");
console.log(p1.getFullInfo());
console.log(p1.getInfo());
console.log(p1.name);

// 以下代码均报错
// p1.IDCard
// p1.getPrivateInfo()

```


###  readonly修饰符
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/090b5ad31b4f4dd6b1daa361379c6d39.png)
##  抽象类

> 概述：   抽象类是一种无法被实例化的类 专门用来定义类的结构和行为，类中可以写抽象方法也可以写具体实现
> 抽象类主要用来为其派生类提供一个基础结构 要求其派生类必须实现其中的抽象方法
> 
> 简记：抽象类不能实例化，其意义是可以被继承，抽象类里可以有普通方法，也可以有抽象方法 抽象方法没有函数体 （即没有{}）

过以下场景，理解抽象类
我们定义⼀个抽象类 Package ，表示所有包裹的基本结构，任何包裹都有重量属性 weight ，包裹都需要计算运费。但不同类型的包裹（如：标准速度、特快专递）都有不同的运费计算方式，因此用于计算运费的 calculate 方法是⼀个抽象方法，必须由具体的子类来实现。 

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/59ca79f13baf45059fe418ebde109d79.png)
StandardPackage 类继承了 Package ，实现了 calculate 方法：

> 第一个weight不写public的原因是因为 weight是父类的属性（本身写一般写法的时候就不需要声明
> 然后再在构造器里面写this.weight=weight）  只有子类独有的属性 使用简写形式的时候才需要public
> 
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e8ed91814b7145dc97459df9b0c2025d.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6873bc3afd844d98afc959b127fc656a.png)

> 总结：何时使用抽象类？
1.定义通用接口：为一组相关的类定义通用的行为（方法或属性）时
2.提供基础实现：在抽象类中提供某些方法或为其提供基础实现，这样派生类就可以继承这些实现
3.确保关键实现：在抽象类中提供某些方法或为其提供基础实现，这样派生类就可以继承这些实现
共享代码和逻辑：当多个类需要共享部分代码时，抽象类可以避免代码重复



# 接口（interface）

> interface是一种定义结构的方式，主要作用是为类  对象 函数等规定一种契约，这样可以确保代码的一致性和类型安全，但要注意
> interface 只能定义格式，不能包含任何实现


##  定义类结构
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0eae8a5bee6f4e6ab0d9a1315f928139.png)
##  定义对象结构
注意 对象结构不需要 implements
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/58331cfb485344c694e2bdc17a59d3b1.png)
## 定义函数结构
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1d8d3b4e8f2b49beb1640bba3d1e922e.png)
##  接口之间的继承
一个interface继承另一个interface从而实现代码的复用
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/66e76d3a480c4880a9656a09afa590b5.png)
##  接口自动合并 （可重复定义）
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/040d903407794740b611bd1d4b6759e6.png)

> 何时使用接口
> 1.定义对象的格式：描述数据模型，API响应格式，配置对象等等 是开发中用的最多的场景
> 2.类的契约：规定一个类需要实现哪些属性和方法
> 3.扩展已有接口：一般用于扩展第三方库的类型，这种特性在大型项目中可能会用到


##   一些相似的概念的区别
###  1.interface和type的区别
相同点：interface和type都可以用于定义对象的结构  在定义对象结构时，两者可以互换
不同点：interface 更专注于定义对象和类的结构 支持继承 合并
               type可以定义类型别名 联合类型  交叉类型 但不支持继承和自动合并
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/11dd0fbb360e43c0826d47fcb907be32.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/cb6a14839ee445d8843ddc1ec2c7da2b.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/82175c5e3692405cabac2b4b3bb63860.png)
###   2.interface和抽象类的区别
相同点:都能定义一个类的格式（定义类应遵循的契约）
不相同：
   接口： 只能描述结构  不能有任何实现代码  一个类就可以实现多个接口
   抽象类： 既可以包含抽象方法 也可以包含具体方法  一个类只能继承一个抽象类

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f5427b996bde423b9c0d2484a4a2ee57.png)

#  泛型

> 泛型允许我们在定义函数、类或接⼝时，使⽤类型参数来表示未指定的类型，这些参数在具体使⽤时，才被指定具体的类型，泛型能让同⼀段代码适⽤于多种类型，同时仍然保持类型的安全性


举例：如下代码中<T> 就是泛型（ 不一定非叫T ） 设置泛型后即可在函数中使用T来表示该类型
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9b3f686575474c7ca715c71f609f9faa.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a52eb15cd3de4c5f8b5efdd9937d0a41.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b51f84a120fc44f29f58793dff7d242d.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/804a43ece20e4c0ab5a5501a61d48509.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/38e1240197cd47b994c79400cb3c94fd.png)


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/143466755)

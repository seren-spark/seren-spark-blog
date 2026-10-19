---
title: "Thymeleaf（2）"
description: "记录项目推进过程中的 Thymeleaf 学习笔记。"
type: journal
occurredAt: 2024-04-21
publishedAt: 2024-04-21
tags:
  - Java
sourceUrl: https://blog.csdn.net/HBR666_/article/details/138034762
sourceName: CSDN
relatedDocs: []
---
#  遍历
##  th:each
###   1.特点
特点
循环对象如果是null，不存在则不循环
循环包含自身和标签内全部内容
可以遍历的对象： 数组，任何实现java.util.Iterable 接口的对象，枚举，实现Map接口对象

###  2.遍历List集合
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/bc76c18808c9ed6f25b00dc7e8b110cc.png)
链接地址，点击后直接跳转到each.html 页面
 
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5ae79ba17b8283e7a2b22b50355eadab.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3b3a43a14d2baf6989ff31cbca615c62.png)

### 3遍历Map集合

Map
值可以循环，但是顺序无法保证
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/bc7f6610bf28b48920ead970aae2f0c6.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8912c3a375ae76c495e384103fdcb902.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e394b6a6b1ed961ab95334bcf80a85f7.png)

###  4.遍历ListMap集合
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/41866919766766f5b392ab8c26e554f9.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b610fdef7429786b53baf2c00fb6a8c4.png)
LIstmap中有两个map集合
ul循环的是listmap中的两个map集合。
li是循环每个map中的元素

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/66f429e5938946b19782fb73fc3ac232.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a9c8abb169929a36e019ca2ad640be38.png)

###  5.循环数组
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fac24360ca1883cb07b4a4e9de950a18.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ca6fac4eaf3d4b0fd310eff2977efab4.png)
###  6.循环下拉列表
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/542cd7722f34f478c9f35302108d2adc.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7492397a0967b863003ac404ba240fde.png)
### 7循环变量
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/95092169a93f903cadcbfaf34f143c6f.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c4e1b7f15eb928b5eb4bba0269c1f821.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2f6dc0af9727f485af3e75a34f5f7f66.png)
##  2.th:swtich
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6fa47f244d7c961a22d5d818fcfffe59.png)
## 3.添加属性
追加一个active属性
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/915a34c75f8b558425f516ee82ef7c4f.png)
给最后一个元素追加属性（stat是自定义名字）
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3b540ed07e0b1f8a68f1321d4e1931ec.png)
#  文本表达式
文本文字只是在单引号之间指定的字符串，可以包含任何字符包括空格
如果字符之中没有空格，可以不加单引号，使用+或|连接文本
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/83e008ec3adc943bab22fa0e46214a79.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d6b7d6108310d7d84ca64284a9824f33.png)
#  数字表达式
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b7ac4ebb83e93b892ca79f31e4c03069.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3a46a1b59a388e97782defd221fdaf56.png)
n1 100  n2  20
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d3d2ec6ae5696ca66fdeb914836480eb.png)
#  布尔表达式

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/364cde4802ea4a659623f3d971f0362b.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f685784b24a899093f51fa1c28a2fef8.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7da6a94c2005cbef341231b304d793b5.png)
#  null和空字符串
空字符串和NUll值所在的元素会被忽略，当有值时会出现
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b90f5d91d888661fb1b70674364daf8f.png)
#  逻辑运算符
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9bb39ea1bd082fa7a1ab7ceb128f6abf.png)
如果为假，则内容不显示
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/30beb8dfb2ccf25750de3cadd43ac0d4.png)
# 三元运算符
三元运算与js基本一致，如A>B？X:Y，在X Y中可以继续嵌套，只是thymeleaf中需要使用括号括起来否则报错
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/647fbe2bb28772055e64cca378e2c200.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/883ce4f06f054395a8ad412cc58fd12f.png)
# 设置属性值
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/21ae4bcfbd8c593769c7c72ffce3c153.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2a76a1c864e3003a11409e6be4e47c25.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/be04b39855b9798c655dd74c915b7c71.png)
## th:attr
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7b9d4e4de53f0318cc18c6075404aac0.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9ad9975e8702dad6c0c0cffc4663d89b.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f121150ce610ff11c6b655c8e7dec223.png)
注意：设置点击函数时，onclick时间中的函数要用单引号括起来否则会报错
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9b26ea1b8c14c0cd8c261a07df9a4c31.png)
# 判断if&unless
注意：thymeleaf中，true不是唯一满足条件
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9602fc5b13de34029ade8707edac60f0.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d2c99373f9aae4ceac76b95c60d83bf7.png)
##  1.th:if
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/de27c4dd0222122777978b69d93170f5.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/494223b047f5bfd5d97854b9a68d07a4.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/043f50e396b7f0708d4541e5bf17d896.png)
##  2.th：unless
不满足条件时显示片段，类似java中的if的else的部分
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9930db6955a1e92738f759b0128387f3.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/47a7c7d1d6c7953784342d7c3099adcb.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/042404a8bad96e65c6fb5bd9a2ff7ed8.png)
# 删除
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/94d873c49a5dbd5c80e570807493c52a.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/20e8d5649f1647ce024900401c867cf1.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/cb12d470c9e94b2f037d78e71e8699eb.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5f7bb17ad06232c30f29b88ac8b82a37.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8d408239c1d7f4c283e4ceeba4dac663.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/319e4235966369dc8b2c655208e2fcc9.png)
# 局部变量
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/cdfbacec7b57fdaf03320a5817132664.png)
#  本周总结
我们这组进度还是有点慢，项目要抓紧赶了

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/138034762)

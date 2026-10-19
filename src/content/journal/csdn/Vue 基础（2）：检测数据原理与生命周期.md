---
title: "Vue 基础（2）：检测数据原理与生命周期"
description: "回顾 Vue 指令、配置对象回调和生命周期相关知识。"
type: journal
occurredAt: 2024-10-06
publishedAt: 2024-10-06
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/142725143
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/bf04ce8c4a294c0fb4230cf8ba1d6b41.png
---

# 检测数据原理

> 1.Vue会监视data中的所有层次的数据
> 2.如何监测对象中的数据  通过setter监视，且要在new Vue时就检测数据  
> （1）.对象中后追加的属性，Vue默认不做响应式原理    
> （2）如需给后添加的属性做响应式，请用如下API
> 
>         Vue.set(target,propertyName/index,value)或
>         vm.$set(target,propertyName/index,value)
> 3.如何监测数组中的数据？
>       通过包裹数组更新元素的方法实现，本质就是做了两件事
>       （1）调用原生对应的方法对数组进行更新
>       （2）重新解析模版，进而更新页面
> 4.在Vue修改数组中的某个元素一定要用如下方法：
>        （1）使用这些API：push()，pop(),shift(),unshift(), splice(),sort(),reverse()
>           (2) Vue.set() 或vm.$set() 特别注意：Vue.set()  和vm.$set() 不能给vm或vm的根数据对象添加属性
> 
> 数据劫持：意思就是，把data里的所有属性加上set、get 就叫劫持

```html
<div id="root">
  <h2>学生信息</h2>
  <button @click="student.age++">年龄+1岁</button>
  <button @click="addSex">添加性别属性 默认值为男</button>
  <button @click="student.sex='未知'">修改性别属性</button>
  <button @click="addFriend">在列表首位添加一个朋友</button>
  <button @click="updateFirstFriendName">
    修改第一个朋友的名字是：张三
  </button>
  <button @click="addHobby">添加一个爱好</button>
  <button @click="updateHobby">修改第一个爱好为：开车</button>
  <button @click="removeSmoke">过滤掉爱好中的抽烟</button>
  <h2>姓名：{{student.name}}</h2>
  <h2>年龄：{{student.age}}</h2>
  <h2 v-if="student.sex">性别:{{student.sex}}</h2>
  <h2>爱好</h2>
  <ul>
    <li v-for="h in student.hobby">{{h}}</li>
  </ul>
  <h2>朋友</h2>
  <ul>
    <li v-for="f in student.friends">{{f.name}}--{{f.age}}</li>
  </ul>
</div>
</body>
<script type="text/javascript">
  const vm = new Vue({
    el: "#root",
    data: {
      student: {
        name: "TOM",
        age: 18,
        friends: [
          { name: "jerry", age: 35 },
          { name: "tony", age: 36 },
        ],
        hobby: ["抽烟", "喝酒", "烫头"],
      },
    },
    methods: {
      addSex() {
        //   Vue.set(this.student, "sex", "男");
        vm.$set(this.student, "sex", "男");
      },
      addFriend() {
        this.student.friends.unshift({ name: "sunny", age: 30 });
      },
      updateFirstFriendName() {
        this.student.friends[0].name = "张三";
      },
      addHobby() {
        this.student.hobby.push("打游戏");
      },
      updateHobby() {
        //   this.student.hobby.splice(0, 1, "开车");
        Vue.set(this.student.hobby, 0, "开车");
      },
      removeSmoke() {
        this.student.hobby = this.student.hobby.filter((h) => {
          return h !== "抽烟";
        });
      },
    },
  });
</script>
```
##  1.更新时遇到的问题
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/bf04ce8c4a294c0fb4230cf8ba1d6b41.png)
当使用注释的方法时，在页面上点击按钮 数据会实时更新 
但是如果直接整个修改索引为0的数据，点击按钮，页面数据并不会更新，但是在控制台中打印vue，数据已经更新过了
我的理解： 当data中的数据被更改时，vue的底层会调用setter，从而实现对页面的监测和实时修改的作用。但若是直接替换掉整个数据的话，就会跳过setter，所以vue无法监测并修改页面信息。
## 2.检测数据的原理-对象
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1c611dadc15b4c869f3c66e4b4539ac5.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4554413303a64e3991f635ed54853f4c.png)

## 3. vue.set()的使用
不能直接给Vue实例的根数据对象添加属性 也不能给vue实例添加属性 
**Vue.set(vm.data，‘属性名’，‘属性值’)  不行
Vue.set(vm，‘属性名’，‘属性值’)也不行**
#  收集表单数据

> 若 <input type="text" />  则v-model收集的是value值，用户输入的就是value值 若 <input
> type="radio" /> 则v-model收集的是value值  且要给标签设置value值 若 <input
> type="checkBox" /> 
>      1.没有配置input的value属性：那么收集的就是checked （勾选or 未勾选  是布尔值）
>      2.配置input的value属性：
>           （1）v-model的初始值是非数组 那么收集的就是checked （勾选or 未勾选  是布尔值）
>           （2）v-model的初始值是数组，那么收集的就是value组成的数组 备注:v-model 的三个修饰符：
>          lazy：失去焦点再收集数据 
>          number：输入字符串转为有效数字   <input type="number" v-model.number="age" />
>          trim：输入首尾空格的过滤


#  过滤器

> 定义：对要显示的数据进行特定格式化后再显示（适用于一些简单的逻辑处理） 语法：
>    1.注册过滤器：Vue.filter(name,callback) 或 new Vue{ filters:{}}
>    2.使用过滤器 ：{{ xxx | 过滤器名}} 或 v-bind:属性="xxx | 过滤器名" 备注：
>     1.使用过滤器也可以接收额外参数、多个过滤器也可以串联
>     2.并没有改变原本的数据，是产生新的对应的数据


注意: 并没有改变原本的数据，是产生新的对应数据

```go
 <div id="root">
      <h2>显示格式化后的时间</h2>
      <!-- 计算属性实现 -->
      <h2>现在是:{{fmtTime}}</h2>
      <!-- methods实现 -->
      <h2>现在是:{{getFmtTime()}}</h2>
      <!-- 过滤器实现 -->
      <h2>现在是:{{time | timeformater()}}</h2>
      <!-- 过滤器实现（传参） -->
      <h2>现在是:{{time | timeformater("YYYY-MM-DD") | mySlice}}</h2>
      <h3>尚硅谷</h3>
    </div>
    <div id="root2">
      <h2 :x="msg | mySlice">{{msg | mySlice}}</h2>
    </div>
  </body>

  <script type="text/javascript">
    //   全局过滤器
    Vue.filter("mySlice", function (value) {
      return value.slice(0, 4);
    });
    const vm = new Vue({
      el: "#root",
      data: {
        time: 1621561377603,
        msg: "hello,尚硅谷",
      },
      computed: {
        fmtTime() {
          return dayjs(this.time).format("YYYY-MM-DD HH:mm:ss");
        },
      },
      methods: {
        getFmtTime() {
          return dayjs(this.time).format("YYYY-MM-DD HH:mm:ss");
        },
      },
      //   局部过滤器
      filters: {
        timeformater(value, str = "YYYY-MM-DD HH:mm:ss") {
          return dayjs(value).format(str);
        },
        mySlice(value) {
          return value.slice(0, 4);
        },
      },
    });
    new Vue({
      el: "#root2",
      data: {
        msg: "hello world",
      },
    });
  </script>
```


#  内置指令
学过的指令：
*v-bind ：单向绑定解析表达式，可简写为XXX
v-model：双向数据绑定
v-for：遍历数组/对象/字符串
v-on：绑定事件监听，可简写为@ 
v-if:条件渲染（动态控制节点是否存在）
v-else：条件渲染（动态控制节点是否存在）
v-show：条件渲染（动态控制节点是否展示）*

## 1.v-text

> （1）作用:向其所在的节点中渲染文本内容 
> （2）与插值语法的区别：v-text会替换掉节点中的内容，{{xx}}则不会
##  2.v-html
> 1.作用：向指定的节点中渲染包含html结构的内容
> 2.与插值语法的区别: 
> (1).v-html会替换掉节点中所有的内容，{{xx}}则不会。
>  (2).v-html可以识别html结构。
> 3.严重注意:v-html有安全性问题!!!! 
>  (1).在网站上动态渲染任意HTML是非常危险的，容易导致xss攻击。 
> (2).一定要在可信的内容上使用v-html，永不要用在用户提交的内容上!

##  3.v-cloak
没有值
本质上是一个特殊属性，Vue实例创建完毕并接管容器口，会删掉v-cloak属性
使用css配合v-cloak可以解决网速慢时页面展示出{{xxx}}的问题

理解：如下方
当红色的js代码加载需要一段时间时，由于vue实例并没有解析模版，页面上会显示{{}}
如果使用v-cloak 会让代码在加载前，具有该属性的元素不在页面上显示，加载完毕后才可以显示

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6dfbbaac9b744573a0c689960907a69c.png)
##  4.v-once
v-once所在节点初次动态渲染后，就视为静态内容了
以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0b917b6f4ea74530bdf553ad786eb5f1.png)
##  5.v-pre

> 跳过其所在节点的编译过程 可利用它跳过：没有使用指令的语法，没有使用插值语法的节点，会加快编译

#  自定义指令
 一、定义语法：
      （1）局部指令：
      （2）全局指令：
 二、配置对象中常用的三个回调
    （1）bind 指令与元素成功绑定时调用
    （2）inserted：指令所在元素被插入页面时调用
    （3）update：指令所在模版结构被重新解析时调用
三、备注：
    1.指令定义时不加v- 但使用时要 v-
    2.指令名如果是多个单词，要使用x-x命名方式 不要用驼峰

注意：指令中所有的this都是window  与是否是箭头函数 普通函数无关

```go
  <body>
    <!-- 定义v-big指令 与v-text功能类似 但会把绑定的数值放大10倍。 -->
    <!-- 定义一个v-fbind指令，和v-bind功能类似，但可以让其所绑定的input元素默认获取焦点 -->
    <div id="root">
      <h2>当前的n值是:<span  v-text="n"></span></h2>
      <h2>放大的n值是:<span  v-big="n"></span></h2>
      <hr>
      <button @click="n++">点我n+1</button>
    
      <input type="text" v-fbind:value="n"></input>
    </div>
  </body>
  <script type="text/javascript">
    //   全局指令
    Vue.directive('fbind2',{
         // 指令与元素成功绑定时（一上来）
         bind(el,binding){
                console.log(this);//注意此处的this是window
                console.log(binding);
                
                el.value = binding.value
            },
            // 指令所在元素被插入页面时
            inserted(el,binding){
                el.focus()
            },
            // 指令所在模版被重新解析时
            update(el,binding){
                el.value = binding.value
                el.focus()
            },
    })
    const vm = new Vue({
      el: "#root",
      data: {
      n:1
      },
    //   局部指令
      directives:{
        // big函数何时被调用？ 
        // 1.指令与元素成功绑定时（一上来）
        // 2.指令所在模版被重新解析时（任一属性改变）
        big(el,binding){
            console.log('big',this);//注意此处的this是window
          el.innerText = binding.value * 10
        },
        
        fbind:{
            // 指令与元素成功绑定时（一上来）
            bind(el,binding){
                console.log(this);//注意此处的this是window
                el.value = binding.value
            },
            // 指令所在元素被插入页面时
            inserted(el,binding){
                el.focus()
            },
            // 指令所在模版被重新解析时
            update(el,binding){
                el.value = binding.value
                el.focus()
            },
            
        }
      }
    });
  </script>
```


#  生命周期
*1.又名：生命周期回调函数、生命周期函数、生命周期钩子
2.是什么：Vue在关键时刻帮我们调用一些特殊名称的函数
3.生命周期函数的名字不可更改，但函数的具体内容是程序员根据需求编写的
4.生命周期函数中的this指向是vm 或组件实例对象*

> 常用生命周期钩子：
>    1.mounted：发送ajax请求，启动定时器，绑定自定义事件，订阅消息等【初始化操作】
>    2.beforeDestroyed：消除定时器，解绑自定义事件，取消订阅消息等【收尾工作】 关于销毁Vue实例：
>    （1）.销毁后借助Vue开发者工具看不到任何消息
>    （2）.销毁后自定义事件会失效，但原生DOM事件依然有效（高版本无效）
>     销毁后无法再调用自定义事件（失效），但已经执行了的自定义事件仍在运行（定时器一直跑）
>    3. 一般不会在beforeDestroy操作数据，因为即便操作数据，也不会再触发更新流程了


![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/31f903f84e1f46019726a7b8adab936e.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b2e4230a92654aa49dff4c40e1f4a9e6.png)

##  1.挂载流程

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1086bc0475c74e52a9f68e0e11e12734.png)
##  2.更新流程
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b21407e90b31451887f0854c2ea23c91.png)
##  3.销毁流程
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4620862aaec74469aa4c701615371157.png)

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/142725143)

---
title: "Vue（4）脚手架与 Vuex"
description: "整理 Vue 构建版本、脚手架和 Vuex 的基础知识。"
type: journal
occurredAt: 2024-10-20
publishedAt: 2024-10-20
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/143087958
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/0e8f6cbf3924484288b8c9734e880948.jpeg
---

# 脚手架
##  前言
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/aec13c7ab2074e379cb23b17ae6a4c0d.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/07b4b6f5edb54e8dac95ac046ba84776.png)

## render函数（关于不同版本的Vue）
main.js

```go
// 引入Vue
import Vue from "vue";
// 引入App组件，它是所有组件的父组件
import App from "./App.vue";
// 关闭Vue的生产提示
Vue.config.productionTip = false;

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

// 创建Vue实例对象
new Vue({
  el: "#app",
  // 将app放入容器
  render: (h) => h(App),
  // template: `<h1>你好</h1>` 用不了,
  //components:{APP}
});
```

> 关于不同版本的Vue
> 1.vue.js与vue.runtime.xxx.js的区别：
>     （1）vue.js 是完整版的Vue 包含：核心功能+模版解析器
>     （2）vue.runtime.xxx.js 是运行版的Vue 只包含：核心功能：没有模版解析器
> 2.因为vue.runtime.xxx.js 没有模版解析器，所以不能使用template配置项    需要使用render函数接收到的createElement函数（在页面创建元素）去指定具体内容

##  修改默认配置
Vue 脚手架隐藏了所有webpack相关配置
若想查看具体（不能改）的webpack配置，执行 vue inspect >output.js
使用vue.config.js可以对脚手架进行个性化定制，详情见：[配置](https://cli.vuejs.org/zh/config/#filenamehashing)

##  ref属性
1.被用来给元素或子组件注册引用信息（id的替代者）
2.应用在html标签上获取的是真实的DOM元素，应用在组件标签上的是组件的实例对象（vc）
3.使用方式： 
   打标识：`<h1 ref="xxx">.....</h1>` 



   或 `<School   ref="xxx"></School>`
   获取：`this.$refs.xxx`

注意：有点类似于document.getElementById,但是在组建标签上写id时，getElementById获取的是整个组件的DOM元素，并不是组件实例对象

```go
<template>
  <div>
    <h1 v-text="msg" ref="title"></h1>
    <button @click="showDOM">点我输出上方的DOM</button>
    <School ref="sch" id="sch" />
  </div>
</template>
<script>
  // 引入School组件
  import School from "./components/School";
  export default {
    name: "App",
    data() {
      return {
        msg: "hello",
      };
    },
    components: {
      School,
    },
    methods: {
      showDOM() {
        console.log(this.$refs.title); //真实DOM元素
        console.log(document.getElementById("sch")); //真实DOM元素;
        console.log(this.$refs.sch); //该组件的实例对象
      },
    },
  };
</script>
<style></style>
```

##  props配置
功能：让组件接收外部传过来的数据
（1）传递数据
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2edd18ebeebe4c6ca62fda8186a24166.png)

（2）接收数据
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/489503f860ab4cc2b213fab2fead9692.png)

> 备注:props是只读的，Vue底层会监测你对props的修改，如果进行了修改，就会发出警告
      但这个检测是浅层次的，如果修改了某个对象中的值，vue检测不到，就不会报错
       若业务需求确实需要修改  那么复制props中的内容到data一份，然后去修改data中的数据

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/280b5439c1d44abeb44186b0064b151b.png)
##  mixin混入
功能：可以把多个文件共用的配置提取成一个混入对象

使用方式：
    第一步：定义混合
    ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/34581cc4657e47ad99f46f99bf450e79.png)
第二步：使用混入，例如：
   （1）全局混入：Vue.mixin(xxx)
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ed79391820b04fd29833cfb4dec0a763.png)
 (2)  局部混入 :  mixins:['xxx']
 ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/17cef90fd95440ed8495c1abd58a7fa7.png)
注意：如果data中的数据，methods的方法名和mixin中的数据或方法名相同，优先使用data methods
           如果是生命周期钩子重名，两个方法同级，都会调用，并不存在优先使用谁
##  插件
功能：用于增强Vue
本质：包含install方法的一个对象，install的第一个参数是Vue，第二个以后的参数是插件使用者传递的数据
定义插件：
对象.install=function( Vue,options){...}
使用插件：`Vue.use(plugins，1,2,3);`
plugins.js

```go
export default {
  install(Vue) {
    // 全局过滤器
    Vue.filter("mySlice", function (value) {
      return value.slice(0, 4);
    });
    // 定义全局指令
    Vue.directive("fbind", {
      // 指令与元素成功绑定时（一上来）
      bind(el, binding) {
        el.value = binding.value;
      },
      // 指令所在元素被插入页面时
      inserted(el, binding) {
        el.focus();
      },
      // 指令所在模版被重新解析时
      update(el, binding) {
        el.value = binding.value;
        el.focus();
      },
    });
    // 定义混入
    Vue.mixin({
      data() {
        return {
          x: 100,
          y: 200,
        };
      },
    });
    //给Vue原型上添加一个方法(vm,vc都能用)
    Vue.prototype.hello = () => {
      alert("你好啊");
    };
  },
};

```

##  scoped
作用：让样式在局部生效，防止冲突
写法：![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/22d0637a515e4b459ade75f8cc4f71f7.png)
##  lang
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/dc0975fb1b284db1bf7abecb6189491c.png)
##  总结TodoList案例

> 1.组件化编码流程：
>     （1）拆分静态组件：组件要按照功能点拆分，命名不要与html元素冲突
>     （2）实现动态组件: 考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用
>             一个组件在用：放在组件自身即可
>             一些组件在用，放在他们共同的组件上 （状态提升）
>     （3）实现交互：从绑定事件开始
>   2.props适用于 
>      （1）  父组件==>子组件 通信
>      （2） 子组件==> 父组件 通信     （要求父先给子一个函数）
>   3.使用v-model时要切记：v-model绑定的值不能是props传过来的值
>       因为props是不可以修改的
>   4.props传过来的若是对象类型的值，修改对象中的属性时Vue不会报错，但不推荐这样做

##  浏览器的本地存储

1.存储内容一般支持5MB左右（不同浏览器可能还不一样）
2.浏览器端通过WIndow.sessionStorage和Window.localStorage属性来实现本地存储
3.相关API
    1.xxxxxStorage.setItem('key','value');
       该方法接收一个键和值作为参数，会把键值对添加到存储中，如果键名存在，则更新其对应的值
    2.xxxxxStorage.getItem('key','value');
       该方法接收一个键名作为参数，返回键名对应的值
    3.xxxxxStorage.removeItem('key');
        该方法接收一个键名作为参数，并把该简明从存储中删除
   4.xxxxxStorage.clear();
       该方法会清空存储中的所有数据
4.备注：
    1.sessionStorage 存储的内容会随着浏览器窗口关闭而消失
    2.localStorage 存储的内容，需要手动清除才会消失（调用API，手动清除浏览器缓存）
    3.xxxxxStorage.getItem(xxx) 如果xxx对应的value值获取不到，那么getItem的返回值是null
    4.JSON.parse(null) 的结果依然是null



# Vuex
## 简介
###  1.概念
专门在Vue中实现集中式状态（数据）管理的一个Vue插件
对Vue应用中多个组件的共享状态进行集中式的管理（读/写）
也是一种组件间通信的方式，且适用于任意组件间通信
###  2.使用Vuex
1.多个组件依赖于同一状态
2.来自不同组件的行为需要变更同一状态
vuex原理图
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5a917eddee2b4aac9024581fb897d3d5.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6bf66a5750c84e6bb32a844ae88037c6.png)
==这三个配置都是由store管理的
之所以这样是因为dispatch是由store提供的==

> 1.在组件中点击加的按钮之后，要说做什么动作 就要调用dispatch     参1：动作类型  参2：加几 
> 2.调用dispatch之后  加的动作和值来到Actions
> 3.Actions本质上是个Object类型的对象  在这里可以对传过来的数据进行一定操作 比如判断等
>     Actions里面一定有一个key和dispatch中的 'jia'去对应，只要对应 就会引起函数的调用，一旦被调用就会收到那个 2  
> 4.在Actions中jia所对应的函数里自己调用commit
> 5.然后走到Mutations里面（本质上是个Object类型的对象），这里面也会有一个jia：function
> 6.这个函数会有两个东西   整个State，还有传过来的值
> 7.这样写之后底层会自动调用Mutate
> 8.Vuex重新解析模版更新页面


Actions有时候并不必要写，可直接调用commit
什么时候用Actions？
需要处理数据
当进行动作 这个动作的值需要发送ajax请求

##  搭建环境

```go
npm i vuex@3
//Vue2只能用Vuex的3版本
//Vue3只能用Vuex的4版本
```

**1.创建文件：src/store/index.js**

```go
// 该文件用于创建vuex中最为核心的store
// 引入Vue
import Vue from "vue";
// 引入Vuex
import Vuex from "vuex";
// 应用插件
Vue.use(Vuex);
// 准备actions - 用于响应组件中的动作
const actions = {};
// 准备mutations - 用于操作数据（state）
const mutations = {};
// 准备state - 用于存储数据
const state = {};
// 创建并导出store
export default new Vuex.Store({
  actions,
  mutations,
  state,
});
```

在store.js引入Vuex并使用该插件（Vue.use(Vuex)）的原因是 store必须在使用插件之后才能创建（即new Vuex.Store）

但是也不能如下图所示调换位置
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/021349e8d3024793853b1d4e2d608aab.png)

因为es6中会将import语句声明提前
因此唯一的解决方式是将插件使用在声明store的文件中使用

**2.在main.js中创建vm时传入store配置项**

![**加粗样式**](https://i-blog.csdnimg.cn/direct/e96f200e3b8548e2b19ca7701e5696d3.png)
##  Vuex案例
###  基本使用
1.初始化数据：配置actions 配置mutations 操作文件store.js
index.js

> 在 state 中准备用于存储的数据 sum。 在 mutations 中准备用于修改 state 中数据的函数 JIA 和
> JIAN。（注意配置在 mutations 中的函数名一般大写）。 在 actions 中准备用于响应组件的函数 jiaOdd 和
> jiaWait。

src/index.js
```go
// 该文件用于创建vuex中最为核心的store
// 引入Vue
import Vue from "vue";
// 引入Vuex
import Vuex from "vuex";
// 应用插件
Vue.use(Vuex);
// 准备actions - 用于响应组件中的动作
const actions = {
  // 前两个可以注释掉，因为并没有做任何判断，可以直接在methods里commit
  // jia(context, value) {
  //   context.commit("JIA", value);
  // },
  // jian(context, value) {
  //   context.commit("JIAN", value);
  // },
  jiaOdd(context, value) {
    if (context.state.sum % 2) {
      context.commit("JIA", value);
    }
  },
  jiaWait(context, value) {
    setTimeout(() => {
      context.commit("JIA", value);
    }, 500);
  },
};
// 准备mutations - 用于操作数据（state）
const mutations = {
  JIA(state, value) {
    state.sum += value;
  },
  JIAN(state, value) {
    state.sum -= value;
  },
};
// 准备state - 用于存储数据
const state = {
  sum: 0,
};
// 创建并导出store
export default new Vuex.Store({
  actions,
  mutations,
  state,
});
```

Count.vue

> 在 Count.vue 的 methods 中配置方法。 简单的逻辑，直接在 methods 中
> this.$store.commit('方法', 数据)。（此处的方法为 index.js 中 mutations 中配置的方法）
> 复杂的逻辑，通过在 methods 中 this.$store.dispatch('方法', 数据)。（此处的方法为 index.js 中
> actions 中配置的方法） 页面呈现时的模板语法：{{$store.state.sum}}


components/Count.vue
```go
<template>
  <div>
    <h1>当前求和为:{{ $store.state.sum }}</h1>
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementOdd">当前求和为奇数再加</button>
    <button @click="incrementWait">等一等再加</button>
  </div>
</template>

<script>
export default {
  name: "Count",
  data() {
    return {
      n: 1,
    };
  },
  methods: {
    increment() {
      this.$store.commit("JIA", this.n);
    },
    decrement() {
      this.$store.commit("JIAN", this.n);
    },
    incrementOdd() {
      this.$store.dispatch("jiaOdd", this.n);
    },
    incrementWait() {
      this.$store.dispatch("jiaWait", this.n);
    },
  },
  mounted() {
    console.log("Count", this);
  },
};
</script>

<style lang="scss" scoped>
button {
  margin: left;
}
</style>
```

> 2.组件中读取vuex数据：$store.state.sum
3.组件中修改vuex数据: $store.dispatch( 'actions中的方法名'，数据 )
   或$store.commit( ’multations中的方法名‘，数据)、

```go
备注：若没有网络请求或其他业务逻辑，组件中也
可以越过actions，即不写dispatch 直接编写commit
```


##  getters配置项
1.概念：当state中的数据需要经过加工后再使用时，可以使用getters加工（逻辑较为复杂时使用，可被多组件复用）
2.在store/index.js中追加getters配置

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/510b181c7329489091c997a400a8cdc8.png)
3.组件中读取数据: $store.getters.bigSum

## vuex 与 vue 的类比
vuex 中的 state 相当于 vue 中的 data。
vuex 中的 mutations 相当于 vue 中的 methods。
vuex 中的 getters 相当于 vue 中的 computed。
vuex 中的 actions 相当于 vue 中的 methods
注意：同步方法写在 mutations，异步写在 actions 里。


##  四个map方法的使用

**1.mapState** 用于帮助我们映射State中的数据作为计算属性
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4bd1cb468e0441fd8b62bf87679e2eac.png)
对象写法的key名对应计算属性的属性名，value值对应state中的变量名
**2.mapGetters** 用于帮助我们映射getters中的数据作为计算属性

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/bf2eba312cb0451e8d0738f7ca069204.png)
**3.mapActions** 用于帮助我们生成与Actions对话的方法 即包含$store.dispatch（xxx）的函数
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d153f054b99542b693ef444c44969c21.png)

**4.mapMutations** 用于帮助我们生成与Mutations对话的方法 即包含$store.commit(xxx)的函数

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/002dd56e076941c7a579f4c0a1891a49.png)
==备注：mapActions与mapMutations使用时，若需要传递参数，需要在模版中绑定事件时传递好参数，否则参数是事件对象==

##  范例
**使用mapState 和mapGetters**

```go
	// 该文件用于创建Vuex中最为核心的store
	// 引入vue核心库
	import Vue from 'vue'
	// 引入Vuex
	import Vuex from 'vuex'
	// 应用Vuex插件
	Vue.use(Vuex)
	
	// 准备actions——用于响应组件中的动作
	const actions = {
	    jiaOdd(context, value){
	        console.log('actions中的addOdd被调用了');
	        if(context.state.sum % 2){
	            context.commit('JIA',value)
	        }
	    },
	    jiaWait(context, value){
	        console.log('actions中的addWait被调用了');
	        setTimeout(()=>{
	            context.commit('JIA', value)
	        },500)
	    }
	}
	// 准备mutations——用于修改state中的数据（state）
	const mutations = {
	    JIA(state, value){
	        console.log('mutations中的JIA被调用了',state, value);
	        state.sum += value
	    },
	    JIAN(state, value){
	        console.log('mutations中的JIAN被调用了',state, value);
	        state.sum -= value
	    }
	}
	// 准备state——用于存储具体的数据
	const state = {
	    sum: 0, //当前的和
	    school: '尚硅谷',
	    subject: '前端'
	} 
	
	// 准备getters——用于将state中的数据进行加工
	const getters = {
	    bigSum(state){
	        return state.sum * 10
	    }
	}
	
	// 创建并暴露store
	export default new Vuex({
	    actions,
	    mutations,
	    state,
	    getters
	})

```

> Count.vue
>1. 要在该组件导入 mapState 和 mapGetters
>2. import { mapState, mapGetters } from "vuex";

```go
	<template>
	  <div>
	    <h2>当前求和为：{{ sum }}</h2>
	    <h3>当前求和放大10倍：{{ bigSum }}</h3>
	    <h3>我在{{ school }}，学习{{ subject }}</h3>
	    <select v-model.number="n">
	      <option :value="1">1</option>
	      <option :value="2">2</option>
	      <option :value="3">3</option>
	    </select>
	    <button @click="add(n)">+</button>
	    <button @click="sub(n)">-</button>
	    <button @click="addOdd(n)">当前求和为奇数再加</button>
	    <button @click="addWait(n)">等一等再加</button>
	  </div>
	</template>
	
	<script>
	import { mapState, mapGetters } from "vuex";
	export default {
	  name: "myCount",
	  data() {
	    return {
	      n: 1, //用户选择的数字
	    };
	  },
	  computed: {
	    // 借助mapState生成计算属性，从state中读取数据 （对象写法）
	    //...mapState({ sum: "sum", school: "school", subject: "subject" }),
	    // 借助mapState生成计算属性，从state中读取数据 （数组写法）
	    ...mapState(['sum','school','subject']),
	
	    // 借助mapGetters生成计算属性，从getters中读取数据（对象写法）
	    //...mapGetters({bigSum: 'bigSum'}),
	    // 借助mapGetters生成计算属性，从getters中读取数据（数组写法）
	    ...mapGetters(['bigSum'])
	
	  },
	  methods: {
	    increment() {
	      this.$store.commit("JIA", this.n);
	    },
	    decrement() {
	      this.$store.cmommit("JIAN", this.n);
	    },
	    incrementOdd() {
	      this.$store.dispatch("jiaOdd", this.n);
	    },
	    incrementWait() {
	      this.$store.dispatch("jiaWait", this.n);
	    },
	  },
	};
	</script>
	
	<style scoped>
	button {
	  margin-left: 5px;
	}
	</style>

```


如果不使用 mapState 和 mapGetters，则需要在 computed 中手动配置如下代码。

```go
computed: {
	  sum() {
	    return this.$store.state.sum;
	  },
	  school() {
	    return this.$store.state.school;
	  },
	  subject() {
	    return this.$store.state.subject;
	  },
	  bigSum() {
	    return this.$store.getters.bigSum;
	  }
	}

```

**使用mapActions和mapMutations**

> index文件不变 Count.vue 要在该组件导入 mapActions 和 mapMutations import {
> mapActions, mapMutations} from "vuex";


```go
	<template>
	  <div>
	    <h2>当前求和为：{{ sum }}</h2>
	    <h3>当前求和放大10倍：{{ bigSum }}</h3>
	    <h3>我在{{ school }}，学习{{ subject }}</h3>
	    <select v-model.number="n">
	      <option :value="1">1</option>
	      <option :value="2">2</option>
	      <option :value="3">3</option>
	    </select>
	    <button @click="add(n)">+</button>
	    <button @click="sub(n)">-</button>
	    <button @click="addOdd(n)">当前求和为奇数再加</button>
	    <button @click="addWait(n)">等一等再加</button>
	  </div>
	</template>
	
	<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
	export default {
	  name: "myCount",
	  data() {
	    return {
	      n: 1, //用户选择的数字
	    };
	  },
	  computed: {
	    // 借助mapState生成计算属性，从state中读取数据 （对象写法）
	    // ...mapState({ sum: "sum", school: "school", subject: "subject" }),
	    // 借助mapState生成计算属性，从state中读取数据 （数组写法）
	    ...mapState(["sum", "school", "subject"]),
	
	    // 借助mapGetters生成计算属性，从getters中读取数据（对象写法）
	    //...mapGetters({bigSum: 'bigSum'}),
	    // 借助mapGetters生成计算属性，从getters中读取数据（数组写法）
	    ...mapGetters(["bigSum"]),
	  },
	  methods: {
	    //借助mapMutations生成对应的方法，方法中会调用commit去联系mutations (对象的写法)
	    ...mapMutations({add: 'ADD', sub: 'SUB'}),
	    //借助mapMutations生成对应的方法，方法中会调用commit去联系mutations (数组的写法)
	    //...mapMutations(['ADD','SUB']), //此时上面的绑定也要 @ADD @SUB
	    //借助mapActions生成对应的方法，方法中会调用dispatch去联系actions (对象写法)
	    ...mapActions({addOdd: 'addOdd', addWait: 'addWait'})
	    //借助mapActions生成对应的方法，方法中会调用dispatch去联系actions (数组写法)
	    //...mapActions(['addOdd','addWait'])
	  },
	};
	</script>
	
	<style scoped>
	button {
	  margin-left: 5px;
	}
	</style>

```
## 模块化 namespace
index.js
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/713665229ec7479d8f5775d991e9cd42.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/54a51e46df1748ee8c4c51966de6d9e5.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c808a0b02084444c8b38dd561d64085d.png)
1.目的：让代码更好维护，让多种数据分类更明确
2.修改store.js
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5cf4561a2bfd4fd0854e15796b3a66c3.png)
3.开启命名空间后，组件中读取State数据：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e19cf4b50c144fefa232310f39a4d7b1.png)
4.开启命名空间后，组件中读取getters数据
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/06777696b4aa42738e475aea38e89660.png)
5.开启命名空间后，组件中调用dispatch
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d8b6b3b6d6b14e19aa62e9c2a02d6b64.png)
6.开启命名空间后，组件中调用commit
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4d521475c0cd407f8d49288d015915c8.png)


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/143087958)

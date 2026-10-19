---
title: "Vue 3 组件通信"
description: "记录 Vue 3 中组件之间传递数据与触发事件的常见方式。"
type: journal
occurredAt: 2024-11-17
publishedAt: 2024-11-17
tags:
  - Vue
sourceUrl: https://blog.csdn.net/HBR666_/article/details/143835553
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/01822c379a1841ec804274280cf1a78a.jpeg
---
# Vue3组件通信和Vue2的区别

● 移出事件总线 使用mitt代替
● vuex 换成了pinia
● 把.sync 优化到了v-model里面
● 把$listeners所有的东西，合并到$attrs中了
● $children 被砍掉了

常见搭配形式
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b233549b6a784df9bbf256680dc52acd.png)

#  props
概述：props是使用频率最高的一种通信方式 常用于 父==>子
● 若父传子  属性值是非函数
● 若子传父  属性值是函数
即子组件通过父组件传过来的函数 传参到函数中 从而父组件接受参数 （本质还是先父传子）

父组件

```typescript
<template>
  <div class="father">
    <h3>父组件，</h3>
    <h4>我的车：{{ car }}</h4>
    <h4>儿子给的玩具：{{ toy }}</h4>
    <Child :car="car" :getToy="getToy"/>
  </div>
</template>

<script setup lang="ts" name="Father">
  import Child from './Child.vue'
  import { ref } from "vue";
  // 数据
  const car = ref('奔驰')
  const toy = ref()
  // 方法
  function getToy(value:string){
    toy.value = value
  }
</script>
```

子组件

```typescript
<template>
  <div class="child">
    <h3>子组件</h3>
    <h4>我的玩具：{{ toy }}</h4>
    <h4>父给我的车：{{ car }}</h4>
    <button @click="getToy(toy)">玩具给父亲</button>
  </div>
</template>

<script setup lang="ts" name="Child">
  import { ref } from "vue";
  const toy = ref('奥特曼')

  defineProps(['car','getToy'])
</script>
```

#  自定义事件
1.概述：子=>父
2.注意区分好：原生事件、自定义事件
●   原生事件：
       事件名是确定的（click  mouseenter等等）
       事件对象 `$event`:是包含事件相关信息的对象（pageX  pageY taget ketCode）
● 自定义事件 
      事件名是任意名称
      事件对象$event :是调用emit时所提供的数据  可以是任意类型
子组件中 
 声明事件  ` const emit = defineEmits(["send-toy"]);`
 触发事件  ` <button @click="emit('send-toy', toy)">测试  </button>`


Father.vue

```typescript
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4 v-show="toy">子给的玩具：{{ toy }}</h4>
    <!-- 给子组件Child绑定事件 -->
    <Child @sendToy="saveToy" />
  </div>
</template>

<script setup lang="ts" name="Father">
import { ref } from "vue";
import Child from "./Child.vue";
// 数据
let toy = ref("");
// 用于保存传递过来的玩具
function saveToy(value: string) {
  console.log("saveToy", value);
  toy.value = value;
}
```


Child.vue

```typescript
<template>
  <div class="child">
    <h3>子组件</h3>
    <h4>玩具：{{ toy }}</h4>
    <button @click="emit('send-toy', toy)">测试</button>
  </div>
</template>

<script setup lang="ts" name="Child">
import { ref } from "vue";
// 数据
let toy = ref("奥特曼");
// 声明事件
const emit = defineEmits(["send-toy"]);
</script>
```


# mitt(vue2的$bus)
概述：与消息订阅与发布（pubsub）功能类似
可以实现任意组件间通信
它通常被认为是一个工具
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5b1c6bbe2a7f4595bd6548a5549b4d9a.png)
解绑所有事件 `emitter.all.clear()`
解绑事件   `emitter.off('test2')`


安装mitt

```typescript
npm i mitt
```
新建文件 src\utils\emitter.ts

```typescript
// 引入mitt
import mitt from 'mitt'

// 调用mitt得到emitter，emitter能：绑定事件、触发事件
const emitter = mitt()

/* // 绑定事件
emitter.on('test1',()=>{
  console.log('test1被调用了')
})
emitter.on('test2',()=>{
  console.log('test2被调用了')
})

// 触发事件
setInterval(() => {
  emitter.emit('test1')
  emitter.emit('test2')
}, 1000);

setTimeout(() => {
  // emitter.off('test1')
  // emitter.off('test2')

  //解绑所有事件
  emitter.all.clear()
}, 3000); */


// 暴露emitter
export default emitter
```


写之后需要在main.ts中引入  `import emitter from './utils/emitter'`

接收数据的组件中:   绑定事件、同时在销毁前解绑事件

```typescript
import emitter from "@/utils/emitter";
import { onUnmounted } from "vue";

// 绑定事件
emitter.on('send-toy',(value)=>{
  console.log('send-toy事件被触发',value)
})

onUnmounted(()=>{
  // 解绑事件
  emitter.off('send-toy')
})
```
提供数据的组件 在合适的时候触发事件

```typescript
import emitter from "@/utils/emitter";

function sendToy(){
  // 触发事件
  emitter.emit('send-toy',toy.value)
}
```
注意这个重要的内置关系，总线依赖着这个内置关系

#  v-model(封装组件常用)

> 下方有些$event 有的有target 有的没   
$event到底是啥？ 啥时候能.target  
对于原生事件 $event 就是事件对象===> 能 .target  
对于自定义事件  $event 就是触发事件时  所传递的数据==>不能.target    
`@input="userName =(<HTMLInputElement>$event.target).value"  `  传递的是数据


1.概述 ：实现父 子之间相互通信
2.知识：v-model 本质上是两个步骤组成

```typescript
<!-- 使用v-model指令 -->
<input type="text" v-model="userName">

<!-- v-model的本质是下面这行代码 -->
<input 
  type="text" 
  :value="userName" 
  @input="userName =(<HTMLInputElement>$event.target).value"
  >
```


3.组件标签上的v-model本质上是   :modelValue + update:modelValue事件

父组件
```typescript
<!-- 组件标签上使用v-model指令 -->
<AtguiguInput v-model="userName"/>

<!-- 组件标签上v-model的本质 -->
<AtguiguInput :modelValue="userName" @update:model-value="userName = $event"/>
```
AtguiguInput.vue
```typescript
<template>
  <div class="box">
    <!--将接收的value值赋给input元素的value属性，目的是：为了呈现数据 -->
		<!--给input元素绑定原生input事件，触发input事件时，进而触发update:model-value事件-->
    <input 
       type="text" 
       :value="modelValue" 
       @input="emit('update:model-value',$event.target.value)"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
  // 接收props
  defineProps(['modelValue'])
  // 声明事件
  const emit = defineEmits(['update:model-value'])
</script>
```
4.也可以更换value，例如改成abc
注意:v-model  本身就是v-model:value  写的时候省略了

```typescript
<!-- 也可以更换value，例如改成abc-->
<AtguiguInput v-model:abc="userName"/>

<!-- 上面代码的本质如下 -->
<AtguiguInput :abc="userName" @update:abc="userName = $event"/>
```
AtguiguInput 组件

```typescript
<template>
  <div class="box">
    <input 
       type="text" 
       :value="abc" 
       @input="emit('update:abc',$event.target.value)"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
  // 接收props
  defineProps(['abc'])
  // 声明事件
  const emit = defineEmits(['update:abc'])
</script>
```


5.如果value可以更换，那么就可以在组件标签上多次使用v-model

```typescript
<AtguiguInput v-model:abc="userName" v-model:xyz="password"/>
```


# $attrs
1.概述：`$attrs `用于实现当前组件的父组件，向当前组件的子组件通信（祖-->孙）
2.具体说明：`$attrs `是一个对象 包含所有父组件传入的标签属性

    注意: $attrs 会自动排除 props中声明的属性（可以认为声明过的props被子组件自己消费了）

$attrs 获取到的是props收到的以外的属性和方法 （即没有主动接收的）
要是想孙传祖 可通过函数传参

父组件

```typescript
<template>
  <div class="father">
    <h3>父组件</h3>
		<Child :a="a" :b="b" :c="c" :d="d" v-bind="{x:100,y:200}" :updateA="updateA"/>
  </div>
</template>

<script setup lang="ts" name="Father">
	import Child from './Child.vue'
	import { ref } from "vue";
	let a = ref(1)
	let b = ref(2)
	let c = ref(3)
	let d = ref(4)

	function updateA(value){
		a.value = value
	}
</script>
```

子组件

```typescript
<template>
	<div class="child">
		<h3>子组件</h3>
		<GrandChild v-bind="$attrs"/>
	</div>
</template>

<script setup lang="ts" name="Child">
	import GrandChild from './GrandChild.vue'
</script>
```
孙组件

```typescript
<template>
	<div class="grand-child">
		<h3>孙组件</h3>
		<h4>a：{{ a }}</h4>
		<h4>b：{{ b }}</h4>
		<h4>c：{{ c }}</h4>
		<h4>d：{{ d }}</h4>
		<h4>x：{{ x }}</h4>
		<h4>y：{{ y }}</h4>
		<button @click="updateA(666)">点我更新A</button>
	</div>
</template>

<script setup lang="ts" name="GrandChild">
  //属性是通过$attrs传过来的
	defineProps(['a','b','c','d','x','y','updateA'])
</script>
```




# $refs $parent

概念：
$refs 用于 父=> 子
$parent 用于 子=>父

注意:获取数据时需要使用宏函数 defineExpose
父获取子   子写defineExpose
子获取父   父写defineExpose

原理如下：
| 属性	 | 说明  |
|--|--|
|  $refs| 	值为对象，包含所有被ref属性标识的DOM元素或组件实例。 |
| $parent	 | 值为对象，当前组件的父组件实例对象。 |

父组件

```typescript
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>房产：{{ house }}</h4>
    <button @click="changeToy">修改Child1的玩具</button>
    <button @click="changeComputer">修改Child2的电脑</button>
    <button @click="getAllChild($refs)">让所有孩子的书变多</button>
    <Child1 ref="c1"/>
    <Child2 ref="c2"/>
  </div>
</template>
<script setup lang="ts" name="Father">
  import Child1 from './Child1.vue'
  import Child2 from './Child2.vue'
  import { ref,reactive } from "vue";
  let c1 = ref()
  let c2 = ref()
  // 数据
  let house = ref(4)
  // 方法
  function changeToy(){
    c1.value.toy = '小猪佩奇'
  }  
  function changeComputer(){
    c2.value.computer = '华为'
  }
  function getAllChild(refs:{[key:string]:any}){
    console.log(refs)
    for (let key in refs){
      refs[key].book += 3
    }
  }
  // 向外部提供数据
  defineExpose({house})
</script>
```


子组件1

```typescript
<template>
  <div class="child1">
    <h3>子组件1</h3>
		<h4>玩具：{{ toy }}</h4>
		<h4>书籍：{{ book }} 本</h4>
		<button @click="minusHouse($parent)">干掉父亲的一套房产</button>
  </div>
</template>
<script setup lang="ts" name="Child1">
	import { ref } from "vue";
	// 数据
	let toy = ref('奥特曼')
	let book = ref(3)
	// 方法
	function minusHouse(parent:any){
		parent.house -= 1
	}
	// 把数据交给外部
	defineExpose({toy,book})
</script>
```
子组件2

```typescript
<template>
  <div class="child2">
    <h3>子组件2</h3>
		<h4>电脑：{{ computer }}</h4>
		<h4>书籍：{{ book }} 本</h4>
  </div>
</template>
<script setup lang="ts" name="Child2">
		import { ref } from "vue";
		// 数据
		let computer = ref('联想')
		let book = ref(6)
		// 把数据交给外部
		defineExpose({computer,book})
</script>
<style scoped>
	.child2{
		margin-top: 20px;
		background-color: orange;
		padding: 20px;
		border-radius: 10px;
    box-shadow: 0 0 10px black;
	}
</style>
```
#  provide  inject(比$attrs 方便)

1.直接越过子组件 实现祖孙通信
2.具体使用：
   在祖先组件中通过provide配置向后代组件提供数据
   在后代组件中通过inject 配置来声明接收数据
3.具体代码：
当接收数据时 需要有第二个参数   第二个参数通常是指默认值，
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/aee9b5f5a523455c9d4435a6e61ff7b2.png)
如果没有第二个参数 模版会报错
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/60012be3b95141059f838d2959da1a7c.png)
#  pinia
[pinia 官网](https://pinia.vuejs.org/zh/)

#  插槽
##  1.默认插槽
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ae55b89cf44e4b55966a2e7a7ea40e9c.png)

```typescript
父组件中：
        <Category title="今日热门游戏">
          <ul>
            <li v-for="g in games" :key="g.id">{{ g.name }}</li>
          </ul>
        </Category>
子组件中：
        <template>
          <div class="item">
            <h3>{{ title }}</h3>
            <!-- 默认插槽 -->
            <slot></slot>
          </div>
        </template>
```

##  2.具名插槽

```typescript
父组件中：
        <Category title="今日热门游戏">
          <template v-slot:s1>
            <ul>
              <li v-for="g in games" :key="g.id">{{ g.name }}</li>
            </ul>
          </template>
          <template #s2>
            <a href="">更多</a>
          </template>
        </Category>
子组件中：
        <template>
          <div class="item">
            <h3>{{ title }}</h3>
            <slot name="s1"></slot>
            <slot name="s2"></slot>
          </div>
        </template>
```

##  3.作用域插槽
1.理解：数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定。（新闻数据在News组件中，但使用数据所遍历出来的结构由App组件决定）
2.代码
注意：子组件写的
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/927de7fb65bd4701ab62d9fd1551a791.png)
父组件中的params  收到的是子组件的传过来的所有数据
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/aa7ea016009941ed960b020510b525db.png)
如果子组件的作用域插槽有名字 
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3855f8fa869b4285a1cbc22e2fdea5cb.png)

```typescript
父组件中：
      <Game v-slot="params">
      <!-- <Game v-slot:default="params"> -->
      <!-- <Game #default="params"> -->
        <ul>
          <li v-for="g in params.games" :key="g.id">{{ g.name }}</li>
        </ul>
      </Game>

子组件中：
      <template>
        <div class="category">
          <h2>今日游戏榜单</h2>
          <slot :games="games" a="哈哈"></slot>
        </div>
      </template>

      <script setup lang="ts" name="Category">
        import {reactive} from 'vue'
        let games = reactive([
          {id:'asgdytsa01',name:'英雄联盟'},
          {id:'asgdytsa02',name:'王者荣耀'},
          {id:'asgdytsa03',name:'红色警戒'},
          {id:'asgdytsa04',name:'斗罗大陆'}
        ])
      </script>
```


---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/143835553)

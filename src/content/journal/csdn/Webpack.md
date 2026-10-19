---
title: "Webpack"
description: "回顾 Webpack 的模块打包、依赖管理和文件转换能力。"
type: journal
occurredAt: 2024-09-15
publishedAt: 2024-09-15
tags:
  - 前端
sourceUrl: https://blog.csdn.net/HBR666_/article/details/142284426
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/1fb0846fff3c4d8fa575d98e42867e72.jpeg
---

## 总结
webpack是一个前端模块打包工具 他可以将多个模块按照依赖关系进行静态分析 并生成一个或多个打包后的文件
1.模块打包 
将项目中的所有模块（JS CSS Img等）当做一个整体 通过依赖关系将它们打包成一个或多个静态资源文件
2.依赖管理
webpack可以分析模块之间的依赖关系 根据配置的入口文件找出所有依赖的模块 并将其整合到打包结果中
3.文件转换
webpack本身只能处理JS模块 但通过加载器（loader）的使用，可以将其他类型的文件（如CSS LESS IMG等）转换为有效的模块 使其可以被打包到最终的结果中
4. 代码拆分
Webpack支持将代码拆分成多个模块，按需加载，实现按需加载和提升应用性能。
5. 插件系统
Webpack提供了丰富的插件系统，可以通过插件实现各种功能的扩展，例如压缩代码、自动生成HTML文件等。

#  webpack 基础
## 一、核心概念
### 1.entry（入口）
指示webpack从哪个文件打包
### 2.output（输出）
指示webpack打包完的文件输出到哪里去 如何命名等
### 3.loader（加载器）
webpack本身只能处理js json等资源 其他资源需要借助loader webpack 才能解析
### 4.plugins（插件）
扩展webpack的功能
### 5.mode（模式）
主要两种:
开发模式:development
生产模式:production

## 文件结构
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d44571f8b14e4f36bf4618ef2cf34668.png)

## 二、配置文件
注意:配置文件要放在文件根目录
如果写了配置文件 命令行只需要 npx webpack    
不需要写![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d506f6d4c6db4c90957e24ae4a8fc875.png)


```javascript
const path = require("path");

module.exports = {
  // 入口
  entry: "./src/main.js",
  //   输出
  output: {
    // 文件输出路径(绝对路径)
    path: path.resolve(__dirname, "dist"),
    // 文件名
    filename: "main.js",
  },
  //   加载器
  module: {
    rules: [
      // loader的配置
    ],
  },
  //  插件
  plugins: [],
  //   模式
  mode: "development",
};
```
## 三、开发模式
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fa3db3970cf54186bb39cafcdbc9572e.png)


## 四、处理资源

要想webpack打包资源，必须引入该资源
###  1.处理css资源
首先，你需要先安装 css-loader：

```go
npm install --save-dev css-loader
```

注意：还要安装 style-loader

```go
npm i style-loader
```

然后把 loader 引用到你 webpack 的配置中。如下所示：
file.js

```go
import css from 'index.css';
webpack.config.js
module.exports = {
 module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/i, //检测.css文件
        use: [
          //执行顺序 从右到左 从下到上
          "style-loader",//将js中的css通过创建style标签添加到html文件中
          "css-loader", //将css资源编译成commonjs的模块到js中
        ],
      },
    ],
  },
};
```

### 2.处理less资源
首先，你需要先安装 less 和 less-loader：

```go
npm install less less-loader --save-dev
```

然后将该 loader 添加到 webpack 的配置中去，例如：

```javascript
webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
};
```

### 3.处理sass scss资源
首先，你需要安装 sass-loader：

```go
npm install sass-loader sass webpack --save-dev
```

然后将该 loader 添加到 webpack 的配置中去，例如：
webpack.config.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
    ],
  },
};
```

### 4.处理styl资源
首先，你需要安装 stylus 和 stylus-loader：

```go
npm install stylus stylus-loader --save-dev
```

然后将该 loader 添加到 webpack 配置中。例如：
webpack.config.js

```javascript
{
        test: /\.styl$/,

        use: [
          // compiles stylus to CSS
          "style-loader",
          "css-loader",
          "stylus-loader",
        ], //使用多个loader
      },
```

### 5.处理图片资源
在webpack4时 我们处理图片资源通过file-loader 和url-loader 进行处理
现在webpack5已经将两个loaders功能内置到webpack里 
图片格式是base64
url-loader的作用是将任何文件转为base64资源【所以不仅仅是用来处理图片的】，这一loader的功能现在在webpack5中默认可以直接用
url-loader转成base64减少网络请求，减轻服务器压力

```javascript
{
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
      },
```

可以通过此配置来修改内存大小小于多少直接转为base64编码

上述方法是css中的背景图片

在html中图片的配置
npm install html-withimg-loader --save-dev
配置

```javascript
{
            test: /\.(htm|html)$/i,
            use: ["html-withimg-loader"],
          },
```

### 6.处理字体图标资源
将图标资源下载下来 解压缩
将这三个文件放入fonts文件夹中，将iconfont.css 放入css文件中
注意：iconfont.css文件要修改相应的这三个文件的路径


配置文件：

```javascript
{
  test: /\.(ttf|woff2?)$/,
    type: "asset/resource", //不会转为base64格式

    generator: {
    //输出图片名称（hash值10位）
    filename: "static/iconfont/[hash:10][ext][query]",
      },
},
```

### 7.处理其他资源

### 8.处理js资源
webpack只能编译js中ES模块化语法 不能编译其他语法  导致js不能在IE等浏览器运行 
针对js兼容性处理  使用Babel来完成  
针对代码格式  使用Eslint来完成
先完成Eslint 检测代码格式无误后  再由Babel 做代码兼容处理
1）eslint
首先，需要安装 eslint-webpack-plugin：

```go
npm install eslint-webpack-plugin --save-dev
```

注意: 如果未安装 eslint >= 7 ，你还需先通过 npm 安装：

```go
npm install eslint --save-dev
```

然后把插件添加到你的 webpack 配置。例如：

```javascript
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // ...
  plugins: [new ESLintPlugin(options)],
  // ...
};
例如：
plugins: [
    // plugin的配置
    new EslintPlugin({
      context: path.resolve(__dirname, "src"),
    }),
  ],
```

同时在根目录需要有.eslintrc.js文件才能生效

```javascript
module.exports = {
  // 继承 Eslint规则
  extends: ["eslint:recommended"],
  env: {
    node: true, //启用node中的全局变量
    browser: true, //启用浏览器中的全局变量
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  rules: {
    // "no-var": 2,
  },
};
```

当使用vscode的eslint插件时，在根目录写个.eslintignore 文件来忽略dist
2)babel
主要用于将ES6语法编写的代码转换为向后兼容的javascript语法，以便能够运行在当前和旧版本的浏览器或其他环境中
(1)presets 预设

```go
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

在 webpack 配置对象中，需要将 babel-loader 添加到 module 列表中，就像下面这样：

```javascript
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    },
  ];
}
```



### 9.处理html资源

```go
npm install --save-dev html-webpack-plugin
```

该插件将为你生成一个 HTML5 文件， 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle。 只需添加该插件到你的 webpack 配置中，如下所示：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  plugins: [ 
    // 模版 以publc/index.html创建新的html文件
    // 新的文件特点：1.结构和原来一致 2.自动引入打包输出的资源
    template: path.resolve(__dirname, "./public/index.html"),],
};
```

## 修改输出文件目录
###  1.修改输出文件目录
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d471c3a608194f148757c872bba86945.png)

### 2.修改加载器目录
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5685dc26480a4bcab4ddbf127e834e6d.png)

## 自动清空上次打包内容
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f90c876ec02a45438f6eb216e5001fea.png)


## 开发服务器&自动化

注意:开发服务器不会输出资源，在内存中编译打包的 （即如果dist目录删除，再次打包，dist目录不会有东西）
首先，需要安装 ：

```go
npm i webpack-dev-server -D
```



配置文件完整代码

```javascript
const path = require("path");
const EslintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // 入口
  entry: "./src/main.js",
  //   输出
  output: {
    // 文件输出路径(绝对路径)
    path: path.resolve(__dirname, "dist"),
    // 入口文件打包输出文件名
    filename: "js/main.js",
    // 自动清空上次打包内容
    // 原理：在打包前，将path整个目录清空 再进行打包
    clean: true,
  },
  //   加载器
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/i, //检测.css文件
        use: [
          //执行顺序 从右到左 从下到上
          "style-loader", //将js中的css通过创建style标签添加到html文件中
          "css-loader", //将css资源编译成commonjs的模块到js中
        ],
      },
      {
        test: /\.less$/i,
        //loader:"xxx" 只能使用一个loader
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ], //使用多个loader
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          "style-loader",
          // 将 CSS 转化成 CommonJS 模块
          "css-loader",
          // 将 Sass 编译成 CSS
          "sass-loader",
        ],
      },
      {
        test: /\.styl$/,

        use: [
          // compiles stylus to CSS
          "style-loader",
          "css-loader",
          "stylus-loader",
        ], //使用多个loader
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          //输出图片名称（hash值10位）
          filename: "static/img/[hash:10][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4)$/,
        type: "asset/resource", //不会转为base64格式

        generator: {
          //输出图片名称（hash值10位）
          filename: "static/iconfont/[hash:10][ext][query]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, //排除node_modules文件
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  //  插件
  plugins: [
    // plugin的配置
    new EslintPlugin({
      context: path.resolve(__dirname, "src"),
    }),
    new HtmlWebpackPlugin({
      // 模版 以publc/index.html创建新的html文件
      // 新的文件特点：1.结构和原来一致 2.自动引入打包输出的资源
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],

  // 开发服务器
  devServer: {
    host: "localhost", //启动服务器域名
    port: "3000", //启动服务器端口号
    open: true, //是否自动打开浏览器
  },
  //   模式
  mode: "development",
};
```

## 生产模式
生产模式是开发完成代码后 需要得到代码来部署上线  
这个模式下我们主要对代码进行优化 让其运行性能更好
优化主要从两个角度出发：
 1.优化代码运行性能
 2.优化代码打包速度

### 1.对开发模式文件进行修改
将webpack.config.js文件移入config文件夹
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a41d4d2febe64f2da87b9a3409b896c8.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c5b5f31370a344d4a8125c711385d75b.png)

>1.入口文件的相对路径不用修改，因为运行代码还是在根目录运行的，而相对路径相对的是运行代码的目录
2.而绝对路径需要修改，需要回退一层 或者直接写undfined
3.开发模式不会在dist中输出资源，因此不需要清楚上次的打包内容
4.所有涉及到绝对路径的地方都需要回退一层
5.运行该文件

### 2.对生产模式文件进行修改
注意：生产模式文件是将未修改的开发模式文件复制粘贴之后进行修改的
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b827ce63d90a4462a82b884898278829.png)


>1.将所有绝对路径的地方回退一层
2.将模式改为生产模式   
  mode:"development"  改为mode:"production"
3.生产模式不需要devServer 直接删除
4.打包输出
 
### 3.简化命令
在package.json中修改
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/608c3f33e4c9471e9da96028fbc97caf.png)

>运行开发模式时直接输入  npm start
运行生产模式输入  npm run build

# CSS 处理
##  提取Css成单独文件
css文件被打包到js文件中 当js文件加载时 会创建一个style标签来生成样式 
这样对于网站来说会产生闪屏现象  用户体验不好
应该单独的css文件 通过link标签加载性能才好
当我们html解析器异步解析html结构和style表中的样式时，html的结构的解析先于样式，这时我们的html结构有了但是部分样式却没有出来，这就会导致我们闪屏现象的产生。
### 1.下载包
首先，你需要安装 mini-css-extract-plugin：

```go
npm install --save-dev mini-css-extract-plugin
```

建议 mini-css-extract-plugin 与 css-loader 一起使用。
### 2.配置
引入

```go
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
```

将webpack.prod.js文件中的css加载器进行修改
注意:将所有涉及到style-loader的地方都改掉，并在插件中 new调用插件

注意：该插件写相对路径

## Css兼容性处理
### 1.下载包

```go
npm i postcss-loader postcss postcss-preset-env -D
```

### 2.配置
注意：配置需要在cssloader的下面  但是要在lessloader的前面

```json
 {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env", //能解决大多数样式兼容性问题
                    {
                      // 其他选项
                    },
                  ],
                ],
              },
            },
          },
```

### 3.控制兼容性
注意：这样写了之后并没有告诉浏览器兼容性到什么程度 因此需要在package.json中进行配置
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a31d724b87c44ffda81e50a100a1124b.png)

但是实际开发中

```go
"browserslist": [
  "last 2 version", // 所有浏览器 只要最近两个版本
  ">1%", //覆盖99%浏览器
  "not dead", // 不要弃用的
]
```

### 4.封装样式loader函数
在配置文件中可能有太多重复的配置，导致代码重复性过高
可以定义一个函数，返回值就是重复的东西

filter的作用：当不传参时，pre是undefined 需要过滤掉
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a4f7d8849c8b44d187a26f8a0d61a02c.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/52ccb389637348b0b531ece8726890e4.png)

## Css压缩
### 1.下载包

```go
npm install css-minimizer-webpack-plugin --save-dev
```

### 2.配置
引入

```go
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
```

配置

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fc4d9c12735e45e0909339f980d657be.png)




#  webpack 高级
##  sourceMap
所有css和js合成了一个文件 并且多了其它代码 此时如果代码运行出错 那么提示代码错误位置我们是看不懂的，将来开发代码文件多，很难发现错误出现在哪里，所以需要更准确的提示
###  是什么
SourceMap(源代码映射) 是一个用来生成源代码与构建后代码 一 一映射的文件的方案
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9c10fc98220a4b64a2361412289755aa.png)
### 怎么用
● 开发模式：cheap-module-source-map
             优点：打包编译速度快 只包含行映射
             缺点：没有列映射
            
```go
module.exports{
  mode:"development",
  devtool:"cheap-module-source-map"
}
```
● 生产模式：source-map
             优点：包含行、列映射
             缺点：打包编译速度慢
```go
module.exports{
  mode:"production",
  devtool:"source-map"
}
```
##  HMR(提升打包构建速度)
### 为什么
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/47140ab1545e460eac4e7d8b4f8d0212.png)
### 是什么
HotModuleReplacement (HMR/热模块替换)：在程序运行中，替换、添加或删除模块，而无需重新加载整个页面
###  怎么用
####  1.基本配置

```go
devServer: {
    host: "localhost", //启动服务器域名
    port: "3000", //启动服务器端口号
    open: true, //是否自动打开浏览器
    hot: true, //开启HMR（默认值）
  },
```
此时css样式经过style-loader处理 已经具备HMR功能了，但是js还不行
让js实现热更新
在main.js中进行判断
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fcad86bd60054fddbc9545bb16dc340a.png)
上面这样写很麻烦  所以实际开发中会使用其他loader解决
比如 vue-loader     react-hot-loader
##  OneOf
###  为什么
打包每个文件都会经过所有loader处理 虽然因为 test 正则原因没处理上  但是都要过一遍 比较慢
###  怎么用
所有配置放在oneOf里面
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b618ea395c134d378c380781bb741179.png)

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/142284426)

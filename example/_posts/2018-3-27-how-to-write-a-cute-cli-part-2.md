---
date: 2018-03-27 20:44:40
tags: 
  - CLI
author: ULIVZ
location: Shanghai
---

# 如何开发一个可爱的CLI（二）

## 前言

在系列的上一篇 [**《如何开发一个可爱的CLI（一）》**](./2018-3-15-how-to-write-a-cute-cli-part-1.md) 中，我给大家讲述了如何开发一个生成、渲染、转换样板文件（Boilerplate）的简单脚手架工具。本文，将是愉快的进阶环节 —— 
如何基于`webpack`写一个 
“零配置” 的命令行工具（暂且命名为`lovely-cli`.），实现以下功能：

```bash
lovely-cli dev    # 以开发环境，webpack watch的模式启动一个应用
lovely-cli build  # 以生产环境的模式构建应用
```

首先，我要再次强调一个概念。尽管我在第一篇中我有备注:

    “由于脚手架的英文 scaffolding 太长，本文我将以更可爱的 CLI 来代替。”
    
    
但仍然有些同学提出疑问（有一位同学回复我是因为习惯性地滑的太快，所以没看到...），所以在第二篇的开始，我再次对`CLI`、`Scafollding`的概念全面阐述一次：

1. CLI，其全称是 command-line interface，也就是命令行界面。你我常用的git，算是比较著名的一个命令行工具了（你若是用source tree党，当我没说）：

![](https://user-gold-cdn.xitu.io/2018/3/27/16266859e4c95073?w=2268&h=1128&f=png&s=455640)

2. 脚手架，其英译是 Scafollding，关于它的概念，请首先看这张图：

![](https://user-gold-cdn.xitu.io/2018/3/27/1626684803f4fd31?w=656&h=632&f=png&s=671960)

没错，这就是脚手架，在建筑领域，无论是大工程还是小工程，都需要各式各样的脚手架，脚手架工程师首先搭好架子，然后工人们慢慢往里面堆砌砖头。

如果你只是建1层楼的平房，你可能只需要一个梯子足矣；如果是10层，上图的脚手架可能也足够了；但如果是50层、100层，你的脚手架对结构、承重、安全性将会有更多的考虑（PS：你至少得加个电梯吧。）

回到编程，为什么脚手架这个概念开始在前端领域兴起呢？说到底，都是源于工程化的崛起。随着经济的发展和人民生活水平的提高，富足的人民群众，对软件的体验需求越来越高，前端的页面也越来越复杂，十几年前几个JS文件能搞定的页面需求，现在可能需要几百，甚至几千个（哭）。后来，Node出现了，模块化出现了，任务调度和构建工具出现了，前端工程化也就诞生了，而脚手架在其中扮演的角色，和建筑工程中一样 —— 帮你搭建好基本的开发环境，其中包含生成基本项目结构、基本代码和开发流程的基本配置和脚本。

而 vue-cli，首先，它是一个 CLI, 其次，它才是一个 Scafollding，到 3.0 以后，它还算得上一个 build tool。

所以，不要再问我为什么标题不用 Scafollding 了。

## 分析

回到我们的需求：

```bash
lovely-cli dev    # 以开发环境，webpack watch的模式启动一个应用
lovely-cli build  # 以生产环境的模式构建应用
```

根据需求，我们可以划分出如下子任务，并提出相应的疑问：

1. 如何用node写一个全局可用的CLI命令 lovely-cli？
2. 如何支持子命令（dev、build）？
3. 如何让 dev 运行 webpack dev，让 build 运行 webpack build?

## 实施

前两条需求，我相信大多数前端/Node程序员都已经有一定了解或者非常熟悉了，这里放上阮老师的文章 [《Node.js 命令行程序开发教程》](http://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html) 作为参考，忘记的同学快去复习吧。我快速过一下：

### 任务一

1. 新建项目结构如下：

```
lovely-cli
├── package.json
└── src
    └── index.js
```

index.js ：

```js
#!/usr/bin/env node

console.log('I am a lovely CLI')
```

package.json 的内容如下：

```json
{
  "name": "lovely-cli",
  "version": "0.0.1",
  "description": "A lovely CLI",
  "bin": "src/index.js"
}
```

sudo npm link 一下, 看到这个就说明全局注册成功了。

```
/usr/local/bin/lovely-cli -> /usr/local/lib/node_modules/lovely-cli/src/index.js
/usr/local/lib/node_modules/lovely-cli -> /Users/haolchen/Documents/__self__/lovely-cli
```

OK，运行一下：

![](https://user-gold-cdn.xitu.io/2018/3/27/16266b965c58e09e?w=1402&h=98&f=png&s=25651)

### 任务二

修改一下 index.js 如下:

```js
#!/usr/bin/env node

const command = process.argv[2] // 不懂为什么这样写的同学不够可爱哦，请回去复习。

if (command === 'dev') {
  console.log('Running in development mode.')
} else if (command === 'build') {
  console.log('Running in production mode.')
} else {
  console.log('I am a lovely CLI.')
}
```

运行一下：

![](https://user-gold-cdn.xitu.io/2018/3/27/16266bb95271f318?w=1498&h=216&f=png&s=62866)

> 注：由于handle命令行参数不是本文的重点，本文的演示将均以 vanilla node.js 进行演示。你可能会使用 yargs、commander.js 等等这类元老库，而我推荐一下可爱的 egoist 出品的 cac：

https://github.com/cacjs/cac


### 任务三

这算是本文的重点了，我相信有心的同学看到这里，一定已经有思路了：

1. 运行 lovely-cli dev   => 用开发环境的配置，用 webpack-dev-server 运行起一个webpack app.
2. 运行 lovely-cli build => 用生成环境的配置，用 webpack 直接 build.

首先 yarn 一下：

```
yarn add webpack webpack-dev-server -D
```

接下来，Just show you the code:

```js
//  20行伪代码实现一个 lovely-cli
#!/usr/bin/env node

const command = process.argv[2]
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const defaultDevConfig = {} 
const defaultProdConfig = {} 

if (command === 'dev') {
  const compiler = Webpack(defaultDevConfig)
  const devServerOptions = defaultDevConfig.devServer
  const devServer = new WebpackDevServer(compiler, devServerOptions)
  devServer.listen(8080, 'localhost', () => console.log('Starting server on http://localhost:8080'));

} else if (command === 'build') {
  Webpack(defaultProdConfig)

} else {
  console.log('I am a lovely CLI.')
}
```

是不是很直观？既然思路都有了，那我们来继续完善代码，写一个基础的可用版吧。

首先，完善项目结构：

```
lovely-cli
├── package.json
├── index.html （新增）
├── package.json
├── src
│   ├── default-webpack-config.js （新增）
│   ├── entry.js （新增）
│   └── index.js
└── dist （新增）
```

其中，关于4个新增文件：

1. index.html：页面入口，你也可以用 HtmlWebpackPlugin 解决；
2. default-webpack-config.js：默认的 webpack 配置；
3. entry.js：客户端代码入口；
4. dist：输出目录。

首先，看一下 default-webpack-config.js：

```js
'use strict'

const { resolve } = require('path')

module.exports = {
  entry: resolve(__dirname, 'entry.js'),
  output: {
    path: resolve(__dirname, '../dist'),
    publicPath: '/dist/', 
    filename: 'bundle.js'
  }
}
```

再常规不过的配置了，其中，没用过 publicPath 作用的同学请参阅 [官方文档](https://webpack.js.org/guides/public-path/#src/components/Sidebar/Sidebar.jsx)。

接着是 index.html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Lovely CLI</title>
</head>
<body>
<div id="app"></div>
<script src="/dist/bundle.js"></script>
</body>
</html>
```

以及打包入口文件 entry.js：

```
const app = document.querySelector('#app')
app.innerHTML = '<h1>Lovely CLI</h1>'
```


在看 index.js 文件做了哪些修改之前，先来体验一下我们的成果吧：

1. 运行 lovely-cli dev：

![](https://user-gold-cdn.xitu.io/2018/3/27/162670498683597f?w=990&h=396&f=gif&s=34606)

打开浏览器：

![](https://user-gold-cdn.xitu.io/2018/3/27/1626705bebab3b61?w=1047&h=384&f=png&s=42741)

OK，一切按预料运行。

2. 接着，运行 lovely-cli build：


![](https://user-gold-cdn.xitu.io/2018/3/27/16267074918e461b?w=990&h=396&f=gif&s=41674)

混淆后的文件也已经生成：

![](https://user-gold-cdn.xitu.io/2018/3/27/162670807c5a4b24?w=1510&h=118&f=png&s=45397)

最后，让我们再来看看 CLI 的核心入口文件做了哪些更改：

```js
#!/usr/bin/env node

const command = process.argv[2]
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const defaultConfig = require('./default-webpack-config')

const defaultDevConfig = Object.assign({}, defaultConfig, { mode: 'development' })
const defaultProdConfig = Object.assign({}, defaultConfig, { mode: 'production' })

if (command === 'dev') {
  const compiler = Webpack(defaultDevConfig)
  const devServerOptions = defaultDevConfig.devServer
  const devServer = new WebpackDevServer(compiler, devServerOptions)
  devServer.listen(8080, 'localhost', () => {
    console.log('[Lovely-CLI] Starting server on http://localhost:8080')
  })

} else if (command === 'build') {
  Webpack(defaultProdConfig, function (err, stats) {
    if (err) {
      throw err
    }
    if (stats.hasErrors()) {
      console.log().log('[Lovely-CLI]', stats.toString());
    }
    process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n')
  })

} else {
  console.log('I am a lovely CLI.')
}
```

有实际运行以上代码的同学，会发现浏览器不会自动检测变化刷新，这也是我留给实际动手了的同学的一个思考题，正好趁此机会好好看看一点也不可爱的 webpack 的文档（建议英文）。

最终的代码已经放在 Github 上：

[lovely-cli](https://github.com/ulivz/lovely-cli)

说到这里，再回过头来看，上一篇文章中提到的 react-scripts, 你是不是也不陌生了呢？

当然，必须强调，这只是一个玩具（或者说连玩具都算不上），一个实际可用的工具，需要支撑足够多的场景，正如尤雨溪所说:

“判断一个开源库是不是玩具的一个参考是：这个库有没有因为实际生产中遇到的特殊情况而做出妥协。”

对于这样的一个轮子，你可以考虑支持：

1. 完整的命令行功能，支持 -- 和 - 语法；
2. 足够通用的默认配置（webpack4也明白了“约定优于配置”的道理。）；
3. 留出高拓展性的接口（plugin？preset？）；
4. 更漂亮的log页面（chalk又要登场啦...）；
5. 更优雅的reload（如：修改了webpack配置后根据新的配置重启dev-server）；

当然，还有很多了，只要你想得到。

# 甜点

老惯例，是时候给大家介绍一些甜点了。

## poi

[Github - poi](https://github.com/egoist/poi)

这是官翻：用一个 `.js` 文件编写一个应用程序，无论是 vue 还是 react，poi 会帮你处理所有的开发设置，没有更多的配置。

poi设计的精妙之处在于提供了 [presets](https://poi.js.org/#/presets) 机制，preset可以理解为针对特定场景的一些配置的集合。

在每一个 poi 的 preset 中，可以通过基于 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 设计的 API 来修改 webpack 的配置。所有的 preset 会在 app 运行前依次被调用。在你我都熟悉的 babel 中，不同的 preset 实际上就是不同的语法转换 plugin 的一个bundle。

值得开发 Vue 的同学注意的是，Vue、Vue JSX 以及 object-rest-spread 是内置的哦。

目前，poi支持以下预设：有没有你所熟悉的呢？

![](https://user-gold-cdn.xitu.io/2018/3/27/1626739e0566360c?w=948&h=616&f=png&s=166845)


## w7

[Github - w7](https://github.com/ulivz/w7)

w7的概念和poi不太一样，它更像是一个纯粹的dev server，没有任何配置，而做了一件简单的事，以某个特定端口serve某个html文件，并监听该文件的变化，当文件发生变化时，会自动刷新浏览器。或许很多人会提出疑问：这难道不是和前端工程化背道而驰吗？现在还会有人写纯html吗？

不，相反，我是一名狂热的前端工程化爱好者。诞生这个项目的缘由实际上还是来源于自己的需求，不知道细心的同学在有没有发现我博客仓库中，每个年份下都有一个tests目录，这是因为我经常会写一个相对独立的前端测试，它不隶属于某个项目，但我仍然想要它长期存在，我个人习惯以HTML的方式留存，而不是gist。

w7便解决了这个需求，当你只需要做一些简单的测试时，你并不需要任何构建工具，你只需要一个HTML文件。虽然只有一个HTML，但w7仍然可以帮你检测变化并刷新浏览器。

```
  w7 app.html   
```

同时，w7还内置了 vue、react以及rxjs的样板文件哦，如果你只是想测试一下一个怎么用 vue 写一个计数器，为什么要花那么多时间下载 vue-cli，还留下一堆 node_modules 等待清理呢？

```
  w7 init              # Generate a simple html file with random filename (includes git user name.)
  w7 init --lib vue    # Generate a Counter boilerplate with vue.
  w7 init --lib react  # Generate a Counter boilerplate with React+JSX.
```


## 总结

无论是一个从头开始的工具（如parcel），还是基于现有成熟方案开发的工具（如 react-scripts 和 poi ），一个好的构建工具，我认为是这样的：在将 API 设计得足够简单的同时，仍然保留其全部的拓展能力。从这一点上看，我认为egoist和她的poi做的相当好。

当然，也请别忘了向实际生产环境妥协。

CLI 系列到此就结束了。接下来几个月，我会专注在 vue 和 react 的源码、对比和思考中，同时也会告诉你如何写一个包含核心功能的 vue 或者 react 哦，所以下一个系列的标题，就暂定为《以更好的姿势看待 vue 和 react》吧，敬请关注。

以上，全文终。）


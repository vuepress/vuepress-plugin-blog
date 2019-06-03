---
date: 2018-03-15 20:44:40
tags: 
  - JavaScript
  - Prototype
author: ULIVZ
location: Shanghai
---

# 如何开发一个可爱的CLI（一）

## 前言

相信大家都写过`vue`,`react`或者`angular`的各位同学，也一定不会对以下库陌生：

- [**vue-cli**](https://github.com/vuejs/vue-cli)
- [**create-react-app**](https://github.com/facebook/create-react-app)
- [**angular-cli**](https://github.com/angular/angular-cli)

体验过上述工具的同学，有没有发现他们都有一个共同点——提供了一个可供快速开发的样板文件（**boilerplate**）。本文就将从样板文件入来进行阐述。通过本文，你将学到：

1. 一个`CLI`工具需要解决的问题；
2. 写一个`CLI`的基本思路；
3. 写一个`CLI`需要做哪些准备；

> PS：由于脚手架的英文 scaffolding 太长，本文我将以更可爱的 cli 来代替。

## 预热

由于篇幅有限，本节将以`create-react-app`和`vue-cli`为例（真地很难说服大家我是`ng`起家的...），回顾其使用过程：

首先是`create-react-app`， 按照README，我们生成出一个基本项目后，打开目录，其目录结构如下：

```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public 
│   └── favicon.ico
│   └── index.html
│   └── manifest.json 
└── src
    └── App.css
    └── App.js
    └── App.test.js
    └── index.css
    └── index.js
    └── logo.svg
    └── registerServiceWorker.js
```

说一下其中两个有意思的点：

- `public/manifest.json`: 这是PWA 的一部分，用来描述应用相关的信息。以前开发`cordova`的时候，这个还用来做过热更新。
- `src/registerServiceWorker.js`: 安装Service Workers文件。

> 很久没用它，原来已经默认支持`PWA`了，nice, 还不会的同学赶紧学起来，这里就不展开了。


接着，我们打开`package.json`，探一下究竟：

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-scripts": "1.1.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

非常简洁，但是有一个`react-scripts`。看起来很陌生，但是如果我告诉你它的依赖中有`babel`、`webpack`、`webpack-dev-server`和`autoprefixer`这些常见的前端流氓，我想你也清楚了`react-scripts`到底做了什么：

> 包装了 `webpack` 和 `webpack-dev-server`，提供一套默认的配置（内置css，file，svg等等各种loader），在 `react-scripts start` 和 `react-scripts build` 时直接运行这些配置。

一句话概括，就是为了帮你简化构建时的配置（Create React apps with no build configuration.😂）。

当然，零配置并非适用于大型定制项目的开发，`react-scripts`就像一个巨大的黑盒一样，总有存在一些其未提供 API 或者指令的场景，让你无从下手。`react-scripts`当然也不傻，还提供了一个比较fancy的指令：

- `react-scripts eject`: 将所有的工具（配置文件和 package.json 依赖库）解压到应用所在的路径。

厉害了😅，来运行看看：

![](https://user-gold-cdn.xitu.io/2018/3/13/1621b170cb9e018d?w=1938&h=928&f=png&s=198823)

当所有的依赖暴露出来是，果然`package.json`瞬间爆炸性增长了，顺时有点怀念从前的美好了。

好了，说到这里，create-react-app 要解决的问题就是：

1. 根据样板文件生成统一的项目骨架，让开发者快速投入开发；
2. 预置了一个易于开发的`react-scripts`，让开发者省略痛苦的配置流程.（`webpack`配置工程师看来要失业了😇）

接下来，再回顾一下 `vue-cli`。截止本文书写日期， vue-cli@3.0 仍然处于 beta 阶段，因此本文将以 2.x.x 为例，我们创建一个名为 my-vue-app，模板为 webpack-simple 的 vue 项目：

![](https://user-gold-cdn.xitu.io/2018/3/13/1621f8676c796ccd?w=1032&h=576&f=gif&s=65117)

可见，vue-cli在生成项目之前多了一个非常重要的一步 —— Prompt，也就是问询，根据询问的内容最终生成你的项目。两条FYI：

1. vue-cli 的问询功能是使用 [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) 这个库完成的。
2. webpack-simple 源码你可以在这里找到 [webpack-simple](https://github.com/vuejs-templates/webpack-simple) 。

对本节做一下结，一个脚手架通常由以下基本几部分组成：

1. 问询（Prompts）
2. 样板文件（Boilerplate）
2. 生成文件（Generate）


## 实战

经过上一节的洗礼，你可能已经有大致的思路了，然后，让我们以 vue-cli 为例，直接进入实战吧。

### 基本思路

1. 定义一个模板包的规则，这里采用 vue-cli 的规则：template 为源文件，meta.js/meta.json 为配置入口文件。

```json
my-first-package
├── meta.js
└── template
```

2. 解析包的meta.js，获得要询问的问题（prompts），并运行它，将最终用户的答案分配到一个上下文对象中；
3. 读取 template 中的内容，用刚刚获取的上下文对象去渲染它。


### 伪代码实现

以下是一个CLI的伪代码实现：

```js
// 10行伪代码实现一个CLI
function CLI(packageSourcePath) {
    const context = {}
    const meta = require(path.join(packageSourcePath, 'meta.js'))
    const templatePath = path.join(packageSourcePath, 'template')
    const { prompts } = meta
    return promptsRunner(prompts).then(anwsers => {
        Object.assign(context, anwsers)
        return generateFiles(templatePath, context)
    })
    .then(() =>  console.log('[OK]'))
    .error(() => console.log('[Error]'))
}
```

其中，promptsRunner用来问询，generateFiles 用来渲染并生成文件。哇！原来这么简单。


### 技术选型

这是 vue-cli 的技术选型：

1. 问询：[Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
2. 命令行解析：[commander.js](https://github.com/tj/commander.js)
3. 模板渲染：[handlebars.js](https://github.com/wycats/handlebars.js)
4. 文件生成：[metalsmith](https://github.com/segmentio/metalsmith)

热衷于看这个世界的你，是否已经跃跃欲试了呢?


### 更多

当然，如果只是这样的一个 CLI，很显然只是玩具，你可以考虑支持以下可爱的特性：

1. 在Context中注入默认的一些属性（如git的username）
2. 支持文件过滤（根据Context过滤）
3. 支持文件重命名（vue-cli默认不直接支持，但可以通过 metalsmith 的插件实现）
4. 支持包管理（如包的生成，缓存，拉取，更新，删除，自动化测试）
5. 提供一些生命周期的钩子（如beforePrompt，beforeRender，beforeExit等等）
6. 动态的输出路径（这个对于我来说很有用）

当然，还有很多了，只要你想得到。

## 甜点时刻

是时候给大家介绍一些甜点了。

### SAO

> Github传送门：[https://github.com/saojs/sao](https://github.com/saojs/sao)

一个听起来很骚气的名字，这是我们可爱的 EGOIST 写的一个库，基本上实现了上述我说的所有特性。

最为关键的是，SAO目前已经提供了大量的高质量的样板文件：

|name|description|
|---|---|
|[template](https://github.com/egoist/template-template)|Template for scaffolding out an SAO template|
|[lass](https://github.com/lassjs/lass)|Lass scaffolds a modern package boilerplate for node|
|[lad](https://github.com/ladjs/lad)|Lad scaffolds a Koa webapp and API framework for node|
|[vue](https://github.com/egoist/template-vue)|Kickstart a Vue project with [Poi](https://github.com/egoist/poi)|
|[gi](https://github.com/egoist/template-gi)|Generate .gitignore file in your project|
|[nm](https://github.com/egoist/template-nm)|Scaffold out a node module|
|[vue-webpack](https://github.com/egoist/template-vue-webpack)|Vue.js offcial webpack template (SAO port)|
|[basic](https://github.com/egoist/template-basic)|Basic project skeleton|
|[react](https://github.com/zcong1993/template-react)|SAO template for react with vbuild|
|[micro-service](https://github.com/tiaanduplessis/template-micro-service)|Scaffolding out a micro-service|
|[node-cli](https://github.com/therealklanni/template-node-cli)|Scaffold a node cli tool|
|[next](https://github.com/egoist/template-next)|Scaffold out a Next.js project|
|[electron](https://github.com/egoist/template-electron)|Scaffold out an Electron project|
|[expo](https://github.com/tiaanduplessis/template-expo)|Scaffold out an Expo app|

太强大了，这也大概就是我不得不爱 [EGOIST](https://github.com/egoist/) 的原因了吧。

### poz

> Github传送门：[https://github.com/ulivz/poz](https://github.com/ulivz/poz)

由于在实际生产中需要支持 重命名 和 动态输出路径，我写了 POZ  这个库，在前人的基础上，基于完全不一样的实现，实现了一样的功能，并加了一点儿特效，这大概就是造轮子的乐趣吧。欢迎大家 Fxxk/Issue。

最近 POZ 也计划开始开发 1.0的稳定版本了，快来看看这个 [RoadMap](https://github.com/ulivz/poz/wiki/POZv1-Roadmap)，太有野心了有木有。

### alphax

> Github传送门：[https://github.com/ulivz/alphax](https://github.com/ulivz/alphax)

这是 poz 底层使用的一个库，基于Stream，灵感来源于 metalsmith 和 SAO 底层的 majo，最近我彻底重写了该库，让其有了以下可爱的特性：

1. 极简的API；
2. 任务流控制；
3. 中间件；
4. 基于纯函数或JSON的的文件过滤；
5. 基于纯函数或JSON的文件重命名；
6. 支持不写入硬盘，易于测试;

它使用起来像这样：

```js
alphax()
  .src('**')
  .task(task1)
  .task(task2)
  .task(task3)
  .use(file => file.content += Date.now())
  .rename(filepath => filepath.replace('{name}', name))
  .rename(filepath => filepath.replace('{age}', age))
  .transform(content => content.replace('{name}', name))
  .filter(filepath => filepath.endWith('.js'))
  .filter(filepath => !filepath.startWith('test'))
  .dest('dist')
  .then(files => console.log(files))
  .catch(error => console.log(error))
```

如果你不喜欢函数，也可以用配置的方式来：

```js
const config = {
  tasks: [task1, task3, task3],
  use: file => file.content += Date.now(),
  rename: {
    '{name}': name,
    '{age}': age
  },
  filter: {
    'app.js': true,
    'test.js': false
  },
  transform(content) {
    return content.replace('{name}', name)
  }
}

alphax()
  .src('**', config)
  .dest('dist')
  .then(files => console.log(files))
  .catch(error => console.log(error))
```

相信这个lib已经解决掉你大部分的 meta.js 的API设计问题了😄。附上用可爱的 [docute](https://github.com/egoist/docute) 写的文档地址： [Documentation](http://www.v2js.com/alphax/#/)

## 总结

一个CLI归根到底是要解决的是生产力和统一性的问题，但是，对于create-react-app这种过度封装，和 vue-cli@2.x.x 的过度松散，似乎都不是最佳方案。配置少和拓展性高这本来就是两个互相矛盾的话题，从长远来看，选择怎样的CLI还是依赖于具体的场景，但作为一个CLI开发者，如果做到更好的平衡，还值得多多思考。

本文仅谈及了写一个CLI工具的第一部分，其基本思路较为简单，只是实现层面会有较多的优化点和 error catch 😅，Good luck！

下文，我将继续阐述类似于 create-react-app 中 react-scripts 的基本实现原理及其思路，实际上，这也是 vue-cli@3.x.x 和 poi 所具有的功能，敬请关注。


以上，全文终。）

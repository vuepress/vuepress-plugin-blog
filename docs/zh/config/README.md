---
sidebar: auto
---

# 配置

::: tip 提示
我们强烈建议您在使用此插件之前阅读 [Getting Started](../guide/getting-started.md) 部分。
:::

## directories

- 类型: `DirectoryClassifier[]`
- 默认值: `[]`

创建一个或多个 [directory classifiers](../guide/getting-started.md#directory-classifier)，所有位于 `DirectoryClassifier` 可用选项如下。

### id

- 类型: `string`
- 默认值: `undefined`
- 必要: `true`

当前分类器的唯一ID，例如 `post`.

### dirname

- 类型: `string`
- 默认值: `undefined`
- 必要: `true`

匹配的目录名称，例如 `_post`.

### path

- 类型: `string`
- 默认值: `/${id}/`
- 必要: `false`

当前分类器的输入页面，例如 `/` 或者 `/post/`.

如果您将 `DirectoryClassifier.path` 设置为 `/`, 则意味着您要访问在 `/` 列出的处的匹配页面列表。设置到 `/post/` 也是一样的。

### layout

- 类型: `string`
- 默认值: `'IndexPost' || 'Layout'`
- 必要: `false`

入口页面的布局组件名称。

### frontmatter

- 类型: `Record<string, any>`
- 默认值: `{}`
- 必要: `false`

整个页面的 [Frontmatter](https://v1.vuepress.vuejs.org/zh/guide/frontmatter.html)。

### itemLayout

- 类型: `string`
- 默认值: `'Post'`
- 必要: `false`

匹配页面的布局。

### itemPermalink

- 类型: `string`
- 默认值: `'/:year/:month/:day/:slug'`
- 必要: `false`

匹配页面的永久链接。

例如，如果您设置的目录分类器的目录名为 `_post` ，并且具有以下页面：

```
.
└── _posts
    ├── 2018-4-4-intro-to-vuepress.md
    └── 2019-6-8-intro-to-vuepress-next.md
```

伴随着默认的 `itemPermalink`, 您将获得以下输出路径：

```
/2018/04/04/intro-to-vuepress/
/2019/06/08/intro-to-vuepress-next/
```

有关永久链接的更多详细信息，请转到 VuePress 文档中的 [永久链接](https://v1.vuepress.vuejs.org/zh/guide/permalinks.html) 部分

### pagination

- 类型: `Pagination`
- 默认值: `{ lengthPerPage: 10 }`
- 必要: `false`

请转到 [分页配置](../pagination/README.md#config) 部分以获取所有可用选项。

## frontmatters

### id

- 类型: `string`
- 默认值: `undefined`
- 必要: `true`

当前分类器的唯一ID，例如 `tag`。

### keys

- 类型: `string`
- 默认值: `undefined`
- 必要: `true`

用于对页面进行分类的 Frontmatter 键值。

您还可以合并具有相同含义的多个标签，例如：

```js
module.exports = {
  plugins: [
    ['@vuepress/plugin-blog', {
      frontmatters: [
        {
          id: "tag",
          keys: ['tag', 'tags'],
        },
      ]
    }],
  ],
}
```

### path

- 类型: `string`
- 默认值: `/${id}/`
- 必要: `false`

当前分类的入口页面，例如 `/` 或 `/post/`。

### layout

- 类型: `string`
- 默认值: `'IndexPost' || 'Layout'`
- 必要: `false`

入口页面的布局组件名称。

### frontmatter

- 类型: `Record<string, any>`
- 默认值: `{}`
- 必要: `false`

整个页面的 [Frontmatter](https://v1.vuepress.vuejs.org/guide/frontmatter.html)。

### pagination

- 类型: `Pagination`
- 默认值: `{ lengthPerPage: 10 }`
- 必要: `false`

请转到 [分页配置](../pagination/README.md#config) 部分以获取所有可用选项。

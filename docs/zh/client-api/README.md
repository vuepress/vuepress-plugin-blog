---
sidebar: auto
---

# 客户端 API

::: tip 提示
我们强烈建议您在使用此插件之前阅读 [快速上手](../guide/getting-started.md) 部分。
:::

## $pagination

::: warning 警告
请注意，如果您在与任何分类都不匹配的路由上访问 `$pagination` ，则 `$pagination` 的值将为 `null` 。

因此，当您开发布局组件时，您需要验证 `$pagination` 是否存在。
:::

### $pagination.pages

当前路由的匹配页面。例如：

```json
[
  { "relativePath": "b.md", "path": "/b.html" ... },
  { "relativePath": "a.md", "path": "/a.html" ... },
]
```

### $pagination.length

当前分页的长度。

### $pagination.hasPrev

是否存在上一个分页。

### $pagination.prevLink

上一个分页的链接。

### $pagination.hasNext

是否存在下一个分页。

### $pagination.nextLink

下一个分页的链接。

### $pagination.getSpecificPageLink

通过页码获取特定的分页页面。

::: tip 提示
您可以使用此功能将分页组件自定义为内部 [`<Pagnination />`](../components/#pagination) 组件。
:::

## $frontmatterKey

如果您按照以下方式创建 [Frontmatter 分类器](../guide/getting-started.md#frontmatter-classifier)：

```js
module.exports = {
  plugins: [
    [
      '@vuepress/blog',
      {
        frontmatters: [
          {
            // 当前分类的唯一 ID
            id: 'tag',
            // 决定将 frontmatter 键值归到该类别下
            keys: ['tag'],
            // `entry page` (或者 `list page`) 的路径
            path: '/tag/',
            // `entry page` 的布局
            layout: 'Tag',
          },
        ],
      },
    ],
  ],
}
```

那么此插件将向 Vue 原型注入 `$frontmatterKey` 对象, ，因此您可以在自己的布局组件 (`<Tag />`) 上直接使用它。

### `$frontmatterKey.list`

获取一个含有匹配的 frontmatter 分类器类型的列表。

接口如下:

```typescript
type FrontmatterKeyList = Array<{
  name: string;
  path: string;
  pages: Array<VuePressPage>;
}>
```

您可以重新阅读 [Frontmatter 分类器](../guide/getting-started.md#frontmatter-classifier) 来观看 `tag` 的真实示例。

::: tip 多个 Frontmatter 分类器

如果您创建两个 Frontmatter 分类器，例如 `tag` 和 `category`，那么在 `/tag/` 路由中，`$frontmatterKey` 
自动指向 `tag` ，而在 `/category/` 中，它将指向 `category`。

此变量本质上是设计用于概括 frontmatter 键的列表页面。
:::

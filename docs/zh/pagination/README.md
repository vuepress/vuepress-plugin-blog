---
sidebar: auto
---

# 分页配置

::: tip 提示
我们强烈建议您在使用此插件之前阅读 [快速上手](../guide/getting-started.md) 部分。
:::

## sorter

- 类型: function
- 默认值: `See Below`

匹配页面的排序器，默认排序器如下：

```typescript
function sorter(prev: VuePressPage, next: VuePressPage){
  const prevTime = new Date(prev.frontmatter.date).getTime()
  const nextTime = new Date(next.frontmatter.date).getTime()
  return prevTime - nextTime > 0 ? -1 : 1
},
```

该函数将是 [Array.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的一个参数。

## lengthPerPage

- Type: number
- Default: `10`

每页的最大帖子数。

## layout

- 类型: string
- 默认值: `DirectoryPagination || Layout`

分页页面的布局（索引页面除外）。

## getPaginationPageUrl

- 类型: function
- 默认值: `See Below`

动态获取分页页面网址的函数：

```js
function getPaginationPageUrl(index) {
  if (index === 0) {
    return indexPath
  }
  return `${indexPath}page/${index + 1}/`
}
```

- 对于 [目录分类器](../README.md#directory-classifier), `indexPath` 默认为 `/${classifier.id}/` (例如 `/post/`)
- 对于 [frontmatter 分类器](../README.md#frontmatter-classifier), `indexPath` 默认为 `/${classifier.pid}/${classifier.id}`
(例如 `/tag/js/`)

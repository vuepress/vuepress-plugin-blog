---
sidebar: auto
---

# 组件

为了更好地享受此插件的便利，该插件提供了一些现成的组件。

## `<SimplePagination>`

- 源代码：
[SimplePagination.vue](https://github.com/ulivz/vuepress-plugin-blog/blob/master/src/client/components/SimplePagination.vue)
- 使用：

```vue
<template>
  <SimplePagination />
</template>

<script>
import { SimplePagination } from '@vuepress/plugin-blog/lib/client/components'
export default {
  components: {
    SimplePagination
  }
}
</script>
```

- 输出:

<img src="/simple-pagination.png" width="250" height="" style=""/>

::: tip
您可以在 [palette.styl](https://v1.vuepress.vuejs.org/config/#palette-styl) 使用 `$accentColor` 来调整
该组件的默认颜色。
:::

## `<Pagination>`

- 源代码：[Pagination.vue](https://github.com/ulivz/vuepress-plugin-blog/blob/master/src/client/components/Pagination.vue)
- 使用：

```vue
<template>
  <Pagination />
</template>

<script>
import { Pagination } from '@vuepress/plugin-blog/lib/client/components'
export default {
  components: {
    Pagination
  }
}
</script>
```

- 输出：

<img src="/pagination.png" width="250" height="" style=""/>

::: tip
您可以在 [palette.styl](https://v1.vuepress.vuejs.org/config/#palette-styl) 使用 `$accentColor` 来调整
该组件的默认颜色。
:::

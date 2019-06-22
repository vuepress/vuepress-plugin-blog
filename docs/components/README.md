---
sidebar: auto
---

# Components

In order to better enjoy the convenience of this plugin, the plugin provides some out-of-the-box components.

## `<SimplePagination>`

- Source Code: 
[SimplePagination.vue](https://github.com/ulivz/vuepress-plugin-blog/blob/master/src/client/components/SimplePagination.vue)
- Usage:

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

- Output:

<img src="/simple-pagination.png" width="250" height="" style=""/>

::: tip
You can use `$accentColor` in [palette.styl](https://v1.vuepress.vuejs.org/config/#palette-styl) to adjust the 
default colors of this component.
:::

## `<Pagination>`

- Source Code: [Pagination.vue](https://github.com/ulivz/vuepress-plugin-blog/blob/master/src/client/components/Pagination.vue)
- Usage:

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

- Output:

<img src="/pagination.png" width="250" height="" style=""/>

::: tip
You can use `$accentColor` in [palette.styl](https://v1.vuepress.vuejs.org/config/#palette-styl) to adjust the 
default colors of this component.
:::

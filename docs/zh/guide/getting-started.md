# 快速入门

::: tip
本部分是包含一些概念的分步教程，并且我们建议您在使用前这个插件前完全阅读它。
:::

## 文档分类器 (`Document classifier`)

`Document classifier` 是一组功能，可以对具有相同特征的页面进行分类。对于博客开发人员，不同页面之间可能存在相同的特征，如下所示：

- 放在目录中的页面 (例如 `_post`)
- 包含相同的特定 frontmatter 值的页面 (例如 `tag: js`).

当然，它们都可能与另一个通用要求 “分页”(`pagination`) 有关。

那么，如何巧妙地将它们组合在一起？接下来，让我们看一下该插件如何解决这些问题。

## 目录分类器

目录分类器，会对用于对放置在同一目录中的源页面进行分类。

假设您具有以下文件结构：

```vue
.
└── _posts    
    ├── 2018-4-4-intro-to-vuepress.md    
    └── 2019-6-8-intro-to-vuepress-next.md
```

在传统的VuePress网站中，转换后的页面URL为：

- `_posts/2018-4-4-intro-to-vuepress.html`
- `_posts/2019-6-8-intro-to-vuepress-next.html`

似乎没有按照博客组织，因此是时候使用此插件了：

```js
// .vuepress/config.js
module.exports = {
  plugins: [
    [
      '@vuepress/blog',
      {
        directories: [
          {
            // 当前分类的唯一ID
            id: 'post',
            // 目标文件夹
            dirname: '_posts',
            // `entry page` (或者 `list page`) 的路径
            path: '/',
          },
        ],
      },
    ],
  ],
}
```

然后，该插件将帮助您生成以下页面，并自动利用相应的页面
布局：

| 页面地址                              | 布局                                     |
| ------------------------------------- | ---------------------------------------- |
| `/`                                   | `IndexPost` (回退到 `Layout` 如果不存在) |
| `/2018/04/04/intro-to-vuepress/`      | `Post`                                   |
| `/2019/06/08/intro-to-vuepress-next/` | `Post`                                   |

这意味着您需要创建两个布局组件 (`IndexPost` and `Post`) 来处理 `index` 和 `post` 页面的布局。

您还可以自定义布局组件：

```diff
// .vuepress/config.js
module.exports = {
  plugins: [
    ['@vuepress/blog', {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
          path: '/',
+         layout: 'MyIndexPost',
+         itemLayout: 'MyPost',
        },
      ],
    }]
  ]
}
```

并自定义入口页面的路径和帖子的永久链接：

```diff
// .vuepress/config.js
module.exports = {
  plugins: [
    ['@vuepress/blog', {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
-         path: '/',
+         path: '/post/',
+         itemPermalink: '/post/:year/:month/:day/:slug',
        },
      ],
    }]
  ]
}
```

::: warning
值得注意的是，`path` 和 `itemPermalink` 必须统一修改，并且 `itemPermalink` 必须带有前缀
`path`。

`itemPermalink` 的默认值为 `'/:year/:month/:day/:slug'`,
:::

**也可以详见**:

- [配置 > 目录](../config/README.md#directories)

## 分页

随着您的博客文章越来越多，您开始需要分页。默认情况下，此插件集成了一个
非常强大的分页系统，使您可以通过简单的配置访问分页功能。

默认情况下，插件假定每页的最大页面数为 `10` 。您也可以像这样修改它：

```diff
// .vuepress/config.js
module.exports = {
  plugins: [
    ['@vuepress/blog', {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
          path: '/',
+         pagination: {
+           lengthPerPage: 2,
+         },
        },
      ],
    }]
  ]
}
```

假设您在 `_posts` 目录中有3个页面：

- `_posts/2018-6-8-a.md`
- `_posts/2019-6-8-b.md`
- `_posts/2019-6-8-c.md`

当 `lengthPerPage` 选项被设置为 `2`，此插件将帮助您生成以下页面：

| url              | layout                                                    |
| ---------------- | --------------------------------------------------------- |
| `/`              | `IndexPost` (fallback to `Layout` if not exist)           |
| `/page/2/` (New) | `DirectoryPagination` (fallback to `Layout` if not exist) |
| `/2019/06/08/a/` | `Post`                                                    |
| `/2019/06/08/b/` | `Post`                                                    |
| `/2018/06/08/c/` | `Post`                                                    |

那么如何在布局组件中获取匹配的页面呢？实际上，它将比您想象的简单得多。

如果您访问 `/`，则当前页面会使用布局 `IndexPost`。在此布局组件中，您只需要使用
`this.$pagination.pages` 即可获取匹配的页面。在上面的示例中，`this.$pagination.pages` 的实际值将为：

```json
[
  { "relativePath": "_posts/2019-6-8-a.md", "path": "/2019/06/08/a/" ... },
  { "relativePath": "_posts/2019-6-8-b.md", "path": "/2019/06/08/b/" ... },
]
```

如果您访问`/`，则当前页面会使用布局 `DirectoryPagination` ，您也可以使用
`this。$pagination.pages` 来访问它：

```json
[
  { "relativePath": "_posts/2019-6-8-c.md", "path": "/2019/06/08/c/" ... },
]
```

这难道不是很自然的体验吗？您只需要关心布局组件的样式，而不是它背后复杂而乏味的逻辑。

::: tip
为了节省文档的长度，我们省略了 `$page` 对象的数据结构。您可以在 [官方文档](https://v1.vuepress.vuejs.org/zh/guide/global-computed.html#page) 获得有关 `$page` 数据结构的更多信息。
:::

**也可详见**:

- [分页配置](../pagination/README.md)

## Frontmatter 分类器

Frontmatter分类器，用于对具有相同 frontmatter 键值的页面进行分类。

假设您有三个页面：

- `a.md`:

```mardkown
---
tag: vue
---
```

- `b.md`:

```mardkown
---
tag: vue
---
```

- `c.md`:

```mardkown
---
tag: js
---
```

如果您想轻松地对它们进行分类，则可以这样配置：

```js
module.exports = {
  plugins: [
    [
      '@vuepress/blog',
      {
        frontmatters: [
          {
            // 当前分类的唯一ID
            id: 'tag',
            // 决定将f rontmatter 键值归到该类别下
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

然后，该插件将帮助您生成以下额外页面，并自动利用相应的布局：

| 地址        | 布局                                                        |
| ----------- | ----------------------------------------------------------- |
| `/tag/`     | `Tag` (fallback to `FrontmatterKey` if not exist)           |
| `/tag/vue/` | `FrontmatterPagination` (fallback to `Layout` if not exist) |
| `/tag/js/`  | `FrontmatterPagination` (fallback to `Layout` if not exist) |

在 `<Tag />` 组件中，您可以使用 [this.$frontmatterKey.list](../client-api/README.md#frontmatterkey) 来获取
标签
列表。值将会像这样：

```json
[
  {
    "name": "vue",
    "path": "/tag/vue/",
    "pages": [
      { "relativePath": "b.md", "path": "/b.html" ... },
      { "relativePath": "a.md", "path": "/a.html" ... },
    ]
  },
  {
    "name": "js",
    "path": "/tag/js/",
    "pages": [
      { "relativePath": "c.md", "path": "/c.html" ... },
    ]
  }
]
```

在 `FrontmatterPagination` 组件中，您可以使用
[this.$pagination.pages](../client-api/README.md#pagination) 获取当前标签中匹配的页面：
分类：

- 如果您访问了 `/tag/vue/`，`this.$pagination.pages` 将是：

```json
[
  { "relativePath": "b.md", "path": "/b.html" ... },
  { "relativePath": "a.md", "path": "/a.html" ... },
]
```

- 如果您访问了 `/tag/js/`，`this.$pagination.pages` 将是：

```json
[
  { "relativePath": "c.md", "path": "/c.html" ... },
]
```

**也可详见**:

- [配置 > frontmatters](../config/README.md#frontmatters)

## 撰写博客主题

如果一切正常，您就可以开始编写博客主题。实际上，创建博客主题只有 2 个必要的布局组件：

- Layout
- Post
- FrontmatterKey (仅在设置 frontmatter 分类时才需要)

这是为您提供的两个官方示例 (简单 和 复杂 ) ：

- [70 行的 vuepress 博客主题](https://github.com/ulivz/70-lines-of-vuepress-blog-theme): 一个大约70行中实现的 VuePress 博客主题。
- [@vuepress/theme-blog](https://github.com/ulivz/vuepress-theme-blog): VuePress 的默认博客主题。


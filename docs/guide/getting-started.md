# Getting Started

## Document Classifier

`Document classifier` is a set of functions that can classify pages with the same characteristics. For a blog developer, the same characteristics may exist between different pages as follows:

- Pages put in a directory (e.g. `_post`)
- Pages containing the same specific frontmatter key value (e.g. `tag: js`).

Of course, both of them may be related to another common
requirement, `pagination`.

So, how to combine them skillfully? Next, let's take a look at how this plugin solve these problems.

## Directory Classifier

Directory Classifier, that classifies the source pages placed in a same directory.

Suppose you have the following files structure:

```vue
.
└── _posts    
    ├── 2018-4-4-intro-to-vuepress.md    
    └── 2019-6-8-intro-to-vuepress-next.md
```

In the traditional VuePress site, the converted page URLs will be:

- `_posts/2018-4-4-intro-to-vuepress.html`
- `_posts/2019-6-8-intro-to-vuepress-next.html`

It doesn't seem blogging, so it's time to use this plugin:

```js
// .vuepress/config.js
module.exports = {
  plugins: [
    [
      '@vuepress/blog',
      {
        directories: [
          {
            // Unique ID of current classification
            id: 'post',
            // Target directory
            dirname: '_posts',
            // Path of the `entry page` (or `list page`)
            path: '/',
          },
        ],
      },
    ],
  ],
}
```

Then the plugin will help you to generate following pages, and automatically leverage corresponding
layout:

| url                                   | layout                 |
| ------------------------------------- | ---------------------- |
| `/`                                   | `IndexPost` / `Layout` |
| `/2018/04/04/intro-to-vuepress/`      | `Post`                 |
| `/2019/06/08/intro-to-vuepress-next/` | `Post`                 |

This means that you need to create two layout components(`IndexPost` and `Post`) to handle the layout of index and post
pages.

You can also custom the layout component name:

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

And custom the root path and the permalink:

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
It is noteworthy that the `path` and `itemPermalink` must be uniformly modified, and `itemPermalink` must be prefixed with
`path`.

The default value of `itemPermalink` is `'/:year/:month/:day/:slug'`.
:::

## Pagination

As your blog articles grew more and more, you began to have the need for paging. By default, this plugin integrates a
very powerful pagination system that allows you to access paging functions with simple configuration.

By default, the plugin assumes that the max number of pages per page is `10`. you can also modify it like this:

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
+           perPagePosts: 2,
+         },
        },
      ],
    }]
  ]
}
```

Suppose you have 3 pages at `_posts` direcotry:

- `_posts/2018-6-8-a.md`
- `_posts/2019-6-8-b.md`
- `_posts/2019-6-8-c.md`

When the `perPagePosts` is set to `2`, this plugin will help you generate the following pages:

| url              | layout                           |
| ---------------- | -------------------------------- |
| `/`              | `IndexPost` / `Layout`           |
| `/page/2/` (New) | `DirectoryPagination` / `Layout` |
| `/2019/06/08/a/` | `Post`                           |
| `/2019/06/08/b/` | `Post`                           |
| `/2018/06/08/c/` | `Post`                           |

::: tip
`DirectoryPagination / Layout` means that the layout component will be downgraded to `Layout` when `DirectoryPagination` layout doesn't exist.
:::

So how to get the matched pages in the layout component? In fact, it will be much simpler than you think.

If you visit `/`, current page leverages layout `IndexPost`. In this layout component, you just need to use
`this.$pagination.pages` to get the matched pages. In the above example, the actual value of `this.$pagination.pages` will
be:

```json
[
  { "relativePath": "_posts/2019-6-8-a.md", "path": "/2019/06/08/a/" ... },
  { "relativePath": "_posts/2019-6-8-b.md", "path": "/2019/06/08/b/" ... },
]
```

If you visit `/`, current page leverages layout `DirectoryPagination`, you can also use
`this.$pagination.pages` to access it:

```json
[
  { "relativePath": "_posts/2019-6-8-c.md", "path": "/2019/06/08/c/" ... },
]
```

Isn't this very natural experience? You just need to care about the style of your layout component, not the complicated and boring logic behind it.

::: tip
To save the length of docs, we omitted the data structure of the `$page` object. You can get more information about
the data structure of `$page` at the [official documentation](https://v1.vuepress.vuejs.org/guide/global-computed.html#page).
:::

### Frontmatter Classifier

Frontmatter Classifier, which classifies pages that have the same frontmatter key values.

Suppose you have three pages:

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

If you want to easily classify them, you can config like this:

```js
module.exports = {
  plugins: [
    [
      '@vuepress/blog',
      {
        frontmatters: [
          {
            // Unique ID of current classification
            id: 'tag',
            // Decide that the frontmatter keys will be grouped under this classification
            keys: ['tag'],
            // Path of the `entry page` (or `list page`)
            path: '/tag/',
            // Layout of the `entry page`
            layout: 'Tag',
          },
        ],
      },
    ],
  ],
}
```

Then the plugin will help you to generate the following extra pages, and automatically leverage
the corresponding layout:

| url         | layout                             |
| ----------- | ---------------------------------- |
| `/tag/`     | `Tag`                              |
| `/tag/vue/` | `FrontmatterPagination` / `Layout` |
| `/tag/js/`  | `FrontmatterPagination` / `Layout` |

In the `<Tag />` component, you can use `this.$tag.list` to get the tag list. The value would be like:

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

In the `FrontmatterPagination` component, you can use `this.$pagination.pages` to get the matched pages in current tag
classification:

- If you visit `/tag/vue/`, the `this.$pagination.pages` will be:

```json
[
  { "relativePath": "b.md", "path": "/b.html" ... },
  { "relativePath": "a.md", "path": "/a.html" ... },
]
```

- If you visit `/tag/js/`, the `this.$pagination.pages` will be:

```json
[
  { "relativePath": "c.md", "path": "/c.html" ... },
]
```

# Examples

Actually, there are only 2 necessary layout components to create a blog theme:

- Layout
- Post
- Tag (Only required when you set up a `tag` frontmatter classification.)

Here is [live example](https://github.com/ulivz/70-lines-of-vuepress-blog-theme) that implements a functionally qualified VuePress theme in around 70 lines.

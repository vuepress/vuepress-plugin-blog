---
sidebar: auto
---

# Config

## directories

- Type: `DirectoryClassifier[]`
- Default: `[]`

Create one or more [directory classifiers](../README.md#directory-classifier), all available options in
`DirectoryClassifier` are as
follows.

### id

- Type: `string`
- Default: `undefined`
- Required: `true`

Unique id for current classifier, e.g. `post`.

### dirname

- Type: `string`
- Default: `undefined`
- Required: `true`

Matched directory name, e.g. `_post`.

### path

- Type: `string`
- Default: `/${id}/`
- Required: `false`

Entry page for current classifier, e.g. `/` or `/post/`.

If you set `DirectoryClassifier.path` to `/`, it means that you want to access the matched pages list at `/`. set
to `/post/` is the same.

### layout

- Type: `string`
- Default: `'IndexPost' || 'Layout'`
- Required: `false`

Layout component name for entry page.

### frontmatter

- Type: `Record<string, any>`
- Default: `{}`
- Required: `false`

[Frontmatter](https://v1.vuepress.vuejs.org/guide/frontmatter.html) for entry page.

### itemLayout

- Type: `string`
- Default: `'Post'`
- Required: `false`

Layout for matched pages.

### itemPermalink

- Type: `string`
- Default: `'/:year/:month/:day/:slug'`
- Required: `false`

Permalink for matched pages.

For example, if you set up a directory classifier with dirname equals to `_post`, and have following pages:

```
.
└── _posts
    ├── 2018-4-4-intro-to-vuepress.md
    └── 2019-6-8-intro-to-vuepress-next.md
```

With the default `itemPermalink`, you'll get following output paths:

```
/2018/04/04/intro-to-vuepress/
/2019/06/08/intro-to-vuepress-next/
```

For more details about permalinks, please head to [Permalinks](https://v1.vuepress.vuejs.org/guide/permalinks.html) section at VuePress's documentation.

### pagination

- Type: `Pagination`
- Default: `{ perPagePosts: 10 }`
- Required: `false`

All available options of pagination are as follows:

- pagination.perPagePosts: Maximum number of posts per page.
- pagination.pagesSorter: Maximum number of posts per page.

## frontmatters

> TODO, contribution welcome.

---
sidebar: auto
---

# Client API

::: tip TIP
We strongly recommend that you read the [Getting Started](../guide/getting-started.md) section before using this plugin.
:::

## $pagination

### $pagination.pages

Matched pages for current route. example:

```json
[
  { "relativePath": "b.md", "path": "/b.html" ... },
  { "relativePath": "a.md", "path": "/a.html" ... },
]
```

### $pagination.length

Length of current paginations.

### $pagination.hasPrev

Whether previous pagination page exists.

### $pagination.prevLink

Link of previous pagination page.

### $pagination.hasNext

Whether next pagination page exists.

### $pagination.nextLink

Link of next pagination page.

### $pagination.getSpecificPageLink

Get specific pagination page via page number.

::: tip TIP
You can use this function to custom the pagination component as the internal 
[`<Pagnination />`](../components/#pagination) component.
:::


## `$${FCID}`

FCID, i.e the id of [Frontmatter Classifier](../guide/getting-started.md#frontmatter-classifier), if you create a 
[Frontmatter Classifier](../guide/getting-started.md#frontmatter-classifier) as follows:

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

Then this plugin will inject a `$tag` object to the prototype of Vue, so you can use it directly at your 
layout component (`<Tag />`).

### `$${FCID}.list`

Get the list of matched frontmatter classifier types.

The interface is as follows:

```typescript
type FCID = Array<{
  name: string;
  path: string;
  pages: Array<VuePressPage>;
}>
```

You can re-read the [Frontmatter Classifier](../guide/getting-started.md#frontmatter-classifier) to see the live 
example of `tag`.

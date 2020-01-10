---
sidebar: auto
---

# Pagination Config

::: tip TIP
We strongly recommend that you read the [Getting Started](../guide/getting-started.md) section before using this plugin.
:::

## sorter

- Type: function
- Default: `See Below`

Sorter for matched pages, the default sorter is as follows:

```typescript
function sorter(prev: VuePressPage, next: VuePressPage){
  const prevTime = new Date(prev.frontmatter.date.replace(/\-/g, '/')).getTime()
  const nextTime = new Date(next.frontmatter.date.replace(/\-/g, '/')).getTime()
  return prevTime - nextTime > 0 ? -1 : 1
},
```
The function will be a parameter of [Array.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

::: warning Note
You might be intrigued by `replace(/\-/g, '/')`. Because only the dates in frontmatter written in 2-digits will be transformed, other dates written in single-digit, such as `2020-1-1` will be treated as string. Some browsers (e.g. Safari) don't support this format.
:::

## prevText

- Type: string
- Default: `Prev`

Text for previous links.

## nextText

- Type: string
- Default: `Next`

Text for next links.

## lengthPerPage

- Type: number
- Default: `10`

Maximum number of posts per page.

## layout

- Type: string
- Default: `DirectoryPagination || Layout`

Layout for pagination page (Except the index page.)

## getPaginationPageUrl

- Type: function
- Default: `See Below`

A function to get the url of pagination page dynamically:

```js
function getPaginationPageUrl(index) {
  if (index === 0) {
    return indexPath
  }
  return `${indexPath}page/${index + 1}/`
}
```

- For [directory classifier](../README.md#directory-classifier), the `indexPath` defaults to `/${classifier.id}/` (e.g
. `/post/`)
- For [frontmatter classifier](../README.md#frontmatter-classifier), the `indexPath` defaults to `/${classifier.pid}/${classifier.id}` 
(e.g. `/tag/js/`)

## getPaginationPageTitle

- Type: function
- Default: `See Below`

A function to get the title of pagination page dynamically:

```js
// directories
function getPaginationPageTitle (pageNumber) {
  return `Page ${pageNumber} | ${entryTitle}`
}

// frontmatters
function getPaginationPageTitle (pageNumber, key) {
  return `Page ${pageNumber} - ${key} | ${entryTitle}`
}
```

There are two args to help you customize your title: 
- `pageNumber`
- `key` : the [key](../config/#keys) while configuring frontmatters

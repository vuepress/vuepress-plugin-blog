# Pagination

## Config

### sorter

- Type: string
- Default: `See Below`

Sorter for matched pages, the default sorter is as follows:

```typescript
function sorter(prev: VuePressPage, next: VuePressPage){
  const prevTime = new Date(prev.frontmatter.date).getTime()
  const nextTime = new Date(next.frontmatter.date).getTime()
  return prevTime - nextTime > 0 ? -1 : 1
},
```

### lengthPerPage

- Type: string
- Default: `10`

Maximum number of posts per page.

### layout

- Type: string
- Default: `DirectoryPagination || Layout`

Layout for pagination page (Except the index page.)

### getPaginationPageUrl

- Type: string
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
- For [frontmatter classifier](../README.md#frontmatter-classifier), the `indexPath` defaults to `/${classifier
.pid}/${classifier.id}` (e.g. 
`/tag/js/`)


## Client API

### $pagination

#### $pagination.pages

Matched pages for current route.

#### $pagination.length

Length of current paginations.

#### $pagination.hasPrev

Whether previous pagination page exists.

#### $pagination.prevLink

Link of previous pagination page.

#### $pagination.hasNext

Whether next pagination page exists.

#### $pagination.nextLink

Link of next pagination page.

#### $pagination.getSpecificPageLink

Get specific pagination page via page number.






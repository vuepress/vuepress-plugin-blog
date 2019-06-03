import { AppContext } from './interface/VuePress'
import { InternalPagination } from './interface/Pagination'

export async function registerPagination(paginations: InternalPagination[], ctx: AppContext) {
  ctx.paginations = []
  ctx.pageFilters = {}
  ctx.pageSorters = {}

  function recordPageFilters(pid, filter) {
    if (ctx.pageFilters[pid]) {
      return
    }
    ctx.pageFilters[pid] = filter.toString()
  }

  function recordPageSorters(pid, sorter) {
    if (ctx.pageSorters[pid]) {
      return
    }
    ctx.pageSorters[pid] = sorter.toString()
  }

  for (const {
    pid,
    id,
    meta,
    getUrl = index => `/${id}/${index}/`,
    getTitle = index => `Page ${index + 1} | ${id}`,
    options,
  } of paginations) {
    const defaultPostsFilterMeta = {
      args: ['page'],
      body: `return page.pid === ${JSON.stringify(
        pid,
      )} && page.id === ${JSON.stringify(id)}`,
    }

    const defaultPostsFilter = new Function(
      // @ts-ignore
      defaultPostsFilterMeta.args,
      defaultPostsFilterMeta.body,
    )
    const defaultPostsSorter = (prev, next) => {
      const prevTime = new Date(prev.frontmatter.date).getTime()
      const nextTime = new Date(next.frontmatter.date).getTime()
      return prevTime - nextTime > 0 ? -1 : 1
    }

    const {
      perPagePosts = 10,
      layout = 'Layout',
      serverPageFilter = defaultPostsFilter,
      clientPageFilter = defaultPostsFilter,
      // @ts-ignore
      clientPageSorter = defaultPostsSorter,
    } = options

    const { pages: sourcePages } = ctx
    const pages = sourcePages.filter(serverPageFilter)

    const intervallers = getIntervallers(pages.length, perPagePosts)
    const pagination = {
      pid,
      id,
      paginationPages: intervallers.map((interval, index) => {
        const path = getUrl(index)
        return { path, interval }
      }),
    }

    recordPageFilters(pid, clientPageFilter)
    recordPageSorters(pid, clientPageSorter)

    console.log('==== pagination.paginationPages')
    console.log(pagination.paginationPages)

    await Promise.all(
      pagination.paginationPages.map(async ({ path }, index) => {
        if (index === 0) {
          return
        }

        return ctx.addPage({
          permalink: path,
          frontmatter: {
            layout,
            title: getTitle(index),
          },
          meta,
        })
      }),
    )
    // @ts-ignore
    ctx.paginations.push(pagination)
  }
}

function getIntervallers(max, interval) {
  const count =
    max % interval === 0
      ? Math.floor(max / interval)
      : Math.floor(max / interval) + 1
  const arr = [...new Array(count)]
  // @ts-ignore
  return arr.map((v, index) => {
    const start = index * interval
    const end = (index + 1) * interval - 1
    return [start, end > max ? max : end]
  })
}

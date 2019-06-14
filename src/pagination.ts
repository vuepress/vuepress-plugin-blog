import { AppContext } from './interface/VuePress'
import {
  InternalPagination,
  PageFilter,
  GetPaginationPageUrl,
  getPaginationPageTitle,
  SerializedPagination,
} from './interface/Pagination'
import { logPages } from './util'

export async function registerPagination(
  paginations: InternalPagination[],
  ctx: AppContext,
) {
  ctx.serializedPaginations = []
  ctx.pageFilters = []
  ctx.pageSorters = []

  function recordPageFilters(pid, filter) {
    if (ctx.pageFilters[pid]) return
    ctx.pageFilters[pid] = filter.toString()
  }

  function recordPageSorters(pid, sorter) {
    if (ctx.pageSorters[pid]) return
    ctx.pageSorters[pid] = sorter.toString()
  }

  for (const {
    pid,
    id,
    filter,
    sorter,
    layout,
    lengthPerPage,
    getPaginationPageUrl,
    getPaginationPageTitle,
  } of paginations) {
    const { pages: sourcePages } = ctx
    const pages = sourcePages.filter(filter as PageFilter)

    const intervallers = getIntervallers(pages.length, lengthPerPage)
    const pagination: SerializedPagination = {
      pid,
      id,
      filter: `filters.${pid}`,
      sorter: `sorters.${pid}`,
      pages: intervallers.map((interval, index) => {
        const path = (getPaginationPageUrl as GetPaginationPageUrl)(index)
        return { path, interval }
      }),
    }

    recordPageFilters(pid, filter)
    recordPageSorters(pid, sorter)

    logPages(
      `Automatically generated pagination pages`,
      pagination.pages.slice(1),
    )

    await Promise.all(
      pagination.pages.map(async ({ path }, index) => {
        if (index === 0) {
          return
        }

        return ctx.addPage({
          permalink: path,
          frontmatter: {
            layout,
            title: (getPaginationPageTitle as getPaginationPageTitle)(index),
          },
          meta: {
            pid,
            id,
          },
        })
      }),
    )
    // @ts-ignore
    ctx.serializedPaginations.push(pagination)
  }
}

/**
 * Divided an interval of several lengths into several equal-length intervals.
 *
 * @param max
 * @param interval
 */

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

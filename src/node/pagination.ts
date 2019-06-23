import { VuePressContext } from './interface/VuePress'
import {
  InternalPagination,
  PageFilter,
  GetPaginationPageUrl,
  getPaginationPageTitle,
  SerializedPagination,
} from './interface/Pagination'
import { logPages } from './util'

/**
 * Divided an interval of several lengths into several equal-length intervals.
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

/**
 * Register paginations
 */
export async function registerPaginations(
  paginations: InternalPagination[],
  ctx: VuePressContext,
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
    const pages = sourcePages.filter(page => (filter as PageFilter)(page, id, pid))

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

    const extraPages = pagination.pages
      .slice(1) // The index page has been generated.
      .map(({ path }, index) => {
        return {
          permalink: path,
          frontmatter: {
            layout,
            title: (getPaginationPageTitle as getPaginationPageTitle)(index),
          },
          meta: {
            pid,
            id,
          },
        }
      })

    logPages(`Automatically generated pagination pages`, extraPages)

    await Promise.all(extraPages.map(page => ctx.addPage(page)))

    // @ts-ignore
    ctx.serializedPaginations.push(pagination)
  }
}

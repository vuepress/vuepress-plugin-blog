import Vue from 'vue'
// @ts-ignore
import paginations from '@dynamic/vuepress_blog/paginations'
import _debug from 'debug'

const debug = _debug('plugin-blog:pagination')

class Pagination {
  public paginationIndex: number

  public _paginationPages: any

  public _currentPage: any

  public _matchedPages: any

  public _indexPage: string

  constructor(pagination, pages, route) {
    debug(pagination)
    const { pages: paginationPages } = pagination
    const { path } = route

    for (let i = 0, l = paginationPages.length; i < l; i++) {
      const page = paginationPages[i]
      if (page.path === path) {
        this.paginationIndex = i
        break
      }
    }

    if (!this.paginationIndex) {
      this.paginationIndex = 0
    }

    this._paginationPages = paginationPages
    this._currentPage = paginationPages[this.paginationIndex]
    this._matchedPages = pages
      .filter(page => pagination.filter(page, pagination.id, pagination.pid))
      .sort(pagination.sorter)
  }

  setIndexPage(path) {
    this._indexPage = path
  }

  get length() {
    return this._paginationPages.length
  }

  get pages() {
    const [start, end] = this._currentPage.interval
    return this._matchedPages.slice(start, end + 1)
  }

  get hasPrev() {
    return this.paginationIndex !== 0
  }

  get prevLink() {
    if (this.hasPrev) {
      if (this.paginationIndex - 1 === 0 && this._indexPage) {
        return this._indexPage
      }
      return this._paginationPages[this.paginationIndex - 1].path
    }
    return null
  }

  get hasNext() {
    return this.paginationIndex !== this.length - 1
  }

  get nextLink() {
    if (this.hasNext) {
      return this._paginationPages[this.paginationIndex + 1].path
    }
    return null
  }

  getSpecificPageLink(index) {
    return this._paginationPages[index].path
  }
}

class PaginationGateway {
  private paginations: any

  constructor(paginations) {
    this.paginations = paginations
  }

  get pages() {
    // @ts-ignore
    return Vue.$vuepress.$get('siteData').pages
  }

  getPagination(pid, id, route) {
    debug('id', id)
    debug('this.paginations', this.paginations)
    const pagnination = this.paginations.filter(
      p => p.id === id && p.pid === pid,
    )[0]
    return new Pagination(pagnination, this.pages, route)
  }
}

const gateway = new PaginationGateway(paginations)

export default ({ Vue }) => {
  Vue.mixin({
    methods: {
      $getPagination(pid, id) {
        id = id || pid
        // @ts-ignore
        return gateway.getPagination(pid, id, this.$route)
      },
    },
    computed: {
      $pagination() {
        // @ts-ignore
        if (!this.$route.meta.pid || !this.$route.meta.id) {
          return null
        }

        // @ts-ignore
        return this.$getPagination(this.$route.meta.pid, this.$route.meta.id)
      },
    },
  })
}

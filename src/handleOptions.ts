import { BlogPluginOptions } from './interface/Options'
import { ExtraPage } from './interface/ExtraPages'
import { PageEnhancer } from './interface/PageEnhancer'
import { AppContext } from './interface/VuePress'
import { InternalPagination } from './interface/Pagination'
import { FrontmatterClassificationPage } from './interface/Frontmatter'
import { curryFrontmatterHandler, FrontmatterTempMap } from './util'
import { DefaultLayoutEnum } from './Config'

/**
 * Handle options from users.
 * @param options
 * @param ctx
 * @returns {*}
 */

export function handleOptions(options: BlogPluginOptions, ctx: AppContext) {
  const { layoutComponentMap } = ctx.themeAPI

  const { directories = [], frontmatters = [] } = options

  /**
   * A function used to check whether layout exists
   */
  const isLayoutExists = name => layoutComponentMap[name] !== undefined

  /**
   * Get layout
   */
  const getLayout = (name?: string, fallback?: string) => {
    return isLayoutExists(name) ? name : fallback || 'Layout'
  }

  const pageEnhancers: PageEnhancer[] = []
  const frontmatterClassificationPages: FrontmatterClassificationPage[] = []
  const extraPages: ExtraPage[] = []
  const paginations: InternalPagination[] = []

  /**
   * 1. Directory-based classification
   */
  for (const directory of directories) {
    const {
      id,
      dirname,
      path: indexPath,
      layout: indexLayout = 'IndexPost',
      frontmatter,
      itemLayout = 'Post',
      itemPermalink = '/:year/:month/:day/:slug',
      pagination = {
        perPagePosts: 10,
      },
    } = directory

    /**
     * 1.1 Required index path.
     */
    if (!indexPath) {
      continue
    }

    /**
     * 1.2 Inject index page.
     */
    extraPages.push({
      permalink: indexPath,
      frontmatter,
      meta: {
        pid: id,
        id: id,
      },
    })

    /**
     * 1.3 Set layout for index page.
     */
    pageEnhancers.push({
      when: ({ regularPath }) => regularPath === indexPath,
      frontmatter: { layout: getLayout(indexLayout) },
    })

    /**
     * 1.4 Set layout for pages that match current directory pattern.
     */
    pageEnhancers.push({
      when: ({ regularPath }) =>
        Boolean(regularPath) &&
        regularPath !== indexPath &&
        regularPath.startsWith(`/${dirname}/`),
      frontmatter: {
        layout: getLayout(itemLayout, 'Post'),
        permalink: itemPermalink,
      },
      data: { id, pid: id },
    })

    /**
     * 1.5 Set pagination.
     */
    paginations.push({
      pid: id,
      id,
      meta: {
        pid: id,
        id: id,
      },
      options: {
        ...pagination,
        layout: DefaultLayoutEnum.DirectoryPagination,
      },
      getUrl(index) {
        if (index === 0) {
          return indexPath
        }
        return `${indexPath}page/${index + 1}/`
      },
    })
  }

  /**
   * 2. Frontmatter-based classification
   */
  for (const frontmatterPage of frontmatters) {
    const {
      id,
      keys,
      path: indexPath,
      layout: indexLayout,
      frontmatter,
      pagination = {
        perPagePosts: 10,
      },
    } = frontmatterPage

    if (!indexPath) {
      continue
    }

    extraPages.push({
      permalink: indexPath,
      frontmatter,
    })

    const map = {} as FrontmatterTempMap

    frontmatterClassificationPages.push({
      id,
      pagination,
      keys,
      map,
      _handler: curryFrontmatterHandler(id, map),
    })

    pageEnhancers.push({
      when: ({ regularPath }) => regularPath === indexPath,
      frontmatter: { layout: getLayout(indexLayout) },
    })
  }

  return {
    pageEnhancers,
    frontmatterClassificationPages,
    extraPages,
    paginations,
  }
}

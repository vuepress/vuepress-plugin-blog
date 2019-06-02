import * as path from 'path'
import { handleOptions } from './handleOptions'
import { registerPagination } from './pagination'
import { BlogPluginOptions } from './interface/Options'
import { AppContext, Page } from './interface/VuePress'
import { DefaultLayoutEnum } from './Config'

module.exports = (options: BlogPluginOptions, ctx: AppContext) => {
  const {
    pageEnhancers,
    frontmatterClassificationPages,
    extraPages,
    paginations,
  } = handleOptions(options, ctx)

  return {
    name: 'vuepress-plugin-blog',

    /**
     * 1. Execute `pageEnhancers` generated in handleOptions
     */
    extendPageData(pageCtx: Page) {
      const { frontmatter: rawFrontmatter } = pageCtx

      pageEnhancers.forEach(({ when, data = {}, frontmatter = {} }) => {
        if (when(pageCtx)) {
          Object.keys(frontmatter).forEach(key => {
            /**
             * Respect the original frontmatter in markdown
             */
            if (!rawFrontmatter[key]) {
              rawFrontmatter[key] = frontmatter[key]
            }
          })
          Object.assign(pageCtx, data)
        }
      })
    },

    /**
     * 2. Create pages according to user's config.
     */
    async ready() {
      const { pages } = ctx

      /**
       * 2.1. Handle frontmatter per page.
       */
      for (const { key: pageKey, frontmatter } of pages) {
        if (!frontmatter || Object.keys(frontmatter).length === 0) {
          continue
        }

        for (const { keys, _handler } of frontmatterClassificationPages) {
          for (const key of keys) {
            const fieldValue = frontmatter[key]
            Array.isArray(fieldValue)
              ? fieldValue.forEach(v => _handler(v, pageKey))
              : _handler(fieldValue, pageKey)
          }
        }
      }

      /**
       * 2.2 Store frontmatterClassificationPages in current context.
       */
      ctx.frontmatterClassificationPages = frontmatterClassificationPages

      /**
       * 2.3. Combine all pages.
       *
       *    - Index page for all classifiers.
       *    - Pagination pages.
       */
      const allExtraPages = [
        ...extraPages,
        ...frontmatterClassificationPages
          .map(frontmatterClassifiedPage => {
            const { map, pagination, keys } = frontmatterClassifiedPage
            return Object.keys(map).map(key => {
              const { path, scope } = map[key]

              /**
               * Register pagination
               */
              paginations.push({
                pid: scope,
                id: key,
                options: {
                  ...pagination,
                  layout: DefaultLayoutEnum.FrontmatterClassifier,
                  serverPageFilter(page) {
                    return clientFrontmatterClassifierPageFilter(
                      page,
                      keys,
                      key,
                    )
                  },
                  clientPageFilter: clientFrontmatterClassifierPageFilter,
                },
                getUrl(index) {
                  if (index === 0) {
                    return `/${scope}/${key}/`
                  }
                  return `/${scope}/${key}/page/${index + 1}/`
                },
                getTitle(index) {
                  return `Page ${index + 1} - ${key} | ${scope}`
                },
              })

              return {
                permalink: path,
                meta: {
                  frontmatterClassificationKey: scope,
                },
                pid: scope,
                id: key,
                frontmatter: {
                  layout: DefaultLayoutEnum.FrontmatterClassifier,
                  title: `${key} | ${scope}`,
                },
              }
            })
          })
          .reduce((arr, next) => arr.concat(next), []),
      ]

      await Promise.all(allExtraPages.map(async page => ctx.addPage(page)))
      await registerPagination(paginations, ctx)
    },

    /**
     * Generate tag and category metadata.
     */
    async clientDynamicModules() {
      const frontmatterClassifiedPageMap = ctx.frontmatterClassificationPages.reduce(
        (map, page) => {
          map[page.id] = page.map
          return map
        },
        {},
      )

      const PREFIX = 'vuepress_blog'
      const strippedFrontmatterClassificationPages = frontmatterClassificationPages.map(
        ({ id, pagination, keys }) => {
          return {
            id,
            pagination,
            keys,
          }
        },
      )

      return [
        {
          name: `${PREFIX}/frontmatterClassifications.js`,
          content: `export default ${JSON.stringify(
            strippedFrontmatterClassificationPages,
            null,
            2,
          )}`,
        },
        {
          name: `${PREFIX}/frontmatterClassified.js`,
          content: `export default ${JSON.stringify(
            frontmatterClassifiedPageMap,
            null,
            2,
          )}`,
        },
        {
          name: `${PREFIX}/paginations.js`,
          content: `export default ${JSON.stringify(ctx.paginations, null, 2)}`,
        },
        {
          name: `${PREFIX}/pageFilters.js`,
          content: `export default ${mapToString(ctx.pageFilters)}`,
        },
        {
          name: `${PREFIX}/pageSorters.js`,
          content: `export default ${mapToString(ctx.pageSorters)}`,
        },
      ]
    },

    enhanceAppFiles: [
      path.resolve(__dirname, 'client/classification.js'),
      path.resolve(__dirname, 'client/pagination.js'),
    ],
  }
}

function mapToString(map) {
  let str = `{\n`
  for (const key of Object.keys(map)) {
    str += `  "${key}": ${map[key]},\n`
  }
  str += '}'
  return str
}

function clientFrontmatterClassifierPageFilter(page, keys, value) {
  return keys.some(key => {
    const _value = page.frontmatter[key]
    if (Array.isArray(_value)) {
      return _value.some(i => i === value)
    }
    return _value === value
  })
}

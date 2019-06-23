import { fs, path, logger, chalk } from '@vuepress/shared-utils'
import { BlogPluginOptions } from './interface/Options'
import { ExtraPage } from './interface/ExtraPages'
import { PageEnhancer } from './interface/PageEnhancer'
import { VuePressContext } from './interface/VuePress'
import { InternalPagination, PaginationConfig } from './interface/Pagination'
import { FrontmatterClassificationPage } from './interface/Frontmatter'
import {
  curryFrontmatterHandler,
  FrontmatterTempMap,
  resolvePaginationConfig,
  UpperFirstChar,
} from './util'
import { ClassifierTypeEnum } from './interface/Classifier'

/**
 * Handle options from users.
 * @param options
 * @param ctx
 * @returns {*}
 */

export function handleOptions(
  options: BlogPluginOptions,
  ctx: VuePressContext,
) {
  let { directories = [], frontmatters = [] } = options

  /**
   * Validate the existence of directory specified by directory classifier.
   * Fixed https://github.com/ulivz/vuepress-plugin-blog/issues/1
   */
  directories = directories.filter(directory => {
    const targetDir = path.join(ctx.sourceDir, directory.dirname)
    if (fs.existsSync(targetDir)) {
      return true
    }

    logger.warn(
      `[@vuepress/plugin-blog] Invalid directory classifier: ${chalk.cyan(directory.id)}, ` +
      `${chalk.gray(targetDir)} doesn't exist!`,
    )

    return false
  })

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
      path: indexPath = `/${directory.id}/`,
      layout: indexLayout = 'IndexPost',
      frontmatter,
      itemLayout = 'Post',
      itemPermalink = '/:year/:month/:day/:slug',
      pagination = {
        lengthPerPage: 10,
      } as PaginationConfig,
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
      frontmatter: {
        // Set layout for index page.
        layout: ctx.getLayout(indexLayout),
        title: `${UpperFirstChar(id)}`,
        ...frontmatter,
      },
      meta: {
        pid: id,
        id,
      },
    })

    /**
     * 1.3 Set layout for pages that match current directory classifier.
     */
    pageEnhancers.push({
      when: ({ regularPath }) =>
        Boolean(regularPath) &&
        regularPath !== indexPath &&
        regularPath.startsWith(`/${dirname}/`),
      frontmatter: {
        layout: ctx.getLayout(itemLayout, 'Post'),
        permalink: itemPermalink,
      },
      data: { id, pid: id },
    })

    /**
     * 1.5 Set pagination.
     */
    paginations.push({
      classifierType: ClassifierTypeEnum.Directory,
      getPaginationPageTitle(index) {
        return `Page ${index + 1} | ${id}`
      },
      ...resolvePaginationConfig(
        ClassifierTypeEnum.Directory,
        pagination,
        indexPath,
        ctx,
      ),
      pid: id,
      id,
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
        lengthPerPage: 10,
      } as PaginationConfig,
    } = frontmatterPage

    if (!indexPath) {
      continue
    }

    extraPages.push({
      permalink: indexPath,
      frontmatter: {
        // Set layout for index page.
        layout: ctx.getLayout(indexLayout, 'FrontmatterKey'),
        title: `${UpperFirstChar(id)}`,
        ...frontmatter,
      },
      meta: {
        pid: id,
        id,
      },
    })

    const map = {} as FrontmatterTempMap

    frontmatterClassificationPages.push({
      id,
      pagination,
      keys,
      map,
      _handler: curryFrontmatterHandler(id, map),
    })
  }

  return {
    pageEnhancers,
    frontmatterClassificationPages,
    extraPages,
    paginations,
  }
}

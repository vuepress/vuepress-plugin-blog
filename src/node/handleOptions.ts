import { fs, path, logger, chalk } from '@vuepress/shared-utils';
import { BlogPluginOptions } from './interface/Options';
import { ExtraPage } from './interface/ExtraPages';
import { PageEnhancer } from './interface/PageEnhancer';
import { VuePressContext } from './interface/VuePress';
import { InternalPagination, PaginationConfig } from './interface/Pagination';
import { FrontmatterClassificationPage } from './interface/Frontmatter';
import {
  curryFrontmatterHandler,
  FrontmatterTempMap,
  resolvePaginationConfig,
  UpperFirstChar,
  logObject,
} from './util';
import { ClassifierTypeEnum } from './interface/Classifier';

/**
 * Handle options from users.
 * @param options
 * @param ctx
 * @returns {*}
 */

export function handleOptions(
  options: BlogPluginOptions,
  ctx: VuePressContext
) {
  let { directories = [] } = options;

  const {
    frontmatters = [],
    globalPagination = {} as PaginationConfig,
  } = options;

  /**
   * Validate the existence of directory specified by directory classifier.
   * Fixed https://github.com/ulivz/vuepress-plugin-blog/issues/1
   */
  directories = directories.filter(directory => {
    const targetDir = path.join(ctx.sourceDir, directory.dirname);
    if (fs.existsSync(targetDir)) {
      return true;
    }

    logger.warn(
      `[@vuepress/plugin-blog] Invalid directory classifier: ${chalk.cyan(
        directory.id
      )}, ` + `${chalk.gray(targetDir)} doesn't exist!`
    );

    return false;
  });

  const pageEnhancers: PageEnhancer[] = [];
  const frontmatterClassificationPages: FrontmatterClassificationPage[] = [];
  const extraPages: ExtraPage[] = [];
  const paginations: InternalPagination[] = [];

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
      pagination = {} as PaginationConfig,
    } = directory;

    const { title = UpperFirstChar(id) } = directory;
    /**
     * 1.1 Required index path.
     */
    if (!indexPath) {
      continue;
    }

    /**
     * 1.2 Inject index page.
     */
    extraPages.push({
      permalink: indexPath,
      frontmatter: {
        // Set layout for index page.
        layout: ctx.getLayout(indexLayout),
        title,
        ...frontmatter,
      },
      meta: {
        pid: id,
        id,
      },
    });

    /**
     * 1.3 Set layout for pages that match current directory classifier.
     */
    pageEnhancers.push({
      /**
       * Exclude index pages
       * Exclude pagination pages
       * Pick pages matched directory name
       */
      filter({ regularPath }) {
        const regex = new RegExp(`^/${dirname}/page/\\d+/`);
        return (
          Boolean(regularPath) &&
          regularPath !== indexPath &&
          !regex.test(regularPath) &&
          regularPath.startsWith(`/${dirname}/`)
        );
      },
      frontmatter: {
        layout: ctx.getLayout(itemLayout, 'Post'),
        permalink: itemPermalink,
      },
      data: { id, pid: id },
    });

    /**
     * 1.5 Set pagination.
     */
    paginations.push({
      classifierType: ClassifierTypeEnum.Directory,
      getPaginationPageTitle(pageNumber) {
        return `Page ${pageNumber} | ${title}`;
      },
      ...resolvePaginationConfig(
        ClassifierTypeEnum.Directory,
        globalPagination,
        pagination,
        indexPath,
        ctx
      ),
      pid: id,
      id,
    });
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
      scopeLayout,
      frontmatter,
      pagination = {} as PaginationConfig,
    } = frontmatterPage;
    const { title = UpperFirstChar(id) } = frontmatterPage;

    if (!indexPath) {
      continue;
    }

    extraPages.push({
      permalink: indexPath,
      frontmatter: {
        // Set layout for index page.
        layout: ctx.getLayout(indexLayout, 'FrontmatterKey'),
        title,
        ...frontmatter,
      },
      meta: {
        pid: id,
        id,
      },
    });

    const map = {} as FrontmatterTempMap;

    frontmatterClassificationPages.push({
      id,
      entryTitle: title,
      pagination,
      keys,
      map,
      scopeLayout,
      _handler: curryFrontmatterHandler(id, map, indexPath),
    });
  }

  /**
   * 3. Leverage other plugins
   */
  const plugins: any[][] = [];
  const services = {
    comment: { enabled: false, service: '' },
    email: { enabled: false },
  };

  if (options.sitemap && options.sitemap.hostname) {
    const defaultSitemapOptions = { exclude: ['/404.html'] };
    const sitemapOptions = Object.assign(
      {},
      defaultSitemapOptions,
      options.sitemap
    );
    const sitemapDependencies = [
      ['vuepress-plugin-sitemap', sitemapOptions],
      ['@vuepress/last-updated'],
    ];
    plugins.push(...sitemapDependencies);
  }

  if (options.comment) {
    const { service: commentService, ...commentOptions } = options.comment;
    switch (commentService) {
      case 'vssue':
        plugins.push(['@vssue/vuepress-plugin-vssue', commentOptions]);
        services.comment.enabled = true;
        services.comment.service = commentService;
        break;
      case 'disqus':
        plugins.push(['vuepress-plugin-disqus-comment', commentOptions]);
        services.comment.enabled = true;
        services.comment.service = commentService;
        break;
      default:
        logger.warn(
          `[@vuepress/plugin-blog] Invalid comment service: ${chalk.cyan(
            commentService
          )}`
        );
        break;
    }
  }

  if (!!(options.newsletter && options.newsletter.endpoint)) {
    plugins.push(['vuepress-plugin-mailchimp', options.newsletter]);
    services.email.enabled = true;
  }

  const processedData = {
    pageEnhancers,
    frontmatterClassificationPages,
    extraPages,
    paginations,
    plugins,
    services,
  };

  logObject('Handle options', processedData, true);

  return processedData;
}

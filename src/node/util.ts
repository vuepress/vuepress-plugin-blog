import { env } from '@vuepress/shared-utils';
import { VuePressContext, VuePressPage } from './interface/VuePress';
import { ClassifierTypeEnum, DefaultLayoutEnum } from './interface/Classifier';
import { PaginationConfig } from './interface/Pagination';

export type FrontmatterHandler = (key: string, pageKey: string) => void;

export interface FrontmatterTempMap {
  scope: string;
  path: string;
  pageKeys: string;
}

export function curryFrontmatterHandler(
  scope: string,
  map: FrontmatterTempMap,
  path: string
): FrontmatterHandler;
export function curryFrontmatterHandler(scope, map, path) {
  return (key, pageKey) => {
    if (key) {
      if (!map[key]) {
        map[key] = {};
        map[key].key = key;
        map[key].scope = scope;
        map[key].path = `${path}${key}/`;
        map[key].pageKeys = [];
      }
      map[key].pageKeys.push(pageKey);
    }
  };
}

export function logPages(title, pages) {
  if (env.isDebug) {
    const table = require('text-table'); // eslint-disable-line
    const chalk = require('chalk'); // eslint-disable-line
    console.log();
    console.log(chalk.cyan(`[@vuepress/plugin-blog] ====== ${title} ======`));
    const data: any[] = [['permalink', 'meta', 'pid', 'id', 'frontmatter']];
    data.push(
      ...pages.map(({ path, permalink, meta, pid, id, frontmatter }) => [
        permalink || path || '',
        JSON.stringify(meta) || '',
        pid || '',
        id || '',
        JSON.stringify(frontmatter) || '',
      ])
    );
    console.log(table(data));
    console.log();
  }
}

export function resolvePaginationConfig(
  classifierType: ClassifierTypeEnum,
  globalPagination: PaginationConfig,
  pagination: PaginationConfig,
  indexPath: string,
  ctx: VuePressContext,
  keys: string[] = [''] // ['js']
) {
  return Object.assign(
    {},
    {
      lengthPerPage: 10,
      layout: ctx.getLayout(DefaultLayoutEnum.DirectoryPagination),

      getPaginationPageUrl(index) {
        if (index === 0) {
          return indexPath;
        }
        return `${indexPath}page/${index + 1}/`;
      },

      filter:
        classifierType === ClassifierTypeEnum.Directory
          ? function(page, id, pid) {
              return page.pid === pid && page.id === id;
            }
          : getFrontmatterClassifierPageFilter(keys),

      sorter: (prev: VuePressPage, next: VuePressPage) => {
        const prevTime = new Date(prev.frontmatter.date).getTime();
        const nextTime = new Date(next.frontmatter.date).getTime();
        return prevTime - nextTime > 0 ? -1 : 1;
      },
    },
    globalPagination,
    pagination
  );
}

function getFrontmatterClassifierPageFilter(keys) {
  return new Function(
    'page',
    'id',
    'pid',
    `
const keys = ${JSON.stringify(keys)};
const value = id;
return keys.some(key => {
  const _value = page.frontmatter[key]
  if (Array.isArray(_value)) {
    return _value.some(i => i === value)
  }
  return _value === value
})
    `
  );
}

export function UpperFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

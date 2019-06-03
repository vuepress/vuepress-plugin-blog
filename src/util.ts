import { env } from '@vuepress/shared-utils'

export type FrontmatterHandler = (key: string, pageKey: string) => void
export interface FrontmatterTempMap {
  scope: string;
  path: string;
  pageKeys: string;
}

export function curryFrontmatterHandler(
  scope: string,
  map: FrontmatterTempMap,
): FrontmatterHandler
export function curryFrontmatterHandler(scope, map) {
  return (key, pageKey) => {
    if (key) {
      if (!map[key]) {
        map[key] = {}
        map[key].scope = scope
        map[key].path = `/${scope}/${key}/`
        map[key].pageKeys = []
      }
      map[key].pageKeys.push(pageKey)
    }
  }
}

export function logPages(title, pages) {
  if (env.isDebug) {
    const table = require('text-table')
    const chalk = require('chalk')
    console.log()
    console.log(chalk.cyan(`[@vuepress/plugin-blog] ====== ${title} ======`))
    const data: any[] = [
      ['permalink', 'meta', 'pid', 'id', 'frontmatter'],
    ]
    data.push(
      ...pages.map(({
        // @ts-ignore
        path,
        permalink,
        meta,
        // @ts-ignore
        pid,
        // @ts-ignore
        id,
        frontmatter,
      }) => [
        permalink || path || '',
        JSON.stringify(meta) || '',
        pid || '',
        id || '',
        JSON.stringify(frontmatter) || '',
      ]),
    )
    console.log(table(data))
    console.log()
  }
}

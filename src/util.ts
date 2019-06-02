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

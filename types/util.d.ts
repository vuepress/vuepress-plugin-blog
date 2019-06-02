export declare type FrontmatterHandler = (key: string, pageKey: string) => void
export interface FrontmatterTempMap {
  scope: string;
  path: string;
  pageKeys: string;
}
export declare function curryFrontmatterHandler(
  scope: string,
  map: FrontmatterTempMap,
): FrontmatterHandler

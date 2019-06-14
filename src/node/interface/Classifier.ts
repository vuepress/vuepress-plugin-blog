export enum ClassifierTypeEnum {
  Directory = 'Directory',
  Frontmatter = 'Frontmatter',
}

export enum DefaultLayoutEnum {
  FrontmatterPagination = 'FrontmatterPagination',
  DirectoryPagination = 'DirectoryPagination',
}

export interface FrontmatterClassifiedIdMap<T = undefined> {
  [id: string]: T & {
    scope: string;
    path: string;
    pageKeys: string[]
  }
}

export interface FrontmatterClassifiedMap {
  [pid: string]: FrontmatterClassifiedIdMap;
}

export interface PaginationConfig {
  postsFilter?: typeof Array.prototype.filter;
  postsSorter?: typeof Array.prototype.sort;
  perPagePosts?: number;
  layout?: string;
  serverPageFilter?: any;
  clientPageFilter?: any;
}
export interface DirectoryClassifier {
  id: string;
  dirname: string;
  path: string;
  layout?: string;
  frontmatter?: Record<string, any>;
  itemLayout?: string;
  itemPermalink?: string;
  pagination?: PaginationConfig;
}
export interface FrontmatterClassifier {
  id: string;
  keys: string[];
  path: string;
  layout?: string;
  frontmatter?: Record<string, any>;
  pagination?: PaginationConfig;
}
export interface BlogPluginOptions {
  directories: DirectoryClassifier[];
  frontmatters: FrontmatterClassifier[];
}

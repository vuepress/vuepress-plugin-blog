/**
 * A Directory-based Classifier
 */
import { PaginationConfig } from './Pagination'

export interface DirectoryClassifier {
  /**
   * Unique id for current classifier.
   */
  id: string;
  /**
   * Matched directory name.
   */
  dirname: string;
  /**
   * Entry page for current classifier.
   */
  path: string;
  /**
   * Layout component name for entry page.
   */
  layout?: string;
  /**
   * Frontmatter for entry page.
   */
  frontmatter?: Record<string, any>;
  /**
   * Layout for matched page.
   */
  itemLayout?: string;
  /**
   * Permalink for matched page.
   */
  itemPermalink?: string;
  /**
   * Pagination config for current classifier.
   */
  pagination?: PaginationConfig;
}

/**
 * A Frontmatter-based Classifier
 */
export interface FrontmatterClassifier {
  /**
   * Unique id for current classifier.
   */
  id: string;
  /**
   * Frontmatter keys used to classify pages.
   * It's usually used to merge multiple tags with the same meaning
   *
   * e.g. keys: ['category', 'categories'],
   */
  keys: string[];
  /**
   * Index page for current classifier.
   */
  path: string;
  /**
   * Layout for index page.
   */
  layout?: string;
  /**
   * Frontmatter for index page.
   */
  frontmatter?: Record<string, any>;
  /**
   * Pagination config for current classifier.
   */
  pagination?: PaginationConfig;
}

/**
 * Options for this plugin.
 */
export interface BlogPluginOptions {
  directories: DirectoryClassifier[];
  frontmatters: FrontmatterClassifier[];
}

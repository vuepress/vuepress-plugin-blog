/**
 * Config of a Pagination
 */
import { VuePressPage } from './VuePress'
import { ClassifierTypeEnum } from './Classifier'

export type PageFilter = (
  page: VuePressPage,
  id: string,
  pid: string,
) => boolean

export type PageSorter = (
  prev: VuePressPage,
  next: VuePressPage,
) => boolean | number

export type GetPaginationPageUrl = (index: number) => string
export type getPaginationPageTitle = (index: number) => string

/**
 * Pagination config options for users.
 */
export interface PaginationConfig {
  /**
   * Filter for matched pages.
   */
  filter?: PageFilter;
  /**
   * Sorter for matched pages.
   */
  sorter?: PageSorter;
  /**
   * Maximum number of posts per page.
   */
  lengthPerPage?: number;
  /**
   * Layout for pagination Page (Except the index page.)
   */
  layout?: string;
  /**
   * A function to get the url of pagination page dynamically.
   */
  getPaginationPageUrl?: GetPaginationPageUrl;
  /**
   * A function to get the title of pagination page dynamically.
   */
  getPaginationPageTitle?: getPaginationPageTitle;
}

export interface PaginationIdentity {
  /**
   * Generalized ID
   */
  pid: string;
  /**
   * Narrow ID
   */
  id: string;
}

/**
 * Internally used fields.
 */
export interface InternalPagination
  extends PaginationConfig,
    PaginationIdentity {
  /**
   * Record which classfier create this pagination.
   */
  classifierType: ClassifierTypeEnum;
}

/**
 * Serialized pagination, generated for front-end use
 */
export interface SerializedPagination extends PaginationIdentity {
  /**
   * Stringified filter function
   */
  filter: string;
  /**
   * Stringified sorter function
   */
  sorter: string;
  /**
   * Details under current pagination
   */
  pages: PaginationPage[];
}

/**
 * Auto-generated pagination page
 */
interface PaginationPage {
  /**
   * Path of current pagination page
   */
  path: string;
  /**
   * Store the first and last page index matched
   */
  interval: Array<number>;
}

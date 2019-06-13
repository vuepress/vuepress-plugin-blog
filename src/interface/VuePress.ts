import Vue from 'vue'
import { FrontmatterClassificationPage } from './Frontmatter'
import { SerializedPagination } from './Pagination'

export interface Page {
  key: string;
  regularPath: string;
  frontmatter: Record<string, string>;
}

export interface AppContext {
  pages: Page[];
  themeAPI: {
    layoutComponentMap: Record<string, Vue>
  };
  addPage: any;
}

export interface AppContext {
  frontmatterClassificationPages: FrontmatterClassificationPage[];
  serializedPaginations: SerializedPagination[];
  pageFilters: any;
  pageSorters: any;
  getLayout: (name?: string, fallback?: string) => string | undefined;
}

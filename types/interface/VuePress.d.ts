import Vue from 'vue';
import { FrontmatterClassificationPage } from './Frontmatter';
import { InternalPagination } from './Pagination';
export interface Page {
    key: string;
    regularPath: string;
    frontmatter: Record<string, string>;
}
export interface AppContext {
    pages: Page[];
    themeAPI: {
        layoutComponentMap: Record<string, Vue>;
    };
    addPage: any;
}
export interface AppContext {
    frontmatterClassificationPages: FrontmatterClassificationPage[];
    paginations: InternalPagination[];
    pageFilters: any;
    pageSorters: any;
}

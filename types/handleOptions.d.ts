import { BlogPluginOptions } from './interface/Options';
import { ExtraPage } from './interface/ExtraPages';
import { PageEnhancer } from './interface/PageEnhancer';
import { AppContext } from './interface/VuePress';
import { InternalPagination } from './interface/Pagination';
import { FrontmatterClassificationPage } from './interface/Frontmatter';
export declare function handleOptions(options: BlogPluginOptions, ctx: AppContext): {
    pageEnhancers: PageEnhancer[];
    frontmatterClassificationPages: FrontmatterClassificationPage[];
    extraPages: ExtraPage[];
    paginations: InternalPagination[];
};

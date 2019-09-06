import { FrontmatterClassifiedMap } from '../node/interface/Classifier'

declare module '@app/util' {
  import { VuePressPage } from './VuePress'

  export function findPageByKey(pages: VuePressPage[], key: string): VuePressPage;
}

declare module '@dynamic/vuepress_blog/frontmatterClassified' {
  import { FrontmatterClassifiedMap } from '../node/interface/Classifier'
  export default FrontmatterClassifiedMap
}

declare module '@dynamic/vuepress_blog/paginations' {
  import { SerializedPagination } from '../node/interface/Pagination'
  export default SerializedPagination
}


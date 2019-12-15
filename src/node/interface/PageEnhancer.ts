import { VuePressPage } from './VuePress'

export interface PageEnhancer {
  /**
   * frontmatter injected to matched pages
   */
  frontmatter: Record<string, any>;
  /**
   * Extra data injected to `$page` object
   */
  data?: Record<string, any>;

  /**
   * Conditions for enhancer execution
   */
  when($page: VuePressPage): boolean;
}

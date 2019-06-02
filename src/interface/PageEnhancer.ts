import { Page } from './VuePress'

export interface PageEnhancer {
  /**
   * Conditions for enhancer execution
   */
  when($page: Page): boolean;

  /**
   * frontmatter injected to matched pages
   */
  frontmatter: Record<string, any>;
  /**
   * Extra data injected to `$page` object
   */
  data?: Record<string, any>;
}

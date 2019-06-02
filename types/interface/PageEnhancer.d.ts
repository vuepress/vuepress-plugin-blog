import { Page } from './VuePress'

export interface PageEnhancer {
  when($page: Page): boolean;
  frontmatter: Record<string, any>;
  data?: Record<string, any>;
}

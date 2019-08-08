import Vue from "vue";
export interface VuePressPage {
  key: string;
  regularPath: string;
  frontmatter: Record<string, string>;
}
export interface VuePressContext {
  pages: VuePressPage[];
  themeAPI: {
    layoutComponentMap: Record<string, Vue>;
  };
  addPage: any;
  sourceDir: string;
}

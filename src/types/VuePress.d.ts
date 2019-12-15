import Vue from 'vue';

export declare interface VuePressPage {
  key: string;
  regularPath: string;
  frontmatter: Record<string, string>;
}

export declare interface VuePressContext {
  sourceDir: string;
  pages: VuePressPage[];
  themeAPI: {
    layoutComponentMap: Record<string, Vue>;
  };
  addPage: any;
}

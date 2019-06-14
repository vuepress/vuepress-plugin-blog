module.exports = {
  title: '@vuepress/plugin-blog',
  description: 'Offical blog plugin for VuePress',
  themeConfig: {
    repo: 'ulivz/vuepress-plugin-blog',
    nav: [
      { text: 'Config', link: '/config/' },
      { text: 'Components', link: '/components/' },
    ],
    sidebarDepth: 3,
    sidebar: [
      '/config/',
      '/pagination/'
    ],
  },
}


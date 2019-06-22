module.exports = {
  title: '@vuepress/plugin-blog',
  description: 'Offical blog plugin for VuePress',
  themeConfig: {
    repo: 'ulivz/vuepress-plugin-blog',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config', link: '/config/' },
      { text: 'Pagination', link: '/pagination/' },
      { text: 'Components', link: '/components/' },
    ],
    sidebarDepth: 3,
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,

          children: [
            '',
            'getting-started',
          ],
        },
      ],
    },
  },
}


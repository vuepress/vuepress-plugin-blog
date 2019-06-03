module.exports = {
  plugins: [
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }],

    [
      require('../../../lib'),
      {
        directories: [
          {
            id: 'post',
            dirname: '_posts',
            path: '/',
            layout: 'IndexPost',
            itemLayout: 'Post',
            itemPermalink: '/:year/:month/:day/:slug',
            pagination: {
              perPagePosts: 5,
            },
          },
          {
            id: 'writing',
            dirname: '_writings',
            path: '/writings/',
            layout: 'IndexWriting',
            itemLayout: 'Writing',
            itemPermalink: '/writings/:year/:month/:day/:slug',
            pagination: {
              perPagePosts: 5,
            },
          },
        ],
        frontmatters: [
          {
            id: "tag",
            keys: ['tag', 'tags'],
            path: '/tag/',
            layout: 'Tags',
            frontmatter: { title: 'Tags' },
            itemlayout: 'Tag',
            pagination: {
              perPagePosts: 3
            }
          }
        ]
      },
    ],
  ],
}

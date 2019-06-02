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
            path: '/post/',
            layout: 'IndexPost',
            itemLayout: 'Post',
            itemPermalink: '/:year/:month/:day/:slug',
            pagination: {
              perPagePosts: 10,
            },
          },
        ],
      },
    ],
  ],
}

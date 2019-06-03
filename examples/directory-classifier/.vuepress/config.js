module.exports = {
  title: `ULIVZ`,
  plugins: [
    [require('../../../lib'), {
      directories: [
        {
          // Unique ID of current classification
          id: 'post',
          // Target directory
          dirname: '_posts',
          // Path of the `entry page` (or `list page`)
          path: '/',
          pagination: {
            perPagePosts: 2,
          },
        },
      ],
    }],
  ],
}

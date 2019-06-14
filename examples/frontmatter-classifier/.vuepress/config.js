module.exports = {
  title: `ULIVZ`,
  plugins: [
    [require('../../../lib/node'), {
      frontmatters: [
        {
          // Unique ID of current classification
          id: 'tag',
          // Decide that the frontmatter keys will be grouped under this classification
          keys: ['tag'],
          // Path of the `entry page` (or `list page`)
          path: '/tag/',
          // Layout of the `entry page`
          layout: 'Tags',
        },
      ],
    }],
  ],
}

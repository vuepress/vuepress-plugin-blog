module.exports = {
  title: `ULIVZ`,
  plugins: [
    [require('../../../lib/node'), {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
          path: '/',
        },
      ],
      frontmatters: [
        {
          id: "tag",
          keys: ['tag', 'tags'],
          path: '/tag/',
          frontmatter: { title: 'Tag' },
        },
        {
          id: "location",
          keys: ['location'],
          path: '/location/',
          frontmatter: { title: 'Location' },
        }
      ],
      sitemap: {
        hostname: 'https://yourdomain'
      },
      feed:{
        canonical_base: 'http://localhost:8080',
      }
    }],
  ],
}

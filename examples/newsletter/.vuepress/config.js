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
      newsletter: {
        endpoint: "https://billyyyyy3320.us4.list-manage.com/subscribe/post?u=4905113ee00d8210c2004e038&amp;id=bd18d40138"
      },
    }],
  ],
}

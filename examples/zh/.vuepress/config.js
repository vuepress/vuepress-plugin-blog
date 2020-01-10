module.exports = {
  title: 'Billyyyyy3320',
  /**
   * https://vuepress.vuejs.org/guide/i18n.html#site-level-i18n-config
   */
  locales: {
    '/': {
      lang: 'zh-TW', // Will be set as the lang attribute on <html> and the global computed : `$lang`
    }
  },
  plugins: [
    [require('../../../lib/node'), {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
          path: '/',
          title: '貼文', // Entry and pagination page titles for current classifier
          pagination: {
            getPaginationPageTitle (pageNumber) {
              return `第 ${pageNumber} 頁 | 貼文`
            }
          },

        },
      ],
      frontmatters: [
        {
          id: "tag",
          keys: ['tag'],
          path: '/tag/',
          title: '標籤', // Entry, scope and pagination page titles for current classifier
          pagination: {
            getPaginationPageTitle (pageNumber, key) {
              return `第 ${pageNumber} 頁 - ${key} | 標籤`
            }
          },
        },
      ],
      globalPagination: {
        lengthPerPage: 2,
        prevText: '上一頁',
        nextText: '下一頁'
      },
      /**
       * vuepress-plugin-disqus-comment will use $lang as default
       */
      comment: {
        service: 'disqus',
        shortname: 'vuepress-plugin-blog',
        // language:'zh-TW'
      },
      /**
       * See all available options: https://vuepress-plugin-mailchimp.billyyyyy3320.com/#config
       */
      newsletter: {
        endpoint: "https://billyyyyy3320.us4.list-manage.com/subscribe/post?u=4905113ee00d8210c2004e038&amp;id=bd18d40138",
        title:'電子報',
        content:'若想收到我的最新文章通知，請輸入您的 E-mail',
        submitText:'訂閱'
      },
    }],
  ],
}

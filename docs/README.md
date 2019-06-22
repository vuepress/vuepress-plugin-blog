---
home: true
heroImage: 
actionText: Getting Started →
actionLink: /guide/
features:
- title: Classification
  details: Powerful classification system lets you quickly classify your posts.
- title: Pagination
  details: Pagination runs through the entire plugin, and it has never been so simple.
- title: Client APIs
  details: Simple client APIs make it easier for you to write a blog theme.

footer: MIT Licensed | Copyright © 2018-present Evan You
---

## Install

```bash
yarn add -D @vuepress/plugin-blog
# OR npm install -D @vuepress/plugin-blog
```

## Usage

```javascript
// .vuepress/config.js
module.exports = {
  plugins: [
    '@vuepress/blog',
    {
      /* options */
    },
  ],
}
```

All available options are [here](./config/README.md).

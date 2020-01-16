---
sidebar: auto
---

# FAQ

## What’s the differences between `@vuepress/plugin-blog` and `@vuepress/theme-blog`?

The default theme of VuePress is focused on documentation sites, so proper blog support should be done in a separate theme. 

We want to offer developers a default blog theme, moreover encourage community theme developing. The plugin system was introduced as VuePress 1.x came out. Its purpose is decoupling and reusable. So, we try to implement all the common and necessary blog features in the plugin, and pay more attention to the interactive experience in the theme. 

With blog theme, you can have your blog setup within minutes and focus on content. With blog plugin, you can develop your own theme by focusing on user interface without knowing the logic behind the scenes.

> That are invisible and not of interest to users.

## Why are there several plugins in this plugin?

This is an all-in-one plugin, all the common and necessary features implemented in one plugin. We don't want you to spend a lot of time seeking available plugin, and we don't want to reinvent the wheel.

You'll only have to install this plugin instead of something like `yarn add -D @vuepress/plugin-blog vuepress-plugin-sitemap vuepress-plugin-mailchimp vuepress-plugin-disqus`. Of course, there're might be some plugin you don't need. No worries, they'll never be use if you didn't enable them. 

Besides, we extracted some features into plugins since they can be used by not only blog but also other usages.

<template>
  <LayoutWrapper>
    <Content class="vuepress-blog-theme-content"/>
    <Toc />
    
  </LayoutWrapper>
</template>

<script>
import LayoutWrapper from '@theme/components/LayoutWrapper.vue'
import Toc from '@theme/components/Toc.vue'

export default {
  components: { LayoutWrapper, Toc },
}
</script>

<style lang="stylus">
  .vuepress-blog-theme-content
    font-size 16px
    letter-spacing 0px
    font-family PT Serif
    color #2c3e50
</style>

<style src="prismjs/themes/prism-funky.css"></style>



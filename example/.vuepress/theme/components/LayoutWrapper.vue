<template>
  <div>
    <Header/>
    
    <div class="content-wrapper">
      <slot/>
    </div>
    
    <Footer/>
  </div>
</template>

<script>
  import Header from '@theme/components/Header'
  import Footer from '@theme/components/Footer'

  export default {
    components: { Header, Footer }
  }
</script>

<style lang="stylus">
  .content-wrapper
    padding-top 80px
    min-height calc(100vh - 80px - 60px)
    max-width 740px
    padding-left calc((100vw - 220px - 740px) / 2)
</style>

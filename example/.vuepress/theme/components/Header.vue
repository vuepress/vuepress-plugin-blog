<template>
  <header id="header">
    <div class="header-wrapper">
      <h1 class="title">{{ $site.title }}</h1>
      <div class="header-right-wrap">
        <ul class="nav" v-if="$themeConfig.nav">
          <li class="nav-item" v-for="item in $themeConfig.nav">
            <NavLink :link="item.link">{{ item.text }}</NavLink>
          </li>
        </ul>
        <SearchBox />
      </div>
    </div>
  </header>
</template>

<script>
  import SearchBox from '@SearchBox'
  import NavLink from './NavLink'
  
  export default {
    components: {
      SearchBox,
      NavLink,
    },
  }
</script>

<style lang="stylus">
  @import '~@app/style/config'
  
  ol, ul
    list-style none
    margin 0
    padding 0
  
  #header
    z-index 12
    position fixed
    top 0
    width 100vw
    box-sizing border-box
    // background lighten(#3eaf7c, 90%)
    background-color #FdFdFd
    font-family Abel, sans-serif
    padding 20px 32px 20px
    margin auto
    border-bottom 1px solid rgba(0, 0, 0, 0.15)
    // border-bottom 5px solid lighten(#3eaf7c, 50%)

  .header-wrapper
    display flex
    line-height 40px
    height 40px
    
    .title
      flex 0 0 200px
      // color #3eaf7c
      // color lighten(#3eaf7c, 10%)
      color #000
      font-size 30px
      font-weight bold
      margin 0
      letter-spacing 2px
      display block
      font-weight 900
    
    .header-right-wrap
      flex 1
      display flex
      justify-content flex-end
      
      .nav
        flex 0 0 auto
        display flex
        margin 0
        align-items end
        
        .nav-item
          flex 1
          margin-left 20px
          
          a
            font-size 20px
            color #000
            // color lighten(#3eaf7c, 30%)
            text-decoration none
            transition color .3s
            
            &:hover
              color lighten(#3eaf7c, 10%)
              
  
      .search-box
        margin-left 20px
        input
          border-radius 0
          border: 1px solid rgba(0, 0, 0, 0.15)
        .suggestions
          top: 40px
          right 0
        
  @media (max-width: $MQMobile)
    .header-wrapper
      flex-direction column
      .header-right-wrap
        display none
</style>

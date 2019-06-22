<template>
  <div class="pagination simple-pagination">
    <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink">Prev</router-link>
    <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink">Next</router-link>
  </div>
</template>

<style lang="stylus">
  .simple-pagination
    a
      margin-right: 20px
      color: #000
      height: 38px
      line-height: 38px
      transition: all .3s ease
      position: relative
      overflow: hidden
      display: inline-block
      background #FFF
      padding: 0 15px
      text-decoration: none
      border 1px solid #000
      border-radius 5px
      transition all .5s
      &:hover
        color #FFF
        border 1px solid $accentColor
        background-color $accentColor
</style>

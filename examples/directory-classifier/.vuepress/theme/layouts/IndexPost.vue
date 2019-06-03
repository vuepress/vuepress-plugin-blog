<template>
  <div>IndexPost</div>
</template>

<script>
  export default {
    created() {
      console.log(JSON.stringify(this.$pagination.pages, null, 2))
      console.log(this.$pagination)
    },
  }
</script>

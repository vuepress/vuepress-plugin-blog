<template>
  <div>Tag Component</div>
</template>

<script>
  export default {
    created() {
      console.log(JSON.stringify(this.$tag.pages, null, 2))
    },
  }
</script>

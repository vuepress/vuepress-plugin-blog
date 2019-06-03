<template>
  <div>FrontmatterClassifier</div>
</template>

<script>
  export default {
    created() {
      console.log(JSON.stringify(this.$pagination.pages, null, 2))
    },
  }
</script>

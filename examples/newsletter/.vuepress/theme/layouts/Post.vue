<template>
<div>
  <Content />
  <SimpleNewsletter />
</div>

</template>

<script>
import SimpleNewsletter from "vuepress-plugin-mailchimp/src/components/SimpleNewsletter";
export default {
  components: {
    SimpleNewsletter
  }
};
</script>

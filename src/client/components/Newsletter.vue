<template>
  <SimpleNewsletter v-if="isNewsletterEnabled" />
</template>
<script>
export default {
  data() {
    return {
      isNewsletterEnabled: IS_NEWSLETTER_ENABLED,
    };
  },
  mounted() {
    if (!this.isNewsletterEnabled) console.warn('Newsletter is disabled!');
  },
};
</script>

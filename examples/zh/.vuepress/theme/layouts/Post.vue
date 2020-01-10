<template>
  <div>
    <Content />
    <SimpleNewsletter v-if="$service.email.enabled" />
    <Comment />
  </div>
</template>

<script>
import { Comment } from '../../../../../lib/client/components.js';

export default {
  components: { Comment },
};
</script>

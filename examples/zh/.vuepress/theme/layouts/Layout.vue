<template>
  <div>
    <ul id="default-layout">
      <li v-for="page in $pagination.pages">
        <router-link class="page-link" :to="page.path">{{
          page.title
        }}</router-link>
      </li>
    </ul>
    <Pagination v-if="$pagination.length > 1" />
  </div>
</template>

<script>
import { Pagination } from '../../../../../lib/client/components.js';

export default {
  components: { Pagination },
};
</script>

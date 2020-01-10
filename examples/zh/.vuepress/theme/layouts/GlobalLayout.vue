<template>
  <div id="global-layout">
    <header style="background-color: #DDD">
      <router-link to="/">主頁</router-link>·
      <router-link to="/tag/">標籤</router-link>
    </header>
    <DefaultGlobalLayout />
    <footer style="background-color: #DDD">本站使用 VuePress 建置</footer>
  </div>
</template>

<script>
import GlobalLayout from '@app/components/GlobalLayout.vue';

export default {
  components: { DefaultGlobalLayout: GlobalLayout },
};
</script>

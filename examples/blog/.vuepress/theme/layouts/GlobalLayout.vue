<template>
  <div id="global-layout">
    <header style="background-color: #DDD">
      <router-link to="/">Home</router-link>· <a href="/tag/">Tag</a>
    </header>
    <DefaultGlobalLayout/>
    <footer style="background-color: #DDD">Powered by VuePress</footer>
  </div>
</template>

<script>
  import GlobalLayout from '@app/components/GlobalLayout.vue'
  
  export default {
    components: { DefaultGlobalLayout: GlobalLayout },
  }
</script>

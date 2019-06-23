<template>
  <div id="global-layout">
    <header style="background-color: #DDD">
      <router-link to="/">Home</router-link>·
      <router-link to="/tag/">Tag</router-link>·
      <router-link to="/location/">Location</router-link>
    </header>
    <DefaultGlobalLayout/>
    <footer style="background-color: #DDD">Powered by VuePress</footer>
  </div>
</template>

<script>
  import GlobalLayout from '@app/components/GlobalLayout.vue'
  
  export default {
    components: { DefaultGlobalLayout: GlobalLayout },
    created() {
      console.log()
    }
  }
</script>

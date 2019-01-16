<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {}
    },
    beforeCreate(){
      let cookie = document.cookie
      if (cookie !== '') {
        let jwt = cookie.split('=')
        this.axios.defaults.headers.common["Authorization"] = jwt[1]
      }
    }
  }
</script>

<style lang="less">
  body {
    margin: 0;
    padding: 0;
  }
  #app {
  }
</style>

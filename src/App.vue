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
        let cookieArr=cookie.split('; ')
        let cookieObj={}
        cookieArr.forEach(value => {
          let newValue=value.split('=')
          cookieObj[newValue[0]]=newValue[1]
        })
        this.axios.defaults.headers.common["Authorization"] = cookieObj.jwtSuperAdmin
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
  // 处理input type = number的上下箭头
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
</style>

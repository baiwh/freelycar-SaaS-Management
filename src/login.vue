<template>
  <div id="navBody">
    <el-card>

      <!--标题-->
      <div slot="header" class="log-in-header">
        <img class="log-in-logo" src="./../static/logo.jpg" alt="">
        <span>小易爱车后台管理系统</span>
      </div>

      <!--表单-->
      <el-form ref="form" :model="form">

        <el-form-item>
          <el-input
            class="log-in-input"
            placeholder="请输入用户名"
            prefix-icon="el-icon-search"
            v-model="form.userName">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            class="log-in-input"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-search"
            v-model="form.passWord">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="checked">记住密码</el-checkbox>
          <el-button type="primary" class="log-in-input" @click="logIn">登录</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
  // import axios from 'axios'
  export default {
    name: 'login',
    data() {
      return {
        options: [
          {
            value: 1,
            label: '金奥'
          }, {
            value: 2,
            label: '徐庄'
          }, {
            value: 3,
            label: '还有哪'
          }
        ],
        form: {
          userName: '',
          passWord: '',
        },
        checked: true
      }
    },
    mounted: function () {

    },
    methods: {
      // 登录
      logIn() {
        this.$post('/login', {
          username: this.form.userName,
          password: this.form.passWord
        }).then((res) => {
          console.log(res)
          if (res) {
            this.axios.defaults.headers.common["Authorization"] = res
            if (this.checked) {
              let time = new Date()
              let nowTime = time.getTime()
              time.setTime(nowTime + 5 * 24 * 60 * 60 * 1000)
              document.cookie = "jwt=" + res + "; expires=" + time.toGMTString() + ";path=/"
            }
            this.$router.push('/home')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  #navBody {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    background: url("./../static/c.jpg");
    background-size: 100% 100%;
  }

  .log-in-header {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .log-in-logo {
    height: 60px;
    width: 60px;
    margin-right: 10px;
  }

  .el-card {
    height: 416px;
    width: 360px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 60%;
  }

  /*.el-select {*/
  /*width: 100%;*/
  /*}*/

  .log-in-box {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .log-in-input {
    margin-top: 10px;
    width: 100%;
  }
</style>

<template>
  <div>
    <el-container>

      <el-header style="background: #409EFF;height: 80px">
        <el-row type="flex" align="middle" style="height: 80px">
          <el-col :span="22">
            <img class="logo" src="./../../static/logo-white.png" alt="">
          </el-col>
          <el-col :span="2">
            <el-dropdown @command="logOut">
              <span class="el-dropdown-link">
                <span class="user-name">{{userName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <!--<el-col :span="2">-->
          <!--<el-button size="small">注销</el-button>-->
          <!--</el-col>-->
        </el-row>
      </el-header>

      <el-container>

        <el-aside width="200px">
          <el-menu default-active="active" class="el-menu-vertical-demo"
                   :collapse="isCollapse" :router="true">

            <el-menu-item index="/home">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>首页</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/StoreManagement">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>门店管理</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/AccountManagement">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>账号管理</span>
              </template>
            </el-menu-item>

            <el-submenu index="统计报表">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>统计报表</span>
              </template>
              <el-menu-item index="/StatisticalReportForms/IncomeInquiry"
                            class="el-submenu-margin">营业汇总
              </el-menu-item>
              <el-menu-item index="/StatisticalReportForms/FlowDetails"
                            class="el-submenu-margin">流水报表
              </el-menu-item>
            </el-submenu>

            <el-menu-item index="/IntelligentCabinet">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>智能柜管理</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/ActivityPropaganda">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>活动宣传管理</span>
              </template>
            </el-menu-item>

          </el-menu>
        </el-aside>

        <el-main>
          <el-container>
            <el-header class="nav-title">
              <el-row>
                <!--<el-col :span="1">-->
                <!--<el-button icon="el-icon-d-arrow-left" circle @click="modifyNav"></el-button>-->
                <!--</el-col>-->
                <el-col :span="22">
                  <el-breadcrumb style="line-height: 45px" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="item in getNavPath" :key="item.id">{{item}}</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
              </el-row>

            </el-header>
            <el-main>
              <router-view/>
            </el-main>
          </el-container>

        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'navApp',
    data() {
      return {
        userName: 'admin',
        isCollapse: false,
        navPath: []
      }
    },
    methods: {
      // 退出登录
      logOut(command){
        let time = new Date()
        let nowTime = time.getTime()
        time.setTime(nowTime)
        document.cookie = "jwtSuperAdmin=''; expires=" + time.toGMTString() + ";path=/"
        console.log(document.cookie)
        this.$router.push({path: '/login'})
      },
      // 收起/打开左侧导航
      modifyNav() {
        this.isCollapse = !this.isCollapse
      }
    },
    computed: {
      // 获取导航面包屑数据
      getNavPath: function () {
        let router = this.$route.matched
        let path = router.map(item => item.name)
        return path
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less">
  .logo {
    height: 55px;
    width: 165px;
  }

  .el-submenu-margin {
    margin-left: 15px;
  }

  .el-aside {
    overflow: hidden;
  }

  .el-menu--inline {
    overflow: hidden;
  }

  .nav-title {
    border-bottom: 1px solid #ebeef5;
    line-height: 45px;
  }

  .user-name {
    color: white;
  }

  #app {
  }
</style>

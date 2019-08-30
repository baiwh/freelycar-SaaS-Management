<template>
  <div>
    <!--表格-->
    <el-table :data="list" tooltip-effect="dark" border
             v-loading="loading">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>
      <el-table-column prop="city" label="区域"></el-table-column>
      <el-table-column prop="createTime" label="登记时间"></el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice :pageData.sync="pageData" @changePage="getList"></pagingDevice>
  </div>
</template>

<script>
  export default {
    name: 'cooperation',
    data() {
      return {
        loading: true,
        arkSn: '',
        list:[],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
      }
    },
    methods: {
      // 获取智能柜列表
      getList() {
        this.$get('/partner/list', {
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }).then(res => {
          this.loading = false
          this.list=res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

    },
    mounted: function () {
      this.getList()
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    margin-bottom: 30px;
  }
</style>

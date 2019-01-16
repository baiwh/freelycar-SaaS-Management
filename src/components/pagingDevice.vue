<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageData.currentPage"
      :page-size="pageData.pageSize"
      :page-sizes="[5, 10, 20, 100]"
      :total="pageData.pageTotal"
      layout="prev, pager, next, sizes, total"
      background>
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'changePage',
    props:{
      pageData:{
        currentPage: 1,
        pageSize: 10,
        pageTotal: 1000
      },
    },
    methods: {
      // 修改分页器的每页显示条数
      handleSizeChange(val) {
        console.log(`组件每页 ${val} 条`);
        this.$emit('changePage')
      },

      // 修改分页器当前页
      handleCurrentChange(val) {
        console.log(`组件当前页: ${val}`);
        this.$emit('changePage')
      }
    }
  }
</script>

<style lang="less">
  .el-pagination{
    transform: translateX(-50%);
    left: 50%;
    position: absolute;
    margin: 50px;
  }
</style>

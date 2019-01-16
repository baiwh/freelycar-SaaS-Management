<template>
  <div>
    <!--选择查找日期-->
    <el-row>
      <el-col :span="16">
        <span>选择查找日期:</span>
        <el-date-picker
          v-model="datePickerValue"
          type="daterange"
          size="small"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small">查询</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small">导出Excel</el-button>
      </el-col>
    </el-row>

    <!--合计金额-->
    <el-row>
      <el-col>
        <span>合计金额：</span><el-input :value="sumAmounts" size="small" disabled></el-input>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="flowDetailsTable" border>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column property="carModel" label="车型" align="center"></el-table-column>
      <el-table-column property="carNumber" label="车牌号码" align="center"></el-table-column>
      <el-table-column property="ownerName" label="车主姓名" align="center"></el-table-column>
      <el-table-column property="ownerPhone" label="联系方式" align="center"></el-table-column>
      <el-table-column property="ownerProject" label="消费项目" align="center"></el-table-column>
      <el-table-column property="ownerCost" label="金额" align="center"></el-table-column>
      <el-table-column property="costTime" label="时间" align="center"></el-table-column>
      <el-table-column property="isVip" label="是否是会员" align="center"></el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice
      :pageData.sync="pageData"
      @changePage="changePage"></pagingDevice>

  </div>
</template>

<script>
  export default {
    name: 'FlowDetails',
    data() {
      return {
        loading: true,
        datePickerValue: '',
        sumAmounts: '',
        flowDetailsTable: [{
          carModel: '111',
          carNumber: '222',
          ownerName: 'xiaoyi',
          ownerPhone: '123456789',
          ownerProject: 'hahh',
          ownerCost: '56',
          costTime: '1234',
          isVip: '是'
        }],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        }
      }
    },
    methods: {
      changePage() {

      }
    },
    mounted: function () {

    }
  }
</script>

<style lang="less" scoped>
.el-date-picker {
  width: 70%;
}
.el-row {
  margin-bottom: 40px;
}
.el-input {
  width: 100px;
}
</style>

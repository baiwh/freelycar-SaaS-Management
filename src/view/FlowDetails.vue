<template>
  <div>
    <!--查询条件框-->
    <el-row :gutter="5">
      <el-col :span="10">
        <span>所属门店：</span>
        <el-select v-model="selectValue" placeholder="请选择" style="width: 60%" size="small">
          <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <span>单据日期：</span>
        <el-date-picker
          style="width: 18vw;"
          v-model="dateValue"
          type="daterange"
          size="small"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small">导出Excel</el-button>
      </el-col>
    </el-row>


    <el-table v-loading="loading" :data="flowDetailsTable" border>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column property="carModel" label="车型" align="center"></el-table-column>
      <el-table-column property="carNumber" label="车牌号码" align="center"></el-table-column>
      <el-table-column property="ownerName" label="车主姓名" align="center"></el-table-column>
      <el-table-column property="ownerPhone" label="联系方式" align="center"></el-table-column>
      <el-table-column property="ownerProject" label="消费项目" align="center"></el-table-column>
      <el-table-column property="ownerCost" label="订单金额" align="center"></el-table-column>
      <el-table-column property="costPrice" label="支付金额" align="center"></el-table-column>
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
        selectValue: '',
        selectOptions: [{
          label: 'aa',
          value: 'aa'
        }],
        dateValue: '',
        flowDetailsTable: [{
          carModel: '111',
          carNumber: '222',
          ownerName: 'xiaoyi',
          ownerPhone: '123456789',
          ownerProject: 'hahh',
          ownerCost: '56',
          costPrice: '34',
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
.el-table {
  margin-top: 30px;
}
</style>

<template>
  <div>
    <!--查询条件框-->
    <el-row :gutter="5">
      <el-col :span="6">
        <span>所属门店：</span>
        <el-select clearable v-model="selectStore"
                   @change="getData"
                   placeholder="请选择" style="width: 10vw" size="small">
          <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <span>选择查找日期:</span>
        <el-date-picker v-model="datePickerValue"
                        type="daterange" size="small"
                        range-separator="~"
                        value-format="yyyy-MM-dd"
          start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" @click="getData">查询</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="getExcel">导出Excel</el-button>
      </el-col>
    </el-row>

    <!--合计金额-->
    <el-row>
      <el-col>
        <span>合计金额：</span>
        <el-input :value="sumAmounts" size="small" disabled></el-input>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="flowDetailsTable" @row-click="thisFlowDetail" border>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column property="carBrand" label="车型" align="center"></el-table-column>
      <el-table-column property="licensePlate" label="车牌号码" align="center"></el-table-column>
      <el-table-column property="clientName" label="车主姓名" align="center"></el-table-column>
      <el-table-column property="phone" label="联系方式" align="center"></el-table-column>
      <el-table-column property="projectNames" label="消费项目" align="center"></el-table-column>
      <el-table-column property="cost" label="金额" align="center"></el-table-column>
      <el-table-column property="serviceTime" label="时间" align="center"></el-table-column>
      <el-table-column property="isMember" label="是否是会员" align="center"></el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice :pageData.sync="pageData" @changePage="getData"></pagingDevice>

    <!--单据详情弹框-->
    <el-dialog title="单据详情" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :span="12">车型：{{flowDetail.carBrand}}</el-col>
        <el-col :span="12">车牌号码：{{flowDetail.licensePlate}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">车主姓名：{{flowDetail.clientName}}</el-col>
        <el-col :span="12">联系方式：{{flowDetail.phone}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">消费项目：{{flowDetail.projectName}}</el-col>
        <el-col :span="12">时间：{{flowDetail.serviceTime}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">消费门店：{{flowDetail.storeName}}</el-col>
        <el-col :span="12">是否会员：{{flowDetail.isMember}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">支付金额：{{flowDetail.cost}}</el-col>
        <!--<el-col :span="12">会员卡余额：{{flowDetail.blance}}</el-col>-->
        <el-col :span="12">订单金额：{{flowDetail.orderCost}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">支付方式：{{flowDetail.payMethod}}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'FlowDetails',
    data() {
      return {
        storeList: [],
        selectStore: '',
        loading: true,
        datePickerValue: '',
        sumAmounts: '',
        flowDetailsTable: [],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        flowDetail:{},
        dialogTableVisible:false
      }
    },
    methods: {
      // 获取单据列表
      getData() {
        this.$get('/order/listOrderParticulars', {
          currentPage: this.pageData.currentPage?this.pageData.currentPage:1,
          pageSize: this.pageData.pageSize?this.pageData.pageSize:10,
          storeId: this.selectStore,
          startTime: this.datePickerValue ? this.datePickerValue[0] : '',
          endTime: this.datePickerValue ? this.datePickerValue[1] : ''
        }).then(res => {
          this.loading = false
          this.sumAmounts = res.totalAccount
          this.flowDetailsTable = res.pageResult.data
          this.pageData.currentPage = res.pageResult.currentPage
          this.pageData.pageSize = res.pageResult.pageSize
          this.pageData.pageTotal = res.pageResult.total
          console.log(this.pageData)
        })
      },

      // 查看单据详情
      thisFlowDetail(row){
        console.log(row)
        this.flowDetail = row
        console.log(this.flowDetail)
        this.dialogTableVisible=true
      },

      // 获取门店列表
      getStoreList() {
        this.$get('/store/list', {
          name: '',
          currentPage: 1,
          pageSize: 100
        }).then(res => {
          this.storeList = res.data
        })
      },

      // 下载Excel
      getExcel() {
        this.$getExcel('/order/exportOrderParticularsExcel', {
          storeId: this.selectStore,
          startTime: this.datePickerValue ? this.datePickerValue[0] : '',
          endTime: this.datePickerValue ? this.datePickerValue[1] : ''
        })
      }
    },
    mounted: function () {
      this.getData()
      this.getStoreList()
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

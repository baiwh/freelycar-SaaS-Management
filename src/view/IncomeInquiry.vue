<template>
  <div>
    <!--选择区间-->
    <el-row>
      <el-col :span="8">
        <el-radio-group v-model="tabPosition" @change="onButtonChange">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="thisMonth">本月</el-radio-button>
          <el-radio-button label="search">区间查找</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="12" v-if="visible">
        <span>区间查找</span>
        <el-date-picker
          v-model="datePickerValue"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="dateWidth">
        </el-date-picker>
      </el-col>
      <el-col :span="4" :offset="num">
        <el-button type="primary" size="small" icon="el-icon-download">导出Excel</el-button>
      </el-col>
    </el-row>

    <!--消费金额卡片-->
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item, index) of dataReportCard" :key="index">
        <el-card :class="['text-center',item.cardClass]" shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{item.title}}</span>
          </div>
          <div>￥{{item.number}}</div>
        </el-card>
      </el-col>
    </el-row>

    <!--收款方式模块-->
    <el-row>
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>收款方式</span>
        </div>
        <el-table v-loading="loading" :data="amountMethodsTable">
          <el-table-column property="crash" label="现金" align="center"/>
          <el-table-column property="swipe" label="刷卡" align="center"/>
          <el-table-column property="easyPay" label="易付宝" align="center"/>
          <el-table-column property="aLiPay" label="支付宝" align="center"/>
          <el-table-column property="weChatPay" label="微信支付" align="center"/>
          <el-table-column property="cardPay" label="储值卡支付" align="center"/>
        </el-table>
      </el-card>
    </el-row>

    <!--项目类别-->
    <el-row>
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>项目类别</span>
        </div>
        <div>项目类别饼状图</div>
        <el-table v-loading="loading" :data="itemCategoryTable">
          <el-table-column property="itemName" label="项目类别" align="center"/>
          <el-table-column property="itemNumber" label="数量" align="center"/>
          <el-table-column property="itemProportion" label="占比" align="center"/>
          <el-table-column property="itemPrice" label="金额" align="center"/>
        </el-table>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'IncomeInquiry',
    data() {
      return {
        loading: true,
        tabPosition: 'today',
        datePickerValue: '',
        dataReportCard: [{
          title: '实收金额',
          number: '81.00',
          cardClass: 'orange'
        }, {
          title: '会员消费金额',
          number: '81.00',
          cardClass: 'green'
        }, {
          title: '散客消费金额',
          number: '81.00',
          cardClass: 'grey'
        }],
        amountMethodsTable: [{
          crash: '2121',
          swipe: '1234',
          easyPay: '2345',
          aLiPay: '3456',
          weChatPay: '4567',
          cardPay: '5678'
        }],
        itemCategoryTable: [{
          itemName: '办卡服务',
          itemNumber: '2',
          itemProportion: '28.57%',
          itemPrice: '80'
        }],
        visible: false,
        num: 12
      }
    },
    methods: {
      onButtonChange(e) {
        this.visible = e === 'search' ? true : false
        this.num = e === 'search' ? 0 : 12
      }
    },
    mounted: function () {

    }
  }
</script>

<style lang="less" scoped>
  .dateWidth {
    width: 70%;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .el-row {
    margin-bottom: 40px;
  }

  .text-center {
    text-align: center;
  }

  .orange /deep/ .el-card__header {
    background-color: #f90;
  }

  .green /deep/ .el-card__header {
    background-color: #81cdd8;
  }

  .grey /deep/ .el-card__header {
    background-color: #ccc;
  }
</style>

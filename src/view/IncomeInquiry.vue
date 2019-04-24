<template>
  <div>
    <!--选择区间-->
    <el-row :gutter="5">
      <el-col :span="7">
        <span>所属门店：</span>
        <el-select clearable v-model="selectStore" placeholder="请选择" style="width: 10vw" size="small">
          <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-radio-group v-model="tabPosition" @change="onButtonChange" size="small">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="thisMonth">本月</el-radio-button>
          <el-radio-button label="search">区间查找</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="11" v-if="visible">
        <span>查找日期：</span>
        <el-date-picker
          v-model="datePickerValue"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:17vw"
          size="small">
        </el-date-picker>
        <el-button type="primary" @click="searchData" size="small">查询</el-button>
      </el-col>
      <!--<el-col :span="2" :offset="num">-->
      <!--<el-button type="primary" size="small" icon="el-icon-download">导出Excel</el-button>-->
      <!--</el-col>-->
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
          <el-table-column property="cash" label="现金" align="center"/>
          <el-table-column property="creditCard" label="刷卡" align="center"/>
          <el-table-column property="suningPay" label="易付宝" align="center"/>
          <el-table-column property="alipay" label="支付宝" align="center"/>
          <el-table-column property="wechatPay" label="微信支付" align="center"/>
          <el-table-column property="card" label="储值卡支付" align="center"/>
        </el-table>
      </el-card>
    </el-row>

    <!--项目类别-->
    <el-row>
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>项目类别</span>
        </div>
        <div class="echarts-box" id="echarts">项目类别饼状图</div>
        <el-table v-loading="loading" :data="itemCategoryTable">
          <el-table-column property="projectName" label="项目类别" align="center"/>
          <el-table-column property="count" label="数量" align="center"/>
          <el-table-column label="占比" align="center">
            <template slot-scope="scope">{{(scope.row.percent*100).toFixed(2)}}%</template>
          </el-table-column>
          <el-table-column property="projectPrice" label="金额" align="center"/>
        </el-table>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'IncomeInquiry',
    data() {
      return {
        storeList: [],
        selectStore: '',
        loading: true,
        tabPosition: 'today',
        datePickerValue: '',
        dataReportCard: [
          {
            title: '实收金额',
            number: '',
            cardClass: 'orange'
          }, {
            title: '会员消费金额',
            number: '',
            cardClass: 'green'
          }, {
            title: '散客消费金额',
            number: '',
            cardClass: 'grey'
          }
        ],
        amountMethodsTable: [],
        itemCategoryTable: [{
          itemName: '办卡服务',
          itemNumber: '2',
          itemProportion: '28.57%',
          itemPrice: '80'
        }],
        visible: false,
        num: 12,
        searchDate: {
          today: '',
          thisMonth: [],
        }
      }
    },
    methods: {
      // 获取页面数据
      getData(startTime, endTime) {
        this.$get('/order/getStoreIncome', {
          storeId: this.selectStore,
          startTime: startTime,
          endTime: endTime,
        }).then(res => {
          this.loading = false
          this.dataReportCard = [
            {
              title: '实收金额',
              number: res.memberIncome.allActualIncome,
              cardClass: 'orange'
            },
            {
              title: '会员消费金额',
              number: res.memberIncome.memberActualIncome,
              cardClass: 'green'
            },
            {
              title: '散客消费金额',
              number: res.memberIncome.nonMemberActualIncome,
              cardClass: 'grey'
            }
          ]
          this.amountMethodsTable = [res.payMethodIncome]
          this.itemCategoryTable = res.pieChart

          // pieChart: [{
          // count: 2
          // percent: 0.3998
          // projectId: "ff8080816928f3440169290588ac0007"
          // projectName: "精洗"
          // projectPrice: 150}]
          let echartsData = []
          res.pieChart.forEach(value => {
            echartsData.push({value: value.percent, name: value.projectName})
          })

          // 绘制图表
          let myChart = echarts.init(document.getElementById('echarts'))
          myChart.setOption({
            title: {
              text: '项目类别占比图'
            },
            legend: {
              show: true,
              orient: 'vertical',
              left: 0,
              top: '10%'
            },
            series: [
              {
                name: '项目类别占比图',
                type: 'pie',
                radius: '55%',
                data: echartsData
              }
            ]
          })
        })
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

      // 按钮区间
      onButtonChange(e) {
        if (e === 'today') {
          this.getData(this.searchDate.today, this.searchDate.today)
        }
        if (e === 'thisMonth') {
          this.getData(this.searchDate.thisMonth[0], this.searchDate.thisMonth[1])
        }
        this.visible = e === 'search' ? true : false
        this.num = e === 'search' ? 0 : 12
      },

      // 区间查询
      searchData() {
        this.getData(this.datePickerValue[0], this.datePickerValue[1])
      }
    },
    mounted: function () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() < 9 ? '-0' + (date.getMonth() + 1) : '-' + (date.getMonth() + 1)
      let day = date.getDate() < 10 ? '-0' + date.getDate() : '-' + date.getDate()
      this.searchDate.today = year + month + day
      this.searchDate.thisMonth = [year + month + '-01', year + month + '-31']
      this.getData(this.searchDate.today, this.searchDate.today)
      this.getStoreList()
    }
  }
</script>

<style lang="less" scoped>
  .echarts-box {
    height: 300px;
    width: 100%;
  }

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

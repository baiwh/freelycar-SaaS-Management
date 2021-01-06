<template>
  <div class="minwidth">
    <div class="page-center">数据统计</div>
    <el-row :gutter="5">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <span>所属网点：</span>
        <el-select
          clearable
          v-model="selectStore"
          @change="getList"
          placeholder="请选择"
          style="width: 10vw"
          size="small"
        >
          <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
        <span>查找日期：</span>
        <el-date-picker
          v-model="datePickerValue"
          type="date"
          value-format="yyyy-MM-dd"
          size="small"
          placeholder="选择日期"
        ></el-date-picker>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-button type="primary" @click="getList" size="small">查询</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column property="cumulateUserCount" :label="newyesterdayFlag" align="center" />
      <el-table-column property="registerUserCount" label="注册人数" align="center" />
      <el-table-column property="orderCount" label="订单数" align="center" />
    </el-table>
    <div class="echarts-box" id="echarts">注册与订单数</div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "home",
  data() {
    return {
      selectStore: "",
      storeList: [],
      datePickerValue: "",
      dataList: [],
      loading: true,
      yesterdayFlag: false,
    }
  },
  methods: {
    // 获取列表
    getList() {
      this.loading = true;
      console.log(this.datePickerValue)
      this.$get("/wxUserInfo/getCumulateThree", {
        storeId: this.selectStore,
        refDate: this.datePickerValue,
      }).then((res) => {
        this.loading = false;
        let list = [res];
        this.dataList = list;
        console.log(this.dataList);
        this.yesterdayFlag = this.dataList[0].yesterdayFlag;

        
      });
    },

    // 获取网点列表
    getStoreList() {
      this.$get("/store/list", {
        name: "",
        currentPage: 1,
        pageSize: 100,
      }).then((res) => {
        this.storeList = res.data;
      });
    },
    getChartData(){
      this.$get('/wxUserInfo/getCumulateChart')
      .then((res)=>{
        console.log(res)
        //折线图
        let myChart = echarts.init(document.getElementById("echarts"));
        var timedata = [];
        var orderCount = [];
        var registerUserCount = [];
        for(var i in res){
          let index = res.length-i-1;
          timedata.push(res[index].createDate);
          orderCount.push(res[index].orderCount)
          registerUserCount.push(res[index].registerUserCount);
        }
        myChart.setOption({
          title: {
            text: '所有网点每月注册和订单数',
        },
        tooltip : {
            trigger: 'item',
         },
        legend: {
          type:"plain",
          top:20,
          data:['注册人数','订单数']
        },
          xAxis: {
            type: "category",
            name:"时间",
            axisLabel: {
              show: true,
            },
            data : timedata
          },
          yAxis: [
            {
              type: "value",
              position: "left",
              name:"注\n册\n人\n数\n︵\n个\n︶",
              nameLocation:"center",
              nameGap:35,
              nameRotate:0,
              nameTextStyle:{
                fontSize: 16,
                },
            },
            {
              type: "value",
              position: "right",
              name:"订\n单\n数\n︵\n个\n︶",
              nameLocation:"center",
              nameGap:35,
              nameRotate:0,
              nameTextStyle:{
                fontSize: 16,
                },
            },
          ],
          series: [
            {
              name:"注册人数",
              data: registerUserCount,
              type: "line",
              yAxisIndex: 0, // 通过这个判断左右
              smooth: true,
            },
            {
              name:"订单数",
              data:orderCount,
              type: "line",
              yAxisIndex: 1,
              smooth: true,
            },
          ],
        });
      });
    }
  },
  computed: {
    newyesterdayFlag: function () {
      return this.yesterdayFlag ? "昨日关注人数" : "当日关注人数";
    },
  },
  mounted: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month =
      date.getMonth() < 9
        ? "-0" + (date.getMonth() + 1)
        : "-" + (date.getMonth() + 1);
    let day =
      date.getDate() < 10 ? "-0" + date.getDate() : "-" + date.getDate();
    this.datePickerValue = year + month + day;
    this.getList();
    this.getStoreList();
    this.getChartData();
  },
};
</script>
<style lang="less" scoped>
.page-center {
  transform: translateX(-50%);
  left: 45%;
  position: relative;
  width: 300px;
  text-align: center;
  margin: 5px 0 10px 0;

}
.minwidth{
  width : 100%;
  min-width: 1000px;
}
.container {
  width: 100%;
  text-align: center;
  position: relative;
  left: 50%;
  top: 50%;
  margin: 300px auto;
  border: 0;
}
.echarts-box {
  height: 400px;
  width: 100%;
}
</style>


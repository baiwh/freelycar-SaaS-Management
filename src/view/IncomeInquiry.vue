<template>
  <div>
    <!-- 选择类别 -->
    <el-row :gutter="5">
      <el-col :span="6">
        <el-radio-group v-model="tabItemPosition" size="small">
          <el-radio-button label="time">时间</el-radio-button>
          <el-radio-button label="service">服务商</el-radio-button>
          <el-radio-button label="store">网点</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="11" v-show="tabItemPosition=='time'">
        <span>查找日期：</span>
        <el-date-picker v-model="fileYear" type="year" placeholder="选择查找的年份" value-format="yyyy"></el-date-picker>
        <el-button type="primary" @click="searchData" size="small">查询</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <span style="fontSize:26px">总营业额：130000</span>
      </el-col>
    </el-row>
    <el-row v-show="tabItemPosition=='time'">
      <div class="echarts-box" id="echarts"></div>
    </el-row>
    <el-row v-show="tabItemPosition=='time'">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="item" label="日期" width="100"></el-table-column>
        <el-table-column v-for="(item,index) in month" :key="index"  prop="price" :label="item" >
          <template slot-scope="scope">
            <span>{{scope.row.price[index]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "IncomeInquiry",
  data() {
    return {
      tabItemPosition: "time",
      fileYear: "",
      option: {},
      tableData: [{
          item: '营业额',
          price: [
          2.0,
          4.9,
          7.0,
          23.2,
          25.6,
          76.7,
          135.6,
          162.2,
          32.6,
          20.0,
          6.4,
          3.3,
        ],
        }, {
          item: '同比增长率',
          price: [
          2.6,
          5.9,
          9.0,
          26.4,
          28.7,
          70.7,
          175.6,
          182.2,
          48.7,
          18.8,
          6.0,
          2.3,
        ],
        }, {
          item: '环比增长率',
          price: [
          2.0,
          2.2,
          3.3,
          4.5,
          6.3,
          10.2,
          20.3,
          23.4,
          23.0,
          16.5,
          12.0,
          6.2,
        ]
        }],
        month: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
    };
  },
  methods: {
    //计算最大值
    calMax(arr) {
      let max = 0;
      arr.forEach((el) => {
        el.forEach((el1) => {
          if (!(el1 === undefined || el1 === "")) {
            if (max < el1) {
              max = el1;
            }
          }
        });
      });
      let maxint = Math.ceil(max / 9.5); //不让最高的值超过最上面的刻度
      let maxval = maxint * 10; //让显示的刻度是整数
      return maxval;
    },
    //计算最小值
    calMin(arr) {
      let min = 0;
      arr.forEach((el) => {
        el.forEach((el1) => {
          if (!(el1 === undefined || el1 === "")) {
            if (min > el1) {
              min = el1;
            }
          }
        });
      });
      let minint = Math.floor(min / 10);
      let minval = minint * 10; //让显示的刻度是整数
      return minval;
    },

    searchData() {
      var data1 = [
          2.0,
          4.9,
          7.0,
          23.2,
          25.6,
          76.7,
          135.6,
          162.2,
          32.6,
          20.0,
          6.4,
          3.3,
        ],
        data2 = [
          2.6,
          5.9,
          9.0,
          26.4,
          28.7,
          70.7,
          175.6,
          182.2,
          48.7,
          18.8,
          6.0,
          2.3,
        ],
        data3 = [
          2.0,
          2.2,
          3.3,
          4.5,
          6.3,
          10.2,
          20.3,
          23.4,
          23.0,
          16.5,
          12.0,
          6.2,
        ];
      var Min1 = this.calMin([data1]),
        Min2 = this.calMin([data2, data3]),
        Max1 = this.calMax([data1]),
        Max2 = this.calMax([data2, data3]);

      this.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["营业额", "同比增长", "环比增长"],
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "金额（元）",
            min: Min1,
            max: Max1,
            splitNumber: 5,
            interval: (Max1 - Min1) / 5,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "百分比",
            min: Min2,
            max: Max2,
            splitNumber: 5,
            interval: (Max2 - Min2) / 5,
            axisLabel: {
              formatter: "{value} %",
            },
          },
        ],
        series: [
          {
            name: "营业额",
            type: "bar",
            data: data1,
            itemStyle: {
              normal: {
                color: "#409EFF",
              },
            },
          },
          {
            name: "同比增长",
            type: "line",
            yAxisIndex: 1,
            data: data2,
            itemStyle: {
              normal: {
                color: "#778899",
              },
            },
          },
          {
            name: "环比增长",
            type: "line",
            yAxisIndex: 1,
            data: data3,
            itemStyle: {
              normal: {
                color: "#F4A460",
              },
            },
          },
        ],
      };
      console.log(this.fileYear);
      //通过年查找一整年的数据
      let myChart = echarts.init(document.getElementById("echarts"));
      myChart.setOption(this.option);
    },
  },
  mounted: function () {
    this.searchData();
  },
};
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
  clear: both;
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

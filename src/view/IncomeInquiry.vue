<template>
  <div>
    <!-- 选择类别 -->
    <el-row :gutter="5">
      <el-col :span="5">
        <el-radio-group v-model="tabItemPosition" size="small" @change="changePosition">
          <el-radio-button label="time">时间</el-radio-button>
          <el-radio-button label="service">服务商</el-radio-button>
          <el-radio-button label="store">网点</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="14" v-show="tabItemPosition == 'time'">
        <span>查找日期：</span>
        <el-date-picker
          v-model="fileYear"
          type="year"
          placeholder="选择查找的年份"
          value-format="yyyy"
        ></el-date-picker>
        <el-button type="primary" @click="searchData" size="small"
          >查询</el-button
        >
        <el-button type="primary" @click="importData" size="small"
          >导出Excel</el-button
        >

      </el-col>
      <el-col :span="10" v-show="tabItemPosition == 'service'">
        <span>服务商</span>
        <el-select
          filterable
          v-model="servicerid"
          clearable
          placeholder="请选择或输入查找"
          style="width: 10vw"
          size="small"
        >
          <el-option
            v-for="item in ServiceList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        <el-radio-group
          v-model="tabTimePosition"
          @change="onButtonChange"
          size="small"
        >
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="thisMonth">本月</el-radio-button>
          <el-radio-button label="search">区间查找</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="10" v-show="tabItemPosition == 'store'">
        <span>所属网点</span>
        <el-select
          filterable
          v-model="storeId"
          clearable
          placeholder="请选择或输入查找"
          style="width: 10vw"
          size="small"
          @change="changeStore($event)"
        >
          <el-option
            v-for="(item,index) in StoreList"
            :key="item.id"
            :label="item.name"
            :value="index"
          ></el-option>
        </el-select>
        <el-radio-group
          v-model="tabTimePosition"
          @change="onButtonChange"
          size="small"
        >
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="thisMonth">本月</el-radio-button>
          <el-radio-button label="search">区间查找</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col
        :span="8"
        v-show="
          tabTimePosition == 'search' &&
          (tabItemPosition == 'service' || tabItemPosition == 'store')
        "
      >
        <span>日期</span>
        <el-date-picker
          v-model="datePickerValue"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 10vw"
          size="small"
        >
        </el-date-picker>
        <el-button
          v-show="tabItemPosition == 'service'"
          type="primary"
          @click="searchServicerData"
          size="small"
          >查询</el-button
        >
        <el-button
          v-show="tabItemPosition == 'store'"
          type="primary"
          @click="timeStore"
          size="small"
          >查询</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <span style="fontsize: 26px">总营业额：{{ sum }}元</span>
      </el-col>
    </el-row>
    <!-- 时间 -->
    <el-row v-show="tabItemPosition == 'time'">
      <div class="echarts-box" id="echarts"></div>
    </el-row>
    <el-row v-show="tabItemPosition == 'time'">
      <el-table :data="tableData" border style="width: 96%">
        <el-table-column
          fixed
          prop="item"
          label="日期"
          width="94"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in month"
          :key="index"
          prop="price"
          width="72"
          :label="item"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.num[index] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 服务商 -->
    <el-row v-show="tabItemPosition == 'service'">
      <div class="service-echart" id="servicerEcharts"></div>
    </el-row>
    <el-row v-show="tabItemPosition == 'service'">
      <el-table :data="servicerList" border style="width: 93%">
        <el-table-column prop="name" label="服务商名称"></el-table-column>
        <el-table-column prop="price" label="营业额"></el-table-column>
        <el-table-column prop="ratio" label="占比"></el-table-column>
      </el-table>
    </el-row>
    <!-- 网点 -->
    <el-row v-show="tabItemPosition == 'store'">
      <div class="store-echart" id="storeEcharts"></div>
    </el-row>
    <el-row v-show="tabItemPosition == 'store' && !store ">
      <el-table :data="storeList" border style="width: 93%">
        <el-table-column prop="0" label="网点名称"></el-table-column>
        <el-table-column prop="1" label="营业额"></el-table-column>
        <el-table-column prop="2" label="占比"></el-table-column>
      </el-table>
    </el-row>
    <el-row v-show="tabItemPosition == 'store' && store ">
      <el-table :data="storeList" border style="width: 93%">
        <el-table-column prop="0" label="项目名称"></el-table-column>
        <el-table-column prop="1" label="所属服务商"></el-table-column>
        <el-table-column prop="2" label="营业额"></el-table-column>
        <el-table-column prop="3" label="占比"></el-table-column>
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
      tableData: [
        {
          item: "营业额",
          num: [],
        },
        {
          item: "同比增长率",
          num: [],
        },
        {
          item: "环比增长率",
          num: [],
        },
      ],
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
      servicerList: [
        { id: 1, name: "服务商A", price: "10000", ratio: "50%" },
        { id: 2, name: "服务商B", price: "20000", ratio: "50%" },
      ],
      servicerid: "",
      ServiceList: "",
      servicerOption: "",
      tabTimePosition: "today",
      datePickerValue: "",
      visible: false,
      storeList: [],
      StoreList: "",
      storeOption: "",
      sum: "",
      storeId: "",
      startTime: "",
      endTime: "",
      store:null,
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
      var date = new Date();
      var y = date.getFullYear(); //获取当前年份
      //同比 环比 营业额 时间
      var y2y = [],
        m2m = [],
        turnover = [],
        time = [];
      this.$get("/order/getIncomeByYear", {
        year: this.fileYear == "" ? y : this.fileYear,
      }).then((res) => {
        console.log(res);
        this.sum = res.sum;
        for (var i in res) {
          let index = res[i].length - 1;
          if (i == "Y2Y") {
            for (var j in res[i]) {
              y2y.push(res[i][index - j][1]);
            }
            this.tableData[1].num = y2y;
          }
          if (i == "M2M") {
            for (var k in res[i]) {
              m2m.push(res[i][index - k][1]);
            }
            this.tableData[2].num = m2m;
          }
          if (i == "year") {
            for (var s in res[i]) {
              turnover.push(res[i][index - s][1]);
              time.push(res[i][index - s][0]);
            }
            this.tableData[0].num = turnover;
          }
        }
        var Min1 = this.calMin([turnover]),
          Min2 = this.calMin([y2y, m2m]),
          Max1 = this.calMax([turnover]),
          Max2 = this.calMax([y2y, m2m]);

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
              data: time,
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
              data: turnover,
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
              data: y2y,
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
              data: m2m,
              itemStyle: {
                normal: {
                  color: "#F4A460",
                },
              },
            },
          ],
        };
        let myChart = echarts.init(document.getElementById("echarts"));
        myChart.setOption(this.option);
      });
    },
    searchServicerData() {
      this.servicerOption = {
        title: {
          text: "服务商营业统计（元）",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: ["服务商A", "服务商B", "服务商C"],
        },
        series: [
          {
            name: "营业额",
            type: "bar",
            data: [18203, 23489, 120000],
            barWidth: 30,
            itemStyle: {
              normal: {
                color: "#409EFF",
              },
            },
          },
        ],
      };

      let servicerChart = echarts.init(
        document.getElementById("servicerEcharts")
      );
      servicerChart.setOption(this.servicerOption);
    },

    onButtonChange(e) {
      console.log(e);
      if (e == "today") {
        this.setToday();
        this.searchStoreData();
      }else if (e =='thisMonth'){
        this.setMonth();
        this.searchStoreData();
      }
    },
    changeStore(e){
      // console.log(e)
      this.store = this.StoreList[e];
      this.searchStoreData();
    },
    changePosition(e){
      console.log(e)
      if(e == 'store'){
        this.setToday();
        this.searchStoreData();
      }else if (e =="time"){
        this.searchData();
      }
    },
    setToday(){
      var date = new Date(),
        Y = date.getFullYear() + "-",
        M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-",
        D = date.getDate();
        this.startTime = Y + M + (D-1);
        this.endTime = Y + M + D
    },
    setMonth(){
      var date = new Date(),
      Y = date.getFullYear() + "-",
      M = (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-",
      D = '01';
      this.startTime = Y+M+D;
      this.endTime = '';
    },
    timeStore(){
      console.log(this.datePickerValue)
      this.startTime = this.datePickerValue[0];
      this.endTime = this.datePickerValue[1];
      this.searchStoreData();
    },
    searchStoreData() {
      this.$get("/order/getIncomeByStore", {
        storeId: this.store?this.store.id:'',
        startTime: this.startTime,
        endTime: this.endTime,
      }).then((res) => {
        console.log(res);
        var storeList =[],
        price = [],
        proportion=[];
        this.sum = res.sum;
        this.storeList =res.list;
        for(let i in res.list){
          storeList.push(res.list[i][0]);
          price.push(res.list[i][1]);
          proportion.push(res.list[i][2]);
        }
        var text= "网点营业统计（元）";
        console.log(this.store)
      if(this.store){
        text = this.store.name+"服务项目营业统计（元）";
        storeList=[];
        price=[];
        proportion=[];
        for(let i in res.list){
          storeList.push(res.list[i][0]);
          price.push(res.list[i][2]);
          proportion.push(res.list[i][3])
        }
      }
      this.storeOption = {
        title: {
          text: text,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "value",
          boundaryGap: false,
        },
        yAxis: {
          type: "category",
          data: storeList,
        },
        series: [
          {
            name: "营业额",
            type: "bar",
            data: price,
            barWidth: 30,
            itemStyle: {
              normal: {
                color: "#409EFF",
              },
            },
          },
        ],
      };
      console.log("查询网点");
      let storeEcharts = echarts.init(document.getElementById("storeEcharts"));
      storeEcharts.setOption(this.storeOption);
      });
    },
    // 获取服务商列表
    getServiceList() {
      this.$get("/sp/list", {
        name: "",
        currentPage: 1,
        pageSize: 200,
      }).then((res) => {
        console.log(res);
        this.ServiceList = res.data;
      });
    },
    //获取网点列表
    getStoreList() {
      this.$get("/store/list", {
        name: this.storeName,
        currentPage: 1,
        pageSize: 200,
      }).then((res) => {
        this.StoreList = res.data;
      });
    },
    //营业汇总时间导出
    importData(){
      var date = new Date();
      var y = date.getFullYear();
      this.$getExcel("/order/exportIncomeByYearExcel",{
        year: this.fileYear == "" ? y : this.fileYear
      })
    },
},

  mounted: function () {
    this.searchData();
    this.searchServicerData();
    this.getServiceList();
    this.getStoreList();
  },
};
</script>

<style lang="less" scoped>
.echarts-box {
  height: 300px;
  width: 100%;
}
.service-echart {
  width: 1000px;
  height: 500px;
}
.store-echart {
  width: 1000px;
  height: 500px;
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

<template>
  <div>
    <!--<img class="page-center" src="./../../static/logo.jpg" alt="logo">-->
    <div class="page-center">数据统计</div>
    <el-row :gutter="5">

      <el-col :span="5">
        <span>所属门店：</span>
        <el-select clearable v-model="selectStore"
                   @change="getList"
                   placeholder="请选择" style="width: 10vw" size="small">
          <el-option v-for="item in storeList" :key="item.id"
                     :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>

      <el-col :span="7">
        <span>查找日期：</span>
        <el-date-picker
          v-model="datePickerValue"
          type="date"
          value-format="yyyy-MM-dd"
          size="small"
          placeholder="选择日期">
        </el-date-picker>

      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="getList" size="small">查询</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column property="cumulateUserCount" :label="newyesterdayFlag"
                        align="center"/>
      <el-table-column property="registerUserCount" label="注册人数" align="center"/>
      <el-table-column property="orderCount" label="订单数" align="center"/>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data(){
      return{
        selectStore:'',
        storeList:[],
        datePickerValue:'',
        dataList:[],
        loading:true,
        yesterdayFlag:false,
      }
    },
    methods:{
      // 获取列表
      getList(){
        this.loading=true
        this.$get('/wxUserInfo/getCumulateThree', {
          storeId: this.selectStore,
          refDate: this.datePickerValue
        }).then(res => {
          this.loading=false
          let list = [res]
          this.dataList = list
          this.yesterdayFlag=this.dataList[0].yesterdayFlag
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
    },
    computed:{
      newyesterdayFlag:function(){
        return this.yesterdayFlag?'昨日关注人数':'当日关注人数';
      }
    },
    mounted: function () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() < 9 ? '-0' + (date.getMonth() + 1) : '-' + (date.getMonth() + 1)
      let day = date.getDate() < 10 ? '-0' + date.getDate() : '-' + date.getDate()
      this.datePickerValue = year + month + day
      this.getList()
      this.getStoreList()
    }
  }
</script>
<style lang="less" scoped>
  .page-center{
    transform: translateX(-50%);
    left: 45%;
    position: relative;
    width: 300px;
    text-align: center;
    margin: 50px 0;
  }
</style>


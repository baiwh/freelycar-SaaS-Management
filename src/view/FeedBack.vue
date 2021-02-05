<template>
  <div class="minwidth">
    <!--查询条件-->
    <el-row>
      <el-col :span="8">
        反馈类型：
        <el-select
          filterable
          v-model="feedBackType"
          clearable
          placeholder="请选择或输入查找"
          style="width: 16vw"
          size="small"
        >
          <el-option
            v-for="item in FeedBackTypes"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small" @click="getFeedBackList()"
          >查询</el-button
        >
      </el-col>
    </el-row>

    <!--表格-->
    <el-table
      :data="feedBackList"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column label="序号" type="index">
        <template slot-scope="scope">
          <span>{{
            scope.$index + (pageData.currentPage - 1) * pageData.pageSize + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="contactNumber" label="联系方式"> </el-table-column>
      <el-table-column prop="feedBackTypes" label="反馈类型"></el-table-column>
      <el-table-column
        prop="description"
        label="内容描述"
        width="180"
      ></el-table-column>
      <el-table-column align="center" label="反馈照片">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.imgs.length==0" size="mini" type="primary" @click="showImgs(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="反馈时间"
        sortable
        width="180"
      ></el-table-column>
    </el-table>
    <!--分页器-->
    <el-row style="height: 82px">
      <pagingDevice
        :pageData.sync="pageData"
        @changePage="getFeedBackList"
      ></pagingDevice>
    </el-row>

    <el-dialog  title="查看图片" :visible.sync="isShow">
      <div class="demo-image">
        <div class="block">
          <el-image
            style="width: 300px;"
            v-for="(imgurl,index) in feedBackimgs"
            :key="index"
            :src="imgurl.imgUrl"
            fit="contain"
          >
          </el-image>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FeedBack",
  data() {
    return {
      feedBackType: "",
      FeedBackTypes: ["功能异常", "产品建议", "支付问题", "其他"],
      pageData: {
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      feedBackList: [],
      isShow: false,
      feedBackimgs:[],
    };
  },
  methods: {
    getFeedBackList() {
      this.$get("/feedback/list", {
        type: this.feedBackType,
        currentPage: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        sort: false,
      }).then((res) => {
        this.feedBackList = res.data;
        this.pageData.currentPage = res.currentPage;
        this.pageData.pageSize = res.pageSize;
        this.pageData.pageTotal = res.total;
        console.log(res);
      });
    },
    showImgs(row) {
      console.log(row);
      this.isShow= true
      this.feedBackimgs = row.imgs;
      console.log(this.feedBackimgs)
    },
  },
  mounted: function () {
    this.getFeedBackList();
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 30px;
}
.active {
  border: none;
  background-color: #f56c6c;
}
.minwidth {
  width: 100%;
  min-width: 1000px;
}
</style>

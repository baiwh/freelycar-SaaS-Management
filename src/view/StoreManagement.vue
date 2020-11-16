<template>
  <div class="minwidth">
    <!--查询条件-->
    <el-row>
      <el-col :span="8">
        网点名称：
        <el-input v-model="storeName" size="small" style="width: 16vw"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small" @click="getList('select')">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="addNewStore">新增网点</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除网点</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table
      ref="multipleTable"
      :data="storeList"
      tooltip-effect="dark"
      border
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :default-sort="{prop: 'sort', order: 'ascending'}"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageData.currentPage - 1) * pageData.pageSize + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="网点名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="username" label="账号名称" width="85"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="删除" width="85">
        <template slot-scope="scope">
          <el-popover placement="top" width="160" :ref="scope.row.storeId">
            <p>确定删除此网点？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleClose(scope.row.storeId)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="mini" v-popover="scope.row.storeId" type="danger">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改" width="85">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="85">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" :class="{'active':scope.row.openStatus}" @click="closeOrOpenAccount(scope.row)">{{scope.row.openStatus==true?"关闭":"开启"}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="170">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.sort===10"
            size="mini"
            type="primary"
            @click="upLayer(scope.$index,scope.row)"
          >上移</el-button>
          <el-button
           :disabled="scope.$index+(pageData.currentPage - 1) * pageData.pageSize + 1 === pageData.pageTotal"
            size="mini"
            type="primary"
            @click.native.prevent="downLayer(scope.$index,scope.row)"
          >下移</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <el-row style="height: 82px">
      <pagingDevice :pageData.sync="pageData" @changePage="getList"></pagingDevice>
    </el-row>

    <!--默认列表按钮-->
    <!-- <el-row>
      <el-col :span="4">
        <el-popover placement="bottom" width="200" v-model="show">
          <p>发布新列表并覆盖列表？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="show = false">取消</el-button>
            <el-button type="primary" size="mini" @click="newListSubmit">确定</el-button>
          </div>
          <el-button size="small" type="primary" slot="reference" plain>发布默认列表</el-button>
        </el-popover>
      </el-col>
    </el-row>-->

    <!--新增、修改网点弹框-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <el-form
        :model="storeInfo"
        :rules="rules"
        ref="storeInfo"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="网点名称：" prop="name">
          <el-input v-model="storeInfo.name" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="网点地址：" prop="address">
          <el-input v-model="storeInfo.address" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <!-- 修改为账号名称和密码 -->
        <el-form-item label="账号名称：" prop="username">
          <el-input v-model="storeInfo.username" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="storeInfo.password" style="width: 80%" size="small" ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="storeInfo.remark"
            style="width:80%"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="storeSubmit('storeInfo')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StoreManagement",
  data() {
    var checkData=(rule, value, callback) =>{
      if (value) {
        if (/[^\w\.\/]/ig.test(value)) {
          callback(new Error('请不要输入中文和空格！'));
        } else {
          callback();
        }
      }
      callback();
    }
    return {
      loading: "",
      storeName: "",
      storeList: [],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        username:[{required:true,message:"请输入账号名称",trigger:"blur"}],
        password:[{required:true,message:"请输入密码",trigger:"blur"},{ validator: checkData, trigger: 'blur'}]
      },
      pageData: {
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      storeInfo: {
        storeId: "",
        name: "",
        address: "",
        phone: "",
        remark: "",
        sysUserId:"",
      },
      multipleSelection: [],
      newOrChange: "",
      isShow: false,
      show: false,
    }
  },
  methods: {
    // 获取网点列表
    getList(info) {
      if(info == 'select'){
        this.pageData.currentPage =1;
        this.pageData.pageSize=10;
      }
      this.$get("/store/listStoreAccount", {
        name: this.storeName,
        currentPage: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
      }).then((res) => {
        console.log(res);
        this.loading = false;
        this.storeList = res.data;
        console.log(res)
        this.pageData.currentPage = res.currentPage;
        this.pageData.pageSize = res.pageSize;
        this.pageData.pageTotal = res.total;
      });
    },

    // 新增网点打开模态框
    addNewStore() {
      this.isShow = true;
      this.newOrChange = "新增网点";
      this.storeInfo = {
        storeId: "",
        name: "",
        address: "",
        phone: "",
        remark: "",
      };
    },

    // 修改网点模态框
    handleModify(row) {
      console.log(row)
      this.isShow = true;
      this.newOrChange = "修改网点";
      this.storeInfo = { ...row };
    },

    // 提交新增、修改
    storeSubmit(formName) {
      console.log('11')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isShow = false;
          this.$post("/store/modify", {
            storeId: this.storeInfo.storeId,
            name: this.storeInfo.name,
            address: this.storeInfo.address,
            remark: this.storeInfo.remark,
            username: this.storeInfo.username,
            password: this.storeInfo.password,
            sysUserId:this.storeInfo.sysUserId
          }).then((res) => {
            console.log(res)
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.getList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 关闭提示小窗口
    handleClose(id) {
      this.$refs[id].doClose();
    },

    // 删除单个网点
    handleDelete(row) {
      this.$get("/store/delete", {
        id: row.storeId,
      }).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getList();
      });
    },

    // 批量删除网点
    allDelete() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.storeId);
      });
      if (this.multipleSelection.length > 0) {
        this.$post("/store/batchDelete", {
          ids: ids.join(","),
        }).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getList();
        });
      } else {
        this.$message({
          message: "请勾选网点",
          type: "error",
        });
      }
    },

    // 多选功能
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 上移
    upLayer(index, row) {
      console.log(row)
      if (index == 0 && row.sort!== 10) {
        let param = {};
        let prestore;
        console.log(index)
        this.$get("/store/listStoreAccount", {
          name: this.storeName,
          currentPage: this.pageData.currentPage-1,
          pageSize: this.pageData.pageSize,
      }).then((res) => {
        console.log(res)
        prestore = res.data[9];
        param[row.storeId] = prestore.sort;
        param[prestore.storeId] = row.sort;
        this.switchLocation(param);

      });
      }else if(row.sort === 10){
        this.$message({
          message: "处于顶端，不能继续上移",
          type: "warning",});
      } else {
        let param = {};
        param[row.storeId] = this.storeList[index - 1].sort; //该行的网点id和sort
        param[this.storeList[index - 1].storeId] = row.sort; //上一行数据的sort
        console.log(param)
        //访问后台接口传入两个调换的网点id和sort值有后台调换顺序，刷新数据
        this.switchLocation(param);
      }
    },
    // 下移
    downLayer(index, row) {
      //下移当前页最后一个逻辑
      if (index === this.storeList.length - 1 && index+(this.pageData.currentPage - 1) * this.pageData.pageSize + 1 !==this.pageData.pageTotal) {
        let param = {};
        let nextstore;
        this.$get("/store/listStoreAccount", {
          name: this.storeName,
          currentPage: this.pageData.currentPage+1,
          pageSize: this.pageData.pageSize,
      }).then((res) => {
        console.log(res)
        nextstore = res.data[0];
        param[row.storeId] = nextstore.sort;
        param[nextstore.storeId] = row.sort;
        this.switchLocation(param);

      });
      }else if(index+(this.pageData.currentPage - 1) * this.pageData.pageSize + 1 === this.pageData.pageTotal){
        this.$message({
          message: "最后一个元素，不能下移",
          type: "warning",});
      } else {
        let param = {};
        param[row.storeId] = this.storeList[index + 1].sort; //该行的网点id和下一行的sort
        param[this.storeList[index + 1].storeId] = row.sort; //上一行数据的sort
        this.switchLocation(param);
      }
    },
    //移动请求
    switchLocation(param) {
      console.log('移动')
      this.$post("/store/switchLocation", param).then((res) => {
        this.$message({
          message: "移动成功",
          type: "success",
        });
        this.getList();
      });
    },
    closeOrOpenAccount(row){
      //关闭账号
      console.log(row.openStatus);
      console.log(row.sysUserId)
      if(row.openStatus){
        this.$get("/sysUser/close",{
          id:row.sysUserId
        }).then((res)=>{
          console.log(res)
          this.getList();
          this.$message({
            message:"关闭成功",
            type:"success",
          });
        })
      }else{
        this.$get("/sysUser/open",{
          id:row.sysUserId
        }).then((res)=>{
          console.log(res)
          this.getList();
          this.$message({
            message:"开启成功",
            type:"success",
          });
        })
      }
    }
  },
  mounted: function () {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 30px;
}
.active{
  border:none;
  background-color:#f56c6c;
}
.minwidth{
  width : 100%;
  min-width: 1000px;
}
</style>

<template>
  <div>
    <!--查询条件-->
    <el-row>
      <el-col :span="10">门店名称：
        <el-input v-model="storeName" size="small" style="width: 16vw"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small" @click="getList">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="addNewStore">新增门店</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除门店</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="storeList" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="门店名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="删除" width="85">
        <template slot-scope="scope">
          <el-popover placement="top" width="160" :ref="scope.row.id">
            <p>确定删除此门店？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleClose(scope.row.id)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="mini" v-popover="scope.row.id" type="danger">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="修改" width="85">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="上移" width="85">
        <template slot-scope="scope">
          <el-button size="mini" type="primary">上移</el-button>
        </template>
      </el-table-column>
      <el-table-column label="下移" width="85">
        <template slot-scope="scope">
          <el-button size="mini" type="primary">下移</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <el-row style="height: 82px">
      <pagingDevice :pageData.sync="pageData" @changePage="getList"></pagingDevice>
    </el-row>

    <!--默认列表按钮-->
    <el-row>
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
    </el-row>

    <!--新增、修改门店弹框-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <el-form :model="storeInfo" :rules="rules" ref="storeInfo" label-width="100px" class="demo-ruleForm">
        <el-form-item label="门店名称：" prop="name">
          <el-input v-model="storeInfo.name" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="门店地址：" prop="address">
          <el-input v-model="storeInfo.address" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="linkman">
          <el-input v-model="storeInfo.linkman" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="phone">
          <el-input type="number" v-model.number="storeInfo.phone" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="storeInfo.remark"
                    style="width:80%"></el-input>
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
    name: 'StoreManagement',
    data() {
      return {
        loading: '',
        storeName: '',
        storeList: [],
        rules:{
          name: [
            { required: true, message: '请输入名称', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ]
        },
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        storeInfo: {
          id: '',
          name: '',
          address: '',
          linkman: '',
          phone: '',
          remark: ''
        },
        multipleSelection: [],
        newOrChange: '',
        isShow: false,
        show: false
      }
    },
    methods: {
      // 获取门店列表
      getList() {
        this.$get('/store/list', {
          name: this.storeName,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }).then(res => {
          this.loading = false
          this.storeList = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      // 新增门店打开模态框
      addNewStore() {
        this.isShow = true
        this.newOrChange = "新增门店"
        this.storeInfo = {
          id: '',
          name: '',
          address: '',
          linkman: '',
          phone: '',
          remark: ''
        }
      },

      // 修改门店模态框
      handleModify(row) {
        this.isShow = true;
        this.newOrChange = "修改门店"
        this.storeInfo = {...row}
      },

      // 提交新增、修改
      storeSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isShow = false
            this.$post('/store/modify',{
              id: this.storeInfo.id,
              name: this.storeInfo.name,
              address: this.storeInfo.address,
              linkman: this.storeInfo.linkman,
              phone: this.storeInfo.phone,
              remark: this.storeInfo.remark
            }).then(res=>{
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getList()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      },

      // 关闭提示小窗口
      handleClose(id) {
        this.$refs[id].doClose()
      },

      // 删除单个门店
      handleDelete(row) {
        this.$get('/store/delete',{
          id:row.id
        }).then(res=>{
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      },

      // 批量删除门店
      allDelete() {
        let ids = []
        this.multipleSelection.forEach(v => {
          ids.push(v.id)
        })
        if(this.multipleSelection.length>0){
          this.$post('/store/batchDelete',{
            ids:ids.join(',')
          }).then(res=>{
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          })
        } else {
          this.$message({
            message: '请勾选门店',
            type: 'error'
          })
        }
      },

      // 多选功能
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      // 上移
      // 下移

      // 发布列表
      newListSubmit(){
        this.show = false
        // this.$post()
      }
    },
    mounted: function () {
      this.getList()
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    margin-bottom: 30px;
  }
</style>

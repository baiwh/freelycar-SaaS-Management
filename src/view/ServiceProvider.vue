<template>
  <div>
    <!--查询条件-->
    <el-row>
      <el-col :span="10">服务商名称：
        <el-input v-model="serviceProviderName" size="small" style="width: 16vw"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small" @click="getList">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="addNew">新增服务商</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除服务商</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="serviceProviderList" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="服务商名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="comment" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="删除" width="85">
        <template slot-scope="scope">
          <el-popover placement="top" width="160" :ref="scope.row.id">
            <p>确定删除服务商？</p>
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
    </el-table>

    <!--分页器-->
    <el-row style="height: 82px">
      <pagingDevice :pageData.sync="pageData" @changePage="getList"></pagingDevice>
    </el-row>

    <!--新增、修改门店弹框-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <el-form :model="serviceProviderInfo" :rules="rules" ref="serviceProviderInfo" label-width="150px" class="demo-ruleForm">
        <el-form-item label="服务商名称：" prop="name">
          <el-input v-model="serviceProviderInfo.name" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="服务商地址：" prop="address">
          <el-input v-model="serviceProviderInfo.address" style="width: 80%" size="small"></el-input>
          <el-button type="primary" size="mini" @click="getAddress">检测经纬度</el-button>
        </el-form-item>
        <el-form-item label="经度（lng）：" prop="addressLng">
          <el-input v-model="serviceProviderInfo.addressLng" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="纬度（lat）：" prop="addressLat">
          <el-input v-model="serviceProviderInfo.addressLat" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="phone">
          <el-input type="number" v-model.number="serviceProviderInfo.phone" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="comment">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="serviceProviderInfo.comment"
                    style="width:80%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="storeSubmit('serviceProviderInfo')">确 定</el-button>
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
        serviceProviderName: '',
        serviceProviderList: [],
        rules:{
          name: [
            { required: true, message: '请输入名称', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入电话', trigger: 'blur' }
          ]
        },
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        serviceProviderInfo: {
          id: '',
          name: '',
          address: '',
          phone: '',
          comment: '',
          addressLng:'',
          addressLat:'',
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
        this.$get('/serviceProvider/list', {
          name: this.serviceProviderName,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }).then(res => {
          this.loading = false
          this.serviceProviderList = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      // 新增 打开模态框
      addNew() {
        this.isShow = true
        this.newOrChange = "新增服务商"
        this.serviceProviderInfo = {
          id: '',
          name: '',
          address: '',
          phone: '',
          comment: '',
          addressLng:'',
          addressLat:''
        }
      },

      // 修改 模态框
      handleModify(row) {
        this.isShow = true;
        this.newOrChange = "修改服务商"
        this.serviceProviderInfo = {...row}
      },

      // 检测经纬度
      getAddress(){
        this.$get('/serviceProvider/getLatAndLonAndDetail', {
          address: this.serviceProviderInfo.address
        }).then(res => {
          console.log(res)
          this.serviceProviderInfo.address=res.formatted_address
          this.serviceProviderInfo.addressLng=res.location.lng
          this.serviceProviderInfo.addressLat=res.location.lat
        })
      },

      // 提交新增、修改
      storeSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isShow = false
            this.$post('/serviceProvider/modify',{
              id: this.serviceProviderInfo.id,
              name: this.serviceProviderInfo.name,
              address: this.serviceProviderInfo.address,
              phone: this.serviceProviderInfo.phone,
              comment: this.serviceProviderInfo.comment,
              addressLng: this.serviceProviderInfo.addressLng,
              addressLat: this.serviceProviderInfo.addressLat
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

      // 删除单个
      handleDelete(row) {
        this.$get('/serviceProvider/delete',{
          id:row.id
        }).then(res=>{
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      },

      // 批量删除
      allDelete() {
        let ids = []
        this.multipleSelection.forEach(v => {
          ids.push(v.id)
        })
        if(this.multipleSelection.length>0){
          this.$post('/serviceProvider/batchDelete',{
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
            message: '请勾选服务商',
            type: 'error'
          })
        }
      },

      // 多选功能
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
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

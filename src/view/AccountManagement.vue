<template>
  <div>
    <!--查询条件-->
    <el-row :gutter="5">
      <el-col :span="9">
        <span>所属门店：</span>
        <el-select v-model="selectStore" placeholder="请选择" style="width: 16vw" size="small">
          <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small" @click="getList">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="addNewAccount">新增账号</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除账号</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="accountList" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="storeId" label="所属门店" :formatter="storeFormat"></el-table-column>
      <el-table-column prop="staffName" label="账号使用者"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="permissionSettings">权限设置</el-button>
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">修改</el-button>
          <el-popover placement="top" width="160" :ref="scope.$index">
            <p>确定删除本条抵用券？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleClose(scope.$index)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="mini" v-popover="scope.$index" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice :pageData.sync="pageData" @changePage="getList"></pagingDevice>

    <!--新增、修改账号-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <!--账号信息-->
      <el-row>
        <el-col :span="4" :offset="2">所属门店：</el-col>
        <el-col :span="18">
          <el-select v-model="accountInfo.storeId" placeholder="请选择" style="width: 80%">
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">使用者：</el-col>
        <el-col :span="18">
          <el-input v-model="accountInfo.staffName" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">用户名：</el-col>
        <el-col :span="18">
          <el-input v-model="accountInfo.username" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">密码：</el-col>
        <el-col :span="18">
          <el-input v-model="accountInfo.password" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">手机号：</el-col>
        <el-col :span="18">
          <el-input v-model="accountInfo.phone" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">备注：</el-col>
        <el-col :span="18">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="accountInfo.remark" style="width:80%"></el-input>
        </el-col>
      </el-row>

      <!--权限设置-->
      <el-row>
        <el-col :span="3" :offset="10">
          <el-button type="primary" size="small" plain @click="permissionSettings">权限设置</el-button>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="accountSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--权限设置-->
    <el-dialog title="权限设置" :visible.sync="isSetting">
      <el-table ref="multipleTable" :data="innerTableData" tooltip-effect="dark" border
                @selection-change="settingSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="100" align="center"></el-table-column>
        <el-table-column label="序号" type="index" width="150" align="center"></el-table-column>
        <el-table-column prop="features" label="功能" align="center"></el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isSetting = false">取 消</el-button>
        <el-button type="primary" @click="settingSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'AccountManagement',
    data() {
      return {
        input: '',
        selectStore: '',
        storeList: [],
        multipleSelection: [],
        settingSelection: [],
        accountList: [],
        loading: '',
        newOrChange: '',
        isShow: false,
        accountInfo: {
          id: '',
          storeId: '',
          staffName: '',
          username: '',
          password: '',
          phone: '',
          remark: ''
        },
        innerTableData: [],
        isSetting: false,
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 10
        }
      }
    },
    methods: {
      // 获取账号列表
      getList() {
        this.$get('/sysUser/list', {
          storeId: this.selectStore,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }).then(res => {
          this.loading = false
          this.accountList = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
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

      // 新增账户弹框
      addNewAccount() {
        this.newOrChange = '新增账户'
        this.isShow = true
        this.accountInfo = {
          id: '',
          storeId: '',
          staffName: '',
          username: '',
          password: '',
          phone: '',
          remark: ''
        }
      },

      // 修改账户弹框
      handleModify(row) {
        this.newOrChange = '修改账户'
        this.isShow = true
        this.accountInfo=row
      },

      // 提交新增、修改
      accountSubmit() {
        this.isShow = false
        this.$post('/sysUser/modify', {
          id: this.accountInfo.id,
          storeId: this.accountInfo.storeId,
          staffName: this.accountInfo.staffName,
          username: this.accountInfo.username,
          password: this.accountInfo.password,
          phone: this.accountInfo.phone,
          remark: this.accountInfo.remark
        }).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.getList()
        })
      },

      // 删除单个账号
      handleDelete(row) {
        this.$get('/sysUser/delete', {
          id: row.id
        }).then(res => {
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
        this.multipleSelection.filter(v => {
          ids.push(v.id)
        })
        this.$post('/sysUser/batchDelete', {
          ids: ids.join(',')
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      },

      // 多选功能
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      settingSelectionChange(val) {
        this.settingSelection = val
      },

      // 关闭提示框
      handleClose(id) {
        this.$refs[id].doClose()
      },

      // 门店过滤器
      storeFormat(row){
        console.log(row)
        let name = ''
        this.storeList.map(value => {
          if(value.id==row.id){
            name=value.name
          }
        })
        return name
      },

      // 权限设置弹框
      permissionSettings() {
        this.isSetting = true
      },

      // 权限设置确定按钮
      settingSubmit(){
        this.isSetting = false
      }
    },
    mounted: function () {
      this.getList()
      this.getStoreList()
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    margin-bottom: 30px;
  }
</style>

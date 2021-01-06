<template>
  <div>
    <!--查询条件-->
    <el-row :gutter="5">
      <el-col :span="9">
        <span>所属网点：</span>
        <el-select filterable clearable v-model="selectStore" placeholder="请选择或输入" style="width: 16vw" size="small">
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
      <el-table-column prop="storeId" label="所属网点" :formatter="storeFormat"></el-table-column>
      <el-table-column prop="staffName" label="账号使用者"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="permissionSettings">权限设置</el-button>
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">修改</el-button>
          <el-popover placement="top" width="160" :ref="scope.row.id">
            <p>确定删除此账号？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleClose(scope.row.id)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="mini" v-popover="scope.row.id" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice :pageData.sync="pageData" @changePage="getList"></pagingDevice>

    <!--新增、修改账号-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <el-form :model="accountInfo" :rules="rules" ref="accountInfo" label-width="100px" class="demo-ruleForm">
        <el-form-item label="所属网点" prop="storeId">
          <el-select filterable v-model="accountInfo.storeId" placeholder="请选择或输入" style="width: 80%">
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用者" prop="staffName">
          <el-input v-model="accountInfo.staffName" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="accountInfo.username" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="accountInfo.password" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="number" v-model.number="accountInfo.phone" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="accountInfo.remark"
                    style="width:80%"></el-input>
        </el-form-item>


        <!--权限设置-->
        <el-form-item>
          <el-button type="primary" size="small" plain @click="permissionSettings">权限设置</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="accountSubmit('accountInfo')">确 定</el-button>
        </el-form-item>

      </el-form>
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
        rules:{
          storeId: [
            { required: true, message: '请选择网点', trigger: 'change' }
          ],
          staffName: [
            { required: true, message: '请输入使用者', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
        },
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
          console.log(res)
          this.loading = false
          this.accountList = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      // 获取网点列表
      getStoreList() {
        this.$get('/store/list', {
          name: '',
          currentPage: 1,
          pageSize: 200
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
        this.accountInfo = {...row}
        this.accountInfo.password = ''
      },

      // 提交新增、修改
      accountSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
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
          } else {
            console.log('error submit!!');
            return false;
          }
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

      // 批量删除网点
      allDelete() {
        let ids = []
        this.multipleSelection.filter(v => {
          ids.push(v.id)
        })
        if (this.multipleSelection.length > 0) {
          this.$post('/sysUser/batchDelete', {
            ids: ids.join(',')
          }).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          })
        } else {
          this.$message({
            message: '请勾选账号',
            type: 'error'
          })
        }

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

      // 网点过滤器
      storeFormat(row) {
        let name = ''
        this.storeList.map(value => {
          if (value.id == row.storeId) {
            name = value.name
          }
        })
        return name
      },

      // 权限设置弹框
      permissionSettings() {
        this.isSetting = true
      },

      // 权限设置确定按钮
      settingSubmit() {
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

<template>
  <div>
    <!--查询条件-->
    <el-row :gutter="10">
      <el-col :span="10">智能柜序号:
        <el-input v-model="arkSn" size="small" style="width: 16vw"></el-input>
      </el-col>
      <el-col :span="8">所属门店：
        <el-select v-model="storeId" clearable placeholder="请选择" style="width: 16vw" size="small">
          <el-option v-for="item in storeList" :key="item.id" :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small" @click="getList">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="addNewStore">新增智能柜</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除智能柜</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="cabinetList" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="sn" label="智能柜序号"></el-table-column>
      <el-table-column prop="storeId" label="所属门店" :formatter="storeFormat"></el-table-column>
      <el-table-column prop="location" label="投放位置"></el-table-column>
      <el-table-column prop="location" label="规格"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">修改</el-button>
          <el-popover placement="top" width="160" :ref="scope.$index">
            <p>确定删除此智能柜？</p>
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

    <!--新增、修改智能柜弹框-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <el-form :model="arkForm" :rules="rules" ref="arkForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="智能柜序号：" prop="sn">
          <el-input v-model="arkForm.sn" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="所属门店：" prop="storeId">
          <el-select v-model="arkForm.storeId" placeholder="请选择" style="width: 27vw" size="small">
            <el-option v-for="item in storeList" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放位置：" prop="location">
          <el-input v-model="arkForm.location" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="规格：" prop="doorNum">
          <el-select v-model="arkForm.doorNum" placeholder="请选择" style="width: 27vw" size="small">
            <el-option v-for="item in doorNumList" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="arkForm.remark" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="submitArk('arkForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'IntelligentCabinet',
    data() {
      return {
        loading: true,
        arkSn: '',
        rules:{
          sn: [
            { required: true, message: '请输入柜子编号', trigger: 'blur' },
          ],
          storeId: [
            { required: true, message: '请选择门店', trigger: 'change' }
          ],
          location: [
            { required: true, message: '请输入位置', trigger: 'blur' }
          ],
          doorNum: [
            { required: true, message: '请选择规格', trigger: 'change' }
          ]
        },
        storeId: '',
        storeList: [],
        cabinetList: [],
        multipleSelection: [],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        newOrChange: '',
        isShow: false,
        arkForm: {
          sn: '',
          storeId: '',
          location: '',
          doorNum: '',
          remark: '',
          name: ''
        },
        doorNumList: [
          {
            value: 16,
            label: 16
          }
        ]
      }
    },
    methods: {
      // 获取智能柜列表
      getList() {
        this.$get('/ark/list', {
          arkSn: this.arkSn,
          storeId: this.storeId,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }).then(res => {
          this.loading = false
          this.cabinetList = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      // 获取门店列表
      getStoreList() {
        this.$get('/store/list', {
          name: this.storeName,
          currentPage: 1,
          pageSize: 100
        }).then(res => {
          this.storeList = res.data
        })
      },

      // 新增智能柜打开模态框
      addNewStore() {
        this.isShow = true
        this.newOrChange = '新增智能柜'
        this.arkForm = {
          sn: '',
          storeId: '',
          location: '',
          doorNum: '',
          remark: '',
          name: ''
        }
      },

      // 修改智能柜模态框
      handleModify(row) {
        this.isShow = true;
        this.newOrChange = '修改智能柜'
        this.arkForm = row
      },

      handleClose(id) {
        this.$refs[id].doClose()
      },

      // 删除单个
      handleDelete(row) {
        this.$get('/ark/delete', {
          arkId: row.id
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      },

      // 新增、修改提交
      submitArk(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isShow = false
            if (this.newOrChange === '新增智能柜') {
              this.$post('/ark/add', {
                sn: this.arkForm.sn,
                storeId: this.arkForm.storeId,
                location: this.arkForm.location,
                doorNum: this.arkForm.doorNum,
                remark: this.arkForm.remark,
                name: this.arkForm.name
              }).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.getList()
              })
            } else {
              this.$post('/ark/modify', {
                id: this.arkForm.id,
                sn: this.arkForm.sn,
                storeId: this.arkForm.storeId,
                location: this.arkForm.location,
                doorNum: this.arkForm.doorNum,
                remark: this.arkForm.remark,
                name: this.arkForm.name
              }).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.getList()
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      },

      // 删除全部
      allDelete() {
        let ids = []
        this.multipleSelection.forEach(v => {
          ids.push(v.id)
        })
        if (this.multipleSelection.length > 1) {
          this.$post('/ark/batchDelete', {
            ids: ids.join(',')
          }).then(res => {
            if (res.length > 9) {
              this.$notify({
                title: '提示',
                message: res,
                duration: 0
              })
            } else {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.getList()
          })
        } else {
          this.$message({
            message: '请勾选智能柜',
            type: 'error'
          })
        }
      },

      // 门店过滤器
      storeFormat(row) {
        let name = ''
        this.storeList.map(value => {
          if (value.id == row.storeId) {
            name = value.name
          }
        })
        return name
      },

      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

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

<template>
  <div>
    <!--查询条件-->
    <el-row :gutter="5">
      <el-col :span="9">
        <span>所属门店：</span>
        <el-select v-model="selectValue" placeholder="请选择" style="width: 16vw" size="small">
          <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="handleModify(false)">新增账号</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除账号</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="storeName" label="所属门店"></el-table-column>
      <el-table-column prop="owner" label="账号使用者"></el-table-column>
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="comment" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onPermission">权限设置</el-button>
          <el-button size="mini" type="primary" @click="handleModify(true,scope.row)">修改</el-button>
          <el-popover
            placement="top"
            width="160"
            :ref="scope.$index">
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
    <pagingDevice
      :pageData.sync="pageData"
      @changePage="changePage"></pagingDevice>

    <!--新增、修改账号-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <!--账号信息-->
      <el-row>
          <el-col :span="4" :offset="2">所属门店：</el-col>
          <el-col :span="18">
            <el-select v-model="dialog.selectValue" placeholder="请选择" style="width: 80%">
              <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
      <el-row>
          <el-col :span="4" :offset="2">卡名称：</el-col>
          <el-col :span="18">
            <el-input v-model="dialog.cardName" style="width: 80%" size="small"></el-input>
          </el-col>
        </el-row>
      <el-row>
          <el-col :span="4" :offset="2">用户名：</el-col>
          <el-col :span="18">
            <el-input v-model="dialog.sellPrice" style="width: 80%" size="small"></el-input>
          </el-col>
        </el-row>
      <el-row>
          <el-col :span="4" :offset="2">密码：</el-col>
          <el-col :span="18">
            <el-input v-model="dialog.cardPrice" style="width: 80%" size="small"></el-input>
          </el-col>
        </el-row>
      <el-row>
          <el-col :span="4" :offset="2">手机号：</el-col>
          <el-col :span="18">
            <el-input v-model="dialog.phone" style="width: 80%" size="small"></el-input>
          </el-col>
        </el-row>
      <el-row>
          <el-col :span="4" :offset="2">备注：</el-col>
          <el-col :span="18">
            <el-input  type="textarea" :rows="2" placeholder="请输入内容" v-model="input" style="width:80%"></el-input>
          </el-col>
        </el-row>

      <!--权限设置-->
      <el-row>
        <el-col :span="3" :offset="10">
          <el-button type="primary" size="small" plain @click="onPermission">权限设置</el-button>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="isShow = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--权限设置-->
    <el-dialog title="权限设置" :visible.sync="isSetting">
      <el-table ref="multipleTable" :data="innerTableData" tooltip-effect="dark" border
                @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="100" align="center"></el-table-column>
        <el-table-column label="序号" type="index" width="150" align="center"></el-table-column>
        <el-table-column prop="features" label="功能" align="center"></el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isSetting = false">取 消</el-button>
        <el-button type="primary" @click="isSetting = false">确 定</el-button>
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
        selectValue: '',
        selectOptions: [{
          label: 'aa',
          value: 'aa'
        }],
        tableData: [{}],
        loading: '',
        newOrChange: '',
        isShow: false,
        dialog: {
          selectValue: '',
          cardName: '',
          sellPrice: '',
          cardPrice: '',
          phone: ''
        },
        innerTableData: [],
        isSetting: false,
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        }
      }
    },
    methods: {
      handleModify(type) {
        this.isShow = true;
        if(type == 1){
          this.newOrChange = '修改账户'
        }else {
          this.newOrChange = '新增账户'
        }
      },
      allDelete() {},
      handleSelectionChange() {},
      handleClose(id) {
        this.$refs[id].doClose()
      },
      onPermission() {
        this.isSetting = true
      },
      changePage() {}
    },
    mounted: function () {

    }
  }
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 30px;
}
</style>

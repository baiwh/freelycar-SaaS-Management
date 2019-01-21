<template>
  <div>
    <!--查询条件-->
    <el-row>
      <el-col :span="10">门店名称：
        <el-input v-model="input" size="small" style="width: 16vw"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="handleModify(false)">新增门店</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除门店</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="storeName" label="门店名称"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="owner" label="联系人"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="comment" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="删除" width="75">
        <template slot-scope="scope">
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
      <el-table-column label="修改" width="75">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(true,scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="上移" width="75">
        <template slot-scope="scope">
          <el-button size="mini" type="primary">上移</el-button>
        </template>
      </el-table-column>
      <el-table-column label="下移" width="75">
        <template slot-scope="scope">
          <el-button size="mini" type="primary">下移</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <el-row style="height: 82px">
      <pagingDevice
        :pageData.sync="pageData"
        @changePage="changePage"></pagingDevice>
    </el-row>


    <!--默认列表按钮-->
    <el-row>
      <el-col :span="4">
        <el-popover
          placement="bottom"
          width="200"
          v-model="show">
          <p>发布新列表并覆盖列表？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="show = false">取消</el-button>
            <el-button type="primary" size="mini" @click="show = false">确定</el-button>
          </div>
          <el-button size="small" type="primary" slot="reference" plain>默认列表</el-button>
        </el-popover>
      </el-col>
    </el-row>


    <!--新增、修改门店弹框-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <el-row>
        <el-col :span="4" :offset="2">门店名称：</el-col>
        <el-col :span="18">
          <el-input v-model="input" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">门店地址：</el-col>
        <el-col :span="18">
          <el-input v-model="input" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">联系人：</el-col>
        <el-col :span="18">
          <el-input v-model="input" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">电话：</el-col>
        <el-col :span="18">
          <el-input v-model="input" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">备注：</el-col>
        <el-col :span="18">
          <el-input  type="textarea" :rows="2" placeholder="请输入内容" v-model="input" style="width:80%"></el-input>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="isShow = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'StoreManagement',
    data() {
      return {
        loading: '',
        input: '',
        tableData: [{}],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        newOrChange: '',
        isShow: false,
        show: false
      }
    },
    methods: {
      handleModify(type) {
        this.isShow = true;
        if(type === false) {
          this.newOrChange = "新增门店"
        }else {
          this.newOrChange = "修改门店"
        }
      },
      handleClose(id) {
        this.$refs[id].doClose()
      },
      handleDelete() {},
      changePage() {},
      allDelete() {},
      handleSelectionChange() {}
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

<template>
  <div>
    <!--查询条件-->
    <el-row :gutter="10">
      <el-col :span="10">智能柜序号:
        <el-input v-model="input" size="small" style="width: 16vw"></el-input>
      </el-col>
      <el-col :span="8">所属门店：
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
        <el-button type="primary" size="small" plain @click="handleModify(false)">新增智能柜</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除智能柜</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="storeName" label="所属门店"></el-table-column>
      <el-table-column prop="address" label="投放位置"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="comment" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
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

    <!--新增、修改智能柜弹框-->
    <el-dialog :title="newOrChange" :visible.sync="isShow">
      <el-row>
        <el-col :span="4" :offset="2">智能柜序号：</el-col>
        <el-col :span="18">
          <el-input v-model="input" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">所属门店：</el-col>
        <el-col :span="18">
          <el-select v-model="selectValue" placeholder="请选择" style="width: 27vw" size="small">
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">投放位置：</el-col>
        <el-col :span="18">
          <el-input v-model="input" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">规格：</el-col>
        <el-col :span="18">
          <el-select v-model="selectValue" placeholder="请选择" style="width: 27vw" size="small">
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
    name: 'IntelligentCabinet',
    data() {
      return {
        input: '',
        loading: '',
        selectValue: '',
        selectOptions: [{
          label: 'aa',
          value: 'aa'
        }],
        tableData: [{}],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        newOrChange: '',
        isShow: false
      }
    },
    methods: {
      handleModify(type) {
        this.isShow = true;
        if(type == false) {
          this.newOrChange = '新增智能柜'
        }else {
          this.newOrChange = '修改智能柜'
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

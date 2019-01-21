<template>
  <div>
    <!--表格-->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="comment" label="活动备注" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.comment" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="upLoad" label="活动图片上传" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.upLoad" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="activeLink" label="活动链接" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.activeLink" size="small"></el-input>
        </template>
      </el-table-column>
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

    <!--图片上传并预览-->
    <el-row>

    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4" :offset="10">
        <el-button type="primary" size="small" plain>保存并预览</el-button>
      </el-col>
      <el-col :span="4" :offset="4">
        <el-button type="primary" size="small" plain>发布</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'ActivityPropaganda',
    data() {
      return {
        loading: '',
        tableData: [{}],

      }
    },
    methods: {},
    mounted: function () {

    }
  }
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 30px;
}
</style>

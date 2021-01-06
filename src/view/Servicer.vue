<template>
  <div>
    <div v-show="tabShow">
      <!--查询条件-->
      <el-row>
        <el-col :span="10">
          服务商名称：
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
      <el-table
        ref="multipleTable"
        :data="serviceProviderList"
        tooltip-effect="dark"
        border
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="name" label="服务商名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column label="网点管理">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="toTabs('storeSelect',scope.row)">网点选择</el-button>
          </template>
        </el-table-column>
        <el-table-column label="服务管理">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="toTabs('serviceManagement',scope.row)"
            >服务管理</el-button>
          </template>
        </el-table-column>
        <el-table-column label="技师管理">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="toTabs('technicianManagement',scope.row)"
            >技师管理</el-button>
          </template>
        </el-table-column>
        <el-table-column label="删除" width="85">
          <template slot-scope="scope">
            <el-popover placement="top" width="160" :ref="`'service'+${scope.row.id}`">
              <p>确定删除服务商？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="handleClose(`'service'+${scope.row.id}`)">取消</el-button>
                <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
              </div>
            </el-popover>
            <el-button size="mini" v-popover="`'service'+${scope.row.id}`" type="danger">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="修改" width="85">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleModify(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="服务状态">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleModify(scope.row)">服务中</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页器-->
      <el-row style="height: 82px">
        <pagingDevice :pageData.sync="servicePageData" @changePage="getList"></pagingDevice>
      </el-row>

      <!--新增、修改网点弹框-->
      <el-dialog :title="newOrChange" :visible.sync="isShow">
        <el-form
          :model="serviceProviderInfo"
          :rules="rules"
          ref="serviceProviderInfo"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="服务商名称：" prop="name">
            <el-input v-model="serviceProviderInfo.name" style="width: 80%" size="small"></el-input>
          </el-form-item>
          <el-form-item label="服务商地址：" prop="address">
            <el-input v-model="serviceProviderInfo.address" style="width: 80%" size="small"></el-input>
          </el-form-item>
          <el-autocomplete
            v-model="mapLocation.address"
            :fetch-suggestions="querySearch"
            placeholder="请输入服务商地址"
            style="width: 100%"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
          <baidu-map
            class="map"
            :center="mapCenter"
            :zoom="mapZoom"
            :scroll-wheel-zoom="true"
            @ready="handlerBMap"
          >
            <!--缩放-->
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
            <!--定位-->
            <bm-geolocation
              anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
              :showAddressBar="true"
              :autoLocation="true"
            ></bm-geolocation>
          </baidu-map>
          <el-form-item label="经度（lng）：" prop="addressLng">
            <el-input v-model="serviceProviderInfo.addressLng" style="width: 80%" size="small"></el-input>
          </el-form-item>
          <el-form-item label="纬度（lat）：" prop="addressLat">
            <el-input v-model="serviceProviderInfo.addressLat" style="width: 80%" size="small"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phone">
            <el-input
              type="number"
              v-model.number="serviceProviderInfo.phone"
              style="width: 80%"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="comment">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="serviceProviderInfo.comment"
              style="width:80%"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="isShow = false">取 消</el-button>
            <el-button type="primary" @click="storeSubmit">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 服务管理技师管理板块 -->
    <div v-show="!tabShow">
      <el-row>
        <el-col :span="10">当前服务商：{{servicer}}</el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="服务管理" name="serviceManagement">
          <el-row>
            <el-col :span="10">
              服务项目：
              <el-input size="small" style="width: 16vw"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" size="small" @click="getList">查询</el-button>
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="4">
              <el-button type="primary" size="small" plain @click="addItem">新增服务项目</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" plain>删除服务项目</el-button>
            </el-col>
          </el-row>
          <el-table
            ref="multipleTable"
            :data="serviceItemList"
            tooltip-effect="dark"
            border
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column prop="name" label="服务项目" show-overflow-tooltip></el-table-column>
            <el-table-column prop="price" label="项目价格"></el-table-column>
            <el-table-column label="删除">
              <template slot-scope="scope">
                <el-popover placement="top" width="160" :ref="`'item'+${scope.row.id}`">
                  <p>确定删除该服务项目？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="handleClose(`'item'+${scope.row.id}`)">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDeleteItem(scope.row)">确定</el-button>
                  </div>
                </el-popover>
                <el-button size="mini" v-popover="`'item'+${scope.row.id}`" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="height: 82px">
            <pagingDevice :pageData.sync="itemPageData"></pagingDevice>
          </el-row>
        </el-tab-pane>
        <!-- 技师管理 -->
        <el-tab-pane label="技师管理" name="technicianManagement">
          <el-row>
            <el-col :span="10">
              网点：
              <el-select
              filterable
              v-model="technician.serviceStore"
              placeholder="请选择或输入查找"
              style="width: 20vw"
              size="small"
            >
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" size="small" @click="getList">查询</el-button>
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="4">
              <el-button type="primary" size="small" plain @click="addTechnician">新增技师</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" plain>删除技师</el-button>
            </el-col>
          </el-row>
          <el-table
            ref="multipleTable"
            :data="TechnicianList"
            tooltip-effect="dark"
            border
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="序号" type="index" width="85"></el-table-column>
            <el-table-column prop="name" label="姓名" width="85" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="serviceStore" label="服务网点"></el-table-column>
            <el-table-column prop="commit" label="备注"></el-table-column>
            <el-table-column label="修改" width="85">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleModifyTechnician(scope.row)">修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="删除" width="85">
              <template slot-scope="scope">
                <el-popover placement="top" width="160" :ref="scope.row.id">
                  <p>确定删除该技师？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="handleClose(scope.row.id)">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDeleteItem(scope.row)">确定</el-button>
                  </div>
                </el-popover>
                <el-button size="mini" v-popover="scope.row.id" type="danger">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column label="技师功能" width="85">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleModify(scope.row)">开启</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="height: 82px">
            <pagingDevice :pageData.sync="technicianPageData"></pagingDevice>
          </el-row>
        </el-tab-pane>
        <!-- 网点选择 -->
        <el-tab-pane label="网点选择" name="storeSelect">
          <el-row>
            <el-col :span="10">
              网点名称：
              <el-select
              filterable
              clearable
              v-model="storeName"
              placeholder="请选择或输入查找"
              style="width: 20vw"
              size="small"
            >
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" size="small" @click="getNameStore">查询</el-button>
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="4">
              <el-button type="primary" size="small" plain >开启智能柜服务</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" plain>取消智能柜服务</el-button>
            </el-col>
          </el-row>
          <el-table
            ref="multipleTable"
            :data="serviceStoreList"
            tooltip-effect="dark"
            border
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="序号" type="index" width="85"></el-table-column>
            <el-table-column prop="name" label="网点名称"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="address" label="网点地址"></el-table-column>
            <el-table-column label="智能柜服务">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleModify(scope.row)">开启</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="height: 82px">
            <pagingDevice :pageData.sync="pageData" @changePage="getNameStore"></pagingDevice>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <!-- 新增项目弹窗 -->
      <el-dialog title="新增服务项目" :visible.sync="itemShow">
        <el-form :rules="itemrules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="服务项目" prop="item">
            <el-input
              v-model="serviceItem.itme"
              placeholder="请输入项目"
              style="width: 80%"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目价格" prop="price">
            <el-input
              v-model="serviceItem.price"
              placeholder="请输入项目价格"
              style="width: 80%"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="itemShow = false">取 消</el-button>
            <el-button type="primary" @click="additemSubmit">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新增修改技师 -->
      <el-dialog :title="technicianTitle" :visible.sync="technicianShow">
        <el-form :rules="technicianrules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="technician.name"
              placeholder="请输入姓名"
              style="width: 80%"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="technician.phone"
              placeholder="请输入手机号"
              style="width: 80%"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="technician.password"
              placeholder="请设置密码"
              style="width: 80%"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="服务网点" prop="serviceStore">
            <el-select
              filterable
              v-model="technician.serviceStore"
              placeholder="请选择或输入查找"
              style="width: 27vw"
              size="small"
            >
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="technician.commit" style="width: 80%" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="itemShow = false">取 消</el-button>
            <el-button type="primary" @click="addTechnicianSubmit">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "Servicer",
  data() {
    return {
      loading: "",
      serviceProviderName: "",
      serviceProviderList: [
        { name: "测试", phone: 123, address: 123, id: 1 },
        { name: "测试2", phone: 123, address: 123, id: 2},
      ],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
      },
      itemrules: {
        item: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入项目价格", trigger: "blur" }],
      },
      technicianrules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        serviceStore: [
          { required: true, message: "请选择服务网点", trigger: "blur" },
        ],
      },
      pageData: {
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      servicePageData:{
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      itemPageData:{
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      technicianPageData:{
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      serviceProviderInfo: {
        id: "",
        name: "",
        address: "",
        phone: "",
        comment: "",
        addressLng: "",
        addressLat: "",
      },
      multipleSelection: [],
      newOrChange: "",
      isShow: false,
      show: false,
      mapZoom: 15,
      mapCenter: { lng: 0, lat: 0 },
      mapLocation: {
        address: undefined,
        coordinate: undefined,
      },
      tabShow: true,
      activeName: "technicianManagement",
      //服务项目
      serviceItemList: [
        { id:1,name: "普洗", price: 25, },
        { id:2,name: "精洗", price: 36,},
      ],
      //从服务器获取的技师列表
      TechnicianList: [
        {
          id: 1,
          name: "李四",
          phone: "123",
          serviceStore: "演示网点",
          commit: "测试",
        },
        {
          id: 2,
          name: "张三",
          phone: "123",
          serviceStore: "测试网点",
          commit: "测试",
        },
      ],
      technician:{
        name:'',
        phone:'',
        serviceStore:'',
        commit:'',
      },
      itemShow: false,
      technicianShow: false,
      technicianTitle:'',
      serviceItem: {},
      //当前选择的服务商
      servicer: "",
      //网点列表
      storeList: [],
      //带服务商的服务网点
      serviceStoreList:[],
      //查询网点
      storeName:'',
    };
  },
  methods: {
    // 获取服务商列表
    getList() {
      //   this.$get("接口重写", {
      //     name: this.serviceProviderName,
      //     currentPage: this.pageData.currentPage,
      //     pageSize: this.pageData.pageSize,
      //   }).then((res) => {
      //     this.loading = false;
      //     this.serviceProviderList = res.data;
      //     this.pageData.currentPage = res.currentPage;
      //     this.pageData.pageSize = res.pageSize;
      //     this.pageData.pageTotal = res.total;
      //   });
      console.log("获取数据");
    },

    // 新增 打开模态框
    addNew() {
      this.isShow = true;
      this.newOrChange = "新增服务商";
      this.serviceProviderInfo = {
        id: "",
        name: "",
        address: "",
        phone: "",
        comment: "",
        addressLng: "",
        addressLat: "",
      };
    },

    // 修改 模态框
    handleModify(row) {
      this.isShow = true;
      this.newOrChange = "修改服务商";
      this.serviceProviderInfo = { ...row };
    },
    //定位

    // 提交新增、修改
    storeSubmit(formName) {
      console.log(formName);
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       this.isShow = false;
      //       this.$post("接口重写", {
      //         id: this.serviceProviderInfo.id,
      //         name: this.serviceProviderInfo.name,
      //         address: this.serviceProviderInfo.address,
      //         phone: this.serviceProviderInfo.phone,
      //         comment: this.serviceProviderInfo.comment,
      //         addressLng: this.serviceProviderInfo.addressLng,
      //         addressLat: this.serviceProviderInfo.addressLat,
      //       }).then((res) => {
      //         this.$message({
      //           message: "提交成功",
      //           type: "success",
      //         });
      //         this.getList();
      //       });
      //     } else {
      //       console.log("error submit!!");
      //       return false;
      //     }
      //   });
    },

    // 关闭提示小窗口
    handleClose(id) {
      console.log(id)
      this.$refs[id].doClose();
    },

    // 删除单个
    handleDelete(row) {
      // this.$get("接口", {
      //   id: row.id,
      // }).then((res) => {
      //   this.$message({
      //     message: "删除成功",
      //     type: "success",
      //   });
      //   this.getList();
      // });
      alert("删除" + row.name);
    },

    // 批量删除
    allDelete() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.id);
      });
      if (this.multipleSelection.length > 0) {
        this.$post("/serviceProvider/batchDelete", {
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
          message: "请勾选服务商",
          type: "error",
        });
      }
    },

    // 多选功能
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlerBMap({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      if (this.mapLocation.coordinate && this.mapLocation.coordinate.lng) {
        this.mapCenter.lng = this.mapLocation.coordinate.lng;
        this.mapCenter.lat = this.mapLocation.coordinate.lat;
        this.mapZoom = 15;
        map.addOverlay(new this.BMap.Marker(this.mapLocation.coordinate));
      } else {
        this.mapCenter.lng = 118.897576;
        this.mapCenter.lat = 32.09661;
        this.mapZoom = 10;
      }
    },
    querySearch(queryString, cb) {
      var that = this;
      var myGeo = new this.BMap.Geocoder();
      myGeo.getPoint(
        queryString,
        function (point) {
          if (point) {
            that.mapLocation.coordinate = point;
            that.makerCenter(point);
          } else {
            that.mapLocation.coordinate = null;
          }
        },
        this.locationCity
      );
      var options = {
        onSearchComplete: function (results) {
          if (local.getStatus() === 0) {
            // 判断状态是否正确
            var s = [];
            for (var i = 0; i < results.getCurrentNumPois(); i++) {
              var x = results.getPoi(i);
              var item = { value: x.address + x.title, point: x.point };
              s.push(item);
              cb(s);
            }
          } else {
            cb();
          }
        },
      };
      var local = new this.BMap.LocalSearch(this.map, options);
      local.search(queryString);
    },
    handleSelect(item) {
      var { point } = item;
      this.serviceProviderInfo.address = item.value;
      this.serviceProviderInfo.addressLng = point.lng;
      this.serviceProviderInfo.addressLat = point.lat;
      console.log(item);
      this.mapLocation.coordinate = point;

      this.makerCenter(point);
    },
    makerCenter(point) {
      if (this.map) {
        this.map.clearOverlays();
        this.map.addOverlay(new this.BMap.Marker(point));
        this.mapCenter.lng = point.lng;
        this.mapCenter.lat = point.lat;
        this.mapZoom = 15;
      }
    },
    //跳转至标签页
    toTabs(tab, row) {
      this.tabShow = !this.tabShow;
      this.activeName = tab;
      this.servicer = row.name;
      console.log(row);
    },
    //技师管理等操作
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleDeleteItem(row) {
      console.log(row);
    },
    addItem() {
      this.itemShow = true;
    },
    //提交添加的项目
    additemSubmit() {
      console.log("提交添加的项目");
    },
    //新增技师
    addTechnician() {
      this.technicianShow = true;
      this.technicianTitle="新增技师";
      this.technician={
        name:'',
        phone:'',
        serviceStore:'',
        commit:'',
      }
    },
    //提交新增或修改的技师
    addTechnicianSubmit(){
      console.log("提交新增的技师")
    },
    // 修改技师
    handleModifyTechnician(row){
      console.log(row)
      this.technicianShow=true;
      this.technicianTitle="修改技师";
      this.technician={...row}
    },
    // 获取所有网点列表
    getStoreList() {
      this.$get("/store/list", {
        name:'',
        currentPage: 1,
        pageSize: 200,
      }).then((res) => {
        this.storeList = res.data;
        //要修改的
      });
    },
    //根据name或者页码获取网点
    getNameStore(){
      console.log(this.storeName);
      this.$get("/store/list", {
        name:this.storeName,
        currentPage: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
      }).then((res) => {
        this.serviceStoreList = res.data;
        this.pageData.currentPage = res.currentPage;
        this.pageData.pageSize = res.pageSize;
        this.pageData.pageTotal = res.total;
      });
    }
  },
  mounted: function () {
    this.getList();
    this.getStoreList();
    this.getNameStore();
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 30px;
}
.map {
  width: 100%;
  height: 300px;
}
</style>

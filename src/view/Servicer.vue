<template>
  <div class="minwidth">
    <!-- 服务商列表模块 -->
    <div v-show="tabShow" >
      <!--查询条件-->
      <el-row>
        <el-col :span="8">
          服务商名称：
          <el-input
            v-model="serviceProviderName"
            size="small"
            style="width: 16vw"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="small" @click="getList"
            >查询</el-button
          >
        </el-col>
      </el-row>

      <!--两个按钮-->
      <el-row :gutter="30">
        <el-col :span="4">
          <el-button type="primary" size="small" plain @click="addNew"
            >新增服务商</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" plain @click="allDelete"
            >删除服务商</el-button
          >
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
        <el-table-column label="序号" type="index">
          <template slot-scope="scope">
            <span>{{
              scope.$index +
              (servicePageData.currentPage - 1) * servicePageData.pageSize +
              1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="服务商名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column label="网点管理">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="toTabs('storeSelect', scope.row)"
              >网点选择</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="服务管理">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="toTabs('serviceManagement', scope.row)"
              >服务管理</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="技师管理">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="toTabs('technicianManagement', scope.row)"
              >技师管理</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="删除" width="85">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="160"
              :ref="`'service'+${scope.row.id}`"
            >
              <p>确定删除服务商？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleClose(`'service'+${scope.row.id}`)"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleDelete(scope.row)"
                  >确定</el-button
                >
              </div>
            </el-popover>
            <el-button
              size="mini"
              v-popover="`'service'+${scope.row.id}`"
              type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="修改" width="85">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleModify(scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="服务状态">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :class="{ active: scope.row.serviceStatus }"
              @click="changeServiceStatus(scope.row)"
              >{{
                scope.row.serviceStatus == true ? "关闭服务" : "开启服务"
              }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--分页器-->
      <el-row style="height: 82px">
        <pagingDevice
          :pageData.sync="servicePageData"
          @changePage="getList"
        ></pagingDevice>
      </el-row>

      <!--新增、修改网点弹框-->
      <el-dialog :title="newOrChange" :visible.sync="isShow" @close="closeShow">
        <el-form
          :model="serviceProviderInfo"
          :rules="rules"
          ref="serviceProviderInfo"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="服务商名称：" prop="name">
            <el-input
              v-model="serviceProviderInfo.name"
              style="width: 80%"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="服务商地址：" prop="address">
            <el-input
              v-model="serviceProviderInfo.address"
              style="width: 80%"
              size="small"
            ></el-input>
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
            <el-input
              v-model="serviceProviderInfo.longitude"
              style="width: 80%"
              size="small"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度（lat）：" prop="addressLat">
            <el-input
              v-model="serviceProviderInfo.latitude"
              style="width: 80%"
              size="small"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phone">
            <el-input
              type="number"
              @mousewheel.native.prevent
              @DOMMouseScroll.native.prevent
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
              style="width: 80%"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="closeShow">取 消</el-button>
            <el-button
              type="primary"
              @click="serviceSubmit('serviceProviderInfo')"
              >确 定</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 服务、技师、网点管理板块 -->
    <div v-show="!tabShow">
      <!-- 所选服务商 -->
      <el-row>
        <el-col :span="10">当前服务商：{{ servicer }}</el-col>
        <el-col :span="11">
          <el-button type="primary" size="small" @click="returnServicer"
            >服务商列表</el-button
          >
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 服务管理模块 -->
        <el-tab-pane label="服务管理" name="serviceManagement">
          <el-row>
            <el-col :span="10">
              服务项目：
              <el-input
                size="small"
                style="width: 16vw"
                v-model="projectName"
              ></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" size="small" @click="getItemList"
                >查询</el-button
              >
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="4">
              <el-button type="primary" size="small" plain @click="addItem"
                >新增服务项目</el-button
              >
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" plain @click="deleteItem"
                >删除服务项目</el-button
              >
            </el-col>
          </el-row>
          <el-table
            ref="multipleTable"
            :data="serviceItemList"
            tooltip-effect="dark"
            border
            @selection-change="handleSelectionChange"
            v-loading="loading"
            :default-sort="{ prop: 'sort', order: 'ascending' }"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column
              prop="name"
              label="服务项目"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="price" label="项目价格"></el-table-column>
            <el-table-column prop="comment" label="备注"></el-table-column>
            <el-table-column v-if="false" prop="sort" label="序号">
            </el-table-column>
            <el-table-column label="修改">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="modifyitem(scope.row)"
                >
                  修改
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="删除">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="160"
                  :ref="`'item'+${scope.row.id}`"
                >
                  <p>确定删除该服务项目？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="handleClose(`'item'+${scope.row.id}`)"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleDeleteItem(scope.row)"
                      >确定</el-button
                    >
                  </div>
                </el-popover>
                <el-button
                  size="mini"
                  v-popover="`'item'+${scope.row.id}`"
                  type="danger"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  :disabled="scope.row.sort === 10"
                  size="mini"
                  type="primary"
                  @click="upLayer(scope.$index, scope.row)"
                  >上移</el-button
                >
                <el-button
                  :disabled="
                    scope.$index +
                      (itemPageData.currentPage - 1) * itemPageData.pageSize +
                      1 ===
                    itemPageData.pageTotal
                  "
                  size="mini"
                  type="primary"
                  @click.native.prevent="downLayer(scope.$index, scope.row)"
                  >下移</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-row style="height: 82px">
            <pagingDevice :pageData.sync="itemPageData"></pagingDevice>
          </el-row>
        </el-tab-pane>
        <!-- 技师管理模块 -->
        <el-tab-pane label="技师管理" name="technicianManagement">
          <el-row>
            <el-col :span="10">
              网点：
              <el-select
                filterable
                v-model="serviceStore"
                placeholder="请选择或输入查找"
                style="width: 20vw"
                size="small"
                clearable
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
              <el-button type="primary" size="small" @click="getTechnicianList"
                >查询</el-button
              >
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="4">
              <el-button
                type="primary"
                size="small"
                plain
                @click="addTechnician"
                >新增技师</el-button
              >
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                size="small"
                plain
                @click="deleteTechnicians"
                >删除技师</el-button
              >
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
            <el-table-column
              label="序号"
              type="index"
              width="85"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="85"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column label="服务网点">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.stores" :key="index">
                  <span>{{ item.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="备注"></el-table-column>
            <el-table-column label="修改" width="85">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleModifyTechnician(scope.row)"
                  >修改</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="删除" width="85">
              <template slot-scope="scope">
                <el-popover placement="top" width="160" :ref="scope.row.id">
                  <p>确定删除该技师？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="handleClose(scope.row.id)"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleDeleteTechnician(scope.row)"
                      >确定</el-button
                    >
                  </div>
                </el-popover>
                <el-button size="mini" v-popover="scope.row.id" type="danger"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="技师功能" width="85">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openOrCloseTechnician(scope.row)"
                  :class="{ active: scope.row.isArk }"
                  >{{ scope.row.isArk ? "关闭" : "开启" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-row style="height: 82px">
            <pagingDevice :pageData.sync="technicianPageData"></pagingDevice>
          </el-row>
        </el-tab-pane>
        <!-- 网点管理模块 -->
        <el-tab-pane label="网点选择" name="storeSelect">
          <el-row>
            <el-col :span="10">
              网点名称：
              <el-select
                filterable
                clearable
                v-model="storeName"
                placeholder="请选择或输入查找"
                @selection-change="handleSelectionChange"
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
              <el-button type="primary" size="small" @click="getNameStore"
                >查询</el-button
              >
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="4">
              <el-button
                type="primary"
                size="small"
                plain
                @click="allOpenServiceArk"
                >开启智能柜服务</el-button
              >
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                size="small"
                plain
                @click="allCloseServiceArk"
                >取消智能柜服务</el-button
              >
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
            <el-table-column label="序号" type="index" width="85">
              <template slot-scope="scope">
                <span>{{
                  scope.$index +
                  (pageData.currentPage - 1) * pageData.pageSize +
                  1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="网点名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="address" label="网点地址"></el-table-column>
            <el-table-column label="智能柜服务">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  :class="{ active: scope.row.isArk }"
                  @click="openServiceArk(scope.row)"
                  >{{ scope.row.isArk == false ? "开启" : "关闭" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-row style="height: 82px">
            <pagingDevice
              :pageData.sync="pageData"
              @changePage="getNameStore"
            ></pagingDevice>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <!-- 新增项目弹窗 -->
      <el-dialog title="新增服务项目" :visible.sync="itemShow">
        <el-form
          :model="serviceItem"
          :rules="itemrules"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="服务项目" prop="name">
            <el-input
              v-model="serviceItem.name"
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
          <el-form-item label="备注" prop="commet">
            <el-input
              v-model="serviceItem.comment"
              style="width: 80%"
              size="small"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="itemShow = false">取 消</el-button>
            <el-button type="primary" @click="additemSubmit">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新增、修改技师弹窗 -->
      <el-dialog :title="technicianTitle" :visible.sync="technicianShow">
        <el-form
          :model="technician"
          :rules="technicianrules"
          ref="technician"
          label-width="150px"
          class="demo-ruleForm"
        >
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
              type="number"
              @mousewheel.native.prevent
              @DOMMouseScroll.native.prevent
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
          <el-form-item label="服务网点">
            <el-select
              v-model="technicianserviceStore"
              multiple
              placeholder="请选择或输入查找"
              style="width: 27vw"
              size="small"
              value-key="id"
            >
              <el-option
                v-for="item in serviceStoreSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="technician.comment"
              style="width: 80%"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="technicianShow = false">取 消</el-button>
            <el-button type="primary" @click="addTechnicianSubmit('technician')"
              >确 定</el-button
            >
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
    var checkData = (rule, value, callback) => {
      if (value) {
        if (/[^\w\.\/]/gi.test(value)) {
          callback(new Error("请不要输入中文和空格！"));
        } else {
          callback();
        }
      }
      callback();
    };
    return {
      loading: "",
      serviceProviderName: "",
      serviceProviderList: [],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
      },
      itemrules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入项目价格", trigger: "blur" }],
      },
      technicianrules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkData, trigger: "blur" },
        ],
        serviceStore: [
          { required: true, message: "请选择服务网点", trigger: "blur" },
        ],
      },
      pageData: {
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      servicePageData: {
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      itemPageData: {
        currentPage: 1,
        pageSize: 10,
        pageTotal: 100,
      },
      technicianPageData: {
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
        longitude: "",
        latitude: "",
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
      serviceItemList: [],
      //从服务器获取的技师列表
      TechnicianList: [],
      serviceStore: "",
      technician: {
        name: "",
        phone: "",
        serviceStore: [],
        commit: "",
        password: "",
      },
      itemShow: false,
      technicianShow: false,
      technicianTitle: "",
      serviceItem: {
        name: "",
        price: "",
        comment: "",
      },
      //当前选择的服务商
      servicer: "",
      //网点列表
      storeList: [],
      //带服务商的服务网点
      serviceStoreList: [],
      //服务商所选择的服务网点
      serviceStoreSelectList: [],
      //查询网点
      storeName: "",
      rspId: "",
      technicianserviceStore: [],
      projectName: "",
    };
  },
  methods: {
    //服务商功能模块
    // 获取服务商列表
    getList() {
      this.$get("/sp/list", {
        name: this.serviceProviderName,
        currentPage: this.servicePageData.currentPage,
        pageSize: this.servicePageData.pageSize,
      }).then((res) => {
        console.log(res);
        this.loading = false;
        this.serviceProviderList = res.data;
        this.servicePageData.currentPage = res.currentPage;
        this.servicePageData.pageSize = res.pageSize;
        this.servicePageData.pageTotal = res.total;
      });
      console.log("获取数据");
    },
    //修改服务商服务状态
    changeServiceStatus(row) {
      //改变服务状态
      this.$get("/sp/changeServiceStatus", {
        id: row.id,
      }).then((res) => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.getList();
      });
    },

    // 服务商新增 打开模态框
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
    serviceSubmit(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isShow = false;
          this.$post("/sp/modify", {
            id: this.serviceProviderInfo.id,
            name: this.serviceProviderInfo.name,
            address: this.serviceProviderInfo.address,
            phone: this.serviceProviderInfo.phone,
            comment: this.serviceProviderInfo.comment,
            longitude: this.serviceProviderInfo.longitude,
            latitude: this.serviceProviderInfo.latitude,
            createdTime: this.serviceProviderInfo.createdTime,
            serviceStatus: this.serviceProviderInfo.serviceStatus,
          }).then((res) => {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.getList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeShow() {
      this.isShow = false;
      this.mapLocation.address = "";
    },

    // 关闭提示小窗口
    handleClose(id) {
      console.log(id);
      this.$refs[id].doClose();
    },

    // 删除单个
    handleDelete(row) {
      this.$post("/sp/delete", [row.id]).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.$refs[`'service'+${row.id}`].doClose();
        this.getList();
      });
    },

    // 批量删除
    allDelete() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.id);
      });
      if (this.multipleSelection.length > 0) {
        this.$post("/sp/delete", ids).then((res) => {
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
      console.log(val);
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
      // this.serviceProviderInfo.address = item.value;
      this.serviceProviderInfo.longitude = point.lng;
      this.serviceProviderInfo.latitude = point.lat;
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
    //服务、网点、技师模块
    //跳转至标签页
    toTabs(tab, row) {
      this.tabShow = !this.tabShow;
      this.activeName = tab;
      this.rspId = row.id;
      this.getNameStore();
      this.getTechnicianList();
      this.getItemList();
      this.servicer = row.name;
      console.log(row);
    },
    //技师管理等操作
    handleClick(tab, event) {
      this.multipleSelection = [];
      // console.log(tab, event);
      console.log(this.multipleSelection);
    },
    //删除技师
    handleDeleteTechnician(row) {
      console.log(row);
      this.$post("/sp/staff/delete", [row.id]).then((res) => {
        console.log(res);
        this.$refs[row.id].doClose();
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getTechnicianList();
      });
    },

    deleteTechnicians() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.id);
      });
      if (this.multipleSelection.length > 0) {
        this.$post("/sp/staff/delete", ids).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getTechnicianList();
        });
      } else {
        this.$message({
          message: "请勾选技师",
          type: "error",
        });
      }
    },
    //开启关闭智能柜技师智能柜服务
    openOrCloseTechnician(row) {
      //关闭
      if (row.isArk) {
        this.$get("/sp/staff/closeArk", {
          id: row.id,
        }).then((res) => {
          this.$message({
            message: "关闭成功",
            type: "success",
          });
          this.getTechnicianList();
        });
      } else {
        this.$get("/sp/staff/openArk", {
          id: row.id,
        }).then((res) => {
          console.log(res);
          this.$message({
            message: "开启成功",
            type: "success",
          });
          this.getTechnicianList();
        });
      }
    },
    //新增技师
    addTechnician() {
      this.technicianShow = true;
      this.technicianTitle = "新增技师";
      this.technicianserviceStore = [];
      this.technician = {
        name: "",
        phone: "",
        serviceStore: [],
        commit: "",
        password: "",
      };
      // 服务商已选网点
      this.$get("/sp/store/listStore", {
        rspId: this.rspId,
      }).then((res) => {
        console.log(res);
        this.serviceStoreSelectList = res;
      });
    },
    //提交新增或修改的技师
    addTechnicianSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //stores数据处理
          var stores = [];
          for (var i in this.technicianserviceStore) {
            stores.push({ id: this.technicianserviceStore[i] });
          }
          this.technicianShow = false;
          this.$post("/sp/staff/modify", {
            name: this.technician.name,
            phone: this.technician.phone,
            comment: this.technician.comment,
            id: this.technician.id,
            password: this.technician.password,
            stores,
            rspId: this.rspId,
            position: this.technician.position,
            level: this.technician.level,
          }).then((res) => {
            console.log(res);
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.getTechnicianList();
          });
        }
      });
    },
    // 修改技师
    handleModifyTechnician(row) {
      console.log(row);
      this.technicianShow = true;
      this.technicianTitle = "修改技师";
      this.technician = { ...row };
      console.log(row);
      console.log(this.technicianserviceStore)
      this.technicianserviceStore =[];
      for (let i in row.stores) {
        this.technicianserviceStore.push(row.stores[i].id);
      }
      // 服务商已选网点
      this.$get("/sp/store/listStore", {
        rspId: this.rspId,
      }).then((res) => {
        console.log(res);
        this.serviceStoreSelectList = res;
      });
    },
    // 获取所有网点列表
    getStoreList() {
      this.$get("/store/list", {
        name: "",
        currentPage: 1,
        pageSize: 200,
      }).then((res) => {
        this.storeList = res.data;
        //要修改的
      });
    },
    //获取技师列表
    getTechnicianList() {
      console.log(this.rspId);
      console.log(this.serviceStore);
      this.$get("/sp/staff/list", {
        currentPage: this.technicianPageData.currentPage,
        pageSize: this.technicianPageData.pageSize,
        rspId: this.rspId,
        staffName: "",
        storeName: this.serviceStore,
      }).then((res) => {
        console.log(res);
        this.TechnicianList = res.data;
        this.technicianPageData.currentPage = res.currentPage;
        this.technicianPageData.pageSize = res.pageSize;
        this.technicianPageData.pageTotal = res.total;
      });
    },
    //网点功能模块
    //根据name或者页码获取网点
    getNameStore() {
      console.log(this.storeName);
      this.$get("/sp/store/list", {
        name: this.storeName,
        rspId: this.rspId,
        currentPage: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
      }).then((res) => {
        console.log(res.data);
        this.serviceStoreList = res.data;
        this.pageData.currentPage = res.currentPage;
        this.pageData.pageSize = res.pageSize;
        this.pageData.pageTotal = res.total;
      });
    },
    returnServicer() {
      this.tabShow = !this.tabShow;
    },
    // 开启关闭智能柜服务
    openServiceArk(row) {
      console.log(row.id);
      console.log(this.rspId);
      if (row.isArk) {
        //关闭
        this.$post("/sp/store/close?rspId=" + this.rspId, [row.id]).then(
          (res) => {
            this.$message({
              message: "关闭成功",
              type: "success",
            });
            this.getNameStore();
          }
        );
      } else {
        this.$post("/sp/store/open?rspId=" + this.rspId, [row.id]).then(
          (res) => {
            this.$message({
              message: "开启成功",
              type: "success",
            });
            this.getNameStore();
            console.log(res);
          }
        );
      }
    },
    //批量开启智能柜服务
    allOpenServiceArk() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.id);
      });
      if (this.multipleSelection.length > 0) {
        this.$post("/sp/store/open?rspId=" + this.rspId, ids).then((res) => {
          this.$message({
            message: "批量开启成功",
            type: "success",
          });
          this.getNameStore();
        });
      } else {
        this.$message({
          message: "请勾选网点",
          type: "error",
        });
      }
    },
    allCloseServiceArk() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.id);
      });
      if (this.multipleSelection.length > 0) {
        this.$post("/sp/store/close?rspId=" + this.rspId, ids).then((res) => {
          this.$message({
            message: "批量关闭成功",
            success: "success",
          });
          this.getNameStore();
        });
      } else {
        this.$message({
          message: "请勾选网点",
          type: "error",
        });
      }
    },
    //服务项目模块
    addItem() {
      this.serviceItem = {
        name: "",
        price: "",
        comment: "",
      };
      this.itemShow = true;
    },
    modifyitem(row) {
      this.serviceItem = { ...row };
      this.itemShow = true;
    },
    //提交添加的项目
    additemSubmit() {
      console.log("提交添加的项目");
      this.$post("/sp/project/modify", {
        rspId: this.rspId,
        id: this.serviceItem.id,
        name: this.serviceItem.name,
        price: this.serviceItem.price,
        comment: this.serviceItem.comment,
      }).then((res) => {
        this.$message({
          message: "请求成功",
          type: "success",
        });
        this.getItemList();
        this.itemShow = false;
      });
    },
    handleDeleteItem(row) {
      this.$post("/sp/project/delete", [row.id]).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getItemList();
      });
    },
    //多选删除服务项目
    deleteItem() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.id);
      });
      if (this.multipleSelection.length > 0) {
        this.$post("/sp/project/delete", ids).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getItemList();
        });
      } else {
        this.$message({
          message: "请勾选项目",
          type: "error",
        });
      }
    },
    //获取项目列表
    getItemList() {
      this.$get("/sp/project/list", {
        name: this.projectName,
        currentPage: this.itemPageData.currentPage,
        pageSize: this.itemPageData.pageSize,
        rspId: this.rspId,
      }).then((res) => {
        console.log(res);
        this.serviceItemList = res.data;
        this.itemPageData.currentPage = res.currentPage;
        this.itemPageData.pageSize = res.pageSize;
        this.itemPageData.pageTotal = res.total;
      });
    },
    //排序
    //排序
    //上移
    upLayer(index, row) {
      console.log(row);
      if (row.sort === 10) {
        this.$message({
          message: "处于顶端，不能继续上移",
          type: "warning",
        });
      } else {
        let param = {};
        param[row.id] = this.serviceItemList[index - 1].sort; //该行的网点id和sort
        param[this.serviceItemList[index - 1].id] = row.sort; //上一行数据的sort
        console.log(param);
        //访问后台接口传入两个调换的网点id和sort值有后台调换顺序，刷新数据
        this.switchLocation(param);
      }
    },
    // 下移
    downLayer(index, row) {
      if (
        index +
          (this.itemPageData.currentPage - 1) * this.itemPageData.pageSize +
          1 ===
        this.itemPageData.pageTotal
      ) {
        this.$message({
          message: "最后一个元素，不能下移",
          type: "warning",
        });
      } else {
        let param = {};
        param[row.id] = this.serviceItemList[index + 1].sort; //该行的网点id和下一行的sort
        param[this.serviceItemList[index + 1].id] = row.sort; //上一行数据的sort
        this.switchLocation(param);
      }
    },
    switchLocation(param) {
      console.log("移动");
      this.$post("/sp/project/switchLocation", param).then((res) => {
        this.$message({
          message: "移动成功",
          type: "success",
        });
        this.getItemList();
      });
    },
  },
  mounted: function () {
    this.getList();
    this.getStoreList();
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
.active {
  border: none;
  background-color: #f56c6c;
}
.minwidth{
  width : 100%;
  min-width: 1000px;
}
</style>

<template>
  <div>
    <div v-if="false">
      <el-table :data="tableData" :stripe='true' :fit='true' border style="width:100%" highlight-current-row>
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="name" label="昵称" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center"></el-table-column>
        <el-table-column prop="pwd" label="密码" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" align="center"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" align="center"></el-table-column>
        <!-- <el-table-column prop="enableState" label="用户状态" align="center"></el-table-column>
      <el-table-column prop="tradeState" label="交易状态" align="center"></el-table-column>-->
        <el-table-column label="操作" min-width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)">查看详情</el-button>
            <el-button type="info" @click="modifyUser(scope.row)">修改</el-button>
            <el-button type="info" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float:left;margin-top:0px;width: 566px;font-family: 'Lucida Calligraphy', cursive, serif, sans-serif; ">
      <div style="float: center;  font-weight:bolder; margin: 2px 8.5px"> 菜单管理</div>
      <div style="float:left;margin-top:15px">
        <el-table :data="menuData" :stripe='true' :fit='true' border :cell-style="{padding:'5px 0'}" :row-style="{height:'8px'}"
          style="width: 566px;font-size: 16px" :height="410" :max-height="265" highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column prop="id" label="ID" align="center" v-show="false"></el-table-column> -->
          <el-table-column prop="menu" label="菜单" align="center"></el-table-column>
          <el-table-column prop="subMenu" label="子菜单" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="更新日期" align="center"></el-table-column>
          <el-table-column label="操作" width="125" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" :disabled="operateMenuDisable(scope.row)" style="margin-left:5px;"
                @click="showModifyMenu(scope.row)">修改</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" :disabled="operateMenuDisable(scope.row)" style="margin-left:5px;"
                @click="deleteMenu(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="display:inline-block;float:left;margin-top:15px;">
        <el-button type="text" icon="el-icon-plus" size="small" @click="menuVisible=true">主菜单</el-button>
        <el-button type="text" icon="el-icon-circle-plus-outline" size="small" @click="subMenuVisible=true">子菜单</el-button>
        <el-button type="text" icon="el-icon-delete" size="small" @click="batchDelete()">批量删除</el-button>
      </div>
      <div style="display:inline-block;float:right;margin-right:0px;margin-top:15px;">
        <!-- 分页 开始 -->
        <div class="page">
          <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, prev, pager, next"
            :total="this.queryParams.total" :current-page="this.queryParams.pageNum" :page-size="this.queryParams.pageSize" :page-sizes="[5]">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog title="修改菜单" :visible.sync="modifyMenuVisible" width="30%">
      <!-- <el-input v-model="menu" placeholder="请输入菜单名"></el-input> -->
      <div style="display: inline-block; float: left; width: 100%; margin-bottom: 20px;margin-top: 15px;">
        <span style="float: left;  margin-top: 6px;margin-left: 8.5px"> 主菜单：</span>
        <el-input style="float: left; width:59.5%;" v-model="modifyMenuObj.menu"></el-input>
      </div>
      <div style="display: inline-block; float: left; width: 100%; margin-bottom: 20px;margin-top: 15px;">
        <span style="float: left;  margin-top: 6px;margin-left: 8.5px"> 子菜单：</span>
        <el-input style="float: left; width:59.5%;" v-model="modifyMenuObj.subMenu"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyMenuVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyMenu()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="创建菜单" :visible.sync="menuVisible" width="30%">
      <!-- <el-input v-model="menu" placeholder="请输入菜单名"></el-input> -->
      <div style="display: inline-block; float: left; width: 100%; margin-bottom: 20px;margin-top: 15px;">
        <span style="float: left;  margin-top: 6px;margin-left: 8.5px"> 主菜单：</span>
        <el-input style="float: left; width:59.5%;" v-model="menu" placeholder="请输入主菜单名"></el-input>
      </div>
      <div style="display: inline-block; float: left; width: 100%; margin-bottom: 20px;margin-top: 15px;">
        <span style="float: left;  margin-top: 6px;margin-left: 8.5px"> 子菜单：</span>
        <el-input style="float: left; width:59.5%;" v-model="subMenu" placeholder="请输入子菜单名"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menuVisible = false">取 消</el-button>
        <el-button type="primary" @click="createMenu()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="创建子菜单" :visible.sync="subMenuVisible" width="30%">
      <div style="display:inline-block;float: left; width: 100%; margin-bottom: 0px">
        <span style="float: left;  margin-top: 6px">* 主菜单：</span>
        <el-select style="float: left;  margin-bottom: 0px" v-model="menu" placeholder="请选择主菜单">
          <el-option v-for="item in menus" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <br />
      <div style="display: inline-block; float: left; width: 100%; margin-bottom: 20px;margin-top: 15px;">
        <span style="float: left;  margin-top: 6px;margin-left: 8.5px"> 子菜单：</span>
        <el-input style="float: left; width:59.5%;" v-model="subMenu" :disabled="subMenuInputDisable" placeholder="请输入子菜单名"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="subMenuVisible = false">取 消</el-button>
        <el-button type="primary" @click="createSubMenu()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userViewDialog from "@/views/userView"; // 用户管理暂未开发，后续待开发
import {
  getAllUser,
  getMenuTableData,
  getExistsMenus,
  createMenu,
  deleteMenu,
  deleteMenus,
  modifySubMenu,
  modifyMenu,
} from "@/common/httpService";
export default {
  data() {
    return {
      menu: null,
      subMenu: null,
      menuVisible: false,
      subMenuVisible: false,
      modifyMenuVisible: false,
      subMenuInputDisable: false,
      menus: [],
      allMenus: [],
      menuData: [],
      queryParams: {
        menu: 0,
        subMenu: 0,
        pageNum: 1, //当前页号
        pageSize: 5, //每页大小
        total: 100, //总条数
        beginIndex: 0,
      },
      originRow: null,
      modifyMenuObj: {
        menu: null,
        subMenu: null,
      },
      multipleSelection: [],
      tableData: [],
      name: null,
    };
  },
  //默认加载的方法
  created() {
    // this.init();
    this.getExistsMenus();
    this.getMenuTableData();
  },

  methods: {
    getMenuTableData() {
      getMenuTableData(this.queryParams).then((res) => {
        if (res && res.data && res.data) {
          this.menuData = res.data.list;
          this.queryParams.total = res.data.total;
        }
      });
    },

    operateMenuDisable(row) {
      if (row.menu == "运动统计") {
        let subMenuDisable = ["跑步统计"];
        if (subMenuDisable.indexOf(row.subMenu) != -1) return true;
      } else if (row.menu == "学习统计") {
        let subMenuDisable = ["工作学习"];
        if (subMenuDisable.indexOf(row.subMenu) != -1) return true;
      }
      return false;
    },
    deleteMenu(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteMenu(id)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: res.message,
                  type: "success",
                });
                clearTimeout(this.timer); //清除延迟执行

                this.timer = setTimeout(() => {
                  //设置延迟执行
                  location.reload();
                }, 1000);
              }
            })
            .catch((error) => {
              this.$message.error(error.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    batchDelete() {
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message({
          message: "请先选中",
          type: "warning",
        });
        return;
      }
      let ids = [];
      this.multipleSelection.forEach(function (item) {
        ids.push(item.id);
      });
      deleteMenus(ids)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
            location.reload();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    showModifyMenu(row) {
      this.originRow = row;
      this.modifyMenuObj.menu = row.menu;
      this.modifyMenuObj.subMenu = row.subMenu;
      this.modifyMenuVisible = true;
    },
    modifyMenu() {
      if (this.modifyMenuObj.menu) {
        this.modifyMenuObj.menu = this.modifyMenuObj.menu.trim();
      }
      if (this.modifyMenuObj.subMenu) {
        this.modifyMenuObj.subMenu = this.modifyMenuObj.subMenu.trim();
      }

      if (!this.modifyMenuObj.menu) {
        this.$message({
          message: "菜单不能为空",
          type: "warning",
        });
        return;
      }

      if (!this.modifyMenuObj.subMenu) {
        this.$message({
          message: "子菜单不能为空",
          type: "warning",
        });
        return;
      }

      if (
        this.originRow.menu == this.modifyMenuObj.menu &&
        this.originRow.subMenu == this.modifyMenuObj.subMenu
      ) {
        this.$message({
          message: "没有修改，不能提交",
          type: "warning",
        });
        return;
      }

      if (
        this.originRow.menu != this.modifyMenuObj.menu &&
        this.originRow.subMenu != this.modifyMenuObj.subMenu
      ) {
        this.$message({
          message: "菜单与子菜单不能同时修改",
          type: "warning",
        });
        return;
      }

      if (this.originRow.menu != this.modifyMenuObj.menu) {
        modifyMenu({
          oldMenu: this.originRow.menu,
          newMenu: this.modifyMenuObj.menu,
        })
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.modifyMenuVisible = false;
              this.getMenuTableData();
            }
          })
          .catch((error) => {
            this.$message.error(error.message);
          });
      } else {
        modifySubMenu({
          oldMenu: this.originRow.subMenu,
          newMenu: this.modifyMenuObj.subMenu,
        })
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.modifyMenuVisible = false;
              this.getMenuTableData();
            }
          })
          .catch((error) => {
            this.$message.error(error.message);
          });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`页面大小: ${val}`);
      this.queryParams.pageSize = val;
      this.queryParams.pageNum = 1;
      this.getMenuTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryParams.pageNum = val;
      this.getMenuTableData();
    },
    getExistsMenus() {
      getExistsMenus().then((res) => {
        if (res && res.data && res.data.menus) {
          this.menus = res.data.menus;
          this.allMenus = res.data.menuSubMenus;
        }
      });
    },
    createMenu() {
      if (this.menu) {
        this.menu = this.menu.trim();
      }

      if (this.subMenu) {
        this.subMenu = this.subMenu.trim();
      }

      if (!this.menu || !this.subMenu) {
        this.$message({
          message: "必须输入主菜单名和子菜单名",
          type: "warning",
        });
        return;
      }

      if (this.allMenus.indexOf(this.menu) != -1) {
        this.$message({
          message: "主菜单不能与已存在的主菜单或子菜单名相同",
          type: "warning",
        });
        return;
      }
      if (this.allMenus.indexOf(this.subMenu) != -1) {
        this.$message({
          message: "子菜单不能与已存在的主菜单或子菜单名相同",
          type: "warning",
        });
        return;
      }

      let requestParams = { menu: this.menu, subMenu: this.subMenu };

      createMenu(requestParams)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
            location.reload();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    createSubMenu() {
      if (this.menu) {
        this.menu = this.menu.trim();
      }

      if (this.subMenu) {
        this.subMenu = this.subMenu.trim();
      }

      if (!this.menu) {
        this.$message({
          message: "必须先选定主菜单",
          type: "warning",
        });
        return;
      }

      if (this.allMenus.indexOf(this.subMenu) != -1) {
        this.$message({
          message: "子菜单不能与已存在的主菜单或子菜单名相同",
          type: "warning",
        });
        return;
      }
      let requestParams = { menu: this.menu, subMenu: this.subMenu };

      createMenu(requestParams)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
            location.reload();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    init() {
      let params = { page: 1, size: 10 };
      getAllUser(params).then((res) => {
        this.tableData = res.data;
      });
    },

    //删除用户
    deleteUser(val) {
      console.log(val);

      //这里写相应的逻辑，val是指传进来的参数也就是上面的scope.row.phone；也可以是scope.row.nickname等
    },
    //修改用户
    modifyUser(val) {
      let self = this;
    },
    //查看详情
    checkDetail(val) {
      console.log(val);
    },
    afterSuccess() {},
  },
};
</script>


// WEBPACK FOOTER //
// src/views/user/user.vue
 <template>

  <el-container style="height: 100%; border: 1px solid #eee">
    <el-header style="text-align: right; font-size: 12px;height:5px;">
      <el-button v-show="displaySwitchButton" @click="switchView()" type="text" icon="el-icon-setting" style="height:5px;float: right;position: relative">
        {{switchText}}
      </el-button>
    </el-header>

    <el-container style="height: 100%;">
      <el-aside style="width:15%;height: 690px;background-color:#545c64;text-align:left">
        <el-menu :default-openeds="openedMenus" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
          <el-submenu key="menu001" index="1">
            <template slot="title"><i class="el-icon-message"></i>个人中心</template>
            <el-menu-item-group style="padding-left:15px;">
              <el-menu-item key="base-info" index="/overview">概览</el-menu-item>
              <el-menu-item key="base-info2" index="/user">个人管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu key="menu002" index="2">
            <template slot="title"><i class="el-icon-message"></i>运动统计</template>
            <el-menu-item-group style="padding-left:15px;">
              <el-menu-item key="run-count" index="/runHome">跑步统计</el-menu-item>
              <template v-for="subMenu in menuSubMenus['运动统计']">
                <el-menu-item :key="'运动统计'+subMenu.name" :index="'/statsHome/' +subMenu.id">{{subMenu.name}}</el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>

          <template v-for="(menu,index) in allMenus">
            <el-submenu :key="menu+index" :index="(index+2)+''">
              <template slot="title"><i class="el-icon-message"></i>{{menu}}</template>
              <el-menu-item-group style="padding-left:15px;">
                <template v-for="subMenu in menuSubMenus[menu]">
                  <el-menu-item :key="menu+subMenu.name" :index="'/statsHome/'+subMenu.id">{{subMenu.name}}</el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>

      <el-main style="height: 620px;">
        <router-view />
      </el-main>
    </el-container>

  </el-container>
</template> 


<script>
import { getExistsMenus } from "@/common/httpService";
import MiddleUtil from "@/common/midUtil";

export default {
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.path == "/overview") {
          this.displaySwitchButton = true;
        } else {
          this.displaySwitchButton = false;
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  data() {
    return {
      openedMenus: ["1", "2", "3"],
      allMenus: [],
      menuSubMenus: {}, // 菜单子菜单 {学习统计: [{name: "长期目标", id: "1"}, {name: "中期目标", id: "2"}, {name: "短期目标", id: "3"}]}
      switchText: "切换视图",
      displaySwitchButton: false,
    };
  },
  methods: {
    getExistsMenus() {
      let fixMenu = "运动统计";
      let runStat = "跑步统计";
      getExistsMenus().then((res) => {
        if (res && res.data && res.data.menus) {  // "menus": ["学习统计"],
          this.allMenus = res.data.menus.filter((item) => fixMenu != item);
          this.menuSubMenus = res.data.allMenuObjects;

          // 把从数据库中查询出的 “跑步统计” 过滤掉，因为已经写死在页面上了
          if (this.menuSubMenus["运动统计"]) {
            this.menuSubMenus["运动统计"] = this.menuSubMenus[
              "运动统计"
            ].filter((item) => item["name"] != runStat);
          }
        }
      });
    },
    switchView() {
      // this.$root 是取vue的根组件，this.$parent是上一层组件。这里用this.$root相当于使用了一个全局变量
      this.$root.isDetailView = !this.$root.isDetailView;
      // $emit 有两种用法，一是触发父组件的自定义事件，一是触发自定义事件，这里是第二种用法。自定义事件 在Overview.vue中的： MiddleUtil.$on("getExistsMenus", () => {
      MiddleUtil.$emit("getExistsMenus");
    },
  },
  created() {
    this.openedMenus = ["1", "2", "3"];
    this.getExistsMenus();
    if (window.location.href.endsWith("/overview")) {
      this.displaySwitchButton = true;
    }
  },
};
</script>


<style>
.el-header {
  background-color: #a289ef;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.el-menu-item-group__title {
  padding: 7px 0 7px 20px;
  line-height: normal;
  font-size: 12px;
  color: #909399;
  display: none;
}
</style>


// WEBPACK FOOTER //
// src/views/Layout/Layout.vue
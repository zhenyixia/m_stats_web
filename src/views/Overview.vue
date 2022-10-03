<template>
  <div>
    <!-- <el-button @click="switchView()" type="text" icon="el-icon-setting" style="height:5px;float: right;position: relative">{{switchText}} </el-button> -->
    <template v-for="threeMenus in allMenus">
      <div style="backgroud:176, 203, 219;margin: 0px;">
        <!-- 使用三个div为一行 -->
        <template v-for="menu in threeMenus">
          <div style="display: inline-block;float: left;width: 33%;height: 300px;margin-top: 0px;">
            <stats-chart-in-week :ref="'weekCountRef'+  menu.name" :menuId="menu.id" :weekCountId="'weekCountId' + menu.name" :title="menu.name">
            </stats-chart-in-week>
          </div>
        </template>
      </div>
    </template>

  </div>
</template>

<script>
import { getLatestSubMenus } from "@/common/httpService";
import StatsChartInWeek from "@/components/statsChartInWeek";
import MiddleUtil from "@/common/midUtil";

export default {
  components: {
    StatsChartInWeek: StatsChartInWeek,
  },
  data() {
    return {
      allMenus: [],
      switchText: "切换视图",
    };
  },
  created() {
    this.getExistsMenus();
  },
  mounted() {
    let _this = this;
    MiddleUtil.$on("getExistsMenus", () => {
      _this.allMenus = [];
      _this.getExistsMenus();
    });
  },

  methods: {
    getExistsMenus() {
      let isDetailView = !!this.$root.isDetailView;
      getLatestSubMenus(isDetailView).then((res) => {
        if (res && res.data && res.data.subMenus) {
          let subMenus = res.data.subMenus;

          // 每三个子菜单对象作为一组再放入数组，其中将跑步统计放置第一组第一位
          let runSubMenu = { name: "跑步统计", id: 14 };
          let threeMenu = [runSubMenu];

          let threeeMenuFirstFlag = true;
          for (let subMenuObj of subMenus) {
            if (subMenuObj.subMenu == "跑步统计") {
              continue;
            }
            if (threeeMenuFirstFlag) {
              this.allMenus.push(threeMenu);
              threeeMenuFirstFlag = false;
            }

            if (subMenuObj.subMenu != "跑步统计") {
              subMenuObj.name = this.$root.isDetailView
                ? subMenuObj.content
                : subMenuObj.subMenu;
              threeMenu.push(subMenuObj);
            }

            if (threeMenu.length == 3) {
              threeMenu = [];
              threeeMenuFirstFlag = true;
            }
          }
        }
      });
    },

    switchView() {},
  },
};
</script>


// WEBPACK FOOTER //
// src/views/Overview.vue
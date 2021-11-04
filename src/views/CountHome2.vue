<!-- 暂停新布局开发，后面有时间再搞 -- 2021/3/29 -->
<template >

  <div style="background-color:rgb(232, 241, 252);">
    <div>
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="200px">
          <el-menu :default-openeds="['1', '3']">
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-message"></i>导航一</template>
              <el-menu-item-group>
                <el-menu-item index="1-1">跑步统计</el-menu-item>
                <el-menu-item index="1-2">学习统计</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header style="text-align: right; font-size: 12px">
            <el-dropdown>
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>王小虎</span>
          </el-header>

          <el-main style="padding:5px;">
            <el-table :data="tableData">
              <el-table-column prop="date" label="日期" width="140">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="120">
              </el-table-column>
              <el-table-column prop="address" label="地址">
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
      </el-container>
    </div>
    <div style="display: inline-block;float: left; width: 100%; height: 30px;margin-top: 0px;">
      <span style="float: left; display: inline-block; margin-left: 300px">跑步统计</span>
      <span style="float: left; display: inline-block; margin-left: 550px">{{ this.learnContent }} 学习统计</span>
      <el-button icon="el-icon-open" size="mini" type="primary" style="float: left; display: inline-block; margin-left: 50px"
        @click="changeLearnCount()">{{ changeAllOrLatest }}</el-button>
    </div>
    <div style="display: inline-block;float: left;width: 100%;height: 250px;margin-top: 15px;">
      <run-week-count ref="runWeekCountRef"></run-week-count>
      <!-- <learn-week-count ref="learnWeekCountRef" :learnContent="learnContent"></learn-week-count> -->
    </div>
    <div style="display: inline-block;float: left;width: 100%;height: 250px;margin-top: 15px;">
      <run-month-count ref="runMonthCount"></run-month-count>
      <learn-month-count ref="learnMonthCountRef"></learn-month-count>
    </div>
    <!-- <div>
      
    </div>-->
    <!-- 跑步操作按钮 -->
    <div style="display: inline-block; float: left; margin-top: 15px">
      <el-button icon="el-icon-plus" type="primary" size="small" @click.stop="enterRunData()">录入数据</el-button>
      <el-button icon="el-icon-s-data" type="primary" size="small" style="margin-left: 0px" @click="countRunInYear()">统计一年</el-button>
      <el-button icon="el-icon-s-data" type="primary" size="small" style="margin-left: 0px" @click="countRunAllYears()">统计所有</el-button>
    </div>

    <!-- 学习操作按钮 -->
    <div style="display: inline-block;float: right;margin-right: 355px;margin-top: 15px;">
      <el-button icon="el-icon-plus" type="primary" size="small" @click.stop="enterLearnData()">录入数据</el-button>
      <el-button icon="el-icon-s-data" type="primary" size="small" style="margin-left: 0px" @click="countOneYearLearn()">统计一年</el-button>
      <el-button icon="el-icon-s-data" type="primary" size="small" style="margin-left: 0px" @click="countAllYearsLearn()">统计所有</el-button>
    </div>
    <!-- 跑步对话弹出框 -->
    <div>
      <enter-run-date v-if="showEnterRunDataDialog" ref="enterRunDate"></enter-run-date>
      <one-year-run-count v-if="showRunYearCountDialog" ref="oneYearRunCount"></one-year-run-count>
      <all-year-run-count v-if="showRunAllYearsCountDialog" ref="allYearsChartCountRef"></all-year-run-count>
    </div>
    <!-- 学习对话弹出框 -->
    <div>
      <enter-learn-date v-if="showEnterLearnDataDialog" ref="enterLearnDateRef"></enter-learn-date>
      <one-year-learn-count v-if="showCountOneYearLearnDialog" ref="countOneYearLearnRef"></one-year-learn-count>
      <all-year-learn-count v-if="showCountAllYearsLearnDialog" ref="countAllYearsLearnRef"></all-year-learn-count>
    </div>
    <div v-if="false">
      <el-table :data="tableData" :stripe="true" :fit="true" :cell-style="{ padding: '9px 0' }" :row-style="{ height: '8px' }" style="font-size: 10px"
        :height="400" :max-height="250" highlight-current-row>
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="kilometer" label="距离" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" align="center"></el-table-column>
        <el-table-column prop="runSecond" label="运动时长" align="center"></el-table-column>
        <el-table-column prop="kmByHour" label="速度-km/h" align="center"></el-table-column>
        <el-table-column prop="timeByKm" label="平均配速-s/km" align="center"></el-table-column>
        <el-table-column prop="runDate" label="运动日期" align="center"></el-table-column>
      </el-table>
      <div style="display: inline-block; float: right; margin-top: 15px">
        <!-- 分页 开始 -->
        <div class="page">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper" :total="this.queryParams.total" :current-page="this.queryParams.pageNum"
            :page-size="this.queryParams.pageSize" :page-sizes="[10, 15, 20, 50]"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userViewDialog from "@/views/userView";
import {
  getRunList,
  importRunData,
  downloadRunDataTemplate,
  exportRunData,
  getLearnContent,
} from "@/common/httpService";
import RunMonthCount from "./RunCount/CountChartInMonth";
import RunWeekCount from "./RunCount/CountChartInWeek";
import EnterRunDate from "./RunCount/EnterDateDialog";
import OneYearRunCount from "./RunCount/CountChartInYear";
import AllYearRunCount from "./RunCount/CountChartAllYears";

import LearnMonthCount from "./LearnCount/CountChartInMonth";
import LearnWeekCount from "./LearnCount/CountChartInWeek";
import EnterLearnDate from "./LearnCount/EnterDateDialog";
import OneYearLearnCount from "./LearnCount/CountChartInYear";
import AllYearLearnCount from "./LearnCount/CountChartAllYears";
export default {
  components: {
    // 跑步统计组件
    EnterRunDate: EnterRunDate,
    RunMonthCount: RunMonthCount,
    RunWeekCount: RunWeekCount,
    OneYearRunCount: OneYearRunCount,
    AllYearRunCount: AllYearRunCount,

    // 学习统计组件
    EnterLearnDate: EnterLearnDate,
    OneYearLearnCount: OneYearLearnCount,
    AllYearLearnCount: AllYearLearnCount,
    LearnMonthCount: LearnMonthCount,
    LearnWeekCount: LearnWeekCount,
  },
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    };

    return {
      tableData: Array(20).fill(item),
      // tableData: [],
      name: null,
      spImportData: "",
      queryParams: {
        year: 0,
        month: 0,
        pageNum: 1, //当前页号
        pageSize: 10, //每页大小
        total: 100, //总条数
      },
      //展示录入跑步数据弹出框
      showEnterRunDataDialog: false,
      showRunYearCountDialog: false,
      showRunAllYearsCountDialog: false,
      downloadTemplate: downloadRunDataTemplate,
      importRunData: importRunData,
      //学习统计定义
      showCountAllYearsLearnDialog: false,
      showCountOneYearLearnDialog: false,
      showEnterLearnDataDialog: false,
      learnContentOptions: [],
      learnContent: "init",
      latestLearnContent: "",
      changeAllOrLatest: "切换全部",
    };
  },
  //默认加载的方法
  created() {
    this.getLearnContentOptions();
  },

  methods: {
    getLearnContentOptions() {
      getLearnContent()
        .then((res) => {
          if (!res) {
            this.$message.error("查询数据为空");
          }
          if (res.status == 200 && res.data) {
            this.learnContent = res.data[0];
            this.latestLearnContent = res.data[0];
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },

    // 全部与最近的切换
    changeLearnCount() {
      if (this.changeAllOrLatest == "切换全部") {
        this.changeAllOrLatest = "切换最近";
        this.learnContent = "";
      } else {
        this.changeAllOrLatest = "切换全部";
        this.learnContent = this.latestLearnContent;
      }
      this.$nextTick(() => {
        this.$refs.learnWeekCountRef.init();
      });
    },

    handleSizeChange(val) {
      console.log(`页面大小: ${val}`);
      this.queryParams.pageSize = val;
      this.queryParams.pageNum = 1;
      this.getListFunc();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryParams.pageNum = val;
      this.getListFunc();
    },
    afterImport() {
      console.log("导入结束");
      this.getListFunc();
    },

    //录入跑步数据
    enterRunData() {
      this.showEnterRunDataDialog = true;
      this.$nextTick(() => {
        this.$refs.enterRunDate.init();
      });
    },
    countRunInYear() {
      this.showRunYearCountDialog = true;
      this.$nextTick(() => {
        this.$refs.oneYearRunCount.init();
      });
    },
    countRunAllYears() {
      this.showRunAllYearsCountDialog = true;
      this.$nextTick(() => {
        this.$refs.allYearsChartCountRef.init();
      });
    },

    //录入学习时长数据
    enterLearnData() {
      this.showEnterLearnDataDialog = true;
      this.$nextTick(() => {
        this.$refs.enterLearnDateRef.init();
      });
    },
    countOneYearLearn() {
      this.showCountOneYearLearnDialog = true;
      this.$nextTick(() => {
        this.$refs.countOneYearLearnRef.init();
      });
    },
    countAllYearsLearn() {
      this.showCountAllYearsLearnDialog = true;
      this.$nextTick(() => {
        this.$refs.countAllYearsLearnRef.init();
      });
    },

    // 导出模板
    exportTemplate() {
      window.location.href = this.downloadTemplate;
    },
    // 导出数据
    exportData() {
      exportRunData(this.queryParams).then((res) => {
        var blob = new Blob([res.data], {
          type: "application/msword;charset=utf-8",
        });
        var filename = "download.xlsx";
        var a = document.createElement("a");
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(a);
        a.click();
        body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.$message.success("下载成功");
      });
    },
  },
};
</script>
<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
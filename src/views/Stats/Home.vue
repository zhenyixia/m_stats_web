<template>
  <div style="backgroud:176, 203, 219;">

    <div style="display: inline-block;float: left;width: 35%;height: 250px;margin-top: 15px;">
      <week-count ref="weekCountRef"></week-count>
    </div>
    <div style="display: inline-block;float: right;width: 64%;height: 250px;margin-top: 15px;">
      <month-count ref="monthCountRef"></month-count>
    </div>

    <div style="float: right;width: 100%;margin-top: 15px;">
      <el-table :data="tableData" :stripe="true" :fit="true" :cell-style="{padding:'9px 0'}" :row-style="{height:'8px'}" style="font-size: 10px"
        :height="400" :max-height="260" highlight-current-row>
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="learnContent" label="内容" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" align="center"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
        <el-table-column prop="learnHours" label="时长" align="center"></el-table-column>
        <el-table-column prop="learnDate" label="日期" align="center"></el-table-column>
      </el-table>
      <div style="display:inline-block;float:left;margin-top:15px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click.stop="enterData()">录入数据</el-button>
        <el-button icon="el-icon-s-data" type="primary" size="small" @click="countInYear()">按年统计</el-button>
        <el-button icon="el-icon-s-data" type="primary" size="small" style="margin-left:0px;" @click="countAllYears()">统计所有</el-button>
      </div>
      <div>
        <enter-date v-if="showEnterDataDialog" ref="enterDate"></enter-date>
        <one-year-count v-if="showYearCountDialog" ref="oneYearCount"></one-year-count>
        <all-year-count v-if="showAllYearsCountDialog" ref="allYearsChartCountRef"></all-year-count>
      </div>
      <div style="display:inline-block;float:right;margin-top:15px;">
        <!-- 分页 开始 -->
        <div class="page">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next"
            :total="this.queryParams.total" :current-page="this.queryParams.pageNum" :page-size="this.queryParams.pageSize"
            :page-sizes="[5, 10, 15, 20, 50]"></el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getLearnList } from "@/common/httpService";
import MonthCount from "./CountChartInMonth";
import WeekCount from "./CountChartInWeek";
import EnterDate from "./EnterDateDialog";
import OneYearCount from "./CountChartInYear";
import AllYearCount from "./CountChartAllYears";
export default {
  components: {
    EnterDate: EnterDate,
    MonthCount: MonthCount,
    WeekCount: WeekCount,
    OneYearCount: OneYearCount,
    AllYearCount: AllYearCount,
  },
  watch: {
    $route() {
      this.menuId = this.$route.params.menuId; //获取传来的参数
      console.log("菜单id为：%s", this.menuId);
      this.init(); //路由变化时就重新执行这个方法 更新传来的参数
    },
  },
  data() {
    return {
      menuId: 0,
      tableData: [],
      name: null,
      spImportData: "",
      queryParams: {
        menuId: 0,
        year: 0,
        month: 0,
        pageNum: 1, //当前页号
        pageSize: 5, //每页大小
        total: 100, //总条数
      },
      //展示录入跑步数据弹出框
      showEnterDataDialog: false,
      showYearCountDialog: false,
      showAllYearsCountDialog: false,
    };
  },
  //默认加载的方法
  created() {
    console.log(this.$route.params.menuId);
    console.log("Home created menuId: %s", this.menuId);
    this.init();
  },
  //默认加载的方法
  mounted() {
    // this.menuId = this.$route.params.menuId;
    // console.log("菜单id为：%s", this.menuId);
  },

  methods: {
    init() {
      this.queryParams = {
        menuId: 0,
        year: 0,
        month: 0,
        pageNum: 1, //当前页号
        pageSize: 5, //每页大小
        total: 100, //总条数
      };
      this.menuId = this.$route.params.menuId;
      this.queryParams.menuId = this.menuId;
      this.$nextTick(() => {
        this.$refs.weekCountRef.init(this.menuId);
      });
      this.$nextTick(() => {
        this.$refs.monthCountRef.init(this.menuId);
      });
      this.getListFunc();
    },
    getListFunc() {
      getLearnList(this.queryParams)
        .then((res) => {
          if (!res) {
            this.$message.error("查询数据为空");
          }
          if (res.status == 200 && res.data) {
            this.tableData = res.data.list;
            this.queryParams.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
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
    enterData() {
      this.showEnterDataDialog = true;
      this.$nextTick(() => {
        this.$refs.enterDate.init(this.menuId);
      });
    },
    countInYear() {
      this.showYearCountDialog = true;
      this.$nextTick(() => {
        this.$refs.oneYearCount.init(this.menuId);
      });
    },
    countAllYears() {
      this.showAllYearsCountDialog = true;
      this.$nextTick(() => {
        this.$refs.allYearsChartCountRef.init(this.menuId);
      });
    },

    // 导出模板
    exportTemplate() {
      window.location.href = this.downloadTemplate;
    },
    // 导出数据
    exportData() {
      exportData(this.queryParams).then((res) => {
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


// WEBPACK FOOTER //
// src/views/Stats/Home.vue
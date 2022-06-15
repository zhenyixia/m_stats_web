<template>
  <div style="backgroud:176, 203, 219;">

    <div style="display: inline-block;float: left;width: 35%;height: 250px;margin-top: 15px;">
      <run-week-count ref="runWeekCountRef"></run-week-count>
    </div>
    <div style="display: inline-block;float: right;width: 64%;height: 250px;margin-top: 15px;">
      <run-month-count ref="runMonthCount"></run-month-count>
    </div>

    <div style="float: right;width: 100%;margin-top: 15px;">
      <el-table :data="tableData" :stripe="true" :fit="true" :cell-style="{padding:'9px 0'}" :row-style="{height:'8px'}" style="font-size: 10px"
        :height="400" :max-height="260" highlight-current-row>
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="kilometer" label="距离" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" align="center"></el-table-column>
        <el-table-column prop="runSecond" label="运动时长" align="center"></el-table-column>
        <el-table-column prop="kmByHour" label="速度-km/h" align="center"></el-table-column>
        <el-table-column prop="timeByKm" label="平均配速-s/km" align="center"></el-table-column>
        <el-table-column prop="runDate" label="运动日期" align="center"></el-table-column>
      </el-table>
      <div style="display:inline-block;float:left;margin-top:15px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click.stop="enterRunData()">录入数据</el-button>
        <!-- <el-button icon="el-icon-download" type="primary" size="small" style="margin-left:0px;" @click="exportTemplate">录入模板</el-button>
        <el-upload style="display:inline-block" class="upload-demo" :action="importRunData" name="file" :limit="1" :on-success="afterImport">
          <el-button icon="el-icon-upload2" type="primary" size="small">批量导入</el-button>
        </el-upload> -->

        <el-button icon="el-icon-s-data" type="primary" size="small" @click="countRunInYear()">按年统计</el-button>
        <el-button icon="el-icon-s-data" type="primary" size="small" style="margin-left:0px;" @click="countRunAllYears()">统计所有</el-button>
      </div>
      <div>
        <enter-run-date v-if="showEnterRunDataDialog" ref="enterRunDate" :latestAddress="latestAddressF"></enter-run-date>
        <one-year-run-count v-if="showRunYearCountDialog" ref="oneYearRunCount"></one-year-run-count>
        <all-year-run-count v-if="showRunAllYearsCountDialog" ref="allYearsChartCountRef"></all-year-run-count>
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
import userViewDialog from "@/views/userView";
import {
  getRunList,
  importRunData,
  downloadRunDataTemplate,
  exportRunData,
} from "@/common/httpService";
import RunMonthCount from "./CountChartInMonth";
import RunWeekCount from "./CountChartInWeek";
import EnterRunDate from "./EnterDateDialog";
import OneYearRunCount from "./CountChartInYear";
import AllYearRunCount from "./CountChartAllYears";
export default {
  components: {
    // 跑步统计组件
    EnterRunDate: EnterRunDate,
    RunMonthCount: RunMonthCount,
    RunWeekCount: RunWeekCount,
    OneYearRunCount: OneYearRunCount,
    AllYearRunCount: AllYearRunCount,
  },
  data() {
    return {
      tableData: [],
      name: null,
      spImportData: "",
      latestAddressF:"",
      queryParams: {
        year: 0,
        month: 0,
        pageNum: 1, //当前页号
        pageSize: 5, //每页大小
        total: 100, //总条数
      },
      //展示录入跑步数据弹出框
      showEnterRunDataDialog: false,
      showRunYearCountDialog: false,
      showRunAllYearsCountDialog: false,
      downloadTemplate: downloadRunDataTemplate,
      importRunData: importRunData,
    };
  },
  //默认加载的方法
  created() {
    this.getListFunc();
  },

  methods: {
    getListFunc() {
      getRunList(this.queryParams)
        .then((res) => {
          if (!res) {
            this.$message.error("查询数据为空");
          }
          if (res.status == 200 && res.data) {
            this.tableData = res.data.list;
            this.latestAddressF = res.data.list[0].address
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


// WEBPACK FOOTER //
// src/views/RunCount/CountRunHome.vue
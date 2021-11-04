<template>
  <div>
    <div style="float:left;width:650px; height:250px;">
      <div style="position:relative;float:left;margin-bottom:0px;">
        <!-- <span style="margin-left:10px;">跑步统计</span> -->
        <el-button icon="el-icon-arrow-left" size="mini" type="primary" style="margin-left:0px;" :disabled="curYearMonth<=202101" @click="preMonth()">
          前一月</el-button>
        <span style="margin-left: 20px;">{{curYearMonthInfo}}</span>
        <el-button type="primary" size="mini" style="margin-left: 20px;" :disabled="curYearMonth >= realCurYearMonth" @click="nextMonth()">
          后一月
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
        <span style="margin-left:145px;">运动{{totalTimes}}次</span>
        <span style="margin-left:50px;">{{total}}公里</span>
      </div>
      <div id="monthCountId" style="float:left;width:100%;height:100%;margin-top:-5px;"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { deepClone } from "@/common/util";
import { countRunInOneMonth } from "@/common/httpService";
export default {
  name: "",
  data() {
    return {
      monthChart: {},
      optionData: { daysInMonth: [], kmInMonth: [] },
      queryParams: {
        year: 0,
        month: 0,
      },
      total: 0, // 本月运动总里程
      totalTimes: 0, // 本月总运动总次数
      curYearMonth: 0, //当前月，随着切换会变化
      realCurYearMonth: 0, // 真正的当前月，不会随着切换变化
      curYearMonthInfo: null, // 当前年月信息，如：2021年2月
    };
  },
  methods: {
    init() {
      let date = new Date();
      this.setDateInfo(date);
      this.realCurYearMonth = this.curYearMonth;

      this.countByMonth();
    },
    countByMonth() {
      countRunInOneMonth(this.queryParams)
        .then((res) => {
          if (!res || !res.data) {
            this.$message.warning("查询不到月度数据");
          }
          if (res.status == 200 && res.data) {
            this.optionData.daysInMonth = res.data.units;
            this.optionData.kmInMonth = res.data.valueList;
            this.totalTimes = res.data.totalTimes;
            this.total = res.data.total;
          }
        })
        .finally(() => {
          this.drawMonths(this.optionData);
        });
    },
    preMonth() {
      let curDate = new Date(this.queryParams.year, this.queryParams.month - 1);
      curDate.setMonth(curDate.getMonth() - 1);
      this.setDateInfo(curDate);
      this.countByMonth();
    },
    nextMonth() {
      let curDate = new Date(this.queryParams.year, this.queryParams.month - 1);
      curDate.setMonth(curDate.getMonth() + 1);
      this.setDateInfo(curDate);
      this.countByMonth();
    },
    setDateInfo(date) {
      let curYear = date.getFullYear();
      let curMonth = date.getMonth() + 1;

      this.queryParams.year = curYear;
      this.queryParams.month = curMonth;
      this.curYearMonth = curYear * 100 + curMonth;
      this.curYearMonthInfo = curYear + "年" + curMonth + "月";
    },
    drawMonths(optionData) {
      this.monthChart = this.$echarts.init(
        document.getElementById("monthCountId")
      );
      let optionTrend = {
        color: "#c23531",
        // title: {
        //   text: optionData.total,
        //   textStyle: { color: "#8043D7" }
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // type: "shadow"
          },
          // formatter: param => {
          //   let data = `${param[0].name}`;
          //   for (let i in param) {
          //     data += `<br>${param[i].marker}${param[i].seriesName}:${param[i].value}`;
          //     if (param[i].seriesIndex == 2) {
          //       data += "%";
          //     }
          //   }
          //   return data;
          // }
        },
        legend: {
          // data: ["按周统计"],
          textStyle: { fontSize: 16 },
          // right: "100"
        },
        xAxis: {
          // name: "每天",
          type: "category",
          data: optionData.daysInMonth,
        },
        yAxis: {
          type: "value",

          axisLine: { show: true }, // 坐标轴，默认为true
          axisTick: { show: false },
          axisLabel: {
            textStyle: { fontSize: 16 },
            formatter: "{value}",
            interval: 3,
          },
        },
        // 整体统计图表格的位置，及高宽
        grid: {
          left: 30,
          right: 100,
          bottom: 30,
          top: 60,
          height: "40%",
          width: "95%",
        },
        series: [
          {
            // name: optionData.total,
            type: "bar",
            data: optionData.kmInMonth,
            stack: "stock",
            barMaxWidth: 20,
            label: {
              show: true,
              position: "top", // 数值显示在柱状图上面
              fontSize: 14,

              color: "#556575",
              formatter: (params) => {
                return params.value == 0 ? "" : params.value;
              },
            },
            itemStyle: {
              color: "#007ADB",
            },
            // showBackground: true,
            // backgroundStyle: {
            //   color: "rgba(180, 180, 180, 0.2)"
            // }
          },
        ],
      };
      this.monthChart.setOption(optionTrend);
    },
    resize(chart) {
      window.addEventListener("resize", function () {
        chart.resize();
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
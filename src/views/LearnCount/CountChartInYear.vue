<template>
  <div>
    <el-dialog title="统计一年(所有)" :visible.sync="modalShow" top="1%" width="700px" height="500px" :before-close="modalClose" class="elDialogBody">
      <div>
        <div style="position:relative;margin-bottom:0px;">
          <el-button icon="el-icon-arrow-left" size="mini" type="primary" :disabled="curYear<=2021" @click="preYear()">前一年</el-button>
          <span style="margin-left:40px;">{{curYear}}年</span>
          <el-button type="primary" size="mini" style="margin-left:40px;" :disabled="curYear >= realCurYear" @click="nextYear()">
            后一年
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
          <span style="margin-left:100px;">共{{total}}小时</span>
          <span style="margin-left:100px;">共运动{{totalTimes}}次</span>
        </div>
        <div id="yearCountId" style="width:650px;height:300px;"></div>
        <div style="margin-top:20px;">
          <el-button type="primary" @click="modalClose()">退出</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from "echarts";
import { deepClone } from "@/common/util";
import { countLearnInOneYear } from "@/common/httpService";
export default {
  name: "",
  data() {
    return {
      modalShow: false,
      yearChart: {},
      optionData: { daysInMonth: [], valueList: [] },
      queryParams: {
        year: 0,
      },
      total: 0, // 本年运动总里程
      totalTimes: 0, // 本年总运动总次数
      curYear: 0, //当前年，随着切换会变化
      realCurYear: 0, // 真正的当前年，不会随着切换变化
    };
  },
  methods: {
    init() {
      this.modalShow = true;
      let date = new Date();
      this.realCurYear = this.curYear = date.getFullYear();
      this.queryParams.year = this.curYear;

      this.countInYear();
    },
    modalClose() {
      this.modalShow = false;
      this.optionData = [];
    },
    countInYear() {
      countLearnInOneYear(this.queryParams)
        .then((res) => {
          if (!res || !res.data) {
            this.$message.warning("查询不到年度数据");
          }
          if (res.status == 200 && res.data) {
            this.optionData.daysInMonth = res.data.units;
            this.optionData.valueList = res.data.valueList;
            this.totalTimes = res.data.totalTimes;
            this.total = res.data.total;
          }
        })
        .finally(() => {
          this.drawMonths(this.optionData);
        });
    },
    preYear() {
      this.queryParams.year = this.curYear = this.queryParams.year - 1;
      this.countInYear();
    },
    nextYear() {
      this.queryParams.year = this.curYear = this.queryParams.year + 1;
      this.countInYear();
    },

    drawMonths(optionData) {
      this.yearChart = this.$echarts.init(
        document.getElementById("yearCountId")
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
          left: 25,
          // right: 0,
          //   bottom: 30,
          //   top: 60,
          height: 210,
          width: 600,
        },
        series: [
          {
            // name: optionData.total,
            type: "bar",
            data: optionData.valueList,
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
      this.yearChart.setOption(optionTrend);
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
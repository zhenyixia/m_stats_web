<template>
  <div>
    <div style="float: left; width: 650px; height: 350px">
      <div style="position: relative; float: left; margin-bottom: 0px">
        <el-button icon="el-icon-arrow-left" size="mini" type="primary" style="margin-left: 0px" :disabled="weekIndex <= -10" @click="preWeek()">上一周
        </el-button>
        <span style="margin-left: 20px">{{ weekDayScopeInfo }}</span>
        <el-button type="primary" size="mini" style="margin-left: 20px" :disabled="weekIndex>=0" @click="nextWeek()">
          下一周
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
        <span style="margin-left: 125px">运动{{ totalTimes }}次</span>
        <span style="margin-left: 50px">{{ total }}公里</span>
      </div>
      <div id="weekCountId" style="float: left; width: 100%; height: 100%; margin-top: -5px"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { deepClone } from "@/common/util";
import { countRunInOneWeek } from "@/common/httpService";
export default {
  name: "",
  data() {
    return {
      monthChart: {},
      optionData: {
        daysInWeek: ["一", "二", "三", "四", "五", "六", "日"],
        valueInWeek: [],
      },
      weekIndex: 0,
      weekDayScopeInfo: null,
      total: 0, // 本月运动总里程
      totalTimes: 0, // 本月总运动总次数
      curYearMonth: 0, //当前月，随着切换会变化
      realCurYearMonth: 0, // 真正的当前月，不会随着切换变化
    };
  },
  methods: {
    init() {
      this.countByMonth();
    },
    countByMonth() {
      countRunInOneWeek(this.weekIndex)
        .then((res) => {
          if (!res || !res.data) {
            this.$message.warning("查询不到月度数据");
          }
          if (res.status == 200 && res.data) {
            this.optionData.valueInWeek = res.data.valueList;
            this.weekDayScopeInfo = res.data.weekDayScope;
            this.totalTimes = res.data.totalTimes;
            this.total = res.data.total;
          }
        })
        .finally(() => {
          this.drawMonths(this.optionData);
        });
    },
    preWeek() {
      this.weekIndex = this.weekIndex - 1;
      this.countByMonth();
    },
    nextWeek() {
      this.weekIndex = this.weekIndex + 1;
      this.countByMonth();
    },
    drawMonths(optionData) {
      this.monthChart = this.$echarts.init(
        document.getElementById("weekCountId")
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
          data: optionData.daysInWeek,
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
          width: "94%",
        },
        series: [
          {
            // name: optionData.total,
            type: "bar",
            data: optionData.valueInWeek,
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
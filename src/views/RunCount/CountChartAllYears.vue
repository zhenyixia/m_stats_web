<template>
  <div>
    <el-dialog title="统计所有年" :visible.sync="modalShow" top="1%" width="700px" height="500px" :before-close="modalClose" class="elDialogBody">
      <div>
        <div id="allYearsCountId" style="width:650px;height:300px;"></div>
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
import { countRunAllYears } from "@/common/httpService";
export default {
  name: "",
  data() {
    return {
      modalShow: false,
      yearChart: {},
      optionData: { daysInMonth: [], kmInMonth: [], optionData: 0 },
    };
  },
  methods: {
    modalClose() {
      this.modalShow = false;
      this.optionData = [];
    },
    init() {
      this.modalShow = true;
      countRunAllYears()
        .then((res) => {
          if (!res || !res.data) {
            this.$message.warning("查询不到年度数据");
          }
          if (res.status == 200 && res.data) {
            this.optionData.daysInMonth = res.data.units;
            this.optionData.kmInMonth = res.data.valueList;
            this.optionData.total = res.data.total;
          }
        })
        .finally(() => {
          this.drawMonths(this.optionData);
        });
    },

    drawMonths(optionData) {
      this.yearChart = this.$echarts.init(
        document.getElementById("allYearsCountId")
      );
      let optionTrend = {
        color: "#c23531",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // type: "shadow"
          },
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
          left: 36,
          // right: 0,
          //   bottom: 30,
          //   top: 60,
          height: 210,
          width: 600,
        },
        series: [
          {
            name: "总计 " + optionData.total + " 公里",
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
<template>
  <div>
    <el-dialog title="录入学习时长数据" :visible.sync="modalShow" top="1%" width="70%" :before-close="modalClose" class="elDialogBody">
      <div>
        <el-table :data="tableData" style="width: 100%" highlight-current-row>
          <el-table-column size="small" type="index" label="编号" width="50%"></el-table-column>
          <el-table-column size="small" prop="learnDate" label="学习日期"></el-table-column>
          <el-table-column size="small" prop="beginTime" label="学习开始时间">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.beginTime" placeholder="12.30" @blur="beginTimeBlur(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column size="small" prop="endTime" label="学习结束时间">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.endTime" placeholder="13.00" @blur="endTimeBlur(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column size="small" prop="learnHours" label="学习时长">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.learnHours" placeholder="0.5小时" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column size="small" prop="learnContent" label="学习内容">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.learnContent" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="duplicateRow(scope.row, scope.$index)" type="text" size="small">复制一行</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: inline-block; float: center; margin-top: 20px">
          <el-button type="primary" size="small" @click="submit()">提交</el-button>
          <el-button type="primary" size="small" @click="modalClose()">取消</el-button>
          <el-button type="primary" size="small" @click="add5Row()">加5行</el-button>
          <el-button type="primary" size="small" @click="modifyContent()">修改学习内容</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="学习内容" width="30%" :visible.sync="showModifyContentDialog">
      <el-select v-model="learnContent" filterable allow-create default-first-option placeholder="JAVA-多线程/Windows-终止端口号等">
        <el-option v-for="item in learnContentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showModifyContentDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmModifyContent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/common/util";
import { addLearnData, getLearnContent } from "@/common/httpService";
export default {
  data() {
    return {
      modalShow: false,
      tableData: [],
      learnContentOptions: [],
      showModifyContentDialog: false,
      learnContent: "JAVA-多线程",
    };
  },
  methods: {
    init() {
      this.modalShow = true;
      if (this.tableData.length != 0) {
        return;
      }
      let now = new Date();
      for (let i = 0; i < 3; i++) {
        let dateStr = this.processDate(now);
        now.setDate(now.getDate() - 1);
        this.tableData.push({
          learnDate: dateStr,
          beginTime: null,
          endTime: null,
          learnHours: null,
          learnContent: this.learnContent,
        });
      }
    },
    modifyContent() {
      this.showModifyContentDialog = true;
      getLearnContent()
        .then((res) => {
          if (!res) {
            this.$message.error("查询数据为空");
          }
          if (res.status == 200 && res.data) {
            for (var learnContent of res.data) {
              this.learnContentOptions.push({
                value: learnContent,
                label: learnContent,
              });
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    confirmModifyContent() {
      for (let item of this.tableData) {
        item.learnContent = this.learnContent;
      }
      this.showModifyContentDialog = false;
    },
    add5Row() {
      let lastRow = this.tableData[this.tableData.length - 1];
      let date = lastRow.learnDate;
      let startDate = new Date(date);

      for (let i = 0; i < 5; i++) {
        let newRow = deepClone(lastRow);
        startDate.setDate(startDate.getDate() - 1);
        newRow.learnDate = startDate.toLocaleDateString();
        newRow.startTime = null;
        newRow.endTime = null;
        newRow.learnHours = null;
        this.tableData.push(newRow);
      }
    },
    duplicateRow(row, index) {
      let originData = [];
      for (let i = 0; i < this.tableData.length; i++) {
        originData.push(this.tableData[i]);
        if (i == index) {
          let newRow = deepClone(row);
          newRow.beginTime = null;
          newRow.endTime = null;
          newRow.learnHours = null;
          originData.push(newRow);
        }
      }
      this.tableData = originData;
    },
    processDate(date) {
      let dateStr = date.getFullYear() + "/";
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = day;
      }
      return dateStr + month + "/" + day;
    },
    modalClose() {
      this.modalShow = false;
      this.tableData = [];
    },
    beginTimeBlur(row) {
      let beginTime = row.beginTime;
      let endTime = row.endTime;
      if (!row.beginTime || !row.endTime) {
        return;
      }
      let beginMinutes =
        parseInt(beginTime) * 60 + parseInt(beginTime.split(".")[1]);
      let endMinutes = parseInt(endTime) * 60 + parseInt(endTime.split(".")[1]);
      let difference = endMinutes - beginMinutes;
      let hours = (difference / 60).toFixed(2);
      row.learnHours = hours;
    },
    endTimeBlur(row) {
      let beginTime = row.beginTime;
      let endTime = row.endTime;
      if (!row.beginTime || !row.endTime) {
        return;
      }
      let beginMinutes =
        parseInt(beginTime) * 60 + parseInt(beginTime.split(".")[1]);
      let endMinutes = parseInt(endTime) * 60 + parseInt(endTime.split(".")[1]);
      let difference = endMinutes - beginMinutes;
      let hours = (difference / 60).toFixed(2);
      row.learnHours = hours;
    },
    submit() {
      this.modalShow = false;
      let paramData = deepClone(this.tableData);
      let lastParamData = [];
      for (let row of paramData) {
        if (!row.beginTime || !row.endTime) {
          continue;
        }

        // let difference = row.endTime - row.beginTime;
        // let totalPart = parseInt(difference);
        // let decimalPart = parseInt(difference.split(".")[1]);
        // row.learnHours = totalPart + (decimalPart / 60).toFixed(2);
        lastParamData.push(row);
      }

      addLearnData(lastParamData)
        .then((res) => {
          if (!res) {
            this.$message.warning("提交失败");
          }
          if (res.status == 200 && res.message) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        })
        .finally(() => {
          this.$parent.$refs["learnMonthCountRef"].init();
          this.$parent.$refs["learnWeekCountRef"].init();
        });
    },
  },
};
</script>
<style scoped>
.elInput >>> .el-input__inner {
  height: 30px;
}

.elDialogBody >>> .el-dialog__body {
  padding: 8px 20px;
}
</style>
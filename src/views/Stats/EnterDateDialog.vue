<template>
  <div>
    <el-dialog title="录入时长数据" :visible.sync="moduleShow" top="1%" width="70%" :before-close="moduleClose" class="elDialogBody">
      <div>
        <el-table :data="tableData" style="width: 100%" highlight-current-row>
          <!-- <el-table-column size="small" type="index" label="编号" width="50%"></el-table-column> -->
          <el-table-column size="small" prop="address" label="地点">
            <template slot-scope="scope">
              <!-- <el-input class="elInput" v-model="scope.row.learnContent" :disabled="true"></el-input> -->
              <el-select v-model="scope.row.address" filterable allow-create default-first-option>
                <el-option v-for="item in addressOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column size="small" prop="learnContent" label="内容">
            <template slot-scope="scope">
              <!-- <el-input class="elInput" v-model="scope.row.learnContent" :disabled="true"></el-input> -->
              <el-select v-model="scope.row.learnContent" filterable allow-create default-first-option>
                <el-option v-for="item in learnContentOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column size="small" prop="learnDate" label="统计日期"></el-table-column>
          <el-table-column size="small" prop="beginTime" label="开始结束时间">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.beginEndTime" placeholder="12.30-13.20" @blur="beginEndTimeBlur(scope.row)"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column size="small" prop="beginTime" label="开始时间">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.beginTime" placeholder="12.30" @blur="beginTimeBlur(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column size="small" prop="endTime" label="结束时间">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.endTime" placeholder="13.00" @blur="endTimeBlur(scope.row)"></el-input>
            </template>
          </el-table-column> -->
          <el-table-column size="small" prop="learnHours" label="时长">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.learnHours" placeholder="0.5小时" :disabled="true"></el-input>
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
          <el-button type="primary" size="small" @click="moduleClose()">取消</el-button>
          <el-button type="primary" size="small" @click="add5Row()">加5行</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from "@/common/util";
import { addLearnData, getAddressContent } from "@/common/httpService";
export default {
  data() {
    return {
      menuId: 0,
      moduleShow: false,
      tableData: [],
      addressOptions: [],
      learnContentOptions: [],
      showModifyContentDialog: false,
    };
  },
  methods: {
    init(menuId) {
      this.moduleShow = true;
      if (this.tableData.length != 0) {
        return;
      }
      this.menuId = menuId;
      console.log("录入数据id: %s", this.menuId);

      getAddressContent(this.menuId).then((res) => {
        if (res && res.data) {
          this.addressOptions = res.data.addresses;
          this.learnContentOptions = res.data.contents;
          console.log(this.addressOptions);
          let now = new Date();
          for (let i = 0; i < 3; i++) {
            let dateStr = this.processDate(now);
            now.setDate(now.getDate() - 1);
            this.tableData.push({
              menuId: this.menuId,
              address: this.addressOptions[0],
              learnContent: this.learnContentOptions[0],
              learnDate: dateStr,
              beginTime: null,
              endTime: null,
              learnHours: null,
            });
          }
        }
      });
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
    moduleClose() {
      this.moduleShow = false;
      this.tableData = [];
    },
    beginEndTimeBlur(row) {
      let beginEndTime = row.beginEndTime;
      if (!beginEndTime) {
        return;
      }
      if (beginEndTime.indexOf("-") == -1) {
        this.$message.warning("时间格式应该为： 13.20-14.30");
        return;
      }
      let beginEndTimes = beginEndTime.split("-");

      let beginTime = (row.beginTime = beginEndTimes[0]);
      let endTime = (row.endTime = beginEndTimes[1]);
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
      this.moduleShow = false;
      let paramData = deepClone(this.tableData);
      let lastParamData = [];
      for (let row of paramData) {
        if (!row.beginTime || !row.endTime || !row.menuId) {
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
          this.$parent.init();
          this.$parent.$refs["monthCountRef"].init();
          this.$parent.$refs["weekCountRef"].init();
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


// WEBPACK FOOTER //
// src/views/Stats/EnterDateDialog.vue
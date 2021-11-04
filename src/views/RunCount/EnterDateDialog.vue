<template>
  <div>
    <el-dialog title="录入数据" :visible.sync="modalShow" top="1%" width="70%" :before-close="modalClose" class="elDialogBody">
      <div>
        <el-table :data="tableData" style="width: 100%" highlight-current-row>
          <el-table-column size="small" type="index" label="编号" width="50%"></el-table-column>
          <el-table-column size="small" prop="runDate" label="跑步日期"></el-table-column>
          <el-table-column size="small" prop="kilometer" label="跑步距离">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.kilometer"></el-input>
            </template>
          </el-table-column>
          <el-table-column size="small" prop="runSecond" label="跑步时长">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.runSecond"></el-input>
            </template>
          </el-table-column>
          <el-table-column size="small" prop="address" label="跑步地点">
            <template slot-scope="scope">
              <el-input class="elInput" v-model="scope.row.address" :disabled="true"></el-input>
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
          <el-button type="primary" size="small" @click="modifyAddress()">修改跑点</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="跑步地址" width="30%" :visible.sync="showModifyAddressDialog">
      <el-select v-model="runAddress" filterable allow-create default-first-option placeholder="请选择或输入一个新的">
        <el-option v-for="item in runAddressOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showModifyAddressDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmModifyAddress">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/common/util";
import { addRunData, getRunAddressed } from "@/common/httpService";
export default {
  data() {
    return {
      modalShow: false,
      tableData: [],
      runAddressOptions: [],
      showModifyAddressDialog: false,
      runAddress: "西安市高新区东滩社区",
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
          runDate: dateStr,
          kilometer: null,
          runSecond: null,
          address: this.runAddress,
        });
      }
    },
    modifyAddress() {
      this.showModifyAddressDialog = true;
      getRunAddressed()
        .then((res) => {
          if (!res) {
            this.$message.error("查询数据为空");
          }
          if (res.status == 200 && res.data) {
            for (var address of res.data) {
              this.runAddressOptions.push({ value: address, label: address });
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    confirmModifyAddress() {
      for (let item of this.tableData) {
        item.address = this.runAddress;
      }
      this.showModifyAddressDialog = false;
    },
    add5Row() {
      let originData = [];
      let lastRow = this.tableData[this.tableData.length - 1];
      let date = lastRow.runDate;
      let startDate = new Date(date);

      for (let i = 0; i < 5; i++) {
        let newRow = deepClone(lastRow);
        startDate.setDate(startDate.getDate() - 1);
        newRow.runDate = startDate.toLocaleDateString();
        newRow.kilometer = null;
        newRow.runSecond = null;
        this.tableData.push(newRow);
      }
    },
    duplicateRow(row, index) {
      let originData = [];
      for (let i = 0; i < this.tableData.length; i++) {
        originData.push(this.tableData[i]);
        if (i == index) {
          let newRow = deepClone(row);
          newRow.kilometer = null;
          newRow.runSecond = null;
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
    submit() {
      this.modalShow = false;
      let paramData = deepClone(this.tableData);
      let lastParamData = [];
      for (let row of paramData) {
        if (!row.runSecond || !row.kilometer) {
          continue;
        }
        let runSecond = row.runSecond;
        row.runSecond = this.calcActualSeconds(runSecond);
        let kilometer = row.kilometer;
        let secondsByKm = (row.runSecond / kilometer).toFixed(0);
        row.timeByKm = this.calcMinSec(secondsByKm);
        row.kmByHour = Math.round(
          (row.kilometer / row.runSecond) * 3600
        ).toFixed(2);
        lastParamData.push(row);
      }

      addRunData(lastParamData)
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
          this.$parent.$refs["runWeekCountRef"].init();
          this.$parent.$refs["runMonthCount"].init();
        });
    },
    calcActualSeconds(runSecond) {
      let minute = parseInt(runSecond);
      let second = (runSecond - minute).toFixed(2) * 100;
      return minute * 60 + second;
    },
    calcMinSec(secondsByKm) {
      let minute = secondsByKm / 60;
      let minuteInt = parseInt(minute);
      let second = Math.round((minute - minuteInt) * 60);
      return minuteInt + "分" + second + "秒";
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
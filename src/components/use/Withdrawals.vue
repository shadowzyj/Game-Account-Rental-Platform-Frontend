<template>
  <el-row>
    <el-col>
      <el-card class="box-card">
        <el-col class="card-header">
          <h1>当前余额:{{ money }}</h1>
          <!-- <el-botton class="button" tyep="text">确认充值</el-botton> -->
        </el-col>
        <el-col>
          <el-form ref="rechageFormRef" :model="rechageForm" label-width="80px">
            <el-form-item label="提款金额">
              <el-radio-group v-model="rechageForm.resource">
                <el-radio
                  v-for="it in moneyList"
                  :key="it"
                  :label="it"
                ></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即提款</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-card>
    </el-col>
    <el-col>
      <el-card class="box-card">
        <el-col class="card-header">
          <h1>提款记录</h1>
        </el-col>
        <el-table
          :data="
            bankList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
          "
          :pager="pageSize"
          style="width: 100%"
        >
          <el-table-column prop="uid" label="单号" width="180">
          </el-table-column>
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="money" label="提款金额" width="180">
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        >
        </el-pagination>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts">
export default {
  created() {
    this.getMoney(window.sessionStorage.getItem("uid"));
    this.getBankList(window.sessionStorage.getItem("uid"));
  },
  data() {
    return {
      money: 0.0,
      moneyList: [30, 50, 100, 200],
      rechageForm: {
        resource: 0,
      },
      listFlag: false,
      bankList: [],
      count: 30,
      loading: false,
      pageSize: 5,
      totalPage: 5,
      currentPage: 1,
    };
  },
  methods: {
    async getMoney(uid) {
      console.log(uid);
      const { data: res } = await this.$http.post("/bankLog/getMoney", {
        uid: uid,
      });
      if (res.state != 200) return this.$message.error("拉取余额失败");
      this.money = res.money;
    },
    async onSubmit() {
      var uid = window.sessionStorage.getItem("uid");
      console.log(this.rechageForm.resource);
      const { data: res } = await this.$http.post("/bankLog/withdrawals", {
        uid: uid,
        money: this.rechageForm.resource,
      });
      if (res.state != 200) return this.$message.error("提款失败");
      this.getMoney(uid);
      this.getBankList(uid);
    },
    async getBankList(uid) {
      console.log(uid);
      const { data: res } = await this.$http.post("/bankLog/getWithdrawalsList", {
        uid: uid,
      });
      if (res.state != 200) {
        this.listFlag = false;
        return;
      }
      this.listFlag = true;
      this.bankList = res.bankLogList;
      this.totalPage = res.bankLogList.length;
      console.log(this.totalPage);
    },
    handleCurrentChange: function (currentPage) {
      console.log(currentPage);
      this.currentPage = currentPage;
    },
    handleSizeChange:function(pageSize){
      this.pageSize = pageSize;
    }
  },
};
</script>

<style>
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 80%;
}
</style>
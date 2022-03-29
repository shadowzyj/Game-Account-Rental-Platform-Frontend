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
            <el-form-item label="充值金额">
              <el-radio-group v-model="rechageForm.resource">
                <el-radio
                  v-for="it in moneyList"
                  :key="it"
                  :label="it"
                ></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即充值</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="testSubmit">test</el-button>
            </el-form-item> -->
          </el-form>
        </el-col>
      </el-card>
    </el-col>
    <el-col>
      <el-card class="box-card">
        <el-col class="card-header">
          <h1>充值记录</h1>
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
          <el-table-column prop="money" label="充值金额" width="180">
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
    <el-col>
      <div v-html="alipayWap" ref="alipayWap"></div>
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
      moneyList: [0.01,30, 50, 100, 200,500],
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
      alipayWap: "",
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
      const { data: res } = await this.$http.post("/bankLog/recharge", {
        uid: uid,
        money: this.rechageForm.resource,
      });
      // if (res.state != 200) return this.$message.error("充值失败");
      const divForm = document.getElementsByTagName("div");
      if (divForm.length) {
        document.body.removeChild(divForm[0]);
      }
      const div = document.createElement("div");
      //将后台响应回来的数据,填写进行页面中进行回显(支付二维码)
      div.innerHTML = res; // data就是接口返回的form 表单字符串
      //将元素在页面中显示
      document.body.appendChild(div);
      document.forms[0].setAttribute("target", "_blank"); // 新开窗口跳转
      document.forms[0].submit();
      this.getMoney(uid);
      this.getBankList(uid);
    },
    async getBankList(uid) {
      //console.log(uid);
      const { data: res } = await this.$http.post("/bankLog/getRechargeList", {
        uid: uid,
      });
      //console.log(res);
      if (res.state != 200) {
        this.listFlag = false;
        return;
      }
      this.listFlag = true;
      this.bankList = res.bankLogList;
      this.totalPage = res.bankLogList.length;
      //console.log(this.totalPage);
    },
    handleCurrentChange: function (currentPage) {
      //console.log(currentPage);
      this.currentPage = currentPage;
    },
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
    },
    async testSubmit() {
      const { data: res } = await this.$http.post("/gotopay");
      //console.log(res);
      const divForm = document.getElementsByTagName("div");
      if (divForm.length) {
        document.body.removeChild(divForm[0]);
      }
      const div = document.createElement("div");
      //将后台响应回来的数据,填写进行页面中进行回显(支付二维码)
      div.innerHTML = res; // data就是接口返回的form 表单字符串
      //将元素在页面中显示
      document.body.appendChild(div);
      document.forms[0].setAttribute("target", "_blank"); // 新开窗口跳转
      document.forms[0].submit();
    },
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
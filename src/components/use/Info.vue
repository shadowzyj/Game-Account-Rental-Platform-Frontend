<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
        </div>
        <el-descriptions
          :title="screenName"
          direction="vertical"
          :column="1"
          border
        >
          <el-descriptions-item label="邮箱">{{ email }}</el-descriptions-item>
          <el-descriptions-item label="VIP等级">{{
            vipName
          }}</el-descriptions-item>
          <el-descriptions-item label="账户余额">{{
            money
          }}</el-descriptions-item>
          <el-descriptions-item label="是否实名">{{
            isRealName
          }}</el-descriptions-item>
          <el-descriptions-item label="账号信誉">
            <el-rate
              v-model="value"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            >
            </el-rate>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <el-row>
        <el-col :span="12">
          <el-card class="small-card" shadow="hover">
            <div slot="header" class="clearfix">
              <h1>总收益</h1>
            </div>
            <div class="text item">
              <h1>¥&nbsp&nbsp{{ incomeTotal }}</h1>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="small-card" shadow="hover">
            <div slot="header" class="clearfix">
              <h1>今日收益</h1>
            </div>
            <div class="text item">
              <h1>¥&nbsp&nbsp{{ incomeToday }}</h1>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-card class="small-card" shadow="hover">
            <div slot="header" class="clearfix">
              <h1>总上架数</h1>
            </div>
            <div class="text item">
              <h1>{{ upNumber }}</h1>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="small-card" shadow="hover">
            <div slot="header" class="clearfix">
              <h1>总租用数</h1>
            </div>
            <div class="text item">
              <h1>{{ rentNumber }}</h1>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  created() {
    this.getInfo(window.sessionStorage.getItem("uid"));
    this.getIncomeTotal(window.sessionStorage.getItem("uid"));
    this.getIncomeToday(window.sessionStorage.getItem("uid"));
  },
  data() {
    return {
      email: "admin",
      screenName: "",
      profilePhoto: "",
      vipName: "",
      money: 0.0,
      isRealName: "否",
      tableData: [],
      countData: [
        {
          value: 100,
          name: "testName",
        },
      ],
      upNumber: 0,
      rentNumber: 0,
      value: 5,
      incomeTotal: 0.0,
      incomeToday: 0.0,
    };
  },
  methods: {
    async getInfo(uid) {
      console.log(uid);
      const { data: res } = await this.$http.post("/user/getInfo", {
        uid: uid,
      });
      if (res.state != 200) return this.$message.error("拉取信息失败");
      console.log(res);
      this.email = res.user.email;
      this.screenName = res.user.screenName;
      this.profilePhoto = res.user.profilePhoto;
      this.vipName = res.vipName;
      this.money = res.user.money;
      this.isRealName = res.isRealName;
      this.upNumber = res.upNumber;
      this.rentNumber = res.rentNumber;
      this.value = Math.min(5, res.user.vipLevel + 2);
      //console.log(this.rentNumber);
    },
    async getIncomeTotal(uid) {
      const { data: res } = await this.$http.post("/gameLog/getMyIncome", {
        uid: uid,
      });
      if (res.state != 200) return this.$message.error("信息拉取失败");
      this.incomeTotal = res.income;
    },
        async getIncomeToday(uid) {
      const { data: res } = await this.$http.post("/gameLog/getMyIncomeToday", {
        uid: uid,
      });
      if (res.state != 200) return this.$message.error("信息拉取失败");
      this.incomeToday = res.income;
    },
  },
});
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  /* width: 480px; */
  width: 100%;
}
.clearfix {
  font-size: 16px;
  font-weight: 700;
}
.small-card {
  margin-bottom: 20px;
  margin-right: 20px;
}
</style>
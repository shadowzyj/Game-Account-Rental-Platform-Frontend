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
        </el-descriptions>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <el-row>
        <el-col :span="12">
          <el-card class="small-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>今日收益</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="small-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>昨日收益</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-card class="small-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>总上架数</span>
            </div>
            <div class="text item">
              <span>{{ upNumber }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="small-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>总租用数</span>
            </div>
            <div class="text item">
              <span>{{ rentNumber }}</span>
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

      //console.log(this.rentNumber);
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
<template>
  <el-card class="box-card">
    <el-col class="card-header">
      <h1>我的购物车</h1>
      <el-form ref="buyForm" :inline="true" class="demo-form-inline">
        <el-button type="text">租借天数</el-button>
        <el-input-number
          v-model="days"
          @change="handleChange"
          :min="1"
          :max="10"
          label="购买天数"
        ></el-input-number>
        <el-form-item class="btns" style="text-align: center">
          <el-button type="primary" @click="buyList()">购买</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      :data="
        gameList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      ref="multipleTable"
      :pager="pageSize"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="uid" label="上架编号" width="80" type="selection">
      </el-table-column>
      <el-table-column prop="game_id" label="游戏账号" width="180">
      </el-table-column>
      <el-table-column prop="game_describe" label="账号描述" width="180">
      </el-table-column>
      <el-table-column prop="unit_price" label="单日租金" width="80">
      </el-table-column>
      <el-table-column prop="deposit" label="押金" width="80">
      </el-table-column>
      <el-table-column
        prop="game_type_name"
        label="游戏类别"
        width="180"
        :filters="gameTypeFilters"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >移出购物车</el-button
          >
        </template>
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
</template>
<script lang="ts">
export default {
  created() {
    this.getGameTypeList();
    this.getMyWantList();
  },
  data() {
    return {
      gameList: [],
      totalPage: 0,
      currentPage: 1,
      pageSize: 5,
      gameTypeList: [],
      gameTypeFilters: [],
      multipleSelection: [],
      days: 1,
    };
  },
  methods: {
    async getGameTypeList() {
      const { data: res } = await this.$http.get("/gameType/list");
      this.listSize = res.gameTypeList.length;
      for (let i = 0; i < this.listSize; i++) {
        this.gameTypeList.push(res.gameTypeList[i].gameTypeName);
      }
      res.gameTypeList.forEach((element) => {
        this.gameTypeFilters.push({
          text: element.gameTypeName,
          value: element.gameTypeName,
        });
      });
      console.log(this.gameTypeList);
      console.log(this.gameTypeFilters);
    },
    async getMyWantList() {
      var uid = window.sessionStorage.getItem("uid");
      const { data: res } = await this.$http.post("/gameInfo/getMyWantList", {
        uid: uid,
      });
      if (res.state != 200) return this.$message.error("数据拉取失败");
      console.log(res.gameList);
      this.gameList = res.gameList;
      this.totalPage = this.gameList.length;
      console.log(res.gameList);
      console.log(this.gameList);
    },
    handleCurrentChange: function (currentPage) {
      console.log(currentPage);
      this.currentPage = currentPage;
    },
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
    },
    async handleClick(row) {
      console.log(row);
      var uid = window.sessionStorage.getItem("uid");
      const { data: res } = await this.$http.post(
        "/gameInfo/removeItemFromWantList",
        { uid:uid, itemId: row.uid }
      );
      if (res.state != 200) this.$message.error("移除失败");
      else this.$message.success("成功移除");
      this.getMyWantList();
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    async buyList() {
      console.log(this.multipleSelection);
      if (this.multipleSelection.length == 0)
        return this.$message.info("请选中最少一个购物车内商品");
      var uid = window.sessionStorage.getItem("uid");
      var wantList = [];
      this.multipleSelection.forEach((element) => {
        wantList.push(element.uid);
      });
      console.log(wantList);
      const { data: res } = await this.$http.post("/gameInfo/buyMyWantList", {
        uid: uid,
        list: wantList,
        days: this.days,
      });
      if (res.state != 200 && res.state != 201)
        return this.$message.error("余额不足，购买失败");
      if (res.state == 201) this.$message.info("部分商品已被他人购买,或余额不足");
      else {
        this.$message.success("全部购买成功");
      }
      this.getMyWantList();
    },
    handleChange(value) {
      console.log(this.days);
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
<template>
  <el-card class="box-card">
    <el-col class="card-header">
      <h1>我的出租历史</h1>
    </el-col>
    <el-table
      :data="
        gameList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      :pager="pageSize"
      :default-sort="{ prop: 'uid', order: 'descending' }"
      style="width: 100%"
    >
      <el-table-column prop="uid" label="上架编号" width="80" sortable>
      </el-table-column>
      <el-table-column prop="game_id" label="游戏账号" width="160">
      </el-table-column>
      <el-table-column prop="game_password" label="账号密码" width="160">
      </el-table-column>
      <el-table-column prop="unit_price" label="单日租金" width="60">
      </el-table-column>
      <el-table-column prop="deposit" label="押金" width="60">
      </el-table-column>
      <el-table-column
        prop="game_type_name"
        label="游戏类别"
        width="90"
        :filters="gameTypeFilters"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column prop="loan_date" label="起始时间" width="180">
      </el-table-column>
      <el-table-column prop="return_date" label="归还时间" width="180">
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
    this.getAllItemList();
  },
  data() {
    return {
      gameList: [],
      totalPage: 0,
      currentPage: 1,
      pageSize: 5,
      gameTypeList: [],
      gameTypeFilters: [],
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
    async getAllItemList() {
      var uid = window.sessionStorage.getItem("uid");
      const { data: res } = await this.$http.post(
        "/gameInfo/getMyRentGameList",
        { uid: uid }
      );
      if (res.state != 200) return this.$message.error("数据拉取失败");
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
        "/gameInfo/addItemToWantList",
        { uid: uid, itemId: row.uid }
      );
      if (res.state != 200) return this.$message.error("添加失败");
      return this.$message.success("已添加到购物车");
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
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
  width: 100%;
}
</style>
<template>
  <el-card class="box-card">
    <el-col class="card-header">
      <h1>商品修改</h1>
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
          <el-switch
            style="display: block"
            v-model="scope.row.game_info_up_flag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="上架"
            inactive-text="下架"
            @change="handleSwitch(scope.row)"
            :active-value="true"
            :inactive-value="false"
          >
          </el-switch>
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
    this.getAllItemList();
    this.getWantListNumber();
  },
  data() {
    return {
      gameList: [],
      totalPage: 0,
      currentPage: 1,
      pageSize: 5,
      gameTypeList: [],
      gameTypeFilters: [],
      listSize: 0,
      wantListNumber:0,
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
      const { data: res } = await this.$http.post("/gameInfo/getAllGameList");
      if (res.state != 200) return this.$message.error("数据拉取失败");
      this.gameList = res.gameList;
      this.totalPage = this.gameList.length;
      console.log(res.gameList);
      //console.log(this.gameList);
    },
    handleCurrentChange: function (currentPage) {
      console.log(currentPage);
      this.currentPage = currentPage;
    },
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    gotoWantList() {
      this.$router.push({ path: "/use/wantList" });
    },
    async getWantListNumber(){
      var uid = window.sessionStorage.getItem("uid");
      const {data:res} = await this.$http.post("/gameInfo/getWantListNumber",{uid:uid});
      if(res.state!=200) return this.$message.error("拉取信息失败");
      this.wantListNumber = res.wantListNumber;
    },
      async handleSwitch(row) {
      console.log(row.game_info_up_flag);
      const {data:res} = await this.$http.post("/gameInfo/switchGameUpFlag",{uid:row.uid,game_info_up_flag:row.game_info_up_flag});
      console.log(res);
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
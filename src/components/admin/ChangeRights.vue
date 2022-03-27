<template>
  <el-card class="box-card">
    <el-col class="card-header">
      <h1>权限修改</h1>
    </el-col>
    <el-table
      :data="
        userList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      :pager="pageSize"
      :default-sort="{ prop: 'uid', order: 'descending' }"
      style="width: 100%"
    >
      <el-table-column prop="uid" label="用户uid" width="80" sortable>
      </el-table-column>
      <el-table-column prop="email" label="注册邮箱" width="180">
      </el-table-column>
      <el-table-column prop="registration_date" label="注册时间" width="180">
      </el-table-column>
      <el-table-column prop="screen_name" label="昵称" width="80">
      </el-table-column>
      <el-table-column
        prop="vip_name"
        label="会员等级"
        width="180"
        :filters="userTypeFilters"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-select v-model="scope.vip_name" placeholder="权限修改" @change="((value)=>selectChange(value,scope.row))">
            <el-option
              v-for="it in (listSize-1)"
              :label="userTypeList[it - 1]"
              :value="it - 1"
            ></el-option>
          </el-select>
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
    this.getVipNameList();
    this.getAllUserList();
  },
  data() {
    return {
      userList: [],
      totalPage: 0,
      currentPage: 1,
      pageSize: 5,
      userTypeList: [],
      userTypeFilters: [],
      listSize: 0,
    };
  },
  methods: {
    async getVipNameList() {
      const { data: res } = await this.$http.get("/user/getVipList");
      this.listSize = res.vipList.length;
      for (let i = 0; i < this.listSize; i++) {
        this.userTypeList.push(res.vipList[i].vipName);
      }
      res.vipList.forEach((element) => {
        this.userTypeFilters.push({
          text: element.vipName,
          value: element.vipName,
        });
      });
    },
    async getAllUserList() {
      const { data: res } = await this.$http.post("/user/getAllUserList");
      if (res.state != 200) return this.$message.error("数据拉取失败");
      this.userList = res.userList;
      this.totalPage = this.userList.length;
      console.log(this.userList);
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
    async selectChange(value,row){
      console.log(row);
      console.log(value);
      const {data:res} = await this.$http.post("/user/changeVip",{uid:row.uid,vipLevel:value+1});
      if(res.state!=200) return this.$message.error("权限修改失败");
      this.$message.success("权限修改成功");
      this.getAllUserList();
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
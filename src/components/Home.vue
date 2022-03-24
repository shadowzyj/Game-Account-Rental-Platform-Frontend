<template>
  <el-container class="common-layout">
    <el-header>
      <div>
        <img class="profile_photo" src="../assets/logo.png" alt="头像" />
      </div>
      <span>游戏账号租赁平台</span>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- <h5 class="mb-2">Custom colors</h5> -->
        <el-menu
          active-text-color="#66b1ff"
          background-color="#545c64"
          text-color="#fff"
          :router="true"
          :default-active="defaultActivePath"
        >
          <!-- 一级菜单栏 -->
          <el-submenu :index="item.mainMenuPath" v-for="item in menuList" :key="item.mainMenuId">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.mainMenuTitle}}</span>
            </template>
            <!-- 二级菜单栏 -->
            <el-menu-item :index="item.mainMenuPath+sub.subMenuPath"  v-for="sub in item.list" :key="sub.subMenuId"
              @click="saveDefaultActivePath(item.mainMenuPath+sub.subMenuPath)">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{sub.subMenuTitle}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    //查询菜单列表
    this.getMenuList();
    this.defaultActivePath = window.sessionStorage.getItem("defaultActivePath");
  },
  data(){
    return {
      menuList:[],
      defaultActivePath:"/use/info",
    }
  },
  methods: {
    logout() {
      //清除所有的session
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const vipLevel = this.$cookie.get("userVipLevel");
      //console.log(vipLevel);
      const {data:res} = await this.$http.post("/mainMenu/getMenu",{'vipLevel':vipLevel});
      console.log(res);
      if(res.state!=200) return this.$message.error("初始化列表失败");
      this.menuList = res.mainMenu;
    },
    saveDefaultActivePath(defaultActivePath){
      window.sessionStorage.setItem("defaultActivePath",defaultActivePath);
      this.defaultActivePath = defaultActivePath;
    },
  },
};
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0%;
  color: #fff;
  font-size: 20px;
  align-items: center;
}
.el-aside {
  background-color: #545c64;

}
.el-aside .el-menu{
    border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.common-layout {
  height: 100%;
}
.profile_photo {
  width: 50px;
  height: 50px;
}
</style>
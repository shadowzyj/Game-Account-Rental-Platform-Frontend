import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入Login.vue组件
import Login from '../components/Login.vue' 
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Info from '../components/use/Info.vue'
import BuyHistory from '../components/use/BuyHistory.vue'
import DownItem from '../components/use/DownItem.vue'
import Items from '../components/use/Items.vue'
import Recharge from '../components/use/Recharge.vue'
import RentHistory from '../components/use/RentHistory.vue'
import UpItem from '../components/use/UpItem.vue'
import WantList from '../components/use/WantList.vue'
import Withdrawals from '../components/use/Withdrawals.vue'

import UserList from '../components/admin/UserList.vue'
import ChangeItem from '../components/admin/ChangeItem.vue'
import ChangeRights from '../components/admin/ChangeRights.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect:"/login"
  },
  {
    path:"/login",
    component: Login
  },
  {
    path:"/home",
    component:Home,
    redirect:"/use/info",
    children:[
      {
        path:"/use/info",
        component: Info,
      },
      {
        path:"/use/items",
        component: Items,
      },
      {
        path:"/use/upItem",
        component: UpItem,
      },
      {
        path:"/use/buyHistory",
        component: BuyHistory,
      },
      {
        path:"/use/rentHistory",
        component: RentHistory,
      },
      {
        path:"/use/wantList",
        component: WantList,
      },
      {
        path:"/use/recharge",
        component: Recharge,
      },
      {
        path:"/use/withdrawals",
        component: Withdrawals,
      },
      {
        path:"/use/downItem",
        component: DownItem,
      },
      {
        path:"/admin/userList",
        component:UserList,
      },

      {
        path:"/admin/changeRights",
        component: ChangeRights,
      },
      {
        path:"/admin/changeItem",
        component: ChangeItem,
      },
    ]
  },
  {
    path:"/register",
    component:Register
  },
]


const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to 将要访问
  // from 从哪里访问
  // next 重定向到next(url)上,当next()中url为空时访问to
  if(to.path=='/login' || to.path=='/register') return next();
  const userSession = window.sessionStorage.getItem("user");//取出当前用户
  if(!userSession) return next("/login"); //未登录用户需要登录
  //const vipLevel = this.$cookie.get("userVipLevel");
  //console.log(vipLevel);
  //if(vipLevel<3) return next("/home");
  next();//登录用户访问任意页面
})

export default router

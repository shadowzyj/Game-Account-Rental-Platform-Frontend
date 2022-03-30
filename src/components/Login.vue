<template>
    <div class="login_container">
        <!-- 登录模块 -->
        <div class="login_box">
            <!-- 图标栏 -->
            <div class = "avater_box" style="text-align:center">
                <h1>游戏账号租赁平台</h1>
                <!-- <img :src="imgurl" alt=""> -->
            </div>
            <!-- 登录表单 -->
            <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_from" label-width="0">
                <!-- 用户名 -->
                <el-form-item prop="email">
                    <el-input v-model="loginForm.email" prefix-icon="iconfont icon-user"/>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-password"/>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="loginForm.code" prefix-icon="iconfont icon-password" style="width:60%"/>
                    <el-image style="width: 30%;height: 30px;" src="/api/user/render" fit="cover"></el-image>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns" style="text-align:center">
                    <el-button type="primary" @click="login()">登录</el-button>
                    <el-button type="info" @click="resetLoginForm()">重置</el-button>
                    <el-button type="info" @click="register()">去注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default{
    created(){
        //this.getCode();
    },
    data(){
        var checkEmail = (rule, value, cb) => {undefined
            // 邮箱正则表达式
            const regEmail =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){undefined
            return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        };
        return {
            loginForm:{
                email:"admin@163.com",
                password:"admin123",
                code:"",
            },
            loginRules:{
                email:[
                    {required:true, message:'请输入登录邮箱',trigger:'blur'},
                    {min:3, max:50, message:'长度不小于3个字符',trigger:'blur'},
                    {validator: checkEmail, trigger: 'blur'},
                ],
                password:[
                    {required:true, message:'请输入用户密码',trigger:'blur'},
                    {min:6,max:30,message:'长度不小于6字符且不大于30字符',trigger:'blur'},
                ],
            },
            imgurl:"",
        }
    },
    methods:{
        async getCode(){
            const {data:res} = await this.$http.get("/user/render");
            //this.imgurl = 'data:image/jpeg;base64,'+res;
            let blob = new Blob([res],{type:"image/jpeg"});
            this.imgurl = window.URL.createObjectURL(blob);
            //console.log(this.imgurl);
        },
        //重置表单内容
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        register(){
            this.$router.push({path:"/register"});
        },
        login(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$http.post("/user/login",this.loginForm);
                //console.log(res);
                if(res.state == 200){
                    //console.log(res.user);
                    this.$cookie.set("userUid",res.user.uid);
                    this.$cookie.set("userEmail",res.user.email);
                    this.$cookie.set("userScreenName",res.user.screenName);
                    this.$cookie.set("userVipLevel",res.user.vipLevel);
                    window.sessionStorage.setItem("user",res.user);
                    window.sessionStorage.setItem("uid",res.user.uid);
                    //console.log(this.$cookie.get("userVipLevel"));
                    if(res.user.vipLevel<3){
                        this.$message.success("用户登录成功");
                        this.$router.push({path:"/home"});
                    }
                    else{
                        this.$message.success("管理员登录成功");
                        this.$router.push({path:"/home"});
                    }
                    
                }
                else if(res.state==400){
                    this.$message.error("验证码错误");
                }
                else if(res.state==401){
                    this.$message.error("邮箱不存在");
                }
                else{
                    this.$message.error("登陆失败");
                }
            })
        }
    },
}
</script>

<style scoped>
.login_container{
    background-color: #f4f4f5;
    height: 100%;
}
.login_box{
    width:450px;
    height:350px;
    background-color:  #c8c9cc;
    border: radius 8px;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);


}

.login_from{
    position:absolute;
    bottom: 0%;
    width: 100%;
    padding:0 10px;
    box-sizing: border-box;
}

</style>

<template>
    <div class="register_container">
        <!-- 登录模块 -->
        <div class="register_box">
            <!-- 图标栏 -->
            
            <div class = "avater_box" style="text-align:center">
                <h1>注册账号</h1>
            </div>

            <!-- 登录表单 -->
            <el-form ref="registerFormRef" :rules="registerRules" :model="registerForm" class="register_from" label-width="0">
                <!-- 注册邮箱 -->
                <el-form-item prop="email">
                    <el-input v-model="registerForm.email" prefix-icon="iconfont icon-user"/>
                </el-form-item>
                <el-form-item prop="screenName">
                    <el-input v-model="registerForm.screenName" prefix-icon="iconfont icon-user"/>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="registerForm.password" type="password" prefix-icon="iconfont icon-password"/>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns" style="text-align:center">
                    <el-button type="primary" @click="login">去登录</el-button>
                    <el-button type="info" @click="resetLoginForm()">重置</el-button>
                    <el-button type="info" @click="register()">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default{
    data(){
        return {
            registerForm:{
                email:"admin@163.com",
                screenName:"管理员",
                password:"admin123"
            },
            registerRules:{
                email:[
                    {required:true, message:'请输邮箱作为登录',trigger:'blur'},
                    {min:3, max:50, message:'长度不小于3个字符',trigger:'blur'},
                ],
                screenName:[
                    {required:true, message:'请输入用户昵称',trigger:'blur'},
                    {min:3, max:50, message:'长度不小于3个字符',trigger:'blur'},
                ],
                password:[
                    {required:true, message:'请输入用户密码',trigger:'blur'},
                    {min:6, max:50, message:'长度不小于6字符',trigger:'blur'},
                ],
            },
        }
    },
    methods:{
        //重置表单内容
        resetLoginForm(){
            this.$refs.registerFormRef.resetFields();
        },
        register(){
            this.$refs.registerFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$http.post("/user/register",this.registerForm);
                if(res == "OK"){
                    this.$message.success("注册成功");
                    this.$router.push({path:"/login"});
                }
                else{
                    this.$message.error("邮箱已被使用");
                }
            })
        },
        login(){
            this.$router.push({path:"/login"});
        }
    },
}
</script>

<style scoped>
.register_container{
    background-color: #f4f4f5;
    height: 100%;
}
.register_box{
    width:450px;
    height:350px;
    background-color:  #c8c9cc;
    border: radius 8px;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);


}

.register_from{
    position:absolute;
    bottom: 0%;
    width: 100%;
    padding:0 10px;
    box-sizing: border-box;
}

</style>

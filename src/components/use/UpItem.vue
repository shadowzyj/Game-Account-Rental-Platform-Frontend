<template>
  <el-form ref="formRef" :model="form" label-width="100px">
    <el-form-item label="游戏账号">
      <el-input v-model="form.gameId"></el-input>
    </el-form-item>
    <el-form-item label="游戏密码">
      <el-input v-model="form.gamePassword"></el-input>
    </el-form-item>
    <el-form-item label="单日价格">
      <el-input-number v-model="form.unitPrice" @change="handleChange" :min="1" label="单日价格"></el-input-number>
    </el-form-item>
    <el-form-item label="押金">
      <el-input-number v-model="form.deposit" :min="50" :max="1000" label="押金"></el-input-number>
    </el-form-item>
    <el-form-item label="选择游戏分区">
      <el-select v-model="form.gameType" placeholder="选择游戏分区">
        <el-option
          v-for="it in listSize"
          :label="gameTypeList[it - 1]"
          :value="it - 1"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="账号描述">
      <el-input type="textarea" v-model="form.gameDescribe"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">立即创建</el-button>
      <el-button @click="resetForm()">重置表单</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
export default {
  created() {
    this.getGameTypeList();
  },
  data() {
    return {
      gameTypeList: [],
      listSize: 1,
      form: {
        gameId: "",
        gamePassword: "",
        gameType: 0,
        gameDescribe: "",
        unitPrice: 1,
        deposit:50,
        ownerUid:0,
      },
    };
  },
  methods: {
    async getGameTypeList() {
      const { data: res } = await this.$http.get("/gameType/list");
      this.listSize = res.gameTypeList.length;
      for (let i = 0; i < this.listSize; i++) {
        this.gameTypeList.push(res.gameTypeList[i].gameTypeName);
      }
      this.form.ownerUid = window.sessionStorage.getItem("uid");
      console.log(this.gameTypeList);
      console.log(this.listSize);
    },
    onSubmit() {
      this.$refs.formRef.validate(async valid =>{
        if(!valid) return;
        const {data:res} = await this.$http.post("/gameInfo/upGameInfo",this.form);
        if(res.state!=200) return this.$message.error("上架失败");
        this.$message.success("上架成功");
        this.$router.push({path:"/use/downItem"});
      })
    },
    resetForm() {
      console.log("reset");
      this.$refs.formRef.resetFields();
    },
    handleChange(value){
      // console.log(value);
    },
  },
};
</script>
<style scoped>
</style>
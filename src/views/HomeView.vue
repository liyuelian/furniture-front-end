<template>
  <div>
    <!--增加按钮和搜索框-->
    <div style="margin:10px 5px">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button>其他</el-button>
    </div>
    <div style="margin:10px 5px">
      <el-input v-model="search" style="width: 30%" placeholder="请输入关键字"/>
      <el-button style="margin-left: 10px" type="primary">查找</el-button>
    </div>

    <!--表格-->
    <el-table :data="tableData" stripe style="width: 90%">
      <!--sortable可以排序，有升序，降序，默认排序三种状态-->
      <el-table-column prop="id" label="ID" sortable></el-table-column>
      <el-table-column prop="name" label="家居名"></el-table-column>
      <el-table-column prop="maker" label="厂商"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="sales" label="销量"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small"
                     @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button link type="primary" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加家居的弹窗
      1.el-dialog v-model="dialogVisible" 表示对话框，
            和 dialogVisible 变量双向绑定，控制是否显示对话框
      2.el-form:mode="form" 表示表单数据和form数据变量双向绑定
      3.el-input v-mode="form.name" 表示表单的input控件，
            名字为name，必须需要和后端Javabean属性一致
      4.在前端中，对象的属性是可以动态生成的-->
    <el-dialog title="提示" v-model="dialogVisible" width="40%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="家居名">
          <el-input v-model="form.name" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="厂商">
          <el-input v-model="form.maker" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="form.sales" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="form.stock" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
//导入组件后就可以使用
//import HelloWorld from '@/components/HelloWorld.vue'
import request from '@/utils/request.js'

//导出组件
export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      search: '',
      dialogVisible: false,
      form: {},//定义一个空表单
      tableData: []
    }
  },
  created() {//生命周期函数
    this.list();
  },
  methods: {
    add() {//显示添加对话框
      //显示对话框
      this.dialogVisible = true;
      //每次点击都要清空上一次的表单数据
      this.form = {};
    },
    save() {//将填写的表单数据发送给后端
      //修改和添加走的同一个方法
      if (this.form.id) {//如果为修改业务，当前的id存在，表示真
        request.put("/api/update", this.form).then(res => {
          //注意这里的res已经经过拦截处理，它已经是原生的res.data数据
          if (res.code === 200) {//修改成功
            //提示成功的消息框
            this.$message({
              type: "success",
              message: "更新成功"
            })
          } else {
            //提示错误的消息框
            this.$message({
              type: "error",
              message: "更新失败"
            })
          }
          //关闭当前的修改对话框
          this.dialogVisible = false;
          //同时更新数据
          this.list();
        })
      } else {//添加业务
        //第一个参数为url，第二个参数是请求携带的数据
        request.post("/api/save", this.form).then(res => {
          console.log("res-", res)
          this.dialogVisible = false;//隐藏表单
          //调用list方法，刷新页面显示的数据
          this.list();
        })
      }
    },
    list() {//list方法，请求返回家居信息,当我们打开页面的时候，该方法就应该自动触发
      request.get("/api/furns").then(res => {
        //根据res的结构来获取数据
        this.tableData = res.extend.furnList;
      })
    },
    handleEdit(row) {
      //将当前行的家居信息绑定到弹出的对话框表单上
      //方式1：通过row.id到后端DB去获取对应的家居信息，放回后将其绑定到this.form

      //方式2：将当前获取的row数据通过处理绑定到this.form进行显示
      //将row转成json字符串，再转成json对象
      this.form = JSON.parse(JSON.stringify(row));
      //将数据赋给对话框后，显示对话框
      this.dialogVisible = true;
    }
  }
}
</script>

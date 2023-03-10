<template>
  <div>
    <!--增加按钮和搜索框-->
    <div style="margin:10px 5px">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button>其他</el-button>
    </div>
    <div style="margin:10px 5px">
      <el-input v-model="search" style="width: 30%" placeholder="请输入关键字"/>
      <el-button style="margin-left: 10px" type="primary" @click="list">检索</el-button>
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
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small"
                     @click="handleEdit(scope.row)">编辑
          </el-button>
          <!--如果点击确定，就会触发handleDel，如果点击取消，就不会触发-->
          <el-popconfirm title="确认要删除吗?" @confirm="handleDel(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
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
      <el-form :model="form" label-width="120px" :rules="rules" ref="form">
        <el-form-item label="家居名" prop="name">
          <el-input v-model="form.name" style="width: 80%"></el-input>
          {{serverValidErrors.name}}
        </el-form-item>
        <el-form-item label="厂商" prop="maker">
          <el-input v-model="form.maker" style="width: 80%"></el-input>
          {{serverValidErrors.maker}}
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" style="width: 80%"></el-input>
          {{serverValidErrors.price}}
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input v-model="form.sales" style="width: 80%"></el-input>
          {{serverValidErrors.sales}}
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" style="width: 80%"></el-input>
          {{serverValidErrors.stock}}
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--添加分页导航-->
    <div style="margin: 10px 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currnetPage"
          :page-sizes="[2,5,10,15,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
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
      //存放后端校验的错误信息
      serverValidErrors: {},
      //增加分页相应的数据
      currentPage: 1,//当前页
      pageSize: 5,//每页显示记录数
      total: 10,//共有多少记录数
      search: '',//检索条件，可以在进行分页时保留上次的检索条件
      dialogVisible: false,
      form: {},//定义一个空表单
      tableData: [],
      //定义添加表单的校验规则
      rules: {
        name: [//这里我们可以添加多个针对name属性的规则校验
          {required: true, message: "请输入家居名", tigger: "blur"}
        ],
        maker: [
          {required: true, message: "请输入厂商", tigger: "blur"}
        ],
        price: [
          {required: true, message: "请输入价格", tigger: "blur"},
          //使用正则表达式对输入的数字进行处理
          {pattern: /^([1-9]\d*|0)(\.\d+)?$/, message: "请输入数字", tigger: "blur"}
        ],
        sales: [
          {required: true, message: "请输入销量", tigger: "blur"},
          //使用正则表达式对输入的数字进行处理
          {pattern: /^([1-9]\d*|0)$/, message: "请输入数字", tigger: "blur"}
        ],
        stock: [
          {required: true, message: "请输入库存", tigger: "blur"},
          //使用正则表达式对输入的数字进行处理
          {pattern: /^([1-9]\d*|0)$/, message: "请输入数字", tigger: "blur"}
        ]
      }
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
      //清空上次校验的信息
      this.$refs['form'].resetFields();
      //清空上次后端校验的信息
      this.serverValidErrors = {};
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
        //表单验证是否通过
        this.$refs['form'].validate((valid) => {
          //valid就是表单校验结果
          if (valid) {//如果校验通过
            //第一个参数为url，第二个参数是请求携带的数据
            request.post("/api/save", this.form).then(res => {
              //判断后端的条件结果
              if (res.code === 200) {//后端添加成功
                this.dialogVisible = false;//隐藏表单
                //调用list方法，刷新页面显示的数据
                this.list();
                //提示
                this.$message({
                  type: "success",
                  message: "添加成功"
                })
              } else if (res.code === 400) {//后端校验失败
                //取出校验失败的信息，赋给 serverValidErrors
                this.serverValidErrors.name = res.extend.errorMsg.name;
                this.serverValidErrors.maker = res.extend.errorMsg.maker;
                this.serverValidErrors.price = res.extend.errorMsg.price;
                this.serverValidErrors.sales = res.extend.errorMsg.sales;
                this.serverValidErrors.stock = res.extend.errorMsg.stock;
              }
            })
          } else {//校验没有通过
            //提示
            this.$message({
              type: "error",
              message: "验证失败，不提交"
            })
            return false;//放弃提交
          }
        })
      }
    },
    list() {//list方法，请求返回家居信息,当我们打开页面的时候，该方法就应该自动触发
      // request.get("/api/furns").then(res => {
      //   //根据res的结构来获取数据
      //   this.tableData = res.extend.furnList;
      // })
      //请求分页的接口-带检索条件
      request.get("/api/furnsByConditionPage", {
        params: {//指定请求携带的参数
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {//处理返回的分页信息
        this.tableData = res.extend.pageInfo.list;
        this.total = res.extend.pageInfo.total;
      })
    },
    handleEdit(row) {
      //将当前行的家居信息绑定到弹出的对话框表单上
      //方式1：通过row.id到后端DB去获取对应的家居信息，放回后将其绑定到this.form
      request.get("/api/find/" + row.id).then(res => {
        console.log(res.extend.furn)
        this.form = res.extend.furn;
        this.dialogVisible = true;
      })

      //方式2：将当前获取的row数据通过处理绑定到this.form进行显示
      //将row转成json字符串，再转成json对象
      //this.form = JSON.parse(JSON.stringify(row));
      //将数据赋给对话框后，显示对话框
      //this.dialogVisible = true;
    },
    handleDel(id) {
      request.delete("/api/del/" + id).then(res => {
        //提示一个成功的消息框
        if (res.code === 200) {//删除成功
          //提示成功的消息框
          this.$message({
            type: "success",
            message: res.msg
          })
        } else {
          //提示错误的消息框
          this.$message({
            type: "error",
            message: res.msg
          })
        }
        //刷新页面数据
        this.list();
      })
    },
    handleCurrentChange(pageNum) {//处理分页请求
      //当用户点击分页超链接时，会携带pageNum
      this.currentPage = pageNum;
      //发出分页请求
      this.list();
    },
    handlePageSizeChange(pageSize) {//切换每一页需要显示的记录数
      this.pageSize = pageSize;
      //发出分页请求
      this.list();

    }
  }
}
</script>

<template>
  <div>
    <!--增加按钮和搜索框-->
    <div style="margin:10px 5px">
      <el-button type="primary">新增</el-button>
      <el-button>其他</el-button>
    </div>
    <div style="margin:10px 5px">
      <el-input v-model="search" style="width: 30%" placeholder="请输入关键字"/>
      <el-button style="margin-left: 10px" type="primary">查找</el-button>
    </div>

    <!--表格-->
    <el-table :data="tableData" stripe style="width: 90%">
      <!--sortable可以排序，有升序，降序，默认排序三种状态-->
      <el-table-column sortable prop="date" label="日期"/>
      <el-table-column prop="name" label="名字"/>
      <el-table-column prop="address" label="地址"/>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small"
                     @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button link type="primary" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// @ is an alias to /src
//导入组件后就可以使用
//import HelloWorld from '@/components/HelloWorld.vue'

//导出组件
export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      search: '',
      tableData: [
        {
          date: '2016-02-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路1518弄',
        },
        {
          date: '2016-05-04',
          name: '李晓明',
          address: '上海市普陀区金沙江路1517弄',
        },
        {
          date: '2016-01-01',
          name: '张三',
          address: '上海市普陀区金沙江路1519弄',
        },
        {
          date: '2016-03-16',
          name: '李四',
          address: '上海市普陀区金沙江路1520弄',
        }
      ]
    }
  }
}
</script>

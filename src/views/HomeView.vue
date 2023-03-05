<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
//导入组件后就可以使用
import HelloWorld from '@/components/HelloWorld.vue'

//导出组件
export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

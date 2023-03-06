<template>
  <!--
   1.App.vue 页面可以用来布局网站页面
   2.<router-view/> 就是路由指令,会把对应的页面内容替换到<router-view/>的位置
    (路由的本质就是一种对应关系，根据不同的 URL请求，返回对应不同的资源。
    那么url地址和真实的资源之间就有一种对应的关系，就是路由。)
   3.路由的规则，比如 http://localhost:8080/ ，则路由的path就是 /
    又比如 http://localhost:8080/about ，则路由的path就是 /about
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
  -->
  <div>
    <!--引入Header（头部）-->
    <Header/>
    <!--主体-->
    <div style="display: flex">
      <!--侧边栏-->
      <Aside/>
      <!--内容区域,这个部分通过路由展示，规定路由到 HomeView.vue(路径为 /)-->
      <router-view style="flex: 1"/>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header";
import Aside from "@/components/Aside.vue"

export default {
  name: "Layout",
  components: {
    Header,
    Aside
  }
}
</script>
<style>
</style>

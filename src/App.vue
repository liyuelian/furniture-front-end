<template>
  <!--
   1.App.vue 页面可以用来布局网站页面
   2.<router-view/> 就是路由指令,会把对应的页面内容替换到<router-view/>的位置
    (路由的本质就是一种对应关系，根据不同的 URL请求，返回对应不同的资源。
    那么url地址和真实的资源之间就有一种对应的关系，就是路由。)
   3.路由的规则，比如 http://localhost:8080/ ，则路由的path就是 /
    又比如 http://localhost:8080/about ，则路由的path就是 /about
  -->
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

/**
 * 1.index.js用于指定路由规则（访问url的规则）
 * 2. path: '/'表示当访问url为 http://ip:port/时，就访问到 HomeView的组件
 *    会把 HomeView组件的内容替换给 App.vue的 <router-view/>
 * 3.HomeView 组件对应的文件就是 ../views/HomeView.vue
 */

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

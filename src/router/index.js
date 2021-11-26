import Vue from 'vue'
import VueRouter from 'vue-router'
import Pages from './pages'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/Layout/index.vue'),
    children: Pages
  }
]

const router = new VueRouter({
  routes
})

export default router

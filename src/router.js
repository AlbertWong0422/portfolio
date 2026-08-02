import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/admin/login', component: () => import('./views/AdminLogin.vue') },
  {
    path: '/admin',
    component: () => import('./views/AdminDashboard.vue'),
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('admin_token')
      token ? next() : next('/admin/login')
    }
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

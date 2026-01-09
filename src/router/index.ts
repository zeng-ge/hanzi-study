import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/detail/:char',
      name: 'detail',
      component: () => import('../views/DetailView.vue')
    },
    {
      path: '/print/:char',
      name: 'print',
      component: () => import('../views/PrintSheet.vue')
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/DashBoard.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/pages/admin/categories/index.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/pages/admin/users/index.vue'),
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/pages/admin/products/index.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/pages/admin/orders/index.vue'),
        },
      ],
    },
  ],
})

// 導航守衛
router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router

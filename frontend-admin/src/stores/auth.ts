import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserRole } from '@smart-market/shared'

interface AdminUser {
  id: string
  name: string
  email: string
  avatar: string | null
  role: UserRole
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user = ref<AdminUser | null>(
    JSON.parse(localStorage.getItem('admin_user') || 'null')
  )

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function login(newToken: string, userData: AdminUser) {
    token.value = newToken
    user.value = userData
    localStorage.setItem('admin_token', newToken)
    localStorage.setItem('admin_user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  }
})

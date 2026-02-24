import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'

// Mock element-plus to avoid full component library load
vi.mock('element-plus', async () => {
  const { ref } = await import('vue')
  return {
    ElMessage: { success: vi.fn(), error: vi.fn() },
    ElForm: { name: 'ElForm', template: '<form @submit.prevent><slot /></form>' },
    ElFormItem: { name: 'ElFormItem', template: '<div><slot /></div>' },
    ElInput: {
      name: 'ElInput',
      props: ['modelValue', 'type', 'placeholder', 'size'],
      emits: ['update:modelValue'],
      template: `<input :type="type || 'text'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`,
    },
    ElButton: {
      name: 'ElButton',
      props: ['loading'],
      template: '<button @click="$emit(\'click\')"><slot /></button>',
    },
  }
})

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

import axios from 'axios'
import LoginPage from '../pages/LoginPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/admin/dashboard', component: { template: '<div />' } },
  ],
})

describe('LoginPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the login form', () => {
    const wrapper = mount(LoginPage, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('Smart Market 後台')
  })

  it('shows error when login API returns 401', async () => {
    const { ElMessage } = await import('element-plus')
    vi.mocked(axios.post).mockRejectedValueOnce({
      response: { status: 401 },
    })

    const wrapper = mount(LoginPage, {
      global: { plugins: [router] },
    })

    // Fill in form fields directly via component data
    const vm = wrapper.vm as any
    vm.form.email = 'wrong@example.com'
    vm.form.password = 'wrongpass'

    // Bypass form validation by calling login directly
    // and mock the formRef.validate() call
    vm.formRef = { validate: vi.fn().mockResolvedValue(true) }
    await vm.login()
    await flushPromises()

    expect(ElMessage.error).toHaveBeenCalledWith('帳號或密碼錯誤')
  })

  it('shows error when user role is not admin', async () => {
    const { ElMessage } = await import('element-plus')
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        access_token: 'token',
        user: { id: '1', name: 'User', email: 'user@test.com', role: 'user' },
      },
    })

    const wrapper = mount(LoginPage, {
      global: { plugins: [router] },
    })

    const vm = wrapper.vm as any
    vm.form.email = 'user@test.com'
    vm.form.password = 'password123'
    vm.formRef = { validate: vi.fn().mockResolvedValue(true) }

    await vm.login()
    await flushPromises()

    expect(ElMessage.error).toHaveBeenCalledWith('此帳號沒有管理員權限')
  })

  it('redirects to dashboard on successful admin login', async () => {
    const { ElMessage } = await import('element-plus')
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        access_token: 'admin-token',
        user: { id: '1', name: 'Admin', email: 'admin@smartmarket.com', role: 'admin' },
      },
    })

    const wrapper = mount(LoginPage, {
      global: { plugins: [router] },
    })

    const vm = wrapper.vm as any
    vm.form.email = 'admin@smartmarket.com'
    vm.form.password = 'password123'
    vm.formRef = { validate: vi.fn().mockResolvedValue(true) }

    await vm.login()
    await flushPromises()

    expect(ElMessage.success).toHaveBeenCalledWith('歡迎回來，Admin！')
    expect(localStorage.getItem('admin_token')).toBe('admin-token')
  })
})

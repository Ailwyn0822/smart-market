<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM16 10a4 4 0 1 1-8 0" />
        </svg>
      </div>
      <h1>Smart Market 後台</h1>

      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="login">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="管理員 Email" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密碼" type="password" size="large" show-password
            @keyup.enter="login" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" @click="login">
            {{ loading ? '' : '登入' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <footer>Copyright © 2026 Smart Market Inc.</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const form = reactive({ email: '', password: '' })
const loading = ref(false)

const rules: FormRules = {
  email: [
    { required: true, message: '請輸入 Email', trigger: 'blur' },
    { type: 'email', message: '請輸入有效的 Email', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼至少 6 字元', trigger: 'blur' },
  ],
}

const login = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true

    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
    const res = await axios.post(`${apiBase}/auth/login`, {
      email: form.email,
      password: form.password,
    })

    const { access_token, user } = res.data

    if (user?.role !== 'admin') {
      ElMessage.error('此帳號沒有管理員權限')
      return
    }

    authStore.login(access_token, user)
    ElMessage.success(`歡迎回來，${user.name}！`)
    router.push('/admin/dashboard')
  } catch (error: any) {
    if (error.response?.status === 401) {
      ElMessage.error('帳號或密碼錯誤')
    } else {
      ElMessage.error('登入失敗，請稍後再試')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
}

.login-card {
  width: 100%;
  max-width: 340px;
  text-align: center;
  padding: 0 20px;
}

.logo {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  color: #1d1d1f;
}

.logo svg {
  width: 100%;
  height: 100%;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 28px;
  letter-spacing: -0.3px;
}

footer {
  position: absolute;
  bottom: 20px;
  font-size: 12px;
  color: #86868b;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-input__wrapper) {
  background: #fff;
  border-radius: 12px;
  box-shadow: none;
  border: 1px solid #d2d2d7;
  padding: 6px 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:deep(.el-input__wrapper:hover) {
  border-color: #86868b;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #0071e3;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15);
}

:deep(.el-input__inner) {
  font-size: 17px;
  color: #1d1d1f;
  text-align: center;
}

:deep(.el-input__inner::placeholder) {
  color: #86868b;
}

:deep(.el-button--primary) {
  width: 100%;
  height: 50px;
  font-size: 17px;
  font-weight: 500;
  border-radius: 12px;
  background: #0071e3;
  border: none;
  transition: background 0.2s;
}

:deep(.el-button--primary:hover) {
  background: #0077ed;
}

@media (max-width: 400px) {
  h1 {
    font-size: 20px;
  }

  :deep(.el-input__inner) {
    font-size: 16px;
  }
}
</style>

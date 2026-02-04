<template>
  <div class="login-container">
    <!-- 背景動態效果 -->
    <div class="background-animation">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- 登入卡片 -->
    <div class="login-card">
      <!-- Logo 區域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h1 class="logo-title">Smart Market</h1>
        <p class="logo-subtitle">管理後台系統</p>
      </div>

      <!-- 表單區域 -->
      <el-form ref="formRef" :model="formData" :rules="formRules" class="login-form" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="請輸入帳號" size="large" :prefix-icon="User" clearable />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="formData.password" placeholder="請輸入密碼" type="password" size="large" :prefix-icon="Lock"
            show-password @keyup.enter="handleLogin" />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="rememberMe">記住我</el-checkbox>
          <a href="#" class="forgot-password">忘記密碼？</a>
        </div>

        <el-form-item class="submit-section">
          <el-button type="primary" size="large" :loading="isLoading" class="login-button" @click="handleLogin">
            <span v-if="!isLoading">登入系統</span>
            <span v-else>登入中...</span>
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 底部資訊 -->
      <div class="footer-info">
        <p>© 2026 Smart Market. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 表單實例引用
const formRef = ref<FormInstance>()

// 表單資料
const formData = reactive({
  username: '',
  password: ''
})

// 記住我選項
const rememberMe = ref(false)

// 載入狀態
const isLoading = ref(false)

// 表單驗證規則
const formRules = reactive<FormRules>({
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 3, max: 20, message: '帳號長度需介於 3 至 20 字元', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼長度至少需要 6 字元', trigger: 'blur' }
  ]
})

// 登入處理
const handleLogin = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isLoading.value = true

    // TODO: 這裡串接實際的登入 API
    console.log('登入資訊：', formData.username, formData.password)

    // 模擬 API 呼叫延遲
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 登入成功後的處理
    // router.push('/dashboard')

  } catch (error) {
    console.error('表單驗證失敗', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ===== 容器與背景 ===== */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* ===== 動態背景效果 ===== */
.background-animation {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  bottom: -150px;
  right: -150px;
  animation-delay: -7s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(30px, -30px) scale(1.05);
  }

  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }

  75% {
    transform: translate(-30px, -20px) scale(1.02);
  }
}

/* ===== 登入卡片 ===== */
.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

/* ===== Logo 區域 ===== */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.5);
}

.logo-icon svg {
  width: 36px;
  height: 36px;
  color: white;
}

.logo-title {
  font-size: 28px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

/* ===== 表單樣式 ===== */
.login-form {
  margin-bottom: 24px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-input__wrapper) {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 16px;
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.login-form :deep(.el-input__inner) {
  color: #f8fafc;
  font-size: 15px;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #64748b;
}

.login-form :deep(.el-input__prefix) {
  color: #64748b;
}

.login-form :deep(.el-input__suffix) {
  color: #64748b;
}

/* ===== 選項區域 ===== */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-options :deep(.el-checkbox__label) {
  color: #94a3b8;
  font-size: 14px;
}

.form-options :deep(.el-checkbox__inner) {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(255, 255, 255, 0.2);
}

.form-options :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #3b82f6;
  border-color: #3b82f6;
}

.forgot-password {
  color: #3b82f6;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #60a5fa;
}

/* ===== 登入按鈕 ===== */
.submit-section {
  margin-bottom: 0 !important;
}

.login-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.4);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px -5px rgba(59, 130, 246, 0.5);
}

.login-button:active {
  transform: translateY(0);
}

/* ===== 底部資訊 ===== */
.footer-info {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-info p {
  color: #64748b;
  font-size: 12px;
  margin: 0;
}

/* ===== RWD 響應式設計 ===== */
@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
  }

  .logo-icon svg {
    width: 30px;
    height: 30px;
  }

  .logo-title {
    font-size: 24px;
  }
}

/* ===== 減少動畫偏好 ===== */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb {
    animation: none;
  }

  .login-button {
    transition: none;
  }
}
</style>

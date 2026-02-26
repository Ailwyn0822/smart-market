<template>
  <div class="admin-layout">
    <el-container style="height: 100vh;">
      <!-- 側邊欄 -->
      <el-aside width="220px" class="sidebar">
        <div class="sidebar-logo">
          <span class="logo-icon">🛒</span>
          <span class="logo-text">Smart Market</span>
        </div>

        <el-menu :default-active="activeMenu" router class="sidebar-menu" background-color="#001529" text-color="#ccc"
          active-text-color="#fff">
          <el-menu-item index="/admin/dashboard">
            <el-icon>
              <House />
            </el-icon>
            <span>儀表板</span>
          </el-menu-item>

          <el-sub-menu index="management">
            <template #title>
              <el-icon>
                <Setting />
              </el-icon>
              <span>內容管理</span>
            </template>

            <el-menu-item index="/admin/categories">
              <el-icon>
                <Menu />
              </el-icon>
              <span>類別管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/products">
              <el-icon>
                <ShoppingBag />
              </el-icon>
              <span>商品管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/users">
              <el-icon>
                <User />
              </el-icon>
              <span>會員管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/orders">
              <el-icon>
                <List />
              </el-icon>
              <span>訂單管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/coupons">
              <el-icon>
                <Ticket />
              </el-icon>
              <span>折扣碼管理</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主要內容區 -->
      <el-container>
        <!-- Header -->
        <el-header class="admin-header">
          <div class="header-title">Smart Market 後台管理</div>
          <div class="header-right">
            <span class="admin-name">{{ authStore.user?.name }}</span>
            <el-button type="danger" size="small" @click="handleLogout" plain>
              登出
            </el-button>
          </div>
        </el-header>

        <!-- 頁面內容 -->
        <el-main class="admin-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { House, Setting, Menu, ShoppingBag, User, List, Ticket } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

const handleLogout = async () => {
  await ElMessageBox.confirm('確定要登出嗎？', '登出確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background-color: #001529;
  overflow: hidden;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 64px);
}

.admin-header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e8e8e8;
  height: 64px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-name {
  font-size: 14px;
  color: #666;
}

.admin-main {
  background: #f5f5f5;
  overflow-y: auto;
}
</style>

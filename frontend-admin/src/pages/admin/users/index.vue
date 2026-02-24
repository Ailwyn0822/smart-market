<template>
  <div class="page-container">
    <div class="page-header">
      <h2>會員管理</h2>
      <el-input
        v-model="searchQuery"
        placeholder="搜尋名稱或 Email..."
        clearable
        style="width: 280px;"
        @input="handleSearch"
      />
    </div>

    <el-card>
      <el-table :data="filteredUsers" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="UUID" width="120">
          <template #default="{ row }">
            <el-tooltip :content="row.id" placement="top">
              <span>{{ row.id.slice(0, 8) }}...</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="頭像" width="70">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatar || undefined">
              {{ row.name?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名稱" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="provider" label="登入方式" width="100">
          <template #default="{ row }">
            <el-tag :type="providerTagType(row.provider)" size="small">
              {{ row.provider }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-select
              v-model="row.role"
              size="small"
              @change="updateUserRole(row.id, row.role)"
            >
              <el-option label="一般用戶" value="user" />
              <el-option label="管理員" value="admin" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="加入時間" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredUsers.length"
        layout="total, prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'
import type { ApiUser } from '@smart-market/shared'
import type { UserRole } from '@smart-market/shared'

const users = ref<ApiUser[]>([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 20

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await api.get('/users')
    users.value = res.data
  } catch {
    ElMessage.error('載入會員列表失敗')
  } finally {
    loading.value = false
  }
}

const updateUserRole = async (id: string, role: UserRole) => {
  try {
    await api.patch(`/users/${id}/role`, { role })
    ElMessage.success('角色已更新')
  } catch {
    ElMessage.error('角色更新失敗')
    await fetchUsers()
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const providerTagType = (provider: string) => {
  if (provider === 'google') return 'danger'
  if (provider === 'line') return 'success'
  return 'info'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

onMounted(fetchUsers)
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

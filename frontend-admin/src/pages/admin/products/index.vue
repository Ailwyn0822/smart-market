<template>
  <div class="page-container">
    <div class="page-header">
      <h2>商品管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜尋商品名稱..."
          clearable
          style="width: 240px; margin-right: 12px;"
        />
        <el-select v-model="statusFilter" placeholder="全部狀態" clearable style="width: 120px;">
          <el-option label="上架中" value="active" />
          <el-option label="已下架" value="inactive" />
        </el-select>
      </div>
    </div>

    <el-card>
      <el-table :data="filteredProducts" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="圖片" width="80">
          <template #default="{ row }">
            <el-image
              :src="row.imageUrl"
              fit="cover"
              style="width: 48px; height: 48px; border-radius: 4px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名稱" min-width="160" />
        <el-table-column prop="price" label="價格" width="90">
          <template #default="{ row }">
            NT$ {{ row.price }}
          </template>
        </el-table-column>
        <el-table-column label="分類" width="100">
          <template #default="{ row }">
            {{ row.category?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="庫存" width="70" />
        <el-table-column prop="views" label="瀏覽" width="70" />
        <el-table-column prop="isActive" label="狀態" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.isActive"
              active-text="上架"
              inactive-text="下架"
              @change="toggleStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="建立時間" width="110">
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
        :total="filteredProducts.length"
        layout="total, prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'
import type { ApiProduct } from '@smart-market/shared'

const products = ref<ApiProduct[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 20

const filteredProducts = computed(() => {
  let result = products.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q))
  }
  if (statusFilter.value === 'active') {
    result = result.filter((p) => p.isActive)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter((p) => !p.isActive)
  }
  return result
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await api.get('/products')
    products.value = res.data
  } catch {
    ElMessage.error('載入商品列表失敗')
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (product: ApiProduct) => {
  try {
    await api.patch(`/products/${product.id}/active_status`)
    ElMessage.success(`商品已${product.isActive ? '上架' : '下架'}`)
  } catch {
    ElMessage.error('狀態更新失敗')
    product.isActive = !product.isActive
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

onMounted(fetchProducts)
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

.header-actions {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

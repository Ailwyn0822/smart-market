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
          @input="onSearch"
        />
        <el-select v-model="statusFilter" placeholder="全部狀態" clearable style="width: 120px;" @change="onSearch">
          <el-option label="上架中" value="active" />
          <el-option label="已下架" value="inactive" />
        </el-select>
      </div>
    </div>

    <el-card>
      <el-table :data="products" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="圖片" width="70">
          <template #default="{ row }">
            <el-image
              :src="row.imageUrl"
              fit="cover"
              style="width: 44px; height: 44px; border-radius: 4px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名稱" min-width="160" show-overflow-tooltip />
        <el-table-column prop="price" label="價格" width="90">
          <template #default="{ row }">NT$ {{ row.price }}</template>
        </el-table-column>
        <el-table-column label="分類" width="90">
          <template #default="{ row }">{{ row.category?.name || '-' }}</template>
        </el-table-column>
        <el-table-column label="上架者" width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ row.seller?.name || '-' }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="庫存" width="65" />
        <el-table-column prop="views" label="瀏覽" width="65" />
        <el-table-column label="狀態" width="80">
          <template #default="{ row }">
            <el-switch
              v-model="row.isActive"
              @change="toggleStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="建立時間" width="100">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="fetchProducts"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const products = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 20
const total = ref(0)

let searchTimer: ReturnType<typeof setTimeout> | null = null

const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchProducts()
  }, 300)
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await api.get('/products/admin/list', {
      params: {
        page: currentPage.value,
        limit: pageSize,
        keyword: searchQuery.value || undefined,
        status: statusFilter.value || undefined,
      },
    })
    products.value = res.data.items
    total.value = res.data.total
  } catch {
    ElMessage.error('載入商品列表失敗')
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (product: any) => {
  try {
    await api.patch(`/products/admin/${product.id}/toggle`)
    ElMessage.success(`商品已${product.isActive ? '上架' : '下架'}`)
  } catch {
    ElMessage.error('狀態更新失敗')
    product.isActive = !product.isActive
  }
}

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('zh-TW')

onMounted(fetchProducts)
</script>

<style scoped>
.page-container { padding: 20px; }
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
.header-actions { display: flex; align-items: center; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>

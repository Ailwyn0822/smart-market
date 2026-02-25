<template>
    <div class="page-container">
        <div class="page-header">
            <h2>訂單管理</h2>
            <div class="header-actions">
                <el-input v-model="searchQuery" placeholder="搜尋訂單編號 / 買家姓名 / 信箱..." clearable
                    style="width: 300px; margin-right: 12px;" @input="onSearch" />
                <el-select v-model="statusFilter" placeholder="全部狀態" clearable style="width: 140px;" @change="onSearch">
                    <el-option label="處理中" value="processing" />
                    <el-option label="已出貨" value="shipped" />
                    <el-option label="配送中" value="out_for_delivery" />
                    <el-option label="已送達" value="delivered" />
                    <el-option label="已取消" value="cancelled" />
                </el-select>
            </div>
        </div>

        <el-card>
            <el-table :data="orders" v-loading="loading" stripe style="width: 100%">
                <el-table-column prop="id" label="ID" width="65" />
                <el-table-column prop="orderNumber" label="訂單編號" min-width="150" show-overflow-tooltip />
                <el-table-column label="買家" min-width="120" show-overflow-tooltip>
                    <template #default="{ row }">
                        <div>{{ row.recipientName || '-' }}</div>
                        <div style="font-size: 12px; color: #999;">{{ row.recipientEmail || '' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="金額" width="100">
                    <template #default="{ row }">NT$ {{ Number(row.totalAmount).toFixed(0) }}</template>
                </el-table-column>
                <el-table-column label="付款方式" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.paymentMethod === 'online' ? 'primary' : 'info'" size="small">
                            {{ row.paymentMethod === 'online' ? '線上支付' : '貨到付款' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="商品數" width="75">
                    <template #default="{ row }">{{ row.items?.length ?? 0 }}</template>
                </el-table-column>
                <el-table-column label="狀態" width="160">
                    <template #default="{ row }">
                        <el-select v-model="row.status" size="small" style="width: 130px;"
                            @change="(val: string) => updateStatus(row, val)">
                            <el-option label="處理中" value="processing" />
                            <el-option label="已出貨" value="shipped" />
                            <el-option label="配送中" value="out_for_delivery" />
                            <el-option label="已送達" value="delivered" />
                            <el-option label="已取消" value="cancelled" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="建立時間" width="110">
                    <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
                </el-table-column>
            </el-table>
        </el-card>

        <div class="pagination">
            <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total"
                layout="total, prev, pager, next" @current-change="fetchOrders" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const orders = ref<any[]>([])
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
        fetchOrders()
    }, 300)
}

const fetchOrders = async () => {
    loading.value = true
    try {
        const res = await api.get('/orders/admin/all', {
            params: {
                page: currentPage.value,
                limit: pageSize,
                keyword: searchQuery.value || undefined,
                status: statusFilter.value || undefined,
            },
        })
        orders.value = res.data.items
        total.value = res.data.total
    } catch {
        ElMessage.error('載入訂單列表失敗')
    } finally {
        loading.value = false
    }
}

const updateStatus = async (order: any, status: string) => {
    try {
        await api.patch(`/orders/admin/${order.id}/status`, { status })
        ElMessage.success('訂單狀態已更新')
    } catch {
        ElMessage.error('狀態更新失敗')
        fetchOrders() // reload to revert
    }
}

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('zh-TW')

onMounted(fetchOrders)
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

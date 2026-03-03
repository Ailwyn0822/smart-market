<template>
  <div class="page-container">
    <div class="page-header">
      <h2>折扣碼管理</h2>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon>
          <Plus />
        </el-icon>
        新增折扣碼
      </el-button>
    </div>

    <!-- 折扣碼列表 -->
    <el-card>
      <el-table :data="coupons" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="code" label="折扣碼" width="160">
          <template #default="{ row }">
            <el-tag type="warning" effect="plain" style="font-family: monospace; font-weight: bold;">
              {{ row.code }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="discountAmount" label="折扣金額" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold;">${{ parseFloat(row.discountAmount).toFixed(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用次數" width="140">
          <template #default="{ row }">
            <span>{{ row.currentUsages }} / {{ row.maxUsages === 0 ? '∞' : row.maxUsages }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="validUntil" label="有效期限" width="150">
          <template #default="{ row }">
            <span v-if="row.validUntil" :class="isExpired(row.validUntil) ? 'expired' : ''">
              {{ formatDate(row.validUntil) }}
            </span>
            <el-tag v-else type="success" size="small">永久有效</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="建立時間" width="150">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button size="small" @click="openEditDialog(row)">編輯</el-button>
            <el-button size="small" type="danger" @click="openDeleteDialog(row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/編輯 Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '編輯折扣碼' : '新增折扣碼'" width="460px" align-center>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="折扣碼" prop="code">
          <el-input v-model="form.code" placeholder="例如：SAVE50" style="text-transform: uppercase;" />
        </el-form-item>
        <el-form-item label="折扣金額" prop="discountAmount">
          <el-input-number v-model="form.discountAmount" :min="1" :max="99999" :precision="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="使用次數上限" prop="maxUsages">
          <el-input-number v-model="form.maxUsages" :min="0" :max="999999" :precision="0" style="width: 100%;" />
          <div class="form-hint">0 = 不限次數</div>
        </el-form-item>
        <el-form-item label="有效期限" prop="validUntil">
          <el-date-picker v-model="form.validUntil" type="date" placeholder="選擇日期（留空 = 永久有效）" style="width: 100%;"
            value-format="YYYY-MM-DD" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          {{ isEditing ? '更新' : '建立' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 刪除確認 Dialog -->
    <el-dialog v-model="deleteDialogVisible" title="刪除確認" width="380px" align-center>
      <div class="delete-confirm">
        <el-icon size="48" color="#f56c6c">
          <WarningFilled />
        </el-icon>
        <p>確定要刪除折扣碼「<strong>{{ deletingCoupon?.code }}</strong>」嗎？</p>
        <p class="hint">此操作無法復原。</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="deleting" @click="confirmDelete">確認刪除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus'
import { Plus, WarningFilled } from '@element-plus/icons-vue'
import api from '@/api'

interface Coupon {
  id: number
  code: string
  discountAmount: string
  maxUsages: number
  currentUsages: number
  validUntil: string | null
  createdAt: string
}

const coupons = shallowRef<Coupon[]>([])
const loading = shallowRef(false)
const dialogVisible = shallowRef(false)
const submitting = shallowRef(false)
const isEditing = shallowRef(false)
const editingId = shallowRef<number | null>(null)

const formRef = shallowRef<FormInstance>()
const form = reactive({
  code: '',
  discountAmount: 50,
  maxUsages: 0,
  validUntil: null as string | null,
})

const rules: FormRules = {
  code: [{ required: true, message: '請輸入折扣碼', trigger: 'blur' }],
  discountAmount: [{ required: true, message: '請輸入折扣金額', trigger: 'blur' }],
}

const fetchCoupons = async () => {
  loading.value = true
  try {
    const res = await api.get('/discount-codes')
    coupons.value = res.data
  } catch {
    ElMessage.error('載入折扣碼失敗')
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.code = ''
  form.discountAmount = 50
  form.maxUsages = 0
  form.validUntil = null
  dialogVisible.value = true
}

const openEditDialog = (coupon: Coupon) => {
  isEditing.value = true
  editingId.value = coupon.id
  form.code = coupon.code
  form.discountAmount = parseFloat(coupon.discountAmount)
  form.maxUsages = coupon.maxUsages
  form.validUntil = coupon.validUntil ? coupon.validUntil.substring(0, 10) : null
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  submitting.value = true
  try {
    const payload = {
      code: form.code.toUpperCase(),
      discountAmount: form.discountAmount,
      maxUsages: form.maxUsages,
      validUntil: form.validUntil || null,
    }
    if (isEditing.value && editingId.value) {
      await api.patch(`/discount-codes/${editingId.value}`, payload)
      ElMessage.success('折扣碼已更新')
    } else {
      await api.post('/discount-codes', payload)
      ElMessage.success('折扣碼已建立')
    }
    dialogVisible.value = false
    await fetchCoupons()
  } catch {
    ElMessage.error('操作失敗')
  } finally {
    submitting.value = false
  }
}

const deleteDialogVisible = shallowRef(false)
const deletingCoupon = shallowRef<Coupon | null>(null)
const deleting = shallowRef(false)

const openDeleteDialog = (coupon: Coupon) => {
  deletingCoupon.value = coupon
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  if (!deletingCoupon.value) return
  deleting.value = true
  try {
    await api.delete(`/discount-codes/${deletingCoupon.value.id}`)
    ElMessage.success('折扣碼已刪除')
    deleteDialogVisible.value = false
    await fetchCoupons()
  } catch {
    ElMessage.error('刪除失敗，請稍後再試')
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

const isExpired = (dateStr: string) => {
  return new Date(dateStr) < new Date()
}

onMounted(fetchCoupons)
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

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.expired {
  color: #f56c6c;
  text-decoration: line-through;
}

.delete-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  text-align: center;
}

.delete-confirm p {
  margin: 0;
  font-size: 15px;
  color: #333;
}

.delete-confirm .hint {
  font-size: 13px;
  color: #999;
}
</style>

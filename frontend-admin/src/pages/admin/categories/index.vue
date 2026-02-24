<template>
  <div class="page-container">
    <div class="page-header">
      <h2>類別管理</h2>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><Plus /></el-icon>
        新增類別
      </el-button>
    </div>

    <!-- 類別列表 -->
    <el-card>
      <el-table
        :data="categories"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="icon" label="圖示" width="80">
          <template #default="{ row }">
            <span style="font-size: 20px;">{{ row.icon }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分類名稱" />
        <el-table-column prop="slug" label="Slug" />
        <el-table-column prop="createdAt" label="建立時間" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="openEditDialog(row)">編輯</el-button>
            <el-button size="small" type="danger" @click="deleteCategory(row.id)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/編輯 Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '編輯類別' : '新增類別'" width="400px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名稱" prop="name">
          <el-input v-model="form.name" placeholder="例如：玩具" />
        </el-form-item>
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="form.slug" placeholder="例如：toys" />
        </el-form-item>
        <el-form-item label="圖示" prop="icon">
          <el-input v-model="form.icon" placeholder="例如：🧸（emoji）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          {{ isEditing ? '更新' : '建立' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api from '@/api'
import type { ApiCategory } from '@smart-market/shared'

const categories = ref<ApiCategory[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formRef = ref<FormInstance>()
const form = reactive({ name: '', slug: '', icon: '' })

const rules: FormRules = {
  name: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }],
  slug: [{ required: true, message: '請輸入 Slug', trigger: 'blur' }],
}

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await api.get('/categories')
    categories.value = res.data
  } catch {
    ElMessage.error('載入類別失敗')
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.name = ''
  form.slug = ''
  form.icon = ''
  dialogVisible.value = true
}

const openEditDialog = (category: ApiCategory) => {
  isEditing.value = true
  editingId.value = category.id
  form.name = category.name
  form.slug = category.slug
  form.icon = category.icon || ''
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  submitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      await api.patch(`/categories/${editingId.value}`, form)
      ElMessage.success('類別已更新')
    } else {
      await api.post('/categories', form)
      ElMessage.success('類別已建立')
    }
    dialogVisible.value = false
    await fetchCategories()
  } catch {
    ElMessage.error('操作失敗')
  } finally {
    submitting.value = false
  }
}

const deleteCategory = async (id: number) => {
  await ElMessageBox.confirm('確定要刪除此類別嗎？', '刪除確認', {
    type: 'warning',
    confirmButtonText: '刪除',
    cancelButtonText: '取消',
  })
  try {
    await api.delete(`/categories/${id}`)
    ElMessage.success('類別已刪除')
    await fetchCategories()
  } catch {
    ElMessage.error('刪除失敗')
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

onMounted(fetchCategories)
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
</style>

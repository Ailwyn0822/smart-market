<script setup lang="ts">
// 不需要 import { ref } from 'vue' -> 自動引入了！
const count = ref(0)

const showMsg = () => {
  // 不需要 import { ElMessage } -> 自動引入了！
  ElMessage.success('Element Plus 設定成功！')
}
</script>

<template>
  <div class="app-container">
    <h1>Smart Market 後台管理</h1>

    <el-button type="primary" @click="count++">
      點擊次數: {{ count }}
    </el-button>

    <el-button type="success" @click="showMsg">
      測試訊息
    </el-button>
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
  text-align: center;
}
</style>

<template>
  <div class="dashboard">
    <!-- 統計卡片 -->
    <div class="stat-cards">
      <div v-for="card in statCards" :key="card.label" class="stat-card">
        <div class="stat-icon" :style="{ background: card.bg }">
          <el-icon :size="24" style="color:#fff">
            <component :is="card.icon" />
          </el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ card.value }}</div>
          <div class="stat-label">{{ card.label }}</div>
        </div>
      </div>
    </div>

    <!-- 圖表區 -->
    <div class="charts-row">
      <el-card class="chart-card" header="本月每日新增會員">
        <div ref="lineChartRef" style="height: 280px;" />
      </el-card>
      <el-card class="chart-card" header="登入方式分佈">
        <div ref="pieChartRef" style="height: 280px;" />
      </el-card>
    </div>

    <el-card class="chart-card-wide" header="各類別商品數量 Top 10">
      <div ref="barChartRef" style="height: 280px;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">

import * as echarts from 'echarts'
import { User, ShoppingBag, TrendCharts, Goods } from '@element-plus/icons-vue'
import api from '@/api'

// ── 資料 ──────────────────────────────────────────
const users = shallowRef<any[]>([])
const products = shallowRef<any[]>([])

const loadData = async () => {
  const [uRes, pRes] = await Promise.allSettled([
    api.get('/users'),
    api.get('/products/admin/list', { params: { page: 1, limit: 9999 } }),
  ])
  if (uRes.status === 'fulfilled') users.value = uRes.value.data ?? []
  if (pRes.status === 'fulfilled') products.value = pRes.value.data?.items ?? []
}

// ── 統計卡片 ──────────────────────────────────────
const thisMonthUsers = computed(() => {
  const now = new Date()
  return users.value.filter((u) => {
    const d = new Date(u.createdAt)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
})

const activeProducts = computed(() => products.value.filter((p) => p.isActive).length)

const statCards = computed(() => [
  { label: '總會員數', value: users.value.length, icon: User, bg: '#409eff' },
  { label: '本月新增會員', value: thisMonthUsers.value, icon: TrendCharts, bg: '#67c23a' },
  { label: '商品總數', value: products.value.length, icon: ShoppingBag, bg: '#e6a23c' },
  { label: '上架中商品', value: activeProducts.value, icon: Goods, bg: '#f56c6c' },
])

// ── ECharts ───────────────────────────────────────
const lineChartRef = ref<HTMLDivElement>()
const pieChartRef = ref<HTMLDivElement>()
const barChartRef = ref<HTMLDivElement>()
let lineChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null


function initCharts() {
  // ─── Line Chart: 每日新增會員（本月） ───────────
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const counts = days.map((d) =>
      users.value.filter((u) => {
        const ud = new Date(u.createdAt)
        return (
          ud.getFullYear() === now.getFullYear() &&
          ud.getMonth() === now.getMonth() &&
          ud.getDate() === d
        )
      }).length
    )
    lineChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: { type: 'category', data: days.map((d) => `${d}日`), axisLabel: { interval: 4 } },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{ name: '新增會員', type: 'line', smooth: true, data: counts, areaStyle: { opacity: 0.15 }, itemStyle: { color: '#409eff' } }],
    })
  }

  // ─── Pie Chart: 登入方式 ───────────────────────
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    const groups: Record<string, number> = {}
    users.value.forEach((u) => {
      const p = u.provider || 'local'
      groups[p] = (groups[p] || 0) + 1
    })
    const labelMap: Record<string, string> = { google: 'Google', line: 'LINE', local: '本地帳號' }
    const colorMap: Record<string, string> = { google: '#ea4335', line: '#06c755', local: '#409eff' }
    const pieData = Object.entries(groups).map(([k, v]) => ({
      name: labelMap[k] ?? k,
      value: v,
      itemStyle: { color: colorMap[k] ?? '#999' },
    }))
    pieChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0 },
      series: [{ type: 'pie', radius: ['40%', '70%'], data: pieData, label: { formatter: '{b}\n{d}%' } }],
    })
  }

  // ─── Bar Chart: 各類別商品數 ───────────────────
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    const catCounts: Record<string, number> = {}
    products.value.forEach((p) => {
      const name = p.category?.name || '未分類'
      catCounts[name] = (catCounts[name] || 0) + 1
    })
    const sorted = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    barChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 80, right: 20, top: 20, bottom: 30 },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: sorted.map(([k]) => k) },
      series: [{ type: 'bar', data: sorted.map(([, v]) => v), itemStyle: { color: '#409eff', borderRadius: [0, 4, 4, 0] } }],
    })
  }
}

const handleResize = () => {
  lineChart?.resize()
  pieChart?.resize()
  barChart?.resize()
}

onMounted(async () => {
  await loadData()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  lineChart?.dispose()
  pieChart?.dispose()
  barChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #86868b;
  margin-top: 4px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-card,
.chart-card-wide {
  border-radius: 12px;
}

@media (max-width: 900px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>

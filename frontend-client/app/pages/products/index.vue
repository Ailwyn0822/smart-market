<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <!-- 搜尋框 -->
        <div class="mb-8">
            <div class="relative max-w-xl">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Icon name="material-symbols:search" class="text-gray-400 text-xl" />
                </div>
                <input v-model="searchQuery" type="text" :placeholder="$t('products.search_placeholder')"
                    class="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-content focus:ring-0 focus:border-content text-sm font-bold placeholder-gray-400 shadow-[4px_4px_0px_#1c180d]" />
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- 側邊欄過濾器 -->
            <NotebookSidebar />

            <!-- 產品區域 -->
            <div class="flex-1 min-w-0">
                <!-- 標題與排序 -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-3xl font-black text-content">
                        {{ $t('products.all_treasures') }}
                        <span class="text-gray-400 font-medium text-lg ml-2">({{ total }} {{
                            $t('products.items') }})</span>
                    </h2>
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-gray-500">{{ $t('products.sort_by') }}</span>
                        <select v-model="sortBy"
                            class="bg-white border-2 border-content rounded-lg py-1 px-3 text-sm font-bold focus:ring-0 focus:border-content cursor-pointer">
                            <option value="newest">{{ $t('products.sort_newest') }}</option>
                            <option value="price-low">{{ $t('products.sort_price_low') }}</option>
                            <option value="price-high">{{ $t('products.sort_price_high') }}</option>
                        </select>
                    </div>
                </div>

                <!-- 空白狀態 -->
                <div v-if="displayProducts.length === 0 && !pending"
                    class="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                    <Icon name="material-symbols:search-off" class="text-6xl" />
                    <span class="font-bold text-lg">{{ $t('products.no_results') }}</span>
                </div>

                <!--
                    虛擬列表容器：
                    - 上下 padding 撐出「完整」捲軸高度（讓瀏覽器以為有那麼多內容）
                    - DOM 只渲染 visibleRows（可視區域 ± overscan）
                -->
                <div ref="gridRef" :style="{
                    paddingTop: virtualState.paddingTop + 'px',
                    paddingBottom: virtualState.paddingBottom + 'px',
                }">
                    <div v-for="(row, idx) in virtualState.visibleRows" :key="virtualState.startIdx + idx"
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <ProductCard v-for="product in row" :key="product.id || product.title" :item="product" />
                    </div>
                </div>

                <!-- 載入動畫 -->
                <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <ProductCardSkeleton v-for="i in 3" :key="i" />
                </div>

                <!-- 全部載入完畢 -->
                <div v-if="!hasMore && displayProducts.length > 0" class="text-center text-gray-400 text-sm py-6">
                    已顯示全部 {{ total }} 筆商品
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useWindowScroll, useWindowSize } from '@vueuse/core'
import type { ProductResponse } from '~/types'

const { t } = useI18n()
useSeoMeta({
    title: computed(() => t('products.page_title')),
    ogTitle: '探索所有寶物 | Smart Market',
    description: '瀏覽各類二手玩具、衣物與裝備，找到獨一無二的好物。',
    ogDescription: '瀏覽各類二手玩具、衣物與裝備，找到獨一無二的好物。',
})

const productsApi = useProductsApi()
const route = useRoute()
const sortBy = ref('newest')
const searchQuery = ref('')

const debouncedKeyword = useDebounce(() => searchQuery.value.trim(), 300)

const categoryParam = computed(() => (route.query.category as string) || undefined)
const keywordParam = computed(() => debouncedKeyword.value || undefined)
const maxPriceParam = computed(() => route.query.maxPrice ? Number(route.query.maxPrice) : undefined)

// ── 視窗尺寸 & 捲動位置（VueUse 響應式）────────────
const { width, height: windowHeight } = useWindowSize()
const { y: scrollY } = useWindowScroll()

// 依視窗寬度決定欄數（與 Tailwind sm/lg breakpoint 對齊）
const cols = computed(() => width.value >= 1024 ? 3 : width.value >= 640 ? 2 : 1)

// 估算每列高度：ProductCard 是 aspect-square 圖 + 約 160px 文字按鈕 + 24px 列間距
const rowHeight = computed(() => {
    const cardW = (width.value - 120) / cols.value
    return Math.max(300, cardW + 160 + 24)
})

// ── 分頁狀態 ──────────────────────────────────────
const PAGE_SIZE = 20
const page = ref(1)
const rawItems = ref<ProductResponse[]>([])
const total = ref(0)
const pending = ref(false)
const hasMore = ref(true)

// SSR：初次抓第一頁，讓爬蟲看得到商品
const { data: initialData } = await useAsyncData(
    `products-${categoryParam.value ?? ''}-${keywordParam.value ?? ''}-${maxPriceParam.value ?? ''}`,
    () => productsApi.getAll({
        keyword: keywordParam.value,
        category: categoryParam.value,
        maxPrice: maxPriceParam.value,
        page: 1,
        limit: PAGE_SIZE,
    })
)
if (initialData.value) {
    const res = initialData.value as { items: any[]; total: number }
    rawItems.value = res.items
    total.value = res.total
    page.value = 2
    if (rawItems.value.length >= res.total) hasMore.value = false
}

const loadMore = async () => {
    if (pending.value || !hasMore.value) return
    pending.value = true
    try {
        const res = await productsApi.getAll({
            keyword: keywordParam.value,
            category: categoryParam.value,
            maxPrice: maxPriceParam.value,
            page: page.value,
            limit: PAGE_SIZE,
        }) as { items: any[]; total: number }
        rawItems.value.push(...res.items)
        total.value = res.total
        if (rawItems.value.length >= res.total) hasMore.value = false
        page.value++
    } catch {
        // 靜默失敗
    } finally {
        pending.value = false
    }
}

const resetAndLoad = () => {
    page.value = 1
    rawItems.value = []
    total.value = 0
    hasMore.value = true
    window.scrollTo({ top: 0, behavior: 'instant' })
    loadMore()
}

watch([categoryParam, keywordParam, maxPriceParam], resetAndLoad)

// ── 虛擬渲染核心 ──────────────────────────────────
// gridRef 讓我們知道商品列表從頁面哪個 Y 位置開始
const gridRef = ref<HTMLElement>()
const containerOffsetTop = ref(0)

const measureContainer = () => {
    if (gridRef.value) {
        // getBoundingClientRect().top 是相對 viewport，加上 scrollY 就是相對頁面頂端
        containerOffsetTop.value = gridRef.value.getBoundingClientRect().top + window.scrollY
    }
}

// 將商品平鋪陣列按欄數分組成「列」
const rows = computed(() => {
    const n = cols.value
    const items = displayProducts.value
    const result: (typeof items)[] = []
    for (let i = 0; i < items.length; i += n) result.push(items.slice(i, i + n))
    return result
})

const OVERSCAN = 3

// 核心計算：根據目前捲動位置，算出哪幾列要出現，以及上下 padding
const virtualState = computed(() => {
    const rh = rowHeight.value
    const totalRows = rows.value.length

    // 用戶已捲過多少 px（相對於商品容器頂端）
    const scrolledInContainer = Math.max(0, scrollY.value - containerOffsetTop.value)

    const startIdx = Math.max(0, Math.floor(scrolledInContainer / rh) - OVERSCAN)
    const visibleCount = Math.ceil(windowHeight.value / rh) + OVERSCAN * 2
    const endIdx = Math.min(totalRows, startIdx + visibleCount)

    return {
        startIdx,
        paddingTop: startIdx * rh,
        paddingBottom: Math.max(0, (totalRows - endIdx) * rh),
        visibleRows: rows.value.slice(startIdx, endIdx),
    }
})

// ── Window scroll：無限滾動 ───────────────────────
const handleWindowScroll = () => {
    const scrolled = window.scrollY + window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    if (docHeight - scrolled < 300) loadMore()
}

onMounted(() => {
    // 等 DOM 渲染完才量測容器位置
    nextTick(measureContainer)
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    window.addEventListener('resize', measureContainer)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleWindowScroll)
    window.removeEventListener('resize', measureContainer)
})

// 欄數改變時（螢幕旋轉/resize）重新量測容器
watch(cols, () => nextTick(measureContainer))

// ── 排序 & 格式轉換 ───────────────────────────────
const colorStyles = [
    { border: 'crayon-border-red', price: 'text-accent-red', hover: 'hover:bg-accent-red' },
    { border: 'crayon-border-blue', price: 'text-accent-blue', hover: 'hover:bg-accent-blue' },
    { border: 'crayon-border-yellow', price: 'text-primary', hover: 'hover:bg-primary' },
    { border: 'crayon-border-purple', price: 'text-accent-purple', hover: 'hover:bg-accent-purple' }
]

function mapProduct(p: ProductResponse, index: number) {
    const style = colorStyles[index % colorStyles.length]!
    return {
        id: p.id,
        title: p.name || p.title || '',
        price: `$${parseFloat(String(p.price || 0)).toFixed(0)}`,
        condition: p.condition === 'New' || !p.condition ? '全新' : p.condition,
        description: p.description || '',
        image: p.imageUrl || p.image || '',
        borderColorClass: style.border,
        priceColor: style.price,
        btnHoverBg: style.hover,
        btnHoverText: 'text-white',
        category: typeof p.category === 'object' && p.category !== null
            ? p.category
            : { name: p.category || '' },
    }
}

const sortedRaw = computed(() => {
    const sorted = [...rawItems.value]
    if (sortBy.value === 'price-low')
        return sorted.sort((a, b) => parseFloat(String(a.price || 0)) - parseFloat(String(b.price || 0)))
    if (sortBy.value === 'price-high')
        return sorted.sort((a, b) => parseFloat(String(b.price || 0)) - parseFloat(String(a.price || 0)))
    return sorted
})

const displayProducts = computed(() =>
    sortedRaw.value.map((p, i) => mapProduct(p, i))
)
</script>

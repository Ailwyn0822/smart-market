<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <!-- 搜尋框 -->
        <div class="mb-8">
            <div class="relative max-w-xl">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Icon name="material-symbols:search" class="text-gray-400 text-xl" />
                </div>
                <input v-model="searchQuery" type="text"
                    :placeholder="$t('products.search_placeholder')"
                    class="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-content focus:ring-0 focus:border-content text-sm font-bold placeholder-gray-400 shadow-[4px_4px_0px_#1c180d]" />
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- 側邊欄過濾器 -->
            <NotebookSidebar />

            <!-- 產品區域 -->
            <div class="flex-1">
                <!-- 標題與排序 -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-3xl font-black text-content">
                        {{ $t('products.all_treasures') }}
                        <span class="text-gray-400 font-medium text-lg ml-2">({{ filteredProducts.length }} {{
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
                <div v-if="filteredProducts.length === 0 && !pending"
                    class="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                    <Icon name="material-symbols:search-off" class="text-6xl" />
                    <span class="font-bold text-lg">找不到相關商品</span>
                </div>

                <!-- 產品網格 -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProductCard v-for="product in displayProducts" :key="product.id || product.title"
                        :item="product" />
                </div>

                <!-- 載入動畫 -->
                <div v-if="pending" class="mt-16 flex justify-center">
                    <div class="flex gap-2">
                        <div class="size-4 bg-primary rounded-full animate-bounce"></div>
                        <div class="size-4 bg-accent-red rounded-full animate-bounce delay-100"></div>
                        <div class="size-4 bg-accent-blue rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()
const sortBy = ref('newest')
const searchQuery = ref('')

// 防抖：300ms 後才更新查詢關鍵字（composable 內自動在 onUnmounted 清理）
const debouncedKeyword = useDebounce(() => searchQuery.value.trim(), 300)

const categoryParam = computed(() => (route.query.category as string) || undefined)
const keywordParam = computed(() => debouncedKeyword.value || undefined)

const { data: apiProducts, pending } = useFetch<any[]>(`${config.public.apiBase}/products`, {
    query: { category: categoryParam, keyword: keywordParam },
    watch: [categoryParam, keywordParam],
})

const colorStyles = [
    { border: 'crayon-border-red', price: 'text-accent-red', hover: 'hover:bg-accent-red' },
    { border: 'crayon-border-blue', price: 'text-accent-blue', hover: 'hover:bg-accent-blue' },
    { border: 'crayon-border-yellow', price: 'text-primary', hover: 'hover:bg-primary' },
    { border: 'crayon-border-purple', price: 'text-accent-purple', hover: 'hover:bg-accent-purple' }
]

function mapProduct(p: any, index: number) {
    const style = colorStyles[index % colorStyles.length]
    return {
        id: p.id,
        title: p.name || p.title,
        price: `$${parseFloat(p.price || 0).toFixed(0)}`,
        condition: p.condition === 'New' || !p.condition ? '全新' : p.condition,
        description: p.description,
        image: p.imageUrl || p.image,
        borderColorClass: style.border,
        priceColor: style.price,
        btnHoverBg: style.hover,
        btnHoverText: 'text-white',
        category: typeof p.category === 'object' && p.category !== null
            ? p.category
            : { name: p.category || '' },
    }
}

const filteredProducts = computed(() => apiProducts.value || [])

const sortedProducts = computed(() => {
    const sorted = [...filteredProducts.value]
    if (sortBy.value === 'price-low') {
        return sorted.sort((a: any, b: any) => parseFloat(a.price || 0) - parseFloat(b.price || 0))
    } else if (sortBy.value === 'price-high') {
        return sorted.sort((a: any, b: any) => parseFloat(b.price || 0) - parseFloat(a.price || 0))
    }
    return sorted
})

// 映射後的顯示資料，避免在模板 v-for 中重複呼叫函式
const displayProducts = computed(() =>
    sortedProducts.value.map((p: any, index: number) => mapProduct(p, index))
)
</script>

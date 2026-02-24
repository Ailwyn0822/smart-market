<template>
    <aside class="w-full lg:w-72 shrink-0">
        <div class="sticky top-8">
            <div
                class="relative notebook-sidebar border-2 border-content rounded-r-2xl rounded-l-lg shadow-[4px_4px_0px_rgba(0,0,0,0.1)] min-h-[500px] overflow-hidden">
                <!-- 環孔裝飾 -->
                <div
                    class="absolute top-0 left-0 bottom-0 w-8 flex flex-col items-center gap-6 pt-4 bg-gray-200 border-r-2 border-content z-10">
                    <div v-for="n in 12" :key="n" class="w-4 h-4 bg-gray-700 rounded-full shadow-inner"></div>
                </div>

                <!-- 過濾器內容 -->
                <div class="pl-14 pr-6 py-8">
                    <div class="mb-8">
                        <h3
                            class="font-black text-2xl text-content rotate-[-2deg] mb-6 decoration-wavy underline decoration-accent-red underline-offset-4">
                            {{ $t('products.filter_title') }}
                        </h3>

                        <div class="space-y-6">
                            <!-- 類別過濾器 -->
                            <div>
                                <h4 class="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">
                                    {{ $t('products.category') }}
                                </h4>

                                <div v-if="loadingCategories" class="flex justify-center py-4">
                                    <Icon name="line-md:loading-loop" class="text-2xl text-primary" />
                                </div>

                                <div v-else class="flex flex-col gap-2">
                                    <!-- 全部 -->
                                    <button @click="selectCategory('')"
                                        :class="[
                                            'w-full text-left font-bold py-2 px-4 rounded-lg border-2 transition-all text-sm',
                                            selectedCategory === ''
                                                ? 'bg-content text-white border-content'
                                                : 'bg-white text-content border-gray-200 hover:border-content'
                                        ]">
                                        {{ $t('products.all_categories') }}
                                    </button>

                                    <!-- 各類別 -->
                                    <button v-for="(cat, index) in categories" :key="cat.id || cat.name"
                                        @click="selectCategory(cat.name)"
                                        :class="[
                                            'w-full text-left font-bold py-2 px-4 rounded-lg border-2 transition-all text-sm',
                                            selectedCategory === cat.name
                                                ? 'text-white border-transparent'
                                                : 'bg-white text-content border-gray-200 hover:border-content',
                                            selectedCategory === cat.name ? categoryBgColors[index % categoryBgColors.length] : ''
                                        ]">
                                        {{ cat.name }}
                                    </button>
                                </div>
                            </div>

                            <!-- 價格範圍 -->
                            <div class="pt-4 border-t-2 border-dashed border-gray-300">
                                <h4 class="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">
                                    {{ $t('products.price_range') }}
                                </h4>
                                <div class="px-2">
                                    <input class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        max="100" min="0" type="range" v-model="priceValue" />
                                    <div class="flex justify-between mt-2 font-bold text-sm text-content">
                                        <span>$0</span>
                                        <span>${{ priceValue }}</span>
                                        <span>$100+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fun! 裝飾標籤 -->
            <div
                class="absolute -bottom-4 -right-4 bg-primary text-content size-16 rounded-full flex items-center justify-center font-black rotate-12 border-2 border-content shadow-md z-20">
                Fun!
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const priceValue = ref(40)

const categories = ref<{ id?: number; name: string }[]>([])
const loadingCategories = shallowRef(false)

const categoryBgColors = [
    'bg-accent-purple',
    'bg-accent-blue',
    'bg-primary',
    'bg-accent-red',
    'bg-green-500',
    'bg-orange-500',
]

// 從 URL 取得目前選中的類別
const selectedCategory = computed(() => (route.query.category as string) || '')

async function fetchCategories() {
    loadingCategories.value = true
    try {
        const data = await $fetch<{ id?: number; name: string }[]>(`${config.public.apiBase}/categories`)
        categories.value = data || []
    } catch (e) {
        console.error('Failed to fetch categories', e)
        categories.value = []
    } finally {
        loadingCategories.value = false
    }
}

function selectCategory(name: string) {
    const query = { ...route.query }
    if (name) {
        query.category = name
    } else {
        delete query.category
    }
    router.push({ path: route.path, query })
}

onMounted(fetchCategories)
</script>

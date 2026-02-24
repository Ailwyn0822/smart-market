<template>
    <div class="min-h-screen">
        <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-12">
            <div class="mb-8">
                <NuxtLink to="/products"
                    class="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-content transition-colors">
                    <Icon name="material-symbols:arrow-back" />
                    {{ $t('products.back_to_gallery') }}
                </NuxtLink>
            </div>

            <!-- 載入中 -->
            <div v-if="pending" class="flex justify-center items-center py-32">
                <div class="flex gap-2">
                    <div class="size-4 bg-primary rounded-full animate-bounce"></div>
                    <div class="size-4 bg-accent-red rounded-full animate-bounce delay-100"></div>
                    <div class="size-4 bg-accent-blue rounded-full animate-bounce delay-200"></div>
                </div>
            </div>

            <!-- 找不到商品 -->
            <div v-else-if="!product"
                class="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
                <Icon name="material-symbols:search-off" class="text-6xl" />
                <span class="font-bold text-xl">找不到此商品</span>
                <NuxtLink to="/products"
                    class="mt-2 bg-primary px-6 py-2 rounded-full border-2 border-content font-bold text-content shadow-[4px_4px_0px_#1c180d]">
                    回到商品列表
                </NuxtLink>
            </div>

            <div v-else class="flex flex-col lg:flex-row gap-16 items-start">
                <!-- 左側圖片區 -->
                <div class="w-full lg:w-1/2 flex flex-col items-center sticky top-8">
                    <div class="relative group w-full max-w-xl mx-auto py-6">
                        <div class="relative bg-white p-4 pb-12 shadow-xl rotate-[-2deg] z-10">
                            <NuxtImg :src="product.imageUrl || product.image" :alt="product.name || product.title"
                                class="w-full h-auto object-cover grayscale-[10%] relative z-0" />
                            <div class="washi-tape absolute -top-2 -left-2 w-40 h-12 bg-primary -rotate-[35deg] z-50">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右側資訊區 -->
                <div class="w-full lg:w-1/2 flex flex-col gap-10 relative mt-12 lg:mt-0">
                    <!-- Price Badge -->
                    <div class="absolute -top-12 right-0 lg:-right-4 z-20 transform rotate-12 group cursor-default">
                        <div
                            class="bg-primary text-content w-32 h-32 rounded-full flex items-center justify-center shadow-xl border-4 border-dashed border-content group-hover:scale-110 transition-transform bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
                            <div class="text-center -rotate-12">
                                <span class="block text-xs font-bold font-mono-card uppercase tracking-widest mb-1">{{
                                    $t('products.price') }}</span>
                                <span class="font-marker text-4xl">${{ parseFloat(product.price || 0).toFixed(0) }}</span>
                            </div>
                        </div>
                        <div
                            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-16 w-1 bg-white border border-gray-300">
                        </div>
                        <div
                            class="absolute top-[-4rem] left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border border-gray-400">
                        </div>
                    </div>

                    <div class="relative z-10 pr-24">
                        <h1 class="text-5xl lg:text-6xl font-black text-content tracking-tight leading-[1.1]">
                            {{ product.name || product.title }}
                        </h1>
                    </div>

                    <!-- 賣家資訊卡片 -->
                    <NuxtLink v-if="sellerInfo"
                        :to="`/seller/${sellerInfo.id}`"
                        class="flex items-center gap-3 bg-white/80 border-2 border-content rounded-2xl px-4 py-3 shadow-[3px_3px_0px_#1c180d] hover:shadow-[1px_1px_0px_#1c180d] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group/seller w-fit">
                        <div class="size-10 rounded-full border-2 border-content overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                            <NuxtImg v-if="sellerInfo.avatar" :src="sellerInfo.avatar" alt="seller"
                                class="w-full h-full object-cover" />
                            <Icon v-else name="material-symbols:person" class="text-gray-400 text-xl" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">賣家</span>
                            <span class="text-sm font-black text-content group-hover/seller:text-accent-blue transition-colors">
                                {{ sellerInfo.name || '查看賣家' }}
                            </span>
                        </div>
                        <Icon name="material-symbols:chevron-right" class="text-gray-400 ml-auto group-hover/seller:translate-x-1 transition-transform" />
                    </NuxtLink>

                    <!-- Description Box -->
                    <div class="relative w-full transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div
                            class="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/80 rotate-1 border-l border-r border-white/50 backdrop-blur-sm z-10 shadow-sm">
                        </div>
                        <div class="lined-paper p-8 pt-10 rounded-xl border border-gray-200 shadow-md">
                            <h3 class="font-marker text-xl mb-2 text-gray-400 rotate-[-1deg]">{{
                                $t('products.description') }}:</h3>
                            <p class="text-xl leading-[4rem] text-content font-medium font-marker">
                                {{ product.description }}
                            </p>
                        </div>
                    </div>

                    <!-- 操作按鈕 -->
                    <div class="py-4 flex flex-col gap-3">
                        <button @click="addToCart"
                            class="w-full bg-accent-blue text-white font-marker text-2xl py-5 px-6 rounded-2xl border-4 border-content shadow-[6px_6px_0px_#1c180d] hover:shadow-[2px_2px_0px_#1c180d] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 group">
                            <Icon name="material-symbols:shopping-cart"
                                class="text-3xl group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                            {{ $t('products.add_to_cart') }}
                        </button>
                        <button @click="toggleFavorite"
                            class="w-full bg-white font-bold text-base py-3 px-6 rounded-2xl border-2 border-content shadow-[4px_4px_0px_#1c180d] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                            :class="isFavorited ? 'text-accent-red' : 'text-gray-500'">
                            <Icon :name="isFavorited ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'"
                                class="text-xl" />
                            {{ isFavorited ? $t('products.unfavorite') : $t('products.favorite') }}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '#imports'

useHead({
    link: [
        { href: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Courier+Prime:wght@400;700&display=swap', rel: 'stylesheet' }
    ]
})

useSeoMeta({
    title: () => product.value ? `${product.value.name} - Smart Market` : 'Smart Market',
    ogTitle: () => product.value?.name,
    description: () => product.value?.description?.slice(0, 160),
    ogDescription: () => product.value?.description?.slice(0, 160),
    ogImage: () => product.value?.imageUrl || product.value?.image,
    ogType: 'website',
})

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const productId = route.params.id as string

// 串接 API 取得商品資料（加 default 避免 SSR 時後端錯誤炸出整頁）
const { data: product, pending } = await useFetch<any>(
    `${config.public.apiBase}/products/${productId}`,
    { default: () => null }
)

// 從不同可能的 API 欄位中提取賣家資訊
const sellerInfo = computed(() => {
    const p = product.value
    if (!p) return null
    // 支援多種 API 回傳格式：seller / user / sellerId / userId 等
    const id = p.seller?.id || p.user?.id || p.sellerId || p.userId || p.seller_id || p.user_id || null
    const name = p.seller?.name || p.seller?.username || p.user?.name || p.user?.username || p.sellerName || p.seller_name || null
    const avatar = p.seller?.avatar || p.seller?.picture || p.user?.avatar || p.user?.picture || p.sellerAvatar || null
    if (!id) return null
    return { id, name, avatar }
})

// 收藏狀態
const isFavorited = ref(false)

// 若已登入，確認是否已收藏
if (authStore.isAuthenticated) {
    try {
        const favRes = await $fetch<any>(`${config.public.apiBase}/favorites/check/${productId}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        }).catch(() => null)
        if (favRes) isFavorited.value = favRes.isFavorited ?? false
    } catch {}
}

async function toggleFavorite() {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    try {
        if (isFavorited.value) {
            await $fetch(`${config.public.apiBase}/favorites/${productId}/favorite`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            isFavorited.value = false
            toast.success('已取消收藏')
        } else {
            await $fetch(`${config.public.apiBase}/favorites/${productId}/favorite`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            isFavorited.value = true
            toast.success('已加入收藏！')
        }
    } catch (e) {
        toast.error('操作失敗，請稍後再試')
    }
}

function addToCart() {
    if (!product.value) return
    const cartStore = useCartStore()
    cartStore.addToCart(product.value, 1)
    toast.success('已加入購物車！')
}
</script>

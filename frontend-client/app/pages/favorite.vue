<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-5xl mt-12">
            <!-- 標籤 Folder Tab -->
            <div
                class="absolute -top-12 left-0 w-64 h-14 bg-accent-red folder-tab-clip border-4 border-b-0 border-content flex items-center justify-center z-10 shadow-[4px_-4px_0px_rgba(0,0,0,0.05)]">
                <div class="flex items-center gap-2">
                    <Icon name="material-symbols:favorite" class="text-white text-xl" />
                    <span class="font-black text-white text-xl">{{ $t('favorite.title') }}</span>
                </div>
            </div>

            <!-- 主卡片區域 -->
            <div
                class="bg-paper-yellow rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] relative z-20 overflow-hidden min-h-[500px]">

                <!-- 背景圓點網格 -->
                <div class="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
                    style="background-image: radial-gradient(#1c180d 1px, transparent 1px); background-size: 24px 24px;">
                </div>

                <div class="relative z-10 p-8 lg:p-12">

                    <!-- Loading 狀態 -->
                    <div v-if="pending" class="flex flex-col items-center justify-center py-20 gap-4">
                        <Icon name="material-symbols:sync" class="text-5xl text-accent-red animate-spin" />
                        <p class="font-bold text-gray-500">{{ $t('favorite.loading') }}</p>
                    </div>

                    <!-- 未登入狀態 -->
                    <div v-else-if="!authStore.isAuthenticated"
                        class="flex flex-col items-center justify-center py-20 gap-4">
                        <Icon name="material-symbols:lock" class="text-6xl text-gray-300" />
                        <h2 class="text-xl font-black text-content">{{ $t('favorite.login_required') }}</h2>
                        <NuxtLink to="/login"
                            class="mt-2 bg-primary px-6 py-3 rounded-xl border-2 border-content text-content font-black shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                            {{ $t('auth.login') }}
                        </NuxtLink>
                    </div>

                    <!-- 空狀態 -->
                    <div v-else-if="!favorites?.length" class="flex flex-col items-center justify-center py-20 gap-4">
                        <div
                            class="w-32 h-32 bg-white rounded-full border-4 border-content border-dashed flex items-center justify-center mb-4">
                            <Icon name="material-symbols:heart-broken" class="text-5xl text-gray-300" />
                        </div>
                        <h2 class="text-2xl font-black text-content">{{ $t('favorite.empty_title') }}</h2>
                        <p class="font-bold text-gray-500">{{ $t('favorite.empty_desc') }}</p>
                        <NuxtLink to="/"
                            class="mt-4 bg-primary px-8 py-3 rounded-xl border-2 border-content text-content font-black shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2">
                            <Icon name="material-symbols:storefront" class="text-xl" />
                            {{ $t('favorite.go_shopping') }}
                        </NuxtLink>
                    </div>

                    <!-- 收藏商品列表 -->
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div v-for="product in favorites" :key="product.id"
                            class="bg-white p-4 rounded-2xl border-2 border-content shadow-stitch flex flex-col gap-3 group hover:-translate-y-2 transition-transform duration-300 relative"
                            :class="{ 'opacity-60': product.isActive === false }">

                            <!-- 圖片區塊 -->
                            <div
                                class="aspect-square bg-gray-100 rounded-xl overflow-hidden relative border-2 border-content">
                                <!-- 已下架遮罩 -->
                                <div v-if="product.isActive === false"
                                    class="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
                                    <span class="bg-gray-800 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-white">
                                        {{ $t('products.delisted') }}
                                    </span>
                                </div>

                                <!-- 取消收藏按鈕 -->
                                <button @click="removeFavorite(product.id)"
                                    class="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full border-2 border-content flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm group/btn"
                                    :title="$t('favorite.remove')">
                                    <Icon name="material-symbols:favorite"
                                        class="text-accent-red text-lg group-hover/btn:scale-110 transition-transform" />
                                </button>

                                <NuxtImg v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                                    <Icon name="material-symbols:image" class="text-4xl text-gray-400" />
                                </div>
                            </div>

                            <!-- 資訊區塊 -->
                            <div class="flex flex-col gap-1 mt-1">
                                <h3 class="font-black text-content text-lg line-clamp-1">{{ product.name }}</h3>
                                <span class="font-black text-xl text-accent-blue">${{ product.price }}</span>
                            </div>

                            <!-- 動作按鈕 -->
                            <div class="mt-auto pt-2">
                                <button v-if="product.isActive === false" disabled
                                    class="w-full bg-gray-200 border-2 border-gray-300 py-2.5 rounded-xl font-black text-gray-400 text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                    {{ $t('products.delisted') }}
                                </button>
                                <button v-else-if="product.stock !== undefined && product.stock <= 0" disabled
                                    class="w-full bg-gray-200 border-2 border-gray-300 py-2.5 rounded-xl font-black text-gray-400 text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                    {{ $t('products.sold_out') }}
                                </button>
                                <button v-else @click="addToCart(product)"
                                    class="w-full bg-primary hover:bg-[#ffe066] border-2 border-content py-2.5 rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2 shadow-stitch-sm active:shadow-none active:translate-y-1">
                                    <Icon name="material-symbols:shopping-cart" class="text-lg" />
                                    {{ $t('products.add_to_cart') }}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- 底部鋸齒裝飾 -->
            <div class="relative w-full h-4 mt-2"
                style="background-image: radial-gradient(circle at 12px 0, transparent 12px, #221e10 13px); background-size: 24px 20px; background-repeat: repeat-x;">
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, watch, shallowRef } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useToast } from '~/composables/useToast'

const config = useRuntimeConfig()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

useHead({ title: 'My Favorites | Smart Market' })

interface Product {
    id: number
    name: string
    description: string
    price: string
    stock: number
    imageUrl: string
    categoryId: number
    condition: string
    isActive?: boolean
}

const favorites = ref<Product[]>([])
const pending = shallowRef(false)

async function fetchFavorites() {
    if (!authStore.isAuthenticated) return
    pending.value = true
    try {
        const data = await $fetch<Product[]>(`${config.public.apiBase}/favorites/my`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        favorites.value = data
    } catch (e) {
        console.error('Failed to fetch favorites', e)
    } finally {
        pending.value = false
    }
}

async function removeFavorite(productId: number) {
    if (!authStore.isAuthenticated) return
    try {
        await $fetch(`${config.public.apiBase}/favorites/${productId}/favorite`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        // 從列表中移除
        favorites.value = favorites.value.filter(p => p.id !== productId)
    } catch (e) {
        console.error('Failed to remove favorite', e)
    }
}

function addToCart(product: Product) {
    cartStore.addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        stock: product.stock
    } as any, 1)
    toast.success(`已將 ${product.name} 加入購物車！`)
}

// 登入狀態改變時重新抓取
watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) fetchFavorites()
    else favorites.value = []
}, { immediate: true })

</script>

<style scoped>
.folder-tab-clip {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    border-radius: 1rem 1rem 0 0;
}
</style>

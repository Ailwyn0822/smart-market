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
            <div v-else-if="!product" class="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
                <Icon name="material-symbols:search-off" class="text-6xl" />
                <span class="font-bold text-xl">{{ $t('products.not_found') }}</span>
                <NuxtLink to="/products"
                    class="mt-2 bg-primary px-6 py-2 rounded-full border-2 border-content font-bold text-content shadow-[4px_4px_0px_#1c180d]">
                    {{ $t('products.back_to_list') }}
                </NuxtLink>
            </div>

            <div v-else class="flex flex-col gap-16">
                <!-- 商品主資訊 -->
                <div class="flex flex-col lg:flex-row gap-16 items-start">
                    <!-- 左側圖片區 -->
                    <div class="w-full lg:w-1/2 flex flex-col items-center sticky top-8">
                        <div class="relative group w-full max-w-xl mx-auto py-6">
                            <div class="relative bg-white p-4 pb-12 shadow-xl rotate-[-2deg] z-10">
                                <NuxtImg :src="product.imageUrl || product.image" :alt="product.name || product.title"
                                    class="w-full h-auto object-cover grayscale-[10%] relative z-0" />
                                <div
                                    class="washi-tape absolute -top-2 -left-2 w-40 h-12 bg-primary -rotate-[35deg] z-50">
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
                                    <span
                                        class="block text-xs font-bold font-mono-card uppercase tracking-widest mb-1">{{
                                            $t('products.price') }}</span>
                                    <span class="font-marker text-4xl">${{ parseFloat(String(product.price ||
                                        0)).toFixed(0)
                                    }}</span>
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
                        <NuxtLink v-if="sellerInfo" :to="`/seller/${sellerInfo.id}`"
                            class="flex items-center gap-3 bg-white/80 border-2 border-content rounded-2xl px-4 py-3 shadow-[3px_3px_0px_#1c180d] hover:shadow-[1px_1px_0px_#1c180d] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group/seller w-fit">
                            <div
                                class="size-10 rounded-full border-2 border-content overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                                <NuxtImg v-if="sellerInfo.avatar" :src="sellerInfo.avatar" alt="seller"
                                    class="w-full h-full object-cover" />
                                <Icon v-else name="material-symbols:person" class="text-gray-400 text-xl" />
                            </div>
                            <div class="flex flex-col">
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{
                                    $t('products.seller_label') }}</span>
                                <span
                                    class="text-sm font-black text-content group-hover/seller:text-accent-blue transition-colors">
                                    {{ sellerInfo.name || $t('products.view_seller') }}
                                </span>
                            </div>
                            <Icon name="material-symbols:chevron-right"
                                class="text-gray-400 ml-auto group-hover/seller:translate-x-1 transition-transform" />
                        </NuxtLink>

                        <!-- Description Box -->
                        <div
                            class="relative w-full transform -rotate-1 hover:rotate-0 transition-transform duration-300">
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
                                <Icon
                                    :name="isFavorited ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'"
                                    class="text-xl" />
                                {{ isFavorited ? $t('products.unfavorite') : $t('products.favorite') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 商品評價區塊 -->
                <div class="border-t-2 border-dashed border-content/20 pt-10">
                    <h2 class="text-2xl font-black text-content mb-6 flex items-center gap-3">
                        <Icon name="material-symbols:star-rounded" class="text-3xl text-accent-red" />
                        {{ $t('products.reviews_title') }}
                        <span v-if="reviewsData" class="text-base font-bold text-gray-400">({{ reviewsData.total
                            }})</span>
                    </h2>

                    <!-- 載入中 -->
                    <div v-if="reviewsLoading" class="flex justify-center py-12">
                        <div class="flex gap-2">
                            <div class="size-3 bg-primary rounded-full animate-bounce"></div>
                            <div class="size-3 bg-accent-red rounded-full animate-bounce delay-100"></div>
                            <div class="size-3 bg-accent-blue rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>

                    <!-- 無評價 -->
                    <div v-else-if="!reviewsData || reviewsData.items.length === 0"
                        class="flex flex-col items-center gap-3 py-12 text-gray-400">
                        <Icon name="material-symbols:rate-review-outline" class="text-5xl" />
                        <p class="font-bold">{{ $t('products.no_reviews') }}</p>
                    </div>

                    <!-- 評價列表 -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="review in reviewsData.items" :key="review.id"
                            class="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 space-y-2 hover:border-content transition-all">
                            <div class="flex items-center justify-between">
                                <div class="flex gap-0.5">
                                    <Icon v-for="s in 5" :key="s" name="material-symbols:star-rounded" class="text-xl"
                                        :class="s <= review.rating ? 'text-accent-red' : 'text-gray-200'" />
                                </div>
                                <span class="text-xs text-gray-400 font-bold">{{ formatReviewDate(review.createdAt)
                                    }}</span>
                            </div>
                            <p class="text-sm text-content font-medium leading-relaxed">{{ review.comment }}</p>
                        </div>
                    </div>

                    <!-- 載入更多 -->
                    <div v-if="reviewsData && reviewsData.hasMore" class="flex justify-center mt-6">
                        <button @click="loadMoreReviews" :disabled="reviewsLoadingMore"
                            class="bg-white px-6 py-2 rounded-xl border-2 border-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50">
                            {{ reviewsLoadingMore ? $t('products.loading_more') : $t('products.load_more_reviews') }}
                        </button>
                    </div>
                </div>


            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onMounted, nextTick } from 'vue'
import { useHead } from '#imports'
import { useI18n } from '#imports'
import type { ProductDetail, ReviewItem, ReviewsResponse } from '~/types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const $api = useApi()
const productsApi = useProductsApi()
const reviewsApi = useReviewsApi()
const favoritesApi = useFavoritesApi()
const toast = useToast()

const productId = route.params.id as string


// 串接 API 取得商品資料（加 default 避免 SSR 時後端錯誤炸出整頁）
const { data: product, pending } = await useFetch<ProductDetail | null>(
    `/products/${productId}`,
    { $fetch: $api, default: () => null }
)

// 從不同可能的 API 欄位中提取賣家資訊
const sellerInfo = computed(() => {
    const p = product.value
    if (!p) return null
    const id = p.seller?.id || p.user?.id || p.sellerId || p.userId || p.seller_id || p.user_id || null
    const name = p.seller?.name || p.seller?.username || p.user?.name || p.user?.username || p.sellerName || p.seller_name || null
    const avatar = p.seller?.avatar || p.seller?.picture || p.user?.avatar || p.user?.picture || p.sellerAvatar || null
    if (!id) return null
    return { id, name, avatar }
})

// JSON-LD Product schema
const jsonLd = computed(() => {
    if (!product.value) return null
    const p = product.value
    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name || p.title,
        description: p.description,
        image: p.imageUrl || p.image,
        offers: {
            '@type': 'Offer',
            price: parseFloat(String(p.price || 0)).toFixed(2),
            priceCurrency: 'TWD',
            availability: (p.stock ?? 1) > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
    }
    if (sellerInfo.value?.name) {
        schema.brand = { '@type': 'Brand', name: sellerInfo.value.name }
    }
    return schema
})

useHead({
    link: [
        { href: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Courier+Prime:wght@400;700&display=swap', rel: 'stylesheet' }
    ],
    script: computed(() =>
        jsonLd.value
            ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd.value) }]
            : []
    ),
})

useSeoMeta({
    title: () => product.value ? `${product.value.name} - Smart Market` : 'Smart Market',
    ogTitle: () => product.value?.name,
    description: () => product.value?.description?.slice(0, 160),
    ogDescription: () => product.value?.description?.slice(0, 160),
    ogImage: () => product.value?.imageUrl || product.value?.image,
    ogType: 'website',
})

// 評價資料
const reviewsData = ref<ReviewsResponse | null>(null)
const reviewsLoading = shallowRef(true)
const reviewsLoadingMore = shallowRef(false)
const reviewsPage = shallowRef(1)

async function fetchReviews(page = 1) {
    try {
        const res = await reviewsApi.getByProduct(productId, { page, limit: 6 }) as ReviewsResponse
        if (page === 1) {
            reviewsData.value = res
        } else if (reviewsData.value) {
            reviewsData.value = { ...res, items: [...reviewsData.value.items, ...res.items] }
        }
        reviewsPage.value = page
    } catch { }
    finally { reviewsLoading.value = false }
}

async function loadMoreReviews() {
    reviewsLoadingMore.value = true
    await fetchReviews(reviewsPage.value + 1)
    reviewsLoadingMore.value = false
}

function formatReviewDate(dateStr: string) {
    const d = new Date(dateStr)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
    await fetchReviews(1)
})

// 收藏狀態
const isFavorited = ref(false)

// 若已登入，確認是否已收藏
if (authStore.isAuthenticated) {
    try {
        const favRes = await favoritesApi.check(productId).catch(() => null) as any
        if (favRes) isFavorited.value = favRes.isFavorited ?? false
    } catch { }
}

async function toggleFavorite() {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    if (product.value?.userId && product.value.userId === authStore.user?.id) {
        toast.error(t('products.cannot_favorite_own'))
        return
    }
    try {
        if (isFavorited.value) {
            await favoritesApi.remove(productId)
            isFavorited.value = false
            toast.success(t('toast.remove_from_favorite'))
        } else {
            await favoritesApi.add(productId)
            isFavorited.value = true
            toast.success(t('toast.add_to_favorite'))
        }
    } catch (e) {
        toast.error(t('toast.error_generic'))
    }
}

function addToCart() {
    if (!product.value) return
    if (authStore.isAuthenticated && product.value.userId && product.value.userId === authStore.user?.id) {
        toast.error(t('products.cannot_buy_own'))
        return
    }
    const cartStore = useCartStore()
    cartStore.addToCart(product.value as unknown as import('~/types').ApiProduct, 1)
    toast.success(t('toast.add_to_cart'))
}


</script>

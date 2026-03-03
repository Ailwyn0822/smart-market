<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-6xl mt-8">

            <!-- 返回按鈕 -->
            <button @click="$router.back()"
                class="inline-flex items-center gap-2 mb-6 font-bold text-content hover:text-accent-red transition-colors group">
                <Icon name="material-symbols:arrow-back"
                    class="text-xl group-hover:-translate-x-1 transition-transform" />
                {{ $t('seller.back') }}
            </button>

            <!-- Loading -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 gap-3">
                <Icon name="material-symbols:sync" class="text-5xl text-accent-red animate-spin" />
                <p class="font-bold text-gray-400">{{ $t('seller.loading') }}</p>
            </div>

            <!-- 404 -->
            <div v-else-if="!storeData" class="flex flex-col items-center justify-center py-32 gap-4">
                <Icon name="material-symbols:storefront-outline" class="text-6xl text-gray-300" />
                <p class="font-bold text-gray-400 text-lg">{{ $t('seller.not_found') }}</p>
                <NuxtLink to="/products"
                    class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                    {{ $t('seller.browse_products') }}
                </NuxtLink>
            </div>

            <!-- 賣家頁面 -->
            <div v-else class="space-y-12">
                <!-- 賣家個人資訊區塊 -->
                <div
                    class="bg-white rounded-[2.5rem] p-6 lg:p-10 border-4 border-content shadow-[8px_8px_0px_#f4c025] relative overflow-hidden flex flex-col md:flex-row items-center gap-8">

                    <!-- 背景裝飾 -->
                    <div
                        class="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3">
                    </div>

                    <!-- 賣家頭像 -->
                    <div class="relative z-10 shrink-0">
                        <div
                            class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-content bg-[#f2e8cf] overflow-hidden flex items-center justify-center shadow-stitch-sm">
                            <NuxtImg v-if="storeData.seller.avatar" :src="storeData.seller.avatar"
                                :alt="storeData.seller.name" class="w-full h-full object-cover" loading="lazy"
                                format="webp" />
                            <Icon v-else name="material-symbols:person" class="text-6xl text-gray-400" />
                        </div>
                        <div @click="openReviewsModal"
                            class="absolute -bottom-2 -right-2 bg-accent-red text-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-content shadow-[2px_2px_0px_#1c180d] font-bold cursor-pointer hover:scale-110 active:scale-95 transition-transform z-20">
                            {{ storeData.seller.rating.toFixed(1) }}
                        </div>
                    </div>

                    <!-- 賣家資訊 -->
                    <div class="relative z-10 flex-1 text-center md:text-left space-y-4">
                        <div>
                            <div
                                class="inline-flex items-center gap-2 px-3 py-1 bg-cream border border-primary rounded-full text-xs font-bold text-[#854d0e] tracking-wide mb-3">
                                <Icon name="material-symbols:verified" class="text-sm" />
                                {{ $t('seller.verified') }}
                            </div>
                            <h1 class="text-3xl md:text-5xl font-black text-content tracking-tight">
                                {{ $t('seller.store_page_title', { name: storeData.seller.name }) }}
                            </h1>
                        </div>

                        <div class="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                            <div class="flex items-center gap-2">
                                <Icon name="material-symbols:inventory-2" class="text-gray-400 text-xl" />
                                <span class="font-bold text-gray-600">{{ $t('seller.product_count') }}: {{
                                    storeData.seller.totalProducts }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="material-symbols:calendar-month" class="text-gray-400 text-xl" />
                                <span class="font-bold text-gray-600">{{ $t('seller.joined_at') }}: {{
                                    formatDate(storeData.seller.joinedAt) }}</span>
                            </div>
                        </div>

                        <div class="flex gap-4 justify-center md:justify-start pt-4">
                            <button @click="toggleFollow"
                                :class="isFollowing ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-primary hover:bg-[#eab308] text-content'"
                                class="text-sm font-bold px-6 py-2.5 rounded-full shadow-[4px_4px_0px_#1c180d] border-2 border-content active:shadow-none active:translate-y-1 transition-all flex items-center gap-2">
                                <Icon
                                    :name="isFollowing ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'"
                                    :class="[isFollowing ? 'text-accent-red' : '']" />
                                {{ isFollowing ? $t('seller.following') : $t('seller.follow') }}
                            </button>
                            <button @click="handleChat"
                                class="bg-white hover:bg-gray-50 text-content text-sm font-bold px-6 py-2.5 rounded-full border-2 border-content shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2">
                                {{ $t('seller.chat') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 賣家的商品列表 -->
                <div>
                    <h2 class="text-2xl font-black text-content tracking-tight mb-6 flex items-center gap-3">
                        <Icon name="material-symbols:storefront" class="text-3xl text-accent-red" />
                        所有刊登商品
                    </h2>

                    <div v-if="displayedProducts.length === 0 && !isProductLoading"
                        class="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-3xl border-2 border-dashed border-gray-300">
                        <Icon name="material-symbols:box-outline" class="text-6xl text-gray-300" />
                        <p class="font-bold text-gray-400 text-lg">{{ $t('seller.no_products') }}</p>
                    </div>

                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <ProductCard v-for="item in mappedProducts" :key="item.id" :item="item" />
                    </div>

                    <!-- Infinite scroll 哨兵 -->
                    <div ref="productSentinel" class="h-4 mt-6"></div>

                    <!-- 載入中 -->
                    <div v-if="isProductLoading" class="flex justify-center py-8">
                        <Icon name="line-md:loading-loop" class="text-4xl text-primary" />
                    </div>

                    <!-- 已全部顯示 -->
                    <div v-if="!productHasMore && displayedProducts.length > 0 && !isProductLoading"
                        class="text-center py-6 text-sm text-gray-400 font-bold">
                        {{ $t('seller.products_all_shown', { count: displayedProducts.length }) }}
                    </div>
                </div>
            </div>

        </div>

        <!-- 歷史評價 Modal (置中) -->
        <div v-if="showReviewsModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                class="bg-white rounded-3xl border-4 border-content shadow-[8px_8px_0px_#f4c025] w-full max-w-lg p-6 relative flex flex-col max-h-[80vh]">
                <button @click="closeReviewsModal" class="absolute top-4 right-4 text-gray-400 hover:text-content">
                    <Icon name="material-symbols:close" class="text-3xl" />
                </button>
                <h2 class="text-2xl font-black text-content mb-6 flex items-center gap-2 shrink-0">
                    <Icon name="material-symbols:star" class="text-accent-red" />
                    {{ $t('seller.reviews_title') }}
                </h2>

                <!-- 虛擬滾動列表容器 -->
                <div class="flex-1 overflow-y-auto pr-2 space-y-4">
                    <div v-if="reviews.length === 0 && !isReviewLoading"
                        class="text-center py-10 text-gray-400 font-bold">
                        {{ $t('seller.no_reviews') }}
                    </div>
                    <template v-else>
                        <div v-for="review in reviews" :key="review.id"
                            class="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="flex">
                                    <Icon v-for="s in 5" :key="s" name="material-symbols:star-rounded" class="text-lg"
                                        :class="s <= review.rating ? 'text-accent-red' : 'text-gray-300'" />
                                </div>
                                <span class="text-xs text-gray-500 font-bold ml-auto">{{ new
                                    Date(review.createdAt).toLocaleDateString() }}</span>
                            </div>
                            <p class="text-sm text-content font-bold whitespace-pre-line">{{ review.comment }}</p>
                        </div>
                    </template>

                    <!-- Intersection Observer 哨兵 Target -->
                    <div ref="reviewSentinel" class="h-4"></div>

                    <div v-if="isReviewLoading" class="flex justify-center py-4">
                        <Icon name="line-md:loading-loop" class="text-3xl text-primary" />
                    </div>
                    <div v-if="!reviewHasMore && reviews.length > 0"
                        class="text-center py-4 text-sm text-gray-400 font-bold">
                        {{ $t('seller.reviews_end') }}
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useI18n } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useChatStore } from '~/stores/chat'
import { useToast } from '~/composables/useToast'
import type { ApiProduct, StoreData, SellerReview } from '~/types'

const { t } = useI18n()

const route = useRoute()
const authStore = useAuthStore()
const usersApi = useUsersApi()
const reviewsApi = useReviewsApi()
const chatStore = useChatStore()
const toast = useToast()

const storeData = ref<StoreData | null>(null)
const isLoading = shallowRef(true)

// 商品分頁 infinite scroll
const displayedProducts = ref<ApiProduct[]>([])
const productPage = ref(1)
const productHasMore = shallowRef(false)
const isProductLoading = shallowRef(false)
const productSentinel = useTemplateRef<HTMLElement>('productSentinel')

// 關注邏輯 (結合 LocalStorage 狀態保留)
const isFollowing = shallowRef(false)

onMounted(() => {
    // 進入頁面時，由本地儲存讀取關注狀態
    const savedFollowState = localStorage.getItem(`follow_seller_${route.params.id}`)
    if (savedFollowState === 'true') {
        isFollowing.value = true
    }
})

function toggleFollow() {
    isFollowing.value = !isFollowing.value
    // 儲存狀態至 LocalStorage
    localStorage.setItem(`follow_seller_${route.params.id}`, String(isFollowing.value))

    // 顯示提示
    toast.success(isFollowing.value ? t('toast.follow_add') : t('toast.follow_remove'))
}


// 評價 Modal 與 無限下拉邏輯
const showReviewsModal = shallowRef(false)
const reviews = ref<SellerReview[]>([])
const reviewPage = ref(1)
const reviewHasMore = shallowRef(true)
const isReviewLoading = shallowRef(false)
const reviewSentinel = useTemplateRef<HTMLElement>('reviewSentinel')

async function fetchReviews(append = false) {
    if (!append) { reviewPage.value = 1; reviews.value = []; reviewHasMore.value = true; }
    if (!reviewHasMore.value || isReviewLoading.value) return

    isReviewLoading.value = true
    try {
        const data = await reviewsApi.getBySeller(route.params.id as string, { page: reviewPage.value, limit: 6 }) as any
        if (append) {
            reviews.value.push(...data.items)
        } else {
            reviews.value = data.items
        }
        reviewHasMore.value = data.hasMore
    } catch (e) {
        console.error('Failed to fetch reviews', e)
    } finally {
        isReviewLoading.value = false
    }
}

async function openReviewsModal() {
    showReviewsModal.value = true
    await fetchReviews(false)
}

function closeReviewsModal() {
    showReviewsModal.value = false
}

useIntersectionObserver(
    reviewSentinel,
    (entries) => {
        const isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting && showReviewsModal.value && reviewHasMore.value && !isReviewLoading.value) {
            reviewPage.value++
            fetchReviews(true)
        }
    },
    { rootMargin: '100px' }
)

async function fetchMoreProducts() {
    if (!productHasMore.value || isProductLoading.value) return
    isProductLoading.value = true
    productPage.value++
    try {
        const data = await usersApi.getProducts(route.params.id as string, { page: productPage.value, limit: 12 }) as { items: ApiProduct[], hasMore: boolean }
        displayedProducts.value.push(...data.items)
        productHasMore.value = data.hasMore
    } catch (e) {
        console.error('Failed to fetch more products', e)
        productPage.value--
    } finally {
        isProductLoading.value = false
    }
}

useIntersectionObserver(
    productSentinel,
    (entries) => {
        const isIntersecting = entries[0]?.isIntersecting ?? false
        if (isIntersecting && productHasMore.value && !isProductLoading.value) {
            fetchMoreProducts()
        }
    },
    { rootMargin: '100px' }
)

useHead({ title: computed(() => storeData.value ? t('seller.store_page_title', { name: storeData.value.seller.name }) : t('seller.loading')) })

// 沿用與首頁相同的卡片顏色輪替機制
const CARD_STYLES = [
    { border: 'border-accent-red', price: 'text-accent-red', hover: 'hover:bg-accent-red', hoverText: 'group-hover:text-white' },
    { border: 'border-accent-blue', price: 'text-accent-blue', hover: 'hover:bg-accent-blue', hoverText: 'group-hover:text-white' },
    { border: 'border-primary', price: 'text-primary', hover: 'hover:bg-primary', hoverText: 'group-hover:text-content' },
    { border: 'border-content', price: 'text-content', hover: 'hover:bg-content', hoverText: 'group-hover:text-white' },
];

function getCardStyle(id: number) {
    return CARD_STYLES[(id || 0) % CARD_STYLES.length] ?? CARD_STYLES[0]!;
}

const mappedProducts = computed(() => {
    return displayedProducts.value.map(p => {
        const style = getCardStyle(p.id)
        return {
            id: p.id,
            title: p.name,
            price: `$${p.price}`,
            condition: p.category?.name ?? '商品',
            category: p.category?.name ?? '',
            description: p.description,
            image: p.imageUrl,
            borderColorClass: style.border,
            priceColor: style.price,
            btnHoverBg: style.hover,
            btnHoverText: style.hoverText,
        }
    })
})

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return `${d.getFullYear()}年${d.getMonth() + 1}月`
}

function handleChat() {
    if (!authStore.isAuthenticated) {
        toast.warning('登入後才能與賣家聊聊喔！')
        return
    }
    if (storeData.value?.seller.id === authStore.user?.id) {
        toast.info('不能跟自己聊聊啦！')
        return
    }
    if (storeData.value?.seller) {
        chatStore.openChat(storeData.value.seller)
    }
}

async function fetchStore() {
    isLoading.value = true
    try {
        const data = await usersApi.getStore(route.params.id as string) as StoreData
        storeData.value = data
        displayedProducts.value = [...data.products]
        productPage.value = 1
        productHasMore.value = data.hasMore
    } catch (e) {
        console.error('Failed to fetch store data', e)
        storeData.value = null
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchStore)
</script>

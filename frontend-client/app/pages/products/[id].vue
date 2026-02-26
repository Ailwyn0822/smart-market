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
                                <span class="font-marker text-4xl">${{ parseFloat(product.price || 0).toFixed(0)
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
                        <span v-if="reviewsData" class="text-base font-bold text-gray-400">({{ reviewsData.total }})</span>
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
                                    <Icon v-for="s in 5" :key="s"
                                        name="material-symbols:star-rounded"
                                        class="text-xl"
                                        :class="s <= review.rating ? 'text-accent-red' : 'text-gray-200'" />
                                </div>
                                <span class="text-xs text-gray-400 font-bold">{{ formatReviewDate(review.createdAt) }}</span>
                            </div>
                            <p class="text-sm text-content font-medium leading-relaxed">{{ review.comment }}</p>
                        </div>
                    </div>

                    <!-- 載入更多 -->
                    <div v-if="reviewsData && reviewsData.hasMore" class="flex justify-center mt-6">
                        <button @click="loadMoreReviews"
                            :disabled="reviewsLoadingMore"
                            class="bg-white px-6 py-2 rounded-xl border-2 border-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50">
                            {{ reviewsLoadingMore ? $t('products.loading_more') : $t('products.load_more_reviews') }}
                        </button>
                    </div>
                </div>

                <!-- Q&A 問答區塊 -->
                <div class="border-t-2 border-dashed border-content/20 pt-10 pb-8">
                    <h2 class="text-2xl font-black text-content mb-6 flex items-center gap-3">
                        <Icon name="material-symbols:help-outline" class="text-3xl text-accent-blue" />
                        {{ $t('products.qa_title') }}
                        <span class="text-base font-bold text-gray-400">({{ questions.length }})</span>
                    </h2>

                    <!-- 提問輸入框 -->
                    <div v-if="authStore.isAuthenticated && sellerInfo?.id !== authStore.user?.id" class="mb-6 flex gap-3">
                        <input v-model="newQuestion"
                            class="flex-1 bg-white rounded-xl border-2 border-gray-200 focus:border-content px-4 py-3 font-medium text-sm outline-none transition-all"
                            :placeholder="$t('products.qa_placeholder')"
                            @keydown.enter="submitQuestion" />
                        <button @click="submitQuestion"
                            :disabled="!newQuestion.trim() || isSubmittingQuestion"
                            class="bg-accent-blue text-white px-5 py-3 rounded-xl border-2 border-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 shrink-0">
                            {{ $t('products.qa_ask') }}
                        </button>
                    </div>
                    <div v-else-if="authStore.isAuthenticated && sellerInfo?.id === authStore.user?.id"
                        class="mb-6 bg-primary/20 rounded-xl border-2 border-dashed border-primary/40 p-4 text-center">
                        <p class="font-bold text-sm text-content/60 flex items-center justify-center gap-2">
                            <Icon name="material-symbols:storefront" class="text-base" />
                            {{ $t('products.qa_seller_restriction') }}
                        </p>
                    </div>
                    <div v-else class="mb-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-4 text-center">
                        <NuxtLink to="/login" class="font-bold text-accent-blue hover:underline text-sm">
                            {{ $t('products.qa_login_to_ask') }}
                        </NuxtLink>
                    </div>

                    <!-- 問題列表 -->
                    <div v-if="qaLoading" class="flex justify-center py-8">
                        <Icon name="line-md:loading-loop" class="text-3xl text-accent-blue" />
                    </div>
                    <div v-else-if="questions.length === 0"
                        class="flex flex-col items-center gap-2 py-8 text-gray-400">
                        <Icon name="material-symbols:question-mark" class="text-4xl" />
                        <p class="font-bold text-sm">{{ $t('products.qa_no_questions') }}</p>
                    </div>
                    <div v-else class="space-y-4">
                        <div v-for="qa in questions" :key="qa.id"
                            class="bg-white rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden">
                            <!-- 問題 -->
                            <div class="p-4 flex items-start gap-3">
                                <div class="size-8 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon name="material-symbols:help" class="text-accent-blue text-sm" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-bold text-sm text-content">{{ qa.question }}</p>
                                    <p class="text-xs text-gray-400 mt-1">{{ formatReviewDate(qa.createdAt) }}</p>
                                </div>
                                <button v-if="authStore.user?.id === qa.askerId || authStore.user?.id === qa.sellerId"
                                    @click="deleteQuestion(qa.id)"
                                    class="text-gray-300 hover:text-accent-red transition-colors shrink-0">
                                    <Icon name="material-symbols:delete-outline" class="text-lg" />
                                </button>
                            </div>
                            <!-- 回答 -->
                            <div v-if="qa.answer" class="border-t-2 border-dashed border-gray-100 p-4 bg-primary/10 flex items-start gap-3">
                                <div class="size-8 rounded-full bg-accent-red/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon name="material-symbols:storefront" class="text-accent-red text-sm" />
                                </div>
                                <div>
                                    <p class="text-xs font-black text-accent-red mb-1">{{ $t('products.qa_seller_reply') }}</p>
                                    <p class="font-medium text-sm text-content">{{ qa.answer }}</p>
                                </div>
                            </div>
                            <!-- 賣家回答輸入框 -->
                            <div v-else-if="authStore.user?.id === qa.sellerId"
                                class="border-t-2 border-dashed border-gray-100 p-3 bg-gray-50 flex gap-2">
                                <input v-model="answerInputs[qa.id]"
                                    class="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                                    :placeholder="$t('products.qa_answer_placeholder')"
                                    @keydown.enter="submitAnswer(qa.id)" />
                                <button @click="submitAnswer(qa.id)"
                                    :disabled="!answerInputs[qa.id]?.trim()"
                                    class="bg-accent-red text-white px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 border border-content">
                                    {{ $t('products.qa_reply') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import { useHead } from '#imports'
import { useI18n } from '#imports'

const { t } = useI18n()
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
            price: parseFloat(p.price || 0).toFixed(2),
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
interface ReviewItem { id: number; rating: number; comment: string; createdAt: string }
interface ReviewsResponse { items: ReviewItem[]; total: number; page: number; hasMore: boolean }
const reviewsData = ref<ReviewsResponse | null>(null)
const reviewsLoading = shallowRef(true)
const reviewsLoadingMore = shallowRef(false)
const reviewsPage = shallowRef(1)

async function fetchReviews(page = 1) {
    try {
        const res = await $fetch<ReviewsResponse>(`${config.public.apiBase}/reviews/product/${productId}?page=${page}&limit=6`)
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

fetchReviews(1)

// 收藏狀態
const isFavorited = ref(false)

// 若已登入，確認是否已收藏
if (authStore.isAuthenticated) {
    try {
        const favRes = await $fetch<any>(`${config.public.apiBase}/favorites/check/${productId}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        }).catch(() => null)
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
            await $fetch(`${config.public.apiBase}/favorites/${productId}/favorite`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            isFavorited.value = false
            toast.success(t('toast.remove_from_favorite'))
        } else {
            await $fetch(`${config.public.apiBase}/favorites/${productId}/favorite`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
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
    cartStore.addToCart(product.value, 1)
    toast.success(t('toast.add_to_cart'))
}

// Q&A 問答
interface QAItem { id: number; productId: number; sellerId: string; askerId: string; question: string; answer: string | null; createdAt: string }
const questions = ref<QAItem[]>([])
const qaLoading = shallowRef(true)
const newQuestion = ref('')
const isSubmittingQuestion = shallowRef(false)
const answerInputs = ref<Record<number, string>>({})

async function fetchQuestions() {
    try {
        questions.value = await $fetch<QAItem[]>(`${config.public.apiBase}/product-questions/product/${productId}`)
    } catch { }
    finally { qaLoading.value = false }
}

async function submitQuestion() {
    if (!newQuestion.value.trim() || isSubmittingQuestion.value) return
    isSubmittingQuestion.value = true
    try {
        await $fetch(`${config.public.apiBase}/product-questions`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: { productId: +productId, question: newQuestion.value.trim() }
        })
        newQuestion.value = ''
        toast.success(t('products.qa_asked'))
        await fetchQuestions()
    } catch {
        toast.error(t('toast.error_generic'))
    } finally {
        isSubmittingQuestion.value = false
    }
}

async function submitAnswer(qaId: number) {
    const answer = answerInputs.value[qaId]?.trim()
    if (!answer) return
    try {
        await $fetch(`${config.public.apiBase}/product-questions/${qaId}/answer`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: { answer }
        })
        answerInputs.value[qaId] = ''
        toast.success(t('products.qa_answered'))
        await fetchQuestions()
    } catch {
        toast.error(t('toast.error_generic'))
    }
}

async function deleteQuestion(qaId: number) {
    try {
        await $fetch(`${config.public.apiBase}/product-questions/${qaId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` },
        })
        questions.value = questions.value.filter(q => q.id !== qaId)
    } catch {
        toast.error(t('toast.error_generic'))
    }
}

fetchQuestions()
</script>

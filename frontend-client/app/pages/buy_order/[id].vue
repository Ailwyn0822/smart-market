<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-4xl mt-8">

            <!-- 返回按鈕 -->
            <NuxtLink to="/buy_order"
                class="inline-flex items-center gap-2 mb-6 font-bold text-content hover:text-accent-purple transition-colors group">
                <Icon name="material-symbols:arrow-back"
                    class="text-xl group-hover:-translate-x-1 transition-transform" />
                {{ $t('buy_order.back_to_orders') }}
            </NuxtLink>

            <!-- 主筆記本容器 -->
            <div
                class="bg-[#fdfcf0] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] relative overflow-hidden">

                <!-- 紙張橫條紋背景 -->
                <div class="absolute inset-0 pointer-events-none opacity-20"
                    style="background-image: repeating-linear-gradient(transparent, transparent 27px, #b8a97e 27px, #b8a97e 28px);">
                </div>

                <!-- 裝訂孔 -->
                <div
                    class="absolute left-6 top-0 bottom-0 flex flex-col justify-around pointer-events-none gap-10 py-8">
                    <div v-for="i in 8" :key="i"
                        class="w-5 h-5 rounded-full bg-[#e0d5bc] border-2 border-[#c4b898] shadow-inner">
                    </div>
                </div>

                <!-- 內容區域 -->
                <div class="relative z-10 ml-14 mr-6 py-8 lg:mr-10">

                    <!-- Loading -->
                    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
                        <Icon name="material-symbols:sync" class="text-5xl text-accent-purple animate-spin" />
                        <p class="font-bold text-gray-400">{{ $t('buy_order.loading') }}</p>
                    </div>

                    <!-- 404 -->
                    <div v-else-if="!order" class="flex flex-col items-center justify-center py-16 gap-4">
                        <Icon name="material-symbols:package-2-outline" class="text-6xl text-gray-300" />
                        <p class="font-bold text-gray-400 text-lg">{{ $t('buy_order.detail.not_found') }}</p>
                        <NuxtLink to="/buy_order"
                            class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                            {{ $t('buy_order.back_to_orders') }}
                        </NuxtLink>
                    </div>

                    <!-- 訂單資訊 -->
                    <div v-else class="space-y-6">

                        <!-- 訂單標頭 -->
                        <div
                            class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#c4b898]">
                            <div
                                class="inline-flex items-center gap-2 bg-white border-2 border-content rounded-full px-5 py-2 shadow-stitch-sm">
                                <Icon name="material-symbols:receipt-long" class="text-accent-purple text-xl" />
                                <span class="font-black text-content text-xl font-mono-card">#{{ order.orderNumber
                                }}</span>
                            </div>
                            <div class="text-right">
                                <p class="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    {{ $t('buy_order.detail.date_placed') }}</p>
                                <p class="font-bold text-content">{{ formatDate(order.createdAt) }}</p>
                            </div>
                        </div>

                        <!-- 配送狀態 -->
                        <div class="bg-white/70 rounded-2xl border-2 border-content p-5 shadow-stitch-sm">
                            <h3 class="flex items-center justify-between gap-2 font-black text-content mb-4">
                                <span class="flex items-center gap-2">
                                    <Icon name="material-symbols:local-shipping" class="text-accent-blue text-xl" />
                                    {{ $t('buy_order.detail.shipping_status') }}
                                </span>
                                <button v-if="order.status === 'out_for_delivery'" @click="updateStatus('delivered')"
                                    class="bg-accent-blue text-white px-4 py-1.5 rounded-lg border-2 border-content shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all text-sm">
                                    確認收貨
                                </button>
                                <button v-if="order.status === 'delivered' && !isReviewed"
                                    @click="showReviewModal = true"
                                    class="bg-accent-red text-white px-4 py-1.5 rounded-lg border-2 border-content shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all text-sm font-bold flex items-center gap-1">
                                    <Icon name="material-symbols:star" class="text-white" />
                                    給予評價
                                </button>
                                <span v-if="order.status === 'delivered' && isReviewed"
                                    class="bg-gray-200 text-gray-500 px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-bold flex items-center gap-1 cursor-not-allowed">
                                    <Icon name="material-symbols:check-circle" />
                                    已評價
                                </span>
                            </h3>
                            <div
                                class="w-full h-3 bg-gray-100 rounded-full border border-gray-200 overflow-hidden mb-2">
                                <div class="h-full rounded-full transition-all duration-700" :class="{
                                    'bg-accent-blue w-1/4': order.status === 'processing',
                                    'bg-accent-blue w-2/4': order.status === 'shipped',
                                    'bg-accent-blue w-3/4': order.status === 'out_for_delivery',
                                    'bg-green-400 w-full': order.status === 'delivered'
                                }"></div>
                            </div>
                            <div class="flex justify-between text-[10px] font-bold text-gray-400">
                                <span :class="{ 'text-accent-blue': order.status === 'processing' }">備貨中</span>
                                <span :class="{ 'text-accent-blue': order.status === 'shipped' }">已出貨</span>
                                <span :class="{ 'text-accent-blue': order.status === 'out_for_delivery' }">配送中</span>
                                <span :class="{ 'text-green-500': order.status === 'delivered' }">已收貨</span>
                            </div>
                        </div>

                        <!-- 下半部：兩欄 (商品 / 付款+地址) -->
                        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            <!-- 商品列表 -->
                            <div class="lg:col-span-3 space-y-3">
                                <h3 class="flex items-center gap-2 font-black text-content">
                                    <Icon name="material-symbols:inventory-2" class="text-accent-purple text-xl" />
                                    {{ $t('buy_order.detail.items') }}
                                </h3>

                                <div v-for="item in order.items" :key="item.id"
                                    class="flex items-center gap-4 bg-white/80 rounded-xl border-2 border-dashed border-[#c4b898] p-4 hover:border-content transition-all">
                                    <!-- 商品圖片 -->
                                    <div
                                        class="w-14 h-14 rounded-full border-2 border-content bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                        <NuxtImg v-if="item.productImageUrl" :src="item.productImageUrl"
                                            :alt="item.productName" class="w-full h-full object-cover" loading="lazy"
                                            format="webp" />
                                        <Icon v-else name="material-symbols:image" class="text-2xl text-gray-300" />
                                    </div>
                                    <!-- 商品資訊 -->
                                    <div class="flex-1 min-w-0">
                                        <p class="font-black text-content text-sm truncate">{{ item.productName }}</p>
                                        <p class="text-xs text-gray-400 mt-0.5">{{ $t('buy_order.detail.qty') }}: {{
                                            item.quantity }}</p>
                                    </div>
                                    <!-- 金額 -->
                                    <span class="font-black text-accent-purple shrink-0">
                                        ${{ (+item.price * item.quantity).toFixed(2) }}
                                    </span>
                                </div>
                            </div>

                            <!-- 右側：付款摘要 + 配送地址 -->
                            <div class="lg:col-span-2 space-y-4">

                                <!-- 付款摘要 — 便利貼風格 -->
                                <div class="relative">
                                    <!-- 大頭針 -->
                                    <div
                                        class="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-accent-red rounded-full border-2 border-content shadow-md z-10">
                                    </div>
                                    <div
                                        class="bg-primary/90 rounded-2xl border-2 border-content shadow-stitch p-5 pt-6">
                                        <h3
                                            class="flex items-center gap-2 font-black text-content mb-4 text-center justify-center">
                                            <Icon name="material-symbols:receipt-long" class="text-content text-xl" />
                                            {{ $t('buy_order.detail.payment_summary') }}
                                        </h3>
                                        <div class="space-y-2 text-sm font-bold text-content">
                                            <div class="flex justify-between">
                                                <span>{{ $t('buy_order.detail.subtotal') }}</span>
                                                <span>${{ subtotal }}</span>
                                            </div>
                                            <div class="flex justify-between text-gray-600">
                                                <span>{{ $t('buy_order.detail.shipping') }}</span>
                                                <span>${{ shippingFee }}</span>
                                            </div>
                                            <div
                                                class="pt-2 border-t-2 border-content/30 flex justify-between text-base font-black">
                                                <span>{{ $t('buy_order.detail.total') }}</span>
                                                <span>${{ (+order.totalAmount).toFixed(2) }}</span>
                                            </div>
                                        </div>
                                        <div
                                            class="mt-3 pt-3 border-t-2 border-dashed border-content/30 text-xs text-gray-600 font-bold flex items-center gap-1">
                                            <Icon name="material-symbols:payments" class="text-sm" />
                                            {{ $t('buy_order.payment_method.' + order.paymentMethod) }}
                                        </div>
                                    </div>
                                </div>

                                <!-- 配送地址 — 撕紙條風格 -->
                                <div class="relative bg-white rounded-2xl border-2 border-content shadow-stitch-sm p-5 overflow-hidden"
                                    style="background-image: repeating-linear-gradient(transparent, transparent 23px, #e5e7eb 23px, #e5e7eb 24px);">
                                    <!-- 星星貼紙裝飾 -->
                                    <div class="absolute bottom-3 right-3 text-2xl opacity-60">⭐</div>
                                    <h3
                                        class="flex items-center gap-2 font-black text-content mb-3 bg-white/80 w-fit pr-2">
                                        <Icon name="material-symbols:location-on" class="text-accent-red text-xl" />
                                        {{ $t('buy_order.detail.delivered_to') }}
                                    </h3>
                                    <div class="font-bold text-content text-sm leading-6 bg-white/80 w-fit pr-4">
                                        <p>{{ order.recipientName }}</p>
                                        <p class="text-gray-500 font-normal text-xs whitespace-pre-line">{{
                                            order.shippingAddress }}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 評價彈窗 Modal -->
            <div v-if="showReviewModal"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div
                    class="bg-white rounded-3xl border-4 border-content shadow-[8px_8px_0px_#f4c025] w-full max-w-md p-6 relative">
                    <button @click="showReviewModal = false"
                        class="absolute top-4 right-4 text-gray-400 hover:text-content">
                        <Icon name="material-symbols:close" class="text-3xl" />
                    </button>

                    <h2 class="text-2xl font-black text-content mb-6 flex items-center gap-2">
                        <Icon name="material-symbols:star" class="text-accent-red" />
                        評價賣家與商品
                    </h2>

                    <!-- 評分星星 -->
                    <div class="flex justify-center gap-2 mb-6">
                        <button v-for="star in 5" :key="star" @click="reviewForm.rating = star"
                            class="text-4xl transition-colors hover:scale-110"
                            :class="star <= reviewForm.rating ? 'text-accent-red' : 'text-gray-300'">
                            <Icon name="material-symbols:star-rounded" />
                        </button>
                    </div>

                    <!-- 評價內容 -->
                    <textarea v-model="reviewForm.comment" rows="4"
                        class="w-full bg-[#fdfcf0] rounded-xl border-2 border-content p-4 font-bold text-sm focus:outline-none focus:bg-white transition-colors resize-none placeholder-gray-400 mb-6"
                        placeholder="寫下您對這次交易的感想... (選填)"></textarea>

                    <div class="flex flex-col gap-3">
                        <button @click="submitReview" :disabled="isSubmittingReview"
                            class="w-full bg-accent-blue text-white font-black py-3 rounded-xl border-2 border-content shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isSubmittingReview ? '送出中...' : '確認送出評價' }}
                        </button>
                        <button @click="showReviewModal = false"
                            class="w-full bg-gray-100 text-gray-500 font-bold py-3 rounded-xl border-2 border-transparent hover:border-gray-300 transition-all">
                            稍後再說
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const toast = useToast()

interface OrderItem {
    id: number
    productName: string
    productImageUrl?: string
    quantity: number
    price: number
}

interface Order {
    id: number
    orderNumber: string
    status: string
    totalAmount: number
    paymentMethod: string
    recipientName?: string
    recipientEmail?: string
    shippingAddress?: string
    createdAt: string
    items: OrderItem[]
}

const order = ref<Order | null>(null)
const isLoading = shallowRef(false)

const isReviewed = shallowRef(false)
const showReviewModal = shallowRef(false)
const isSubmittingReview = shallowRef(false)
const reviewForm = ref({
    rating: 5,
    comment: ''
})

const { t } = useI18n()
useHead({ title: computed(() => order.value ? `${t('buy_order.detail.title')} #${order.value.orderNumber} | Smart Market` : 'Smart Market') })

const subtotal = computed(() => {
    if (!order.value) return '0.00'
    return order.value.items.reduce((sum, i) => sum + +i.price * +i.quantity, 0).toFixed(2)
})

const shippingFee = computed(() => {
    if (!order.value) return '0.00'
    const diff = Math.round((+order.value.totalAmount - +subtotal.value) * 100) / 100
    return diff > 0 ? diff.toFixed(2) : '0.00'
})

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function fetchOrder() {
    if (!authStore.isAuthenticated) return
    isLoading.value = true
    try {
        const data = await $fetch<Order>(`${config.public.apiBase}/orders/${route.params.id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        order.value = data
        if (data && data.status === 'delivered') {
            await checkReviewStatus(data.id)
        }
    } catch (e) {
        console.error('Failed to fetch order', e)
        order.value = null
    } finally {
        isLoading.value = false
    }
}

async function updateStatus(status: string) {
    if (!order.value) return
    try {
        await $fetch(`${config.public.apiBase}/orders/${order.value.id}/status`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: { status }
        })
        await fetchOrder()
        if (status === 'delivered') {
            toast.success('確認收貨成功！您現在可以為訂單留下評價。')
        } else {
            toast.success('狀態更新成功')
        }
    } catch (e) {
        console.error(e)
        toast.error('狀態更新失敗')
    }
}

async function checkReviewStatus(orderId: number) {
    try {
        const res = await $fetch<{ isReviewed: boolean }>(`${config.public.apiBase}/reviews/check/${orderId}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        isReviewed.value = res.isReviewed
    } catch (e) {
        console.error('Failed to check review status', e)
    }
}

async function submitReview() {
    if (!order.value || isSubmittingReview.value) return
    isSubmittingReview.value = true
    try {
        await $fetch(`${config.public.apiBase}/reviews`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: {
                orderId: order.value.id,
                rating: reviewForm.value.rating,
                comment: reviewForm.value.comment || '讚！'
            }
        })
        isReviewed.value = true
        showReviewModal.value = false
        toast.success('評價送出成功，感謝您的回饋！')
    } catch (e) {
        console.error('Failed to submit review', e)
        toast.error('評價送出失敗')
    } finally {
        isSubmittingReview.value = false
    }
}

onMounted(fetchOrder)
</script>

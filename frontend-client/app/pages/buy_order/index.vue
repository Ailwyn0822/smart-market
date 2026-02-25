<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-5xl mt-8">

            <!-- 資料夾 Tab 標籤 -->
            <div
                class="absolute -top-10 left-0 w-52 h-12 bg-accent-purple rounded-t-2xl border-4 border-b-0 border-content flex items-center justify-center z-10 gap-2">
                <span class="material-symbols-outlined text-white text-xl">folder_open</span>
                <span class="font-bold text-white text-lg">{{ $t('buy_order.title') }}</span>
            </div>

            <!-- 主卡片容器 -->
            <div
                class="bg-[#fdfcf0] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] p-6 lg:p-10 relative z-20 overflow-hidden">

                <!-- 紙張橫條紋背景 -->
                <div class="absolute inset-0 pointer-events-none opacity-20"
                    style="background-image: repeating-linear-gradient(transparent, transparent 27px, #b8a97e 27px, #b8a97e 28px);">
                </div>
                <!-- 裝訂孔 -->
                <div
                    class="absolute left-6 top-0 bottom-0 flex flex-col justify-around pointer-events-none gap-12 py-8">
                    <div v-for="i in 6" :key="i"
                        class="w-5 h-5 rounded-full bg-[#e0d5bc] border-2 border-[#c4b898] shadow-inner"></div>
                </div>

                <!-- Loading -->
                <div v-if="isLoading" class="relative z-10 ml-8 flex flex-col items-center justify-center py-16 gap-3">
                    <Icon name="material-symbols:sync" class="text-5xl text-accent-purple animate-spin" />
                    <p class="font-bold text-gray-400">{{ $t('buy_order.loading') }}</p>
                </div>

                <!-- 未登入 -->
                <div v-else-if="!authStore.isAuthenticated"
                    class="relative z-10 ml-8 flex flex-col items-center justify-center py-16 gap-4">
                    <Icon name="material-symbols:lock" class="text-5xl text-gray-300" />
                    <p class="font-bold text-gray-400 text-lg">{{ $t('buy_order.login_required') }}</p>
                    <NuxtLink to="/login"
                        class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                        {{ $t('auth.login') }}
                    </NuxtLink>
                </div>

                <!-- 空狀態 -->
                <div v-else-if="orders.length === 0"
                    class="relative z-10 ml-8 flex flex-col items-center justify-center py-16 gap-4">
                    <Icon name="material-symbols:package-2-outline" class="text-6xl text-gray-300" />
                    <p class="font-bold text-gray-400 text-lg">{{ $t('buy_order.empty') }}</p>
                    <NuxtLink to="/"
                        class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                        {{ $t('buy_order.go_shopping') }}
                    </NuxtLink>
                </div>

                <!-- 訂單列表 -->
                <div v-else class="relative z-10 ml-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="order in orders" :key="order.id" @click="navigateTo(`/buy_order/${order.id}`)"
                        class="bg-white rounded-2xl px-5 py-4 border-2 border-content shadow-stitch-sm flex flex-col gap-3 hover:shadow-stitch hover:-translate-y-0.5 transition-all cursor-pointer">

                        <!-- 上半部：圖片 + 訂單資訊 -->
                        <div class="flex items-center gap-4">
                            <!-- 第一筆商品圖片 -->
                            <div
                                class="w-16 h-16 rounded-full border-2 border-content bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                <NuxtImg v-if="firstItem(order)?.productImageUrl"
                                    :src="firstItem(order)!.productImageUrl" class="w-full h-full object-cover"
                                    loading="lazy" format="webp" />
                                <Icon v-else name="material-symbols:image" class="text-3xl text-gray-300" />
                            </div>

                            <!-- 訂單文字資訊 -->
                            <div class="flex-1 min-w-0">
                                <h3 class="font-black text-content text-sm truncate">{{ displayProductName(order) }}
                                </h3>
                                <p class="text-xs text-gray-400 font-mono-card">#{{ order.orderNumber }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">{{ $t('buy_order.placed_on') }} {{
                                    formatDate(order.createdAt) }}</p>
                            </div>

                            <!-- 金額 -->
                            <span class="font-black text-lg text-accent-purple shrink-0">${{ order.totalAmount
                            }}</span>
                        </div>

                        <!-- 進度條 -->
                        <div class="pt-1">
                            <div class="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1">
                                <span>{{ $t('buy_order.status.' + order.status) }}</span>
                                <button v-if="order.status === 'out_for_delivery'"
                                    @click.stop="updateStatus(order.id, 'delivered')"
                                    class="bg-accent-blue text-white px-2 py-1 rounded bg-opacity-90 hover:bg-opacity-100 text-[12px]">{{
                                        $t('buy_order.confirm_receipt') }}</button>
                                <button v-else-if="order.status === 'delivered' && order.isReviewed === false"
                                    @click.stop="openReviewModal(order)"
                                    class="bg-accent-red text-white px-2 py-1 flex items-center gap-1 rounded bg-opacity-90 hover:bg-opacity-100 text-[12px]">
                                    <Icon name="material-symbols:star" />{{ $t('buy_order.review') }}
                                </button>
                                <span v-else-if="order.status === 'delivered' && order.isReviewed === true"
                                    class="text-gray-400 bg-gray-100 px-2 py-1 flex items-center gap-1 rounded text-[12px] cursor-not-allowed">
                                    <Icon name="material-symbols:check-circle" />{{ $t('buy_order.reviewed') }}
                                </span>
                            </div>
                            <div class="w-full h-2.5 bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-500" :class="{
                                    'bg-accent-blue w-1/4': order.status === 'processing',
                                    'bg-accent-blue w-2/4': order.status === 'shipped',
                                    'bg-accent-blue w-3/4': order.status === 'out_for_delivery',
                                    'bg-green-400 w-full': order.status === 'delivered'
                                }">
                                </div>
                            </div>
                            <div class="flex justify-between text-[10px] text-gray-300 mt-0.5">
                                <span>{{ $t('buy_order.status_badge.processing') }}</span>
                                <span>{{ $t('buy_order.status_badge.shipped') }}</span>
                                <span>{{ $t('buy_order.status_badge.out_for_delivery') }}</span>
                                <span>{{ $t('buy_order.status_badge.delivered') }}</span>
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
                        {{ $t('buy_order.review_modal_title') }}
                    </h2>

                    <!-- 評分星級 -->
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
                        :placeholder="$t('buy_order.write_review')"></textarea>

                    <div class="flex flex-col gap-3">
                        <button @click="submitReview" :disabled="isSubmittingReview"
                            class="w-full bg-accent-blue text-white font-black py-3 rounded-xl border-2 border-content shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isSubmittingReview ? $t('buy_order.submitting') : $t('buy_order.submit_review') }}
                        </button>
                        <button @click="showReviewModal = false"
                            class="w-full bg-gray-100 text-gray-500 font-bold py-3 rounded-xl border-2 border-transparent hover:border-gray-300 transition-all">
                            {{ $t('buy_order.later') }}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { ref, onMounted, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

useHead({ title: 'My Orders | Smart Market' })

const { t } = useI18n()

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
    createdAt: string
    items: OrderItem[]
    isReviewed?: boolean
}

const orders = ref<Order[]>([])
const isLoading = shallowRef(false)

const showReviewModal = shallowRef(false)
const isSubmittingReview = shallowRef(false)
const selectedOrderId = ref<number | null>(null)
const reviewForm = ref({
    rating: 5,
    comment: ''
})

const firstItem = (order: Order) => order.items?.[0] ?? null

const statusMap: Record<string, string> = {
    processing: '處理中',
    shipped: '已出貨',
    out_for_delivery: '配送中',
    delivered: '已送達',
}

function displayProductName(order: Order): string {
    const items = order.items ?? []
    if (items.length === 0) return '-'
    const first = items[0]?.productName ?? '-'
    const rest = items.length - 1
    return rest > 0 ? `${first} ...+${rest}` : first
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function checkReviewStatus(orderId: number) {
    try {
        const res = await $fetch<any>(`${config.public.apiBase}/reviews/check/${orderId}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        return res.isReviewed
    } catch {
        return false
    }
}

async function fetchOrders() {
    if (!authStore.isAuthenticated) return
    isLoading.value = true
    try {
        const data = await $fetch<Order[]>(`${config.public.apiBase}/orders/my`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        orders.value = data

        // 對於已送達但未評價的訂單，檢查其是否已提交過評價
        const deliveredOrders = orders.value.filter(o => o.status === 'delivered')
        await Promise.all(deliveredOrders.map(async (o) => {
            o.isReviewed = await checkReviewStatus(o.id)
        }))
    } catch (e) {
        console.error('Failed to fetch orders', e)
    } finally {
        isLoading.value = false
    }
}

async function updateStatus(orderId: number, status: string) {
    try {
        await $fetch(`${config.public.apiBase}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: { status }
        })
        fetchOrders()
        if (status === 'delivered') {
            toast.success(t('buy_order.confirm_receipt_success'))
        } else {
            toast.success(t('buy_order.status_update_success'))
        }
    } catch (e) {
        console.error(e)
        toast.error(t('buy_order.status_update_failed'))
    }
}

function openReviewModal(order: Order) {
    selectedOrderId.value = order.id
    reviewForm.value = { rating: 5, comment: '' }
    showReviewModal.value = true
}

async function submitReview() {
    if (!selectedOrderId.value || isSubmittingReview.value) return
    isSubmittingReview.value = true
    try {
        await $fetch(`${config.public.apiBase}/reviews`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: {
                orderId: selectedOrderId.value,
                rating: reviewForm.value.rating,
                comment: reviewForm.value.comment || '讚！'
            }
        })
        // 成功後更新訂單物件狀態
        const order = orders.value.find(o => o.id === selectedOrderId.value)
        if (order) order.isReviewed = true
        showReviewModal.value = false
        toast.success(t('buy_order.review_success'))
    } catch (e) {
        console.error('Failed to submit review', e)
        toast.error(t('buy_order.review_failed'))
    } finally {
        isSubmittingReview.value = false
    }
}

onMounted(fetchOrders)
</script>

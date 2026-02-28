<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-4xl mt-8">

            <!-- 返回按鈕 -->
            <NuxtLink to="/sell_order"
                class="inline-flex items-center gap-2 mb-6 font-bold text-content hover:text-accent-red transition-colors group">
                <Icon name="material-symbols:arrow-back"
                    class="text-xl group-hover:-translate-x-1 transition-transform" />
                {{ $t("sell_order.go_home") }}
            </NuxtLink>

            <!-- 主筆記本容器 -->
            <div
                class="bg-[#f2e8cf] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] relative overflow-hidden">

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
                        <Icon name="material-symbols:sync" class="text-5xl text-accent-red animate-spin" />
                        <p class="font-bold text-gray-400">{{ $t("sell_order.loading") }}</p>
                    </div>

                    <!-- 404 -->
                    <div v-else-if="!order" class="flex flex-col items-center justify-center py-16 gap-4">
                        <Icon name="material-symbols:package-2-outline" class="text-6xl text-gray-300" />
                        <p class="font-bold text-gray-400 text-lg">{{ $t("sell_order.not_found") }}</p>
                        <NuxtLink to="/sell_order"
                            class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                            {{ $t("sell_order.go_home") }}
                        </NuxtLink>
                    </div>

                    <!-- 訂單資訊 -->
                    <div v-else class="space-y-6">

                        <!-- 訂單標頭 -->
                        <div
                            class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#c4b898]">
                            <div
                                class="inline-flex items-center gap-2 bg-white border-2 border-content rounded-full px-5 py-2 shadow-stitch-sm">
                                <Icon name="material-symbols:receipt-long" class="text-accent-red text-xl" />
                                <span class="font-black text-content text-xl font-mono-card">#{{ order.orderNumber
                                }}</span>
                            </div>
                            <div class="text-right">
                                <p class="text-xs font-bold uppercase tracking-widest text-gray-400">{{
                                    $t("sell_order.order_time") }}</p>
                                <p class="font-bold text-content">{{ formatDate(order.createdAt) }}</p>
                            </div>
                        </div>

                        <!-- 配送狀態 -->
                        <div class="bg-white/70 rounded-2xl border-2 border-content p-5 shadow-stitch-sm">
                            <h3 class="flex justify-between items-center gap-2 font-black text-content mb-4">
                                <span class="flex items-center gap-2">
                                    <Icon name="material-symbols:local-shipping" class="text-accent-blue text-xl" />
                                    {{ $t("sell_order.order_status") }}
                                </span>
                                <!-- 確認出貨 -->
                                <button v-if="order.status === 'processing'" @click="updateStatus('out_for_delivery')"
                                    class="bg-accent-blue text-white px-4 py-1.5 rounded-lg border-2 border-content shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all text-sm">
                                    {{ $t("sell_order.confirm_shipment") }}
                                </button>
                                <!-- 取消申請 — 賣家同意/拒絕 -->
                                <div v-if="order.status === 'cancel_requested'" class="flex gap-2">
                                    <button @click="respondCancel(true)" :disabled="isCancelResponding"
                                        class="bg-accent-red text-white px-3 py-1.5 rounded-lg border-2 border-content text-sm font-bold disabled:opacity-50 shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                                        {{ $t('sell_order.cancel_approve') }}
                                    </button>
                                    <button @click="respondCancel(false)" :disabled="isCancelResponding"
                                        class="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border-2 border-gray-300 text-sm font-bold disabled:opacity-50">
                                        {{ $t('sell_order.cancel_reject') }}
                                    </button>
                                </div>
                                <!-- 已取消 -->
                                <span v-if="order.status === 'cancelled'"
                                    class="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-bold flex items-center gap-1">
                                    <Icon name="material-symbols:cancel" />
                                    {{ $t('sell_order.cancelled') }}
                                </span>
                            </h3>
                            <div
                                class="w-full h-3 bg-gray-100 rounded-full border border-gray-200 overflow-hidden mb-2">
                                <div class="h-full rounded-full transition-all duration-700" :class="{
                                    'bg-accent-blue w-1/4': order.status === 'processing',
                                    'bg-accent-blue w-2/4': order.status === 'shipped',
                                    'bg-accent-blue w-3/4': order.status === 'out_for_delivery',
                                    'bg-green-400 w-full': order.status === 'delivered',
                                    'bg-yellow-400 w-1/4': order.status === 'cancel_requested',
                                    'bg-gray-300 w-full': order.status === 'cancelled',
                                }"></div>
                            </div>
                            <div class="flex justify-between text-[10px] font-bold text-gray-400">
                                <span :class="{ 'text-accent-blue': order.status === 'processing' }">{{
                                    $t("sell_order.status.processing") }}</span>
                                <span :class="{ 'text-accent-blue': order.status === 'shipped' }">{{
                                    $t("sell_order.status.shipped") }}</span>
                                <span :class="{ 'text-accent-blue': order.status === 'out_for_delivery' }">{{
                                    $t("sell_order.status.out_for_delivery") }}</span>
                                <span :class="{ 'text-green-500': order.status === 'delivered' }">{{
                                    $t("sell_order.status.delivered") }}</span>
                            </div>
                        </div>

                        <!-- 下半部：兩欄 (商品 / 付款+地址) -->
                        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            <!-- 商品列表 -->
                            <div class="lg:col-span-3 space-y-3">
                                <h3 class="flex items-center gap-2 font-black text-content">
                                    <Icon name="material-symbols:inventory-2" class="text-accent-red text-xl" />
                                    {{ $t("buy_order.detail.items") }}
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
                                        <p class="text-xs text-gray-400 mt-0.5">{{ $t("sell_order.detail.qty") }}: {{
                                            item.quantity }}</p>
                                    </div>
                                    <!-- 金額 -->
                                    <span class="font-black text-accent-red shrink-0">
                                        ${{ (+item.price * item.quantity).toFixed(2) }}
                                    </span>
                                </div>
                            </div>

                            <!-- 右側：付款摘要 + 配送地址 -->
                            <div class="lg:col-span-2 space-y-4">

                                <!-- 付款摘要 -->
                                <div class="relative">
                                    <div
                                        class="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-accent-blue rounded-full border-2 border-content shadow-md z-10">
                                    </div>
                                    <div
                                        class="bg-primary/90 rounded-2xl border-2 border-content shadow-stitch p-5 pt-6">
                                        <h3
                                            class="flex items-center gap-2 font-black text-content mb-4 text-center justify-center">
                                            <Icon name="material-symbols:receipt-long" class="text-content text-xl" />
                                            {{ $t("buy_order.detail.payment_summary") }}
                                        </h3>
                                        <div class="space-y-2 text-sm font-bold text-content">
                                            <div class="flex justify-between">
                                                <span>{{ $t("buy_order.detail.subtotal") }}</span>
                                                <span>${{ subtotal }}</span>
                                            </div>
                                            <div class="flex justify-between text-gray-600">
                                                <span>{{ $t("buy_order.detail.shipping") }}</span>
                                                <span>${{ shippingFee }}</span>
                                            </div>
                                            <div
                                                class="pt-2 border-t-2 border-content/30 flex justify-between text-base font-black">
                                                <span>{{ $t("buy_order.detail.total") }}</span>
                                                <span>${{ (+order.totalAmount).toFixed(2) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 配送地址 -->
                                <div class="relative bg-white rounded-2xl border-2 border-content shadow-stitch-sm p-5 overflow-hidden"
                                    style="background-image: repeating-linear-gradient(transparent, transparent 23px, #e5e7eb 23px, #e5e7eb 24px);">
                                    <!-- 裝飾 -->
                                    <div class="absolute bottom-3 right-3 text-2xl opacity-60">📦</div>
                                    <h3
                                        class="flex items-center gap-2 font-black text-content mb-3 bg-white/80 w-fit pr-2">
                                        <Icon name="material-symbols:location-on" class="text-accent-red text-xl" />
                                        {{ $t("buy_order.detail.delivered_to") }}
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
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const ordersApi = useOrdersApi()
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
const isCancelResponding = shallowRef(false)

const { t } = useI18n()
useHead({ title: computed(() => order.value ? `Sales #${order.value.orderNumber} | Smart Market` : 'Smart Market') })

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
        const data = await ordersApi.getById(route.params.id as string) as Order
        order.value = data
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
        await ordersApi.updateStatus(order.value.id, { status })
        await fetchOrder()
        if (status === 'out_for_delivery') {
            toast.success(t("toast.shipment_confirmed"))
        } else {
            toast.success(t("toast.status_updated"))
        }
    } catch (e) {
        console.error(e)
        toast.error(t("toast.status_error"))
    }
}

async function respondCancel(approve: boolean) {
    if (!order.value || isCancelResponding.value) return
    isCancelResponding.value = true
    try {
        await ordersApi.respondCancellation(order.value.id, { approve })
        toast.success(approve ? t('sell_order.cancel_approved') : t('sell_order.cancel_rejected'))
        await fetchOrder()
    } catch {
        toast.error(t('toast.error_generic'))
    } finally {
        isCancelResponding.value = false
    }
}

onMounted(fetchOrder)
</script>

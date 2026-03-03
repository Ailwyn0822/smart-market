<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-5xl mt-8">

            <!-- 資料夾 Tab 標籤 -->
            <div
                class="absolute -top-10 left-0 w-52 h-12 bg-accent-red rounded-t-2xl border-4 border-b-0 border-content flex items-center justify-center z-10 gap-2">
                <Icon name="material-symbols:folder-open" class="text-white text-xl" />
                <span class="font-bold text-white text-lg">{{ $t('sell_order.title', '賣家訂單') }}</span>
            </div>

            <!-- 主卡片容器 -->
            <div
                class="bg-[#f2e8cf] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] p-6 lg:p-10 relative z-20 overflow-hidden">

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
                    <Icon name="material-symbols:sync" class="text-5xl text-accent-red animate-spin" />
                    <p class="font-bold text-gray-400">{{ $t("sell_order.loading") }}</p>
                </div>

                <!-- 未登入 -->
                <div v-else-if="!authStore.isAuthenticated"
                    class="relative z-10 ml-8 flex flex-col items-center justify-center py-16 gap-4">
                    <Icon name="material-symbols:lock" class="text-5xl text-gray-300" />
                    <p class="font-bold text-gray-400 text-lg">{{ $t("sell_order.login_required") }}</p>
                    <NuxtLink to="/login"
                        class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                        {{ $t("auth.login") }}
                    </NuxtLink>
                </div>

                <!-- 空狀態 -->
                <div v-else-if="orders.length === 0"
                    class="relative z-10 ml-8 flex flex-col items-center justify-center py-16 gap-4">
                    <Icon name="material-symbols:package-2-outline" class="text-6xl text-gray-300" />
                    <p class="font-bold text-gray-400 text-lg">{{ $t("sell_order.empty") }}</p>
                    <NuxtLink to="/"
                        class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                        {{ $t("sell_order.go_home") }}
                    </NuxtLink>
                </div>

                <!-- 訂單列表 -->
                <div v-else class="relative z-10 ml-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="order in orders" :key="order.id" @click="navigateTo(`/sell_order/${order.id}`)"
                        class="bg-white rounded-2xl px-5 py-4 border-2 border-content shadow-stitch-sm flex flex-col gap-3 hover:shadow-stitch hover:-translate-y-0.5 transition-all cursor-pointer">

                        <!-- 上半部：圖片 + 訂單資訊 -->
                        <div class="flex items-center gap-4">
                            <!-- 第一筆商品圖片 -->
                            <div
                                class="w-16 h-16 rounded-full border-2 border-content bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                <NuxtImg v-if="firstItem(order)?.productImageUrl"
                                    :src="firstItem(order)!.productImageUrl" :alt="firstItem(order)!.productName"
                                    class="w-full h-full object-cover" loading="lazy" format="webp" />
                                <Icon v-else name="material-symbols:image" class="text-3xl text-gray-300" />
                            </div>

                            <!-- 訂單文字資訊 -->
                            <div class="flex-1 min-w-0">
                                <h3 class="font-black text-content text-sm truncate">{{ displayProductName(order) }}
                                </h3>
                                <p class="text-xs text-gray-400 font-mono-card">#{{ order.orderNumber }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">{{ $t("sell_order.order_time") }}: {{
                                    formatDate(order.createdAt) }}</p>
                            </div>

                            <!-- 金額 -->
                            <span class="font-black text-lg text-accent-red shrink-0">${{ order.totalAmount
                                }}</span>
                        </div>

                        <!-- 進度條與狀態 -->
                        <div class="pt-1">
                            <div class="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1">
                                <span>{{ $t('buy_order.status.' + order.status) }}</span>
                                <button v-if="order.status === 'processing'"
                                    @click.stop="updateStatus(order.id, 'out_for_delivery')"
                                    class="bg-accent-blue text-white px-2 py-1 rounded bg-opacity-90 hover:bg-opacity-100 text-[12px]">{{
                                        $t("sell_order.confirm_shipment") }}</button>
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
                                <span>{{ $t("buy_order.status.processing") }}</span>
                                <span>{{ $t("buy_order.status.shipped") }}</span>
                                <span>{{ $t("buy_order.status.out_for_delivery") }}</span>
                                <span>{{ $t("buy_order.status.delivered") }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import { useI18n } from '#imports'
import { useAuthStore } from '~/stores/auth'

const { t } = useI18n()
useHead({ title: computed(() => t('sell_order.title')) })

const authStore = useAuthStore()
const ordersApi = useOrdersApi()
const toast = useToast()

const orders = ref<AppOrder[]>([])
const isLoading = shallowRef(false)

const firstItem = (order: AppOrder) => order.items?.[0] ?? null

function displayProductName(order: AppOrder): string {
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

async function fetchOrders() {
    if (!authStore.isAuthenticated) return
    isLoading.value = true
    try {
        const data = await ordersApi.getSellingOrders() as Order[]
        orders.value = data
    } catch (e) {
        console.error('Failed to fetch selling orders', e)
    } finally {
        isLoading.value = false
    }
}

async function updateStatus(orderId: number, status: string) {
    try {
        await ordersApi.updateStatus(orderId, { status })
        fetchOrders()
        if (status === 'out_for_delivery') {
            toast.success(t('toast.shipment_confirmed'))
        } else {
            toast.success(t('toast.status_updated'))
        }
    } catch (e) {
        console.error(e)
        toast.error(t('toast.status_error'))
    }
}

onMounted(fetchOrders)
</script>

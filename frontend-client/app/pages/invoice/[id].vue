<template>
    <div class="invoice-wrapper">
        <!-- 非列印時的工具欄 -->
        <div class="no-print toolbar">
            <NuxtLink :to="`/buy_order/${route.params.id}`"
                class="inline-flex items-center gap-2 font-bold text-content hover:text-accent-purple transition-colors">
                <Icon name="material-symbols:arrow-back" class="text-xl" />
                {{ $t('invoice.back') }}
            </NuxtLink>
            <button @click="printInvoice"
                class="ml-auto inline-flex items-center gap-2 bg-accent-blue text-white px-7 py-3 rounded-xl border-2 border-content text-base font-black shadow-[4px_4px_0px_#1c180d] hover:translate-y-1 hover:shadow-none transition-all">
                <Icon name="material-symbols:print" class="text-xl" />
                {{ $t('invoice.print') }}
            </button>
        </div>

        <!-- 發票主體 -->
        <div v-if="order" class="invoice-body">
            <!-- 頁首 -->
            <div class="invoice-header">
                <div class="brand">
                    <span class="brand-icon">🛒</span>
                    <span class="brand-name">Smart Market</span>
                </div>
                <div class="invoice-meta">
                    <h1>{{ $t('invoice.title') }}</h1>
                    <p class="order-number"># {{ order.orderNumber }}</p>
                    <p class="invoice-date">{{ $t('invoice.date') }}：{{ formatDate(order.createdAt) }}</p>
                </div>
            </div>

            <hr class="divider" />

            <!-- 收件人 & 付款方式 -->
            <div class="info-grid">
                <div class="info-block">
                    <h3>{{ $t('invoice.recipient_info') }}</h3>
                    <p>{{ order.recipientName }}</p>
                    <p>{{ order.recipientEmail }}</p>
                    <p class="address">{{ order.shippingAddress }}</p>
                </div>
                <div class="info-block text-right">
                    <h3>{{ $t('invoice.payment_info') }}</h3>
                    <p>{{ $t('invoice.payment_method_label') }}：{{ order.paymentMethod === 'cod' ? $t('invoice.cod') : $t('invoice.online') }}</p>
                    <p>{{ $t('invoice.order_status_label') }}：{{ statusLabel(order.status) }}</p>
                </div>
            </div>

            <hr class="divider" />

            <!-- 商品明細 -->
            <table class="items-table">
                <thead>
                    <tr>
                        <th class="text-left">{{ $t('invoice.col_product') }}</th>
                        <th class="text-center">{{ $t('invoice.col_qty') }}</th>
                        <th class="text-right">{{ $t('invoice.col_unit_price') }}</th>
                        <th class="text-right">{{ $t('invoice.col_subtotal') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in order.items" :key="item.id">
                        <td>{{ item.productName }}</td>
                        <td class="text-center">{{ item.quantity }}</td>
                        <td class="text-right">${{ (+item.price).toFixed(2) }}</td>
                        <td class="text-right">${{ (+item.price * item.quantity).toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>

            <hr class="divider" />

            <!-- 金額總結 -->
            <div class="totals">
                <div class="total-row">
                    <span>{{ $t('invoice.subtotal') }}</span>
                    <span>${{ subtotal }}</span>
                </div>
                <div class="total-row">
                    <span>{{ $t('invoice.shipping') }}</span>
                    <span>$0.00</span>
                </div>
                <div class="total-row total-final">
                    <span>{{ $t('invoice.total') }}</span>
                    <span>${{ (+order.totalAmount).toFixed(2) }}</span>
                </div>
            </div>

            <!-- 頁腳 -->
            <div class="invoice-footer">
                <p>{{ $t('invoice.thanks') }}</p>
                <p class="footer-note">{{ $t('invoice.note') }}</p>
            </div>
        </div>

        <!-- 載入中 -->
        <div v-else-if="loading" class="no-print flex justify-center items-center py-32">
            <Icon name="line-md:loading-loop" class="text-5xl text-accent-blue" />
        </div>

        <!-- 找不到訂單 -->
        <div v-else class="no-print flex flex-col items-center gap-4 py-32 text-gray-400">
            <Icon name="material-symbols:receipt-long-outline" class="text-6xl" />
            <p class="font-bold text-lg">{{ $t('invoice.not_found') }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onMounted } from 'vue'

definePageMeta({ layout: 'empty' })
const { t } = useI18n()
useHead({ title: computed(() => `${t('invoice.title')} | Smart Market`) })

const route = useRoute()
const authStore = useAuthStore()
const ordersApi = useOrdersApi()

interface OrderItem { id: number; productName: string; quantity: number; price: number }
interface Order {
    id: number; orderNumber: string; status: string; totalAmount: number; paymentMethod: string;
    recipientName: string; recipientEmail: string; shippingAddress: string; createdAt: string; items: OrderItem[]
}

const order = ref<Order | null>(null)
const loading = shallowRef(true)

const subtotal = computed(() => {
    if (!order.value) return '0.00'
    return order.value.items.reduce((s, i) => s + +i.price * i.quantity, 0).toFixed(2)
})

function formatDate(d: string) {
    const dt = new Date(d)
    return `${dt.getFullYear()}/${String(dt.getMonth() + 1).padStart(2, '0')}/${String(dt.getDate()).padStart(2, '0')}`
}

function statusLabel(s: string) {
    const map: Record<string, string> = {
        processing: t('sell_order.status.processing'),
        shipped: t('sell_order.status.shipped'),
        out_for_delivery: t('sell_order.status.out_for_delivery'),
        delivered: t('sell_order.status.delivered'),
    }
    return map[s] || s
}

function printInvoice() {
    window.print()
}

onMounted(async () => {
    if (!authStore.isAuthenticated) return
    try {
        order.value = await ordersApi.getById(route.params.id as string) as Order
    } catch { }
    finally { loading.value = false }
})
</script>

<style>
/* 非列印時的頁面包裝 */
.invoice-wrapper {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 24px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

.toolbar {
    max-width: 800px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
}

.invoice-body {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 8px;
}

.brand-icon { font-size: 28px; }
.brand-name { font-size: 20px; font-weight: 800; color: #1c180d; }

.invoice-meta { text-align: right; }
.invoice-meta h1 { font-size: 24px; font-weight: 800; color: #1c180d; margin: 0 0 4px; }
.order-number { font-size: 14px; font-weight: 700; color: #6b7280; margin: 0 0 2px; }
.invoice-date { font-size: 13px; color: #9ca3af; margin: 0; }

.divider { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
}

.info-block h3 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin: 0 0 8px; }
.info-block p { font-size: 14px; color: #374151; margin: 2px 0; font-weight: 500; }
.info-block .address { color: #6b7280; font-size: 13px; margin-top: 4px; }
.info-block.text-right { text-align: right; }

.items-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.items-table th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; padding: 8px 12px; border-bottom: 2px solid #e5e7eb; }
.items-table td { font-size: 14px; padding: 12px; color: #374151; border-bottom: 1px solid #f3f4f6; }
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.totals { max-width: 280px; margin-left: auto; margin-bottom: 32px; }
.total-row { display: flex; justify-content: space-between; font-size: 14px; padding: 5px 0; color: #6b7280; font-weight: 500; }
.total-final { font-size: 18px; font-weight: 800; color: #1c180d; padding-top: 10px; border-top: 2px solid #1c180d; }

.invoice-footer { text-align: center; color: #9ca3af; }
.invoice-footer p { margin: 2px 0; font-size: 13px; }
.footer-note { font-size: 11px; color: #d1d5db; margin-top: 4px; }

/* 列印樣式 */
@media print {
    body { background: #fff !important; }
    .no-print { display: none !important; }
    .invoice-wrapper { background: #fff; padding: 0; }
    .invoice-body { box-shadow: none; border: none; border-radius: 0; padding: 20px; max-width: 100%; }
}
</style>

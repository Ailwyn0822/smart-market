<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-5xl mt-12">
            <!-- 標籤 Folder Tab -->
            <div
                class="absolute -top-12 left-0 w-64 h-14 bg-paper-yellow folder-tab-clip border-4 border-b-0 border-content flex items-center justify-center z-10 shadow-[4px_-4px_0px_rgba(0,0,0,0.05)]">
                <div class="flex items-center gap-2">
                    <Icon name="material-symbols:folder-open" class="text-content text-xl" />
                    <span class="font-black text-content text-xl">{{ $t('checkout.details_title') }}</span>
                </div>
            </div>

            <!-- 主表單與結帳區域 -->
            <div
                class="bg-paper-yellow rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] relative z-20 overflow-hidden">
                <div class="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply bg-paper-pattern"></div>

                <div class="relative z-10 flex flex-col lg:flex-row">
                    <!-- 左側表單 (Who's it for & Payment) -->
                    <div
                        class="flex-1 p-8 lg:p-12 border-b-4 lg:border-b-0 lg:border-r-4 border-content border-dashed bg-white/50 backdrop-blur-sm">

                        <!-- 填寫資訊 -->
                        <div class="mb-10 relative">
                            <h2 class="text-2xl font-black text-content mb-6 flex items-center gap-3">
                                <Icon name="material-symbols:person-pin" class="text-3xl text-accent-red" />
                                {{ $t('checkout.whos_it_for') }}
                            </h2>
                            <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="font-bold text-content ml-1">{{ $t('checkout.buyer_name') }}</label>
                                    <input v-model="form.name" class="w-full input-crayon rounded-xl p-3 text-base"
                                        placeholder="Timmy Turner" type="text" />
                                </div>
                                <div class="space-y-2">
                                    <label class="font-bold text-content ml-1">{{ $t('checkout.buyer_email') }}</label>
                                    <input v-model="form.email" class="w-full input-crayon rounded-xl p-3 text-base"
                                        placeholder="parent@email.com" type="email" />
                                </div>
                                <div class="col-span-1 md:col-span-2 space-y-2">
                                    <label class="font-bold text-content ml-1">{{ $t('checkout.shipping_address')
                                    }}</label>
                                    <input v-model="form.address" class="w-full input-crayon rounded-xl p-3 text-base"
                                        placeholder="123 Treehouse Lane" type="text" />
                                </div>
                            </form>
                        </div>

                        <!-- 選擇付款方式 -->
                        <div class="relative">
                            <h2 class="text-2xl font-black text-content mb-8 flex items-center gap-3">
                                <Icon name="material-symbols:payments" class="text-3xl text-accent-blue" />
                                {{ $t('checkout.how_to_pay') }}
                            </h2>
                            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-0">

                                <label class="payment-option relative group w-full sm:w-1/2">
                                    <input class="peer sr-only" name="payment-method" type="radio" value="online"
                                        v-model="form.paymentMethod" />
                                    <div
                                        class="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300 flex flex-col items-center gap-3 relative overflow-hidden transition-all duration-300 peer-checked:border-accent-red peer-checked:text-accent-red">
                                        <div
                                            class="absolute inset-0 bg-accent-red/5 opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        </div>
                                        <div class="w-20 h-20 rounded-full bg-accent-red/10 flex items-center justify-center mb-2 z-10"
                                            style="background-image: radial-gradient(circle at 30% 30%, #ff6b6b33 0%, transparent 70%);">
                                            <Icon name="material-symbols:credit-card"
                                                class="text-4xl text-accent-red group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span class="font-black text-lg text-content z-10">{{ $t('checkout.pay_online',
                                            '線上支付') }}</span>
                                    </div>
                                </label>

                                <label class="payment-option relative group w-full sm:w-1/2">
                                    <input class="peer sr-only" name="payment-method" type="radio" value="cod"
                                        v-model="form.paymentMethod" />
                                    <div
                                        class="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300 flex flex-col items-center gap-3 relative overflow-hidden transition-all duration-300 peer-checked:border-accent-red peer-checked:text-accent-red">
                                        <div
                                            class="absolute inset-0 bg-accent-red/5 opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        </div>
                                        <div class="w-20 h-20 rounded-full bg-accent-blue/10 flex items-center justify-center mb-2 z-10"
                                            style="background-image: radial-gradient(circle at 70% 30%, #4ecdc433 0%, transparent 70%);">
                                            <Icon name="material-symbols:local-shipping"
                                                class="text-4xl text-accent-blue group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span class="font-black text-lg text-content z-10">{{ $t('checkout.pay_cod',
                                            '貨到付款') }}</span>
                                    </div>
                                </label>

                            </div>
                        </div>
                    </div>

                    <!-- 右側購物車清單與總結 -->
                    <div class="w-full lg:w-96 p-8 lg:p-10 bg-paper flex flex-col relative">
                        <!-- 裝飾 -->
                        <div
                            class="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-[4rem] pointer-events-none">
                        </div>

                        <h3 class="font-black text-2xl text-content mb-6 flex items-center gap-2 relative z-10">
                            <Icon name="material-symbols:receipt-long" class="text-primary text-3xl" />
                            {{ $t('checkout.the_damage') }}
                        </h3>

                        <!-- 若購物車有東西 -->
                        <div v-if="checkoutItems.length > 0"
                            class="space-y-4 mb-6 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div v-for="item in checkoutItems" :key="item.product.id" class="flex items-center gap-3">
                                <div
                                    class="w-12 h-12 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
                                    <NuxtImg v-if="item.product.imageUrl" :src="item.product.imageUrl"
                                        :alt="item.product.name" class="w-full h-full object-cover" />
                                    <div v-else class="w-full h-full bg-gray-200"></div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold text-sm text-content truncate">{{ item.product.name }}</h4>
                                    <p class="text-xs text-gray-500">{{ $t('checkout.qty') }}: {{ item.quantity }}</p>
                                </div>
                                <span class="font-bold text-sm">${{ (parseFloat(String(item.product.price)) *
                                    item.quantity).toFixed(2) }}</span>
                            </div>
                        </div>
                        <div v-else class="text-center text-gray-400 py-10 flex-1">
                            {{ $t('checkout.cart_empty') }}
                        </div>

                        <!-- 價格總算區塊 -->
                        <div
                            class="space-y-2 mb-8 border-t-2 border-dashed border-content/20 pt-4 relative z-10 mt-auto">
                            <div class="flex justify-between text-sm font-medium text-gray-600">
                                <span>{{ $t('checkout.subtotal') }}</span>
                                <span>${{ cartStore.subtotal.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm font-medium text-gray-600">
                                <span>{{ $t('checkout.shipping_fee') }}</span>
                                <span>${{ cartStore.shipping.toFixed(2) }}</span>
                            </div>
                            <!-- 折扣碼欄位 -->
                            <div v-if="cartStore.discountAmount > 0"
                                class="flex justify-between text-sm font-bold text-accent-red">
                                <span>{{ $t('checkout.discount') }} ({{ cartStore.appliedDiscountCode }})</span>
                                <span>-${{ cartStore.discountAmount.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between items-end pt-2">
                                <span class="font-black text-lg text-content">{{ $t('checkout.total') }}</span>
                                <span class="font-black text-2xl text-content">${{ cartStore.total.toFixed(2) }}</span>
                            </div>
                        </div>

                        <!-- 結帳按鈕 -->
                        <button :disabled="!isFormValid || checkoutItems.length === 0 || isSubmitting"
                            @click="submitOrder"
                            class="w-full bg-accent-red hover:bg-[#ff5252] disabled:bg-gray-300 disabled:shadow-none disabled:active:translate-y-0 text-white text-lg font-black py-4 rounded-xl shadow-[4px_4px_0px_#1c180d] border-2 border-content active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 relative overflow-hidden group mb-4">
                            <template v-if="isSubmitting">
                                <Icon name="line-md:loading-loop" class="relative z-10 text-xl animate-spin" />
                                <span class="relative z-10">處理中...</span>
                            </template>
                            <template v-else>
                                <span class="relative z-10">{{ $t('checkout.place_order') }}</span>
                                <Icon name="material-symbols:check-circle"
                                    class="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </template>
                            <div
                                class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity">
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useToast } from '#imports'
import { createOrderSchema } from '@smart-market/shared'

const { t } = useI18n()
useHead({ title: computed(() => t('checkout.title')) })

const cartStore = useCartStore()
const toast = useToast()

// 結帳只使用選中賣家的商品
const checkoutItems = computed(() =>
    cartStore.selectedSellerId ? cartStore.selectedItems : cartStore.items
)

const form = ref({
    name: '',
    email: '',
    address: '',
    paymentMethod: 'online'
})

const orderNumber = shallowRef('')
const isSubmitting = shallowRef(false)

const formSchema = createOrderSchema.pick({ recipientName: true, recipientEmail: true, shippingAddress: true })
const isFormValid = computed(() => formSchema.safeParse({
    recipientName: form.value.name,
    recipientEmail: form.value.email,
    shippingAddress: form.value.address
}).success)

function buildOrderPayload(paymentMethod: string) {
    return {
        recipientName: form.value.name,
        recipientEmail: form.value.email,
        shippingAddress: form.value.address,
        paymentMethod,
        amount: cartStore.total,
        items: checkoutItems.value.map(i => ({
            productId: i.product.id,
            name: i.product.name,
            imageUrl: i.product.imageUrl,
            quantity: i.quantity,
            price: i.product.price,
            sellerId: i.product.userId
        }))
    }
}

const ordersApi = useOrdersApi()

async function submitOrder() {
    if (isSubmitting.value) return
    isSubmitting.value = true

    try {
        if (form.value.paymentMethod === 'online') {
            const payload = buildOrderPayload('online')
            const res = await ordersApi.ecpayCheckout(payload) as { html: string; orderNumber: string }
            orderNumber.value = res.orderNumber || ''
            cartStore.clearSelectedItems()

            // 通知使用者即將跳轉
            toast.success('正在跳轉至綠界金流頁面，請稍候...')

            // 自動送出綠界表單
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = res.html
            document.body.appendChild(tempDiv)
            const formElement = tempDiv.querySelector('form')
            if (formElement) formElement.submit()

        } else {
            // 貨到付款：直接呼叫後端建立訂單
            const payload = buildOrderPayload('cod')
            const res = await ordersApi.create(payload) as { orderNumber: string }
            orderNumber.value = res.orderNumber || ''
            cartStore.clearSelectedItems()
            await navigateTo({ path: '/order_completed', query: { orderNumber: res.orderNumber } })
        }
    } catch (error) {
        console.error('Order error:', error)
        toast.error('下單失敗，請稍後再試。')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.folder-tab-clip {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    border-radius: 1rem 1rem 0 0;
}

.input-crayon {
    border: 2px solid #e5e7eb;
    transition: all 0.2s;
    background-color: #fff;
}

.input-crayon:focus {
    border-color: #1c180d;
    box-shadow: 4px 4px 0px #a78bfa;
    transform: translate(-2px, -2px);
    outline: none;
}

.payment-option {
    cursor: pointer;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 9999px;
}
</style>

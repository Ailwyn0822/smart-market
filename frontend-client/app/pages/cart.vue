<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-5xl mt-8">

            <!-- 資料夾 Tab 標籤 -->
            <div
                class="absolute -top-10 left-0 w-48 h-12 bg-accent-blue rounded-t-2xl border-4 border-b-0 border-content flex items-center justify-center z-10">
                <span class="font-bold text-content text-lg">{{ $t('cart.title') }}</span>
            </div>

            <!-- 主卡片容器（資料夾風格） -->
            <div
                class="bg-[#f2e8cf] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] p-6 lg:p-10 relative z-20 overflow-hidden">

                <!-- 紙張紋理 -->
                <div class="absolute inset-0 bg-paper-pattern opacity-40 pointer-events-none"></div>

                <!-- 主要內容：左欄（商品列表）+ 右欄（結帳摘要） -->
                <div class="relative z-10 flex flex-col lg:flex-row gap-10">

                    <!-- ===== 左欄：商品列表（依賣家分組） ===== -->
                    <div class="flex-1 space-y-6">
                        <h2 class="text-3xl font-black text-content mb-6 flex items-center gap-3">
                            <Icon name="material-symbols:shopping-bag" class="text-4xl text-accent-red" />
                            {{ $t('cart.items_in_folder') }}
                        </h2>

                        <!-- 空購物車提示 -->
                        <div v-if="cartStore.items.length === 0"
                            class="bg-white rounded-2xl p-10 flex flex-col items-center justify-center crayon-border-yellow text-center gap-4">
                            <Icon name="material-symbols:shopping-cart-off" class="text-6xl text-gray-300" />
                            <p class="font-bold text-gray-400 text-lg">{{ $t('cart.empty') }}</p>
                            <NuxtLink to="/"
                                class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                                {{ $t('cart.go_shopping') }}
                            </NuxtLink>
                        </div>

                        <!-- 多賣家分組商品列表 -->
                        <template v-else>
                            <div v-for="group in groupedBySeller" :key="group.sellerId" class="space-y-3">

                                <!-- 賣家群組標頭 -->
                                <label
                                    class="flex items-center gap-3 cursor-pointer bg-white/60 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 hover:border-content transition-colors group"
                                    :class="{ 'border-accent-blue bg-accent-blue/10': cartStore.selectedSellerId === group.sellerId }">
                                    <!-- Checkbox -->
                                    <input type="checkbox" :checked="cartStore.selectedSellerId === group.sellerId"
                                        @change="toggleSellerSelection(group.sellerId)"
                                        class="w-5 h-5 rounded border-2 border-content accent-accent-blue cursor-pointer" />
                                    <Icon name="material-symbols:storefront" class="text-lg text-gray-500" />
                                    <span class="font-bold text-sm text-content flex-1">
                                        {{ group.sellerName || '賣家 ' + group.sellerId.slice(0, 8) }}
                                    </span>
                                    <span class="text-xs text-gray-400 font-medium">
                                        {{ group.items.length }} 件商品
                                    </span>
                                </label>

                                <!-- 該賣家的商品 -->
                                <div v-for="(item, index) in group.items" :key="item.product.id" :class="[
                                    'bg-white rounded-2xl p-4 flex gap-4 items-center relative group ml-4',
                                    crayonBorderClass(index)
                                ]">
                                    <!-- 刪除按鈕 -->
                                    <button @click="cartStore.removeFromCart(item.product.id)"
                                        class="absolute -top-3 -right-3 bg-red-100 hover:bg-accent-red text-accent-red hover:text-white rounded-full p-1 border-2 border-red-200 hover:border-accent-red transition-colors z-20">
                                        <Icon name="material-symbols:close" class="text-lg" />
                                    </button>

                                    <!-- 商品圖片 -->
                                    <div
                                        class="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                                        <NuxtImg :src="item.product.imageUrl" :alt="item.product.name" format="webp"
                                            loading="lazy" class="w-full h-full object-cover" />
                                    </div>

                                    <!-- 商品資訊 -->
                                    <div class="flex-grow">
                                        <div class="flex justify-between items-start">
                                            <h3 class="font-bold text-lg text-content">{{ item.product.name }}</h3>
                                            <span :class="['font-black text-xl', priceColorClass(index)]">
                                                ${{ parseFloat(String(item.product.price)).toFixed(2) }}
                                            </span>
                                        </div>

                                        <!-- 數量控制 + 庫存標籤 -->
                                        <div class="mt-2 flex items-center gap-4">
                                            <div
                                                class="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-2 py-1">
                                                <button
                                                    @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                                                    :disabled="item.quantity <= 1"
                                                    class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-content rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <Icon name="material-symbols:remove" class="text-sm" />
                                                </button>
                                                <span class="font-bold text-sm w-4 text-center">{{ item.quantity
                                                    }}</span>
                                                <button
                                                    @click="cartStore.updateQuantity(item.product.id, Math.min(item.quantity + 1, item.product.stock ?? 999))"
                                                    :disabled="item.product.stock !== undefined && item.quantity >= item.product.stock"
                                                    class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-content rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <Icon name="material-symbols:add" class="text-sm" />
                                                </button>
                                            </div>
                                            <span
                                                v-if="item.product.stock !== undefined && item.product.stock <= 3 && item.product.stock > 0"
                                                class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                                                {{ $t('cart.last_one') }}
                                            </span>
                                            <span v-else-if="item.product.stock === undefined || item.product.stock > 3"
                                                class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                                {{ $t('cart.in_stock') }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 多賣家提示 -->
                            <p v-if="groupedBySeller.length > 1"
                                class="text-xs text-gray-500 font-medium bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex items-center gap-2">
                                <Icon name="material-symbols:info-outline" class="text-sm text-yellow-600 shrink-0" />
                                結帳時每次只能選擇一家賣家的商品。請勾選欲結帳的賣家群組。
                            </p>
                        </template>

                        <!-- 繼續購物 -->
                        <NuxtLink to="/"
                            class="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-content mt-4 ml-2 group cursor-pointer">
                            <Icon name="material-symbols:arrow-back"
                                class="group-hover:-translate-x-1 transition-transform" />
                            {{ $t('cart.continue_shopping') }}
                        </NuxtLink>
                    </div>

                    <!-- ===== 右欄：結帳摘要 ===== -->
                    <div class="w-full lg:w-96 shrink-0">
                        <div class="relative">
                            <!-- 水彩暈染背景 -->
                            <div class="absolute inset-0 watercolor-splash rounded-[2rem] scale-125 blur-xl opacity-80">
                            </div>

                            <!-- 摘要卡片 -->
                            <div
                                class="bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 border-2 border-dashed border-gray-400 relative z-10">
                                <h3 class="font-black text-2xl text-content mb-6 flex items-center gap-2">
                                    <Icon name="material-symbols:receipt-long" class="text-accent-purple" />
                                    {{ $t('cart.summary') }}
                                </h3>

                                <!-- 選中賣家提示 -->
                                <div v-if="cartStore.items.length > 0 && !cartStore.selectedSellerId"
                                    class="mb-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 text-xs font-bold text-yellow-700 flex items-center gap-2">
                                    <Icon name="material-symbols:warning-outline" class="text-base shrink-0" />
                                    請先在左側勾選一家賣家的商品
                                </div>

                                <!-- 折扣碼 -->
                                <div class="mb-6">
                                    <div class="flex items-center justify-between mb-2">
                                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            {{ $t('cart.discount_code') }}
                                        </label>
                                        <button @click="openCodesModal" :title="$t('cart.view_codes')"
                                            class="w-5 h-5 rounded-full bg-accent-blue text-white text-xs font-black inline-flex items-center justify-center border-2 border-content hover:bg-blue-700 transition-colors shrink-0">
                                            !
                                        </button>
                                    </div>
                                    <div class="relative">
                                        <div
                                            class="absolute inset-0 bg-accent-blue rounded-lg translate-y-1 translate-x-1 border border-content">
                                        </div>
                                        <div class="relative bg-white border-2 border-content rounded-lg p-1 flex">
                                            <input v-model="discountCode"
                                                class="w-full border-none focus:ring-0 text-sm font-bold placeholder-gray-300 bg-transparent"
                                                :placeholder="$t('cart.name_tag')" type="text" />
                                            <button @click="applyDiscount"
                                                class="bg-content text-white rounded px-3 py-1 text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors">
                                                {{ $t('cart.apply') }}
                                            </button>
                                        </div>
                                    </div>
                                    <p v-if="discountMessage" class="mt-1 text-xs font-bold"
                                        :class="discountMessage.ok ? 'text-green-600' : 'text-accent-red'">
                                        {{ discountMessage.text }}
                                    </p>
                                </div>

                                <!-- 金額明細 -->
                                <div class="space-y-3 mb-6 border-t-2 border-dashed border-gray-200 pt-4">
                                    <div class="flex justify-between text-sm font-medium text-gray-600">
                                        <span>{{ $t('cart.subtotal') }}</span>
                                        <span>${{ cartStore.subtotal.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm font-medium text-gray-600">
                                        <span>{{ $t('cart.shipping') }}</span>
                                        <span>${{ cartStore.shipping.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm font-bold text-accent-red">
                                        <span>{{ $t('cart.discount') }}</span>
                                        <span>-${{ cartStore.discountAmount.toFixed(2) }}</span>
                                    </div>
                                </div>

                                <!-- 總計 -->
                                <div class="flex justify-between items-end border-t-2 border-content pt-4 mb-8">
                                    <span class="font-bold text-lg text-content">{{ $t('cart.total') }}</span>
                                    <span class="font-black text-3xl text-content">${{ cartStore.total.toFixed(2)
                                        }}</span>
                                </div>

                                <!-- 結帳按鈕 -->
                                <button @click="checkout"
                                    :disabled="cartStore.items.length === 0 || !cartStore.selectedSellerId"
                                    class="w-full bg-primary hover:bg-yellow-400 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none text-content text-lg font-black py-4 rounded-xl shadow-stitch border-2 border-content active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                                    <span class="relative z-10">{{ $t('cart.checkout_now') }}</span>
                                    <Icon name="material-symbols:arrow-forward"
                                        class="relative z-10 group-hover:translate-x-1 transition-transform" />
                                    <div
                                        class="absolute top-0 left-0 w-full h-1/2 bg-white opacity-20 skew-x-[-20deg] pointer-events-none">
                                    </div>
                                </button>

                                <!-- 安全提示 -->
                                <p
                                    class="text-xs text-center text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
                                    <Icon name="material-symbols:lock" class="text-sm" />
                                    {{ $t('cart.secure_checkout') }}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </main>

    <!-- 折扣碼列表 Modal -->
    <Teleport to="body">
        <div v-if="showCodesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
            @click.self="showCodesModal = false">
            <!-- 遮罩 -->
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <!-- 卡片 -->
            <div
                class="relative bg-white rounded-[2rem] border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden z-10">
                <!-- 標題列 -->
                <div class="bg-accent-blue px-6 py-4 flex items-center justify-between">
                    <h3 class="font-black text-white text-lg flex items-center gap-2">
                        <Icon name="material-symbols:local-offer" class="text-xl" />
                        {{ $t('cart.codes_modal_title') }}
                    </h3>
                    <button @click="showCodesModal = false" class="text-white hover:text-gray-200 transition-colors">
                        <Icon name="material-symbols:close" class="text-2xl" />
                    </button>
                </div>
                <!-- 內容 -->
                <div class="p-6 max-h-[60vh] overflow-y-auto">
                    <div v-if="loadingCodes" class="text-center py-8 text-gray-400 font-medium">
                        {{ $t('cart.codes_loading') }}
                    </div>
                    <div v-else-if="availableCodes.length === 0" class="text-center py-8 text-gray-400 font-medium">
                        {{ $t('cart.codes_empty') }}
                    </div>
                    <div v-else class="space-y-3">
                        <div v-for="code in availableCodes" :key="code.id"
                            class="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 flex items-center justify-between gap-4">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span
                                        class="font-black text-content bg-primary px-3 py-1 rounded-lg border-2 border-content text-sm tracking-wider uppercase">
                                        {{ code.code }}
                                    </span>
                                    <span class="font-bold text-accent-red text-sm">
                                        {{ $t('cart.codes_off') }} ${{ parseFloat(code.discountAmount).toFixed(0) }}
                                    </span>
                                </div>
                                <p v-if="code.validUntil" class="text-xs text-gray-400 mt-1 font-medium">
                                    {{ $t('cart.codes_expires') }}：{{ new Date(code.validUntil).toLocaleDateString() }}
                                </p>
                                <p v-if="code.maxUsages > 0" class="text-xs text-gray-400 font-medium">
                                    {{ code.currentUsages }} / {{ code.maxUsages }} 次
                                </p>
                            </div>
                            <button @click="selectCode(code.code)"
                                class="shrink-0 bg-content text-white text-xs font-bold px-3 py-2 rounded-xl border-2 border-content hover:bg-gray-800 transition-colors">
                                {{ $t('cart.codes_use') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '#imports'

const { t } = useI18n()
useHead({ title: computed(() => t('cart.title')) })

const cartStore = useCartStore()
const toast = useToast()

const discountCodesApi = useDiscountCodesApi()

// 折扣碼
const discountCode = ref('')
const discountMessage = ref<{ ok: boolean; text: string } | null>(null)

// 折扣碼 Modal
const showCodesModal = ref(false)
const availableCodes = ref<any[]>([])
const loadingCodes = ref(false)

// ===== 輔助 class 函式（蠟筆邊框 / 價格顏色循環） =====
const crayonBorderClasses = ['crayon-border-blue', 'crayon-border-red', 'crayon-border-purple', 'crayon-border-yellow']
const priceColorClasses = ['text-accent-blue', 'text-accent-red', 'text-accent-purple', 'text-primary']

const crayonBorderClass = (index: number) => crayonBorderClasses[index % crayonBorderClasses.length]
const priceColorClass = (index: number) => priceColorClasses[index % priceColorClasses.length]

// ===== 賣家分組 =====
const groupedBySeller = computed<SellerGroup[]>(() => {
    const groups = new Map<string, SellerGroup>()
    for (const item of cartStore.items) {
        const sellerId = item.product.userId || 'unknown'
        if (!groups.has(sellerId)) {
            const p = item.product as any
            const sellerName = p.seller?.username || p.seller?.name || p.user?.username || p.user?.name || ''
            groups.set(sellerId, { sellerId, sellerName, items: [] })
        }
        groups.get(sellerId)!.items.push(item)
    }
    return [...groups.values()]
})

function toggleSellerSelection(sellerId: string) {
    if (cartStore.selectedSellerId === sellerId) {
        cartStore.selectSeller(null)
    } else {
        cartStore.selectSeller(sellerId)
    }
}

// ===== 折扣碼 Modal =====
const openCodesModal = async () => {
    showCodesModal.value = true
    if (availableCodes.value.length > 0) return
    loadingCodes.value = true
    try {
        availableCodes.value = await discountCodesApi.getAll() as any[]
    } finally {
        loadingCodes.value = false
    }
}

const selectCode = async (code: string) => {
    discountCode.value = code
    showCodesModal.value = false
    await applyDiscount()
}

// ===== 折扣碼驗證（串接後端） =====
const applyDiscount = async () => {
    const code = discountCode.value.trim().toUpperCase()
    if (!code) {
        discountMessage.value = { ok: false, text: t('toast.discount_empty') }
        return
    }
    try {
        const res = await discountCodesApi.validate(code) as any
        cartStore.discountAmount = parseFloat(res.discountAmount)
        cartStore.appliedDiscountCode = res.code
        discountMessage.value = { ok: true, text: t('cart.discount_success_amount', { amount: parseFloat(res.discountAmount).toFixed(0) }) }
        toast.success(t('cart.discount_success'))
    } catch (e: any) {
        cartStore.discountAmount = 0
        cartStore.appliedDiscountCode = ''
        discountMessage.value = { ok: false, text: e?.data?.message || t('toast.error_generic') }
    }
}

const checkout = () => {
    if (!cartStore.selectedSellerId) {
        toast.warning('請先勾選要結帳的賣家群組')
        return
    }
    navigateTo('/checkout')
}
</script>

<style scoped>
.crayon-border-blue {
    border: 3px solid theme('colors.accent-blue');
    box-shadow: 3px 3px 0px theme('colors.accent-blue');
}

.crayon-border-red {
    border: 3px solid theme('colors.accent-red');
    box-shadow: 3px 3px 0px theme('colors.accent-red');
}

.crayon-border-yellow {
    border: 3px solid theme('colors.primary');
    box-shadow: 3px 3px 0px theme('colors.primary');
}

.crayon-border-purple {
    border: 3px solid theme('colors.accent-purple');
    box-shadow: 3px 3px 0px theme('colors.accent-purple');
}

.watercolor-splash {
    background-image: radial-gradient(circle at 50% 50%,
            rgba(244, 192, 37, 0.15) 0%,
            rgba(255, 107, 107, 0.05) 50%,
            transparent 70%);
}
</style>

<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-3xl mt-8">

            <!-- 資料夾 Tab 標籤 -->
            <div
                class="absolute -top-10 left-0 w-48 h-12 bg-accent-purple rounded-t-2xl border-4 border-b-0 border-content flex items-center justify-center z-10 gap-2">
                <Icon name="material-symbols:local-offer" class="text-white text-lg" />
                <span class="font-bold text-white text-lg">{{ $t('coupons.title') }}</span>
            </div>

            <!-- 主卡片 -->
            <div
                class="bg-[#fdfcf0] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] p-6 lg:p-10 relative z-20 overflow-hidden min-h-[400px]">

                <div class="absolute inset-0 opacity-20 pointer-events-none"
                    style="background-image: repeating-linear-gradient(transparent, transparent 27px, #b8a97e 27px, #b8a97e 28px);">
                </div>

                <div class="relative z-10">
                    <h2 class="text-2xl font-black text-content mb-6 flex items-center gap-3">
                        <Icon name="material-symbols:percent" class="text-3xl text-accent-purple" />
                        {{ $t('coupons.available') }}
                    </h2>

                    <!-- Loading -->
                    <div v-if="loading" class="flex justify-center items-center py-20">
                        <Icon name="line-md:loading-loop" class="text-4xl text-accent-purple" />
                    </div>

                    <!-- 無優惠券 -->
                    <div v-else-if="coupons.length === 0"
                        class="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Icon name="material-symbols:receipt-long-outline" class="text-6xl" />
                        <p class="font-bold text-lg">{{ $t('coupons.empty') }}</p>
                    </div>

                    <!-- 優惠券列表 -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div v-for="coupon in coupons" :key="coupon.id"
                            class="relative bg-white rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex">

                            <!-- 左色塊 -->
                            <div class="w-3 bg-accent-purple shrink-0"></div>

                            <!-- 票券內容 -->
                            <div class="flex-1 p-5 flex flex-col gap-2">
                                <div class="flex items-start justify-between gap-2">
                                    <div>
                                        <span
                                            class="inline-block font-black text-content bg-primary px-3 py-1 rounded-lg border-2 border-content text-sm tracking-wider uppercase mb-1">
                                            {{ coupon.code }}
                                        </span>
                                        <p class="font-black text-2xl text-accent-red">
                                            {{ $t('coupons.discount_amount', { amount: parseFloat(coupon.discountAmount).toFixed(0) }) }}
                                        </p>
                                    </div>
                                    <button @click="copyAndApply(coupon.code)"
                                        class="shrink-0 bg-accent-purple text-white text-xs font-bold px-3 py-2 rounded-xl border-2 border-content hover:bg-purple-700 transition-colors flex items-center gap-1">
                                        <Icon name="material-symbols:content-copy" class="text-sm" />
                                        {{ $t('coupons.copy') }}
                                    </button>
                                </div>

                                <div class="text-xs text-gray-500 font-medium space-y-0.5">
                                    <p v-if="coupon.validUntil">
                                        <Icon name="material-symbols:calendar-month" class="inline text-sm mr-1" />
                                        {{ $t('coupons.valid_until', { date: new Date(coupon.validUntil).toLocaleDateString() }) }}
                                    </p>
                                    <p v-if="coupon.maxUsages > 0">
                                        <Icon name="material-symbols:people-outline" class="inline text-sm mr-1" />
                                        {{ $t('coupons.used_count', { current: coupon.currentUsages, max: coupon.maxUsages }) }}
                                    </p>
                                    <p v-else>
                                        <Icon name="material-symbols:all-inclusive" class="inline text-sm mr-1" />
                                        {{ $t('coupons.unlimited_usage') }}
                                    </p>
                                </div>
                            </div>

                            <!-- 票券鋸齒右邊 -->
                            <div class="w-4 flex flex-col justify-between py-2 shrink-0">
                                <div v-for="n in 6" :key="n" class="w-4 h-4 bg-[#fdfcf0] rounded-full border border-gray-200"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 前往購物車提示 -->
                    <div v-if="coupons.length > 0" class="mt-8 text-center">
                        <NuxtLink to="/cart"
                            class="inline-flex items-center gap-2 bg-primary px-6 py-3 rounded-xl border-2 border-content font-black text-content shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                            <Icon name="material-symbols:shopping-cart" />
                            {{ $t('coupons.go_to_cart') }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
const { t } = useI18n()
useHead({ title: computed(() => t('coupons.page_title')) })

const discountCodesApi = useDiscountCodesApi()
const toast = useToast()

interface Coupon {
    id: number
    code: string
    discountAmount: string
    validUntil: string | null
    maxUsages: number
    currentUsages: number
}

const { data, pending: loading } = await useAsyncData('coupons', () => discountCodesApi.getAll())
const coupons = computed(() => (data.value as Coupon[]) ?? [])

function copyAndApply(code: string) {
    navigator.clipboard.writeText(code).catch(() => { })
    toast.success(t('coupons.copy_success', { code }))
}
</script>

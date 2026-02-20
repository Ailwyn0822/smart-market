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

                    <!-- ===== 左欄：商品列表 ===== -->
                    <div class="flex-1 space-y-6">
                        <h2 class="text-3xl font-black text-content mb-6 flex items-center gap-3">
                            <Icon name="material-symbols:shopping-bag" class="text-4xl text-accent-red" />
                            {{ $t('cart.items_in_folder') }}
                        </h2>

                        <!-- 空購物車提示 -->
                        <div v-if="cartItems.length === 0"
                            class="bg-white rounded-2xl p-10 flex flex-col items-center justify-center crayon-border-yellow text-center gap-4">
                            <Icon name="material-symbols:shopping-cart-off" class="text-6xl text-gray-300" />
                            <p class="font-bold text-gray-400 text-lg">{{ $t('cart.empty') }}</p>
                            <NuxtLink to="/"
                                class="inline-flex items-center gap-2 bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                                {{ $t('cart.go_shopping') }}
                            </NuxtLink>
                        </div>

                        <!-- 商品列表 -->
                        <template v-else>
                            <div v-for="(item, index) in cartItems" :key="item.id" :class="[
                                'bg-white rounded-2xl p-4 flex gap-4 items-center relative group',
                                crayonBorderClass(index)
                            ]">
                                <!-- 刪除按鈕 -->
                                <button @click="removeItem(item.id)"
                                    class="absolute -top-3 -right-3 bg-red-100 hover:bg-accent-red text-accent-red hover:text-white rounded-full p-1 border-2 border-red-200 hover:border-accent-red transition-colors z-20">
                                    <Icon name="material-symbols:close" class="text-lg" />
                                </button>

                                <!-- 商品圖片 -->
                                <div
                                    class="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                                </div>

                                <!-- 商品資訊 -->
                                <div class="flex-grow">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3 class="font-bold text-lg text-content">{{ item.name }}</h3>
                                            <p class="text-sm text-gray-500">{{ $t('cart.condition') }}: {{
                                                item.condition }}</p>
                                        </div>
                                        <span :class="['font-black text-xl', priceColorClass(index)]">
                                            ${{ item.price.toFixed(2) }}
                                        </span>
                                    </div>

                                    <!-- 數量控制 + 庫存標籤 -->
                                    <div class="mt-2 flex items-center gap-4">
                                        <div
                                            class="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-2 py-1">
                                            <button @click="decreaseQty(item.id)"
                                                class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-content rounded hover:bg-gray-200 transition-colors">
                                                <Icon name="material-symbols:remove" class="text-sm" />
                                            </button>
                                            <span class="font-bold text-sm w-4 text-center">{{ item.quantity }}</span>
                                            <button @click="increaseQty(item.id)"
                                                class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-content rounded hover:bg-gray-200 transition-colors">
                                                <Icon name="material-symbols:add" class="text-sm" />
                                            </button>
                                        </div>
                                        <span v-if="item.stock === 'last'"
                                            class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                                            {{ $t('cart.last_one') }}
                                        </span>
                                        <span v-else
                                            class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                            {{ $t('cart.in_stock') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
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

                                <!-- 折扣碼 -->
                                <div class="mb-6">
                                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        {{ $t('cart.discount_code') }}
                                    </label>
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
                                </div>

                                <!-- 金額明細 -->
                                <div class="space-y-3 mb-6 border-t-2 border-dashed border-gray-200 pt-4">
                                    <div class="flex justify-between text-sm font-medium text-gray-600">
                                        <span>{{ $t('cart.subtotal') }}</span>
                                        <span>${{ subtotal.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm font-medium text-gray-600">
                                        <span>{{ $t('cart.shipping') }}</span>
                                        <span>${{ shipping.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm font-bold text-accent-red">
                                        <span>{{ $t('cart.discount') }}</span>
                                        <span>-${{ discount.toFixed(2) }}</span>
                                    </div>
                                </div>

                                <!-- 總計 -->
                                <div class="flex justify-between items-end border-t-2 border-content pt-4 mb-8">
                                    <span class="font-bold text-lg text-content">{{ $t('cart.total') }}</span>
                                    <span class="font-black text-3xl text-content">${{ total.toFixed(2) }}</span>
                                </div>

                                <!-- 結帳按鈕 -->
                                <button @click="checkout"
                                    class="w-full bg-primary hover:bg-yellow-400 text-content text-lg font-black py-4 rounded-xl shadow-stitch border-2 border-content active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
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
</template>

<script setup lang="ts">
// ===== SEO =====
useHead({
    title: 'Cart | Smart Market',
})

// ===== 購物車商品資料（之後接 API / Pinia store） =====
interface CartItem {
    id: number
    name: string
    condition: string
    price: number
    quantity: number
    image: string
    stock: 'in-stock' | 'last'
}

const cartItems = ref<CartItem[]>([
    {
        id: 1,
        name: 'Wooden Block Set',
        condition: 'Like New',
        price: 24.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Gb6q0aM6_Jn46xxTtF07VC8s9kY2NQ55MVDqfqcR1WRTr__E1Yn7eo9jQcEeeve0VrjcNHnPcK4QROkPBXnA07HHOhDf1nPOz9Nxle82uKW0epPYTcm2m-00BAV5tEdC00124Zq4ZuOPAHecaTddJSfaJmBxz86hx4gj8-JAZH7jv6HbOiSRrnaAFA6uVkpwtR7AflAIKr3RfDOHmuYBpZqW2w1rBkY-nVP4iNOvLUyMkjeyfFHg-_lzjHZ7_N7SBhNDoJa66QDP',
        stock: 'in-stock',
    },
    {
        id: 2,
        name: 'Classic Red Racer',
        condition: 'Used - Good',
        price: 15.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPB3dGs-oKxc75etMaToQGn0skAAjAeBZnWv5T5HwOeTHYcZ-gXZMNAdHDsCt48KIPL9ZMYQ9Q8I9gmdfU14ROgReXqaHiR8CJuY59CjOQs6j-lp94D8dxZtBFTKYZM4xE7Jtn0-4NIbaVOXJRN0DN-IE-DuNHh6xPVDydKCiCt85nC9TWQa0Ijxrp0kcYZuqYAvEddxq_vlrsPTuvfR-zmOPg86fU4LkTzJ9vM4pThtlE_lICxatASb8O2_duSXHuZX6gxOkJPOuQ',
        stock: 'last',
    },
    {
        id: 3,
        name: 'Artist Starter Kit',
        condition: 'New',
        price: 30.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2BqY4axIOd2zsQ0sXt702dJjPyc2uW61HdaIrnz7GQWvAE07wwmVEo6ZLgqC3p8oXeX2htk2TvIuMQDOSBmnzh9NDKghVHuaHNQJaHcC8LpJV4oXVe6PaAuMlyyP8GbNXksjIZuyYxbt80zGREEITHsQn0M_GIW160ynsSuSepavdT4JPZr5dznyJIfO0uJ4obBSxNx_LaQeX1X3HII50qoChfxSdyjepE3S7ZNKyREI8hHeP8n4QoV7SUIcPERI_H2yRYtg97aH7',
        stock: 'in-stock',
    },
])

// 折扣碼
const discountCode = ref('')
const discount = ref(0)
const shipping = computed(() => cartItems.value.length > 0 ? 5.00 : 0)

// 小計
const subtotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

// 總計
const total = computed(() => subtotal.value + shipping.value - discount.value)

// ===== 輔助 class 函式（蠟筆邊框 / 價格顏色循環） =====
const crayonBorderClasses = ['crayon-border-blue', 'crayon-border-red', 'crayon-border-purple', 'crayon-border-yellow']
const priceColorClasses = ['text-accent-blue', 'text-accent-red', 'text-accent-purple', 'text-primary']

const crayonBorderClass = (index: number) => crayonBorderClasses[index % crayonBorderClasses.length]
const priceColorClass = (index: number) => priceColorClasses[index % priceColorClasses.length]

// ===== 操作函式 =====
const removeItem = (id: number) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
}

const increaseQty = (id: number) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item) item.quantity++
}

const decreaseQty = (id: number) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item && item.quantity > 1) item.quantity--
}

const applyDiscount = () => {
    // TODO: 串接後端折扣碼驗證
    if (discountCode.value.trim().toUpperCase() === 'SMART10') {
        discount.value = subtotal.value * 0.1
    }
}

const checkout = () => {
    // TODO: 串接結帳流程
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

.sticker-nav-item {
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.sticker-nav-item:hover {
    transform: scale(1.05) rotate(-2deg);
}
</style>

<template>
    <main
        class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 flex items-center justify-center">
        <div class="relative mx-auto w-full max-w-4xl mt-8">
            <!-- 裝飾元素 -->
            <div
                class="absolute -top-12 -left-12 w-48 h-48 bg-accent-blue/20 rounded-full blur-2xl z-0 pointer-events-none">
            </div>
            <div
                class="absolute -bottom-16 -right-8 w-64 h-64 bg-accent-red/20 rounded-full blur-2xl z-0 pointer-events-none">
            </div>

            <!-- 膠帶裝飾 -->
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-10 bg-accent-red/50 z-30 rotate-1 opacity-80"
                style="mask: url('data:image/svg+xml,%3Csvg width=\'200\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 L5 0 L10 10 L15 0 L20 10 L25 0 L30 10 L35 0 L40 10 L45 0 L50 10 L55 0 L60 10 L65 0 L70 10 L75 0 L80 10 L85 0 L90 10 L95 0 L100 10 L105 0 L110 10 L115 0 L120 10 L125 0 L130 10 L135 0 L140 10 L145 0 L150 10 L155 0 L160 10 L165 0 L170 10 L175 0 L180 10 L185 0 L190 10 L195 0 L200 10 V30 L195 40 L190 30 L185 40 L180 30 L175 40 L170 30 L165 40 L160 30 L155 40 L150 30 L145 40 L140 30 L135 40 L130 30 L125 40 L120 30 L115 40 L110 30 L105 40 L100 30 L95 40 L90 30 L85 40 L80 30 L75 40 L70 30 L65 40 L60 30 L55 40 L50 30 L45 40 L40 30 L35 40 L30 30 L25 40 L20 30 L15 40 L10 30 L5 40 L0 30 Z\' fill=\'black\'/%3E%3C/svg%3E'); mask-size: 100% 100%; -webkit-mask: url('data:image/svg+xml,%3Csvg width=\'200\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 L5 0 L10 10 L15 0 L20 10 L25 0 L30 10 L35 0 L40 10 L45 0 L50 10 L55 0 L60 10 L65 0 L70 10 L75 0 L80 10 L85 0 L90 10 L95 0 L100 10 L105 0 L110 10 L115 0 L120 10 L125 0 L130 10 L135 0 L140 10 L145 0 L150 10 L155 0 L160 10 L165 0 L170 10 L175 0 L180 10 L185 0 L190 10 L195 0 L200 10 V30 L195 40 L190 30 L185 40 L180 30 L175 40 L170 30 L165 40 L160 30 L155 40 L150 30 L145 40 L140 30 L135 40 L130 30 L125 40 L120 30 L115 40 L110 30 L105 40 L100 30 L95 40 L90 30 L85 40 L80 30 L75 40 L70 30 L65 40 L60 30 L55 40 L50 30 L45 40 L40 30 L35 40 L30 30 L25 40 L20 30 L15 40 L10 30 L5 40 L0 30 Z\' fill=\'black\'/%3E%3C/svg%3E'); -webkit-mask-size: 100% 100%;">
            </div>

            <!-- 主卡片 -->
            <div
                class="bg-white rounded-[2.5rem] border-4 border-content shadow-[12px_12px_0px_rgba(0,0,0,0.15)] relative z-20 overflow-hidden flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <!-- 背景紙張紋理 -->
                <div class="absolute inset-0 opacity-40 pointer-events-none"
                    style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E&quot;)">
                </div>

                <h1 class="font-marker text-4xl sm:text-6xl text-content mb-6 relative z-10 rotate-[-2deg]">
                    {{ $t('cart.order_complete_title') }}
                </h1>

                <!-- 訂單編號標籤 -->
                <div
                    class="inline-flex items-center gap-3 bg-accent-blue/20 border-2 border-dashed border-accent-blue rounded-xl px-6 py-3 mb-10 rotate-1 transform hover:rotate-0 transition-transform cursor-default">
                    <div
                        class="size-8 bg-accent-blue rounded-full border-2 border-content flex items-center justify-center text-white">
                        <span class="material-symbols-outlined text-lg">tag</span>
                    </div>
                    <span class="font-display font-bold text-content text-lg">{{ $t('cart.order_number_prefix') }}
                        {{ orderNumber ? '#' + orderNumber : '' }}</span>
                </div>

                <!-- 動畫區域 -->
                <div class="relative w-full max-w-md mx-auto mb-10 aspect-video flex items-center justify-center">
                    <div class="relative z-10 w-64 h-48 group">
                        <!-- 箱子 -->
                        <div
                            class="absolute bottom-4 left-0 w-44 h-28 bg-[#d4a373] border-4 border-content rounded-lg z-10">
                            <div class="absolute top-1/2 left-0 right-0 h-2 bg-content/10 -translate-y-1/2"></div>
                            <div class="absolute top-0 bottom-0 left-1/2 w-2 bg-content/10 -translate-x-1/2"></div>
                            <div
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-content font-black opacity-30 text-xs text-center">
                                {{ $t('cart.fragile') }}</div>
                        </div>
                        <!-- 另一個箱子 -->
                        <div
                            class="absolute bottom-4 right-2 w-20 h-20 bg-[#e9c46a] border-4 border-content rounded-lg z-0">
                            <div
                                class="absolute top-3 right-3 w-10 h-8 bg-accent-blue/30 border-2 border-content rounded-sm">
                            </div>
                        </div>
                        <!-- 輪子 -->
                        <div
                            class="absolute bottom-0 left-6 w-10 h-10 bg-content rounded-full border-4 border-gray-400 z-20 group-hover:rotate-180 transition-transform duration-1000">
                        </div>
                        <div
                            class="absolute bottom-0 left-32 w-10 h-10 bg-content rounded-full border-4 border-gray-400 z-20 group-hover:rotate-180 transition-transform duration-1000">
                        </div>
                        <div
                            class="absolute bottom-0 right-4 w-10 h-10 bg-content rounded-full border-4 border-gray-400 z-20 group-hover:rotate-180 transition-transform duration-1000">
                        </div>
                        <!-- 速度線 -->
                        <div class="absolute top-10 -left-12 space-y-2">
                            <div class="w-8 h-1 bg-content rounded-full"></div>
                            <div class="w-12 h-1 bg-content rounded-full ml-2"></div>
                        </div>
                    </div>
                    <!-- 背景底座 -->
                    <div class="absolute inset-0 bg-yellow-100 rounded-full blur-3xl opacity-50 scale-75"></div>
                </div>

                <p class="font-display text-lg text-gray-600 mb-10 max-w-lg mx-auto relative z-10">
                    {{ $t('cart.order_complete_desc') }}
                </p>

                <div class="flex flex-col items-center justify-center gap-8 relative z-20 w-full">
                    <button @click="navigateTo('/buy_order')"
                        class="group relative h-14 bg-white border-2 border-content rounded-r-2xl rounded-l-md px-8 shadow-[4px_4px_0px_#1c180d] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
                        <div
                            class="absolute left-0 top-0 bottom-0 w-3 bg-accent-purple rounded-l-sm border-r-2 border-content">
                        </div>
                        <span class="font-bold text-content ml-2">{{ $t('cart.view_my_orders') }}</span>
                    </button>
                </div>

                <!-- 裝飾小配件 -->
                <div class="absolute top-12 right-12 text-accent-purple animate-pulse">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                        <path
                            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                        </path>
                    </svg>
                </div>
                <!-- 裝飾小配件 -->
                <div class="absolute bottom-24 left-12 text-accent-blue transform rotate-45">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                        <path d="M6 18h8a4 4 0 004-4V7a1 1 0 00-1-1h-5a4 4 0 00-4 4v8a1 1 0 001 1z"></path>
                        <path d="M6 9v9"></path>
                    </svg>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
const route = useRoute()
const orderNumber = route.query.orderNumber as string || ''
</script>

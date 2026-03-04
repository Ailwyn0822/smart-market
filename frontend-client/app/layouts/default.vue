<template>
    <div class="text-content min-h-screen flex flex-col overflow-x-hidden">
        <header class="relative w-full z-50 pt-6 px-4 sm:px-8 lg:px-12 pb-4">
            <div class="layout-container max-w-7xl mx-auto flex items-center justify-between gap-6">
                <HeaderLogo />
                <!-- 商品頁導覽 -->
                <NuxtLink to="/products"
                    class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-content font-bold text-sm text-content bg-white hover:bg-primary shadow-[3px_3px_0px_#1c180d] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                    <Icon name="material-symbols:storefront" class="text-lg" />
                    {{ $t('nav.browse_products') }}
                </NuxtLink>
                <div class="flex items-center gap-3">
                    <LanguageSwitcher />

                    <!-- 購物車按鈕 -->
                    <NuxtLink to="/cart"
                        class="relative flex items-center justify-center size-10 rounded-full border-2 border-transparent hover:bg-gray-100 transition-colors group">
                        <Icon name="material-symbols:shopping-cart-outline"
                            class="text-2xl text-content group-hover:text-accent-blue transition-colors" />
                        <div v-if="cartStore.totalItems > 0">
                            <div
                                class="absolute -top-1 -right-2 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-content min-w-[20px] text-center shadow-sm">
                                {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
                            </div>
                        </div>
                    </NuxtLink>

                    <HeaderUserMenu />
                </div>
            </div>
        </header>
        <slot />
        <Footer />
        <ClientOnly>
            <ChatWidget />
        </ClientOnly>
        <AppToast />
    </div>
</template>


<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
</script>

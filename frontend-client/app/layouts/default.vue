<template>
    <div class="text-content min-h-screen flex flex-col overflow-x-hidden">
        <header class="relative w-full z-50 pt-6 px-4 sm:px-8 lg:px-12 pb-4">
            <div class="layout-container max-w-7xl mx-auto flex items-center justify-between gap-6">
                <HeaderLogo />
                <div class="flex items-center gap-3">
                    <LanguageSwitcher />

                    <!-- 購物車按鈕 -->
                    <NuxtLink to="/cart"
                        class="relative flex items-center justify-center size-10 rounded-full border-2 border-transparent hover:bg-gray-100 transition-colors group">
                        <Icon name="material-symbols:shopping-cart-outline"
                            class="text-2xl text-content group-hover:text-accent-blue transition-colors" />
                        <div v-if="cartStore.c_totalItems > 0"
                            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent-blue rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
                            {{ cartStore.c_totalItems > 99 ? '99+' : cartStore.c_totalItems }}
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


<script setup>
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
</script>

<template>
    <div class="text-content min-h-screen flex flex-col overflow-x-hidden">
        <header class="relative w-full z-50 pt-6 px-4 sm:px-8 lg:px-12 pb-4">
            <div
                class="layout-container max-w-7xl mx-auto flex items-center justify-between gap-6">
                <HeaderLogo />
                <div class="flex items-center gap-3">
                    <LanguageSwitcher />
                    <HeaderUserMenu />
                </div>
            </div>
        </header>
        <slot />
        <Footer />
        <ChatWidget />
    </div>
</template>


<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>

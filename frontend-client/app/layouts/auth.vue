<template>
    <div class="text-content min-h-screen flex flex-col overflow-x-hidden">
        <header class="relative w-full z-50 pt-6 px-4 sm:px-8 lg:px-12 pb-4">
            <div class="layout-container max-w-7xl mx-auto flex items-center justify-between gap-6">
                <HeaderLogo />
                <div class="flex items-center gap-4">
                    <LanguageSwitcher />
                    <NuxtLink v-if="route.path !== '/register'"
                        class="hidden sm:inline-flex items-center gap-2 font-bold text-content hover:text-accent-red transition-colors group"
                        to="/register">
                        {{ $t('auth.new_here') }}
                        <span
                            class="bg-white px-4 py-2 rounded-lg border-2 border-content shadow-sm group-hover:shadow-md transition-all -rotate-2 group-hover:rotate-0">
                            {{ $t('auth.join_club') }}
                        </span>
                    </NuxtLink>
                </div>
            </div>
        </header>
        <slot />
        <Footer />
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
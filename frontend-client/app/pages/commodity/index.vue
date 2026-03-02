<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="relative mx-auto max-w-6xl mt-8">

            <!-- Tab Header -->
            <div
                class="absolute -top-12 left-0 w-64 h-14 bg-primary rounded-t-2xl border-4 border-b-0 border-[#1c180d] flex items-center justify-center z-10">
                <span class="font-bold text-[#1c180d] text-xl flex items-center gap-2">
                    <Icon name="material-symbols:folder-open" />
                    {{ $t('commodity.portfolio_title') }}
                </span>
            </div>

            <!-- Main Content Box -->
            <div
                class="bg-white rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-[#1c180d] shadow-[8px_8px_0px_rgba(0,0,0,0.15)] p-6 lg:p-10 relative z-20 overflow-hidden min-h-[600px]">

                <!-- Background Pattern -->
                <div class="absolute inset-0 bg-paper-pattern opacity-40 pointer-events-none"></div>

                <div class="relative z-10">
                    <!-- Title Bar -->
                    <div
                        class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b-2 border-dashed border-gray-300 pb-4">
                        <h2 class="text-2xl font-black text-[#1c180d] tracking-tight">{{ $t('commodity.active_sketches',
                            { count: items?.length || 0 }) }}</h2>
                        <button @click="navigateTo('/upload')"
                            class="bg-accent-blue hover:bg-[#3dbdb4] text-white px-6 py-2.5 rounded-full font-bold shadow-stitch-sm border-2 border-[#1c180d] flex items-center gap-2 hover:translate-y-0.5 hover:shadow-none transition-all">
                            <Icon name="material-symbols:add" />
                            {{ $t('commodity.new_listing') }}
                        </button>
                    </div>

                    <!-- Items List -->
                    <div v-if="pending" class="flex justify-center items-center py-12">
                        <Icon name="line-md:loading-loop" class="text-4xl text-primary" />
                    </div>
                    <div v-else-if="!items || items.length === 0"
                        class="flex flex-col items-center justify-center py-12 text-center">
                        <Icon name="material-symbols:box-outline" class="text-6xl text-gray-300 mb-4" />
                        <h3 class="text-xl font-bold text-gray-400">{{ $t('commodity.no_listings') }}</h3>
                    </div>
                    <div v-else class="flex flex-col gap-6">
                        <div v-for="(item, index) in items" :key="item.id"
                            class="bg-white bg-[repeating-linear-gradient(transparent,transparent_31px,#f3f4f6_31px,#f3f4f6_32px)] bg-local border-l-[8px] border-l-gray-200 hover:border-l-primary rounded-r-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-6 relative shadow-[2px_3px_5px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[4px_6px_8px_rgba(0,0,0,0.08)] transition-all"
                            :class="{ 'opacity-60 grayscale-[50%]': !item.isActive }">

                            <!-- Spirals -->
                            <div
                                class="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-evenly py-2 overflow-hidden">
                                <div class="w-3 h-3 rounded-full bg-gray-200 -ml-2 border border-gray-300 shadow-inner">
                                </div>
                                <div class="w-3 h-3 rounded-full bg-gray-200 -ml-2 border border-gray-300 shadow-inner">
                                </div>
                                <div class="w-3 h-3 rounded-full bg-gray-200 -ml-2 border border-gray-300 shadow-inner">
                                </div>
                            </div>

                            <!-- Image -->
                            <div
                                :class="['w-full md:w-32 md:h-24 h-48 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center', getRotationClass(index)]">
                                <NuxtImg v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name"
                                    class="w-full h-full object-cover" />
                                <Icon v-else name="material-symbols:toys" class="text-5xl text-blue-200" />
                            </div>

                            <!-- Details -->
                            <div class="flex-grow flex flex-col md:flex-row justify-between items-center w-full gap-4">
                                <div class="flex flex-col gap-1 text-center md:text-left w-full md:w-1/3">
                                    <h3 class="font-bold text-lg text-[#1c180d]">{{ item.name }}</h3>
                                    <p class="text-sm text-gray-500 font-medium">{{ item.condition }} | {{
                                        item.category?.name || '未分類' }}</p>

                                    <!-- Mobile Stats -->
                                    <div
                                        class="mt-2 inline-flex md:hidden items-center justify-center gap-4 bg-white/50 rounded-full px-3 py-1 border border-gray-200">
                                        <span class="flex items-center gap-1 text-xs font-bold text-gray-500">
                                            <Icon name="material-symbols:visibility" class="text-sm" /> {{ item.views }}
                                        </span>
                                        <span class="flex items-center gap-1 text-xs font-bold text-accent-red">
                                            <Icon name="material-symbols:favorite" class="text-sm" /> {{
                                                item.favoritesCount || 0 }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Price Tag -->
                                <div class="flex flex-col items-center justify-center w-full md:w-auto">
                                    <span
                                        :class="['font-black text-2xl bg-white px-3 py-1 rounded border-2 border-dashed', getPriceColorClass(index), getPriceBorderClass(index), getPriceRotationClass(index)]">
                                        ${{ Number(item.price).toFixed(2) }}
                                    </span>
                                </div>

                                <!-- Desktop Stats -->
                                <div class="hidden md:flex flex-col items-start gap-2 min-w-[100px]">
                                    <div class="flex items-center gap-2 text-sm font-bold text-gray-600">
                                        <Icon name="material-symbols:visibility" class="text-gray-400" /> {{ item.views
                                        }} {{ $t('commodity.views') }}
                                    </div>
                                    <div class="flex items-center gap-2 text-sm font-bold text-gray-600">
                                        <Icon name="material-symbols:favorite" class="text-accent-red" /> {{
                                            item.favoritesCount || 0 }} {{ $t('commodity.likes') }}
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
                                    <button @click="navigateTo('/commodity/' + item.id)"
                                        class="size-10 rounded-full bg-primary hover:bg-[#eab308] border-2 border-[#1c180d] text-[#1c180d] flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                                        :title="$t('commodity.edit_listing')">
                                        <Icon name="material-symbols:edit" />
                                    </button>
                                    <button @click="toggleStatus(item.id, item.isActive)"
                                        :class="item.isActive ? 'bg-accent-red hover:bg-[#ff5252] border-accent-red' : 'bg-gray-500 hover:bg-gray-600 border-gray-500'"
                                        class="px-4 py-2 text-white font-bold rounded-lg border-2 hover:border-[#1c180d] flex items-center gap-2 transition-colors shadow-sm text-sm">
                                        {{ item.isActive ? $t('commodity.deactivate') : $t('commodity.relist') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="items && items.length > 0"
                        class="mt-12 flex justify-center items-center gap-2 opacity-50 pointer-events-none">
                        <button
                            class="size-10 rounded-full border-2 border-[#1c180d] bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <Icon name="material-symbols:chevron-left" />
                        </button>
                        <button
                            class="size-10 rounded-full border-2 border-[#1c180d] bg-[#1c180d] text-white font-bold flex items-center justify-center shadow-md transform -translate-y-1">1</button>
                        <button
                            class="size-10 rounded-full border-2 border-[#1c180d] bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <Icon name="material-symbols:chevron-right" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useToast } from '#imports'

const { t } = useI18n()
useHead({ title: computed(() => t('commodity.portfolio_title')) })

const authStore = useAuthStore()
const $api = useApi()
const productsApi = useProductsApi()
const toast = useToast()

const { data: items, pending, refresh } = await useFetch<any[]>('/products/my-listings', { $fetch: $api })

async function toggleStatus(productId: number, currentStatus: boolean) {
    if (!authStore.isAuthenticated) return

    try {
        await productsApi.toggleActiveStatus(productId, { isActive: !currentStatus })
        toast.success(currentStatus ? t('commodity.deactivate_success') : t('commodity.relist_success'))
        await refresh()
    } catch (e: any) {
        toast.error(t('commodity.status_update_error'))
        console.error(e)
    }
}

function getRotationClass(index: number) {
    const classes = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-2deg]', 'rotate-[2deg]'];
    return classes[index % classes.length];
}

function getPriceColorClass(index: number) {
    const classes = ['text-accent-blue', 'text-accent-red', 'text-accent-purple', 'text-content'];
    return classes[index % classes.length];
}

function getPriceBorderClass(index: number) {
    const classes = ['border-accent-blue', 'border-accent-red', 'border-accent-purple', 'border-content'];
    return classes[index % classes.length];
}

function getPriceRotationClass(index: number) {
    const classes = ['rotate-2', '-rotate-1', 'rotate-1', '-rotate-2'];
    return classes[index % classes.length];
}
</script>

<style scoped>
.bg-paper-pattern {
    background-image: url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise" x="0" y="0"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E');
}
</style>

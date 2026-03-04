<template>
    <div
        :class="`bg-white p-4 rounded-2xl ${item.borderColorClass} flex flex-col gap-3 group hover:-translate-y-2 transition-transform duration-300`">
        <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
            <div v-if="categoryName"
                class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold shadow-sm border border-gray-100 z-10 group-hover:scale-110 group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-300">
                {{ categoryName }}</div>
            <NuxtImg :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                :src="item.image" format="webp" />
        </div>
        <div class="flex flex-col gap-1">
            <div class="flex justify-between items-start">
                <h3 class="font-bold text-lg text-content line-clamp-1">{{ item.title }}</h3>
                <span :class="`${item.priceColor} font-black text-lg`">{{ item.price }}</span>
            </div>
            <p class="text-sm text-gray-500 line-clamp-2">{{ item.description }}</p>
        </div>
        <button
            :class="`mt-auto w-full bg-background-dark text-white py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md ${item.btnHoverBg}`"
            @click="navigateTo(`/products/${item.id}`)">
            {{ $t('products.view') }}
            <Icon name="material-symbols:visibility" class="text-sm" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductItem } from '~/types'

const props = defineProps<{
    item: ProductItem
}>()

const categoryName = computed(() => {
    if (!props.item.category) return null
    if (typeof props.item.category === 'string') return props.item.category
    return props.item.category.name || null
})
</script>

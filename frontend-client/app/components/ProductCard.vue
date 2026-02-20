<template>
    <div
        :class="`bg-white p-4 rounded-2xl ${item.borderColorClass} flex flex-col gap-3 group hover:-translate-y-2 transition-transform duration-300`">
        <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
            <div
                class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-gray-100">
                {{ item.condition }}</div>
            <NuxtImg :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                :src="item.image" loading="lazy" format="webp" />
        </div>
        <div class="flex flex-col gap-1">
            <div class="flex justify-between items-start">
                <h3 class="font-bold text-lg text-content line-clamp-1">{{ item.title }}</h3>
                <span :class="`${item.priceColor} font-black text-lg`">{{ item.price }}</span>
            </div>
            <p class="text-sm text-gray-500 line-clamp-2">{{ item.description }}</p>
        </div>
        <button
            :class="`mt-auto w-full bg-background-light hover:${item.btnHoverBg} hover:${item.btnHoverText} border-2 border-transparent hover:border-content py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 group-hover:shadow-md`">
            {{ $t('products.view') }}
            <Icon name="material-symbols:visibility" class="text-sm" />
        </button>
    </div>
</template>

<script setup lang="ts">
import type { ProductItem } from '~/types'

defineProps<{
    item: ProductItem
}>()

</script>

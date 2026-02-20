<template>
    <aside class="w-full lg:w-72 shrink-0">
        <div class="sticky top-8">
            <div
                class="relative notebook-sidebar border-2 border-content rounded-r-2xl rounded-l-lg shadow-[4px_4px_0px_rgba(0,0,0,0.1)] min-h-[500px] overflow-hidden">
                <!-- 環孔裝飾 -->
                <div
                    class="absolute top-0 left-0 bottom-0 w-8 flex flex-col items-center gap-6 pt-4 bg-gray-200 border-r-2 border-content z-10">
                    <div v-for="n in 12" :key="n" class="w-4 h-4 bg-gray-700 rounded-full shadow-inner"></div>
                </div>

                <!-- 過濾器內容 -->
                <div class="pl-14 pr-6 py-8">
                    <div class="mb-8">
                        <h3
                            class="font-black text-2xl text-content rotate-[-2deg] mb-6 decoration-wavy underline decoration-accent-red underline-offset-4">
                            {{ $t('products.filter_title') }}
                        </h3>

                        <div class="space-y-6">
                            <!-- 條件過濾器 -->
                            <div>
                                <h4 class="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">
                                    {{ $t('products.condition') }}
                                </h4>
                                <div class="flex flex-col gap-3">
                                    <div class="relative" v-for="condition in conditions" :key="condition.id">
                                        <input class="filter-checkbox sr-only" :id="`filter-${condition.id}`"
                                            type="checkbox" v-model="condition.checked" />
                                        <label :class="[
                                            'block cursor-pointer font-bold py-2 px-4 rounded-lg border-2 border-transparent hover:border-content transition-all text-center shadow-sm',
                                            condition.bgColor, condition.textColor
                                        ]" :for="`filter-${condition.id}`">
                                            {{ condition.label }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- 價格範圍 -->
                            <div class="pt-4 border-t-2 border-dashed border-gray-300">
                                <h4 class="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">
                                    {{ $t('products.price_range') }}
                                </h4>
                                <div class="px-2">
                                    <input class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        max="100" min="0" type="range" v-model="priceValue" />
                                    <div class="flex justify-between mt-2 font-bold text-sm text-content">
                                        <span>$0</span>
                                        <span>${{ priceValue }}</span>
                                        <span>$100+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fun! 裝飾標籤 -->
            <div
                class="absolute -bottom-4 -right-4 bg-primary text-content size-16 rounded-full flex items-center justify-center font-black rotate-12 border-2 border-content shadow-md z-20">
                Fun!
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { t } = useI18n()
const priceValue = ref(40)

const conditions = computed(() => [
    { id: 'new', label: t('products.condition_new'), bgColor: 'bg-accent-purple', textColor: 'text-white', checked: false },
    { id: 'like-new', label: t('products.condition_like_new'), bgColor: 'bg-accent-blue', textColor: 'text-white', checked: true },
    { id: 'good', label: t('products.condition_used_good'), bgColor: 'bg-primary', textColor: 'text-content', checked: false },
])
</script>

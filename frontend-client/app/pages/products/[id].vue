<template>
    <div class="min-h-screen">
        <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-12">
            <div class="mb-8">
                <NuxtLink to="/products"
                    class="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-content transition-colors">
                    <Icon name="material-symbols:arrow-back" />
                    {{ $t('products.back_to_gallery') }}
                </NuxtLink>
            </div>
            <div class="flex flex-col lg:flex-row gap-16 items-start">
                <!-- 左側圖片區 -->
                <div class="w-full lg:w-1/2 flex flex-col items-center sticky top-8">
                    <div class="relative group w-full max-w-xl mx-auto py-6">
                        <div class="relative bg-white p-4 pb-12 shadow-xl rotate-[-2deg] z-10">
                            <NuxtImg :src="product.image" :alt="product.title"
                                class="w-full h-auto object-cover grayscale-[10%] relative z-0" />
                            <div class="washi-tape absolute -top-2 -left-2 w-40 h-12 bg-primary -rotate-[35deg] z-50">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右側資訊區 -->
                <div class="w-full lg:w-1/2 flex flex-col gap-10 relative mt-12 lg:mt-0">
                    <!-- Price Badge -->
                    <div class="absolute -top-12 right-0 lg:-right-4 z-20 transform rotate-12 group cursor-default">
                        <div
                            class="bg-primary text-content w-32 h-32 rounded-full flex items-center justify-center shadow-xl border-4 border-dashed border-content group-hover:scale-110 transition-transform bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
                            <div class="text-center -rotate-12">
                                <span class="block text-xs font-bold font-mono-card uppercase tracking-widest mb-1">{{
                                    $t('products.price') }}</span>
                                <span class="font-marker text-4xl">{{ product.price }}</span>
                            </div>
                        </div>
                        <div
                            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-16 w-1 bg-white border border-gray-300">
                        </div>
                        <div
                            class="absolute top-[-4rem] left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border border-gray-400">
                        </div>
                    </div>

                    <div class="relative z-10 pr-24">
                        <div class="flex items-center gap-3 mb-4">
                            <span
                                class="px-3 py-1 bg-accent-blue text-white text-xs font-black uppercase tracking-wider rounded-lg border-2 border-content -rotate-2">
                                {{ product.condition }}
                            </span>
                        </div>
                        <h1 class="text-5xl lg:text-6xl font-black text-content tracking-tight leading-[1.1]">
                            {{ product.title }}
                        </h1>
                    </div>

                    <!-- Description Box -->
                    <div class="relative w-full transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div
                            class="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/80 rotate-1 border-l border-r border-white/50 backdrop-blur-sm z-10 shadow-sm">
                        </div>
                        <div class="lined-paper p-8 pt-10 rounded-xl border border-gray-200 shadow-md">
                            <h3 class="font-marker text-xl mb-2 text-gray-400 rotate-[-1deg]">{{
                                $t('products.description') }}:</h3>
                            <p class="text-xl leading-[4rem] text-content font-medium font-marker">
                                {{ product.description }}
                            </p>
                        </div>
                    </div>

                    <div class="py-4">
                        <button
                            class="w-full bg-accent-blue text-white font-marker text-2xl py-5 px-6 rounded-2xl border-4 border-content shadow-[6px_6px_0px_#1c180d] hover:shadow-[2px_2px_0px_#1c180d] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 group">
                            <Icon name="material-symbols:shopping-cart"
                                class="text-3xl group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                            {{ $t('products.add_to_cart') }}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '#imports'

useHead({
    link: [
        { href: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Courier+Prime:wght@400;700&display=swap', rel: 'stylesheet' }
    ]
})

// 模擬產品資料
const product = ref({
    title: 'Classic Red',
    price: '$15',
    condition: 'Toy Car',
    description: 'This vintage style metal pedal car is a real treasure! It has been loved but still runs super fast. There are a few scratches on the bumper from intense racing, but the wheels are in perfect condition. Great for ages 3-5.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPB3dGs-oKxc75etMaToQGn0skAAjAeBZnWv5T5HwOeTHYcZ-gXZMNAdHDsCt48KIPL9ZMYQ9Q8I9gmdfU14ROgReXqaHiR8CJuY59CjOQs6j-lp94D8dxZtBFTKYZM4xE7Jtn0-4NIbaVOXJRN0DN-IE-DuNHh6xPVDydKCiCt85nC9TWQa0Ijxrp0kcYZuqYAvEddxq_vlrsPTuvfR-zmOPg86fU4LkTzJ9vM4pThtlE_lICxatASb8O2_duSXHuZX6gxOkJPOuQ'
})
</script>
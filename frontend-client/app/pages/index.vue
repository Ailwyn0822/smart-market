<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 space-y-16">
        <section class="@container">
            <div
                class="bg-white rounded-[2.5rem] p-6 lg:p-12 border-4 border-content shadow-[8px_8px_0px_#f4c025] relative overflow-hidden">
                <div
                    class="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3">
                </div>
                <div
                    class="absolute bottom-0 left-0 w-64 h-64 bg-accent-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3">
                </div>
                <div class="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                    <div class="flex-1 flex flex-col gap-6 items-start text-left max-w-xl">
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 bg-cream border border-primary rounded-full text-xs font-bold text-[#854d0e] uppercase tracking-wide">
                            <Icon name="material-symbols:verified" class="text-sm" />
                            {{ $t('home.verified') }}
                        </div>
                        <h1 class="text-5xl sm:text-6xl font-black text-content leading-[1.1] tracking-tight">
                            {{ $t('home.hero_title_1') }} <br />
                            <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-primary relative inline-block">
                                {{ $t('home.hero_title_2') }}
                                <svg class="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-50"
                                    preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" stroke-width="8">
                                    </path>
                                </svg>
                            </span>
                        </h1>
                        <p class="text-lg text-gray-600 font-medium leading-relaxed">
                            {{ $t('home.subtitle') }}
                        </p>
                        <div class="flex flex-wrap gap-4 pt-2">
                            <button
                                class="bg-primary hover:bg-[#eab308] text-content text-base font-bold px-8 py-3.5 rounded-full shadow-[4px_4px_0px_#1c180d] border-2 border-content active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
                                @click="navigateTo('/products')">
                                {{ $t('home.start_exploring') }}
                                <Icon name="material-symbols:arrow-forward" />
                            </button>
                            <button
                                class="bg-white hover:bg-gray-50 text-content text-base font-bold px-8 py-3.5 rounded-full border-2 border-content shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all">
                                {{ $t('home.how_it_works') }}
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 w-full relative">
                        <div class="relative z-10 rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                            <div
                                class="absolute inset-0 bg-accent-blue rounded-[2rem] translate-x-3 translate-y-3 -z-10 border-2 border-content">
                            </div>
                            <div class="bg-white p-2 pb-6 rounded-[2rem] border-2 border-content shadow-xl">
                                <div class="w-full aspect-[4/3] bg-gray-200 rounded-[1.5rem] overflow-hidden relative">
                                    <NuxtImg
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXLcieLcgLm6DKGq9M-t4SdKUmyFKVce_mrJ0Ks00z8qJMrinJtppYKN6QNCyHLeBN7i8hwsKIseQbT9AF6fItEf43UejpuirKEF_vy6M8nAoKhSxQ2rsewKiwyYHG3coQsZDXplbk0Bv56G7y5467HZFxwpBMUNeXKfZu8qU20gbziRKA2Iovf9ZLPQ_ljuHY0B82waI3FqKNyZ0Yx_xvc9JpEXR9YPQt1y5IoaAx6MYkjaNu-pOk5PLj8OWeSWiz01YYoOj6K0kt"
                                        alt="Children playing with colorful wooden building blocks"
                                        class="absolute inset-0 w-full h-full object-cover" format="webp" preload
                                        fetchpriority="high" width="800" height="600" sizes="xs:100vw sm:600px" />
                                </div>
                                <div class="flex justify-between items-center px-4 pt-3">
                                    <div class="flex -space-x-2">
                                        <NuxtImg
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGuylDdNXyTomGyZko_jva0JQnFgn0J0cOZgmjLsqvKv4CfeModPpMZNSONwIH716RxGlEM9iYtLCfZv_AB4hRGjDb9rehOYFw7RABgSla2I6y1_3KTyss-V5yR86JfO_Wx2RcW3xnJ4AofOWjiEadTao62DcRL1qpRSl5mqaVP6eWxGnMHIduRMm73ohotDs9pZyXskntHffuJb2Wr_lFOEiXYd7vgJqh23r3OZiLn4k4SnS5j-OyNAPyw62kycedcU_H7YkCEDiw"
                                            alt="Child face 1"
                                            class="size-8 rounded-full border-2 border-white bg-gray-200 object-cover"
                                            loading="lazy" format="webp" width="32" height="32" sizes="32px" />
                                        <NuxtImg
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGFdWS0oiH5tnUEbqbrWW76rU_M2jIl-PZYTq0QbSluAXUjCuBJCWI_IpzdNDvalbfABog_hPHBVSdbCB35dkGh3IDCmczab6NMaYBZlTUIq6XX5GcfI4AmaQVAeE7sXzU0K_YSxq2WbVLodlSjBna3VzLoKP9aiKduvYITF8iftGKrTbhxBVLnidrtpjdcIfGqpvo2egfxWVcj5WS_ONgWbcpA3KTdQPHykHut-ybctSJZdlqTYRvsCG45RrjsfFRtvRL2UMY8cjC"
                                            alt="Child face 2"
                                            class="size-8 rounded-full border-2 border-white bg-gray-200 object-cover"
                                            loading="lazy" format="webp" width="32" height="32" sizes="32px" />
                                        <div
                                            class="size-8 rounded-full border-2 border-white bg-accent-red flex items-center justify-center text-[10px] text-white font-bold">
                                            +2k</div>
                                    </div>
                                    <span class="font-handwriting text-gray-500 text-sm font-bold rotate-[-2deg]">{{
                                        $t('home.happy_kids') }}</span>
                                </div>
                            </div>
                        </div>
                        <div
                            class="absolute -top-6 -right-4 size-16 bg-primary rounded-full flex items-center justify-center border-2 border-content shadow-md animate-bounce delay-700 z-20">
                            <Icon name="material-symbols:star" class="text-3xl" />
                        </div>
                        <div
                            class="absolute -bottom-8 -left-2 bg-white px-4 py-2 rounded-lg border-2 border-content rotate-[-6deg] shadow-lg z-20">
                            <span class="font-bold text-accent-red">{{ $t('home.discount') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories Section -->
        <section>
            <div class="flex items-end justify-between mb-8 px-2">
                <h2 class="text-3xl font-black text-content tracking-tight flex items-center gap-3">
                    <Icon name="material-symbols:brush" class="text-4xl text-accent-blue" />
                    {{ $t('home.search_title') }}
                </h2>
                <a class="text-sm font-bold text-gray-500 underline decoration-2 hover:text-accent-blue" href="#">
                    {{ $t('home.view_all_categories') }}
                </a>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <a v-for="category in categories" :key="category.name" class="group flex flex-col items-center gap-3"
                    href="#">
                    <div
                        :class="`size-32 ${category.bgColor} rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-content group-hover:scale-110 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)]`">
                        <Icon :name="`material-symbols:${category.icon}`"
                            :class="`${category.iconColor || 'text-white'} text-5xl`" />
                    </div>
                    <span
                        class="font-bold text-lg text-content bg-white px-3 py-1 rounded-lg border border-transparent group-hover:border-content group-hover:shadow-sm transition-all">{{
                            category.name }}</span>
                </a>
            </div>
        </section>

        <!-- Featured Finds Section -->
        <section>
            <div class="flex items-center justify-center mb-10 relative">
                <div class="absolute h-1 w-full bg-content top-1/2 -z-10 rounded-full opacity-10"></div>
                <h2 class="bg-background-light px-6 text-3xl font-black text-content tracking-tight">{{
                    $t('home.featured_finds') }}</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <ProductCard v-for="item in featuredItems" :key="item.title" :item="item" />
            </div>
        </section>

        <!-- Illustrate Section -->
        <section
            class="bg-white rounded-[2rem] p-8 border-2 border-dashed border-gray-300 flex flex-wrap justify-center gap-8 md:justify-around">
            <div v-for="item in illustrate" :key="item.icon"
                class="flex flex-col items-center gap-3 text-center max-w-[150px]">
                <div
                    :class="`${item.bgColor} ${item.borderColor} ${item.shadowColor} ${item.textColor} size-16 rounded-full flex items-center justify-center border-2`">
                    <Icon :name="`material-symbols:${item.icon}`" class="text-3xl" />
                </div>
                <div>
                    <h4 class="font-bold text-content">{{ item.title }}</h4>
                    <p class="text-xs text-gray-500">{{ item.description }}</p>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
const { categories, featuredItems, illustrate } = useHomeData()

import { useAuthStore } from '~/stores/auth';

onMounted(() => {

    // 1. 引入 Store

    const route = useRoute();
    const authStore = useAuthStore(); // 啟用 Store

    // 2. 監聽網址參數 (只在剛登入回來時觸發)
    const tokenParam = route.query.token;
    const userParam = route.query.user;

    if (tokenParam && userParam) {
        try {
            const userData = JSON.parse(userParam);

            // 3. 呼叫 Store 的 login 動作 (存入 Cookie)
            authStore.login(tokenParam, userData);

            // 4. 清除網址列 (變乾淨)
            window.history.replaceState({}, document.title, "/");
        } catch (e) {
            console.error('登入解析失敗', e);
        }
    }
})

</script>
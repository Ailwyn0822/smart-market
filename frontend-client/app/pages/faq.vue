<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 space-y-12">
        <section class="text-center mb-12 relative mt-8">
            <div
                class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 -z-10 w-64 h-24 bg-accent-blue/20 rounded-full blur-3xl">
            </div>
            <h1 class="text-5xl md:text-6xl font-black text-[#1c180d] mb-4 relative inline-block transform -rotate-1">
                {{ $t('faq.title') }}
                <svg class="absolute -bottom-2 w-full h-3 text-accent-red opacity-80" preserveAspectRatio="none"
                    viewBox="0 0 200 9">
                    <path d="M2.00025 6.99997C25.7951 3.52044 116.326 -4.84657 198.005 6.00001" fill="none"
                        stroke="currentColor" stroke-linecap="round" stroke-width="3"></path>
                </svg>
            </h1>
            <p class="text-xl text-gray-600 font-medium max-w-2xl mx-auto mt-6">{{ $t('faq.subtitle') }}</p>
        </section>
        <div class="relative w-full max-w-6xl mx-auto perspective-[2000px]">
            <div
                class="bg-[#f0f0eb] rounded-3xl shadow-2xl border-4 border-[#1c180d] min-h-[700px] flex overflow-hidden relative">
                <div class="absolute -top-6 -left-8 w-24 h-24 bg-[#f4ece1] rounded-full z-0 opacity-50 blur-xl"></div>
                <div
                    class="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-purple rounded-full z-0 opacity-30 blur-xl">
                </div>
                <div
                    class="w-1/3 md:w-1/3 bg-[#e5e7eb] relative z-10 flex flex-col border-r-2 border-gray-300 shadow-folder">
                    <div class="p-6 pb-2 border-b-2 border-gray-300 bg-[#f3f4f6]">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 bg-white rounded-lg border-2 border-gray-400 flex items-center justify-center shadow-sm">
                                <Icon name="material-symbols:menu-book" class="text-gray-500 text-xl" />
                            </div>
                            <h3 class="font-bold text-xl text-gray-700">{{ $t('faq.chapters') }}</h3>
                        </div>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 space-y-3">
                        <button v-for="chapter in chapters" :key="chapter.id" @click="activeChapterId = chapter.id"
                            :class="[
                                'w-full group text-left relative transition-opacity',
                                activeChapterId === chapter.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                            ]">
                            <div :class="[
                                'absolute left-0 top-0 bottom-0 w-1.5 rounded-l-md transition-colors',
                                activeChapterId === chapter.id ? chapter.color : 'bg-gray-300 ' + chapter.hoverColor
                            ]"></div>
                            <div :class="[
                                'ml-1.5 p-4 rounded-r-xl border border-gray-200 transition-transform flex items-center justify-between group-hover:translate-x-1',
                                activeChapterId === chapter.id ? 'bg-white shadow-sm' : 'bg-[#f9fafb]'
                            ]">
                                <span
                                    :class="['font-bold', activeChapterId === chapter.id ? 'text-[#1c180d]' : 'text-gray-600']">
                                    {{ $t(chapter.key) }}
                                </span>
                                <Icon v-if="activeChapterId === chapter.id" name="material-symbols:arrow-forward-ios"
                                    :class="chapter.textColor" />
                            </div>
                        </button>
                    </div>
                    <div
                        class="absolute bottom-8 left-4 w-32 h-8 bg-accent-red/20 rotate-[-5deg] border-l-4 border-r-4 border-accent-red/10">
                    </div>
                </div>
                <div class="w-4 md:w-8 book-spine z-20 relative shadow-inner"></div>
                <div
                    class="flex-1 bg-white relative p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 opacity-30 pointer-events-none"
                        style="background-image: radial-gradient(#d1d5db 1px, transparent 1px); background-size: 20px 20px;">
                    </div>
                    <div class="relative w-full max-w-lg z-30">
                        <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-popup popup-card relative">
                            <div
                                class="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-100/80 rotate-1 shadow-sm border-l border-r border-white/50">
                            </div>
                            <div
                                class="absolute -bottom-3 right-8 w-16 h-8 bg-accent-blue/20 -rotate-2 shadow-sm border-l border-r border-white/50">
                            </div>

                            <!-- 一般資訊 -->
                            <div v-if="activeChapterId === 'general'">
                                <h2 class="text-2xl font-black text-[#1c180d] mb-4 flex items-center gap-3">
                                    <span
                                        class="bg-accent-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1c180d]">1</span>
                                    {{ $t('faq.answers.general.title', '平台是如何運作的？') }}
                                </h2>
                                <div class="prose text-gray-600 leading-relaxed font-medium">
                                    <p class="mb-4">{{ $t('faq.answers.general.p1') }}</p>
                                    <p>{{ $t('faq.answers.general.p2') }}</p>
                                </div>
                            </div>

                            <!-- 關於購買 -->
                            <div v-else-if="activeChapterId === 'buying'">
                                <h2 class="text-2xl font-black text-[#1c180d] mb-4 flex items-center gap-3">
                                    <span
                                        class="bg-accent-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1c180d]">2</span>
                                    {{ $t('faq.answers.buying.title') }}
                                </h2>
                                <div class="prose text-gray-600 leading-relaxed font-medium">
                                    <p class="mb-4">{{ $t('faq.answers.buying.p1') }}</p>
                                    <p>{{ $t('faq.answers.buying.p2') }}</p>
                                </div>
                            </div>

                            <!-- 關於販售 -->
                            <div v-else-if="activeChapterId === 'selling'">
                                <h2 class="text-2xl font-black text-[#1c180d] mb-4 flex items-center gap-3">
                                    <span
                                        class="bg-primary text-[#1c180d] w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1c180d]">3</span>
                                    {{ $t('faq.answers.selling.title') }}
                                </h2>
                                <div class="prose text-gray-600 leading-relaxed font-medium">
                                    <p class="mb-4">{{ $t('faq.answers.selling.p1') }}</p>
                                    <p>{{ $t('faq.answers.selling.p2') }}</p>
                                </div>
                            </div>

                            <!-- 安全守則 -->
                            <div v-else-if="activeChapterId === 'safety'">
                                <h2 class="text-2xl font-black text-[#1c180d] mb-4 flex items-center gap-3">
                                    <span
                                        class="bg-accent-purple text-white w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1c180d]">4</span>
                                    {{ $t('faq.answers.safety.title') }}
                                </h2>
                                <div class="prose text-gray-600 leading-relaxed font-medium">
                                    <p class="mb-4">{{ $t('faq.answers.safety.p1') }}</p>
                                    <p>{{ $t('faq.answers.safety.p2') }}</p>
                                </div>
                            </div>

                            <!-- 寄送說明 -->
                            <div v-else-if="activeChapterId === 'shipping'">
                                <h2 class="text-2xl font-black text-[#1c180d] mb-4 flex items-center gap-3">
                                    <span
                                        class="bg-[#fb923c] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1c180d]">5</span>
                                    {{ $t('faq.answers.shipping.title') }}
                                </h2>
                                <div class="prose text-gray-600 leading-relaxed font-medium">
                                    <p class="mb-4">{{ $t('faq.answers.shipping.p1') }}</p>
                                    <p>{{ $t('faq.answers.shipping.p2') }}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            class="absolute top-4 left-4 right-0 bottom-0 bg-gray-50 rounded-xl border border-gray-200 -z-10 rotate-2 scale-[0.98]">
                        </div>
                    </div>
                    <div class="absolute bottom-8 right-8 rotate-12 drop-shadow-md">
                        <div
                            class="bg-accent-red text-white font-bold text-xs px-3 py-1 rounded-full border border-[#1c180d]">
                            {{ $t('faq.super_easy') }}</div>
                    </div>
                    <div class="absolute top-12 right-12 text-gray-300">
                        <Icon name="material-symbols:star" class="text-6xl opacity-20 rotate-[15deg]" />
                    </div>
                </div>
            </div>
        </div>
        <div
            class="mt-16 bg-white rounded-2xl p-8 border-2 border-dashed border-gray-300 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
                <div
                    class="w-16 h-16 bg-[#fef3c7] rounded-full flex items-center justify-center border-2 border-[#d97706] text-[#d97706]">
                    <Icon name="material-symbols:mail" class="text-3xl" />
                </div>
                <div>
                    <h3 class="font-bold text-xl text-[#1c180d]">{{ $t('faq.still_have_questions') }}</h3>
                    <p class="text-gray-500">{{ $t('faq.ready_to_help') }}</p>
                </div>
            </div>
            <!-- FAQ 頁面底部的聯絡客服區塊 -->
            <a href="mailto:asd66151200@gmail.com"
                class="bg-[#1c180d] hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl shadow-[4px_4px_0px_#9ca3af] hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-2">
                {{ $t('faq.contact_support') }}
                <Icon name="material-symbols:send" class="text-sm" />
            </a>
        </div>
    </main>
</template>

<script setup lang="ts">
const { t } = useI18n()
useHead(() => ({ title: t('faq.title') }))

const activeChapterId = ref('general')

const chapters = [
    { id: 'general', key: 'faq.chapter_general', color: 'bg-accent-blue', hoverColor: 'group-hover:bg-accent-blue', textColor: 'text-accent-blue' },
    { id: 'buying', key: 'faq.chapter_buying', color: 'bg-accent-red', hoverColor: 'group-hover:bg-accent-red', textColor: 'text-accent-red' },
    { id: 'selling', key: 'faq.chapter_selling', color: 'bg-primary', hoverColor: 'group-hover:bg-primary', textColor: 'text-primary' },
    { id: 'safety', key: 'faq.chapter_safety', color: 'bg-accent-purple', hoverColor: 'group-hover:bg-accent-purple', textColor: 'text-accent-purple' },
    { id: 'shipping', key: 'faq.chapter_shipping', color: 'bg-[#fb923c]', hoverColor: 'group-hover:bg-[#fb923c]', textColor: 'text-[#fb923c]' },
]
</script>

<style scoped>
.book-spine {
    background: linear-gradient(90deg, #d1d5db 0%, #e5e7eb 5%, #f3f4f6 10%, #e5e7eb 15%, #d1d5db 100%);
    box-shadow: inset -5px 0 10px rgba(0, 0, 0, 0.05);
}

.shadow-folder {
    box-shadow: inset 10px 0 20px -5px rgba(0, 0, 0, 0.1);
}

.shadow-popup {
    box-shadow: 10px 20px 30px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.popup-card {
    transform: perspective(1000px) rotateY(-2deg) translateZ(10px);
    transition: transform 0.3s ease;
}

.popup-card:hover {
    transform: perspective(1000px) rotateY(0deg) translateZ(20px);
}
</style>

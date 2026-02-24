<template>
    <div class="font-display bg-background-light text-[#1c180d] overflow-x-hidden min-h-screen flex flex-col relative">
        <!-- Paper texture overlay -->
        <div class="absolute inset-0 opacity-40 pointer-events-none z-0"
            style="background-image: url('https://www.transparenttextures.com/patterns/crumpled-paper.png'); mix-blend-mode: multiply;">
        </div>

        <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
            <!-- Header Section -->
            <div class="mb-12 text-center md:text-left relative">
                <h1
                    class="text-4xl md:text-5xl font-black tracking-tight mb-2 rotate-slight-left inline-block relative">
                    <span class="relative z-10">{{ $t('upload.title') }}</span>
                    <span class="absolute -bottom-2 left-0 w-full h-3 bg-primary/30 -rotate-1 rounded-full -z-0"></span>
                </h1>
                <p class="text-lg text-gray-500 dark:text-gray-400 mt-2 font-medium ml-2">
                    {{ $t('upload.subtitle') }}
                </p>
            </div>

            <!-- Collage Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                <!-- Left Column: Polaroid Upload -->
                <div class="lg:col-span-5 flex justify-center lg:justify-end pt-8 lg:pt-12">
                    <div
                        class="relative group cursor-pointer rotate-more-left hover:rotate-0 transition-transform duration-300">
                        <!-- Pin Graphic -->
                        <div class="push-pin"></div>
                        <!-- Polaroid Frame -->
                        <div
                            class="bg-white p-4 pb-16 shadow-polaroid w-[320px] sm:w-[380px] h-[420px] flex flex-col items-center justify-center relative">

                            <!-- Upload Area -->
                            <div class="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 group-hover:bg-gray-50 relative overflow-hidden"
                                @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput">
                                <!-- Loading Spinner -->
                                <div v-if="isLoading"
                                    class="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center">
                                    <Icon name="svg-spinners:blocks-shuffle-3" class="text-6xl text-primary" />
                                    <p class="mt-4 text-primary font-bold">Analyzing...</p>
                                </div>

                                <!-- Preview Image -->
                                <img v-if="formData.imageUrl" :src="formData.imageUrl"
                                    class="absolute inset-0 w-full h-full object-cover z-10" />

                                <!-- Upload Prompt -->
                                <div v-if="!formData.imageUrl && !isLoading" class="flex flex-col items-center">
                                    <div
                                        class="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                        <Icon name="material-symbols:add-a-photo-outline" class="text-4xl" />
                                    </div>
                                    <p class="text-gray-500 font-medium">{{ $t('upload.snap_pic') }}</p>
                                    <p class="text-xs text-gray-400">{{ $t('upload.drop_here') }}</p>
                                </div>

                                <input type="file" ref="fileInput" class="hidden" accept="image/*"
                                    @change="handleFileChange" />
                            </div>

                            <!-- Caption area of polaroid -->
                            <div class="absolute bottom-6 left-0 w-full text-center px-6">
                                <p class="font-handwriting text-gray-400 font-medium text-lg"
                                    style="font-family: cursive;">
                                    {{ formData.name || $t('upload.form.photo_caption') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Scattered Form -->
                <div class="lg:col-span-7 relative min-h-[600px] flex flex-col gap-6 lg:block">
                    <!-- Background grid -->
                    <div
                        class="absolute inset-0 border border-dashed border-gray-200 rounded-3xl -z-10 hidden lg:block opacity-50 m-4">
                    </div>

                    <!-- Field 1: Name (Blue) -->
                    <StickyNoteField color="blue" :label="$t('upload.form.name_label')"
                        icon="material-symbols:edit-outline" positionClass="lg:top-0 lg:left-10 z-10"
                        widthClass="lg:w-[400px]" rotationClass="rotate-slight-right">
                        <input v-model="formData.name" type="text"
                            class="w-full bg-white/80 border-0 rounded-lg px-4 py-3 text-gray-800 placeholder-blue-300 focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                            :placeholder="$t('upload.form.name_placeholder')" />
                    </StickyNoteField>

                    <!-- Field 2: Category (Pink) -->
                    <StickyNoteField color="pink" :label="$t('upload.form.category_label')"
                        icon="material-symbols:category-outline" positionClass="lg:top-32 lg:right-10 z-30"
                        widthClass="lg:w-[320px]" rotationClass="rotate-more-left" tapeRotation="rotate-12">
                        <div class="relative">
                            <select v-model="formData.category"
                                class="w-full bg-white/80 border-0 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm appearance-none cursor-pointer">
                                <option value="">{{ $t('upload.form.category_placeholder') }}</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.icon }} {{ cat.name }}</option>
                            </select>
                            <Icon name="material-symbols:expand-more"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                        </div>
                    </StickyNoteField>

                    <!-- Field 3: Description (Yellow) -->
                    <StickyNoteField color="yellow" :label="$t('upload.form.description_label')"
                        icon="material-symbols:description-outline" positionClass="lg:top-60 lg:left-20 z-20"
                        widthClass="lg:w-[420px]" rotationClass="rotate-slight-left" decoration="pin">
                        <textarea v-model="formData.description" rows="4"
                            class="w-full bg-white/80 border-0 rounded-lg px-4 py-3 text-gray-800 placeholder-yellow-600/40 focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm resize-none"
                            :placeholder="$t('upload.form.description_placeholder')"></textarea>
                    </StickyNoteField>

                    <!-- Field 4: Price (Green) -->
                    <StickyNoteField color="green" :label="$t('upload.form.price_label')"
                        icon="material-symbols:sell-outline" positionClass="lg:top-[420px] lg:right-32 z-40"
                        widthClass="lg:w-[240px]" rotationClass="rotate-more-right" tapeRotation="-rotate-6"
                        :clipTag="true">
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-green-700 font-bold">$</span>
                            <input v-model="formData.price" type="number"
                                class="w-full bg-white/80 border-0 rounded-lg pl-8 pr-4 py-3 text-green-800 placeholder-green-300 focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm font-bold text-xl"
                                :placeholder="$t('upload.form.price_placeholder')" />
                        </div>
                    </StickyNoteField>

                    <!-- Field 5: Stock (Yellow) -->
                    <StickyNoteField color="yellow" :label="$t('upload.form.stock_label')"
                        icon="material-symbols:inventory-2-outline" positionClass="lg:top-[500px] lg:left-10 z-30"
                        widthClass="lg:w-[220px]" rotationClass="rotate-slight-left" tapeRotation="rotate-3">
                        <input v-model="formData.stock" type="number" min="0"
                            class="w-full bg-white/80 border-0 rounded-lg px-4 py-3 text-gray-800 placeholder-yellow-600/40 focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm font-bold"
                            :placeholder="$t('upload.form.stock_placeholder')" />
                    </StickyNoteField>

                    <!-- Submit Button Sticker -->
                    <div class="lg:absolute lg:bottom-10 lg:right-10 mt-8 lg:mt-0 flex justify-center lg:block z-50">
                        <button @click="submitForm" class="group relative flex items-center justify-center">
                            <div
                                class="absolute inset-0 bg-yellow-600 rounded-full translate-y-1 group-hover:translate-y-1.5 transition-transform duration-100">
                            </div>
                            <div
                                class="relative bg-primary hover:bg-[#facf4d] active:translate-y-1 active:shadow-none text-white font-black text-xl tracking-wide uppercase px-8 py-8 rounded-full shadow-sticker transition-all duration-100 flex flex-col items-center justify-center gap-1 size-32 rotate-12 group-hover:rotate-[15deg] border-4 border-white">
                                <Icon name="material-symbols:star" class="text-4xl mb-1" />
                                <span class="whitespace-nowrap">{{ $t('upload.form.submit') }}</span>
                            </div>
                            <div
                                class="absolute top-4 left-6 w-8 h-4 bg-white/30 rounded-full rotate-[-20deg] pointer-events-none">
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </main>
        <div class="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 z-20">
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const { data: categories } = await useFetch<{ id: number; name: string; icon: string }[]>(
    `${config.public.apiBase}/categories`,
    { default: () => [] }
);

const formData = reactive({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
});

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        processFile(target.files[0]);
    }
};

const handleDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        processFile(event.dataTransfer.files[0]);
    }
};

const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
        toast.error('請上傳圖片檔案');
        return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
        formData.imageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Upload and Analyze
    isLoading.value = true;
    const body = new FormData();
    body.append('file', file);

    try {
        const token = authStore.token;
        if (!token) {
            toast.error('請先登入');
            return;
        }

        const response = await $fetch<{
            imageUrl: string;
            aiAnalysis: {
                name: string;
                description: string;
                category: string;
                price: number;
            }
        }>(`${config.public.apiBase}/products/analyze`, {
            method: 'POST',
            body,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response && response.aiAnalysis) {
            formData.name = response.aiAnalysis.name;
            formData.description = response.aiAnalysis.description;
            formData.category = response.aiAnalysis.category;
            formData.price = response.aiAnalysis.price.toString();
            formData.imageUrl = response.imageUrl; // Use URL from server
        }
    } catch (error) {
        console.error('Failed to analyze image:', error);
        toast.error('圖片分析失敗，請再試一次');
    } finally {
        isLoading.value = false;
    }
};

const submitForm = async () => {
    if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.imageUrl) {
        toast.error('請填寫所有欄位');
        return;
    }

    isLoading.value = true;

    try {
        const token = authStore.token;
        if (!token) {
            toast.error('請先登入');
            return;
        }

        await $fetch(`${config.public.apiBase}/products`, {
            method: 'POST',
            body: {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                price: formData.price,
                stock: formData.stock ? Number(formData.stock) : 1,
                imageUrl: formData.imageUrl
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        toast.success('商品上架成功！');
        Object.assign(formData, {
            name: '',
            description: '',
            category: '',
            price: '',
            stock: '',
            imageUrl: ''
        });
    } catch (error) {
        console.error('Failed to upload product:', error);
        toast.error('上架失敗，請再試一次');
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
/* Custom styles for rotated elements and specific visual tweaks */
.rotate-slight-right {
    transform: rotate(1deg);
}

.rotate-slight-left {
    transform: rotate(-1deg);
}

.rotate-more-right {
    transform: rotate(2deg);
}

.rotate-more-left {
    transform: rotate(-2deg);
}

.push-pin {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #f4c025, #b48c15);
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
}

.push-pin::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    filter: blur(1px);
}
</style>

<template>
    <div class="relative mx-auto max-w-6xl mt-8 mb-16">
        <!-- Header Tab -->
        <div
            class="absolute -top-12 left-0 w-64 h-14 bg-primary rounded-t-2xl border-4 border-b-0 border-content flex items-center justify-center z-10">
            <span class="font-bold text-content text-xl flex items-center gap-2">
                <Icon name="material-symbols:edit-note" class="text-2xl" />
                {{ $t('commodity.edit_title') }}
            </span>
        </div>

        <!-- Main Card -->
        <div
            class="bg-paper rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] p-6 lg:p-10 relative z-20 overflow-hidden min-h-[600px]">
            <div
                class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\' x=\\'0\\' y=\\'0\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.65\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'0.05\\'/%3E%3C/svg%3E')] opacity-40 pointer-events-none">
            </div>

            <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <!-- Left Column: Image Edit -->
                <div class="lg:col-span-5 flex flex-col gap-6">
                    <div class="relative bg-white border-8 border-gray-200 shadow-xl rounded-sm p-4 rotate-[-1deg] min-h-[350px] flex flex-col items-center justify-center group"
                        style="background-image: url('data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')">
                        <div class="absolute inset-0 border-[16px] border-[#d4d4d4] pointer-events-none opacity-50">
                        </div>
                        <div
                            class="absolute inset-0 border-[16px] border-t-transparent border-l-transparent border-r-[#a3a3a3] border-b-[#a3a3a3] pointer-events-none opacity-20">
                        </div>

                        <div
                            class="relative w-full h-full min-h-[300px] flex flex-col items-center justify-center text-center p-4">
                            <!-- Placeholder Image for now -->
                            <NuxtImg :alt="formData.name || 'Current Masterpiece'"
                                class="w-full h-auto max-h-[300px] object-contain mb-4 drop-shadow-md rounded"
                                :src="formData.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Gb6q0aM6_Jn46xxTtF07VC8s9kY2NQ55MVDqfqcR1WRTr__E1Yn7eo9jQcEeeve0VrjcNHnPcK4QROkPBXnA07HHOhDf1nPOz9Nxle82uKW0epPYTcm2m-00BAV5tEdC00124Zq4ZuOPAHecaTddJSfaJmBxz86hx4gj8-JAZH7jv6HbOiSRrnaAFA6uVkpwtR7AflAIKr3RfDOHmuYBpZqW2w1rBkY-nVP4iNOvLUyMkjeyfFHg-_lzjHZ7_N7SBhNDoJa66QDP'" />
                            <div
                                class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md border border-gray-200">
                                <Icon name="material-symbols:check-circle" class="text-accent-blue text-xl" />
                            </div>
                        </div>
                    </div>

                    <button @click="triggerFileInput" :disabled="isUploading"
                        class="w-full bg-accent-blue hover:bg-[#3dbdb4] text-white py-4 rounded-xl font-black text-lg shadow-[4px_4px_0px_#1c180d] border-2 border-content flex items-center justify-center gap-3 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1c180d] transition-all rotate-1">
                        <Icon v-if="isUploading" name="line-md:loading-loop" class="text-2xl" />
                        <Icon v-else name="material-symbols:add-photo-alternate" class="text-2xl" />
                        {{ isUploading ? $t('commodity.uploading') : $t('commodity.change_masterpiece') }}
                    </button>
                    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                </div>

                <!-- Right Column: Form Details -->
                <div class="lg:col-span-7 flex flex-col gap-6 pl-0 lg:pl-6">
                    <div class="flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-4 mb-2">
                        <h2 class="text-2xl font-black text-content tracking-tight">{{ $t('commodity.listing_details')
                            }}</h2>
                        <span v-if="product?.isActive"
                            class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-300">{{
                                $t('commodity.active') }}</span>
                        <span v-else
                            class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-300">{{
                                $t('commodity.inactive') }}</span>
                    </div>

                    <div class="grid gap-6">
                        <!-- Title -->
                        <div class="form-group">
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1" for="product-name">{{
                                $t('commodity.title_of_work') }}</label>
                            <div
                                class="form-input-strip p-1 flex items-center bg-white border-2 border-content rounded-lg shadow-[2px_3px_0px_#e5e7eb] hover:shadow-[3px_4px_0px_#1c180d] focus-within:shadow-[3px_4px_0px_#1c180d] focus-within:scale-[1.01] focus-within:-rotate-[0.5deg]  transition-all">
                                <input id="product-name" type="text" :placeholder="$t('commodity.placeholder_title')"
                                    v-model="formData.name"
                                    class="w-full border-none focus:ring-0 bg-transparent px-4 py-2 text-lg font-bold placeholder-gray-300 text-content outline-none" />
                                <Icon name="material-symbols:title" class="text-gray-300 pr-3 text-2xl" />
                            </div>
                        </div>

                        <!-- Category & Stock -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="form-group">
                                <label class="block text-sm font-bold text-gray-700 mb-2 ml-1" for="category">{{
                                    $t('commodity.category') }}</label>
                                <div
                                    class="form-input-strip p-1 relative bg-white border-2 border-content rounded-lg shadow-[2px_3px_0px_#e5e7eb] hover:shadow-[3px_4px_0px_#1c180d] focus-within:shadow-[3px_4px_0px_#1c180d] focus-within:scale-[1.01] focus-within:-rotate-[0.5deg] transition-all">
                                    <select id="category" v-model="formData.categoryId"
                                        class="w-full border-none focus:ring-0 bg-transparent px-4 py-2 font-medium text-content appearance-none cursor-pointer outline-none">
                                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}
                                        </option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <Icon name="material-symbols:expand-more" class="text-gray-400 text-xl" />
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-bold text-gray-700 mb-2 ml-1" for="stock">{{
                                    $t('commodity.quantity') }}</label>
                                <div
                                    class="form-input-strip p-1 flex items-center bg-white border-2 border-content rounded-lg shadow-[2px_3px_0px_#e5e7eb] hover:shadow-[3px_4px_0px_#1c180d] focus-within:shadow-[3px_4px_0px_#1c180d] focus-within:scale-[1.01] focus-within:-rotate-[0.5deg] transition-all">
                                    <input id="stock" type="number" min="0" v-model="formData.stock"
                                        class="w-full border-none focus:ring-0 bg-transparent px-4 py-2 text-lg font-bold placeholder-gray-300 text-content text-center outline-none" />
                                </div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="form-group">
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1" for="description">{{
                                $t('commodity.story_behind_art') }}</label>
                            <div class="form-input-strip p-1 bg-white border-2 border-content rounded-lg shadow-[2px_3px_0px_#e5e7eb] hover:shadow-[3px_4px_0px_#1c180d] focus-within:shadow-[3px_4px_0px_#1c180d] focus-within:scale-[1.01] focus-within:-rotate-[0.5deg] transition-all"
                                style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjMwIiBwcmVzZXJ2ZUFzcGVjdHJhdGlvPSJub25lIj48bGluZSB4MT0iMCIgeTE9IjI5IiB4Mj0iMTAwJSIgeTI9IjI5IiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg=='); background-size: 100% 2rem; background-attachment: local; line-height: 2rem;">
                                <textarea id="description" :placeholder="$t('commodity.placeholder_desc')"
                                    v-model="formData.description"
                                    class="w-full border-none focus:ring-0 bg-transparent px-4 py-0 text-base font-medium text-content min-h-[160px] resize-none leading-8 outline-none"></textarea>
                            </div>
                        </div>

                        <!-- Price -->
                        <div class="form-group">
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1" for="price">{{
                                $t('commodity.value') }}</label>
                            <div class="relative max-w-[180px]">
                                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                                    <span
                                        class="font-marker text-2xl text-green-600 font-black transform -rotate-12">$</span>
                                </div>
                                <div
                                    class="form-input-strip p-1 bg-yellow-50 transform -rotate-1 border-2 border-content rounded-lg shadow-[2px_3px_0px_#e5e7eb] hover:shadow-[3px_4px_0px_#1c180d] focus-within:shadow-[3px_4px_0px_#1c180d] focus-within:scale-[1.01] focus-within:-rotate-[0.5deg] transition-all">
                                    <input id="price" type="number" step="1" v-model="formData.price"
                                        class="w-full border-none focus:ring-0 bg-transparent pl-8 pr-4 py-2 text-2xl font-black text-green-700 outline-none" />
                                </div>
                                <div
                                    class="absolute -right-8 top-1/2 -translate-y-1/2 rotate-12 bg-white px-2 py-1 rounded shadow-sm border border-gray-200 text-xs font-bold text-gray-400">
                                    TWD
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Actions -->
                    <div
                        class="mt-8 pt-6 border-t-2 border-dashed border-gray-300 flex flex-col-reverse sm:flex-row items-center gap-6 justify-end">
                        <button @click="submitForm" :disabled="isSubmitting"
                            class="bg-primary hover:bg-yellow-400 text-content px-10 py-4 rounded-xl font-black text-xl shadow-[6px_6px_0px_#1c180d] border-4 border-content flex items-center justify-center gap-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_#1c180d] transition-all">
                            <Icon v-if="isSubmitting" name="line-md:loading-loop" class="text-3xl" />
                            <Icon v-else name="material-symbols:save" class="text-3xl" />
                            <span class="uppercase tracking-tight">{{ isSubmitting ? $t('commodity.saving') :
                                $t('commodity.save')
                                }}</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, shallowRef, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '~/composables/useToast';
import { useI18n } from 'vue-i18n';
import type { EditProductData } from '~/types';

const { t } = useI18n();
useHead({ title: computed(() => t('commodity.edit_title')) })

const route = useRoute();
const router = useRouter();
const $api = useApi();
const productsApi = useProductsApi();
const toast = useToast();

const productId = route.params.id as string;

// 表單防抖
const isUploading = shallowRef(false);
const isSubmitting = shallowRef(false);
const fileInput = useTemplateRef<HTMLInputElement>('fileInput');

// 資料裝載
const { data: product } = await useFetch<EditProductData | null>(`/products/${productId}`, { $fetch: $api });

const { data: categories } = await useFetch<{ id: number; name: string }[]>('/categories', { $fetch: $api });

const formData = reactive({
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    imageUrl: '',
    condition: 'New',
    stock: 1
});

watchEffect(() => {
    if (product.value) {
        formData.name = product.value.name || '';
        formData.description = product.value.description || '';
        formData.price = Number(product.value.price || 0);
        formData.categoryId = product.value.category?.id || 0;
        formData.imageUrl = product.value.imageUrl || '';
        formData.condition = product.value.condition || 'New';
        formData.stock = product.value.stock ?? 1;
    }
});

function triggerFileInput() {
    fileInput.value?.click();
}

async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const uploadForm = new FormData();
    uploadForm.append('file', file);

    isUploading.value = true;
    try {
        const response = await productsApi.analyze(uploadForm) as any;

        formData.imageUrl = response.imageUrl;
        toast.success(t('toast.upload_success'));
    } catch (e) {
        toast.error(t('toast.upload_error'));
        console.error(e);
    } finally {
        isUploading.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
}

async function submitForm() {
    if (!formData.name || !formData.categoryId || formData.price <= 0) {
        toast.error(t('commodity.validation_error'));
        return;
    }

    isSubmitting.value = true;
    try {
        await $api(`/products/${productId}`, {
            method: 'PATCH',
            body: formData
        });

        toast.success(t('commodity.update_success'));
        router.push('/commodity');
    } catch (e: any) {
        toast.error(e.response?._data?.message || t('commodity.update_error'));
        console.error(e);
    } finally {
        isSubmitting.value = false;
    }
}
</script>

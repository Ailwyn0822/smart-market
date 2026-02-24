<template>
    <div class="min-h-screen">
        <main class="flex-grow layout-container max-w-4xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-12">
            <div class="mb-8 flex items-center gap-4">
                <Icon name="material-symbols:manage-accounts" class="text-5xl text-accent-blue" />
                <h1 class="text-4xl font-black text-content uppercase tracking-tight">個人資料編輯</h1>
            </div>

            <div class="bg-white p-8 rounded-2xl border-4 border-content shadow-[8px_8px_0px_#1c180d]">
                <div v-if="pending" class="flex justify-center p-12">
                    <Icon name="line-md:loading-loop" class="text-6xl text-primary" />
                </div>

                <form v-else @submit.prevent="saveProfile" class="flex flex-col gap-8">
                    <div class="flex flex-col md:flex-row gap-8 items-start">

                        <!-- 大頭貼區域 -->
                        <div class="w-full md:w-1/3 flex flex-col items-center gap-4">
                            <div class="relative w-40 h-40 group cursor-pointer" @click="triggerFileInput">
                                <NuxtImg
                                    :src="formData.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + formData.name"
                                    class="w-full h-full rounded-full object-cover border-4 border-content shadow-[4px_4px_0px_#1c180d] bg-yellow-50 group-hover:-translate-y-1 transition-transform" />

                                <!-- Loading 遮罩 -->
                                <div v-if="isUploading"
                                    class="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center transition-opacity z-10">
                                    <Icon name="line-md:loading-loop" class="text-white text-4xl mb-1" />
                                    <span class="text-white text-xs font-bold">上傳中...</span>
                                </div>

                                <div v-else
                                    class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Icon name="material-symbols:camera-alt" class="text-white text-3xl" />
                                </div>
                            </div>
                            <p class="text-xs font-bold text-gray-500 text-center">點擊圖片上傳大頭貼</p>
                            <input type="file" ref="fileInput" class="hidden" accept="image/*"
                                @change="handleFileUpload" />
                        </div>

                        <!-- 欄位區域 -->
                        <div class="w-full md:w-2/3 flex flex-col gap-6">
                            <div>
                                <label class="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">名稱
                                    Name</label>
                                <div
                                    class="form-input-strip p-1 flex items-center bg-white border-2 border-content rounded-lg shadow-[2px_3px_0px_#e5e7eb] focus-within:shadow-[3px_4px_0px_#1c180d] focus-within:-rotate-[0.5deg] transition-all">
                                    <input type="text" v-model="formData.name" placeholder="您的暱稱" required
                                        class="w-full border-none focus:ring-0 bg-transparent px-4 py-2 text-lg font-bold placeholder-gray-300 text-content outline-none" />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">電子郵件
                                    Email</label>
                                <div
                                    class="p-1 flex items-center bg-gray-100 border-2 border-gray-300 rounded-lg opacity-80 cursor-not-allowed">
                                    <input type="email" :value="profile?.email" disabled
                                        class="w-full border-none focus:ring-0 bg-transparent px-4 py-2 text-lg font-bold text-gray-500 outline-none cursor-not-allowed" />
                                </div>
                                <p class="mt-1 text-xs text-gray-400">目前不支援修改電子郵件</p>
                            </div>

                            <!-- 儲存按鈕 -->
                            <div class="pt-6 border-t-2 border-dashed border-gray-200 flex justify-end">
                                <button type="submit" :disabled="isSubmitting"
                                    class="bg-accent-blue hover:bg-[#3dbdb4] text-white px-10 py-3 rounded-xl font-black text-xl shadow-[4px_4px_0px_#1c180d] border-2 border-content flex items-center justify-center gap-3 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1c180d] transition-all -rotate-1">
                                    <Icon v-if="isSubmitting" name="line-md:loading-loop" class="text-2xl" />
                                    <Icon v-else name="material-symbols:save" class="text-2xl" />
                                    <span class="uppercase tracking-tight">{{ isSubmitting ? '儲存中...' : '儲存變更' }}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useToast } from '~/composables/useToast';

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();

useHead({
    title: '個人資料 | Smart Market'
});

const isSubmitting = shallowRef(false);
const isUploading = shallowRef(false);
const fileInput = useTemplateRef<HTMLInputElement>('fileInput');

const { data: profile, pending, refresh } = await useFetch<any>(`${config.public.apiBase}/users/profile`, {
    headers: { Authorization: `Bearer ${authStore.token}` }
});

const formData = reactive({
    name: '',
    avatar: ''
});

watchEffect(() => {
    if (profile.value) {
        formData.name = profile.value.name;
        formData.avatar = profile.value.avatar;
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
        const response = await $fetch<any>(`${config.public.apiBase}/products/analyze`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: uploadForm
        });

        formData.avatar = response.imageUrl;

        // 上傳完成後直接幫使用者儲存
        await $fetch(`${config.public.apiBase}/users/profile`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: { avatar: formData.avatar }
        });

        if (authStore.user) {
            authStore.user.avatar = formData.avatar;
        }
        await refresh();

        toast.success('大頭貼上傳成功，已自動為您儲存');
    } catch (e) {
        toast.error('圖片上傳失敗，請再試一次');
        console.error(e);
    } finally {
        isUploading.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
}

async function saveProfile() {
    if (!formData.name) {
        toast.error('名稱不能為空');
        return;
    }

    isSubmitting.value = true;
    try {
        await $fetch(`${config.public.apiBase}/users/profile`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: formData
        });

        toast.success('個人資料更新成功！');
        // 手動更新 authStore 中的 user data
        if (authStore.user) {
            authStore.user.name = formData.name;
            authStore.user.avatar = formData.avatar;
        }
        await refresh();
    } catch (e: any) {
        toast.error(e.response?._data?.message || '更新失敗，請稍後再試');
        console.error(e);
    } finally {
        isSubmitting.value = false;
    }
}
</script>

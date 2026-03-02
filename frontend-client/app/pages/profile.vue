<template>
    <div class="min-h-screen">
        <main class="flex-grow layout-container max-w-4xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-12">
            <div class="mb-8 flex items-center gap-4">
                <Icon name="material-symbols:manage-accounts" class="text-5xl text-accent-blue" />
                <h1 class="text-4xl font-black text-content uppercase tracking-tight">{{ $t('profile.title') }}</h1>
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
                                    <span class="text-white text-xs font-bold">{{ $t('profile.uploading') }}</span>
                                </div>

                                <div v-else
                                    class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Icon name="material-symbols:camera-alt" class="text-white text-3xl" />
                                </div>
                            </div>
                            <p class="text-xs font-bold text-gray-500 text-center">{{ $t('profile.click_to_upload') }}
                            </p>
                            <input type="file" ref="fileInput" class="hidden" accept="image/*"
                                @change="handleFileUpload" />
                        </div>

                        <!-- 欄位區域 -->
                        <div class="w-full md:w-2/3 flex flex-col gap-6">
                            <div>
                                <label class="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">{{
                                    $t('profile.name_label') }}</label>
                                <div
                                    class="form-input-strip p-1 flex items-center bg-white border-2 border-content rounded-lg shadow-[2px_3px_0px_#e5e7eb] focus-within:shadow-[3px_4px_0px_#1c180d] focus-within:-rotate-[0.5deg] transition-all">
                                    <input type="text" v-model="formData.name"
                                        :placeholder="$t('profile.name_placeholder')" required
                                        class="w-full border-none focus:ring-0 bg-transparent px-4 py-2 text-lg font-bold placeholder-gray-300 text-content outline-none" />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">{{
                                    $t('profile.email_label') }}</label>
                                <div
                                    class="p-1 flex items-center bg-gray-100 border-2 border-gray-300 rounded-lg opacity-80 cursor-not-allowed">
                                    <input type="email" :value="profile?.email" disabled
                                        class="w-full border-none focus:ring-0 bg-transparent px-4 py-2 text-lg font-bold text-gray-500 outline-none cursor-not-allowed" />
                                </div>
                                <p class="mt-1 text-xs text-gray-400">{{ $t('profile.email_note') }}</p>
                            </div>

                            <!-- 儲存按鈕 -->
                            <div class="pt-6 border-t-2 border-dashed border-gray-200 flex justify-end">
                                <button type="submit" :disabled="isSubmitting"
                                    class="bg-accent-blue hover:bg-[#3dbdb4] text-white px-10 py-3 rounded-xl font-black text-xl shadow-[4px_4px_0px_#1c180d] border-2 border-content flex items-center justify-center gap-3 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1c180d] transition-all -rotate-1">
                                    <Icon v-if="isSubmitting" name="line-md:loading-loop" class="text-2xl" />
                                    <Icon v-else name="material-symbols:save" class="text-2xl" />
                                    <span class="uppercase tracking-tight">{{ isSubmitting ? $t('profile.saving') :
                                        $t('profile.save_changes') }}</span>
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
import { watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToast } from '~/composables/useToast';
import { useI18n } from '#imports';

const { t } = useI18n();

const usersApi = useUsersApi();
const productsApi = useProductsApi();
const authStore = useAuthStore();
const toast = useToast();

useHead({ title: computed(() => t('profile.title')) });

const isSubmitting = shallowRef(false);
const isUploading = shallowRef(false);
const fileInput = useTemplateRef<HTMLInputElement>('fileInput');

// 用 $fetch 直接抓，避免 useFetch headers 無法響應式的問題
const profile = ref<any>(null);
const pending = ref(true);

async function refresh() {
    if (!authStore.token) { pending.value = false; return; }
    pending.value = true;
    try {
        profile.value = await usersApi.getProfile();
    } catch (e) {
        console.error('Profile load error:', e);
    } finally {
        pending.value = false;
    }
}

onMounted(() => refresh());

const formData = reactive({
    name: '',
    avatar: ''
});

watch(profile, (val) => {
    if (val) {
        formData.name = val.name || val.username || '';
        formData.avatar = val.avatar || val.picture || '';
    }
}, { immediate: true });

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
        // 嘗試使用專屬頭像上傳端點，若失敗則使用通用圖片分析端點
        let imageUrl = '';
        try {
            const res = await usersApi.uploadAvatar(uploadForm) as any;
            imageUrl = res.imageUrl || res.url || res.avatar || '';
        } catch {
            const res = await productsApi.analyze(uploadForm) as any;
            imageUrl = res.imageUrl || '';
        }

        formData.avatar = imageUrl;

        // 上傳完成後直接幫使用者儲存
        await usersApi.updateProfile({ avatar: formData.avatar });

        if (authStore.user) {
            authStore.user.avatar = formData.avatar;
        }
        await refresh();

        toast.success(t('profile.avatar_success'));
    } catch (e) {
        toast.error(t('toast.error_generic'));
        console.error(e);
    } finally {
        isUploading.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
}

async function saveProfile() {
    if (!formData.name) {
        toast.error(t('profile.name_required'));
        return;
    }

    isSubmitting.value = true;
    try {
        await usersApi.updateProfile(formData);

        toast.success(t('profile.save_success'));
        // 手動更新 authStore 中的 user data
        if (authStore.user) {
            authStore.user.name = formData.name;
            authStore.user.avatar = formData.avatar;
        }
        await refresh();
    } catch (e: any) {
        toast.error(e.response?._data?.message || t('profile.save_error'));
        console.error(e);
    } finally {
        isSubmitting.value = false;
    }
}
</script>

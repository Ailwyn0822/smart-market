<template>
    <main class="flex-grow flex flex-col items-center justify-center w-full px-4 py-8 relative">
        <LoginDecorations />
        <div class="relative w-full max-w-md mt-8 mb-8 z-10 group">
            <!-- 標籤 tab -->
            <div
                class="absolute -top-10 left-0 w-44 h-14 bg-accent-red rounded-t-2xl border-t-4 border-l-4 border-r-4 border-content z-0 flex items-center justify-start pl-6 pb-2">
                <span class="font-black text-white text-sm tracking-wider uppercase drop-shadow-sm">{{
                    $t('register.new_member') }}</span>
            </div>
            <!-- 主卡片 -->
            <div
                class="relative bg-white rounded-b-[2rem] rounded-tr-[2rem] border-4 border-content shadow-[8px_8px_0px_theme('colors.primary')] p-8 md:p-10 z-10 overflow-hidden">
                <div class="absolute inset-0 bg-paper-pattern opacity-50 pointer-events-none"></div>
                <div class="relative z-10">
                    <!-- 標題區域 -->
                    <div class="text-center mb-8">
                        <div
                            class="inline-flex items-center justify-center w-20 h-20 bg-cream border-2 border-primary border-dashed rounded-full mb-4 relative">
                            <Icon name="material-symbols:person-add" class="text-4xl text-primary" />
                            <div
                                class="absolute -right-2 -bottom-1 bg-accent-blue text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-content rotate-[-12deg]">
                                {{ $t('register.new') }}</div>
                        </div>
                        <h2 class="text-3xl font-black text-content tracking-tight mb-2">{{ $t('register.join_class') }}
                        </h2>
                        <p class="text-gray-500 font-medium text-sm">{{ $t('register.subtitle') }}</p>
                    </div>

                    <!-- 註冊表單 -->
                    <form class="space-y-5" @submit.prevent="register">
                        <!-- 用戶名稱 -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-content uppercase ml-3">{{
                                $t('register.username_label') }}</label>
                            <div class="relative group/input">
                                <input v-model="registerForm.username"
                                    class="w-full pl-5 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-content focus:ring-0 text-content font-medium placeholder-gray-400 shadow-sm transition-all group-hover/input:border-gray-300"
                                    :placeholder="$t('register.username_placeholder')" type="text" />
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <Icon name="material-symbols:person"
                                        class="text-gray-300 group-focus-within/input:text-primary" />
                                </div>
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-content uppercase ml-3">{{
                                $t('register.email_label') }}</label>
                            <div class="relative group/input">
                                <input v-model="registerForm.email"
                                    class="w-full pl-5 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-content focus:ring-0 text-content font-medium placeholder-gray-400 shadow-sm transition-all group-hover/input:border-gray-300"
                                    :placeholder="$t('register.email_placeholder')" type="email" />
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <Icon name="material-symbols:mail"
                                        class="text-gray-300 group-focus-within/input:text-primary" />
                                </div>
                            </div>
                        </div>

                        <!-- 密碼 -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-content uppercase ml-3">{{
                                $t('register.password_label') }}</label>
                            <div class="relative group/input">
                                <input v-model="registerForm.password"
                                    class="w-full pl-5 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-content focus:ring-0 text-content font-medium placeholder-gray-400 shadow-sm transition-all group-hover/input:border-gray-300"
                                    :placeholder="$t('register.password_placeholder')" type="password" />
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <Icon name="material-symbols:lock"
                                        class="text-gray-300 group-focus-within/input:text-primary" />
                                </div>
                            </div>
                        </div>

                        <!-- 確認密碼 -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-content uppercase ml-3">{{
                                $t('register.confirm_password_label') }}</label>
                            <div class="relative group/input">
                                <input v-model="registerForm.confirmPassword"
                                    class="w-full pl-5 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-content focus:ring-0 text-content font-medium placeholder-gray-400 shadow-sm transition-all group-hover/input:border-gray-300"
                                    :placeholder="$t('register.confirm_password_placeholder')" type="password" />
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <Icon name="material-symbols:lock-check"
                                        class="text-gray-300 group-focus-within/input:text-primary" />
                                </div>
                            </div>
                        </div>

                        <!-- 提交按鈕 -->
                        <button type="submit" :disabled="isLoading"
                            class="w-full bg-primary hover:bg-yellow-500 text-content text-lg font-black px-8 py-3.5 rounded-2xl shadow-stitch border-2 border-content active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed">
                            <span v-if="isLoading" class="animate-spin inline-block mr-1">
                                <Icon name="material-symbols:progress-activity" />
                            </span>
                            {{ isLoading ? $t('register.loading') : $t('register.submit_btn') }}
                            <Icon v-if="!isLoading" name="material-symbols:arrow-forward" />
                        </button>
                    </form>

                    <!-- 錯誤訊息 -->
                    <div v-if="errorMessage"
                        class="mt-3 flex items-center gap-2 text-red-500 text-sm font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                        <Icon name="material-symbols:error-outline" class="flex-shrink-0" />
                        <span>{{ errorMessage }}</span>
                    </div>

                    <!-- 已有帳號 -->
                    <p class="text-center text-sm text-gray-500 mt-6 font-medium">
                        {{ $t('register.already_student') }}
                        <NuxtLink to="/login"
                            class="font-black text-content underline underline-offset-2 hover:text-accent-red transition-colors">
                            {{ $t('register.login_here') }}
                        </NuxtLink>
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import type { AuthUser } from '~/types'
import { registerSchema } from '@smart-market/shared'
definePageMeta({
    layout: 'auth'
})

const { t } = useI18n()
useHead({ title: computed(() => t('register.page_title')) })

const router = useRouter()
const authApi = useAuthApi()
const authStore = useAuthStore()
const toast = useToast()

const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const isLoading = shallowRef(false)
const errorMessage = shallowRef('')

const register = async () => {
    errorMessage.value = ''

    const result = registerSchema.safeParse({
        username: registerForm.value.username,
        email: registerForm.value.email,
        password: registerForm.value.password
    })
    if (!result.success) {
        errorMessage.value = result.error?.issues[0]?.message ?? t('register.error_required_fields')
        return
    }

    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        errorMessage.value = t('register.error_password_mismatch')
        return
    }

    isLoading.value = true
    try {
        const res = await authApi.register({
            username: registerForm.value.username,
            email: registerForm.value.email,
            password: registerForm.value.password
        }) as { access_token: string; user: AuthUser }
        // 註冊後直接登入
        authStore.login(res.access_token, res.user)
        toast.success(t('register.success'))
        await navigateTo('/')
    } catch (err: any) {
        const statusCode = err?.response?.status || err?.status
        if (statusCode === 409) {
            errorMessage.value = err?.data?.message || t('register.error_duplicate')
        } else {
            errorMessage.value = err?.data?.message || t('register.error_generic')
        }
    } finally {
        isLoading.value = false
    }
}
</script>

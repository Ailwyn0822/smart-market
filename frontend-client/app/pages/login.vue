<template>
    <main class="flex-grow flex flex-col items-center justify-center w-full px-4 py-8 relative">
        <LoginDecorations />
        <div class="relative w-full max-w-md mt-8 mb-8 z-10 group">
            <div
                class="absolute -top-10 left-0 w-40 h-14 bg-accent-blue rounded-t-2xl border-t-4 border-l-4 border-r-4 border-content z-0 flex items-center justify-start pl-6 pb-2">
                <span class="font-black text-white text-sm tracking-wider uppercase drop-shadow-sm">Student
                    ID</span>
            </div>
            <div
                class="relative bg-white rounded-b-[2rem] rounded-tr-[2rem] border-4 border-content shadow-[8px_8px_0px_theme('colors.primary')] p-8 md:p-10 z-10 overflow-hidden">
                <div class="absolute inset-0 bg-paper-pattern opacity-50 pointer-events-none"></div>
                <div class="relative z-10">
                    <div class="text-center mb-8">
                        <div
                            class="inline-flex items-center justify-center w-20 h-20 bg-cream border-2 border-primary border-dashed rounded-full mb-4 relative">
                            <Icon name="material-symbols:school" class="text-4xl text-primary" />
                            <div
                                class="absolute -right-2 -bottom-1 bg-accent-red text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-content rotate-[-12deg]">
                                Hi!</div>
                        </div>
                        <h2 class="text-3xl font-black text-content tracking-tight mb-2">Welcome Back!</h2>
                        <p class="text-gray-500 font-medium text-sm">Sign in to see what's new in class.</p>
                    </div>
                    <form class="space-y-5" @submit.prevent>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-content uppercase ml-3">Username or Email</label>
                            <div class="relative group/input">
                                <input v-model="loginForm.username"
                                    class="w-full pl-5 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-content focus:ring-0 text-content font-medium placeholder-gray-400 shadow-sm transition-all group-hover/input:border-gray-300"
                                    placeholder="coolkid123" type="text" />
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <Icon name="material-symbols:person"
                                        class="text-gray-300 group-focus-within/input:text-primary" />
                                </div>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-content uppercase ml-3">Secret Password</label>
                            <div class="relative group/input">
                                <input v-model="loginForm.password"
                                    class="w-full pl-5 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-content focus:ring-0 text-content font-medium placeholder-gray-400 shadow-sm transition-all group-hover/input:border-gray-300"
                                    placeholder="••••••••" type="password" />
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <Icon name="material-symbols:lock"
                                        class="text-gray-300 group-focus-within/input:text-primary" />
                                </div>
                            </div>
                        </div>
                        <button @click="login"
                            class="w-full bg-primary hover:bg-yellow-500 text-content text-lg font-black px-8 py-3.5 rounded-2xl shadow-stitch border-2 border-content active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-4">
                            Open My Folder
                            <Icon name="material-symbols:arrow-forward" />
                        </button>
                    </form>
                    <div class="mt-8">
                        <div class="relative flex items-center justify-center mb-6">
                            <div class="absolute inset-x-0 h-px bg-gray-200 border-t border-dashed border-gray-300">
                            </div>
                            <span
                                class="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">or
                                stick
                                with</span>
                        </div>
                        <div class="flex justify-center gap-6">
                            <GoogleLoginBtn @click="loginWithGoogle" />
                            <LineLoginBtn @click="loginWithLine" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
definePageMeta({
    layout: 'auth'
})

const loginForm = ref({
    username: '',
    password: ''
})

const login = () => {
    alert(`account:${loginForm.value.username}, password:${loginForm.value.password}`)
}

const config = useRuntimeConfig()

const loginWithGoogle = () => {
    window.location.href = `${config.public.apiBase}/auth/google`
}

const loginWithLine = () => {
    window.location.href = `${config.public.apiBase}/auth/line`
}
</script>

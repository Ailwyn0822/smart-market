<template>
    <main class="flex-grow flex flex-col items-center justify-center w-full px-4 py-8 relative">
        <div class="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto">
            <svg class="absolute top-10 left-4 md:left-20 w-32 h-32 text-accent-blue/80 opacity-80 rotate-[-15deg]"
                fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z">
                </path>
            </svg>
            <svg class="absolute bottom-10 right-4 md:right-20 w-24 h-24 text-primary/80 opacity-80 animate-bounce"
                fill="currentColor" style="animation-duration: 3s;" viewBox="0 0 24 24">
                <path
                    d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z">
                </path>
            </svg>
            <svg class="absolute top-20 right-10 md:right-32 w-20 h-20 text-accent-red/60 opacity-60 rotate-12"
                fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewBox="0 0 24 24">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z">
                </path>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"></path>
            </svg>
            <svg class="absolute bottom-20 left-10 md:left-32 w-24 h-24 text-accent-purple/60 opacity-60 rotate-[-10deg]"
                fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="4" viewBox="0 0 100 100">
                <path d="M10,50 Q25,25 40,50 T70,50 T90,50"></path>
                <path d="M10,60 Q25,35 40,60 T70,60 T90,60" opacity="0.5"></path>
            </svg>
        </div>
        <div class="relative w-full max-w-md mt-8 mb-8 z-10 group">
            <div
                class="absolute -top-10 left-0 w-40 h-14 bg-accent-blue rounded-t-2xl border-t-4 border-l-4 border-r-4 border-[#1c180d] z-0 flex items-center justify-start pl-6 pb-2">
                <span class="font-black text-white text-sm tracking-wider uppercase drop-shadow-sm">Student
                    ID</span>
            </div>
            <div
                class="relative bg-white rounded-b-[2rem] rounded-tr-[2rem] border-4 border-[#1c180d] shadow-[8px_8px_0px_#f4c025] p-8 md:p-10 z-10 overflow-hidden">
                <div class="absolute inset-0 bg-paper-pattern opacity-50 pointer-events-none"></div>
                <div class="relative z-10">
                    <div class="text-center mb-8">
                        <div
                            class="inline-flex items-center justify-center w-20 h-20 bg-[#fefce8] border-2 border-primary border-dashed rounded-full mb-4 relative">
                            <span class="material-symbols-outlined text-4xl text-primary">school</span>
                            <div
                                class="absolute -right-2 -bottom-1 bg-accent-red text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-[#1c180d] rotate-[-12deg]">
                                Hi!</div>
                        </div>
                        <h2 class="text-3xl font-black text-[#1c180d] tracking-tight mb-2">Welcome Back!</h2>
                        <p class="text-gray-500 font-medium text-sm">Sign in to see what's new in class.</p>
                    </div>
                    <form class="space-y-5" @submit.prevent>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-[#1c180d] uppercase ml-3">Username or Email</label>
                            <div class="relative group/input">
                                <input
                                    class="w-full pl-5 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#1c180d] focus:ring-0 text-[#1c180d] font-medium placeholder-gray-400 shadow-sm transition-all group-hover/input:border-gray-300"
                                    placeholder="coolkid123" type="text" />
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <span
                                        class="material-symbols-outlined text-gray-300 group-focus-within/input:text-primary">person</span>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-[#1c180d] uppercase ml-3">Secret Password</label>
                            <div class="relative group/input">
                                <input
                                    class="w-full pl-5 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#1c180d] focus:ring-0 text-[#1c180d] font-medium placeholder-gray-400 shadow-sm transition-all group-hover/input:border-gray-300"
                                    placeholder="••••••••" type="password" />
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <span
                                        class="material-symbols-outlined text-gray-300 group-focus-within/input:text-primary">lock</span>
                                </div>
                            </div>
                            <div class="flex justify-end pr-2">
                                <a class="text-xs font-bold text-gray-400 hover:text-accent-blue hover:underline decoration-2 decoration-wavy"
                                    href="#">Forgot Code?</a>
                            </div>
                        </div>
                        <button
                            class="w-full bg-primary hover:bg-[#eab308] text-[#1c180d] text-lg font-black px-8 py-3.5 rounded-2xl shadow-[4px_4px_0px_#1c180d] border-2 border-[#1c180d] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-4">
                            Open My Folder
                            <span class="material-symbols-outlined">arrow_forward</span>
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
                            <button @click="loginWithGoogle"
                                class="group relative size-14 rounded-full bg-white border-2 border-[#1c180d] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:scale-110 hover:-rotate-6 transition-transform duration-300 flex items-center justify-center">
                                <svg class="size-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"></path>
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"></path>
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"></path>
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"></path>
                                </svg>
                            </button>
                            <button @click="loginWithLine"
                                class="group relative size-14 rounded-full bg-[#06c755] border-2 border-[#1c180d] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:scale-110 hover:rotate-6 transition-transform duration-300 flex items-center justify-center">
                                <span class="font-black text-white text-[10px] tracking-tight">LINE</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="absolute -bottom-4 -left-4 w-12 h-12 rounded-full border-4 border-[#e5e7eb] bg-white z-20 flex items-center justify-center rotate-45 shadow-sm">
            <div class="w-2 h-8 bg-gray-300 rounded-full"></div>
        </div>
    </main>
</template>

<script setup>
const loginWithGoogle = () => {
    window.location.href = 'http://localhost:8080/auth/google'
}

const loginWithLine = () => {
    window.location.href = 'http://localhost:8080/auth/line'
}
</script>

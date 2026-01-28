<template>
    <footer class="mt-12 bg-[#1c180d] text-white pt-12 pb-8 relative overflow-hidden">
        <div class="absolute top-[-10px] left-0 w-full h-8 bg-[#f8f8f5] torn-paper-edge">
        </div>
        <div
            class="layout-container max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex flex-col md:flex-row items-center gap-6">
                <div class="flex items-center gap-2">
                    <div
                        class="size-10 bg-primary rounded-full flex items-center justify-center border-2 border-white rotate-3">
                        <span class="material-symbols-outlined text-[#1c180d] text-xl">palette</span>
                    </div>
                    <h2 class="text-xl font-black">CreativeCorner</h2>
                </div>
                <div class="hidden md:block w-px h-8 bg-white/20"></div>
                <p class="text-xs text-gray-400 font-medium text-center md:text-left">
                    © 2026 JianHao Chen. <br class="md:hidden" /> All rights reserved.
                </p>
            </div>
            <div class="flex items-center gap-4">
                <a class="size-10 bg-accent-blue rounded-lg border-2 border-white flex items-center justify-center text-white rotate-2 hover:rotate-6 hover:scale-110 transition-transform shadow-sm"
                    href="#">
                    <span class="font-bold text-sm">IG</span>
                </a>
                <a class="size-10 bg-accent-red rounded-full border-2 border-white flex items-center justify-center text-white -rotate-3 hover:-rotate-6 hover:scale-110 transition-transform shadow-sm"
                    href="#">
                    <span class="font-bold text-sm">FB</span>
                </a>
                <a class="size-10 bg-primary rounded-lg border-2 border-white flex items-center justify-center text-[#1c180d] rotate-1 hover:rotate-3 hover:scale-110 transition-transform shadow-sm"
                    href="#">
                    <span class="font-bold text-sm">YT</span>
                </a>
                <a class="size-10 bg-accent-purple rounded-full border-2 border-white flex items-center justify-center text-white -rotate-2 hover:-rotate-4 hover:scale-110 transition-transform shadow-sm"
                    href="#">
                    <span class="font-bold text-sm">PT</span>
                </a>
            </div>
        </div>
    </footer>
</template>
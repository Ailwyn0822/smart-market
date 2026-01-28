<template>
    <footer class="mt-12 bg-content text-white pt-12 pb-8 relative overflow-hidden">
        <div class="absolute top-[-10px] left-0 w-full h-8 bg-background-light torn-paper-edge">
        </div>
        <div
            class="layout-container max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex flex-col md:flex-row items-center gap-6">
                <div class="flex items-center gap-2">
                    <div
                        class="size-10 bg-primary rounded-full flex items-center justify-center border-2 border-white rotate-3">
                        <Icon name="material-symbols:palette" class="text-content text-xl" />
                    </div>
                    <h2 class="text-xl font-black">CreativeCorner</h2>
                </div>
                <div class="hidden md:block w-px h-8 bg-white/20"></div>
                <p class="text-xs text-gray-400 font-medium text-center md:text-left">
                    © 2026 JianHao Chen. <br class="md:hidden" /> All rights reserved.
                </p>
            </div>
            <div class="flex items-center gap-4">
                <a v-for="link in socialLinks" :key="link.name" :href="link.href"
                    :class="`size-10 ${link.bgColor} rounded-full border-2 border-white flex items-center justify-center ${link.textColor || 'text-white'} ${link.rotate} hover:${link.hoverRotate} hover:scale-110 transition-transform shadow-sm`">
                    <span class="font-bold text-sm">{{ link.name }}</span>
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup>
const socialLinks = [
    { name: 'IG', href: '#', bgColor: 'bg-accent-blue', rotate: 'rotate-2', hoverRotate: 'rotate-6', textColor: 'text-white' },
    { name: 'FB', href: '#', bgColor: 'bg-accent-red', rotate: '-rotate-3', hoverRotate: '-rotate-6', textColor: 'text-white' },
    { name: 'YT', href: '#', bgColor: 'bg-primary', rotate: 'rotate-1', hoverRotate: 'rotate-3', textColor: 'text-content' },
    { name: 'PT', href: '#', bgColor: 'bg-accent-purple', rotate: '-rotate-2', hoverRotate: '-rotate-4', textColor: 'text-white' },
]
</script>
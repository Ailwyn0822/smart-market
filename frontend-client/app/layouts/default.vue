<template>
    <div class="text-content min-h-screen flex flex-col overflow-x-hidden">
        <header class="relative w-full z-50 pt-6 px-4 sm:px-8 lg:px-12 pb-4">
            <div
                class="layout-container max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                <HeaderLogo />
                <nav class="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <a class="sticker-nav-item bg-white px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm rotate-1"
                        href="#">
                        Shop
                    </a>
                    <a class="sticker-nav-item bg-accent-blue px-5 py-2 rounded-lg border-2 border-content text-white font-bold text-sm -rotate-2"
                        href="#">
                        Sell
                    </a>
                    <a class="sticker-nav-item bg-accent-red px-5 py-2 rounded-lg border-2 border-content text-white font-bold text-sm rotate-2"
                        href="#">
                        About
                    </a>
                    <a class="sticker-nav-item bg-white px-4 py-2 rounded-lg border-2 border-content text-content font-bold text-sm -rotate-1 flex items-center gap-2"
                        href="#">
                        <Icon name="material-symbols:shopping-cart" class="text-lg" />
                        Cart
                    </a>
                </nav>
                <div class="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-end">
                    <div class="relative w-full max-w-[280px]">
                        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Icon name="material-symbols:search" class="text-gray-400 text-xl" />
                        </div>
                        <input
                            class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-dashed border-gray-400 focus:border-content focus:ring-0 text-sm font-medium placeholder-gray-400 shadow-sm"
                            placeholder="Search for toys, books..." type="text" />
                    </div>
                    <NuxtLink to="/login"
                        class="bg-primary px-5 py-2 rounded-lg border-2 border-content text-content font-bold text-sm shadow-stitch-sm hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2">
                        <Icon name="material-symbols:login" class="text-lg" />
                        Login
                    </NuxtLink>
                </div>
            </div>
        </header>
        <slot  />
        <Footer />
    </div>
</template>
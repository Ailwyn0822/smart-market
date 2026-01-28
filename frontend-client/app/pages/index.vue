<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 space-y-16">
        <section class="@container">
            <div
                class="bg-white rounded-[2.5rem] p-6 lg:p-12 border-4 border-[#1c180d] shadow-[8px_8px_0px_#f4c025] relative overflow-hidden">
                <div
                    class="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3">
                </div>
                <div
                    class="absolute bottom-0 left-0 w-64 h-64 bg-accent-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3">
                </div>
                <div class="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                    <div class="flex-1 flex flex-col gap-6 items-start text-left max-w-xl">
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 bg-[#fefce8] border border-primary rounded-full text-xs font-bold text-[#854d0e] uppercase tracking-wide">
                            <span class="material-symbols-outlined text-sm">verified</span>
                            Verified Safe for Kids
                        </div>
                        <h1 class="text-5xl sm:text-6xl font-black text-[#1c180d] leading-[1.1] tracking-tight">
                            Give Old Toys <br />
                            <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-primary relative inline-block">
                                New Adventures
                                <svg class="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-50"
                                    preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" stroke-width="8">
                                    </path>
                                </svg>
                            </span>
                        </h1>
                        <p class="text-lg text-gray-600 font-medium leading-relaxed">
                            A playful marketplace for buying and selling pre-loved toys, clothes, and gear. Join the
                            creative circle of reusing
                            and recycling!
                        </p>
                        <div class="flex flex-wrap gap-4 pt-2">
                            <button
                                class="bg-primary hover:bg-[#eab308] text-[#1c180d] text-base font-bold px-8 py-3.5 rounded-full shadow-[4px_4px_0px_#1c180d] border-2 border-[#1c180d] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2">
                                Start Exploring
                                <span class="material-symbols-outlined">arrow_forward</span>
                            </button>
                            <button
                                class="bg-white hover:bg-gray-50 text-[#1c180d] text-base font-bold px-8 py-3.5 rounded-full border-2 border-[#1c180d] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all">
                                How it Works
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 w-full relative">
                        <div class="relative z-10 rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                            <div
                                class="absolute inset-0 bg-accent-blue rounded-[2rem] translate-x-3 translate-y-3 -z-10 border-2 border-[#1c180d]">
                            </div>
                            <div class="bg-white p-2 pb-6 rounded-[2rem] border-2 border-[#1c180d] shadow-xl">
                                <div class="w-full aspect-[4/3] bg-gray-200 rounded-[1.5rem] overflow-hidden bg-cover bg-center"
                                    data-alt="Children playing with colorful wooden building blocks"
                                    style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXLcieLcgLm6DKGq9M-t4SdKUmyFKVce_mrJ0Ks00z8qJMrinJtppYKN6QNCyHLeBN7i8hwsKIseQbT9AF6fItEf43UejpuirKEF_vy6M8nAoKhSxQ2rsewKiwyYHG3coQsZDXplbk0Bv56G7y5467HZFxwpBMUNeXKfZu8qU20gbziRKA2Iovf9ZLPQ_ljuHY0B82waI3FqKNyZ0Yx_xvc9JpEXR9YPQt1y5IoaAx6MYkjaNu-pOk5PLj8OWeSWiz01YYoOj6K0kt');">
                                </div>
                                <div class="flex justify-between items-center px-4 pt-3">
                                    <div class="flex -space-x-2">
                                        <div class="size-8 rounded-full border-2 border-white bg-gray-200 bg-cover"
                                            data-alt="Child face 1"
                                            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDGuylDdNXyTomGyZko_jva0JQnFgn0J0cOZgmjLsqvKv4CfeModPpMZNSONwIH716RxGlEM9iYtLCfZv_AB4hRGjDb9rehOYFw7RABgSla2I6y1_3KTyss-V5yR86JfO_Wx2RcW3xnJ4AofOWjiEadTao62DcRL1qpRSl5mqaVP6eWxGnMHIduRMm73ohotDs9pZyXskntHffuJb2Wr_lFOEiXYd7vgJqh23r3OZiLn4k4SnS5j-OyNAPyw62kycedcU_H7YkCEDiw');">
                                        </div>
                                        <div class="size-8 rounded-full border-2 border-white bg-gray-200 bg-cover"
                                            data-alt="Child face 2"
                                            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGFdWS0oiH5tnUEbqbrWW76rU_M2jIl-PZYTq0QbSluAXUjCuBJCWI_IpzdNDvalbfABog_hPHBVSdbCB35dkGh3IDCmczab6NMaYBZlTUIq6XX5GcfI4AmaQVAeE7sXzU0K_YSxq2WbVLodlSjBna3VzLoKP9aiKduvYITF8iftGKrTbhxBVLnidrtpjdcIfGqpvo2egfxWVcj5WS_ONgWbcpA3KTdQPHykHut-ybctSJZdlqTYRvsCG45RrjsfFRtvRL2UMY8cjC');">
                                        </div>
                                        <div
                                            class="size-8 rounded-full border-2 border-white bg-accent-red flex items-center justify-center text-[10px] text-white font-bold">
                                            +2k</div>
                                    </div>
                                    <span class="font-handwriting text-gray-500 text-sm font-bold rotate-[-2deg]">Happy
                                        Kids!</span>
                                </div>
                            </div>
                        </div>
                        <div
                            class="absolute -top-6 -right-4 size-16 bg-primary rounded-full flex items-center justify-center border-2 border-[#1c180d] shadow-md animate-bounce delay-700 z-20">
                            <span class="material-symbols-outlined text-3xl">star</span>
                        </div>
                        <div
                            class="absolute -bottom-8 -left-2 bg-white px-4 py-2 rounded-lg border-2 border-[#1c180d] rotate-[-6deg] shadow-lg z-20">
                            <span class="font-bold text-accent-red">50% OFF</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="flex items-end justify-between mb-8 px-2">
                <h2 class="text-3xl font-black text-[#1c180d] tracking-tight flex items-center gap-3">
                    <span class="material-symbols-outlined text-4xl text-accent-blue">brush</span>
                    What are you looking for?
                </h2>
                <a class="text-sm font-bold text-gray-500 underline decoration-2 hover:text-accent-blue" href="#">View
                    All
                    Categories</a>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <a class="group flex flex-col items-center gap-3" href="#">
                    <div
                        class="size-32 bg-accent-red rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-[#1c180d] group-hover:scale-110 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)]">
                        <span class="material-symbols-outlined text-white text-5xl">toys</span>
                    </div>
                    <span
                        class="font-bold text-lg text-[#1c180d] bg-white px-3 py-1 rounded-lg border border-transparent group-hover:border-[#1c180d] group-hover:shadow-sm transition-all">Toys</span>
                </a>
                <a class="group flex flex-col items-center gap-3" href="#">
                    <div
                        class="size-32 bg-accent-blue rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-[#1c180d] group-hover:scale-110 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)]">
                        <span class="material-symbols-outlined text-white text-5xl">checkroom</span>
                    </div>
                    <span
                        class="font-bold text-lg text-[#1c180d] bg-white px-3 py-1 rounded-lg border border-transparent group-hover:border-[#1c180d] group-hover:shadow-sm transition-all">Clothes</span>
                </a>
                <a class="group flex flex-col items-center gap-3" href="#">
                    <div
                        class="size-32 bg-primary rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-[#1c180d] group-hover:scale-110 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)]">
                        <span class="material-symbols-outlined text-[#1c180d] text-5xl">menu_book</span>
                    </div>
                    <span
                        class="font-bold text-lg text-[#1c180d] bg-white px-3 py-1 rounded-lg border border-transparent group-hover:border-[#1c180d] group-hover:shadow-sm transition-all">Books</span>
                </a>
                <a class="group flex flex-col items-center gap-3" href="#">
                    <div
                        class="size-32 bg-accent-purple rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-[#1c180d] group-hover:scale-110 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)]">
                        <span class="material-symbols-outlined text-white text-5xl">palette</span>
                    </div>
                    <span
                        class="font-bold text-lg text-[#1c180d] bg-white px-3 py-1 rounded-lg border border-transparent group-hover:border-[#1c180d] group-hover:shadow-sm transition-all">Art</span>
                </a>
                <a class="group flex flex-col items-center gap-3" href="#">
                    <div
                        class="size-32 bg-[#fb923c] rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-[#1c180d] group-hover:scale-110 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)]">
                        <span class="material-symbols-outlined text-white text-5xl">sports_soccer</span>
                    </div>
                    <span
                        class="font-bold text-lg text-[#1c180d] bg-white px-3 py-1 rounded-lg border border-transparent group-hover:border-[#1c180d] group-hover:shadow-sm transition-all">Gear</span>
                </a>
                <a class="group flex flex-col items-center gap-3" href="#">
                    <div
                        class="size-32 bg-[#4ade80] rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-[#1c180d] group-hover:scale-110 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)]">
                        <span class="material-symbols-outlined text-white text-5xl">pedal_bike</span>
                    </div>
                    <span
                        class="font-bold text-lg text-[#1c180d] bg-white px-3 py-1 rounded-lg border border-transparent group-hover:border-[#1c180d] group-hover:shadow-sm transition-all">Outdoor</span>
                </a>
            </div>
        </section>
        <section>
            <div class="flex items-center justify-center mb-10 relative">
                <div class="absolute h-1 w-full bg-[#1c180d] top-1/2 -z-10 rounded-full opacity-10"></div>
                <h2 class="bg-[#f8f8f5] px-6 text-3xl font-black text-[#1c180d] tracking-tight">Featured Finds</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div
                    class="bg-white p-4 rounded-2xl crayon-border-red flex flex-col gap-3 group hover:-translate-y-2 transition-transform duration-300">
                    <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
                        <div
                            class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-gray-100">
                            Used - Good</div>
                        <img alt="Red classic toy car"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            data-alt="Red classic toy car"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPB3dGs-oKxc75etMaToQGn0skAAjAeBZnWv5T5HwOeTHYcZ-gXZMNAdHDsCt48KIPL9ZMYQ9Q8I9gmdfU14ROgReXqaHiR8CJuY59CjOQs6j-lp94D8dxZtBFTKYZM4xE7Jtn0-4NIbaVOXJRN0DN-IE-DuNHh6xPVDydKCiCt85nC9TWQa0Ijxrp0kcYZuqYAvEddxq_vlrsPTuvfR-zmOPg86fU4LkTzJ9vM4pThtlE_lICxatASb8O2_duSXHuZX6gxOkJPOuQ" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between items-start">
                            <h3 class="font-bold text-lg text-[#1c180d] line-clamp-1">Classic Red Racer</h3>
                            <span class="text-accent-red font-black text-lg">$15</span>
                        </div>
                        <p class="text-sm text-gray-500 line-clamp-2">Vintage style metal pedal car, slightly
                            scratched but runs
                            fast!</p>
                    </div>
                    <button
                        class="mt-auto w-full bg-background-light hover:bg-accent-red hover:text-white border-2 border-transparent hover:border-[#1c180d] py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 group-hover:shadow-md">
                        Add to Cart <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                    </button>
                </div>
                <div
                    class="bg-white p-4 rounded-2xl crayon-border-blue flex flex-col gap-3 group hover:-translate-y-2 transition-transform duration-300">
                    <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
                        <div
                            class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-gray-100">
                            Like New</div>
                        <img alt="Set of colorful wooden blocks"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            data-alt="Set of colorful wooden blocks"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7Gb6q0aM6_Jn46xxTtF07VC8s9kY2NQ55MVDqfqcR1WRTr__E1Yn7eo9jQcEeeve0VrjcNHnPcK4QROkPBXnA07HHOhDf1nPOz9Nxle82uKW0epPYTcm2m-00BAV5tEdC00124Zq4ZuOPAHecaTddJSfaJmBxz86hx4gj8-JAZH7jv6HbOiSRrnaAFA6uVkpwtR7AflAIKr3RfDOHmuYBpZqW2w1rBkY-nVP4iNOvLUyMkjeyfFHg-_lzjHZ7_N7SBhNDoJa66QDP" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between items-start">
                            <h3 class="font-bold text-lg text-[#1c180d] line-clamp-1">Wooden Block Set</h3>
                            <span class="text-accent-blue font-black text-lg">$24</span>
                        </div>
                        <p class="text-sm text-gray-500 line-clamp-2">Complete set of 50 blocks. Great for building
                            castles.</p>
                    </div>
                    <button
                        class="mt-auto w-full bg-background-light hover:bg-accent-blue hover:text-white border-2 border-transparent hover:border-[#1c180d] py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 group-hover:shadow-md">
                        Add to Cart <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                    </button>
                </div>
                <div
                    class="bg-white p-4 rounded-2xl crayon-border-yellow flex flex-col gap-3 group hover:-translate-y-2 transition-transform duration-300">
                    <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
                        <div
                            class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-gray-100">
                            Used - Fair</div>
                        <img alt="Plush teddy bear"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            data-alt="Plush teddy bear sitting on a shelf"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTd1ik66Od35XTgQfdYh2vHG2rRP2Q_ffVtYApvmOgGQtkw6nmZ7z7ILo1qddTQQgErO0PgC1pMdlsrXdxXunxySlqJ_EecKCrVrGWJWNOis2NDDa6PeSWW71iLhPWGDvXk37DjlyjBCbV4mcsNydgqcVTDlS9J7dmgExOMguko9yflrdbAgG1G3V946vzyua4M2csQSx3mc3raqd74CsYFmz2wi5DlVcoOWP0s06O2PPHkCb5NR70UtK9TeZ7XcFQf5sTkYZ22A5x" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between items-start">
                            <h3 class="font-bold text-lg text-[#1c180d] line-clamp-1">Mr. Cuddles Bear</h3>
                            <span class="text-primary font-black text-lg">$8</span>
                        </div>
                        <p class="text-sm text-gray-500 line-clamp-2">Looking for a new home. Very soft, just needs
                            a wash.</p>
                    </div>
                    <button
                        class="mt-auto w-full bg-background-light hover:bg-primary hover:text-[#1c180d] border-2 border-transparent hover:border-[#1c180d] py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 group-hover:shadow-md">
                        Add to Cart <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                    </button>
                </div>
                <div
                    class="bg-white p-4 rounded-2xl crayon-border-purple flex flex-col gap-3 group hover:-translate-y-2 transition-transform duration-300">
                    <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
                        <div
                            class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-gray-100">
                            New</div>
                        <img alt="Set of painting brushes and colors"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            data-alt="Set of painting brushes and colors"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2BqY4axIOd2zsQ0sXt702dJjPyc2uW61HdaIrnz7GQWvAE07wwmVEo6ZLgqC3p8oXeX2htk2TvIuMQDOSBmnzh9NDKghVHuaHNQJaHcC8LpJV4oXVe6PaAuMlyyP8GbNXksjIZuyYxbt80zGREEITHsQn0M_GIW160ynsSuSepavdT4JPZr5dznyJIfO0uJ4obBSxNx_LaQeX1X3HII50qoChfxSdyjepE3S7ZNKyREI8hHeP8n4QoV7SUIcPERI_H2yRYtg97aH7" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between items-start">
                            <h3 class="font-bold text-lg text-[#1c180d] line-clamp-1">Artist Starter Kit</h3>
                            <span class="text-accent-purple font-black text-lg">$30</span>
                        </div>
                        <p class="text-sm text-gray-500 line-clamp-2">Never opened. Includes canvas, easel, and
                            acrylics.</p>
                    </div>
                    <button
                        class="mt-auto w-full bg-background-light hover:bg-accent-purple hover:text-white border-2 border-transparent hover:border-[#1c180d] py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 group-hover:shadow-md">
                        Add to Cart <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </section>
        <section
            class="bg-white rounded-[2rem] p-8 border-2 border-dashed border-gray-300 flex flex-wrap justify-center gap-8 md:justify-around">
            <div class="flex flex-col items-center gap-3 text-center max-w-[150px]">
                <div
                    class="size-16 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center border-2 border-[#d97706] shadow-[2px_2px_0_#d97706]">
                    <span class="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <div>
                    <h4 class="font-bold text-[#1c180d]">Parent Verified</h4>
                    <p class="text-xs text-gray-500">All sellers are checked</p>
                </div>
            </div>
            <div class="flex flex-col items-center gap-3 text-center max-w-[150px]">
                <div
                    class="size-16 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center border-2 border-[#16a34a] shadow-[2px_2px_0_#16a34a]">
                    <span class="material-symbols-outlined text-3xl">recycling</span>
                </div>
                <div>
                    <h4 class="font-bold text-[#1c180d]">Eco-Friendly</h4>
                    <p class="text-xs text-gray-500">Good for the planet</p>
                </div>
            </div>
            <div class="flex flex-col items-center gap-3 text-center max-w-[150px]">
                <div
                    class="size-16 rounded-full bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center border-2 border-[#0284c7] shadow-[2px_2px_0_#0284c7]">
                    <span class="material-symbols-outlined text-3xl">lock</span>
                </div>
                <div>
                    <h4 class="font-bold text-[#1c180d]">Secure Pay</h4>
                    <p class="text-xs text-gray-500">Money safe guarantee</p>
                </div>
            </div>
            <div class="flex flex-col items-center gap-3 text-center max-w-[150px]">
                <div
                    class="size-16 rounded-full bg-[#fce7f3] text-[#db2777] flex items-center justify-center border-2 border-[#db2777] shadow-[2px_2px_0_#db2777]">
                    <span class="material-symbols-outlined text-3xl">sentiment_satisfied</span>
                </div>
                <div>
                    <h4 class="font-bold text-[#1c180d]">Happiness</h4>
                    <p class="text-xs text-gray-500">Returns made easy</p>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
</script>
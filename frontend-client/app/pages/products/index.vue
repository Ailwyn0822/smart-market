<template>
    <main class="flex-grow layout-container max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- 側邊欄過濾器 -->
            <NotebookSidebar />

            <!-- 產品區域 -->
            <div class="flex-1">
                <!-- 標題與排序 -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-3xl font-black text-content">
                        {{ $t('products.all_treasures') }}
                        <span class="text-gray-400 font-medium text-lg ml-2">({{ products.length }} {{
                            $t('products.items') }})</span>
                    </h2>
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-gray-500">{{ $t('products.sort_by') }}</span>
                        <select v-model="sortBy"
                            class="bg-white border-2 border-content rounded-lg py-1 px-3 text-sm font-bold focus:ring-0 focus:border-content cursor-pointer">
                            <option value="newest">{{ $t('products.sort_newest') }}</option>
                            <option value="price-low">{{ $t('products.sort_price_low') }}</option>
                            <option value="price-high">{{ $t('products.sort_price_high') }}</option>
                        </select>
                    </div>
                </div>

                <!-- 產品網格 -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProductCard v-for="product in sortedProducts" :key="product.title" :item="product" />
                </div>

                <!-- 載入動畫 -->
                <div class="mt-16 flex justify-center">
                    <div class="flex gap-2">
                        <div class="size-4 bg-primary rounded-full animate-bounce"></div>
                        <div class="size-4 bg-accent-red rounded-full animate-bounce delay-100"></div>
                        <div class="size-4 bg-accent-blue rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProductItem } from '~/types'

const sortBy = ref('newest')

// 模擬產品資料
const products = ref<ProductItem[]>([
    {
        title: 'Classic Red Racer',
        price: '$15',
        condition: 'Used - Good',
        description: 'Vintage style metal pedal car, slightly scratched but runs fast!',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPB3dGs-oKxc75etMaToQGn0skAAjAeBZnWv5T5HwOeTHYcZ-gXZMNAdHDsCt48KIPL9ZMYQ9Q8I9gmdfU14ROgReXqaHiR8CJuY59CjOQs6j-lp94D8dxZtBFTKYZM4xE7Jtn0-4NIbaVOXJRN0DN-IE-DuNHh6xPVDydKCiCt85nC9TWQa0Ijxrp0kcYZuqYAvEddxq_vlrsPTuvfR-zmOPg86fU4LkTzJ9vM4pThtlE_lICxatASb8O2_duSXHuZX6gxOkJPOuQ',
        borderColorClass: 'crayon-border-red',
        priceColor: 'text-accent-red',
        btnHoverBg: 'bg-accent-red',
        btnHoverText: 'text-white'
    },
    {
        title: 'Wooden Block Set',
        price: '$24',
        condition: 'Like New',
        description: 'Complete set of 50 blocks. Great for building castles.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Gb6q0aM6_Jn46xxTtF07VC8s9kY2NQ55MVDqfqcR1WRTr__E1Yn7eo9jQcEeeve0VrjcNHnPcK4QROkPBXnA07HHOhDf1nPOz9Nxle82uKW0epPYTcm2m-00BAV5tEdC00124Zq4ZuOPAHecaTddJSfaJmBxz86hx4gj8-JAZH7jv6HbOiSRrnaAFA6uVkpwtR7AflAIKr3RfDOHmuYBpZqW2w1rBkY-nVP4iNOvLUyMkjeyfFHg-_lzjHZ7_N7SBhNDoJa66QDP',
        borderColorClass: 'crayon-border-blue',
        priceColor: 'text-accent-blue',
        btnHoverBg: 'bg-accent-blue',
        btnHoverText: 'text-white'
    },
    {
        title: 'Mr. Cuddles Bear',
        price: '$8',
        condition: 'Used - Fair',
        description: 'Looking for a new home. Very soft, just needs a wash.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTd1ik66Od35XTgQfdYh2vHG2rRP2Q_ffVtYApvmOgGQtkw6nmZ7z7ILo1qddTQQgErO0PgC1pMdlsrXdxXunxySlqJ_EecKCrVrGWJWNOis2NDDa6PeSWW71iLhPWGDvXk37DjlyjBCbV4mcsNydgqcVTDlS9J7dmgExOMguko9yflrdbAgG1G3V946vzyua4M2csQSx3mc3raqd74CsYFmz2wi5DlVcoOWP0s06O2PPHkCb5NR70UtK9TeZ7XcFQf5sTkYZ22A5x',
        borderColorClass: 'crayon-border-yellow',
        priceColor: 'text-primary',
        btnHoverBg: 'bg-primary',
        btnHoverText: 'text-content'
    },
    {
        title: 'Artist Starter Kit',
        price: '$30',
        condition: 'New',
        description: 'Never opened. Includes canvas, easel, and acrylics.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2BqY4axIOd2zsQ0sXt702dJjPyc2uW61HdaIrnz7GQWvAE07wwmVEo6ZLgqC3p8oXeX2htk2TvIuMQDOSBmnzh9NDKghVHuaHNQJaHcC8LpJV4oXVe6PaAuMlyyP8GbNXksjIZuyYxbt80zGREEITHsQn0M_GIW160ynsSuSepavdT4JPZr5dznyJIfO0uJ4obBSxNx_LaQeX1X3HII50qoChfxSdyjepE3S7ZNKyREI8hHeP8n4QoV7SUIcPERI_H2yRYtg97aH7',
        borderColorClass: 'crayon-border-purple',
        priceColor: 'text-accent-purple',
        btnHoverBg: 'bg-accent-purple',
        btnHoverText: 'text-white'
    },
    {
        title: 'Wooden Train Set',
        price: '$35',
        condition: 'Eco-Friendly',
        description: 'Handcrafted wooden train tracks and cars.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3_WiTf7aNI-VwTeSLo_PYsjHhnKy7gw2eGgzD5dJZQ-lh4wC20mDz3U-KOYISI_8ub6cVFTrdzLl5XfSDdJYMc8Mw1fX8nEgXISVmrP1jlwZOHnJAdUYFEqDYf8H-7YteMrQBAeQhAdHRGo9TafOHH-n53t1gM4FoC_JOWZiZPGwYgfag0gj6GRl7RzPyay9lIkvBBtH3XBbriNXuFLl6R3cAOXHgKNN3y9jAwXxSmSSf1jJqJlcVwGN7Ge1MaW8jZfYs9MojLhJ',
        borderColorClass: 'crayon-border-red',
        priceColor: 'text-accent-red',
        btnHoverBg: 'bg-accent-red',
        btnHoverText: 'text-white'
    },
    {
        title: 'Fairytale Books',
        price: '$12',
        condition: 'Used - Good',
        description: 'A bundle of 5 classic fairy tales.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxUejY0vrl4waXLAgo2bU5Xw_V87eSMRU1-rOaX19ZKbRkYS0E8gSmK7G7P-IFsmLdNWehS3SzNyMF5TYjVnn642j4jdbPe6pWm_hWxDqzTltmojLCPiGoC0c21GCOPJ1fch4ie-S7ril77_VC3xjA6O5v_aSD3c6bbJ0CqTCch6279auSeSg4cJtsJkEayDinAl_Zp2exyAlTjWjeJrK0NW_TV78E3AkO2j-D5gXjno7AZQ3V4hRghWNaW8HXpf4Z5-X9SPFyU0sX',
        borderColorClass: 'crayon-border-blue',
        priceColor: 'text-accent-blue',
        btnHoverBg: 'bg-accent-blue',
        btnHoverText: 'text-white'
    },
    {
        title: 'Jumbo Crayons',
        price: '$5',
        condition: 'New',
        description: 'Perfect for little hands. Non-toxic.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOuEux1DzY6kkMgDKonfJek5YrfDQQBCVAOgqa6ko6Lv85s9R_eFFORYv2Xf3FsEyvm9qiTTxOLQTGhluRN-kcfUqewg5mPszp4d4tCds__8pbWALXarA3jtfQIcabnvOLekXyU1draQAUdPdI8UGKDH2P_UaNWmyd0AVnrsTWnRWG_iocrQ75r3yPZLNqE6vbVptKsEVMSidSkH3ge7GQNnwCIk6a3s4pkAR0amdxSibwoPRTKLk15NHYXxtqcfJAHeQeh3aSo5t9',
        borderColorClass: 'crayon-border-yellow',
        priceColor: 'text-primary',
        btnHoverBg: 'bg-primary',
        btnHoverText: 'text-content'
    },
    {
        title: 'Balance Bike',
        price: '$45',
        condition: 'Like New',
        description: 'Pink balance bike, barely used.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm_0Jrc4QWr8d2Bq8P8NlM447bTUv283oFkTV0-1h0xcyhTJq74Dn6L5JGtdN_2Z_m902OflQV3okqJun6YRKw1OczkAHKM2-N5K2LfLcyEWQEJHppbYSp3kk74RP7nvoxB1yZkbaOEEayzN-ZBrhzrJG_m_Uy-Y6Hg9CBdp-WwkVgUfzPNA83_ytbXuDPe0Ag5y5OYFaJGfW0qFaWS0SgkGIjrdTprTEKfJADULXPGgT3aZqI4JlOaWrEfNiFaWdBkyGvTlWYSUxj',
        borderColorClass: 'crayon-border-purple',
        priceColor: 'text-accent-purple',
        btnHoverBg: 'bg-accent-purple',
        btnHoverText: 'text-white'
    },
    {
        title: 'Space Hero Figure',
        price: '$9',
        condition: 'Used - Good',
        description: 'Collectible action figure with accessories.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-IUksa_Fgd10eYfqsupViyzTHJrOmeg5l1E6zse0AAdee-u6cOrXnfSwirZ9kqM1m3Ta9yX4bR1BnNZNN_-mS5j4BFRCvZeGW-SOex9b0K9PTWIOtSdGY23TnOZaRb4M9eUmed4bvsWxHG3nWBTwRrGBg6_n_H1asqSu_WahUYcJcMbmS2NCwfTvvyBPFmoZ_As2kqtv9KaoQOn-p4UVhH5AGcD3rjW_IEREsozH5HodN7qHGlu7lSMWoGi1KY2SWP1u5U9-6RKcF',
        borderColorClass: 'crayon-border-red',
        priceColor: 'text-accent-red',
        btnHoverBg: 'bg-accent-red',
        btnHoverText: 'text-white'
    }
])

const { data } = await useFetch('http://localhost:8080/products');
console.log(data.value);



// 排序邏輯
const sortedProducts = computed(() => {
    const sorted = [...products.value]
    if (sortBy.value === 'price-low') {
        return sorted.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')))
    } else if (sortBy.value === 'price-high') {
        return sorted.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')))
    }
    return sorted // newest (default order)
})
</script>
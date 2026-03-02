<template>
    <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-black text-content mb-8 relative inline-block group">
            <span class="relative z-10">{{ $t('seller.dashboard_title') }}</span>
            <span class="absolute bottom-1 left-0 w-full h-3 bg-primary/30 -z-0"></span>
        </h1>

        <div v-show="loading" class="flex justify-center my-12">
            <Icon name="svg-spinners:180-ring" class="text-4xl text-primary" />
        </div>

        <div v-if="!loading && dashboardData" class="space-y-8">
            <!-- 營收與銷售數概要 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-2xl border-2 border-content p-6 shadow-stitch space-y-2">
                    <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">{{
                        $t('seller.dashboard_monthly_revenue') }}</p>
                    <p class="text-4xl font-black text-accent-purple">${{ dashboardData.monthlyRevenue }}</p>
                </div>
                <div class="bg-white rounded-2xl border-2 border-content p-6 shadow-stitch space-y-2">
                    <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">本月銷售訂單數</p>
                    <p class="text-4xl font-black text-accent-blue">{{ dashboardData.currentMonthSales }} 件</p>
                </div>
            </div>

            <!-- 熱銷商品與庫存警示 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 熱銷商品 -->
                <div
                    class="bg-white rounded-2xl border-2 border-content p-6 shadow-[4px_4px_0px_#1c180d] flex flex-col h-full">
                    <h2 class="text-xl font-bold border-b-2 border-content pb-4 flex items-center gap-2">
                        <Icon name="material-symbols:local-fire-department" class="text-accent-red" />
                        {{ $t('seller.dashboard_top_5') }}
                    </h2>
                    <div class="mt-4 flex flex-col gap-4 flex-grow">
                        <div v-if="dashboardData.topProducts.length === 0" class="text-gray-500 text-center py-8">
                            {{ $t('seller.dashboard_no_data') }}
                        </div>
                        <div v-for="(product, index) in dashboardData.topProducts" :key="product.productId"
                            class="flex items-center gap-4 p-3 border border-content/10 rounded-xl hover:bg-gray-50 transition-colors">
                            <div class="text-2xl font-black text-content w-8 text-center shrink-0"
                                :class="Number(index) < 3 ? 'text-accent-red' : 'text-gray-400'">
                                {{ Number(index) + 1 }}
                            </div>
                            <NuxtImg :src="product.productImage || 'https://via.placeholder.com/80?text=No+Image'"
                                alt="Product"
                                class="w-16 h-16 object-cover rounded-lg border border-content/20 bg-gray-100"
                                loading="lazy" format="webp" />
                            <div class="flex-grow overflow-hidden">
                                <p class="font-bold text-content text-lg truncate">{{ product.productName }}</p>
                            </div>
                            <div class="text-right shrink-0">
                                <p class="text-2xl font-black text-accent-blue">{{ product.totalSold }}</p>
                                <p class="text-xs text-gray-400">{{ $t('seller.dashboard_total_sold') }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 庫存警示 -->
                <div
                    class="bg-white rounded-2xl border-2 border-content p-6 shadow-[4px_4px_0px_#1c180d] flex flex-col h-full">
                    <h2 class="text-xl font-bold border-b-2 border-content pb-4 flex items-center gap-2">
                        <Icon name="material-symbols:warning" class="text-accent-orange" />
                        庫存不足警示 (&lt; 10)
                    </h2>
                    <div class="mt-4 flex flex-col gap-4 flex-grow overflow-y-auto max-h-[400px]">
                        <div v-if="dashboardData.lowStockAlerts.length === 0"
                            class="text-green-600 text-center py-8 font-bold flex items-center justify-center gap-1">
                            <Icon name="material-symbols:check-circle" />
                            {{ $t('seller.dashboard_stock_healthy') }}
                        </div>
                        <div v-for="product in dashboardData.lowStockAlerts" :key="product.productId"
                            class="flex items-center gap-4 p-3 border border-content/10 rounded-xl hover:bg-red-50/50 transition-colors">
                            <NuxtImg :src="product.productImage || 'https://via.placeholder.com/80?text=No+Image'"
                                alt="Product"
                                class="w-16 h-16 object-cover rounded-lg border border-content/20 bg-gray-100"
                                loading="lazy" format="webp" />
                            <div class="flex-grow overflow-hidden">
                                <p class="font-bold text-content truncate">{{ product.productName }}</p>
                            </div>
                            <div class="text-right shrink-0">
                                <div
                                    class="bg-accent-red/10 text-accent-red px-3 py-1 rounded-full border border-accent-red/20 font-bold">
                                    {{ $t('seller.dashboard_stock_remaining', { count: product.stock }) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue';

const { t } = useI18n()
useHead({ title: computed(() => t('seller.dashboard_title')) })

const ordersApi = useOrdersApi();
interface DashboardTopProduct {
    productId: string | number
    productName: string
    productImage?: string
    totalSold: number
}

interface DashboardLowStockItem {
    productId: string | number
    productName: string
    productImage?: string
    stock: number
}

interface DashboardData {
    monthlyRevenue: number
    currentMonthSales: number
    topProducts: DashboardTopProduct[]
    lowStockAlerts: DashboardLowStockItem[]
}

const loading = shallowRef(true);
const dashboardData = ref<DashboardData | null>(null);

onMounted(async () => {
    try {
        const res = await ordersApi.getSellerDashboard() as DashboardData;
        dashboardData.value = res;
    } catch (e) {
        console.error('Failed to load dashboard data:', e);
    } finally {
        loading.value = false;
    }
});
</script>

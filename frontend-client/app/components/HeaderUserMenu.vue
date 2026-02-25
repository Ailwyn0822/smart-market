<template>
    <div class="relative" ref="menuContainer">
        <!-- 非登入狀態顯示預設頭像與登入連結 -->
        <div v-if="!authStore.isAuthenticated" @click="toggleMenu"
            class="flex items-center cursor-pointer p-1 rounded-full border-2 border-transparent hover:border-content transition-all bg-white shadow-sm">
            <div
                class="size-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 overflow-hidden">
                <Icon name="material-symbols:person" class="text-gray-400 text-xl" />
            </div>
        </div>

        <div class="flex items-center gap-2">
            <!-- 鈴鐺通知 (已登入狀態下顯示) -->
            <div v-if="authStore.isAuthenticated"
                class="relative cursor-pointer flex items-center justify-center size-10 rounded-full border-2 border-transparent hover:bg-gray-100 transition-colors"
                @click="toggleNotificationMenu">
                <Icon name="material-symbols:notifications-outline" class="text-2xl text-content" />
                <div v-if="unreadCount > 0"
                    class="absolute top-1 right-1 size-4 bg-accent-red rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
                    {{ unreadCount > 9 ? '9+' : unreadCount }}
                </div>

                <!-- 鈴鐺下拉菜單 -->
                <Transition enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                    <div v-if="isNotificationOpen" @click.stop
                        class="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl border-2 border-content z-[60] flex flex-col">
                        <div
                            class="p-3 border-b-2 border-content/10 flex justify-between items-center sticky top-0 bg-white z-10">
                            <span class="font-bold text-content text-sm">{{ $t('menu.notifications') }}</span>
                            <button v-if="unreadCount > 0" @click.stop="markAllAsRead"
                                class="text-xs text-accent-blue hover:underline">{{ $t('menu.mark_all_read') }}</button>
                        </div>
                        <div v-if="notifications.length === 0" class="p-6 text-center text-sm text-gray-500">
                            {{ $t('menu.no_notifications') }}
                        </div>
                        <div v-else class="flex flex-col">
                            <div v-for="notif in notifications" :key="notif.id"
                                class="p-3 border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-1 cursor-pointer"
                                :class="{ 'opacity-60': notif.isRead }" @click="handleNotificationClick(notif)">
                                <div class="flex items-start justify-between gap-2">
                                    <span class="text-sm text-content leading-snug break-words"
                                        :class="{ 'font-bold': !notif.isRead }">{{ notif.message }}</span>
                                    <div v-if="!notif.isRead" class="size-2 bg-accent-blue rounded-full shrink-0 mt-1">
                                    </div>
                                </div>
                                <span class="text-xs text-gray-400">{{ formatNotifTime(notif.createdAt) }}</span>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- 已登入狀態下顯示使用者頭像與名稱 -->
            <div v-if="authStore.isAuthenticated" @click="toggleMenu"
                class="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full border-2 border-content bg-[#f4c025] hover:bg-[#eab308] transition-all shadow-[2px_2px_0px_#1c180d] active:shadow-none active:translate-y-0.5">
                <div
                    class="size-8 rounded-full bg-white flex items-center justify-center border-2 border-content overflow-hidden">
                    <NuxtImg v-if="userAvatar" :src="userAvatar" alt="User Avatar" class="w-full h-full object-cover" />
                    <Icon v-else name="material-symbols:person" class="text-gray-400 text-xl" />
                </div>
                <span class="text-sm font-bold text-content max-w-[80px] truncate">
                    {{ userName }}
                </span>
                <Icon name="material-symbols:keyboard-arrow-down" class="text-content"
                    :class="{ 'rotate-180': isOpen }" />
            </div>
        </div>

        <!-- 下拉選單 -->
        <Transition enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isOpen"
                class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-content overflow-hidden z-50 flex flex-col">

                <!-- 帳戶資訊 (已登入) -->
                <div v-if="authStore.isAuthenticated"
                    class="p-4 border-b-2 border-content/10 bg-gray-50 flex items-center gap-3">
                    <div
                        class="size-10 rounded-full bg-white flex items-center justify-center border-2 border-content overflow-hidden shrink-0">
                        <NuxtImg v-if="userAvatar" :src="userAvatar" alt="User Avatar"
                            class="w-full h-full object-cover" />
                        <Icon v-else name="material-symbols:person" class="text-gray-400 text-2xl" />
                    </div>
                    <div class="flex flex-col overflow-hidden">
                        <span class="text-sm font-bold text-content truncate">{{ userName }}</span>
                        <span class="text-xs text-gray-500 truncate" v-if="userEmail">{{ userEmail }}</span>
                    </div>
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <template v-if="authStore.isAuthenticated">
                        <!-- 個人設定 -->
                        <div class="py-1">
                            <button @click="handleAction('/profile')"
                                class="w-full text-left px-3 py-2 text-sm font-bold text-content hover:bg-gray-100 rounded-xl flex items-center gap-3 transition-colors">
                                <Icon name="material-symbols:manage-accounts-outline" class="text-lg" />
                                {{ $t('menu.profile_settings') }}
                            </button>
                        </div>
                        <div class="h-px bg-gray-100 my-1 mx-2"></div>

                        <!-- 買家中心 -->
                        <div class="py-1">
                            <div
                                class="px-3 py-1 flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <Icon name="material-symbols:shopping-bag-outline" class="text-base" />
                                {{ $t('menu.buyer_center') }}
                            </div>
                            <button @click="handleAction('/cart')"
                                class="w-full text-left px-3 py-2 text-sm font-bold text-content hover:bg-accent-blue/10 hover:text-accent-blue rounded-xl flex items-center gap-3 transition-colors">
                                <Icon name="material-symbols:shopping-cart" class="text-lg" />
                                {{ $t('nav.cart') }}
                            </button>

                            <button @click="handleAction('/buy_order')"
                                class="w-full text-left px-3 py-2 text-sm font-bold text-content hover:bg-accent-purple/10 hover:text-accent-purple rounded-xl flex items-center gap-3 transition-colors">
                                <Icon name="material-symbols:package-2" class="text-lg" />
                                {{ $t('buy_order.title') }}
                            </button>

                            <button @click="handleAction('/favorite')"
                                class="w-full text-left px-3 py-2 text-sm font-bold text-content hover:bg-accent-red/10 hover:text-accent-red rounded-xl flex items-center gap-3 transition-colors">
                                <Icon name="material-symbols:favorite-outline" class="text-lg" />
                                {{ $t('menu.favorites') }}
                            </button>
                        </div>

                        <div class="h-px bg-gray-100 my-1 mx-2"></div>

                        <!-- 賣家中心 -->
                        <div class="py-1">
                            <div
                                class="px-3 py-1 flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <Icon name="material-symbols:storefront-outline" class="text-base" />
                                {{ $t('menu.seller_center') }}
                            </div>
                            <button @click="handleAction('/seller/dashboard')"
                                class="w-full text-left px-3 py-2 text-sm font-bold text-content hover:bg-accent-blue/10 hover:text-accent-blue rounded-xl flex items-center gap-3 transition-colors">
                                <Icon name="material-symbols:insert-chart-outline" class="text-lg" />
                                {{ $t('menu.seller_dashboard') }}
                            </button>

                            <button @click="handleAction('/sell_order')"
                                class="w-full text-left px-3 py-2 text-sm font-bold text-content hover:bg-primary/10 hover:text-yellow-600 rounded-xl flex items-center gap-3 transition-colors">
                                <Icon name="material-symbols:list-alt" class="text-lg" />
                                {{ $t('menu.sales_orders') }}
                            </button>

                            <button @click="handleAction('/commodity')"
                                class="w-full text-left px-3 py-2 text-sm font-bold text-content hover:bg-accent-blue/10 hover:text-accent-blue rounded-xl flex items-center gap-3 transition-colors">
                                <Icon name="material-symbols:folder-open" class="text-lg" />
                                {{ $t('menu.my_products') }}
                            </button>
                        </div>

                        <div class="h-px bg-gray-100 my-1 mx-2"></div>
                    </template>

                    <!-- 登入/登出按鈕 -->
                    <button v-if="!authStore.isAuthenticated" @click="handleAction('/login')"
                        class="w-full text-left px-3 py-2 text-sm font-bold text-accent-blue hover:bg-accent-blue/10 rounded-xl flex items-center gap-3 transition-colors">
                        <Icon name="material-symbols:login" class="text-lg" />
                        {{ $t('auth.login') }}
                    </button>

                    <button v-else @click="handleLogout"
                        class="w-full text-left px-3 py-2 text-sm font-bold text-accent-red hover:bg-accent-red/10 rounded-xl flex items-center gap-3 transition-colors">
                        <Icon name="material-symbols:logout" class="text-lg" />
                        {{ $t('auth.logout') }}
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRuntimeConfig } from '#app';
import { ref, computed, shallowRef, onMounted, onUnmounted, watch, useTemplateRef } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';

dayjs.extend(relativeTime);
dayjs.locale('zh-tw');

const config = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();
useI18n();

const isOpen = shallowRef(false);
const menuContainer = useTemplateRef<HTMLElement>('menuContainer');

const userAvatar = computed(() => authStore.user?.picture || authStore.user?.avatar || null);
const userName = computed(() => authStore.user?.name || authStore.user?.username || 'User');
const userEmail = computed(() => authStore.user?.email || null);

const unreadCount = shallowRef(0);
const notifications = ref<any[]>([]);
const isNotificationOpen = shallowRef(false);
let sseSource: EventSource | null = null;

function toggleMenu() {
    isOpen.value = !isOpen.value;
    if (isOpen.value) isNotificationOpen.value = false;
}

function toggleNotificationMenu() {
    isNotificationOpen.value = !isNotificationOpen.value;
    if (isNotificationOpen.value) isOpen.value = false;
}

function closeMenu() {
    isOpen.value = false;
    isNotificationOpen.value = false;
}

function handleAction(path: string) {
    closeMenu();
    router.push(path);
}

function handleLogout() {
    closeMenu();
    authStore.logout();
}

async function fetchNotifications() {
    if (!authStore.isAuthenticated) return;
    try {
        const res = await $fetch<any>(`${config.public.apiBase}/notifications`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        notifications.value = res.items || [];
        unreadCount.value = res.unreadCount || 0;
    } catch (e) {
        console.error('Failed to fetch notifications', e);
    }
}

async function markAllAsRead() {
    try {
        await $fetch(`${config.public.apiBase}/notifications/read`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        notifications.value.forEach(n => n.isRead = true);
        unreadCount.value = 0;
    } catch (e) {
        console.error('Failed to mark as read', e);
    }
}

function handleNotificationClick(notif: any) {
    // 這裡通常會發送已讀請求
    closeMenu();
    if (notif.type === 'order_update' && notif.referenceId) {
        router.push(`/buy_order/${notif.referenceId}`);
    } else if (notif.type === 'new_review') {
        router.push(`/sell_order`);
    } else {
        router.push(`/`);
    }
}

function setupSSE() {
    if (!authStore.user?.id) return;
    if (sseSource) sseSource.close();

    const url = `${config.public.apiBase}/notifications/stream?userId=${authStore.user.id}`;
    sseSource = new EventSource(url);

    sseSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            notifications.value.unshift(data);
            unreadCount.value++;
        } catch (e) {
            console.error('Error parsing SSE data', e);
        }
    };

    sseSource.onerror = () => {
        // 若連線已關閉（CLOSED=2），3 秒後自動重連
        // 不呼叫 close()，讓瀏覽器內建重連機制先嘗試
        if (sseSource?.readyState === EventSource.CLOSED) {
            setTimeout(() => setupSSE(), 3000);
        }
    };
}

function formatNotifTime(date: string) {
    return dayjs(date).fromNow();
}

const handleClickOutside = (event: MouseEvent) => {
    if (menuContainer.value && !menuContainer.value.contains(event.target as Node)) {
        closeMenu();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    if (authStore.isAuthenticated) {
        fetchNotifications();
        setupSSE();
    }
});

watch(() => authStore.isAuthenticated, (newVal) => {
    if (newVal) {
        fetchNotifications();
        setupSSE();
    } else {
        if (sseSource) sseSource.close();
        notifications.value = [];
        unreadCount.value = 0;
    }
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (sseSource) sseSource.close();
});
</script>

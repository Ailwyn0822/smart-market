<template>
    <div v-if="authStore.isAuthenticated" class="fixed bottom-6 right-6 z-[100] font-sans">

        <!-- 聊天按鈕 (縮小狀態) -->
        <button v-if="!chatStore.isOpen" @click="chatStore.openChat()"
            class="relative w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center border-4 border-content shadow-[4px_4px_0px_#1c180d] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1c180d] transition-all duration-300">
            <Icon name="material-symbols:chat-bubble-outline-rounded" class="text-3xl text-white" />

            <!-- 未讀徽章 -->
            <div v-if="chatStore.totalUnread > 0"
                class="absolute -top-2 -right-2 bg-accent-red text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-content shadow-sm">
                {{ chatStore.totalUnread }}
            </div>
        </button>

        <!-- 聊天視窗 (展開狀態) -->
        <div v-else
            class="w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl border-4 border-content shadow-[8px_8px_0px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden transform origin-bottom-right transition-all">

            <!-- 頭部 -->
            <div class="h-14 bg-accent-blue border-b-4 border-content flex items-center justify-between px-4 shrink-0">
                <div class="flex items-center gap-2">
                    <!-- 返回列表按鈕 -->
                    <button v-if="chatStore.activeContactId" @click="chatStore.backToList()"
                        class="text-white hover:text-white/80 transition-colors">
                        <Icon name="material-symbols:arrow-back-ios-new" class="text-xl" />
                    </button>
                    <Icon v-else name="material-symbols:forum" class="text-white text-2xl" />

                    <span class="font-black text-white">
                        <template v-if="chatStore.activeContactId">
                            {{ activeContactName }}
                        </template>
                        <template v-else>
                            {{ $t('chat.messages') }}
                        </template>
                    </span>
                </div>

                <button @click="chatStore.closeChat()" class="text-white hover:text-white/80 transition-colors">
                    <Icon name="material-symbols:close" class="text-2xl" />
                </button>
            </div>

            <!-- 內容區 -->
            <div class="flex-1 overflow-hidden relative bg-[#f9f9f9]">
                <!-- 背景裝飾 -->
                <div class="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style="background-image: repeating-linear-gradient(transparent, transparent 23px, #000 23px, #000 24px);">
                </div>

                <!-- 聯絡人列表 -->
                <div v-if="!chatStore.activeContactId" class="h-full flex flex-col relative z-10">
                    <!-- 搜尋框 -->
                    <div class="p-3 border-b-2 border-content/10 shrink-0">
                        <div class="relative">
                            <Icon name="material-symbols:search"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input v-model="searchQuery" @input="onSearchInput" type="text"
                                :placeholder="$t('chat.search_placeholder')"
                                class="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-dashed border-gray-300 focus:border-content bg-gray-50 text-sm font-bold outline-none transition-all" />
                        </div>
                    </div>

                    <!-- 搜尋結果 -->
                    <div v-if="searchQuery.trim() && searchResults.length > 0"
                        class="overflow-y-auto flex-1 p-3 space-y-2">
                        <p class="text-xs font-bold text-gray-400 px-1 mb-2">{{ $t('chat.search_results') }}</p>
                        <div v-for="user in searchResults" :key="user.id" @click="startChatWith(user)"
                            class="bg-white p-3 rounded-2xl border-2 border-dashed border-gray-300 hover:border-content hover:shadow-stitch-sm transition-all cursor-pointer flex items-center gap-3">
                            <NuxtImg
                                :src="user.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + user.username"
                                class="w-10 h-10 rounded-full border-2 border-content bg-gray-100 object-cover shrink-0"
                                loading="lazy" format="webp" />
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-content text-sm truncate">{{ user.name || user.username }}
                                </h4>
                                <p class="text-xs text-gray-400 truncate">@{{ user.username }}</p>
                            </div>
                            <Icon name="material-symbols:chat-bubble-outline"
                                class="text-accent-blue text-lg shrink-0" />
                        </div>
                    </div>

                    <!-- 搜尋中但無結果 -->
                    <div v-else-if="searchQuery.trim() && !isSearching && searchResults.length === 0"
                        class="flex flex-col items-center justify-center flex-1 gap-2 text-gray-400 p-4">
                        <Icon name="material-symbols:person-search" class="text-4xl" />
                        <span class="font-bold text-sm">{{ $t('chat.no_user_found') }}</span>
                    </div>

                    <!-- 歷史聊天列表 -->
                    <div v-else class="overflow-y-auto flex-1 p-3 space-y-2">
                        <div v-if="chatStore.contacts.length === 0"
                            class="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                            <Icon name="material-symbols:speaker-notes-off-outline" class="text-5xl" />
                            <span class="font-bold">{{ $t('chat.no_messages') }}</span>
                            <p class="text-xs text-center">{{ $t('chat.search_to_start') }}</p>
                        </div>

                        <div v-for="contact in chatStore.contacts" :key="contact.id"
                            @click="chatStore.openChat(contact)"
                            class="bg-white p-3 rounded-2xl border-2 border-dashed border-gray-300 hover:border-content hover:shadow-stitch-sm transition-all cursor-pointer flex items-center gap-3 relative">
                            <NuxtImg
                                :src="contact.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + contact.name"
                                class="w-12 h-12 rounded-full border-2 border-content bg-gray-100 object-cover shrink-0"
                                loading="lazy" format="webp" />
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-content text-sm truncate">{{ contact.name }}</h4>
                                <p class="text-xs text-gray-500 truncate mt-0.5">{{ contact.lastMessage ||
                                    $t('chat.click_to_start')
                                    }}</p>
                            </div>
                            <span v-if="contact.unreadCount"
                                class="bg-accent-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {{ contact.unreadCount }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 對話視窗 -->
                <div v-else class="h-full flex flex-col relative z-10">
                    <!-- 訊息列表 -->
                    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
                        <div v-if="chatStore.currentMessages.length === 0"
                            class="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                            <Icon name="material-symbols:waving-hand-outline" class="text-4xl" />
                            <span class="text-sm font-bold">{{ $t('chat.say_hi') }}</span>
                        </div>

                        <div v-for="msg in chatStore.currentMessages" :key="msg.id" class="flex flex-col"
                            :class="msg.senderId === authStore.user?.id ? 'items-end' : 'items-start'">

                            <!-- 訊息氣泡 -->
                            <div class="max-w-[75%] px-4 py-2.5 rounded-2xl border-2 border-content relative"
                                :class="msg.senderId === authStore.user?.id ? 'bg-primary rounded-tr-sm shadow-[2px_2px_0px_#1c180d]' : 'bg-white rounded-tl-sm shadow-[-2px_2px_0px_#1c180d]'">
                                <p class="text-sm font-bold text-content whitespace-pre-wrap word-break">{{ msg.content
                                    }}</p>
                            </div>
                            <!-- 顯示時間 -->
                            <span class="text-[10px] text-gray-400 mt-1 mx-1 font-bold">{{ formatTime(msg.createdAt)
                                }}</span>
                        </div>
                    </div>

                    <!-- 輸入區 -->
                    <div class="p-3 bg-white border-t-2 border-content flex gap-2 shrink-0">
                        <input v-model="inputText" @keyup.enter="send" type="text"
                            :placeholder="$t('chat.type_message')"
                            class="flex-1 bg-gray-100 border-2 border-transparent focus:border-content focus:bg-white rounded-xl px-4 py-2 text-sm font-bold outline-none transition-all" />
                        <button @click="send"
                            class="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center border-2 border-content text-white hover:bg-blue-600 active:translate-y-0.5 transition-all">
                            <Icon name="material-symbols:send-rounded" class="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useChatStore } from '~/stores/chat'
import { ref, watch, computed, nextTick, onUnmounted, useTemplateRef } from 'vue'

const authStore = useAuthStore()
const chatStore = useChatStore()
const config = useRuntimeConfig()
const inputText = ref('')
const messagesContainer = useTemplateRef<HTMLElement>('messagesContainer')

// 搜尋使用者
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput() {
    if (searchTimer) clearTimeout(searchTimer)
    const q = searchQuery.value.trim()
    if (!q) {
        searchResults.value = []
        return
    }
    isSearching.value = true
    searchTimer = setTimeout(async () => {
        try {
            const data = await $fetch<any[]>(`${config.public.apiBase}/users/search`, {
                query: { q },
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            searchResults.value = (data || []).filter((u: any) => u.id !== authStore.user?.id)
        } catch {
            searchResults.value = []
        } finally {
            isSearching.value = false
        }
    }, 400)
}

function startChatWith(user: any) {
    searchQuery.value = ''
    searchResults.value = []
    chatStore.openChat({ id: user.id, name: user.name || user.username, avatar: user.avatar })
}

// 監聽登入狀態以連接 Socket
watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
        chatStore.connect()
    } else {
        chatStore.disconnect()
        chatStore.closeChat()
    }
}, { immediate: true })

// 用 Web Audio API 合成一個簡單的通知音
function playNotificationSound() {
    try {
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.2, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.4)
    } catch { /* 瀏覽器不支援或使用者未互動則忽略 */ }
}

// 未讀數增加時：播音效 + 更新 tab 標題
const originalTitle = import.meta.client ? document.title : 'Smart Market'
watch(() => chatStore.totalUnread, (newVal, oldVal) => {
    if (!import.meta.client) return
    if (newVal > oldVal && !chatStore.isOpen) {
        playNotificationSound()
    }
    document.title = newVal > 0 ? `(${newVal}) ${originalTitle}` : originalTitle
})

// 滾動到底部
watch(() => chatStore.currentMessages, async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}, { deep: true })

const activeContactName = computed(() => {
    const contact = chatStore.contacts.find(c => c.id === chatStore.activeContactId)
    return contact ? contact.name : '對話'
})

function send() {
    const text = inputText.value.trim()
    if (!text || !chatStore.activeContactId) return

    chatStore.sendMessage(chatStore.activeContactId, text)
    inputText.value = ''
}

function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onUnmounted(() => {
    chatStore.disconnect()
})
</script>

<style scoped>
.word-break {
    word-break: break-word;
}
</style>

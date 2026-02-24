import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { useAuthStore } from './auth'
import { useRuntimeConfig } from '#imports'
import { io, Socket } from 'socket.io-client'
import { useToast } from '#imports'

export interface ChatContact {
    id: string
    name: string
    avatar: string
    lastMessage?: string
    unreadCount?: number
}

export interface ChatMessage {
    id: number
    content: string
    senderId: string
    receiverId: string
    createdAt: string
    isRead: boolean
}

export const useChatStore = defineStore('chat', () => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    const socket = ref<Socket | null>(null)
    const isConnected = shallowRef(false)
    const isOpen = shallowRef(false)
    const activeContactId = shallowRef<string | null>(null)

    const contacts = ref<ChatContact[]>([])
    // key: contactId, value: messages
    const messages = ref<Record<string, ChatMessage[]>>({})

    function connect() {
        if (!authStore.user?.id) return
        if (socket.value) return

        // 建立連線 (Socket.io 接受 http URL)
        socket.value = io(`${config.public.apiBase}/chat`, {
            query: { userId: authStore.user.id }
        })

        socket.value.on('connect', () => {
            isConnected.value = true
        })

        socket.value.on('disconnect', () => {
            isConnected.value = false
        })

        socket.value.on('newMessage', (msg: ChatMessage) => {
            const otherUser = msg.senderId === authStore.user?.id ? msg.receiverId : msg.senderId

            if (!messages.value[otherUser]) {
                messages.value[otherUser] = []
            }
            messages.value[otherUser].push(msg)

            // 如果聯絡人不存在，可以考慮重新拉取 contacts，這裡簡單處理
            const contact = contacts.value.find(c => c.id === otherUser)
            if (contact) {
                contact.lastMessage = msg.content
                if (activeContactId.value !== otherUser) {
                    contact.unreadCount = (contact.unreadCount || 0) + 1
                }
            } else {
                fetchContacts()
            }
        })
    }

    function disconnect() {
        if (socket.value) {
            socket.value.disconnect()
            socket.value = null
        }
        isConnected.value = false
    }

    async function fetchContacts() {
        if (!authStore.isAuthenticated) return
        try {
            const data = await $fetch<ChatContact[]>(`${config.public.apiBase}/chat/contacts`, {
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            contacts.value = data
        } catch (e) {
            console.error('Failed to fetch contacts', e)
        }
    }

    async function fetchHistory(targetId: string) {
        if (!authStore.isAuthenticated) return
        try {
            const data = await $fetch<ChatMessage[]>(`${config.public.apiBase}/chat/history/${targetId}`, {
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            messages.value[targetId] = data

            // 清除未讀
            const contact = contacts.value.find(c => c.id === targetId)
            if (contact) contact.unreadCount = 0
        } catch (e) {
            console.error('Failed to fetch history', e)
        }
    }

    function sendMessage(targetId: string, content: string) {
        if (!socket.value || !isConnected.value) {
            useToast().error('WebSocket 未連線')
            return
        }
        socket.value.emit('sendMessage', { receiverId: targetId, content })
    }

    function openChat(targetUser?: Partial<ChatContact>) {
        isOpen.value = true
        if (targetUser && targetUser.id) {
            activeContactId.value = targetUser.id
            fetchHistory(targetUser.id)

            // 如果聯絡人列表沒有他，塞個暫時的進去
            if (!contacts.value.find(c => c.id === targetUser.id)) {
                contacts.value.unshift({
                    id: targetUser.id as string,
                    name: targetUser.name || 'Unknown',
                    avatar: targetUser.avatar || '',
                })
            }
        } else if (contacts.value.length === 0) {
            fetchContacts()
        }
    }

    function closeChat() {
        isOpen.value = false
    }

    function backToList() {
        activeContactId.value = null
        fetchContacts()
    }

    const currentMessages = computed(() => {
        if (!activeContactId.value) return []
        return messages.value[activeContactId.value] || []
    })

    const totalUnread = computed(() => {
        return contacts.value.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
    })

    return {
        isConnected,
        isOpen,
        activeContactId,
        contacts,
        currentMessages,
        totalUnread,
        connect,
        disconnect,
        fetchContacts,
        fetchHistory,
        sendMessage,
        openChat,
        closeChat,
        backToList,
    }
})

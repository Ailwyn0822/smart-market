<template>
    <ClientOnly>
        <div class="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
            <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
                <div v-for="toast in toasts" :key="toast.id" :class="[
                    'pointer-events-auto flex items-center gap-3 p-4 rounded-xl border-4 shadow-stitch bg-white transform transition-all',
                    getTypeStyles(toast.type)
                ]">
                    <!-- Icon -->
                    <div class="flex-shrink-0 flex items-center justify-center">
                        <Icon :name="getIconName(toast.type)" class="text-3xl" />
                    </div>

                    <!-- Message -->
                    <div class="flex-grow">
                        <p class="font-bold text-sm sm:text-base leading-snug">{{ toast.message }}</p>
                    </div>

                    <!-- Close Button -->
                    <button @click="removeToast(toast.id)"
                        class="flex-shrink-0 hover:bg-black/10 rounded-full p-1 transition-colors">
                        <Icon name="material-symbols:close" class="text-xl" />
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </ClientOnly>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const getTypeStyles = (type: ToastType) => {
    switch (type) {
        case 'success':
            return 'border-accent-line text-content bg-paper-green'
        case 'error':
            return 'border-accent-red text-content bg-paper-pink'
        case 'warning':
            return 'border-primary text-content bg-paper-yellow'
        case 'info':
        default:
            return 'border-accent-blue text-content bg-paper-blue'
    }
}

const getIconName = (type: ToastType) => {
    switch (type) {
        case 'success':
            return 'material-symbols:check-circle'
        case 'error':
            return 'material-symbols:error'
        case 'warning':
            return 'material-symbols:warning'
        case 'info':
        default:
            return 'material-symbols:info'
    }
}
</script>

<style scoped>
/* 進入動畫 */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100px) scale(0.8) rotate(5deg);
}

.toast-enter-to {
    opacity: 1;
    transform: translateX(0) scale(1) rotate(0deg);
}

/* 離開動畫 */
.toast-leave-from {
    opacity: 1;
    transform: translateX(0) scale(1) rotate(0deg);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100px) scale(0.8) rotate(-5deg);
}

/* 列表移動時的正滑過渡 */
.toast-move {
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>

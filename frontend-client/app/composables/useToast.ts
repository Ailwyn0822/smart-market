
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

export function useToast() {
    // 使用 useState 確�?跨�?件�? SSR ?��??��?�?
    const toasts = useState<Toast[]>('app_toasts', () => [])

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = {
            ...toast,
            id,
            duration: toast.duration ?? 3000
        }

        toasts.value.push(newToast)

        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, newToast.duration)
        }
    }

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const success = (message: string, duration?: number) => addToast({ message, type: 'success', duration })
    const error = (message: string, duration?: number) => addToast({ message, type: 'error', duration })
    const info = (message: string, duration?: number) => addToast({ message, type: 'info', duration })
    const warning = (message: string, duration?: number) => addToast({ message, type: 'warning', duration })

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning
    }
}

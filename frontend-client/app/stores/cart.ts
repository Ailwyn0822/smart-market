import { defineStore } from 'pinia'
import type { ApiProduct } from '~/types'

export interface CartItem {
    product: ApiProduct
    quantity: number
}

export const useCartStore = defineStore('cart', () => {
    // ?�試�?cookie 讀?��?始�?
    const cartCookie = useCookie<CartItem[]>('smart_market_cart', { default: () => [] })
    const items = ref<CartItem[]>(cartCookie.value || [])

    // ?��??��??�扣?��?費�?�?
    const discountAmount = ref<number>(0)
    const appliedDiscountCode = ref<string>('')

    // ??�� items 變�?並寫??cookie
    watch(items, (newItems) => {
        cartCookie.value = newItems
    }, { deep: true })

    const c_totalItems = computed(() => {
        return items.value.reduce((acc, item) => acc + item.quantity, 0)
    })

    const c_subtotal = computed(() => {
        return items.value.reduce((acc, item) => {
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : Number(item.product.price)
            return acc + (price * item.quantity)
        }, 0)
    })

    // �?checkout.vue ??cart.vue 使用?�統一變數
    const subtotal = computed(() => c_subtotal.value)
    const shipping = computed(() => items.value.length > 0 ? 5.00 : 0)
    const total = computed(() => {
        const calc = subtotal.value + shipping.value - discountAmount.value
        return calc > 0 ? calc : 0
    })

    function addToCart(product: ApiProduct, quantity: number = 1) {
        const existing = items.value.find(i => i.product.id === product.id)
        if (existing) {
            existing.quantity += quantity
        } else {
            items.value.push({ product, quantity })
        }
    }

    function updateQuantity(productId: number, quantity: number) {
        const existing = items.value.find(i => i.product.id === productId)
        if (existing) {
            existing.quantity = quantity
            if (existing.quantity <= 0) {
                removeFromCart(productId)
            }
        }
    }

    function removeFromCart(productId: number) {
        items.value = items.value.filter(i => i.product.id !== productId)
    }

    function clearCart() {
        items.value = []
    }

    return { items, c_totalItems, c_subtotal, subtotal, shipping, discountAmount, appliedDiscountCode, total, addToCart, updateQuantity, removeFromCart, clearCart }
})

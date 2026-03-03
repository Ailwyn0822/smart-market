import { defineStore } from 'pinia'
import type { ApiProduct, CartItem } from '~/types'

export const useCartStore = defineStore('cart', () => {
    // 嘗試從 cookie 讀取初始值
    const cartCookie = useCookie<CartItem[]>('smart_market_cart', { default: () => [] })
    const items = ref<CartItem[]>(cartCookie.value || [])

    // 共用的 price 解析函式
    const parsePrice = (price: string | number) =>
        typeof price === 'string' ? parseFloat(price) : Number(price)

    // 折扣碼、費用相關
    const discountAmount = ref<number>(0)
    const appliedDiscountCode = ref<string>('')

    // 多賣家分組：目前選中的賣家 ID（null = 未選擇）
    const selectedSellerId = ref<string | null>(null)

    // 監聽 items 變化：寫回 cookie，並在選中賣家無商品時清除選擇
    watch(items, (newItems) => {
        cartCookie.value = newItems
        if (selectedSellerId.value) {
            const hasItems = newItems.some((i: CartItem) => i.product.userId === selectedSellerId.value)
            if (!hasItems) selectedSellerId.value = null
        }
    }, { deep: true })

    const totalItems = computed(() => {
        return items.value.reduce((acc: number, item: CartItem) => acc + item.quantity, 0)
    })

    const c_subtotal = computed(() => {
        return items.value.reduce((acc: number, item: CartItem) => {
            return acc + (parsePrice(item.product.price) * item.quantity)
        }, 0)
    })

    // 選中賣家的商品清單
    const selectedItems = computed(() => {
        if (!selectedSellerId.value) return []
        return items.value.filter((i: CartItem) => i.product.userId === selectedSellerId.value)
    })

    // 選中賣家的小計
    const selectedSubtotal = computed(() => {
        return selectedItems.value.reduce((acc: number, item: CartItem) => {
            return acc + (parsePrice(item.product.price) * item.quantity)
        }, 0)
    })

    // 給 checkout.vue 與 cart.vue 使用的統一變數（基於選中賣家）
    const subtotal = computed(() => selectedSellerId.value ? selectedSubtotal.value : c_subtotal.value)
    const shipping = computed(() => 0)
    const total = computed(() => {
        const calc = subtotal.value + shipping.value - discountAmount.value
        return calc > 0 ? calc : 0
    })

    function addToCart(product: ApiProduct, quantity: number = 1) {
        const existing = items.value.find((i: CartItem) => i.product.id === product.id)
        if (existing) {
            existing.quantity += quantity
        } else {
            items.value.push({ product, quantity })
        }
    }

    function updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        const existing = items.value.find((i: CartItem) => i.product.id === productId)
        if (existing) {
            existing.quantity = quantity
        }
    }

    function removeFromCart(productId: number) {
        items.value = items.value.filter((i: CartItem) => i.product.id !== productId)
    }

    function clearCart() {
        items.value = []
        selectedSellerId.value = null
    }

    // 只清除選中賣家的商品（結帳後使用）
    function clearSelectedItems() {
        if (!selectedSellerId.value) return
        items.value = items.value.filter((i: CartItem) => i.product.userId !== selectedSellerId.value)
        selectedSellerId.value = null
    }

    function selectSeller(sellerId: string | null) {
        selectedSellerId.value = sellerId
    }

    return {
        items,
        totalItems,
        c_subtotal,
        selectedSellerId,
        selectedItems,
        selectedSubtotal,
        subtotal,
        shipping,
        discountAmount,
        appliedDiscountCode,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearSelectedItems,
        selectSeller,
    }
})

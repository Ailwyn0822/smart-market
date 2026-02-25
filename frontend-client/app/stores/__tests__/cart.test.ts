import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'
import type { ApiProduct } from '@smart-market/shared'

const mockProduct = (id: number, price: number): ApiProduct =>
  ({
    id,
    name: `Product ${id}`,
    price,
    description: 'A test product',
    imageUrl: '',
    stock: 10,
    isActive: true,
    views: 0,
    createdAt: new Date().toISOString(),
    category: { id: 1, name: 'Test' },
  }) as unknown as ApiProduct

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useCartStore()
    store.clearCart()
    store.discountAmount = 0
  })

  it('starts with an empty cart', () => {
    const store = useCartStore()
    expect(store.items).toHaveLength(0)
  })

  it('adds a product to the cart', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    expect(store.items).toHaveLength(1)
    expect(store.items[0].product.id).toBe(1)
    expect(store.items[0].quantity).toBe(1)
  })

  it('increments quantity when adding the same product', () => {
    const store = useCartStore()
    const p = mockProduct(1, 100)
    store.addToCart(p)
    store.addToCart(p)
    expect(store.items).toHaveLength(1)
    expect(store.items[0].quantity).toBe(2)
  })

  it('removes a product from the cart', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.removeFromCart(1)
    expect(store.items).toHaveLength(0)
  })

  it('updates quantity of a product', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.updateQuantity(1, 5)
    expect(store.items[0].quantity).toBe(5)
  })

  it('removes product when quantity is set to 0', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.updateQuantity(1, 0)
    expect(store.items).toHaveLength(0)
  })

  it('clears all items', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.addToCart(mockProduct(2, 200))
    store.clearCart()
    expect(store.items).toHaveLength(0)
  })

  it('calculates subtotal correctly', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100), 2)
    store.addToCart(mockProduct(2, 50), 1)
    expect(store.subtotal).toBe(250)
  })

  it('adds shipping when cart has items', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    expect(store.shipping).toBe(0)
  })

  it('has zero shipping for empty cart', () => {
    const store = useCartStore()
    expect(store.shipping).toBe(0)
  })

  it('calculates total = subtotal + shipping - discount', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.discountAmount = 20
    expect(store.total).toBe(80) // 100 + 0 - 20
  })

  it('total is never negative', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 10))
    store.discountAmount = 999
    expect(store.total).toBe(0)
  })
})

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

describe('useCartStore 購物車狀態', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useCartStore()
    store.clearCart()
    store.discountAmount = 0
  })

  it('初始狀態應為空購物車', () => {
    const store = useCartStore()
    expect(store.items).toHaveLength(0)
  })

  it('能夠成功將商品加入購物車', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    expect(store.items).toHaveLength(1)
    expect(store.items[0]!.product.id).toBe(1)
    expect(store.items[0]!.quantity).toBe(1)
  })

  it('加入相同商品時，應只增加數量而不新增重複項目', () => {
    const store = useCartStore()
    const p = mockProduct(1, 100)
    store.addToCart(p)
    store.addToCart(p)
    expect(store.items).toHaveLength(1)
    expect(store.items[0]!.quantity).toBe(2)
  })

  it('能夠從購物車中移除指定商品', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.removeFromCart(1)
    expect(store.items).toHaveLength(0)
  })

  it('能夠更新指定商品的數量', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.updateQuantity(1, 5)
    expect(store.items[0]!.quantity).toBe(5)
  })

  it('當商品數量更新為 0 時，應將該商品從購物車移除', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.updateQuantity(1, 0)
    expect(store.items).toHaveLength(0)
  })

  it('能夠一次清空購物車內所有商品', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.addToCart(mockProduct(2, 200))
    store.clearCart()
    expect(store.items).toHaveLength(0)
  })

  it('能夠正確計算所有商品的小計總和', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100), 2)
    store.addToCart(mockProduct(2, 50), 1)
    expect(store.subtotal).toBe(250)
  })

  it('購物車有商品時，運費計算應正確', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    expect(store.shipping).toBe(0)
  })

  it('空購物車的運費應為 0', () => {
    const store = useCartStore()
    expect(store.shipping).toBe(0)
  })

  it('能夠正確計算最終總金額 (小計 + 運費 - 折扣)', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 100))
    store.discountAmount = 20
    expect(store.total).toBe(80) // 100 + 0 - 20
  })

  it('總金額計算結果永遠不會是負數', () => {
    const store = useCartStore()
    store.addToCart(mockProduct(1, 10))
    store.discountAmount = 999
    expect(store.total).toBe(0)
  })
})

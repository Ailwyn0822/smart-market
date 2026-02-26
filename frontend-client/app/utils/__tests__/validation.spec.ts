import { describe, it, expect } from 'vitest'
import { validateProductForm } from '../validation'

describe('validateProductForm', () => {
    it('表單資料齊全時應該回傳 isValid: true', () => {
        const formData = {
            name: '測試商品',
            description: '這是一個測試商品',
            categoryId: 1,
            price: '100',
            imageUrl: 'https://example.com/image.jpg'
        }
        const result = validateProductForm(formData)
        expect(result.isValid).toBe(true)
        expect(result.errors.length).toBe(0)
    })

    it('缺少名稱時應該回傳錯誤', () => {
        const formData = {
            name: '',
            description: '這是一個測試商品',
            categoryId: 1,
            price: '100',
            imageUrl: 'https://example.com/image.jpg'
        }
        const result = validateProductForm(formData)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain('name')
    })

    it('價格為 0 或更低時應該回傳錯誤', () => {
        const formData = {
            name: '測試商品',
            description: '這是一個測試商品',
            categoryId: 1,
            price: '-10',
            imageUrl: 'https://example.com/image.jpg'
        }
        const result = validateProductForm(formData)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain('price')
    })

    it('多個欄位缺漏時會一次回報所有錯誤', () => {
        const formData = {
            name: '',
            description: '',
            categoryId: 1,
            price: '0',
            imageUrl: ''
        }
        const result = validateProductForm(formData)
        expect(result.isValid).toBe(false)
        expect(result.errors).toEqual(['name', 'description', 'price', 'imageUrl'])
    })
})

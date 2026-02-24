import type { ApiCategory } from './category'

// API 返回的商品資訊
export interface ApiProduct {
  id: number
  name: string
  price: number
  description: string
  condition: string
  stock: number
  imageUrl: string
  isActive: boolean
  views: number
  categoryId: number | null
  category: ApiCategory | null
  userId: string | null
  createdAt: string
}

// 建立商品請求（POST /products）
export interface CreateProductRequest {
  name: string
  description: string
  price: number
  categoryId: number
  condition?: string
  stock?: number
  imageUrl: string
}

// 更新商品請求（PATCH /products/:id）
export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  categoryId?: number
  condition?: string
  stock?: number
  imageUrl?: string
}

// 查詢商品參數（GET /products?keyword=&category=）
export interface ProductQueryParams {
  keyword?: string
  category?: string
}
